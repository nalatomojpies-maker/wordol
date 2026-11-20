"use strict";

// ====================================================================
// Learning path views: units -> steps -> explanation card -> exercises
// ====================================================================
let learnGrade = null;
let currentUnitId = null;
let currentStepId = null;

function startReview(grade) {
  const exercises = availableUnitsForGrade(grade).flatMap((unit) =>
    unit.steps.flatMap((stepData) => stepExercisesFor(stepData).map((exercise, index) => buildPathItem(`review:${stepData.id}`, exercise, index))));
  if (exercises.length < 4) {
    toast("Za mało ćwiczeń do powtórki w tej klasie.");
    return;
  }
  openSession("lessonTest", shuffle(exercises).slice(0, 10), { reviewGrade: grade });
}

function renderLearn() {
  const grade = learnGrade ?? currentGrade();
  const units = availableUnitsForGrade(grade);
  const totalSteps = units.reduce((sum, unit) => sum + unit.steps.length, 0);
  const passedSteps = units.reduce((sum, unit) => sum + unitPassedCount(unit), 0);
  const info = GRADE_INFO[grade];

  app.innerHTML = `
    <section class="card hero">
      ${rychuBubble("happy", `Ścieżka nauki: ${info.label}. Idziemy krok po kroku – każdy krok kończy się krótkim sprawdzianem!`, 84)}
    </section>
    <div class="chips grade-chips" role="tablist" aria-label="Wybierz klasę">
      ${GRADE_INFO.map((entry) => `<button class="chip ${entry.id === grade ? "active" : ""}" data-action="learnGrade" data-grade="${entry.id}">${entry.emoji} ${entry.id === 0 ? "0" : entry.id}${entry.id === currentGrade() ? " ★" : ""}</button>`).join("")}
    </div>
    <p class="muted center-text">${info.label} · zaliczone kroki: <b>${passedSteps}/${totalSteps}</b></p>
    ${units.length === 0 && state.settings.noSound ? `<section class="card"><p>🔇 Tryb „Brak dźwięku” jest włączony. Zadania tej klasy wymagają słuchania, więc są ukryte. Możesz wyłączyć tryb w Profilu.</p></section>` : ""}
    <section class="grid lessons">
      ${units.map((unit) => {
        const passed = unitPassedCount(unit);
        const percent = Math.round((passed / unit.steps.length) * 100);
        const label = passed === 0 ? "Start" : isUnitDone(unit) ? "Powtórz" : "Dalej";
        return `
        <article class="card lesson-card ${isUnitDone(unit) ? "done" : ""}">
          <div class="lesson-ico">${unit.icon}</div>
          <h3>${esc(unit.title)}</h3>
          <p class="muted">${esc(unit.summary)}</p>
          <div class="meter"><div style="width:${percent}%"></div></div>
          <p class="muted small">${passed}/${unit.steps.length} kroków ${isUnitDone(unit) ? "· ✅ ukończony" : ""}</p>
          <button class="btn primary" data-action="openUnit" data-id="${unit.id}">${label} →</button>
        </article>`;
      }).join("")}
    </section>
    ${units.length > 0 ? `<section class="card"><h2>Powtórka</h2><p class="muted">10 losowych pytań ze wszystkich tematów ${esc(info.label.toLowerCase())}.</p>
      <button class="btn" data-action="startReview" data-grade="${grade}">🎲 Test powtórkowy</button></section>` : ""}`;
}

function renderUnit() {
  const unit = unitById(currentUnitId);
  app.innerHTML = `
    <button class="btn ghost" data-action="nav" data-view="learn">← Wszystkie tematy</button>
    <section class="card hero" style="margin-top:12px">
      <div class="unit-head"><span class="lesson-ico big">${unit.icon}</span><div><h1>${esc(unit.title)}</h1><p>${esc(unit.summary)}</p></div></div>
    </section>
    <ol class="steps">
      ${unit.steps.map((stepData, index) => {
        const progress = state.path[stepData.id];
        const unlocked = isStepUnlocked(unit, index);
        const passed = isStepPassed(stepData.id);
        const status = passed ? "passed" : unlocked ? "open" : "locked";
        const badge = passed ? `✅ ${progress.best}%` : unlocked ? "▶" : "🔒";
        return `<li><button class="step ${status}" data-action="openStep" data-id="${stepData.id}" ${unlocked ? "" : "disabled"}>
          <span class="step-no">${index + 1}</span><span class="step-title">${esc(stepData.title)}</span><span class="step-badge">${badge}</span></button></li>`;
      }).join("")}
    </ol>`;
}

function renderStepCard() {
  const stepData = stepById(currentStepId);
  const unit = PATH_UNITS.find((entry) => entry.steps.some((candidate) => candidate.id === currentStepId));
  const index = unit.steps.findIndex((candidate) => candidate.id === currentStepId);
  const { card: cardData } = stepData;

  const vocabTiles = cardData.vocab
    ? `<div class="vocab-grid">${cardData.vocab.words.map((word) => {
        const emoji = emojiByEn(word, cardData.vocab.topic);
        const base = BUILT_IN_WORDS.find((entry) => normalize(entry.en) === normalize(word));
        return `<button class="vocab-tile" data-action="speak" data-text="${esc(word)}" aria-label="Posłuchaj: ${esc(word)}">
          ${emoji ? `<span class="vt-emoji">${emoji}</span>` : ""}<span class="vt-word">${esc(word)}</span>${base ? `<small>${esc(base.pl)}</small>` : ""}<span class="vt-speak">🔊</span></button>`;
      }).join("")}</div><p class="muted center-text">Dotknij kafelka, aby posłuchać. Potem sprawdź, co zapamiętałeś!</p>` : "";

  const table = cardData.table
    ? `<div class="table-wrap"><table class="ltable"><thead><tr>${cardData.table.head.map((cell) => `<th>${richText(cell)}</th>`).join("")}</tr></thead>
       <tbody>${cardData.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${richText(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";

  app.innerHTML = `
    <button class="btn ghost" data-action="openUnit" data-id="${unit.id}">← ${esc(unit.title)}</button>
    <section class="card step-card">
      <p class="muted small">Krok ${index + 1} z ${unit.steps.length}</p>
      <h1>${esc(stepData.title)}</h1>
      ${cardData.emoji ? emojiBig(cardData.emoji) : ""}
      ${vocabTiles}
      ${cardData.lines.length > 0 ? `<ul class="rules">${cardData.lines.map((line) => `<li>${richText(line)}</li>`).join("")}</ul>` : ""}
      ${table}
      ${cardData.examples.length > 0 ? `<h2>Przykłady</h2>${cardData.examples.map(([english, polish]) => `
        <div class="example"><div><b>${esc(english)}</b>${polish ? `<br><span class="muted">${esc(polish)}</span>` : ""}</div>${speakButton(english)}</div>`).join("")}` : ""}
    </section>
    <div class="row center">
      <button class="btn primary big" data-action="startStep" data-id="${stepData.id}">Ćwiczymy! →</button>
    </div>
    <p class="muted center-text small">Aby zaliczyć krok, odpowiedz poprawnie na ${passThreshold(stepExercisesFor(stepData).length)} z ${stepExercisesFor(stepData).length} pytań.</p>`;
}
