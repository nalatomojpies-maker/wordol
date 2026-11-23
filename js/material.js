"use strict";

/**
 * "Podejrzyj materiał": a full-screen window with everything in the chosen range –
 * all words and phrases (by topic, with search, pronunciation and progress) and the grammar lessons.
 * Opened from Ustawienia treningu, next to "Zakres słów".
 */
let materialTab = "words";
let materialQuery = "";

/** Classes covered by the chosen range: only my class, or from class 0 up to mine. */
const materialGrades = () => {
  const grade = currentGrade();
  return state.settings.wordScope === "upto" ? GRADE_INFO.map((info) => info.id).filter((id) => id <= grade) : [grade];
};

const STATUS_MARK = { mastered: ["✔", "opanowane"], learning: ["◐", "w trakcie"], hard: ["!", "trudne"], new: ["", "jeszcze nie ćwiczone"] };

/** Words shown in the window (range, chosen topics, search), grouped by topic in the usual order. */
function materialWordGroups() {
  const query = normalize(materialQuery);
  const chosen = state.settings.topics;
  const words = wordsInScope()
    .filter((word) => chosen.length === 0 || chosen.includes(word.topic))
    .filter((word) => !query || normalize(word.en).includes(query) || normalize(word.pl).includes(query));
  const byTopic = new Map();
  words.forEach((word) => {
    if (!byTopic.has(word.topic)) byTopic.set(word.topic, []);
    byTopic.get(word.topic).push(word);
  });
  return { words, groups: [CUSTOM_TOPIC, ...WORDOL_TOPICS].filter((topic) => byTopic.has(topic.id)).map((topic) => ({ topic, list: byTopic.get(topic.id) })) };
}

function materialRangeText() {
  const grade = GRADE_INFO[currentGrade()].label.toLowerCase();
  const range = state.settings.wordScope === "upto" ? `od początku do: ${grade}` : `tylko ${grade}`;
  const topics = state.settings.topics.length ? `wybrane zbiory: ${state.settings.topics.length}` : "wszystkie zbiory";
  return { range, topics };
}

function materialWordsHtml() {
  const { words, groups } = materialWordGroups();
  if (!words.length) return `<p class="muted">Nic nie znaleziono${materialQuery ? ` dla „${esc(materialQuery)}”` : ""}.</p>`;
  const legend = `<p class="mat-legend muted small">Słówek: <b>${words.length}</b> · <span class="mat-status s-mastered">✔</span> opanowane
    <span class="mat-status s-learning">◐</span> w trakcie <span class="mat-status s-hard">!</span> trudne <span class="mat-status"></span> nowe</p>`;

  return legend + groups.map(({ topic, list }) => {
    return `<details class="mat-topic" ${materialQuery || groups.length <= 3 ? "open" : ""}>
      <summary><span>${topic.icon} <b>${esc(topic.name)}</b></span><small class="muted">${list.length} · ✔ ${list.filter(isMastered).length}</small></summary>
      <div class="mat-words">
        <button class="btn mat-practice-topic" data-action="materialPracticeTopic" data-id="${topic.id}">🎯 Ćwicz ten zbiór</button>${list.map((word) => {
        const [mark, label] = STATUS_MARK[wordStatus(word)];
        return `<div class="mat-word"><span class="mat-status s-${wordStatus(word)}" title="${label}" aria-label="${label}">${mark}</span>
          <span class="mat-en"><b>${esc(word.en)}</b></span><span class="mat-pl">${esc(word.pl)}</span>${speakButton(word.en)}</div>`;
      }).join("")}</div>
    </details>`;
  }).join("");
}

function materialLessonsHtml() {
  const grades = materialGrades();
  const html = grades.map((grade) => {
    const units = unitsForGrade(grade);
    if (!units.length) return "";
    return `<h3 class="mat-grade">${GRADE_INFO[grade].emoji} ${GRADE_INFO[grade].label}</h3>
      ${units.map((unit) => `<div class="mat-lesson">
        <span class="lesson-ico">${unit.icon}</span>
        <div><b>${esc(unit.title)}</b><small class="muted">${esc(unit.summary)} · ${unitPassedCount(unit)}/${unit.steps.length} kroków</small></div>
        <button class="btn" data-action="materialOpenUnit" data-id="${unit.id}">Otwórz</button></div>`).join("")}`;
  }).join("");
  return html || `<p class="muted">W tym zakresie nie ma lekcji.</p>`;
}

function renderMaterial() {
  const box = $("#materialBody");
  if (!box) return;
  box.innerHTML = materialTab === "words" ? materialWordsHtml() : materialLessonsHtml();
  document.querySelectorAll("#materialModal .mat-tabs .chip").forEach((chip) => {
    const active = chip.dataset.tab === materialTab;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-selected", String(active));
  });
  const search = $("#materialSearch");
  if (search) search.closest(".mat-search").classList.toggle("hidden", materialTab !== "words");
}

function openMaterial() {
  if ($("#materialModal")) return;
  const { range, topics } = materialRangeText();
  materialQuery = "";
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop material-backdrop" id="materialModal" role="dialog" aria-modal="true" aria-labelledby="materialTitle">
      <div class="modal material">
        <div class="mat-head">
          <h2 id="materialTitle">📖 Materiał</h2>
          <button class="icon-btn" data-action="materialClose" aria-label="Zamknij">✕</button>
        </div>
        <p class="muted small">Zakres: <b>${esc(range)}</b> · ${topics}</p>
        <div class="chips mat-tabs" role="tablist">
          <button class="chip" role="tab" data-action="materialTab" data-tab="words">🔤 Słówka i zwroty</button>
          <button class="chip" role="tab" data-action="materialTab" data-tab="lessons">🎓 Lekcje</button>
        </div>
        <label class="mat-search"><span class="sr-only">Szukaj</span><input type="search" id="materialSearch" placeholder="🔍 Szukaj (po angielsku lub polsku)" autocomplete="off"></label>
        <div id="materialBody" class="mat-body"></div>
        <div class="mat-foot">
          <button class="btn primary" data-action="materialPractice">🎴 Ucz się fiszkami</button>
          <button class="btn" data-action="materialPrint">🖨️ Drukuj / PDF</button>
          <button class="btn" data-action="materialClose">Zamknij</button>
        </div>
      </div>
    </div>`);
  setPageInert(true);
  renderMaterial();
  $("#materialModal [data-action='materialClose']").focus();
}

function closeMaterial() {
  closeModal("materialModal");
  setPageInert(false);
}

document.addEventListener("input", (event) => {
  if (event.target.id !== "materialSearch") return;
  materialQuery = event.target.value;
  renderMaterial();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("#materialModal")) closeMaterial();
});

/** "Ćwicz ten zbiór": only this topic is chosen, back to the training screen to pick an exercise. */
function practiceMaterialTopic(topicId) {
  const topic = topicById(topicId);
  state.settings.topics = [topicId];
  state.settings.status = "all";
  saveState();
  closeMaterial();
  goTo("home");
  toast(`Wybrany zbiór: ${topic ? `${topic.icon} ${topic.name}` : topicId}. Wybierz ćwiczenie!`);
}

/**
 * "Drukuj / PDF": a clean black-and-white page with the words shown in the window (and the lessons of the range),
 * printed from a hidden frame – in the print window you can also choose "Zapisz jako PDF".
 */
function printMaterial() {
  const { words, groups } = materialWordGroups();
  const { range, topics } = materialRangeText();
  const lessons = materialGrades().flatMap((grade) => unitsForGrade(grade).map((unit) => ({ grade, unit })));
  const name = state.settings.name ? ` – ${esc(state.settings.name)}` : "";
  const date = new Date().toLocaleDateString("pl-PL");
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>WORD4ALL – materiał</title>
    <style>
      @page { margin: 14mm; }
      body { font-family: "Segoe UI", Arial, sans-serif; color: #000; font-size: 11pt; }
      h1 { font-size: 16pt; margin: 0 0 2px; } .meta { color: #444; margin: 0 0 12px; font-size: 9.5pt; }
      h2 { font-size: 12pt; margin: 14px 0 4px; border-bottom: 1.5px solid #000; padding-bottom: 2px; break-after: avoid; }
      table { width: 100%; border-collapse: collapse; } td { padding: 3px 6px; border-bottom: 1px solid #ccc; vertical-align: top; width: 50%; }
      td.en { font-weight: 700; } tr { break-inside: avoid; }
      .cols { columns: 2; column-gap: 18px; } .cols h2 { column-span: none; }
      .topic { break-inside: avoid-column; margin-bottom: 6px; }
      .lessons li { margin: 2px 0; } .muted { color: #555; }
    </style></head><body>
    <h1>📖 WORD4ALL – słówka i lekcje${name}</h1>
    <p class="meta">Zakres: ${esc(range)} · ${esc(topics)}${materialQuery ? ` · szukane: „${esc(materialQuery)}”` : ""} · słówek: ${words.length} · ${date}</p>
    <div class="cols">${groups.map(({ topic, list }) => `<div class="topic"><h2>${topic.icon} ${esc(topic.name)} <span class="muted">(${list.length})</span></h2>
      <table>${list.map((word) => `<tr><td class="en">${esc(word.en)}</td><td>${esc(word.pl)}</td></tr>`).join("")}</table></div>`).join("")}</div>
    ${lessons.length ? `<h2>🎓 Lekcje</h2><ul class="lessons">${lessons.map(({ grade, unit }) =>
      `<li><b>${esc(unit.title)}</b> <span class="muted">– ${esc(unit.summary)} (${esc(GRADE_INFO[grade].label)})</span></li>`).join("")}</ul>` : ""}
    </body></html>`;
  const old = document.getElementById("printFrame");
  if (old) old.remove();
  const frame = document.createElement("iframe");
  frame.id = "printFrame";
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(frame);
  const doc = frame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  setTimeout(() => {
    try {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } catch {
      toast("Nie udało się otworzyć drukowania w tej przeglądarce.");
    }
  }, 250);
}
