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
const SHOP_SHELF_SIZE = 4;
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
/** Today's shelf: 4 jokes for the pupil's level that are not owned yet. */
function ensureShelf() {
  const day = todayIso();
  const grade = currentGrade();
  const owned = new Set(state.jokes.owned);
  if (state.shop.day !== day || state.shop.grade !== grade) {
    const pool = jokesForGrade(grade).filter((joke) => !owned.has(joke.id));
    state.shop = { day, grade, ids: seededShuffle(pool, `${day}|shelf|${grade}`).slice(0, SHOP_SHELF_SIZE).map((joke) => joke.id) };
    saveState();
  }
  state.shop.ids = state.shop.ids.filter((id) => !owned.has(id));
  return state.shop;
}

let lastBoughtJokeId = null;

function buyJoke(id) {
  const joke = JOKES.find((entry) => entry.id === id);
  if (!joke || state.jokes.owned.includes(id)) return;
  const price = jokePrice(joke);
  if (state.gems < price) {
    sfx("bad");
    toast(`Brakuje ${price - state.gems} 💎. Zrób zadanie dnia!`);
    return;
  }
  state.gems -= price;
  state.jokes.owned.push(id);
  lastBoughtJokeId = id;
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

function renderShop() {
  const shelf = ensureShelf();
  const grade = currentGrade();
  const bought = lastBoughtJokeId ? JOKES.find((joke) => joke.id === lastBoughtJokeId) : null;
  const cards = shelf.ids.map((id) => JOKES.find((joke) => joke.id === id)).map((joke) => {
    const price = jokePrice(joke);
    const affordable = state.gems >= price;
    return `
      <article class="shelf-item ${affordable ? "" : "poor"}">
        <div class="shelf-icon">🎁</div>
        <b>Dowcip</b>
        <small class="muted">${price >= 10 ? "długi" : price >= 7 ? "średni" : "krótki"}</small>
        <button class="btn ${affordable ? "primary" : ""}" data-action="buyJoke" data-id="${joke.id}">💎 ${price} – kup</button>
      </article>`;
  }).join("");
  const allOwned = jokesForGrade(grade).every((joke) => state.jokes.owned.includes(joke.id));

  app.innerHTML = `
    <button class="btn ghost" data-action="nav" data-view="rewards">← Nagrody</button>
    <section class="card hero" style="margin-top:12px">
      ${rychuBubble("cheer", "Witaj w sklepiku! Za klejnoty kupisz dowcipy – nowe półki codziennie.", 84)}
      <div class="badges"><span class="badge">💎 Masz: ${state.gems}</span><span class="badge">😄 Dowcipy: ${state.jokes.owned.length}</span></div>
    </section>
    ${bought ? jokeCardHtml(bought, true) : ""}
    <section class="card">
      <h2>Półka dnia</h2>
      ${cards ? `<div class="shelf">${cards}</div>` : `<p class="muted">${allOwned ? "Masz już wszystkie dowcipy z tego poziomu. Brawo! 🎉" : "Półka jest na dziś pusta – wróć jutro."}</p>`}
      <p class="muted small">Klejnoty zdobywasz za <b>Zadanie dnia</b>. Dowcipy są po angielsku (w klasach 0–2 po polsku), z przyciskiem tłumaczenia.</p>
      <div class="row"><button class="btn" data-action="openJokes">😄 Moje dowcipy (${state.jokes.owned.length})</button><button class="btn" data-action="openCalendar">📅 Kalendarz nagród</button></div>
    </section>`;
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
  app.innerHTML = `
    <section class="card hero">
      ${rychuBubble("cheer", "Tu zbierasz nagrody! Klejnoty dostajesz za Zadanie dnia, a w sklepiku kupisz za nie dowcipy.", 84)}
      <div class="badges"><span class="badge">💎 ${state.gems}</span><span class="badge">🔥 Seria: ${currentStreak()}</span><span class="badge">😄 ${state.jokes.owned.length}</span></div>
    </section>
    <section class="grid reward-tiles">
      <button class="reward-tile" data-action="openShop"><span class="ico">🛍️</span><b>Sklepik</b><small>Kup dowcipy za klejnoty</small></button>
      <button class="reward-tile" data-action="openCalendar"><span class="ico">📅</span><b>Kalendarz</b><small>Odebrane nagrody: ${rewardDays} dni w tym miesiącu</small></button>
      <button class="reward-tile" data-action="openJokes"><span class="ico">😄</span><b>Moje dowcipy</b><small>${state.jokes.owned.length} w kolekcji</small></button>
    </section>
    <section class="card daily-task-card">${dailyTaskHtml(dailyGoal(), answersToday())}</section>`;
}
