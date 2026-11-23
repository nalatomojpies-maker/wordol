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

function materialWordsHtml() {
  const query = normalize(materialQuery);
  const chosen = state.settings.topics;
  const words = wordsInScope()
    .filter((word) => chosen.length === 0 || chosen.includes(word.topic))
    .filter((word) => !query || normalize(word.en).includes(query) || normalize(word.pl).includes(query));
  if (!words.length) return `<p class="muted">Nic nie znaleziono${materialQuery ? ` dla „${esc(materialQuery)}”` : ""}.</p>`;
  const legend = `<p class="mat-legend muted small">Słówek: <b>${words.length}</b> · <span class="mat-status s-mastered">✔</span> opanowane
    <span class="mat-status s-learning">◐</span> w trakcie <span class="mat-status s-hard">!</span> trudne <span class="mat-status"></span> nowe</p>`;
  const byTopic = new Map();
  words.forEach((word) => {
    if (!byTopic.has(word.topic)) byTopic.set(word.topic, []);
    byTopic.get(word.topic).push(word);
  });
  const topics = [CUSTOM_TOPIC, ...WORDOL_TOPICS].filter((topic) => byTopic.has(topic.id));
  return legend + topics.map((topic) => {
    const list = byTopic.get(topic.id);
    return `<details class="mat-topic" ${materialQuery || topics.length <= 3 ? "open" : ""}>
      <summary><span>${topic.icon} <b>${esc(topic.name)}</b></span><small class="muted">${list.length} · ✔ ${list.filter(isMastered).length}</small></summary>
      <div class="mat-words">${list.map((word) => {
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
  const grade = GRADE_INFO[currentGrade()].label.toLowerCase();
  const range = state.settings.wordScope === "upto" ? `od początku do: ${grade}` : `tylko ${grade}`;
  const topics = state.settings.topics.length ? `wybrane zbiory: ${state.settings.topics.length}` : "wszystkie zbiory";
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
