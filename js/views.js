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
  const inPath = ["learn", "unit", "step"].includes(currentView) ||
    ((currentView === "session" || currentView === "result") && session && session.mode === "lessonTest");
  if (inPath) return "learn";
  return currentView === "session" || currentView === "result" ? "home" : currentView;
}

function render() {
  applyTheme();
  document.body.classList.toggle("no-nav", view === "welcome");
  document.querySelectorAll(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeNavFor(view));
  });
  const renderers = {
    welcome: renderWelcome, home: renderHome, learn: renderLearn, unit: renderUnit, step: renderStepCard, add: renderAdd,
    stats: renderStats, settings: renderSettings, session: renderSessionFrame, result: renderResult,
  };
  renderers[view]();
  setMusicForView(view);
  updateMusicButton();
  window.scrollTo(0, 0);
}

/** Result screen: sounds (pass / fanfare / badge / daily goal) and a spoken summary. */
function playResultSounds(isStep) {
  const { percent, passed, earned, goalReached } = session;
  setTimeout(() => sfx(isStep && passed ? "pass" : percent >= 85 ? "fanfare" : "click"), 300);
  if (earned.length > 0) setTimeout(() => sfx("badge"), 1100);
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
      <h1>WORDOL</h1>
      <p class="tagline">Rychu – personal trainer</p>
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
function renderHome() {
  const { settings } = state;
  const grade = currentGrade();
  const level = levelInfo();
  const goal = dailyGoal();
  const today = answersToday();
  const percent = Math.min(100, Math.round((today / goal) * 100));
  greetingText = greetingText || rychuLine(isKidsMode() ? "greetKids" : "greet");
  const modes = modesForGrade();

  app.innerHTML = `
    <section class="card hero">
      ${rychuBubble("cheer", greetingText, 92)}
      <div class="badges">
        <span class="badge">⚡ Poziom ${level.level} · ${level.title}</span>
        <span class="badge">🔥 Seria: ${currentStreak()} dni</span>
        <button class="badge badge-btn" data-action="nav" data-view="settings">${GRADE_INFO[grade].emoji} ${GRADE_INFO[grade].label}</button>
      </div>
      <div class="xp-bar" title="${level.into}/${level.need} XP"><div style="width:${Math.round((level.into / level.need) * 100)}%"></div></div>
    </section>

    <section class="card daily">
      <div class="ring" role="img" aria-label="Dzienny cel: ${percent}%">
        <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" class="ring-bg"/><circle cx="40" cy="40" r="34" class="ring-fg" stroke-dasharray="${(percent * 213.6) / 100} 213.6"/></svg>
        <span>${percent >= 100 ? "✅" : `${percent}%`}</span>
      </div>
      <div class="daily-text">
        <h2>Dzisiejszy trening</h2>
        <p class="muted">Cel dnia: ${Math.min(today, goal)}/${goal} odpowiedzi. Rychu dobierze 3 ćwiczenia dla Ciebie.</p>
        <button class="btn primary big" data-action="startWorkout">▶ Zaczynamy trening</button>
      </div>
    </section>

    <h2 class="section-title">Wybierz ćwiczenie</h2>
    <section class="grid modes">
      ${modes.map((mode) => `
        <button class="mode" style="--c:${mode.color}" data-action="startMode" data-mode="${mode.id}">
          <span class="ico">${mode.icon}</span><strong>${mode.name}</strong><small>${mode.desc}</small>
        </button>`).join("")}
    </section>

    <section class="card options-card">
      <button class="options-toggle" data-action="toggleOptions" aria-expanded="${showTrainingOptions}">
        <span>⚙️ Ustawienia treningu</span><span>${showTrainingOptions ? "▲" : "▼"}</span>
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
    <section class="card">
      <h2>Profil</h2>
      <label class="field" for="nameInput">Imię</label>
      <input type="text" id="nameInput" data-setting="name" maxlength="20" value="${esc(settings.name)}" placeholder="Jak masz na imię?">
      <label class="field">Klasa</label>
      <div class="grade-grid">${gradeButtons(currentGrade(), "setGrade")}</div>
      <p class="muted small">Zmiana klasy zmienia zakres słów, dostępne ćwiczenia i ścieżkę nauki.</p>
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
      <label class="check" style="margin-top:14px"><input type="checkbox" data-setting="sound" ${settings.sound ? "checked" : ""}> Efekty dźwiękowe (kliknięcia, dobra / zła odpowiedź, nagrody)</label>
      <label class="check" style="margin-top:10px"><input type="checkbox" data-setting="autoSpeak" ${settings.autoSpeak ? "checked" : ""}> Automatycznie czytaj angielskie słowa</label>
      <p class="muted small">Przeglądarki włączają dźwięk dopiero po pierwszym dotknięciu ekranu. Czytane są tylko angielskie słowa.</p>
    </section>`;
}

// ---------- Stats ----------
function renderStats() {
  const { sessions } = state.stats;
  const totalAnswers = sessions.reduce((sum, entry) => sum + entry.total, 0);
  const totalCorrect = sessions.reduce((sum, entry) => sum + entry.correct, 0);
  const recent = sessions.slice(-20);
  const averageMark = recent.length > 0 ? (recent.reduce((sum, entry) => sum + entry.grade, 0) / recent.length).toFixed(1) : "–";
  const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
  const words = allWords();
  const level = levelInfo();
  const hardWords = words.filter((word) => wordStat(word).bad > 0)
    .sort((a, b) => (wordStat(b).bad - wordStat(b).ok) - (wordStat(a).bad - wordStat(a).ok)).slice(0, 8);

  const modeRows = MODES.map((mode) => {
    const modeSessions = sessions.filter((entry) => entry.mode === mode.id);
    if (modeSessions.length === 0) return "";
    const total = modeSessions.reduce((sum, entry) => sum + entry.total, 0);
    const correct = modeSessions.reduce((sum, entry) => sum + entry.correct, 0);
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return `<div><span>${mode.icon} ${mode.name}</span> <span class="muted">· ${modeSessions.length} ćwiczeń · ${percent}%</span><div class="meter"><div style="width:${percent}%"></div></div></div>`;
  }).join("");

  const bars = sessions.slice(-12).map((entry) => {
    const percent = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
    return `<div class="bar" style="height:${Math.max(percent, 18)}%" title="${new Date(entry.t).toLocaleDateString("pl-PL")}: ${percent}%">${entry.grade}</div>`;
  }).join("");

  const pathRows = GRADE_INFO.map((info) => {
    const units = unitsForGrade(info.id);
    const steps = units.reduce((sum, unit) => sum + unit.steps.length, 0);
    const passed = units.reduce((sum, unit) => sum + unitPassedCount(unit), 0);
    const percent = steps > 0 ? Math.round((passed / steps) * 100) : 0;
    return `<div><span>${info.emoji} ${info.label}</span> <span class="muted">· ${passed}/${steps} kroków</span><div class="meter"><div style="width:${percent}%"></div></div></div>`;
  }).join("");

  app.innerHTML = `
    <section class="card hero">${rychuBubble("happy", `Poziom ${level.level}: ${level.title}. Masz ${state.stats.xp} XP – tak trzymać!`, 84)}</section>
    <section class="grid stat-grid">
      <div class="card stat"><b>${sessions.length}</b>ćwiczeń</div>
      <div class="card stat"><b>${accuracy}%</b>poprawnych</div>
      <div class="card stat"><b>${averageMark}</b>średnia ocen</div>
      <div class="card stat"><b>${currentStreak()}</b>dni z rzędu</div>
      <div class="card stat"><b>${words.filter(isMastered).length}</b>opanowanych słów</div>
    </section>
    <section class="card"><h2>Odznaki</h2>
      <div class="badge-grid">
        ${BADGES.map((badge) => `<div class="medal ${state.stats.badges[badge.id] ? "earned" : ""}" title="${esc(badge.name)}"><span>${badge.icon}</span><small>${esc(badge.name)}</small></div>`).join("")}
      </div>
    </section>
    <section class="card"><h2>Ostatnie oceny</h2>
      ${bars ? `<div class="bars">${bars}</div>` : `<p class="muted">Zrób pierwsze ćwiczenie, a pojawi się tu wykres.</p>`}
    </section>
    ${modeRows ? `<section class="card"><h2>Skuteczność w ćwiczeniach</h2>${modeRows}</section>` : ""}
    <section class="card"><h2>Ścieżka nauki</h2>${pathRows}</section>
    <section class="card"><h2>Do powtórki</h2>
      ${hardWords.length > 0
        ? hardWords.map((word) => `<div class="word-item"><span><b>${esc(word.en)}</b> – ${esc(word.pl)}</span><span class="muted">błędy: ${wordStat(word).bad}</span></div>`).join("")
        : `<p class="muted">Brak trudnych słów. Świetnie!</p>`}
    </section>
    <button class="btn danger" data-action="resetStats">Wyzeruj postępy</button>`;
}

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
      ${session.goalReached ? `<div class="banner">${esc(rychuLine("goalDone"))}</div>` : ""}
      ${session.earned.length > 0 ? `<div class="banner badge-banner">Nowa odznaka: ${session.earned.map((badge) => `${badge.icon} ${esc(badge.name)}`).join(", ")}</div>` : ""}
      ${workoutSummary}
      ${mistakes.length > 0 ? `<h3>Do powtórki:</h3><ul class="mistakes">${mistakes.map((item) => `<li>${mistakeLabel(item)}</li>`).join("")}</ul>` : `<p>Bez błędów! 🌟</p>`}
      <div class="row center">${buttons}</div>
    </section>`;
}
