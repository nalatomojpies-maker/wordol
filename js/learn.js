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

// ---------- Lesson illustrations (inline SVG, no external images) ----------
const TIMELINE_X = { past: 70, now: 160, future: 250 };

/** Each kind = what happens on the time line + one short caption for children. */
const TIMELINE_KINDS = {
  habit: { caption: "Powtarza się regularnie: wczoraj, dziś, jutro…", draw: () => [40, 85, 130, 175, 220, 265].map((x) => `<circle cx="${x}" cy="40" r="7" class="tl-dot"/>`).join("") },
  now: { caption: "Dzieje się właśnie TERAZ.", draw: () => `<circle cx="160" cy="40" r="15" class="tl-pulse"/><circle cx="160" cy="40" r="9" class="tl-dot"/>` },
  past: { caption: "Stało się w przeszłości i już się skończyło.", draw: () => `<circle cx="80" cy="40" r="9" class="tl-dot"/><text x="80" y="22" class="tl-mark">✔</text>` },
  pastlong: { caption: "W przeszłości coś trwało (fala), gdy nagle coś się stało (błyskawica).", draw: () => `<path d="M40 40 q10 -10 20 0 t20 0 t20 0 t20 0" class="tl-wave"/><text x="90" y="30" class="tl-mark">⚡</text>` },
  future: { caption: "Stanie się w przyszłości.", draw: () => `<circle cx="250" cy="40" r="9" class="tl-dot"/><text x="250" y="22" class="tl-mark">?</text>` },
  plan: { caption: "Już teraz mamy plan na przyszłość.", draw: () => `<path d="M160 40 Q205 5 250 34" class="tl-arc"/><text x="160" y="24" class="tl-mark">📋</text><circle cx="250" cy="40" r="8" class="tl-dot"/>` },
  perfect: { caption: "Stało się kiedyś (nie mówimy kiedy), ale liczy się TERAZ.", draw: () => `<circle cx="80" cy="40" r="8" class="tl-dot"/><path d="M80 34 Q120 0 158 32" class="tl-arc"/><circle cx="160" cy="40" r="6" class="tl-now"/>` },
  since: { caption: "Zaczęło się w przeszłości i trwa do teraz.", draw: () => `<rect x="70" y="34" width="90" height="12" rx="6" class="tl-bar"/>` },
  usedto: { caption: "Kiedyś działo się regularnie, a teraz już nie.", draw: () => `${[40, 70, 100].map((x) => `<circle cx="${x}" cy="40" r="7" class="tl-dot"/>`).join("")}<text x="160" y="24" class="tl-mark">✖</text>` },
  unreal: { caption: "Tylko w wyobraźni – to się (raczej) nie dzieje.", draw: () => `<ellipse cx="160" cy="34" rx="44" ry="18" class="tl-cloud"/><text x="160" y="40" class="tl-mark">💭</text>` },
};

function timelineSvg(kind) {
  const entry = TIMELINE_KINDS[kind];
  if (!entry) return "";
  const labels = [["past", "przeszłość"], ["now", "TERAZ"], ["future", "przyszłość"]]
    .map(([key, text]) => `<text x="${TIMELINE_X[key]}" y="76" class="tl-label${key === "now" ? " tl-label-now" : ""}">${text}</text>`).join("");
  return `<figure class="timeline">
      <svg viewBox="0 0 320 86" role="img" aria-label="Oś czasu: ${esc(entry.caption)}">
        <line x1="16" y1="40" x2="300" y2="40" class="tl-line"/><path d="M300 34 L312 40 L300 46 Z" class="tl-arrow"/>
        <line x1="160" y1="30" x2="160" y2="52" class="tl-nowline"/>${labels}${entry.draw()}
      </svg>
      <figcaption>${esc(entry.caption)}</figcaption>
    </figure>`;
}

/** Sentence pattern: role-coloured blocks. Roles: S who, H helper verb, V verb, N not, Q question word, R rest. */
const PATTERN_ROLES = { S: "kto?", Q: "pytajnik", H: "pomocnik", N: "przeczenie", V: "czasownik", R: "reszta" };

function patternHtml(rows) {
  const used = new Set(rows.flatMap((row) => row.parts.map(([role]) => role)));
  const legend = Object.entries(PATTERN_ROLES).filter(([role]) => used.has(role))
    .map(([role, name]) => `<span class="pb pb-${role}">${name}</span>`).join("");
  const lines = rows.map((row) => `<div class="pattern-row">${row.label ? `<span class="pattern-label">${esc(PATTERN_LABELS[row.label] || row.label)}</span>` : ""}
      ${row.parts.map(([role, text]) => `<span class="pb pb-${role}">${esc(text)}</span>`).join(`<span class="pb-plus">+</span>`)}</div>`).join("");
  return `<div class="lesson-box pattern"><h3>🧱 Jak zbudować zdanie?</h3>${lines}<div class="pattern-legend">${legend}</div></div>`;
}
const PATTERN_LABELS = { "➕": "✔ twierdzenie", "➖": "✖ przeczenie", "❓": "❓ pytanie", "⛔": "⛔ zakaz" };

/** Grid of illustration tiles; 4 tiles become 2×2 on phones. */
const sceneGrid = (tilesHtml) => `<div class="scene scene-${tilesHtml.length}" style="--n:${tilesHtml.length}">${tilesHtml.join("")}</div>`;

/** Picture tiles: [emoji, caption] pairs, e.g. near / far, must / mustn't. */
const sceneHtml = (tiles) => sceneGrid(tiles.map(([picture, caption]) =>
  `<div class="scene-tile"><span class="scene-pic" aria-hidden="true">${picture}</span><span>${richText(caption)}</span></div>`));

/** Analogue clock for the "time" lessons. */
function clockSvg(hour, minute, caption) {
  const point = (degrees, length) => {
    const radians = ((degrees - 90) * Math.PI) / 180;
    return [(40 + Math.cos(radians) * length).toFixed(1), (40 + Math.sin(radians) * length).toFixed(1)];
  };
  const line = ([x1, y1], [x2, y2], className) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${className}"/>`;
  const center = ["40", "40"];
  const ticks = Array.from({ length: 12 }, (_, index) => line(point(index * 30, 30), point(index * 30, 34), "clk-tick")).join("");
  return `<div class="scene-tile"><svg viewBox="0 0 80 80" class="clock" role="img" aria-label="${esc(caption.replace(/\*\*/g, ""))}">
      <circle cx="40" cy="40" r="37" class="clk-face"/>${ticks}
      ${line(center, point(((hour % 12) + minute / 60) * 30, 18), "clk-h")}${line(center, point(minute * 6, 28), "clk-m")}<circle cx="40" cy="40" r="3" class="clk-pin"/>
    </svg><span>${richText(caption)}</span></div>`;
}

const emojiText = (emoji, x, y, size) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle">${emoji}</text>`;
const tableSvg = () => `<rect x="15" y="44" width="70" height="6" rx="2" class="box"/><rect x="20" y="50" width="5" height="26" class="box"/><rect x="75" y="50" width="5" height="26" class="box"/>`;
const sceneSvgTile = (svg, caption) =>
  `<div class="scene-tile"><svg viewBox="0 0 100 80" class="scene-svg" role="img" aria-label="${esc(caption.replace(/\*\*/g, ""))}">${svg}</svg><span>${richText(caption)}</span></div>`;

/** Named illustrations used by grammar steps. */
const LESSON_ILLUSTRATIONS = {
  prepPlace: () => sceneGrid([
    [`<rect x="22" y="40" width="56" height="8" class="box-back"/>${emojiText("🐱", 50, 52, 34)}<rect x="22" y="48" width="56" height="28" rx="3" class="box"/>`, "**in** – w"],
    [`${tableSvg()}${emojiText("🐱", 50, 42, 30)}`, "**on** – na"],
    [`${tableSvg()}${emojiText("🐱", 50, 77, 24)}`, "**under** – pod"],
  ].map(([svg, caption]) => sceneSvgTile(svg, caption))),
  prepPlace2: () => sceneGrid([
    [`${emojiText("🏠", 36, 70, 42)}${emojiText("🐶", 82, 72, 22)}`, "**next to** – obok"],
    [`${emojiText("🐶", 60, 40, 20)}${emojiText("🏠", 50, 74, 48)}`, "**behind** – za"],
    [`${emojiText("🏠", 50, 62, 44)}${emojiText("🐶", 50, 78, 26)}`, "**in front of** – przed"],
  ].map(([svg, caption]) => sceneSvgTile(svg, caption))),
  clocks: () => sceneGrid([clockSvg(3, 0, "3:00 – **three o'clock**"), clockSvg(3, 30, "3:30 – **half past three**"), clockSvg(6, 15, "6:15 – **quarter past six**"), clockSvg(6, 45, "6:45 – **quarter to seven**")]),
  clocksFull: () => sceneGrid([clockSvg(7, 0, "**seven o'clock**"), clockSvg(10, 0, "**ten o'clock**"), clockSvg(2, 0, "**two o'clock**")]),
  compare: () => sceneGrid([["🐕", "1.4em", "**tall**"], ["🐎", "2.2em", "**taller**"], ["🦒", "3.2em", "**the tallest**"]]
    .map(([picture, size, caption]) => `<div class="scene-tile"><span class="scene-pic" style="font-size:${size}" aria-hidden="true">${picture}</span><span>${richText(caption)}</span></div>`)),
};

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
      }).join("")}</div><p class="muted center-text">Dotknij kafelka, aby posłuchać. Potem sprawdź, ile już pamiętasz!</p>` : "";

  const table = cardData.table
    ? `<div class="table-wrap"><table class="ltable"><thead><tr>${cardData.table.head.map((cell) => `<th>${richText(cell)}</th>`).join("")}</tr></thead>
       <tbody>${cardData.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${richText(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";

  app.innerHTML = `
    <button class="btn ghost" data-action="openUnit" data-id="${unit.id}">← ${esc(unit.title)}</button>
    <section class="card step-card">
      <p class="muted small">Krok ${index + 1} z ${unit.steps.length}</p>
      <h1>${esc(stepData.title)}</h1>
      ${cardData.intro ? `<div class="lesson-intro">${rychuBubble("cheer", cardData.intro, 56)}</div>` : ""}
      ${cardData.when ? `<div class="lesson-box when"><h3>🕐 Kiedy tego używamy?</h3><p>${richText(cardData.when)}</p></div>` : ""}
      ${(cardData.timeline || []).map(timelineSvg).join("")}
      ${cardData.emoji ? emojiBig(cardData.emoji) : ""}
      ${cardData.illus ? LESSON_ILLUSTRATIONS[cardData.illus]() : ""}
      ${cardData.scene ? sceneHtml(cardData.scene) : ""}
      ${vocabTiles}
      ${cardData.pattern ? patternHtml(cardData.pattern) : ""}
      ${cardData.lines.length > 0 ? `<div class="lesson-box"><h3>📌 Zapamiętaj</h3><ul class="rules">${cardData.lines.map((line) => `<li>${richText(line)}</li>`).join("")}</ul></div>` : ""}
      ${table}
      ${cardData.signals ? `<div class="lesson-box"><h3>🔎 Słowa-podpowiedzi</h3><div class="chips">${cardData.signals.map((signal) => `<span class="chip static">${esc(signal)}</span>`).join("")}</div></div>` : ""}
      ${cardData.mistake ? `<div class="lesson-box mistake"><h3>⚠️ Uważaj na błąd</h3><p><span class="bad-mark">❌ ${esc(cardData.mistake[0])}</span><br><span class="good-mark">✅ ${esc(cardData.mistake[1])}</span></p>${cardData.mistake[2] ? `<p class="muted small">${richText(cardData.mistake[2])}</p>` : ""}</div>` : ""}
      ${cardData.examples.length > 0 ? `<h2>Przykłady</h2>${cardData.examples.map(([english, polish]) => `
        <div class="example"><div><b>${esc(english)}</b>${polish ? `<br><span class="muted">${esc(polish)}</span>` : ""}</div>${speakButton(english)}</div>`).join("")}` : ""}
    </section>
    <div class="row center">
      <button class="btn primary big" data-action="startStep" data-id="${stepData.id}">Ćwiczymy! →</button>
    </div>
    <p class="muted center-text small">Aby zaliczyć krok, odpowiedz poprawnie na ${passThreshold(stepExercisesFor(stepData).length)} z ${stepExercisesFor(stepData).length} pytań.</p>`;
}
