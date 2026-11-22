"use strict";

/**
 * @typedef {{id: string, en: string, pl: string, topic: string, grade: number}} Word
 * @typedef {{ok: number, bad: number}} WordStat
 */

// ====================================================================
// Constants
// ====================================================================
const STORE_KEY = "wordol.v1";
const CUSTOM_TOPIC = { id: "custom", name: "Moje słowa", icon: "⭐" };
const MAX_SAVED_SESSIONS = 200;
const MAX_IMPORT_ENTRIES = 60;
const XP_PER_CORRECT = 10;
const XP_PER_LEVEL = 150;
const STEP_PASS_RATIO = 0.7;
const PAIR_SEPARATOR = /\s*[–—=]\s*|\s+-\s+|\s*:\s+|\t+|\s{3,}/;

const LEVEL_TITLES = ["Rozgrzewka", "Biegacz", "Sprinter", "Zawodnik", "Mistrz", "Legenda"];
const THEMES = [
  { id: "light", name: "Jasny", color: "#5b6cff" },
  { id: "dark", name: "Ciemny", color: "#7c8bff" },
  { id: "ocean", name: "Ocean", color: "#0891b2" },
  { id: "forest", name: "Las", color: "#3f8f3f" },
  { id: "candy", name: "Cukierek", color: "#e0489b" },
];
const GRADE_INFO = [
  { id: 0, label: "Zerówka", age: "5–6 lat", emoji: "🧸" }, { id: 1, label: "Klasa 1", age: "7 lat", emoji: "🎒" },
  { id: 2, label: "Klasa 2", age: "8 lat", emoji: "✏️" }, { id: 3, label: "Klasa 3", age: "9 lat", emoji: "📚" },
  { id: 4, label: "Klasa 4", age: "10 lat", emoji: "🔤" }, { id: 5, label: "Klasa 5", age: "11 lat", emoji: "🧠" },
  { id: 6, label: "Klasa 6", age: "12 lat", emoji: "🚀" }, { id: 7, label: "Klasa 7", age: "13 lat", emoji: "🎯" },
  { id: 8, label: "Klasa 8", age: "14 lat", emoji: "🏆" },
];
const DIFFICULTIES = [
  { id: "easy", name: "Łatwy", icon: "🌱", hint: "3 odpowiedzi z różnych tematów, obrazki przy słowach, pierwsza litera i pierwsze słowo podpowiedziane, mało luk w słowach, 3 pary w Memory." },
  { id: "medium", name: "Średni", icon: "🔥", hint: "4 podobne odpowiedzi (z tego samego tematu), przy wpisywaniu widać tylko liczbę liter, 2 litery-pułapki, więcej luk w słowach, 5 par w Memory." },
  { id: "hard", name: "Trudny", icon: "🚀", hint: "6 bardzo podobnych odpowiedzi, wpisywanie bez podpowiedzi, 4 litery-pułapki, słowo-pułapka w zdaniach, dużo luk bez obrazka, 8 par w Memory, dłuższe sesje." },
];
const STATUS_FILTERS = [
  { id: "all", name: "Wszystkie słowa" }, { id: "new", name: "Nowe" }, { id: "learning", name: "Uczę się" },
  { id: "hard", name: "Trudne" }, { id: "mastered", name: "Opanowane" },
];
/** minGrade = first class in which the exercise is offered (class 0 cannot read or write). */
const MODES = [
  { id: "listenpick", name: "Wskaż obrazek", icon: "👂", desc: "Posłuchaj i wskaż obrazek", minGrade: 0, color: "#ff7a59", needsAudio: true },
  { id: "memory", name: "Memory", icon: "🧠", desc: "Znajdź pary obrazków", minGrade: 0, color: "#8e6bff" },
  { id: "cards", name: "Fiszki", icon: "🎴", desc: "Odwracaj i oceniaj się", minGrade: 0, color: "#ffb02e" },
  { id: "pictures", name: "Obrazki", icon: "🖼️", desc: "Odgadnij słowo po obrazku", minGrade: 1, color: "#22b8cf" },
  { id: "match", name: "Łączenie par", icon: "🔗", desc: "Połącz pasujące elementy", minGrade: 1, color: "#12b886" },
  { id: "letters", name: "Układanka z liter", icon: "🔤", desc: "Ułóż słowo z liter", minGrade: 1, color: "#f06595" },
  { id: "quiz", name: "Test wyboru", icon: "✅", desc: "Wybierz poprawne znaczenie", minGrade: 2, color: "#5b6cff" },
  { id: "type", name: "Wpisywanie", icon: "⌨️", desc: "Wpisz tłumaczenie", minGrade: 3, color: "#7950f2" },
  { id: "sentences", name: "Układanie zdań", icon: "🧩", desc: "Ułóż zdanie z klocków", minGrade: 3, color: "#fd7e14" },
  { id: "listen", name: "Dyktando", icon: "🎧", desc: "Posłuchaj i napisz", minGrade: 3, color: "#339af0", needsAudio: true },
  { id: "gaps", name: "Brakujące litery", icon: "🔡", desc: "Uzupełnij słowo z lukami", minGrade: 2, color: "#0ca678" },
  { id: "irregular", name: "Czasowniki nieregularne", icon: "⏪", desc: "Wpisz formę Past Simple", minGrade: 5, color: "#e64980" },
  { id: "lessonTest", name: "Ćwiczenia ze ścieżki", icon: "🎓", desc: "", minGrade: 0, color: "#5b6cff", home: false },
];
const MARKS = [
  { min: 95, grade: 6, label: "celujący" }, { min: 85, grade: 5, label: "bardzo dobry" }, { min: 70, grade: 4, label: "dobry" },
  { min: 50, grade: 3, label: "dostateczny" }, { min: 30, grade: 2, label: "dopuszczający" }, { min: 0, grade: 1, label: "niedostateczny" },
];
const SESSION_LENGTH_BY_GRADE = [5, 6, 6, 8, 8, 10, 10, 12, 12];
const DAILY_GOAL_BY_GRADE = [8, 10, 12, 15, 20, 20, 25, 25, 25];

// ====================================================================
// Helpers
// ====================================================================
const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const richText = (text) => esc(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

/** Lowercases and strips diacritics/punctuation so answers compare leniently. */
function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** @template T @param {T[]} list @returns {T[]} */
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Local date as YYYY-MM-DD (used for the daily task and the reward calendar). */
const todayIso = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Deterministic pseudo-random numbers from a text seed (the same day gives the same daily task). */
function seededRandom(seedText) {
  let hash = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    hash = Math.imul(hash ^ seedText.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  let state32 = hash >>> 0;
  return () => {
    state32 = (state32 + 0x6d2b79f5) >>> 0;
    let t = state32;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seededShuffle = (list, seedText) => {
  const random = seededRandom(seedText);
  return list.map((item) => ({ item, key: random() })).sort((a, b) => a.key - b.key).map((entry) => entry.item);
};

const hasPolishChars = (text) => /[ąćęłńóśźż]/i.test(text);
const dayKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

function isCorrectAnswer(input, target) {
  const strip = (text) => normalize(text.replace(/['’]/g, "")).replace(/^to /, "");
  const given = strip(input);
  if (!given) return false;
  const withoutNotes = target.replace(/\s*\([^)]*\)/g, "");
  return [target, withoutNotes, ...withoutNotes.split(/[\/;]/), ...target.split(/[\/;]/)].some((variant) => strip(variant) === given);
}

const markFor = (percent) => MARKS.find((entry) => percent >= entry.min);

/** Minimal SHA-256 (hex). Used only to compare the experimental-features password with a stored salted hash. */
function sha256Hex(text) {
  const rotr = (value, bits) => (value >>> bits) | (value << (32 - bits));
  const bytes = [...new TextEncoder().encode(text)];
  const bitLength = bytes.length * 8;
  const k = [];
  let h = [];
  const composite = {};
  for (let candidate = 2, found = 0; found < 64; candidate++) {
    if (composite[candidate]) continue;
    for (let multiple = candidate * candidate; multiple < 320; multiple += candidate) composite[multiple] = true;
    if (found < 8) h[found] = (Math.sqrt(candidate) * 2 ** 32) | 0;
    k[found++] = (Math.cbrt(candidate) * 2 ** 32) | 0;
  }
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const high = Math.floor(bitLength / 2 ** 32);
  const low = bitLength >>> 0;
  [high, low].forEach((part) => bytes.push((part >>> 24) & 255, (part >>> 16) & 255, (part >>> 8) & 255, part & 255));
  const words = [];
  for (let i = 0; i < bytes.length; i += 4) words.push((bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3]);
  for (let block = 0; block < words.length; block += 16) {
    const w = words.slice(block, block + 16);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + k[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h = [h[0] + a, h[1] + b, h[2] + c, h[3] + d, h[4] + e, h[5] + f, h[6] + g, h[7] + hh].map((value) => value | 0);
  }
  return h.map((value) => (value >>> 0).toString(16).padStart(8, "0")).join("");
}

const EXPERIMENTAL_SALT = "wordol-lab:";
const EXPERIMENTAL_HASH = "a0759c9c3c6b87bd9195fe83fd7ead1f00d38d4ec163ca3be57491a541342416";
/** Compares with a salted hash, so the password itself is not stored in the code (a light barrier only). */
const isExperimentalPassword = (input) => sha256Hex(EXPERIMENTAL_SALT + input) === EXPERIMENTAL_HASH;

// ====================================================================
// State (persisted in localStorage)
// ====================================================================
function defaultState() {
  return {
    settings: {
      name: "", grade: 5, onboarded: false, theme: "light", sessionLength: 0, dailyGoal: 0, difficulty: "medium",
      direction: "mix", sound: true, music: true, musicVolume: 0.3, noSound: false, autoSpeak: false, termsAccepted: 0, wordScope: "upto", status: "all", topics: [], grammarTopics: [],
    },
    custom: [],
    cache: {},
    support: { seconds: 0, fired: {}, nextHourAt: 0 },
    gems: 0,
    daily: { day: "", grade: -1, modes: [], results: [], done: false },
    calendar: {},
    jokes: { owned: [] },
    riddles: { owned: [] },
    testUnlock: false,
    games: { owned: [], exercises: 0, unlockProgress: 0, unlockToday: { day: "", count: 0 }, charge: {}, plays: {}, scores: {} },
    extra: { day: "", exercises: 0, chests: 0 },
    shop: { day: "", ids: [] },
    path: {},
    stats: { words: {}, sessions: [], lastDay: "", streak: 0, xp: 0, correctTotal: 0, daily: { day: "", count: 0 }, badges: {} },
  };
}

function loadState() {
  const defaults = defaultState();
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (!parsed) return defaults;
    const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
    return {
      settings: { ...defaults.settings, ...(isObject(parsed.settings) ? parsed.settings : {}) },
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
      cache: isObject(parsed.cache) ? parsed.cache : {},
      path: isObject(parsed.path) ? parsed.path : {},
      support: { ...defaults.support, ...(isObject(parsed.support) ? parsed.support : {}) },
      gems: Number.isFinite(parsed.gems) ? Math.max(0, Math.floor(parsed.gems)) : 0,
      daily: { ...defaults.daily, ...(isObject(parsed.daily) ? parsed.daily : {}) },
      calendar: isObject(parsed.calendar) ? parsed.calendar : {},
      jokes: { owned: isObject(parsed.jokes) && Array.isArray(parsed.jokes.owned) ? parsed.jokes.owned : [] },
      testUnlock: parsed.testUnlock === true,
      riddles: { owned: isObject(parsed.riddles) && Array.isArray(parsed.riddles.owned) ? parsed.riddles.owned : [] },
      games: {
        ...defaults.games,
        ...(isObject(parsed.games) ? parsed.games : {}),
        // Saves from before the daily unlock limit: unlocking continues from the old exercise count.
        ...(isObject(parsed.games) && !Number.isFinite(parsed.games.unlockProgress) ? { unlockProgress: Number(parsed.games.exercises) || 0 } : {}),
      },
      extra: { ...defaults.extra, ...(isObject(parsed.extra) ? parsed.extra : {}) },
      shop: { ...defaults.shop, ...(isObject(parsed.shop) ? parsed.shop : {}) },
      stats: { ...defaults.stats, ...(isObject(parsed.stats) ? parsed.stats : {}) },
    };
  } catch {
    return defaults;
  }
}

const state = loadState();
if (!state.support.fired || typeof state.support.fired !== "object") state.support.fired = {};
// One-time switch: the default word scope is now "from class 0 up to my class".
if (!state.settings.scopeV2) {
  state.settings.wordScope = "upto";
  state.settings.scopeV2 = true;
}
if (!Array.isArray(state.games.owned)) state.games = defaultState().games;
if (!Number.isFinite(state.games.unlockProgress)) state.games.unlockProgress = Number(state.games.exercises) || 0;
if (!state.games.unlockToday || typeof state.games.unlockToday !== "object") state.games.unlockToday = { day: "", count: 0 };

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked – the app still works for the current visit */
  }
}

const currentGrade = () => Math.min(8, Math.max(0, Number(state.settings.grade) || 0));
const sessionLength = () => state.settings.sessionLength || Math.round(SESSION_LENGTH_BY_GRADE[currentGrade()] * difficultyLengthFactor());
const dailyGoal = () => state.settings.dailyGoal || DAILY_GOAL_BY_GRADE[currentGrade()];
const difficulty = () => state.settings.difficulty;
const isKidsMode = () => currentGrade() <= 3;

// ====================================================================
// Words
// ====================================================================
/** @type {Word[]} */
const BUILT_IN_WORDS = WORDOL_TOPICS.flatMap((topic) =>
  Object.entries(topic.grades).flatMap(([grade, list]) =>
    list.split(";").map((pair) => {
      const [en, pl] = pair.split("|").map((part) => part.trim());
      return { id: `${topic.id}:${en.toLowerCase()}`, en, pl, topic: topic.id, grade: Number(grade) };
    })
  )
);

const allWords = () => [...BUILT_IN_WORDS, ...state.custom];
const topicById = (id) => (id === CUSTOM_TOPIC.id ? CUSTOM_TOPIC : WORDOL_TOPICS.find((topic) => topic.id === id));

/**
 * Picture for a word: our own SVG illustration when there is one, otherwise an emoji.
 * The topic matters for words like colours ("colours:red").
 */
const pictureKey = (en) => en.toLowerCase().replace(/[!?.,]+$/, "");
const artFor = (en, topic = "") => WORD_ART[`${topic}:${pictureKey(en)}`] || WORD_ART[pictureKey(en)] || "";
const emojiByEn = (en, topic = "") =>
  artFor(en, topic) || WORD_EMOJI[`${topic}:${pictureKey(en)}`] || WORD_EMOJI[pictureKey(en)] || "";
const emojiFor = (word) => emojiByEn(word.en, word.topic);
const hasArt = (word) => Boolean(artFor(word.en, word.topic));

/** What kind of thing a word is: [icon, category label, question for picture exercises]. */
const TOPIC_KIND = {
  colours: ["🎨", "Kolor", "Jaki to kolor?"], numbers: ["🔢", "Liczba", "Ile to jest?"], family: ["👨‍👩‍👧", "Osoba z rodziny", "Kto to jest?"],
  body: ["🖐️", "Część ciała", "Jaka to część ciała?"], animals: ["🐾", "Zwierzę", "Jakie to zwierzę?"], toys: ["🧸", "Zabawka lub święto", "Co to jest?"],
  school: ["🎒", "Przedmiot szkolny", "Co to jest w szkole?"], food: ["🍽️", "Jedzenie lub picie", "Co to za jedzenie lub picie?"],
  fruit: ["🍎", "Owoc lub warzywo", "Jaki to owoc lub warzywo?"], home: ["🏠", "Dom i meble", "Co to jest w domu?"], clothes: ["👕", "Ubranie", "Jakie to ubranie?"],
  weather: ["⛅", "Pogoda", "Jaka to pogoda?"], time: ["📅", "Czas", "Co to za czas?"], sport: ["⚽", "Sport", "Jaki to sport?"], hobby: ["🎸", "Hobby", "Co to jest?"],
  town: ["🏙️", "Miejsce w mieście", "Jakie to miejsce?"], travel: ["🚌", "Podróż", "Co to jest?"], jobs: ["👩‍⚕️", "Zawód", "Jaki to zawód?"],
  verbs: ["🏃", "Czynność (czasownik)", "Jaka to czynność?"], adjectives: ["😊", "Cecha (przymiotnik)", "Jaka to cecha?"], nature: ["🌳", "Przyroda", "Co to jest w przyrodzie?"],
  tech: ["💻", "Technologia", "Co to za urządzenie?"], phrases: ["💬", "Zwrot", "Jaki to zwrot?"], health: ["🏥", "Zdrowie", "Co to jest?"],
  shopping: ["🛒", "Zakupy", "Co to jest?"], countries: ["🌍", "Kraj lub język", "Co to jest?"], environment: ["♻️", "Środowisko", "Co to jest?"],
  science: ["🔬", "Nauka", "Co to jest?"], media: ["📺", "Media", "Co to jest?"], custom: ["⭐", "Moje słowo", "Co to jest?"],
};
const topicKind = (topicId) => {
  const [icon, label, ask] = TOPIC_KIND[topicId] || ["📦", "Słowo", "Co to jest?"];
  return { icon, label, ask };
};

function wordStat(word) {
  return state.stats.words[word.id] || { ok: 0, bad: 0 };
}
function isHard(word) {
  const { ok, bad } = wordStat(word);
  return bad > 0 && bad / (ok + bad) > 0.25;
}
function isMastered(word) {
  const { ok, bad } = wordStat(word);
  return ok >= 3 && ok / (ok + bad) >= 0.8;
}
/** @returns {"new"|"learning"|"hard"|"mastered"} */
function wordStatus(word) {
  const { ok, bad } = wordStat(word);
  if (ok + bad === 0) return "new";
  if (isMastered(word)) return "mastered";
  return isHard(word) ? "hard" : "learning";
}

/** Words matching the pupil's class scope (own class or everything up to it). Custom words are always included. */
function wordsInScope() {
  const { wordScope } = state.settings;
  const grade = currentGrade();
  return allWords().filter((word) =>
    word.topic === CUSTOM_TOPIC.id || (wordScope === "upto" ? word.grade <= grade : word.grade === grade)
  );
}

function topicsInScope() {
  const topicIds = new Set(wordsInScope().map((word) => word.topic));
  return [...WORDOL_TOPICS, CUSTOM_TOPIC].filter((topic) => topicIds.has(topic.id));
}

function getPool() {
  const { topics, status } = state.settings;
  return wordsInScope()
    .filter((word) => topics.length === 0 || topics.includes(word.topic))
    .filter((word) => status === "all" || wordStatus(word) === status);
}

/** Weighted random pick without repeats – words answered wrongly come up more often. */
function pickWords(pool, count) {
  const weight = (item) => {
    const { ok, bad } = wordStat(item);
    return Math.max(0.3, 1 + bad * 1.5 - Math.min(ok, 5) * 0.15);
  };
  return pool
    .map((item) => ({ item, key: Math.random() ** (1 / weight(item)) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, count)
    .map((entry) => entry.item);
}

function pickDistractors(word, answerField, count, source = allWords()) {
  const seen = new Set([normalize(word[answerField])]);
  const candidates = shuffle(source.filter((other) => other.id !== word.id))
    .sort((a, b) => distractorScore(word, b, answerField) - distractorScore(word, a, answerField));
  const result = [];
  for (const candidate of candidates) {
    const key = normalize(candidate[answerField]);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(candidate[answerField]);
    if (result.length === count) break;
  }
  return result;
}

/**
 * How "tricky" a wrong option is. Easy: random words. Medium: the same topic first.
 * Hard: the same topic and similar spelling (same first letter, similar length) – easy to confuse.
 */
function distractorScore(word, other, answerField) {
  const level = difficulty();
  if (level === "easy") return 0;
  let score = other.topic === word.topic ? 2 : 0;
  if (level === "hard") {
    const target = normalize(word[answerField]);
    const candidate = normalize(other[answerField]);
    if (candidate[0] === target[0]) score += 1;
    if (Math.abs(candidate.length - target.length) <= 2) score += 1;
  }
  return score;
}

/** Number of answer options by difficulty (class 0 always gets few, large choices). */
function optionCount() {
  if (currentGrade() === 0) return difficulty() === "hard" ? 4 : 3;
  return { easy: 3, medium: 4, hard: 6 }[difficulty()];
}

/** Hard level: longer sessions. */
const difficultyLengthFactor = () => (difficulty() === "hard" ? 1.25 : 1);

// ====================================================================
// Learning path helpers
// ====================================================================
const unitById = (id) => PATH_UNITS.find((entry) => entry.id === id);
const stepById = (id) => PATH_UNITS.flatMap((entry) => entry.steps).find((entry) => entry.id === id);
const isStepPassed = (stepId) => Boolean(state.path[stepId] && state.path[stepId].passed);
const isStepUnlocked = (unit, index) => index === 0 || isStepPassed(unit.steps[index - 1].id);
const unitPassedCount = (unit) => unit.steps.filter((entry) => isStepPassed(entry.id)).length;
const isUnitDone = (unit) => unitPassedCount(unit) === unit.steps.length;
const passThreshold = (exerciseCount) => Math.max(1, Math.round(exerciseCount * STEP_PASS_RATIO));
const unitsForGrade = (grade) => PATH_UNITS.filter((unit) => unit.grade === grade);

/** "Brak dźwięku": exercises that need listening to the voice are left out. */
const stepExercisesFor = (stepData) => (state.settings.noSound ? stepData.exercises.filter((exercise) => exercise.t !== "pic") : stepData.exercises);
const isUnitAvailable = (unit) => unit.steps.some((stepData) => stepExercisesFor(stepData).length >= 3);
const availableUnitsForGrade = (grade) => unitsForGrade(grade).filter(isUnitAvailable);

// ====================================================================
// Sentences for the sentence builder (from SENTENCE_DATA and the examples of path units)
// ====================================================================
/** @type {Array<{id: string, en: string, pl: string, topic: string, grade: number}>} */
const SENTENCES = [];
(function buildSentenceBank() {
  const seen = new Set();
  const add = (unit, en, pl) => {
    const key = normalize(en);
    const words = en.replace(/[.?!]+$/, "").split(" ");
    if (!pl || !/[.?!]$/.test(en) || words.length < 3 || words.length > 10 || seen.has(key)) return;
    seen.add(key);
    SENTENCES.push({ id: `s:${unit.id}:${SENTENCES.length}`, en, pl, topic: unit.id, grade: unit.grade });
  };
  for (const [unitId, list] of Object.entries(SENTENCE_DATA)) {
    const unit = unitById(unitId);
    if (unit) list.split(";").forEach((pair) => add(unit, ...pair.split("|").map((part) => part.trim())));
  }
  for (const unit of PATH_UNITS) {
    for (const stepData of unit.steps) {
      stepData.card.examples.forEach(([en, pl]) => add(unit, en, pl));
      stepData.exercises.filter((exercise) => exercise.t === "order").forEach((exercise) => add(unit, exercise.en, exercise.pl));
    }
  }
})();
const IRREGULAR_VERBS = IRREGULAR_DATA.split(";").map((entry) => {
  const [base, past, pl] = entry.split("|").map((part) => part.trim());
  return { id: `irr:${base}`, en: base, past, pl };
});
const sentenceUnits = () => PATH_UNITS.filter((unit) => unit.grade <= currentGrade() && SENTENCES.some((sentence) => sentence.topic === unit.id));

// ====================================================================
// XP, levels, daily goal, streak, badges
// ====================================================================
function levelInfo() {
  const { xp } = state.stats;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return { level, title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)], into: xp % XP_PER_LEVEL, need: XP_PER_LEVEL };
}

function currentStreak() {
  const { lastDay, streak } = state.stats;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return lastDay === dayKey(new Date()) || lastDay === dayKey(yesterday) ? streak : 0;
}

function answersToday() {
  const { daily } = state.stats;
  return daily.day === dayKey(new Date()) ? daily.count : 0;
}

function countAnswerToday() {
  const today = dayKey(new Date());
  const { daily } = state.stats;
  if (daily.day !== today) state.stats.daily = { day: today, count: 0 };
  state.stats.daily.count++;
}

function touchStreak() {
  const stats = state.stats;
  const today = dayKey(new Date());
  if (stats.lastDay === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  stats.streak = stats.lastDay === dayKey(yesterday) ? stats.streak + 1 : 1;
  stats.lastDay = today;
}

const BADGES = [
  { id: "first", icon: "🥉", name: "Pierwszy trening", test: () => state.stats.sessions.length >= 1 },
  { id: "ten", icon: "🥈", name: "10 treningów", test: () => state.stats.sessions.length >= 10 },
  { id: "fifty", icon: "🥇", name: "50 treningów", test: () => state.stats.sessions.length >= 50 },
  { id: "streak3", icon: "🔥", name: "3 dni z rzędu", test: () => state.stats.streak >= 3 },
  { id: "streak7", icon: "🌟", name: "7 dni z rzędu", test: () => state.stats.streak >= 7 },
  { id: "perfect", icon: "💯", name: "Bezbłędny trening", test: (context) => Boolean(context.perfect) },
  { id: "answers100", icon: "🎯", name: "100 dobrych odpowiedzi", test: () => state.stats.correctTotal >= 100 },
  { id: "answers500", icon: "🚀", name: "500 dobrych odpowiedzi", test: () => state.stats.correctTotal >= 500 },
  { id: "words50", icon: "🧠", name: "50 opanowanych słów", test: () => allWords().filter(isMastered).length >= 50 },
  { id: "unit", icon: "🎓", name: "Ukończony temat", test: () => PATH_UNITS.some(isUnitDone) },
  { id: "steps20", icon: "🪜", name: "20 kroków zaliczonych", test: () => Object.values(state.path).filter((entry) => entry.passed).length >= 20 },
];

/** @returns {Array<{id: string, icon: string, name: string}>} badges earned just now */
function checkBadges(context = {}) {
  const earned = BADGES.filter((badge) => !state.stats.badges[badge.id] && badge.test(context));
  earned.forEach((badge) => { state.stats.badges[badge.id] = Date.now(); });
  return earned;
}

// ====================================================================
// Sound & speech
// ====================================================================
const speechAvailable = () => "speechSynthesis" in window;


const speakButton = (text) =>
  speechAvailable() ? `<button class="speak" data-action="speak" data-text="${esc(text)}" aria-label="Odtwórz wymowę">🔊</button>` : "";

let toastTimer = 0;
function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2800);
}
