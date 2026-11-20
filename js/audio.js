"use strict";

/**
 * Sound engine: background music, sound effects and speech – everything synthesised in the browser
 * (Web Audio + speechSynthesis), so no audio files are needed. Every call is safe when audio is unavailable.
 */
let audioCtx = null;
let musicGain = null;
let sfxGain = null;
let musicTimer = 0;
let musicNextTime = 0;
let musicStep = 0;
let musicDuck = 1; // < 1 while Rychu is speaking
let musicWanted = true; // false during exercises
let okStreak = 0;

const MUSIC_BPM = 76;
const MUSIC_BASE_GAIN = 0.6;
const MUSIC_LOOKAHEAD_S = 0.6;
const MUSIC_TICK_MS = 120;

// ====================================================================
// Context
// ====================================================================
function ensureAudio() {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
      musicGain = audioCtx.createGain();
      sfxGain = audioCtx.createGain();
      sfxGain.gain.value = 0.9;
      musicGain.gain.value = 0;
      musicGain.connect(audioCtx.destination);
      sfxGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function applyMusicGain(fast = false) {
  if (!audioCtx || !musicGain) return;
  const target = state.settings.music && musicWanted ? state.settings.musicVolume * MUSIC_BASE_GAIN * musicDuck : 0;
  try {
    musicGain.gain.setTargetAtTime(target, audioCtx.currentTime, fast ? 0.05 : 0.5);
  } catch {
    /* ignore */
  }
}

// ====================================================================
// Sound effects
// ====================================================================
/** One enveloped tone on the effects bus. */
function tone(frequency, delay, duration, type, volume) {
  const start = audioCtx.currentTime + delay;
  const oscillator = audioCtx.createOscillator();
  const envelope = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(sfxGain);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

const NOTE = { C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5, E6: 1318.5, G6: 1568, C7: 2093 };

/** @param {"click"|"flip"|"ok"|"bad"|"pass"|"fanfare"|"badge"|"goal"} name */
function sfx(name) {
  if (!state.settings.sound) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  try {
    switch (name) {
      case "click":
        tone(880, 0, 0.06, "sine", 0.07);
        break;
      case "flip":
        tone(620, 0, 0.09, "triangle", 0.12);
        break;
      case "ok": {
        okStreak++;
        const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].slice(0, okStreak >= 5 ? 4 : okStreak >= 3 ? 3 : 2);
        notes.forEach((frequency, index) => tone(frequency, index * 0.07, 0.18, "triangle", 0.14));
        break;
      }
      case "bad":
        okStreak = 0;
        tone(233, 0, 0.16, "triangle", 0.13);
        tone(175, 0.14, 0.26, "triangle", 0.13);
        break;
      case "pass":
        [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((frequency, index) => tone(frequency, index * 0.1, 0.3, "triangle", 0.16));
        break;
      case "fanfare":
        [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((frequency, index) => tone(frequency, index * 0.11, 0.3, "triangle", 0.16));
        [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((frequency) => tone(frequency, 0.5, 0.7, "sine", 0.09));
        break;
      case "badge":
        [NOTE.E6, NOTE.G6, NOTE.C7].forEach((frequency, index) => tone(frequency, index * 0.08, 0.25, "sine", 0.1));
        break;
      case "goal":
        [NOTE.G5, NOTE.C6, NOTE.E6, NOTE.G6].forEach((frequency, index) => tone(frequency, index * 0.09, 0.35, "triangle", 0.14));
        break;
      default:
        break;
    }
  } catch {
    /* audio failure must never break the app */
  }
}

/** Correct / wrong answer sound (kept under the old name used by the exercises). */
const beep = (isCorrect) => sfx(isCorrect ? "ok" : "bad");

// ====================================================================
// Background music – a calm piano-like loop in C major (I V vi IV I IV V I)
// ====================================================================
const MUSIC_CHORDS = [
  [130.81, 164.81, 196.0], [98.0, 123.47, 146.83], [110.0, 130.81, 164.81], [87.31, 110.0, 130.81],
  [130.81, 164.81, 196.0], [87.31, 110.0, 130.81], [98.0, 123.47, 146.83], [130.81, 164.81, 196.0],
];
const MUSIC_MELODY = [
  659.25, 783.99, 587.33, 783.99, 659.25, 523.25, 523.25, 587.33,
  659.25, 587.33, 523.25, 659.25, 587.33, 783.99, 659.25, 523.25,
];
const ARPEGGIO_PATTERN = [0, 2, 1, 2, 3, 2, 1, 2];

function pianoNote(frequency, time, duration, volume) {
  const envelope = audioCtx.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(volume, time + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  envelope.connect(musicGain);
  [[1, 1], [2, 0.25], [3, 0.08]].forEach(([multiple, level]) => {
    const oscillator = audioCtx.createOscillator();
    const partial = audioCtx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency * multiple;
    partial.gain.value = level;
    oscillator.connect(partial);
    partial.connect(envelope);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.05);
  });
}

function scheduleMusic() {
  if (!audioCtx) return;
  const eighth = 60 / MUSIC_BPM / 2;
  while (musicNextTime < audioCtx.currentTime + MUSIC_LOOKAHEAD_S) {
    const stepInLoop = musicStep % (MUSIC_CHORDS.length * 8);
    const bar = Math.floor(stepInLoop / 8);
    const position = stepInLoop % 8;
    const [root, third, fifth] = MUSIC_CHORDS[bar];
    const voices = [root, third, fifth, root * 2];
    pianoNote(voices[ARPEGGIO_PATTERN[position]], musicNextTime, eighth * 3, 0.16);
    if (position === 0) pianoNote(root / 2, musicNextTime, eighth * 7, 0.22);
    if (position === 0 || position === 4) pianoNote(MUSIC_MELODY[bar * 2 + position / 4], musicNextTime, eighth * 3.5, 0.13);
    musicNextTime += eighth;
    musicStep++;
  }
}

function startMusic() {
  if (!state.settings.music) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  if (!musicTimer) {
    musicNextTime = ctx.currentTime + 0.15;
    musicStep = 0;
    musicTimer = setInterval(scheduleMusic, MUSIC_TICK_MS);
  }
  applyMusicGain();
}

function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = 0;
  applyMusicGain(true);
}

/** Music plays in menus and is silent during exercises, so it never covers the pronunciation. */
function setMusicForView(viewName) {
  musicWanted = viewName !== "session";
  applyMusicGain();
}

function updateMusicButton() {
  const button = $("#musicBtn");
  if (!button) return;
  button.textContent = state.settings.music ? "🎵" : "🔇";
  button.classList.toggle("off", !state.settings.music);
  button.setAttribute("aria-pressed", String(state.settings.music));
}

/** First user gesture: browsers allow audio only after it. */
function unlockAudio() {
  ensureAudio();
  if (state.settings.music) startMusic();
}

function toggleMusic() {
  state.settings.music = !state.settings.music;
  saveState();
  if (state.settings.music) {
    startMusic();
    applyMusicGain();
  } else {
    stopMusic();
  }
  updateMusicButton();
}

function pauseAudioWhenHidden() {
  if (!audioCtx) return;
  if (document.hidden) audioCtx.suspend();
  else if (state.settings.music || state.settings.sound) audioCtx.resume();
}

// ====================================================================
// Speech: English words (Polish messages are deliberately not read aloud)
// ====================================================================
function speakText(text, lang, rate) {
  if (!speechAvailable() || !text) return;
  try {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.onstart = () => { musicDuck = 0.3; applyMusicGain(true); };
    const restore = () => { musicDuck = 1; applyMusicGain(); };
    utterance.onend = restore;
    utterance.onerror = restore;
    speechSynthesis.speak(utterance);
  } catch {
    /* speech failure must never break the app */
  }
}

const speak = (text) => speakText(text, "en-GB", isKidsMode() ? 0.75 : 0.85);

