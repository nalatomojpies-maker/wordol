"use strict";

/** @type {null | {mode: string, items: any[], index: number, done: number, correct: number, xp: number, mistakes: any[], locked: boolean, tick: number, current: any, stepId: string|null}} */
let session = null;
/** Daily workout: a queue of several exercises run one after another. @type {null | {queue: string[], results: Array<{mode: string, correct: number, done: number}>}} */
let workout = null;

const modeById = (id) => MODES.find((entry) => entry.id === id);
const modesForGrade = () =>
  MODES.filter((mode) => mode.home !== false && mode.minGrade <= currentGrade() && !(state.settings.noSound && mode.needsAudio));
const emojiBig = (emoji) => `<div class="emoji-big" role="img" aria-label="obrazek">${emoji}</div>`;

/** Small label above a question: what kind of thing it is and what to do ("🎨 Kolor · znaczenie po polsku"). */
const kindChipRaw = (icon, label, task) =>
  `<div class="kind-chip"><span>${icon} ${esc(label)}</span>${task ? `<span class="task">${esc(task)}</span>` : ""}</div>`;
const kindChip = (topicId, task) => {
  const { icon, label } = topicKind(topicId);
  return kindChipRaw(icon, label, task);
};
const translationTask = (answerField) => (answerField === "pl" ? "znaczenie po polsku" : "słowo po angielsku");
const stageElement = () => $("#stage");
const currentWord = () => session.items[session.index];
const firstVariant = (answer) => answer.split("/")[0].trim();

// ====================================================================
// Choosing material
// ====================================================================
function sentenceTokenLimit() {
  const grade = currentGrade();
  return grade <= 3 ? 5 : grade === 4 ? 7 : 10;
}

function candidatesFor(modeId) {
  const grade = currentGrade();
  const pool = getPool();
  const withPictures = pool.filter((word) => emojiFor(word));
  /** Young pupils get words with our own illustrations (one consistent style); falls back to emoji if too few. */
  const artOnly = (list) => {
    const drawn = list.filter(hasArt);
    return grade <= 2 && drawn.length >= 8 ? drawn : list;
  };
  const preferPictures = (list) => (grade <= 2 && withPictures.length > 0 ? artOnly(withPictures) : list);
  /** Older pupils have few new concrete words, so picture exercises also revise words from earlier classes. */
  const pictureWords = () => {
    if (withPictures.length >= 8) return artOnly(withPictures);
    const { topics } = state.settings;
    return allWords().filter((word) => word.grade <= grade && emojiFor(word) && (topics.length === 0 || topics.includes(word.topic)));
  };
  switch (modeId) {
    case "listenpick":
    case "memory":
    case "pictures":
      return pictureWords();
    case "cards":
    case "match":
      return preferPictures(pool);
    case "letters": {
      const maxLength = grade <= 2 ? 5 : grade <= 4 ? 8 : 12;
      return preferPictures(pool).filter((word) => /^[a-z]{2,12}$/i.test(word.en) && word.en.length <= maxLength);
    }
    case "type":
    case "listen":
      return grade === 3 ? pool.filter((word) => word.en.length <= 8) : pool;
    case "sentences": {
      const { grammarTopics } = state.settings;
      return SENTENCES.filter((sentence) =>
        sentence.grade <= grade && (grammarTopics.length === 0 || grammarTopics.includes(sentence.topic)) &&
        sentence.en.replace(/[.?!]+$/, "").split(" ").length <= sentenceTokenLimit());
    }
    case "irregular":
      return IRREGULAR_VERBS;
    default:
      return pool;
  }
}

const memoryPairs = () => (currentGrade() === 0 ? 3 : { easy: 3, medium: 4, hard: 6 }[difficulty()]);
const matchRoundSize = () => (currentGrade() <= 2 ? 4 : 5);
const roundSizeFor = (modeId) => (modeId === "memory" ? memoryPairs() : modeId === "match" ? matchRoundSize() : 1);

function openSession(modeId, items, extra = {}) {
  session = { mode: modeId, items, index: 0, done: 0, correct: 0, xp: 0, mistakes: [], locked: false, tick: 0, current: null, stepId: null, ...extra };
  view = "session";
  render();
}

function startSession(modeId, options = {}) {
  const mode = modeById(modeId);
  if (state.settings.noSound && mode.needsAudio) {
    toast("To ćwiczenie wymaga słuchania – wyłącz „Brak dźwięku” w Profilu.");
    return false;
  }
  const needsSpeech = modeId === "listen" || modeId === "listenpick";
  if (needsSpeech && !speechAvailable()) {
    toast("Ta przeglądarka nie obsługuje czytania na głos.");
    return false;
  }
  const candidates = candidatesFor(modeId);
  const needed = modeId === "memory" || modeId === "match" ? 2 : 1;
  if (candidates.length < needed) {
    toast(state.settings.status !== "all" ? "Brak słów o tym statusie – zmień filtr „Słowa”." : "Za mało materiału w wybranych zbiorach.");
    return false;
  }
  const roundSize = roundSizeFor(modeId);
  let count = Math.min(options.length || sessionLength(), candidates.length);
  if (roundSize > 1) count = Math.max(Math.min(roundSize, candidates.length), count - (count % roundSize));
  openSession(modeId, pickWords(candidates, count));
  return mode !== undefined;
}

/** Daily workout: one recognition, one production and one fun exercise suited to the class. */
function startWorkout() {
  const playable = (id) => modesForGrade().some((mode) => mode.id === id) && candidatesFor(id).length >= (id === "memory" || id === "match" ? 2 : 1) &&
    !((id === "listen" || id === "listenpick") && !speechAvailable());
  const groups = [["quiz", "pictures", "listenpick"], ["type", "letters", "sentences", "listen"], ["match", "memory", "cards"]];
  const queue = groups.map((group) => shuffle(group.filter(playable))[0]).filter(Boolean);
  if (queue.length === 0) {
    toast("Brak materiału do treningu – zmień zbiory lub filtr słów.");
    return;
  }
  workout = { queue, results: [] };
  startNextWorkoutBlock();
}

function startNextWorkoutBlock() {
  const modeId = workout.queue.shift();
  const length = Math.max(4, Math.round(sessionLength() * 0.7));
  if (!startSession(modeId, { length })) workout = null;
}

/** Starts the confirming exercises of one learning-path step. */
function startStep(stepId) {
  const stepData = stepById(stepId);
  const exercises = stepExercisesFor(stepData);
  if (exercises.length < 3) {
    toast("Ten krok wymaga słuchania – wyłącz „Brak dźwięku” w Profilu.");
    return;
  }
  const items = exercises.map((exercise, index) => buildPathItem(stepId, exercise, index));
  openSession("lessonTest", items, { stepId });
}

function buildPathItem(stepId, exercise, index) {
  const base = { id: `ex:${stepId}:${index}`, kind: exercise.t, pl: "", isPath: true };
  const fillBlank = (q, a) => q.replace("___", firstVariant(a)).replace(/\s*\([^)]*\)/g, "");
  if (exercise.t === "choice" || exercise.t === "gap") return { ...base, q: exercise.q, o: exercise.o, a: exercise.a, en: fillBlank(exercise.q, exercise.a) };
  if (exercise.t === "order") return { ...base, en: exercise.en, pl: exercise.pl };
  const word = BUILT_IN_WORDS.find((entry) => normalize(entry.en) === normalize(exercise.a));
  if (exercise.t === "tr") return { ...base, en: exercise.a, pl: word.pl, a: word.pl, topic: word.topic, pool: exercise.pool };
  return { ...base, en: exercise.a, a: exercise.a, topic: exercise.topic, pool: exercise.pool };
}

// ====================================================================
// Session frame & flow
// ====================================================================
function renderSessionFrame() {
  const mode = modeById(session.mode);
  app.innerHTML = `
    <div class="session-head">
      <button class="btn ghost round" data-action="quit" aria-label="Zakończ ćwiczenie">✕</button>
      <div class="progress"><div id="bar"></div></div>
      <b class="session-icon">${mode.icon}</b>
    </div>
    <div class="stage" id="stage"></div>`;
  updateProgressBar();
  renderQuestion();
}

function renderQuestion() {
  const renderers = {
    listenpick: renderListenPick, memory: renderMemory, cards: renderCards, pictures: renderPictures, match: renderMatchRound,
    letters: renderLetters, quiz: renderQuiz, type: renderTyping, sentences: renderSentence, listen: renderTyping,
    irregular: renderIrregular, lessonTest: renderStepQuestion,
  };
  renderers[session.mode]();
}

/** Runs a callback later, but only if the user has not moved on in the meantime. */
function later(callback, delayMs) {
  const activeSession = session;
  const activeTick = session.tick;
  setTimeout(() => {
    if (session === activeSession && session.tick === activeTick) callback();
  }, delayMs);
}

function advance(step = 1) {
  session.tick++;
  session.locked = false;
  session.index += step;
  if (session.index >= session.items.length) finishSession();
  else renderQuestion();
}

function updateProgressBar() {
  const bar = $("#bar");
  if (bar) bar.style.width = `${(session.done / session.items.length) * 100}%`;
}

function record(item, isCorrect) {
  if (!item.isPath) {
    const stat = state.stats.words[item.id] || (state.stats.words[item.id] = { ok: 0, bad: 0 });
    if (isCorrect) stat.ok++;
    else stat.bad++;
  }
  if (isCorrect) {
    session.correct++;
    state.stats.correctTotal++;
    state.stats.xp += XP_PER_CORRECT;
    session.xp += XP_PER_CORRECT;
  } else {
    session.mistakes.push(item);
  }
  session.done++;
  countAnswerToday();
  updateProgressBar();
  saveState();
}

function pickDirection() {
  if (currentGrade() < 4) return "en-pl";
  const { direction } = state.settings;
  return direction === "mix" ? (Math.random() < 0.5 ? "pl-en" : "en-pl") : direction;
}
const directionFields = (direction) =>
  direction === "en-pl" ? { promptField: "en", answerField: "pl" } : { promptField: "pl", answerField: "en" };

function maybeAutoSpeak(word) {
  if (state.settings.autoSpeak) speak(word.en);
}

// ====================================================================
// Shared screens: choice, picture choice, typing
// ====================================================================
function mountChoice(word, answer, options, promptHtml, hint) {
  session.current = { word, answer };
  stageElement().innerHTML = `
    ${promptHtml}
    <p class="hint">${hint}</p>
    <div class="options">
      ${options.map((option) => `<button class="option" data-action="answerQuiz" data-value="${esc(option)}">${esc(option)}</button>`).join("")}
    </div>`;
}

/** Choice where the options are pictures. options: [{value, emoji}] */
function mountPicChoice(word, answer, options, promptHtml, hint, speakAfter = true) {
  session.current = { word, answer, speakAfter };
  stageElement().innerHTML = `
    ${promptHtml}
    <p class="hint">${hint}</p>
    <div class="options pics">
      ${options.map((option) => `<button class="option pic" data-action="answerQuiz" data-value="${esc(option.value)}"><span class="pic-emoji">${option.emoji}</span></button>`).join("")}
    </div>`;
}

function answerQuiz(button) {
  if (session.locked) return;
  session.locked = true;
  const { word, answer, speakAfter } = session.current;
  const isCorrect = normalize(button.dataset.value) === normalize(answer);
  button.classList.add(isCorrect ? "correct" : "wrong");
  const stage = stageElement();
  stage.classList.add("answered");
  if (!isCorrect) {
    stage.querySelectorAll(".option").forEach((option) => {
      if (normalize(option.dataset.value) === normalize(answer)) option.classList.add("correct");
    });
  }
  record(word, isCorrect);
  beep(isCorrect);
  if (speakAfter) speak(answer);
  later(advance, isCorrect ? 900 : 1700);
}

function typingHint(answer) {
  const level = currentGrade() <= 3 && difficulty() === "hard" ? "medium" : difficulty();
  if (level === "hard") return "";
  const chars = [...firstVariant(answer)].map((char, index) => {
    if (char === " ") return "  ";
    if (!/[a-ząćęłńóśźż0-9]/i.test(char)) return char;
    return index === 0 && level === "easy" ? char : "_";
  });
  return `<div class="type-hint" aria-label="Podpowiedź: liczba liter">${chars.join(" ")}</div>`;
}

function mountTyping(word, answer, promptHtml, extra = {}, hintHtml = "") {
  session.current = { word, answer, ...extra };
  stageElement().innerHTML = `
    ${promptHtml}
    ${hintHtml}
    <form data-form="typing" autocomplete="off">
      <input type="text" id="typeInput" autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="Twoja odpowiedź">
      <button class="btn primary" id="typeButton" type="submit">Sprawdź</button>
    </form>
    <button class="btn ghost" data-action="giveUp">Nie wiem</button>
    <div id="feedback" class="feedback"></div>`;
  $("#typeInput").focus();
}

function submitTyping() {
  if (session.locked) {
    advance();
    return;
  }
  const input = $("#typeInput");
  if (!input.value.trim()) return;
  finishTyping(isCorrectAnswer(input.value, session.current.answer));
}

function finishTyping(isCorrect) {
  if (session.locked) return;
  session.locked = true;
  const { word, answer, isListening } = session.current;
  record(word, isCorrect);
  beep(isCorrect);
  const feedback = $("#feedback");
  feedback.className = `feedback ${isCorrect ? "ok" : "bad"}`;
  const meaning = isListening ? ` (${word.pl})` : "";
  feedback.textContent = isCorrect ? `Świetnie! 🎉${meaning}` : `Poprawna odpowiedź: ${answer}${meaning}`;
  $("#typeInput").readOnly = true;
  $("#typeButton").textContent = "Dalej";
  if (isCorrect) later(advance, 900);
}

/** Options for a picture-choice: the word plus distractors that have pictures, as {value, emoji}. */
function pictureOptions(word, count) {
  const everyPicture = allWords().filter((other) => emojiFor(other));
  const sameStyle = hasArt(word) ? everyPicture.filter(hasArt) : everyPicture;
  const withPictures = sameStyle.length >= count + 4 ? sameStyle : everyPicture;
  const distractorWords = shuffle(withPictures.filter((other) => other.id !== word.id && normalize(other.en) !== normalize(word.en)))
    .sort((a, b) => Number(b.topic === word.topic) - Number(a.topic === word.topic));
  const unique = [];
  for (const candidate of distractorWords) {
    if (!unique.some((entry) => normalize(entry.en) === normalize(candidate.en))) unique.push(candidate);
    if (unique.length === count - 1) break;
  }
  return shuffle([word, ...unique]).map((entry) => ({ value: entry.en, emoji: emojiFor(entry) }));
}

// ====================================================================
// Exercises
// ====================================================================
function renderListenPick() {
  const word = currentWord();
  mountPicChoice(
    word, word.en, pictureOptions(word, optionCount()),
    `${kindChip(word.topic, "wskaż obrazek")}<button class="big-speak" data-action="speak" data-text="${esc(word.en)}" aria-label="Odtwórz słowo">🔊</button>`,
    `Posłuchaj i dotknij obrazka. ${topicKind(word.topic).ask}`
  );
  speak(word.en);
}

function renderQuiz() {
  const word = currentWord();
  const { promptField, answerField } = directionFields(pickDirection());
  const answer = word[answerField];
  const options = shuffle([answer, ...pickDistractors(word, answerField, optionCount() - 1)]);
  const showPicture = emojiFor(word) && (isKidsMode() || difficulty() === "easy") && promptField === "en";
  mountChoice(
    word, answer, options,
    `${kindChip(word.topic, translationTask(answerField))}${showPicture ? emojiBig(emojiFor(word)) : ""}<div class="prompt">${esc(word[promptField])} ${promptField === "en" ? speakButton(word.en) : ""}</div>`,
    answerField === "pl" ? "Wybierz polskie znaczenie" : "Wybierz angielskie słowo"
  );
  if (promptField === "en") maybeAutoSpeak(word);
}

function renderPictures() {
  const word = currentWord();
  const { ask } = topicKind(word.topic);
  const promptHtml = `${kindChip(word.topic, "nazwa obrazka")}${emojiBig(emojiFor(word))}`;
  const canType = currentGrade() >= 3 && difficulty() !== "easy" && Math.random() < 0.5;
  if (canType) {
    mountTyping(word, word.en, `${promptHtml}<p class="hint">${ask} Wpisz po angielsku</p>`, {}, typingHint(word.en));
    return;
  }
  const options = pictureOptions(word, optionCount()).map((entry) => entry.value);
  mountChoice(word, word.en, options, promptHtml, `${ask} Wybierz angielskie słowo`);
  session.current.speakAfter = true;
}

function renderTyping() {
  const word = currentWord();
  const isListening = session.mode === "listen";
  const { promptField, answerField } = directionFields(isListening || currentGrade() === 3 ? "pl-en" : pickDirection());
  const promptHtml = isListening
    ? `${kindChip(word.topic, "dyktando – co słyszysz")}<button class="big-speak" data-action="speak" data-text="${esc(word.en)}" aria-label="Odtwórz słowo">🔊</button>
       <p class="hint">Posłuchaj i wpisz słowo po angielsku</p>`
    : `${kindChip(word.topic, translationTask(answerField))}
       ${emojiFor(word) && (isKidsMode() || difficulty() === "easy") && promptField === "pl" ? emojiBig(emojiFor(word)) : ""}
       <div class="prompt">${esc(word[promptField])} ${promptField === "en" ? speakButton(word.en) : ""}</div>
       <p class="hint">Wpisz ${answerField === "pl" ? "po polsku" : "po angielsku"}</p>`;
  mountTyping(word, word[answerField], promptHtml, { isListening }, typingHint(word[answerField]));
  if (isListening) speak(word.en);
  else if (promptField === "en") maybeAutoSpeak(word);
}

function renderIrregular() {
  const verb = currentWord();
  mountTyping(
    verb, verb.past,
    `${kindChip("verbs", "forma Past Simple")}<div class="prompt">${esc(verb.en)} ${speakButton(verb.en)}</div><p class="hint">${esc(verb.pl)} · wpisz formę Past Simple</p>`,
    {}, typingHint(verb.past)
  );
}

// ---------- Flashcards ----------
function renderCards() {
  const word = currentWord();
  const grade = currentGrade();
  const picture = emojiFor(word);
  const usePicture = grade <= 2 && picture;
  const { promptField, answerField } = directionFields(pickDirection());
  const front = usePicture
    ? `${emojiBig(picture)}`
    : `${picture && difficulty() === "easy" ? emojiBig(picture) : ""}<div class="prompt">${esc(word[promptField])}</div>${promptField === "en" ? speakButton(word.en) : ""}`;
  const back = usePicture
    ? `<div class="prompt">${esc(word.en)}</div><p class="hint" style="color:inherit">${esc(word.pl)}</p>${speakButton(word.en)}`
    : `<div class="prompt">${esc(word[answerField])}</div>${answerField === "en" ? speakButton(word.en) : ""}`;
  session.current = { word, flipped: false, front, back };
  stageElement().innerHTML = `
    ${kindChip(word.topic, "fiszka")}
    <div class="flashcard" id="card" data-action="flip"></div>
    <div class="row center hidden" id="cardButtons">
      <button class="btn danger big" data-action="cardKnow" data-known="0">🔁 <span class="lbl-text">Jeszcze raz</span></button>
      <button class="btn primary big" data-action="cardKnow" data-known="1">👍 <span class="lbl-text">Umiem!</span></button>
    </div>`;
  drawCard();
  if (usePicture || promptField === "en") speak(word.en);
}

function drawCard() {
  const { flipped, front, back } = session.current;
  const card = $("#card");
  card.classList.toggle("back", flipped);
  card.innerHTML = `${flipped ? back : front}<p class="hint" style="color:inherit;opacity:.8">${flipped ? "" : "Dotknij, aby odwrócić"}</p>`;
  $("#cardButtons").classList.toggle("hidden", !flipped);
}

// ---------- Memory ----------
function renderMemory() {
  const roundWords = session.items.slice(session.index, session.index + memoryPairs());
  const cards = shuffle(roundWords.flatMap((word) => [word, word]));
  session.current = { roundWords, cards, open: [], matched: new Set(), faults: new Set() };
  stageElement().innerHTML = `
    ${kindChipRaw("🧠", "Memory", "znajdź pary obrazków")}
    <p class="hint">Znajdź pary takich samych obrazków</p>
    <div class="memory-grid cols-${cards.length <= 6 ? 3 : 4}">
      ${cards.map((word, index) => `<button class="mem" data-action="flipMem" data-i="${index}" aria-label="Karta"><span class="mem-back">❓</span><span class="mem-front">${emojiFor(word)}${currentGrade() >= 1 ? `<small>${esc(word.en)}</small>` : ""}</span></button>`).join("")}
    </div>`;
}

function flipMemory(button) {
  const memory = session.current;
  const index = Number(button.dataset.i);
  const word = memory.cards[index];
  if (session.locked || memory.open.includes(index) || memory.matched.has(word.id)) return;
  button.classList.add("open");
  sfx("flip");
  memory.open.push(index);
  speak(word.en);
  if (memory.open.length < 2) return;

  const [first, second] = memory.open;
  const firstWord = memory.cards[first];
  const buttons = [...stageElement().querySelectorAll(".mem")];
  if (firstWord.id === memory.cards[second].id) {
    memory.matched.add(firstWord.id);
    memory.open = [];
    [first, second].forEach((position) => buttons[position].classList.add("done"));
    record(firstWord, !memory.faults.has(firstWord.id));
    beep(true);
    if (memory.matched.size === memory.roundWords.length) {
      session.locked = true;
      later(() => advance(memory.roundWords.length), 1100);
    }
    return;
  }
  memory.faults.add(firstWord.id);
  memory.faults.add(memory.cards[second].id);
  beep(false);
  session.locked = true;
  later(() => {
    [first, second].forEach((position) => buttons[position].classList.remove("open"));
    memory.open = [];
    session.locked = false;
  }, 1000);
}

// ---------- Matching pairs ----------
function renderMatchRound() {
  const roundWords = session.items.slice(session.index, session.index + matchRoundSize());
  const pictureMode = currentGrade() <= 2 && roundWords.every((word) => emojiFor(word));
  session.current = { roundWords, pictureMode, matched: 0, wrongIds: new Set(), selected: null };
  const button = (word, side, content, extra = "") =>
    `<button class="pair ${extra}" data-action="pickMatch" data-side="${side}" data-id="${word.id}">${content}</button>`;
  const left = pictureMode ? (word) => button(word, "left", emojiFor(word), "pair-emoji") : (word) => button(word, "left", esc(word.en));
  const right = pictureMode ? (word) => button(word, "right", esc(word.en)) : (word) => button(word, "right", esc(word.pl));
  const roundTopics = new Set(roundWords.map((word) => word.topic));
  const chip = roundTopics.size === 1 ? kindChip([...roundTopics][0], "połącz pary") : kindChipRaw("🔗", "Pary", "połącz pasujące");
  stageElement().innerHTML = `
    ${chip}
    <p class="hint">${pictureMode ? "Połącz obrazek ze słowem" : "Połącz angielskie słowa z polskimi znaczeniami"}</p>
    <div class="match-cols">
      <div class="col">${shuffle(roundWords).map(left).join("")}</div>
      <div class="col">${shuffle(roundWords).map(right).join("")}</div>
    </div>`;
}

function pickMatch(button) {
  const round = session.current;
  if (session.locked || button.classList.contains("done")) return;
  const side = button.dataset.side;
  const selected = round.selected;
  const wordOf = (id) => round.roundWords.find((entry) => entry.id === id);
  const speaksEnglish = (itemSide) => (round.pictureMode ? itemSide === "right" : itemSide === "left");

  if (!selected || selected.side === side) {
    if (selected) selected.element.classList.remove("selected");
    round.selected = { side, id: button.dataset.id, element: button };
    button.classList.add("selected");
    if (speaksEnglish(side) && state.settings.autoSpeak) speak(wordOf(button.dataset.id).en);
    return;
  }

  const leftId = side === "left" ? button.dataset.id : selected.id;
  const rightId = side === "right" ? button.dataset.id : selected.id;
  const leftWord = wordOf(leftId);
  const rightWord = wordOf(rightId);
  const isMatch = round.pictureMode ? leftId === rightId : normalize(leftWord.pl) === normalize(rightWord.pl);
  const pair = [selected.element, button];
  selected.element.classList.remove("selected");
  round.selected = null;

  if (!isMatch) {
    round.wrongIds.add(leftId);
    beep(false);
    pair.forEach((element) => element.classList.add("wrong"));
    setTimeout(() => pair.forEach((element) => element.classList.remove("wrong")), 450);
    return;
  }
  beep(true);
  pair.forEach((element) => element.classList.add("done"));
  speak(leftWord.en);
  record(leftWord, !round.wrongIds.has(leftId));
  round.matched++;
  if (round.matched === round.roundWords.length) {
    session.locked = true;
    later(() => advance(round.roundWords.length), 900);
  }
}

// ---------- Tiles: letters & sentence builder ----------
const tileControls = (result) => `
  <div class="row center">
    ${result ? `<button class="btn primary big" data-action="next">Dalej →</button>`
             : `<button class="btn ghost" data-action="undoTile">↩ Cofnij</button><button class="btn ghost" data-action="giveUp">Nie wiem</button>`}
  </div>`;

const RANDOM_LETTERS = "abcdefghijklmnoprstuwy";

function renderLetters() {
  const word = currentWord();
  const answer = word.en.toLowerCase();
  const decoys = difficulty() === "hard" && currentGrade() >= 3
    ? shuffle([...RANDOM_LETTERS].filter((letter) => !answer.includes(letter))).slice(0, 2) : [];
  const tiles = shuffle([...answer, ...decoys]).map((text) => ({ text, used: false }));
  session.current = { word, answer, joiner: "", slots: answer.length, fixed: 0, result: null, draw: drawLetters, picked: [], tiles };
  if (difficulty() === "easy") placeFirstTile(answer[0]);
  drawLetters();
  maybeAutoSpeak(word);
}

/** Easy level: the first tile is already placed and cannot be removed. */
function placeFirstTile(firstText) {
  const letters = session.current;
  const index = letters.tiles.findIndex((tile) => tile.text === firstText && !tile.used);
  if (index < 0) return;
  letters.tiles[index].used = true;
  letters.picked.push(index);
  letters.fixed = 1;
}

function drawLetters() {
  const { word, answer, result, tiles, picked, slots, fixed } = session.current;
  const slotClass = result === "ok" ? "ok" : result === "bad" ? "bad" : "";
  const feedback = result === "ok" ? `<span class="ok">Świetnie! 🎉</span>` : result === "bad" ? `<span class="bad">Poprawnie: ${esc(answer)}</span>` : "";
  const picture = emojiFor(word);
  stageElement().innerHTML = `
    ${kindChip(word.topic, "ułóż słowo z liter")}
    ${picture && (currentGrade() <= 3 || difficulty() === "easy") ? emojiBig(picture) : ""}
    <div class="prompt">${esc(word.pl)} ${speakButton(word.en)}</div>
    <p class="hint">Ułóż angielskie słowo z liter</p>
    <div class="slots">
      ${Array.from({ length: slots }, (_, position) => {
        const tile = picked[position] !== undefined ? tiles[picked[position]] : null;
        return `<button class="slot ${tile ? "filled" : ""} ${slotClass} ${position < fixed ? "fixed" : ""}" data-action="untile" data-pos="${position}">${tile ? esc(tile.text) : ""}</button>`;
      }).join("")}
    </div>
    <div class="tiles">
      ${tiles.map((tile, index) => `<button class="tile" data-action="tile" data-i="${index}" ${tile.used ? "disabled" : ""}>${esc(tile.text)}</button>`).join("")}
    </div>
    ${tileControls(result)}
    <div class="feedback ${result === "ok" ? "ok" : "bad"}">${feedback}</div>`;
}

function renderSentence() {
  const item = currentWord();
  const answer = item.en.replace(/[.?!]+$/, "");
  const ending = item.en.slice(answer.length);
  const words = answer.split(" ");
  let shuffled = shuffle(words);
  for (let attempt = 0; attempt < 5 && shuffled.join(" ") === answer; attempt++) shuffled = shuffle(words);
  session.current = {
    word: item, answer, ending, joiner: " ", slots: words.length, fixed: 0, result: null, draw: drawSentence, picked: [],
    tiles: shuffled.map((text) => ({ text, used: false })),
  };
  if (difficulty() === "easy" && words.length > 3) placeFirstTile(words[0]);
  drawSentence();
}

function drawSentence() {
  const { word, answer, ending, result, tiles, picked, fixed } = session.current;
  const lineClass = result === "ok" ? "ok" : result === "bad" ? "bad" : "";
  const feedback = result === "ok" ? "Świetnie! 🎉" : result === "bad" ? `Poprawnie: ${esc(answer + ending)}` : "";
  stageElement().innerHTML = `
    ${kindChipRaw("📝", "Zdanie", "ułóż po angielsku")}
    <div class="prompt small">${esc(word.pl)}</div>
    <p class="hint">Ułóż zdanie po angielsku</p>
    <div class="answer-line ${lineClass}">
      ${picked.map((tileIndex, position) => `<button class="word-chip ${position < fixed ? "fixed" : ""}" data-action="untile" data-pos="${position}">${esc(tiles[tileIndex].text)}</button>`).join("")}
      ${picked.length === 0 ? `<span class="muted">Dotykaj słów poniżej…</span>` : ""}<span class="ending">${esc(ending)}</span>
    </div>
    <div class="tiles">
      ${tiles.map((tile, index) => `<button class="word-tile" data-action="tile" data-i="${index}" ${tile.used ? "disabled" : ""}>${esc(tile.text)}</button>`).join("")}
    </div>
    ${tileControls(result)}
    <div class="feedback ${result === "ok" ? "ok" : "bad"}">${feedback} ${result ? speakButton(word.en) : ""}</div>`;
}

function pickTile(index) {
  const current = session.current;
  if (session.locked || current.tiles[index].used || current.picked.length >= current.slots) return;
  current.tiles[index].used = true;
  current.picked.push(index);
  if (current.picked.length === current.slots) {
    const built = current.picked.map((tileIndex) => current.tiles[tileIndex].text).join(current.joiner);
    finishTiles(normalize(built) === normalize(current.answer));
    return;
  }
  current.draw();
}

function removeTile(position) {
  const current = session.current;
  if (session.locked || position < current.fixed || position >= current.picked.length) return;
  const [removed] = current.picked.splice(position, 1);
  current.tiles[removed].used = false;
  current.draw();
}

function finishTiles(isCorrect) {
  if (session.locked) return;
  session.locked = true;
  session.current.result = isCorrect ? "ok" : "bad";
  record(session.current.word, isCorrect);
  beep(isCorrect);
  session.current.draw();
  if (isCorrect) later(advance, 1000);
}

// ---------- Learning path exercises ----------
function renderStepQuestion() {
  const item = currentWord();
  const promptHtml = (text) => `<div class="prompt small">${esc(text)}</div>`;
  switch (item.kind) {
    case "order":
      renderSentence();
      break;
    case "choice":
      mountChoice(item, item.a, shuffle(item.o), kindChipRaw("✅", "Wybierz", "właściwa odpowiedź") + promptHtml(item.q), "Wybierz poprawną odpowiedź");
      break;
    case "gap":
      mountTyping(item, item.a, kindChipRaw("✏️", "Uzupełnij", "wpisz brakujące słowo") + promptHtml(item.q), {}, "");
      $("#typeInput").placeholder = "wpisz brakujące słowo(-a)";
      break;
    case "pic": {
      const options = pathPictureOptions(item);
      mountPicChoice(item, item.a, options, `${kindChip(item.topic, "wskaż obrazek")}<button class="big-speak" data-action="speak" data-text="${esc(item.a)}" aria-label="Odtwórz słowo">🔊</button>`, `Posłuchaj i dotknij obrazka. ${topicKind(item.topic).ask}`);
      speak(item.a);
      break;
    }
    case "see":
      mountChoice(item, item.a, shuffle(pathWordOptions(item)), kindChip(item.topic, "nazwa obrazka") + emojiBig(emojiByEn(item.a, item.topic)), `${topicKind(item.topic).ask} Wybierz słowo`);
      session.current.speakAfter = true;
      break;
    case "tr": {
      mountChoice(item, item.a, shuffle(pathMeaningOptions(item)), `${kindChip(item.topic, "znaczenie po polsku")}<div class="prompt">${esc(item.en)} ${speakButton(item.en)}</div>`, "Wybierz polskie znaczenie");
      if (state.settings.autoSpeak) speak(item.en);
      break;
    }
    default:
      throw new Error(`Unknown exercise kind: ${item.kind}`);
  }
}

/** Options for pic / see exercises: the answer plus two other words of the step. */
function pathWordOptions(item) {
  const others = shuffle(item.pool.filter((word) => normalize(word) !== normalize(item.a))).slice(0, 2);
  return [item.a, ...others];
}
const pathPictureOptions = (item) =>
  shuffle(pathWordOptions(item)).map((value) => ({ value, emoji: emojiByEn(value, item.topic) }));

function pathMeaningOptions(item) {
  const meanings = item.pool
    .filter((word) => normalize(word) !== normalize(item.en))
    .map((word) => BUILT_IN_WORDS.find((entry) => normalize(entry.en) === normalize(word)).pl);
  const options = [item.a];
  for (const meaning of shuffle(meanings)) {
    if (options.length === 4) break;
    if (!options.some((existing) => normalize(existing) === normalize(meaning))) options.push(meaning);
  }
  return options;
}

// ====================================================================
// Session end
// ====================================================================
function finishSession() {
  const total = session.done;
  if (total === 0) {
    session = null;
    workout = null;
    view = "home";
    render();
    return;
  }
  const percent = Math.round((session.correct / total) * 100);
  const mark = markFor(percent).grade;
  const stats = state.stats;
  stats.sessions.push({ t: Date.now(), mode: session.mode, total, correct: session.correct, grade: mark });
  stats.sessions = stats.sessions.slice(-MAX_SAVED_SESSIONS);
  touchStreak();

  const bonus = percent >= 85 ? 20 : percent >= 50 ? 10 : 5;
  stats.xp += bonus;
  session.xp += bonus;

  if (session.stepId) {
    const passed = session.correct >= passThreshold(session.items.length);
    const previous = state.path[session.stepId] || { best: 0, attempts: 0, passed: false };
    state.path[session.stepId] = { best: Math.max(previous.best, percent), attempts: previous.attempts + 1, passed: previous.passed || passed };
    session.passed = passed;
  }
  const goal = dailyGoal();
  session.goalReached = answersToday() >= goal && answersToday() - total < goal;
  session.earned = checkBadges({ perfect: percent === 100 && total >= 4 });
  session.percent = percent;
  session.mark = mark;
  if (workout) workout.results.push({ mode: session.mode, correct: session.correct, done: total });
  saveState();
  view = "result";
  render();
}
