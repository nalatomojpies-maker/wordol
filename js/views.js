"use strict";

let view = state.settings.onboarded ? "home" : "welcome";
const app = $("#app");
let greetingText = null;
let showTrainingOptions = false;
let welcomeDraft = { grade: state.settings.grade };

function applyTheme() {
  document.documentElement.dataset.theme = state.settings.theme;
  const theme = THEMES.find((entry) => entry.id === state.settings.theme);
  const meta = $('meta[name="theme-color"]');
  if (meta && theme) meta.content = theme.color;
  document.body.classList.toggle("kids", isKidsMode());
  document.body.dataset.grade = String(currentGrade());
}

function activeNavFor(currentView) {
  if (["rewards", "shop", "jokes", "calendar", "riddles", "games", "game"].includes(currentView)) return "rewards";
  if (currentView === "add") return "settings";
  const inPath = ["learn", "unit", "step"].includes(currentView) ||
    ((currentView === "session" || currentView === "result") && session && session.mode === "lessonTest");
  if (inPath) return "learn";
  return currentView === "session" || currentView === "result" ? "home" : currentView;
}

/** Draws the current view. keepScroll = stay at the same place (e.g. while ticking topics in the options). */
function render(keepScroll = false) {
  const scrollY = window.scrollY;
  stopActiveGame();
  applyTheme();
  if (view !== "add") {
    labOpen = false;
    labUnlocked = false;
  }
  document.body.classList.toggle("no-nav", view === "welcome");
  document.querySelectorAll(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeNavFor(view));
  });
  const renderers = {
    welcome: renderWelcome, home: renderHome, learn: renderLearn, unit: renderUnit, step: renderStepCard, add: renderAdd,
    stats: renderStats, settings: renderSettings, session: renderSessionFrame, result: renderResult,
    rewards: renderRewards, shop: renderShop, jokes: renderJokes, calendar: renderCalendar,
    riddles: renderRiddles, games: renderGamesList, game: renderGame,
  };
  renderers[view]();
  if (view !== "session" && view !== "game") app.insertAdjacentHTML("beforeend", footerHtml());
  scheduleSupportCheck();
  setTimeout(maybeShowQuietNotice, 700);
  setMusicForView(view);
  updateMusicButton();
  window.scrollTo(0, keepScroll === true ? scrollY : 0);
}

/** Result screen: sounds (pass / fanfare / badge / daily goal) and a spoken summary. */
function playResultSounds(isStep) {
  const { percent, passed, earned, goalReached } = session;
  setTimeout(() => sfx(isStep && passed ? "pass" : percent >= 85 ? "fanfare" : "click"), 300);
  if (session.gemsEarned) setTimeout(() => sfx("gem"), 700);
  if (goalReached) setTimeout(() => sfx("goal"), 1800);
}

const gradeButtons = (selected, action) => GRADE_INFO.map((info) => `
  <button class="grade-tile ${info.id === selected ? "active" : ""}" data-action="${action}" data-grade="${info.id}">
    <span class="gt-emoji">${info.emoji}</span><b>${info.id === 0 ? "0" : info.id}</b><small>${info.id === 0 ? "zerówka" : "klasa"}</small>
  </button>`).join("");

// ---------- Welcome ----------
function renderWelcome() {
  app.innerHTML = `
    <section class="card welcome">
      <div class="welcome-rychu">${rychuSvg("cheer", 150)}</div>
      <h1>WORD4ALL</h1>
      <div class="bubble center">Cześć! Jestem Rychu, Twój trener angielskich słówek. Jak masz na imię i w której jesteś klasie?</div>
      <label class="field" for="welcomeName">Twoje imię</label>
      <input type="text" id="welcomeName" maxlength="20" value="${esc(state.settings.name)}" placeholder="np. Ola">
      <label class="field">Twoja klasa</label>
      <div class="grade-grid" id="welcomeGrades">${gradeButtons(welcomeDraft.grade, "pickWelcomeGrade")}</div>
      <p class="muted center-text small">Dobiorę ćwiczenia i słówka do Twojego wieku. Klasę zmienisz później w profilu.</p>
      <button class="btn primary big wide" data-action="finishWelcome">Zaczynamy! 🚀</button>
    </section>`;
}

// ---------- Home ----------
/** Exercise groups on the home screen (modes not listed here land in the last group). */
const MODE_GROUPS = [
  { title: "👀 Patrz i słuchaj", ids: ["listenpick", "pictures", "memory", "cards"] },
  { title: "🧩 Ćwicz słówka", ids: ["match", "quiz", "letters", "irregular"] },
  { title: "✍️ Pisz i układaj", ids: ["gaps", "type", "listen", "sentences"] },
];

function groupedModes(modes) {
  const groups = MODE_GROUPS.map((group) => ({ title: group.title, modes: modes.filter((mode) => group.ids.includes(mode.id)) }));
  const known = MODE_GROUPS.flatMap((group) => group.ids);
  groups[groups.length - 1].modes.push(...modes.filter((mode) => !known.includes(mode.id)));
  return groups.filter((group) => group.modes.length > 0);
}

function modeTileHtml(mode) {
  return `
    <button class="mode" style="--c:${mode.color}" data-action="startMode" data-mode="${mode.id}">
      <span class="ico" aria-hidden="true">${mode.icon}</span>
      <span class="mode-text"><strong>${mode.name}</strong><small>${mode.desc}</small></span>
    </button>`;
}

function renderHome() {
  const { settings } = state;
  const grade = currentGrade();
  const level = levelInfo();
  const goal = dailyGoal();
  const today = answersToday();
  const percent = Math.min(100, Math.round((today / goal) * 100));
  greetingText = greetingText || rychuLine(isKidsMode() ? "greetKids" : "greet");
  const groups = groupedModes(modesForGrade());

  app.innerHTML = `
    <section class="card hero compact">
      ${rychuBubble("cheer", greetingText, 64)}
      <div class="badges">
        <span class="badge" title="Poziom">⚡ ${level.level} · ${level.title}</span>
        <span class="badge" title="Seria dni nauki">🔥 ${currentStreak() === 1 ? "1 dzień" : `${currentStreak()} dni`}</span>
        <button class="badge badge-btn" data-action="openShop" title="Klejnoty – sklepik z dowcipami">💎 ${state.gems}</button>
        <button class="badge badge-btn" data-action="nav" data-view="settings" title="Zmień klasę w profilu">${GRADE_INFO[grade].emoji} ${GRADE_INFO[grade].label}</button>
      </div>
      <div class="xp-bar" title="${level.into}/${level.need} XP"><div style="width:${Math.round((level.into / level.need) * 100)}%"></div></div>
    </section>

    <section class="card daily">
      <div class="ring" role="img" aria-label="Zadanie dnia: ${percent}%">
        <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" class="ring-bg"/><circle cx="40" cy="40" r="34" class="ring-fg" stroke-dasharray="${(percent * 213.6) / 100} 213.6"/></svg>
        <span>${percent >= 100 ? "✅" : `${percent}%`}</span>
      </div>
      <div class="daily-text">
        ${dailyTaskHtml(goal, today)}
      </div>
    </section>

    <h2 class="section-title">Wybierz ćwiczenie</h2>
    ${groups.map((group) => `
      <section class="mode-group">
        <h3 class="group-title">${group.title}</h3>
        <div class="grid modes">${group.modes.map(modeTileHtml).join("")}</div>
      </section>`).join("")}

    <section class="card options-card">
      <button class="options-toggle" data-action="toggleOptions" aria-expanded="${showTrainingOptions}">
        <span>⚙️ Ustawienia treningu</span><span aria-hidden="true">${showTrainingOptions ? "▲" : "▼"}</span>
      </button>
      ${showTrainingOptions ? trainingOptionsHtml() : `<p class="muted small">Poziom: <b>${DIFFICULTIES.find((entry) => entry.id === settings.difficulty).name}</b> · Zbiory: <b>${settings.topics.length || "wszystkie"}</b> · Słów: <b>${getPool().length}</b></p>`}
    </section>`;
}

function trainingOptionsHtml() {
  const { settings } = state;
  const grade = currentGrade();
  const words = wordsInScope();
  const hasSentences = modesForGrade().some((mode) => mode.id === "sentences");
  return `
    <h3>Poziom trudności</h3>
    <div class="segmented">
      ${DIFFICULTIES.map((entry) => `<button class="${settings.difficulty === entry.id ? "active" : ""}" data-action="setDifficulty" data-id="${entry.id}">${entry.icon} ${entry.name}</button>`).join("")}
    </div>
    <p class="muted small">${DIFFICULTIES.find((entry) => entry.id === settings.difficulty).hint}</p>
    <div class="row opts-row">
      <div class="grow"><label class="field" for="scopeSelect">Zakres słów</label>
        <select id="scopeSelect" data-setting="wordScope" data-rerender="1">
          <option value="own" ${settings.wordScope === "own" ? "selected" : ""}>Tylko ${esc(GRADE_INFO[grade].label.toLowerCase())}</option>
          <option value="upto" ${settings.wordScope === "upto" ? "selected" : ""}>Od początku do: ${esc(GRADE_INFO[grade].label.toLowerCase())}</option>
        </select></div>
      <div class="grow"><label class="field" for="statusSelect">Które słowa</label>
        <select id="statusSelect" data-setting="status" data-rerender="1">
          ${STATUS_FILTERS.map((entry) => `<option value="${entry.id}" ${settings.status === entry.id ? "selected" : ""}>${entry.name}</option>`).join("")}
        </select></div>
      ${grade >= 4 ? `<div class="grow"><label class="field" for="dirSelect">Kierunek</label>
        <select id="dirSelect" data-setting="direction" data-rerender="1">
          <option value="mix" ${settings.direction === "mix" ? "selected" : ""}>Mieszany</option>
          <option value="pl-en" ${settings.direction === "pl-en" ? "selected" : ""}>Polski → angielski</option>
          <option value="en-pl" ${settings.direction === "en-pl" ? "selected" : ""}>Angielski → polski</option>
        </select></div>` : ""}
    </div>
    <h3>Zbiory tematyczne</h3>
    <div class="topic-grid">
      <button class="topic ${settings.topics.length === 0 ? "active" : ""}" data-action="allTopics"><span class="t-ico">🌈</span><b>Wszystkie</b><small>${words.length} słów</small></button>
      ${topicsInScope().map((topic) => {
        const topicWords = words.filter((word) => word.topic === topic.id);
        const mastered = topicWords.filter(isMastered).length;
        return `<button class="topic ${settings.topics.includes(topic.id) ? "active" : ""}" data-action="toggleTopic" data-id="${topic.id}">
          <span class="t-ico">${topic.icon}</span><b>${esc(topic.name)}</b><small>${topicWords.length} słów · ${mastered} ✔</small></button>`;
      }).join("")}
    </div>
    ${hasSentences ? `<h3>Układanie zdań – wybierz temat</h3>
      <div class="chips">
        <button class="chip ${settings.grammarTopics.length === 0 ? "active" : ""}" data-action="allGrammar">Wszystkie</button>
        ${sentenceUnits().map((unit) => `<button class="chip ${settings.grammarTopics.includes(unit.id) ? "active" : ""}" data-action="toggleGrammar" data-id="${unit.id}">${unit.icon} ${esc(unit.title)}</button>`).join("")}
      </div>` : ""}
    <p class="muted">Wybrano słów: <b>${getPool().length}</b> · długość ćwiczenia: ${sessionLength()}</p>`;
}

// ---------- Settings ----------
function renderSettings() {
  const { settings } = state;
  const lengthOptions = [0, 5, 10, 15, 20, 30];
  const goalOptions = [0, 10, 20, 30, 50];
  app.innerHTML = `
    <section class="card coffee-card">
      <button class="btn primary" data-action="openSupport">☕ Postaw kawę</button>
      <p class="muted small">Program jest w pełni darmowy. Jeśli Ci się podoba, możesz mnie wesprzeć BLIKIEM – to dobrowolne.</p>
    </section>
    <section class="card">
      <h2>Profil</h2>
      <label class="field" for="nameInput">Imię</label>
      <input type="text" id="nameInput" data-setting="name" maxlength="20" value="${esc(settings.name)}" placeholder="Jak masz na imię?">
      <label class="field">Klasa</label>
      <div class="grade-grid">${gradeButtons(currentGrade(), "setGrade")}</div>
      <p class="muted small">Zmiana klasy zmienia zakres słów, dostępne ćwiczenia i ścieżkę nauki.</p>
    </section>
    <section class="card">
      <h2>Moje słowa</h2>
      <p class="muted">Własne słowa (${state.custom.length}) ćwiczysz razem z resztą, w zbiorze „Moje słowa”.</p>
      <button class="btn" data-action="nav" data-view="add">➕ Dodaj lub usuń własne słowa</button>
    </section>
    <section class="card">
      <h2>Motyw</h2>
      <div class="themes">
        ${THEMES.map((theme) => `<button class="theme-btn ${settings.theme === theme.id ? "active" : ""}" data-action="setTheme" data-theme-id="${theme.id}"><i style="background:${theme.color}"></i>${theme.name}</button>`).join("")}
      </div>
    </section>
    <section class="card">
      <h2>Trening</h2>
      <label class="field">Poziom trudności</label>
      <div class="segmented">
        ${DIFFICULTIES.map((entry) => `<button class="${settings.difficulty === entry.id ? "active" : ""}" data-action="setDifficulty" data-id="${entry.id}">${entry.icon} ${entry.name}</button>`).join("")}
      </div>
      <label class="field" for="lengthSelect">Liczba pytań w ćwiczeniu</label>
      <select id="lengthSelect" data-setting="sessionLength">
        ${lengthOptions.map((n) => `<option value="${n}" ${settings.sessionLength === n ? "selected" : ""}>${n === 0 ? `Automatycznie (${SESSION_LENGTH_BY_GRADE[currentGrade()]})` : n}</option>`).join("")}
      </select>
      <label class="field" for="goalSelect">Dzienny cel (odpowiedzi)</label>
      <select id="goalSelect" data-setting="dailyGoal">
        ${goalOptions.map((n) => `<option value="${n}" ${settings.dailyGoal === n ? "selected" : ""}>${n === 0 ? `Automatycznie (${DAILY_GOAL_BY_GRADE[currentGrade()]})` : n}</option>`).join("")}
      </select>
    </section>
    <section class="card">
      <h2>Dźwięk</h2>
      <label class="check"><input type="checkbox" data-setting="music" ${settings.music ? "checked" : ""}> Cicha muzyka w menu 🎵</label>
      <label class="field" for="volumeRange">Głośność muzyki: <b id="volumeLabel">${Math.round(settings.musicVolume * 100)}%</b></label>
      <input type="range" id="volumeRange" data-setting="musicVolume" min="0" max="100" step="5" value="${Math.round(settings.musicVolume * 100)}">
      <label class="check" style="margin-top:14px"><input type="checkbox" data-setting="noSound" ${settings.noSound ? "checked" : ""}> 🔇 Tryb cichy – wyłącz wszystkie dźwięki i ukryj ćwiczenia z lektorem (Wskaż obrazek, Dyktando i zadania „posłuchaj”). To samo co przycisk 🔊 u góry.</label>
      <label class="check" style="margin-top:10px"><input type="checkbox" data-setting="sound" ${settings.sound ? "checked" : ""}> Efekty dźwiękowe (kliknięcia, dobra / zła odpowiedź, nagrody)</label>
      <label class="check" style="margin-top:10px"><input type="checkbox" data-setting="autoSpeak" ${settings.autoSpeak ? "checked" : ""}> Automatycznie czytaj angielskie słowa</label>
      <p class="muted small">Przeglądarki włączają dźwięk dopiero po pierwszym dotknięciu ekranu. Czytane są tylko angielskie słowa.</p>
    </section>
    <section class="card danger-zone">
      <h2>Zacznij od nowa</h2>
      <p class="muted">Usuwa imię, klasę, postępy, XP, odznaki, własne słowa i ustawienia z tego urządzenia. Nie da się tego cofnąć.</p>
      <button class="btn" data-action="startTutorial">🧭 Pokaż samouczek</button>
      <button class="btn danger" data-action="resetProfile">🗑️ Wyczyść profil</button>
    </section>`;
}

// ---------- Stats ----------

// ---------- Result ----------
function mistakeLabel(item) {
  if (item.past) return `<b>${esc(item.en)}</b> – ${esc(item.past)} (${esc(item.pl)})`;
  return item.pl ? `<b>${esc(item.en)}</b> – ${esc(item.pl)}` : `<b>${esc(item.en)}</b>`;
}

function nextStepAfter(stepId) {
  const unit = PATH_UNITS.find((entry) => entry.steps.some((candidate) => candidate.id === stepId));
  const index = unit.steps.findIndex((candidate) => candidate.id === stepId);
  return { unit, next: unit.steps[index + 1] || null };
}

function renderResult() {
  const isStep = Boolean(session.stepId);
  const percent = session.percent;
  const succeeded = isStep ? session.passed : percent >= 85;
  const mood = percent >= 70 ? "cheer" : percent >= 50 ? "happy" : "sad";
  const line = isStep ? rychuLine(session.passed ? "stepPass" : "stepFail") : rychuLine(percent >= 85 ? "great" : percent >= 50 ? "good" : "retry");
  playResultSounds(isStep);
  const mistakes = [...new Map(session.mistakes.map((item) => [item.id, item])).values()];
  const { label } = markFor(percent);

  let headline;
  if (isStep) {
    headline = session.passed
      ? `<div class="grade ok-big">✅</div><h2>Krok zaliczony!</h2>`
      : `<div class="grade">🔁</div><h2>Jeszcze nie – wymagane ${passThreshold(session.items.length)}/${session.items.length}</h2>`;
  } else {
    headline = `<div class="grade">${session.mark}</div><h2>${label}</h2>`;
  }

  let buttons;
  if (isStep) {
    const { unit, next } = nextStepAfter(session.stepId);
    buttons = session.passed
      ? `${next ? `<button class="btn primary big" data-action="openStep" data-id="${next.id}">Następny krok →</button>` : `<button class="btn primary big" data-action="openUnit" data-id="${unit.id}">Temat ukończony! 🎓</button>`}
         <button class="btn" data-action="startStep" data-id="${session.stepId}">Jeszcze raz</button>`
      : `<button class="btn primary big" data-action="startStep" data-id="${session.stepId}">Spróbuj jeszcze raz</button>
         <button class="btn" data-action="openStep" data-id="${session.stepId}">📖 Przeczytaj kartę</button>`;
  } else if (workout && workout.queue.length > 0) {
    buttons = `<button class="btn primary big" data-action="nextWorkout">Następne ćwiczenie →</button>`;
  } else if (session.dailyDone) {
    buttons = `<button class="btn primary big" data-action="openCalendar">📅 Kalendarz nagród</button>
      <button class="btn" data-action="openShop">🛍️ Sklepik</button>
      <button class="btn" data-action="nav" data-view="home">Menu</button>`;
  } else {
    buttons = `<button class="btn primary big" data-action="again">Jeszcze raz</button>
      <button class="btn" data-action="nav" data-view="${session.mode === "lessonTest" ? "learn" : "home"}">${session.mode === "lessonTest" ? "Tematy" : "Menu"}</button>`;
  }

  const workoutSummary = workout && workout.queue.length === 0 && workout.results.length > 1
    ? `<div class="workout-summary"><h3>Cały trening</h3>${workout.results.map((entry) => `<div class="word-item"><span>${modeById(entry.mode).icon} ${modeById(entry.mode).name}</span><b>${entry.correct}/${entry.done}</b></div>`).join("")}</div>` : "";

  app.innerHTML = `
    ${succeeded ? confettiHtml() : ""}
    <section class="card stage result">
      ${rychuBubble(mood, line, 96)}
      ${headline}
      <p>Poprawnie: <b>${session.correct}/${session.done}</b> (${percent}%) · <span class="xp-pill">+${session.xp} XP</span></p>
      ${session.gemsEarned ? `<div class="banner">💎 +${session.gemsEarned}${session.dailyBonus ? ` (w tym bonus ${session.dailyBonus})` : ""}</div>` : ""}
      ${session.dailyDone ? `<div class="banner">🎉 Zadanie dnia ukończone! Nagroda zapisana w kalendarzu.</div>` : ""}
      ${session.chestOpened ? `<div class="banner">🧰 Skrzynia skarbów otwarta!</div>` : ""}
      ${session.chestProgress && !session.chestOpened ? `<div class="banner">${extraChestLine()}</div>` : ""}
      ${session.unlocked ? `<div class="banner">🔓 W sklepiku odblokowała się nowa nagroda!</div>` : ""}
      ${session.goalReached ? `<div class="banner">${esc(rychuLine("goalDone"))}</div>` : ""}
      ${session.earned.length > 0 ? `<div class="banner badge-banner">🏅 ${session.earned.length === 1 ? "Nowa odznaka" : "Nowe odznaki"}: ${session.earned.slice(0, 3).map((badge) => `${badge.icon} ${esc(badge.name)}`).join(", ")}${session.earned.length > 3 ? ` i jeszcze ${session.earned.length - 3}` : ""}
        <button class="link" data-action="nav" data-view="stats">Zobacz</button></div>` : ""}
      ${workoutSummary}
      ${mistakes.length > 0 ? `<h3>Do powtórki:</h3><ul class="mistakes">${mistakes.map((item) => `<li>${mistakeLabel(item)}</li>`).join("")}</ul>` : `<p>Bez błędów! 🌟</p>`}
      <div class="row center">${buttons}</div>
    </section>`;
  // rewards to collect: the chest (tap 3×) first, then each new badge (tap it)
  if (!session.celebrated && (session.chestOpened || session.earned.length > 0)) {
    session.celebrated = true;
    setTimeout(() => celebrate([
      ...(session.chestOpened ? [{ type: "chest", gems: EXTRA_CHEST_GEMS }] : []),
      ...session.earned.map((badge) => ({ type: "badge", badge })),
    ]), 900);
  }
}
