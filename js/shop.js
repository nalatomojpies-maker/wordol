"use strict";

/**
 * Daily task (a few random exercises rewarded with gems 💎), the shop where gems buy jokes,
 * the "Moje dowcipy" collection and the reward calendar.
 */
const DAILY_QUESTIONS = 5;
const DAILY_MAX_EXERCISES = 3;
const DAILY_GEMS_PER_EXERCISE_MAX = 3;
const DAILY_BONUS_GEMS = 3;
const DAILY_STREAK_BONUS_MAX = 3;
const MONTH_NAMES = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
const WEEKDAY_NAMES = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

// ====================================================================
// Daily task
// ====================================================================
function isModePlayable(modeId) {
  const needed = modeId === "memory" || modeId === "match" ? 2 : 1;
  return modesForGrade().some((mode) => mode.id === modeId) && candidatesFor(modeId).length >= needed &&
    !((modeId === "listen" || modeId === "listenpick") && !speechAvailable());
}

/** Today's task: up to 3 different random exercises (the same set all day), suited to class, level and sound setting. */
function ensureDailyTask() {
  const day = todayIso();
  const grade = currentGrade();
  const task = state.daily;
  const playable = modesForGrade().map((mode) => mode.id).filter(isModePlayable);
  const isStale = task.day !== day || (!task.done && task.results.length === 0 && (task.grade !== grade || task.modes.some((id) => !playable.includes(id))));
  if (isStale) {
    state.daily = { day, grade, modes: seededShuffle(playable, `${day}|${grade}`).slice(0, DAILY_MAX_EXERCISES), results: [], done: false };
    saveState();
  }
  return state.daily;
}

const exerciseGems = (percent) => (percent >= 85 ? 3 : percent >= 50 ? 2 : 1);
const dailyMaxGems = (task) => task.modes.length * DAILY_GEMS_PER_EXERCISE_MAX + DAILY_BONUS_GEMS + DAILY_STREAK_BONUS_MAX;

function startDailyTask() {
  const task = ensureDailyTask();
  if (task.modes.length === 0) {
    toast("Brak materiału do zadania dnia – zmień zbiory lub filtr słów.");
    return;
  }
  if (task.done) {
    toast("Zadanie dnia już wykonane – jutro czeka nowe! 💎");
    return;
  }
  workout = { queue: task.modes.filter((id) => !task.results.some((entry) => entry.mode === id)), results: [], daily: true };
  startNextWorkoutBlock();
}

/** Called when a daily exercise is finished: pays gems, and the bonus + calendar entry after the last one. */
function recordDailyResult(finishedSession) {
  const task = ensureDailyTask();
  if (task.done || finishedSession.done < finishedSession.items.length) return;
  const gems = exerciseGems(finishedSession.percent);
  task.results.push({ mode: finishedSession.mode, percent: finishedSession.percent, gems });
  state.gems += gems;
  let bonus = 0;
  if (task.results.length >= task.modes.length) {
    task.done = true;
    bonus = DAILY_BONUS_GEMS + Math.min(currentStreak(), DAILY_STREAK_BONUS_MAX);
    state.gems += bonus;
    state.calendar[todayIso()] = { gems: task.results.reduce((sum, entry) => sum + entry.gems, 0) + bonus, at: Date.now() };
  }
  finishedSession.gemsEarned = gems + bonus;
  finishedSession.dailyBonus = bonus;
  finishedSession.dailyDone = task.done;
  saveState();
}

// ====================================================================
// Shop
// ====================================================================
/** Rewards still to win, each kind in a fixed order for the class (shuffled once, so it does not change day to day). */
function shopQueue(grade) {
  const jokes = seededShuffle(jokesForGrade(grade), `shop|jokes|${grade}`).filter((joke) => !state.jokes.owned.includes(joke.id));
  const riddles = seededShuffle(riddlesForGrade(grade), `shop|riddles|${grade}`).filter((riddle) => !state.riddles.owned.includes(riddle.id));
  const games = GAMES.filter((game) => !isGameOwned(game.id)); // games unlock in this order
  return { jokes, riddles, games };
}

let lastBoughtRiddleId = null;

/** Checks the slow unlocking; tells the pupil how many exercises are still needed. */
function rewardUnlocked(type, ownedCount) {
  if (canUnlockMore(type, ownedCount)) return true;
  const missing = exercisesUntilUnlocked(type, ownedCount + 1);
  sfx("bad");
  toast(`🔒 Odblokujesz za ${missing} ${exercisesWord(missing)}.`);
  return false;
}

function buyRiddle(id) {
  const riddle = RIDDLES.find((entry) => entry.id === id);
  if (!riddle || state.riddles.owned.includes(id)) return;
  if (!rewardUnlocked("riddle", state.riddles.owned.length)) return;
  if (state.gems < JOKE_PRICE) {
    sfx("bad");
    toast(`Brakuje ${JOKE_PRICE - state.gems} 💎. Zrób zadanie dnia!`);
    return;
  }
  state.gems -= JOKE_PRICE;
  state.riddles.owned.push(id);
  lastBoughtRiddleId = id;
  lastBoughtJokeId = null;
  saveState();
  sfx("badge");
  renderShop();
}

let lastBoughtJokeId = null;

function buyJoke(id) {
  const joke = JOKES.find((entry) => entry.id === id);
  if (!joke || state.jokes.owned.includes(id)) return;
  if (!rewardUnlocked("joke", state.jokes.owned.length)) return;
  const price = jokePrice(joke);
  if (state.gems < price) {
    sfx("bad");
    toast(`Brakuje ${price - state.gems} 💎. Zrób zadanie dnia!`);
    return;
  }
  state.gems -= price;
  state.jokes.owned.push(id);
  lastBoughtJokeId = id;
  lastBoughtRiddleId = null;
  revealedJokes.add(id);
  saveState();
  sfx("badge");
  renderShop();
}

// ---------- jokes ----------
const revealedJokes = new Set();
const jokeOtherLanguage = new Set();
/** Young pupils read Polish first (English on request); from class 3 English first. */
const primaryJokeLanguage = () => (currentGrade() <= 2 ? "pl" : "en");

function jokeCardHtml(joke, highlight = false) {
  const primary = primaryJokeLanguage();
  const language = jokeOtherLanguage.has(joke.id) ? (primary === "en" ? "pl" : "en") : primary;
  const question = language === "en" ? joke.enQuestion : joke.plQuestion;
  const answer = language === "en" ? joke.enAnswer : joke.plAnswer;
  const revealed = revealedJokes.has(joke.id);
  return `
    <article class="joke-card ${highlight ? "new" : ""}">
      ${highlight ? `<div class="joke-new">🎉 Nowy dowcip!</div>` : ""}
      <p class="joke-q">${esc(question)}</p>
      ${revealed ? `<p class="joke-a">${esc(answer)}</p>` : `<button class="btn" data-action="revealJoke" data-id="${joke.id}">😄 Pokaż puentę</button>`}
      <div class="row joke-tools">
        <button class="btn ghost" data-action="jokeLang" data-id="${joke.id}">🌐 ${language === "en" ? "Pokaż po polsku" : "Show in English"}</button>
        ${speechAvailable() ? `<button class="speak" data-action="speakJoke" data-id="${joke.id}" aria-label="Przeczytaj po angielsku">🔊</button>` : ""}
      </div>
    </article>`;
}

function speakJoke(id) {
  const joke = JOKES.find((entry) => entry.id === id);
  if (joke) speak(`${joke.enQuestion} ... ${joke.enAnswer}`);
}

/** A locked shelf item: opens after more finished exercises. */
function lockedItemHtml(icon, title, missing) {
  return `
    <article class="shelf-item locked">
      <div class="shelf-icon">🔒</div>
      <b>${esc(title)}</b>
      <small class="muted">${icon} odblokujesz za ${missing} ${exercisesWord(missing)}</small>
      <button class="btn" disabled>Zablokowane</button>
    </article>`;
}

/** One item on a shop shelf. */
function shelfItemHtml(icon, title, subtitle, price, action, id) {
  const affordable = state.gems >= price;
  return `
    <article class="shelf-item ${affordable ? "" : "poor"}">
      <div class="shelf-icon">${icon}</div>
      <b>${esc(title)}</b>
      <small class="muted">${esc(subtitle)}</small>
      <button class="btn ${affordable ? "primary" : ""}" data-action="${action}" data-id="${id}">💎 ${price} – kup</button>
    </article>`;
}

function renderShop() {
  const grade = currentGrade();
  const queue = shopQueue(grade);
  const boughtJoke = lastBoughtJokeId ? JOKES.find((joke) => joke.id === lastBoughtJokeId) : null;
  const boughtRiddle = lastBoughtRiddleId ? RIDDLES.find((riddle) => riddle.id === lastBoughtRiddleId) : null;
  /** A hidden reward: nobody knows what is inside until it is bought. Beyond what is unlocked so far it shows a padlock. */
  const card = (type, title, icon, price, action, id, needed) => (state.testUnlock || needed <= unlockedCount(type)
    ? shelfItemHtml("🎁", title, "niespodzianka", price, action, id)
    : lockedItemHtml(icon, title, exercisesUntilUnlocked(type, needed)));
  const jokeCards = queue.jokes.map((joke, index) => card("joke", "Dowcip", "😄", JOKE_PRICE, "buyJoke", joke.id, state.jokes.owned.length + index + 1));
  const riddleCards = queue.riddles.map((riddle, index) => card("riddle", "Zagadka", "🧩", JOKE_PRICE, "buyRiddle", riddle.id, state.riddles.owned.length + index + 1));
  const gameCards = queue.games.map((game) => card("game", "Gierka", "🎮", GAME_PRICE, "buyGame", game.id, gameIndex(game.id) + 1));
  /** Order: joke, riddle, game, joke, riddle, game… (when one kind runs out, the others go on). */
  const cards = [];
  for (let i = 0; i < Math.max(jokeCards.length, riddleCards.length, gameCards.length); i++) {
    if (jokeCards[i]) cards.push(jokeCards[i]);
    if (riddleCards[i]) cards.push(riddleCards[i]);
    if (gameCards[i]) cards.push(gameCards[i]);
  }

  app.innerHTML = `
    <button class="btn ghost" data-action="nav" data-view="rewards">← Nagrody</button>
    <section class="card hero" style="margin-top:12px">
      ${rychuBubble("cheer", "Witaj w sklepiku! Co jest w środku? Nie powiem – to niespodzianka! Kupione nagrody znajdziesz w dziale Nagrody.", 84)}
      <div class="badges"><span class="badge">💎 Masz: ${state.gems}</span><span class="badge">😄 ${state.jokes.owned.length}</span><span class="badge">🧩 ${state.riddles.owned.length}</span><span class="badge">🎮 ${state.games.owned.length}</span></div>
    </section>
    ${boughtJoke ? jokeCardHtml(boughtJoke, true) : ""}
    ${boughtRiddle ? riddleCardHtml(boughtRiddle, true) : ""}
    <section class="card">
      ${cards.length ? `<div class="shelf">${cards.join("")}</div>` : `<p class="muted">Masz już wszystkie nagrody z tego poziomu. Brawo! 🏆</p>`}
      <p class="muted small">Klejnoty zdobywasz za <b>Zadanie dnia</b>. Kolejne nagrody odblokowują się, gdy robisz ćwiczenia. Gierkę kupujesz raz – po każdym zagraniu ładuje się i znów zagrasz po ${GAME_RECHARGE_EXERCISES} ukończonych ćwiczeniach.</p>
    </section>`;
}

// ---------- riddles ----------
const RIDDLE_KIND_NAMES = { logic: "logiczna", maths: "matematyczna", english: "po angielsku", nature: "przyrodnicza" };
const revealedRiddles = new Set();

function riddleCardHtml(riddle, highlight = false) {
  const revealed = revealedRiddles.has(riddle.id);
  return `
    <article class="joke-card riddle-card ${highlight ? "new" : ""}">
      ${highlight ? `<div class="joke-new">🎉 Nowa zagadka!</div>` : ""}
      <p class="riddle-kind">${RIDDLE_KIND_ICONS[riddle.kind] || "🧩"} Zagadka ${esc(RIDDLE_KIND_NAMES[riddle.kind] || "")}</p>
      <p class="joke-q">${esc(riddle.question)}</p>
      ${revealed
        ? `<p class="joke-a">${esc(riddle.answer)}</p>${riddle.why ? `<p class="muted small">💡 ${esc(riddle.why)}</p>` : ""}`
        : `<button class="btn" data-action="revealRiddle" data-id="${riddle.id}">🤔 Pokaż odpowiedź</button>`}
    </article>`;
}

function renderRiddles() {
  const owned = [...state.riddles.owned].reverse().map((id) => RIDDLES.find((riddle) => riddle.id === id)).filter(Boolean);
  app.innerHTML = `
    <button class="btn ghost" data-action="nav" data-view="rewards">← Nagrody</button>
    <section class="card hero" style="margin-top:12px">${rychuBubble("happy", owned.length ? "Twoje zagadki. Najpierw pomyśl, dopiero potem zajrzyj do odpowiedzi!" : "Jeszcze nie masz zagadek – kupisz je w sklepiku.", 84)}</section>
    ${owned.length ? owned.map((riddle) => riddleCardHtml(riddle)).join("") : `<section class="card"><p class="muted">Kolekcja jest pusta.</p><button class="btn primary" data-action="openShop">🛍️ Do sklepiku</button></section>`}`;
}

// ---------- games ----------
function gameTileHtml(game) {
  if (!isGameOwned(game.id) && !state.testUnlock && !isGameUnlocked(game.id)) {
    const missing = exercisesUntilUnlocked("game", gameIndex(game.id) + 1);
    return `
      <article class="game-tile locked">
        <span class="game-tile-icon">🔒</span><b>${esc(game.name)}</b><small class="muted">${esc(game.desc)}</small>
        <small>Odblokujesz za ${missing} ${exercisesWord(missing)}</small>
      </article>`;
  }
  const best = bestScore(game.id);
  const record = best === null ? "" : `<small class="game-best">🏆 Rekord: ${best}</small>`;
  if (!isGameOwned(game.id) && !state.testUnlock) {
    return `
      <article class="game-tile locked">
        <span class="game-tile-icon">${game.icon}</span><b>${esc(game.name)}</b><small class="muted">${esc(game.desc)}</small>
        <button class="btn ${state.gems >= GAME_PRICE ? "primary" : ""}" data-action="buyGame" data-id="${game.id}">💎 ${GAME_PRICE} – kup</button>
      </article>`;
  }
  const missing = exercisesToRecharge(game.id);
  const charge = Math.round(((GAME_RECHARGE_EXERCISES - missing) / GAME_RECHARGE_EXERCISES) * 100);
  return `
    <article class="game-tile ${missing ? "charging" : "ready"}">
      <span class="game-tile-icon">${game.icon}</span><b>${esc(game.name)}</b><small class="muted">${esc(game.desc)}</small>${record}
      ${missing
        ? `<div class="charge" title="Ładowanie"><div style="width:${charge}%"></div></div><small>🔋 Jeszcze ${missing} ${missing === 1 ? "ćwiczenie" : "ćwiczenia"}</small>`
        : `<button class="btn primary" data-action="playGame" data-id="${game.id}">▶ Graj</button>`}
    </article>`;
}

function renderGamesList() {
  const ownedCount = state.games.owned.length;
  app.innerHTML = `
    <button class="btn ghost" data-action="nav" data-view="rewards">← Nagrody</button>
    <section class="card hero" style="margin-top:12px">
      ${rychuBubble("cheer", ownedCount ? "Twoje gierki! Po każdym zagraniu gierka ładuje się – zrób 3 ćwiczenia i grasz znowu." : "Tu będą Twoje gierki. Kup pierwszą za klejnoty!", 84)}
      <div class="badges"><span class="badge">💎 ${state.gems}</span><span class="badge">🎮 ${ownedCount}</span>${state.testUnlock ? `<span class="badge">🧪 tryb testowy</span>` : ""}</div>
    </section>
    ${ownedCount || state.testUnlock ? `<section class="grid game-tiles">${GAMES.filter((game) => state.testUnlock || isGameOwned(game.id)).map(gameTileHtml).join("")}</section>` : `<section class="card"><p class="muted">Kolekcja jest pusta.</p><button class="btn primary" data-action="openShop">🛍️ Do sklepiku</button></section>`}
    ${scoreboardHtml()}`;
}

/** Scoreboard under the games: the best results of this profile in every game it has played. */
function scoreboardHtml() {
  const played = GAMES.filter((game) => state.games.scores[game.id] && state.games.scores[game.id].length);
  const medals = ["🥇", "🥈", "🥉", "4.", "5."];
  const formatDay = (iso) => iso.split("-").reverse().join(".");
  return `
    <h2 class="section-title" id="scoreboard">🏆 Tablica wyników</h2>
    ${played.length ? `<section class="grid score-grid">${played.map((game) => `
      <section class="card score-card">
        <h3>${game.icon} ${esc(game.name)}</h3>
        <ol class="scores">${state.games.scores[game.id].map((entry, index) =>
          `<li><span class="medal-place">${medals[index]}</span><b>${entry.s} pkt</b><small class="muted">${formatDay(entry.d)}</small></li>`).join("")}</ol>
      </section>`).join("")}</section>`
      : `<section class="card"><p class="muted">Zagraj w jakąś gierkę – tu pojawią się Twoje rekordy.</p></section>`}`;
}

function renderJokes() {
  const owned = [...state.jokes.owned].reverse().map((id) => JOKES.find((joke) => joke.id === id)).filter(Boolean);
  app.innerHTML = `
    <button class="btn ghost" data-action="openShop">← Sklepik</button>
    <section class="card hero" style="margin-top:12px">${rychuBubble("happy", owned.length ? "Twoja kolekcja dowcipów. Opowiedz je komuś!" : "Jeszcze nic nie kupiłeś – zajrzyj do sklepiku!", 84)}</section>
    ${owned.length ? owned.map((joke) => jokeCardHtml(joke)).join("") : `<section class="card"><p class="muted">Kolekcja jest pusta.</p><button class="btn primary" data-action="openShop">🛍️ Do sklepiku</button></section>`}`;
}

// ====================================================================
// Calendar of received daily-task rewards
// ====================================================================
let calendarMonth = null;

function renderCalendar() {
  const now = new Date();
  if (!calendarMonth) calendarMonth = { year: now.getFullYear(), month: now.getMonth() };
  const { year, month } = calendarMonth;
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = todayIso(now);
  let rewardDays = 0;
  let rewardGems = 0;
  const cells = [];
  for (let blank = 0; blank < firstWeekday; blank++) cells.push(`<div class="cal-day empty"></div>`);
  for (let day = 1; day <= daysInMonth; day++) {
    const key = todayIso(new Date(year, month, day));
    const entry = state.calendar[key];
    if (entry) {
      rewardDays++;
      rewardGems += entry.gems;
    }
    const classes = ["cal-day", entry ? "got" : "", key === todayKey ? "today" : "", key > todayKey ? "future" : ""].join(" ");
    cells.push(`<div class="${classes}" ${entry ? `title="Odebrano ${entry.gems} klejnotów"` : ""}><span class="n">${day}</span>${entry ? `<span class="tick">✅</span><small>+${entry.gems}💎</small>` : ""}</div>`);
  }
  app.innerHTML = `
    <button class="btn ghost" data-action="nav" data-view="rewards">← Nagrody</button>
    <section class="card" style="margin-top:12px">
      <div class="cal-head">
        <button class="btn round" data-action="calMonth" data-dir="-1" aria-label="Poprzedni miesiąc">‹</button>
        <h2>${MONTH_NAMES[month]} ${year}</h2>
        <button class="btn round" data-action="calMonth" data-dir="1" aria-label="Następny miesiąc">›</button>
      </div>
      <div class="cal-grid">
        ${WEEKDAY_NAMES.map((name) => `<div class="cal-wd">${name}</div>`).join("")}
        ${cells.join("")}
      </div>
      <p class="muted small">✅ = nagroda za Zadanie dnia odebrana. W tym miesiącu: <b>${rewardDays}</b> dni, <b>${rewardGems}</b> 💎. Seria dni: <b>${currentStreak()}</b> 🔥</p>
      <div class="row"><button class="btn" data-action="calToday">Dziś</button><button class="btn" data-action="openShop">🛍️ Sklepik</button></div>
    </section>`;
}

/** Home screen block: today's exercises as chips, reward info and shortcuts to the shop and the calendar. */
function dailyTaskHtml(goal, answersCount) {
  const task = ensureDailyTask();
  const steps = task.modes.map((id) => {
    const mode = modeById(id);
    const isDone = task.results.some((entry) => entry.mode === id);
    return `<span class="dt-step ${isDone ? "done" : ""}" title="${esc(mode.name)}">${isDone ? "✅" : mode.icon}</span>`;
  }).join("");
  const description = task.done
    ? "Wykonane! Nagroda odebrana – wróć jutro po nowe."
    : task.modes.length > 0
      ? `${task.modes.length} ćwiczenia po ${DAILY_QUESTIONS} pytań. Nagroda: do ${dailyMaxGems(task)} 💎.`
      : "Brak materiału – zmień zbiory lub filtr słów.";
  const label = task.done ? "✅ Wykonane" : task.results.length > 0 ? "▶ Kontynuuj zadanie" : "▶ Zacznij zadanie dnia";
  return `
    <h2>🎯 Zadanie dnia</h2>
    <p class="muted">${description}</p>
    <div class="dt-steps">${steps}</div>
    <p class="muted small">Cel dnia: ${Math.min(answersCount, goal)}/${goal} odpowiedzi</p>
    <button class="btn primary big" data-action="startDaily" ${task.done || task.modes.length === 0 ? "disabled" : ""}>${label}</button>
    <div class="row dt-links">
      <button class="btn" data-action="openShop">🛍️ Sklepik</button>
      <button class="btn" data-action="openCalendar">📅 Kalendarz</button>
      <button class="link" data-action="startExtra">Dodatkowy trening</button>
    </div>`;
}

// ====================================================================
// Rewards hub (main menu tab "Nagrody")
// ====================================================================
function renderRewards() {
  const monthPrefix = todayIso().slice(0, 7);
  const rewardDays = Object.keys(state.calendar).filter((key) => key.startsWith(monthPrefix)).length;
  const nextUnlockIn = UNLOCK_EVERY_EXERCISES - (state.games.exercises % UNLOCK_EVERY_EXERCISES);
  app.innerHTML = `
    <section class="card hero">
      ${rychuBubble("cheer", "Tu zbierasz nagrody! Klejnoty dostajesz za Zadanie dnia, a w sklepiku kupisz za nie dowcipy, zagadki i gierki.", 84)}
      <div class="badges"><span class="badge">💎 ${state.gems}</span><span class="badge">🔥 Seria: ${currentStreak()}</span><span class="badge" title="Co ${UNLOCK_EVERY_EXERCISES} ukończone ćwiczenia odblokowują się ${UNLOCK_PER_STEP} nowe nagrody">🔓 Nowe nagrody za ${nextUnlockIn} ${exercisesWord(nextUnlockIn)}</span></div>
    </section>
    <section class="grid reward-tiles">
      <button class="reward-tile" data-action="openShop"><span class="ico">🛍️</span><b>Sklepik</b><small>Dowcipy i zagadki po ${JOKE_PRICE} 💎, gierki po ${GAME_PRICE} 💎</small></button>
      <button class="reward-tile" data-action="openGames"><span class="ico">🎮</span><b>Moje gierki</b><small>${state.games.owned.length} z ${GAMES.length}${GAMES.some((game) => isGameOwned(game.id) && isGameReady(game.id)) ? " · możesz zagrać!" : ""}</small></button>
      <button class="reward-tile" data-action="openJokes"><span class="ico">😄</span><b>Moje dowcipy</b><small>${state.jokes.owned.length} w kolekcji</small></button>
      <button class="reward-tile" data-action="openRiddles"><span class="ico">🧩</span><b>Moje zagadki</b><small>${state.riddles.owned.length} w kolekcji</small></button>
      <button class="reward-tile" data-action="openCalendar"><span class="ico">📅</span><b>Kalendarz</b><small>Odebrane nagrody: ${rewardDays} dni w tym miesiącu</small></button>
    </section>
    <section class="card daily-task-card">${dailyTaskHtml(dailyGoal(), answersToday())}</section>`;
}
