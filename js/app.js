"use strict";

// ====================================================================
// Event handling & start-up
// ====================================================================
function goTo(targetView) {
  session = null;
  workout = null;
  if (targetView === "home") greetingText = null;
  view = targetView;
  render();
}

function applyGradeDefaults(grade) {
  const { settings } = state;
  settings.grade = grade;
  settings.topics = [];
  settings.grammarTopics = [];
  settings.wordScope = "own";
  settings.status = "all";
  settings.difficulty = grade <= 2 ? "easy" : "medium";
  settings.autoSpeak = grade <= 3;
  learnGrade = null;
}

const actions = {
  nav: (element) => goTo(element.dataset.view),

  // ----- profile -----
  pickWelcomeGrade: (element) => {
    welcomeDraft.grade = Number(element.dataset.grade);
    document.querySelectorAll("#welcomeGrades .grade-tile").forEach((tile) => {
      tile.classList.toggle("active", Number(tile.dataset.grade) === welcomeDraft.grade);
    });
  },
  finishWelcome: () => {
    state.settings.name = $("#welcomeName").value.trim();
    applyGradeDefaults(welcomeDraft.grade);
    state.settings.onboarded = true;
    saveState();
    goTo("home");
  },
  setGrade: (element) => {
    applyGradeDefaults(Number(element.dataset.grade));
    saveState();
    render();
  },
  setTheme: (element) => { state.settings.theme = element.dataset.themeId; saveState(); render(); },
  setDifficulty: (element) => { state.settings.difficulty = element.dataset.id; saveState(); render(); },
  toggleOptions: () => { showTrainingOptions = !showTrainingOptions; render(); },

  // ----- topics -----
  allTopics: () => { state.settings.topics = []; saveState(); render(); },
  toggleTopic: (element) => {
    const { topics } = state.settings;
    const id = element.dataset.id;
    state.settings.topics = topics.includes(id) ? topics.filter((topic) => topic !== id) : [...topics, id];
    saveState();
    render();
  },
  allGrammar: () => { state.settings.grammarTopics = []; saveState(); render(); },
  toggleGrammar: (element) => {
    const { grammarTopics } = state.settings;
    const id = element.dataset.id;
    state.settings.grammarTopics = grammarTopics.includes(id) ? grammarTopics.filter((topic) => topic !== id) : [...grammarTopics, id];
    saveState();
    render();
  },

  // ----- sessions -----
  startMode: (element) => { workout = null; startSession(element.dataset.mode); },
  startWorkout: () => startWorkout(),
  nextWorkout: () => startNextWorkoutBlock(),
  again: () => {
    if (session.stepId) startStep(session.stepId);
    else if (session.reviewGrade !== undefined) startReview(session.reviewGrade);
    else startSession(session.mode);
  },
  quit: () => {
    if (session.done > 0) {
      if (confirm("Zakończyć ćwiczenie i zobaczyć wynik?")) finishSession();
    } else {
      goTo(session.mode === "lessonTest" ? "learn" : "home");
    }
  },
  answerQuiz: answerQuiz,
  pickMatch: pickMatch,
  flipMem: flipMemory,
  flip: () => { session.current.flipped = !session.current.flipped; drawCard(); },
  cardKnow: (element) => {
    const known = element.dataset.known === "1";
    record(session.current.word, known);
    beep(known);
    advance();
  },
  tile: (element) => pickTile(Number(element.dataset.i)),
  untile: (element) => removeTile(Number(element.dataset.pos)),
  undoTile: () => removeTile(session.current.picked.length - 1),
  next: () => advance(),
  giveUp: () => {
    if (session.current.tiles) finishTiles(false);
    else finishTyping(false);
  },
  speak: (element) => speak(element.dataset.text),
  toggleMusic: () => toggleMusic(),

  // ----- learning path -----
  learnGrade: (element) => { learnGrade = Number(element.dataset.grade); render(); },
  openUnit: (element) => { session = null; currentUnitId = element.dataset.id; view = "unit"; render(); },
  openStep: (element) => { session = null; currentStepId = element.dataset.id; view = "step"; render(); },
  startStep: (element) => startStep(element.dataset.id),
  startReview: (element) => startReview(Number(element.dataset.grade)),

  // ----- own words -----
  prepare: prepareList,
  addRows: addSelectedRows,
  deleteCustom: (element) => {
    state.custom = state.custom.filter((word) => word.id !== element.dataset.id);
    state.settings.topics = state.settings.topics.filter((topic) => topic !== CUSTOM_TOPIC.id || state.custom.length > 0);
    saveState();
    renderAdd();
  },
  toggleLab: () => { labOpen = !labOpen; if (!labOpen) labUnlocked = false; rerenderAdd(); },
  lockLab: () => { labUnlocked = false; labOpen = false; rerenderAdd(); },
  showBlik: () => showBlik(),
  copyBlik: () => copyBlik(),
  supportDonated: () => { writeSupportStatus("donated"); closeModal("supportModal"); toast("Dziękuję! ☕ Ta prośba już się nie pojawi."); },
  supportDeclined: () => { writeSupportStatus("declined"); closeModal("supportModal"); },
  supportLater: () => closeModal("supportModal"),
  openLegal: () => openLegalModal(),
  closeLegal: () => closeModal("legalModal"),
  toggleFullscreen: () => toggleFullscreen(),
  resetProfile: () => resetProfile(),
  resetStats: () => {
    if (!confirm("Na pewno wyzerować wszystkie postępy (statystyki, kroki, XP)?")) return;
    state.stats = defaultState().stats;
    state.path = {};
    saveState();
    render();
  },
};

/** Actions that play their own sound (answers, cards, matches) – no extra click sound. */
const ACTIONS_WITH_OWN_SOUND = new Set(["answerQuiz", "pickMatch", "flipMem", "cardKnow", "speak"]);

document.addEventListener("click", (event) => {
  const element = event.target.closest("[data-action]");
  if (!element || !actions[element.dataset.action]) return;
  if (!ACTIONS_WITH_OWN_SOUND.has(element.dataset.action)) sfx("click");
  actions[element.dataset.action](element);
});

// Browsers allow sound only after the first user gesture – then the music can start.
["pointerdown", "keydown"].forEach((type) => document.addEventListener(type, unlockAudio, { once: true }));
document.addEventListener("visibilitychange", pauseAudioWhenHidden);

document.addEventListener("submit", (event) => {
  if (event.target.dataset.form === "lab") {
    event.preventDefault();
    unlockLab();
    return;
  }
  if (event.target.dataset.form === "typing") {
    event.preventDefault();
    submitTyping();
  }
});

function handleSettingChange(element) {
  const key = element.dataset.setting;
  const value = element.type === "checkbox" ? element.checked : element.type === "text" ? element.value.trim() : element.value;
  state.settings[key] = ["sessionLength", "dailyGoal"].includes(key) ? Number(value) : key === "musicVolume" ? Number(value) / 100 : value;
  saveState();
  if (key === "music") {
    if (state.settings.music) startMusic();
    else stopMusic();
    updateMusicButton();
  }
  if (key === "musicVolume") {
    applyMusicGain(true);
    const label = $("#volumeLabel");
    if (label) label.textContent = `${Math.round(state.settings.musicVolume * 100)}%`;
  }
  if (key === "sound" && state.settings.sound) sfx("ok");
  if (element.dataset.rerender) render();
}

document.addEventListener("change", (event) => {
  if (event.target.dataset.setting) handleSettingChange(event.target);
  if (event.target.id === "imageInput") handleImage(event.target.files[0]);
});
document.addEventListener("input", (event) => {
  if (["name", "musicVolume"].includes(event.target.dataset.setting)) handleSettingChange(event.target);
});

startSupportTimer();
const brandMascot = $("#brandMascot");
if (brandMascot) brandMascot.innerHTML = rychuSvg("happy", 38);
render();

// ====================================================================
// Full screen (phones) & profile reset
// ====================================================================
const isInstalledApp = () =>
  window.matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches || navigator.standalone === true;
const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;

function updateFullscreenButton() {
  const button = $("#fsBtn");
  if (!button) return;
  button.textContent = fullscreenElement() ? "🗗" : "⛶";
  button.setAttribute("aria-label", fullscreenElement() ? "Zamknij pełny ekran" : "Pełny ekran");
}

async function toggleFullscreen() {
  const root = document.documentElement;
  const request = root.requestFullscreen || root.webkitRequestFullscreen;
  if (isInstalledApp()) {
    toast("Aplikacja już działa na pełnym ekranie.");
    return;
  }
  if (!request) {
    toast("iPhone / iPad: Udostępnij → „Dodaj do ekranu głównego”, a aplikacja ruszy na pełnym ekranie.");
    return;
  }
  try {
    if (fullscreenElement()) {
      await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      await request.call(root, { navigationUI: "hide" });
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock("portrait").catch(() => {});
    }
  } catch {
    toast("Nie udało się włączyć pełnego ekranu.");
  }
}

["fullscreenchange", "webkitfullscreenchange"].forEach((type) =>
  document.addEventListener(type, () => {
    updateFullscreenButton();
    if (!fullscreenElement() && screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
  }));
updateFullscreenButton();

/** Wipes everything stored on this device (profile, progress, own words, settings) and starts from the welcome screen. */
function resetProfile() {
  const message = "Wyczyścić cały profil?\n\nZostanie usunięte: imię, klasa, postępy, XP, odznaki, własne słowa i ustawienia.\nTego nie da się cofnąć.";
  if (!confirm(message)) return;
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* storage blocked – the in-memory reset below still works */
  }
  Object.assign(state, defaultState());
  session = null;
  workout = null;
  learnGrade = null;
  greetingText = null;
  showTrainingOptions = false;
  welcomeDraft = { grade: state.settings.grade };
  startMusic();
  view = "welcome";
  render();
  toast("Profil wyczyszczony – zaczynamy od nowa!");
}
