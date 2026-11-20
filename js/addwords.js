"use strict";

// ====================================================================
// Adding words (text box + OCR + dictionary)
// ====================================================================
let addDraft = { text: "", rows: [], busy: false };

function renderAdd() {
  app.innerHTML = `
    <section class="card">
      <h2>Wklej lub wpisz słowa</h2>
      <p class="muted">Jedno słowo w wierszu. Możesz podać parę: <code>apple - jabłko</code>. Bez tłumaczenia sprawdzę je w bazie, a potem w słowniku online.</p>
      <textarea id="wordsText" placeholder="apple&#10;ice cream - lody&#10;kot">${esc(addDraft.text)}</textarea>
      <label class="field" for="inputLang">Język słów bez tłumaczenia</label>
      <select id="inputLang">
        <option value="auto">Wykryj automatycznie</option>
        <option value="en">Angielski</option>
        <option value="pl">Polski</option>
      </select>
    </section>
    <section class="card">
      <h2>Albo wczytaj zdjęcie</h2>
      <div class="dropzone">
        <input type="file" id="imageInput" accept="image/*">
        <div id="imagePreview"></div>
        <div class="ocr-bar hidden" id="ocrBar"><div id="ocrProgress"></div></div>
        <p class="muted" id="ocrStatus">OCR działa w przeglądarce (Tesseract.js). Przy pierwszym użyciu pobiera moduł z internetu.</p>
      </div>
    </section>
    <button class="btn primary" data-action="prepare" id="prepareButton">Przygotuj listę</button>
    <section id="preview" class="card hidden" style="margin-top:16px"></section>
    ${renderCustomList()}`;
  if (addDraft.rows.length > 0) drawPreview();
}

function renderCustomList() {
  if (state.custom.length === 0) return "";
  return `<section class="card" style="margin-top:16px"><h2>Moje słowa (${state.custom.length})</h2>
    <div class="word-list">
      ${state.custom.map((word) => `<div class="word-item"><span><b>${esc(word.en)}</b> – ${esc(word.pl)}</span><button data-action="deleteCustom" data-id="${word.id}" aria-label="Usuń">✕</button></div>`).join("")}
    </div></section>`;
}

/** Turns raw text (typed or from OCR) into entries: {a, b?}. */
function parseEntries(text) {
  const entries = [];
  const seen = new Set();
  const clean = (value) => value.replace(/[|_~^*#<>{}\[\]]+/g, " ").replace(/\s+/g, " ").trim().replace(/^[.,;:!"'()]+|[.,;:"'()]+$/g, "");
  const push = (first, second = "") => {
    const a = clean(first);
    const b = clean(second);
    const key = `${normalize(a)}|${normalize(b)}`;
    if (!normalize(a) || a.length > 60 || seen.has(key)) return;
    seen.add(key);
    entries.push({ a, b });
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/^\s*(?:\d+[.)]|[•*·-])\s+/, "").trim();
    if (!line) continue;
    const parts = line.split(PAIR_SEPARATOR).map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      push(parts[0], parts[1]);
    } else if (/[,;]/.test(line)) {
      line.split(/[,;]/).forEach((item) => push(item));
    } else if (line.split(/\s+/).length <= 3) {
      push(line);
    } else {
      (line.match(/[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ']{3,}/g) || []).forEach((word) => push(word.toLowerCase()));
    }
  }
  return entries;
}

function findInBase(text, language) {
  const key = normalize(text);
  return allWords().find((word) => normalize(word[language]) === key) || null;
}

/** Looks up a translation: our base first, then cache, then the online dictionary. */
async function resolveEntry({ a, b }, languageMode, onlineAllowed) {
  if (b) {
    const swap = hasPolishChars(a) && !hasPolishChars(b) ? true
      : hasPolishChars(b) && !hasPolishChars(a) ? false
      : Boolean(findInBase(a, "pl") || findInBase(b, "en"));
    return { en: swap ? b : a, pl: swap ? a : b, source: "ręcznie" };
  }
  const language = languageMode !== "auto" ? languageMode
    : hasPolishChars(a) ? "pl" : findInBase(a, "en") ? "en" : findInBase(a, "pl") ? "pl" : "en";
  const other = language === "en" ? "pl" : "en";
  const build = (translation, source) => ({ [language]: a, [other]: translation, source });

  const known = findInBase(a, language);
  if (known) return { en: known.en, pl: known.pl, source: "baza" };
  const cacheKey = `${language}:${normalize(a)}`;
  if (state.cache[cacheKey]) return build(state.cache[cacheKey], "słownik");
  if (!onlineAllowed.value) return build("", "brak");
  try {
    const translation = await translateOnline(a, language, other);
    if (translation) {
      state.cache[cacheKey] = translation;
      saveState();
      return build(translation, "słownik");
    }
  } catch (error) {
    onlineAllowed.value = false;
    onlineAllowed.error = error.message;
  }
  return build("", "brak");
}

async function prepareList() {
  if (addDraft.busy) return;
  addDraft.text = $("#wordsText").value;
  const languageMode = $("#inputLang").value;
  const entries = parseEntries(addDraft.text);
  if (entries.length === 0) {
    toast("Wpisz lub wczytaj jakieś słowa.");
    return;
  }
  if (entries.length > MAX_IMPORT_ENTRIES) toast(`Przetwarzam pierwsze ${MAX_IMPORT_ENTRIES} pozycji.`);
  addDraft.busy = true;
  const button = $("#prepareButton");
  button.disabled = true;
  const onlineAllowed = { value: true, error: "" };
  const rows = [];
  for (const [index, entry] of entries.slice(0, MAX_IMPORT_ENTRIES).entries()) {
    button.textContent = `Szukam tłumaczeń… ${index + 1}/${Math.min(entries.length, MAX_IMPORT_ENTRIES)}`;
    rows.push(await resolveEntry(entry, languageMode, onlineAllowed));
  }
  addDraft.rows = rows;
  addDraft.busy = false;
  button.disabled = false;
  button.textContent = "Przygotuj listę";
  drawPreview();
  if (onlineAllowed.error) toast(`${onlineAllowed.error} Uzupełnij tłumaczenia ręcznie.`);
}

function drawPreview() {
  const preview = $("#preview");
  preview.classList.remove("hidden");
  preview.innerHTML = `
    <h2>Sprawdź i popraw</h2>
    <p class="muted">Zaznacz, co dodać do zbioru „Moje słowa”. Możesz edytować pola.</p>
    ${addDraft.rows.map((row, index) => `
      <div class="preview-row" data-row="${index}">
        <input type="checkbox" ${row.en && row.pl ? "checked" : ""} aria-label="Dodaj">
        <input type="text" data-field="en" value="${esc(row.en || "")}" placeholder="angielski">
        <input type="text" data-field="pl" value="${esc(row.pl || "")}" placeholder="polski">
        <span class="src ${row.source}">${row.source}</span>
      </div>`).join("")}
    <button class="btn primary" data-action="addRows">Dodaj zaznaczone</button>`;
}

function addSelectedRows() {
  const existing = new Set(state.custom.map((word) => `${normalize(word.en)}|${normalize(word.pl)}`));
  let added = 0;
  document.querySelectorAll("#preview [data-row]").forEach((row) => {
    if (!$('input[type="checkbox"]', row).checked) return;
    const en = $('[data-field="en"]', row).value.trim();
    const pl = $('[data-field="pl"]', row).value.trim();
    const key = `${normalize(en)}|${normalize(pl)}`;
    if (!en || !pl || existing.has(key)) return;
    existing.add(key);
    state.custom.push({ id: `custom:${Date.now()}-${added}`, en, pl, topic: CUSTOM_TOPIC.id, grade: currentGrade() });
    added++;
  });
  if (added === 0) {
    toast("Nic nie dodano – uzupełnij oba pola i zaznacz wiersze.");
    return;
  }
  saveState();
  addDraft = { text: "", rows: [], busy: false };
  toast(`Dodano słów: ${added} ✔️`);
  renderAdd();
}

async function handleImage(file) {
  if (!file) return;
  const status = $("#ocrStatus");
  const bar = $("#ocrBar");
  const progress = $("#ocrProgress");
  const previewUrl = URL.createObjectURL(file);
  $("#imagePreview").innerHTML = `<img src="${previewUrl}" alt="Wczytane zdjęcie">`;
  bar.classList.remove("hidden");
  progress.style.width = "0";
  status.textContent = "Rozpoznaję tekst… (pierwszy raz może potrwać dłużej)";
  try {
    const text = await recognizeText(file, (value) => { progress.style.width = `${Math.round(value * 100)}%`; });
    const textarea = $("#wordsText");
    textarea.value = (textarea.value.trim() ? `${textarea.value.trim()}\n` : "") + text.trim();
    addDraft.text = textarea.value;
    status.textContent = "Gotowe! Tekst trafił do pola powyżej – popraw go i kliknij „Przygotuj listę”.";
  } catch (error) {
    status.textContent = `Nie udało się: ${error.message}`;
  } finally {
    bar.classList.add("hidden");
  }
}

