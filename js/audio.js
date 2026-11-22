"use strict";

/**
 * Sound engine: calm "chill-out" background music (5 original tracks), sound effects and speech –
 * everything synthesised in the browser (Web Audio + speechSynthesis), so no audio files are needed.
 * Every call is safe when audio is unavailable.
 */
let audioCtx = null;
let musicGain = null;
let sfxGain = null;
let noiseBuffer = null;
let musicTimer = 0;
let musicNextTime = 0;
let musicStep = 0;
let musicTrackIndex = 0;
let musicDuck = 1; // < 1 while Rychu is speaking
let musicWanted = true; // false during exercises
let okStreak = 0;

const MUSIC_BASE_GAIN = 0.6;
const MUSIC_LOOKAHEAD_S = 0.8;
const MUSIC_TICK_MS = 150;
const MUSIC_LOOPS_PER_TRACK = 2;
const MUSIC_TRACK_GAP_S = 2.5;
const MUSIC_LOWPASS_HZ = 2300;
const REVERB_SECONDS = 2.6;
const REVERB_WET = 0.38;

// ====================================================================
// Context
// ====================================================================
/** Soft decaying noise used as a room (reverb) impulse. */
function makeReverbImpulse(context) {
  const length = Math.floor(context.sampleRate * REVERB_SECONDS);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  return buffer;
}

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
      // Music bus: low-pass (takes the edge off) + gentle reverb, so everything sounds warm and soft.
      const softener = audioCtx.createBiquadFilter();
      softener.type = "lowpass";
      softener.frequency.value = MUSIC_LOWPASS_HZ;
      softener.Q.value = 0.4;
      const reverb = audioCtx.createConvolver();
      reverb.buffer = makeReverbImpulse(audioCtx);
      const reverbLevel = audioCtx.createGain();
      reverbLevel.gain.value = REVERB_WET;
      musicGain.connect(softener);
      softener.connect(audioCtx.destination);
      softener.connect(reverb);
      reverb.connect(reverbLevel);
      reverbLevel.connect(audioCtx.destination);
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
  const target = state.settings.music && !isQuiet() && musicWanted ? state.settings.musicVolume * MUSIC_BASE_GAIN * musicDuck : 0;
  try {
    musicGain.gain.setTargetAtTime(target, audioCtx.currentTime, fast ? 0.05 : 0.8);
  } catch {
    /* ignore */
  }
}

// ====================================================================
// Sound effects
// ====================================================================
/** Quiet mode (the speaker button in the top bar) or "Brak dźwięku" in Profil: nothing makes a sound. */
const isQuiet = () => Boolean(state.settings.quiet || state.settings.noSound);
/** Effects (answer jingles, clicks, rewards, games) play only with "Efekty dźwiękowe" on and no quiet mode. */
const effectsOn = () => state.settings.sound && !isQuiet();

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

/** A soft bell note (used by the "Powtórz melodię" game). */
function playNote(frequency, duration = 0.4) {
  if (!effectsOn() || !ensureAudio()) return;
  try {
    tone(frequency, 0, duration, "sine", 0.16);
    tone(frequency * 2, 0, duration * 0.5, "sine", 0.035);
  } catch {
    /* audio not available – the game still works with colours */
  }
}

/** @param {"click"|"flip"|"ok"|"bad"|"pass"|"fanfare"|"badge"|"goal"|"gem"} name */
function sfx(name) {
  if (!effectsOn()) return;
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
      case "gem":
        [NOTE.G6, NOTE.C7, NOTE.G6, NOTE.C7].forEach((frequency, index) => tone(frequency, index * 0.07, 0.2, "sine", 0.09));
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

// ====================================================================
// Answer jingles (short instrument melodies: Kenney "Music Jingles", CC0 – kenney.nl)
// ====================================================================
const ANSWER_SOUND_FILES = {
  good: ["sounds/good-1.mp3", "sounds/good-2.mp3", "sounds/good-3.mp3", "sounds/good-4.mp3", "sounds/good-5.mp3"],
  bad: ["sounds/bad-1.mp3", "sounds/bad-2.mp3", "sounds/bad-3.mp3", "sounds/bad-4.mp3", "sounds/bad-5.mp3"],
};
const ANSWER_SOUND_GAIN = 0.55;
const answerBuffers = { good: [], bad: [] };
const lastAnswerSound = { good: -1, bad: -1 };
let answerSoundsLoading = false;

/** Downloads and decodes the jingles once (after the first sound, when audio is allowed). */
function loadAnswerSounds() {
  if (answerSoundsLoading || !audioCtx) return;
  answerSoundsLoading = true;
  Object.entries(ANSWER_SOUND_FILES).forEach(([kind, files]) => files.forEach((file, index) => {
    fetch(file)
      .then((response) => (response.ok ? response.arrayBuffer() : Promise.reject(new Error(file))))
      .then((data) => new Promise((resolve, reject) => audioCtx.decodeAudioData(data, resolve, reject)))
      .then((buffer) => { answerBuffers[kind][index] = buffer; })
      .catch(() => { /* missing file: the synthesised sound is used instead */ });
  }));
}

/** Plays a random jingle of the kind (never the same one twice in a row); false when none is ready yet. */
function playAnswerJingle(kind) {
  const ready = answerBuffers[kind].map((buffer, index) => (buffer ? index : -1)).filter((index) => index >= 0);
  if (ready.length === 0) return false;
  const choices = ready.length > 1 ? ready.filter((index) => index !== lastAnswerSound[kind]) : ready;
  const index = choices[Math.floor(Math.random() * choices.length)];
  lastAnswerSound[kind] = index;
  const source = audioCtx.createBufferSource();
  const level = audioCtx.createGain();
  source.buffer = answerBuffers[kind][index];
  level.gain.value = ANSWER_SOUND_GAIN;
  source.connect(level);
  level.connect(sfxGain);
  source.start();
  return true;
}

/** Answer in an exercise: a happy jingle for a correct one, a sad one for a wrong one (random from five each). */
function beep(isCorrect) {
  if (!effectsOn()) return;
  if (!ensureAudio()) return;
  loadAnswerSounds();
  try {
    if (playAnswerJingle(isCorrect ? "good" : "bad")) return;
  } catch {
    /* fall back to the short synthesised sound below */
  }
  sfx(isCorrect ? "ok" : "bad");
}

// ====================================================================
// Background music – five calm chill-out tracks (no bells, no percussion, slow and warm)
// ====================================================================
const NOTE_INDEX = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
const noteMidi = (name) => {
  const match = /^([A-G]#?)(-?\d)$/.exec(name);
  return NOTE_INDEX[match[1]] + (Number(match[2]) + 1) * 12;
};
const midiFreq = (midi) => 440 * 2 ** ((midi - 69) / 12);
/** Jazzy "chill" chords: every one has four tones. */
const CHORD_TONES = { maj7: [0, 4, 7, 11], min7: [0, 3, 7, 10], 6: [0, 4, 7, 9], add9: [0, 4, 7, 14] };
const MUSIC_INSTRUMENTS = ["epiano", "pad", "bass", "soft", "swell"];

/**
 * A track is a loop of bars. Per bar: chord [root, quality] and melody notes [eighthPosition, note, lengthInEighths].
 * arp = chord-voice index per eighth (0..4, null = rest); bass = [eighthPosition, semitonesAboveRoot];
 * pad = sustained chord at the start of each bar; ocean = soft wave noise under each bar.
 */
const MUSIC_TRACKS = [
  {
    name: "Poranna mgła", bpm: 60, stepsPerBar: 8,
    chords: [["C3", "maj7"], ["A2", "min7"], ["F2", "maj7"], ["G2", "6"], ["C3", "maj7"], ["E3", "min7"], ["F2", "maj7"], ["G2", "6"]],
    arp: [0, null, 2, null, 1, null, 3, null], arpInst: "epiano", arpVol: 0.1, pad: true, padVol: 0.05,
    bass: [[0, 0]], bassInst: "bass", bassLen: 8, bassVol: 0.14, melodyInst: "soft", melodyVol: 0.085,
    melody: [
      [[0, "E4", 4], [4, "G4", 3]], [[0, "A4", 4], [4, "G4", 3]], [[0, "F4", 4], [4, "A4", 3]], [[0, "B4", 4], [4, "G4", 3]],
      [[0, "E4", 4], [4, "C5", 3]], [[0, "B4", 4], [4, "G4", 3]], [[0, "A4", 4], [4, "C5", 3]], [[0, "B4", 6]],
    ],
  },
  {
    name: "Leniwa fala", bpm: 66, stepsPerBar: 8, ocean: true,
    chords: [["D3", "maj7"], ["B2", "min7"], ["G2", "maj7"], ["A2", "add9"], ["D3", "maj7"], ["F#2", "min7"], ["G2", "maj7"], ["A2", "add9"]],
    arp: [0, null, null, 2, null, 1, null, null], arpInst: "epiano", arpVol: 0.09, pad: true, padVol: 0.05,
    bass: [[0, 0]], bassInst: "bass", bassLen: 8, bassVol: 0.14, melodyInst: "soft", melodyVol: 0.08,
    melody: [
      [[0, "F#4", 4], [4, "A4", 3]], [[0, "D5", 4], [4, "A4", 3]], [[0, "B4", 4], [4, "D5", 3]], [[0, "C#5", 4], [4, "E5", 3]],
      [[0, "A4", 4], [4, "F#4", 3]], [[0, "C#5", 4], [4, "A4", 3]], [[0, "B4", 4], [4, "G4", 3]], [[0, "E4", 6]],
    ],
  },
  {
    name: "Wieczorny spacer", bpm: 70, stepsPerBar: 8,
    chords: [["G2", "maj7"], ["E3", "min7"], ["C3", "maj7"], ["D3", "6"], ["G2", "maj7"], ["B2", "min7"], ["C3", "maj7"], ["D3", "6"]],
    arp: [0, null, 1, 2, null, 3, 2, null], arpInst: "epiano", arpVol: 0.085, pad: true, padVol: 0.045,
    bass: [[0, 0]], bassInst: "bass", bassLen: 8, bassVol: 0.14, melodyInst: "soft", melodyVol: 0.08,
    melody: [
      [[0, "D5", 3], [4, "B4", 4]], [[0, "G4", 3], [4, "B4", 4]], [[0, "E5", 3], [4, "D5", 4]], [[0, "F#4", 3], [4, "A4", 4]],
      [[0, "B4", 3], [4, "D5", 4]], [[0, "D5", 3], [4, "F#4", 4]], [[0, "G4", 3], [4, "E5", 4]], [[0, "D5", 7]],
    ],
  },
  {
    name: "Księżycowa herbata", bpm: 58, stepsPerBar: 8,
    chords: [["F2", "maj7"], ["E3", "min7"], ["D3", "min7"], ["C3", "maj7"], ["F2", "maj7"], ["A#2", "maj7"], ["G2", "min7"], ["C3", "6"]],
    arp: [0, null, null, 1, null, 2, null, null], arpInst: "epiano", arpVol: 0.09, pad: true, padVol: 0.055,
    bass: [[0, 0]], bassInst: "bass", bassLen: 8, bassVol: 0.14, melodyInst: "soft", melodyVol: 0.08,
    melody: [
      [[0, "C5", 4], [4, "A4", 3]], [[0, "B4", 4], [4, "G4", 3]], [[0, "A4", 4], [4, "F4", 3]], [[0, "G4", 4], [4, "E4", 3]],
      [[0, "A4", 4], [4, "C5", 3]], [[0, "D5", 4], [4, "A#4", 3]], [[0, "A#4", 4], [4, "D5", 3]], [[0, "C5", 6]],
    ],
  },
  {
    name: "Chmury nad morzem", bpm: 62, stepsPerBar: 8, ocean: true,
    chords: [["A2", "min7"], ["F2", "maj7"], ["C3", "maj7"], ["G2", "6"], ["A2", "min7"], ["F2", "maj7"], ["D3", "min7"], ["E3", "min7"]],
    arp: [0, null, null, null, 2, null, null, null], arpInst: "epiano", arpVol: 0.08, pad: true, padVol: 0.06,
    bass: [[0, 0]], bassInst: "bass", bassLen: 8, bassVol: 0.13, melodyInst: "soft", melodyVol: 0.075,
    melody: [
      [[0, "C5", 4], [4, "E5", 3]], [[0, "A4", 4], [4, "C5", 3]], [[0, "G4", 4], [4, "E4", 3]], [[0, "D5", 4], [4, "B4", 3]],
      [[0, "C5", 4], [4, "A4", 3]], [[0, "A4", 4], [4, "F4", 3]], [[0, "F5", 4], [4, "D5", 3]], [[0, "E5", 6]],
    ],
  },
];

/** Pure description of everything that sounds at one eighth of a track (easy to test, no audio needed). */
function musicEventsAt(track, stepInLoop) {
  const bar = Math.floor(stepInLoop / track.stepsPerBar);
  const position = stepInLoop % track.stepsPerBar;
  const eighth = 60 / track.bpm / 2;
  const root = noteMidi(track.chords[bar][0]);
  const tones = CHORD_TONES[track.chords[bar][1]].map((interval) => root + interval);
  const voices = [...tones, root + 12];
  const events = [];
  const add = (inst, midi, lengthInEighths, volume) =>
    events.push({ inst, freq: midi === null ? 0 : midiFreq(midi), dur: lengthInEighths * eighth, vol: volume, offset: 0 });

  track.bass.forEach(([bassPosition, semitones]) => {
    if (bassPosition === position) add(track.bassInst, root + semitones, track.bassLen, track.bassVol);
  });
  if (track.arp && track.arp[position] !== null && track.arp[position] !== undefined) add(track.arpInst, voices[track.arp[position]] + 12, 5, track.arpVol);
  if (track.pad && position === 0) tones.forEach((tonePitch) => add("pad", tonePitch + 12, track.stepsPerBar * 1.2, track.padVol));
  if (track.ocean && position === 0) add("swell", null, track.stepsPerBar, 0.035);
  track.melody[bar].forEach(([melodyPosition, name, length]) => {
    if (melodyPosition === position) add(track.melodyInst, noteMidi(name), length, track.melodyVol);
  });
  return events;
}

/** Sum of sine partials with an attack and an exponential decay, on the music bus. */
function partialsNote(frequency, time, duration, volume, partials, attack = 0.02) {
  const envelope = audioCtx.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(volume, time + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  envelope.connect(musicGain);
  partials.forEach(([multiple, level]) => {
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

function playMusicEvent(event, time) {
  const { inst, freq, dur, vol } = event;
  switch (inst) {
    case "epiano": // soft electric piano: mostly the fundamental, slow warm decay
      partialsNote(freq, time, Math.max(dur, 1.8), vol, [[1, 1], [2, 0.14], [3, 0.04]], 0.03);
      break;
    case "pad": // slow-swelling warm chord tone (two slightly detuned sines + an octave below)
      partialsNote(freq, time, dur, vol, [[1, 1], [1.003, 0.8], [0.5, 0.35]], 1.2);
      break;
    case "bass": // round sine bass
      partialsNote(freq, time, dur, vol, [[1, 1], [2, 0.12]], 0.12);
      break;
    case "soft": // gentle sine lead with a slow attack
      partialsNote(freq, time, Math.max(dur, 1.4), vol, [[1, 1], [2, 0.1]], 0.18);
      break;
    case "swell": { // faint, slow "ocean" wave: low-passed noise that rises and falls
      if (!noiseBuffer) {
        noiseBuffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 6), audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      }
      const source = audioCtx.createBufferSource();
      const filter = audioCtx.createBiquadFilter();
      const envelope = audioCtx.createGain();
      source.buffer = noiseBuffer;
      filter.type = "lowpass";
      filter.frequency.value = 700;
      envelope.gain.setValueAtTime(0.0001, time);
      envelope.gain.exponentialRampToValueAtTime(vol, time + dur * 0.5);
      envelope.gain.exponentialRampToValueAtTime(0.0001, time + dur * 1.1);
      source.connect(filter);
      filter.connect(envelope);
      envelope.connect(musicGain);
      source.start(time);
      source.stop(time + dur * 1.2);
      break;
    }
    default:
      break;
  }
}

/** A different random track than the current one. */
const nextTrackIndex = (current) => {
  const others = MUSIC_TRACKS.map((_, index) => index).filter((index) => index !== current);
  return others[Math.floor(Math.random() * others.length)];
};

function scheduleMusic() {
  if (!audioCtx) return;
  while (musicNextTime < audioCtx.currentTime + MUSIC_LOOKAHEAD_S) {
    const track = MUSIC_TRACKS[musicTrackIndex];
    const eighth = 60 / track.bpm / 2;
    const stepsInLoop = track.chords.length * track.stepsPerBar;
    const stepInLoop = musicStep % stepsInLoop;
    musicEventsAt(track, stepInLoop).forEach((event) => playMusicEvent(event, musicNextTime + event.offset));
    musicNextTime += eighth;
    musicStep++;
    if (musicStep >= stepsInLoop * MUSIC_LOOPS_PER_TRACK) {
      musicTrackIndex = nextTrackIndex(musicTrackIndex);
      musicStep = 0;
      musicNextTime += MUSIC_TRACK_GAP_S;
      updateMusicButton();
    }
  }
}

function startMusic() {
  if (!state.settings.music || isQuiet()) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  if (!musicTimer) {
    musicTrackIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
    musicNextTime = ctx.currentTime + 0.3;
    musicStep = 0;
    musicTimer = setInterval(scheduleMusic, MUSIC_TICK_MS);
    updateMusicButton();
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
  musicWanted = viewName !== "session" && viewName !== "game";
  applyMusicGain();
}

/** The speaker button in the top bar shows whether quiet mode is on. */
function updateMusicButton() {
  const button = $("#musicBtn");
  if (!button) return;
  const quiet = isQuiet();
  button.textContent = quiet ? "🔇" : "🔊";
  button.classList.toggle("off", quiet);
  button.setAttribute("aria-pressed", String(quiet));
  button.setAttribute("aria-label", quiet ? "Tryb cichy włączony – włącz dźwięk" : "Włącz tryb cichy");
  button.title = quiet ? "Tryb cichy: wszystkie dźwięki wyłączone" : "Tryb cichy (wyłącz wszystkie dźwięki)";
}

/** First user gesture: browsers allow audio only after it. */
function unlockAudio() {
  setTimeout(maybeWarnAboutSpeech, 400); // the reader can be tested only after a tap
  if (isQuiet()) return;
  ensureAudio();
  loadAnswerSounds(); // ready before the first answer
  if (state.settings.music) startMusic();
}

let quietNoticeShown = false;

/**
 * Quiet mode = "Brak dźwięku" in Profil (one setting, kept in both fields): no music, no effects,
 * no reader – so the exercises that need the reader are hidden.
 */
function setQuietMode(on) {
  quietNoticeShown = true; // the player has just chosen it – no reminder needed in this visit
  state.settings.quiet = on;
  state.settings.noSound = on;
  saveState();
  if (on) {
    stopMusic();
    if (speechAvailable()) speechSynthesis.cancel();
    if (audioCtx) audioCtx.suspend(); // cuts off anything still playing
  } else {
    if (audioCtx) audioCtx.resume();
    unlockAudio();
  }
  updateMusicButton();
  if (view !== "session" && view !== "game") render(true); // the list of exercises changes
}

const QUIET_TEXT = "Nie wszystkie ćwiczenia są dostępne – ćwiczeń z lektorem (np. Wskaż obrazek, Dyktando, zadania „posłuchaj”) nie zrobisz.";

function quietModalHtml(id, title, text, buttons) {
  return `
    <div class="modal-backdrop" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}Title">
      <div class="modal">
        <div class="modal-rychu">${rychuSvg("happy", 70)}</div>
        <h2 id="${id}Title">${title}</h2>
        <p>${text}</p>
        <div class="modal-actions">${buttons}</div>
      </div>
    </div>`;
}

function closeQuietModal(id) {
  closeModal(id);
  setPageInert(false);
}

/** The speaker button in the top bar. Switching quiet mode on first explains what it hides. */
function toggleQuiet() {
  if (isQuiet()) {
    setQuietMode(false);
    toast("🔊 Dźwięk włączony – ćwiczenia z lektorem znów są dostępne");
    return;
  }
  if ($("#quietAsk")) return;
  document.body.insertAdjacentHTML("beforeend", quietModalHtml("quietAsk", "🔇 Włączyć tryb cichy?",
    `Wszystkie dźwięki zostaną wyłączone: muzyka, efekty i lektor. <b>Ukryte zostaną wszystkie ćwiczenia z lektorem</b> (np. Wskaż obrazek, Dyktando, zadania „posłuchaj”). W Profilu zaznaczy się opcja „Tryb cichy”.`,
    `<button class="btn primary" data-action="quietConfirm">🔇 Włącz tryb cichy</button>
     <button class="btn" data-action="quietCancel">Anuluj</button>`));
  setPageInert(true);
  $("#quietAsk .btn.primary").focus();
}

function confirmQuiet() {
  closeQuietModal("quietAsk");
  setQuietMode(true);
  toast("🔇 Tryb cichy włączony");
}

/** Once per start of the app: a reminder that quiet mode is on. */

function maybeShowQuietNotice() {
  if (quietNoticeShown || !isQuiet()) return;
  if (["welcome", "session", "game"].includes(view) || $(".modal-backdrop") || $("#tutorial") || $("#celebrate")) return;
  quietNoticeShown = true;
  document.body.insertAdjacentHTML("beforeend", quietModalHtml("quietNotice", "🔇 Włączony jest tryb cichy", QUIET_TEXT,
    `<button class="btn primary" data-action="quietNoticeOk">OK</button>
     <button class="btn" data-action="quietNoticeSound">🔊 Włącz dźwięk</button>`));
  setPageInert(true);
  $("#quietNotice .btn.primary").focus();
}

function pauseAudioWhenHidden() {
  if (!audioCtx) return;
  if (document.hidden) audioCtx.suspend();
  else if (!isQuiet() && (state.settings.music || state.settings.sound)) audioCtx.resume();
}

// ====================================================================
// Speech: English words (Polish messages are deliberately not read aloud)
// ====================================================================
let quietHintAt = 0;

function speakText(text, lang, rate) {
  if (!speechAvailable() || !text) return;
  if (state.settings.quiet) {
    if (Date.now() - quietHintAt > 20000) toast("🔇 Tryb cichy – lektor milczy. Włącz dźwięk przyciskiem 🔇 u góry.");
    quietHintAt = Date.now();
    return;
  }
  try {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = lang.startsWith("en") ? englishVoice() : null;
    if (voice) utterance.voice = voice;
    utterance.lang = voice ? voice.lang : lang;
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

// ====================================================================
// Is the reader available on this device? (English voice + a silent test)
// ====================================================================
/** The best English voice: British first, then any English; local voices before network ones. */
function englishVoice() {
  if (!speechAvailable()) return null;
  const voices = speechSynthesis.getVoices().filter((voice) => /^en([-_]|$)/i.test(voice.lang));
  const score = (voice) => (/^en[-_]GB/i.test(voice.lang) ? 2 : 0) + (voice.localService ? 1 : 0);
  return voices.sort((a, b) => score(b) - score(a))[0] || null;
}

/** The voice list often arrives a moment later (and on iPhone only after a tap). */
function waitForVoices(timeoutMs = 2500) {
  return new Promise((resolve) => {
    if (!speechAvailable()) return resolve([]);
    const now = speechSynthesis.getVoices();
    if (now.length) return resolve(now);
    const done = () => resolve(speechSynthesis.getVoices());
    speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, timeoutMs);
  });
}

/**
 * Checks the reader without making a sound (volume 0).
 * @returns {Promise<{status: "ok"|"no-api"|"no-voice"|"error"|"unknown", voice: SpeechSynthesisVoice|null, detail?: string}>}
 * "unknown" = the browser did not let us test now (e.g. before the first tap) – never shown as a problem.
 */
async function checkSpeech({ audible = false } = {}) {
  if (!speechAvailable()) return { status: "no-api", voice: null };
  const voices = await waitForVoices();
  const voice = englishVoice();
  if (!voice) return { status: voices.length ? "no-voice" : "unknown", voice: null };
  return new Promise((resolve) => {
    let finished = false;
    const finish = (result) => { if (!finished) { finished = true; resolve(result); } };
    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(audible ? "Hello! I am your English reader." : "hi");
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.volume = audible ? 1 : 0;
      utterance.rate = audible ? 0.9 : 2;
      utterance.onstart = () => { if (!audible) { speechSynthesis.cancel(); finish({ status: "ok", voice }); } };
      utterance.onend = () => finish({ status: "ok", voice });
      utterance.onerror = (event) => finish(["not-allowed", "interrupted", "canceled"].includes(event.error)
        ? (audible && event.error !== "not-allowed" ? { status: "ok", voice } : { status: "unknown", voice })
        : { status: "error", voice, detail: event.error });
      speechSynthesis.speak(utterance);
      setTimeout(() => finish({ status: "unknown", voice }), audible ? 8000 : 3000);
    } catch {
      finish({ status: "error", voice });
    }
  });
}

const SPEECH_PROBLEMS = {
  "no-api": "Ta przeglądarka nie ma lektora (syntezatora mowy).",
  "no-voice": "Na tym urządzeniu nie ma angielskiego głosu lektora.",
  error: "Lektor na tym urządzeniu nie działa (np. głos wymaga internetu albo jest wyłączony).",
};

/** After the first tap: if the reader certainly does not work, offer quiet mode (once per kind of problem). */
let speechChecked = false;

async function maybeWarnAboutSpeech() {
  if (speechChecked || isQuiet()) return;
  speechChecked = true;
  const result = await checkSpeech();
  if (!SPEECH_PROBLEMS[result.status]) {
    if (state.settings.speechWarned) { delete state.settings.speechWarned; saveState(); }
    return;
  }
  if (state.settings.speechWarned === result.status) return; // already told about this problem
  const show = () => {
    if ($(".modal-backdrop") || $("#tutorial") || $("#celebrate") || ["welcome", "session", "game"].includes(view)) {
      setTimeout(show, 1500);
      return;
    }
    state.settings.speechWarned = result.status;
    saveState();
    document.body.insertAdjacentHTML("beforeend", quietModalHtml("speechWarn", "🗣️ Lektor nie działa",
      `${SPEECH_PROBLEMS[result.status]} Ćwiczenia z lektorem (Wskaż obrazek, Dyktando, zadania „posłuchaj”) mogą nie działać. Włączyć tryb cichy, który je ukryje?
       <br><small class="muted">Możesz to sprawdzić później w Profilu → „Sprawdź lektora”.</small>`,
      `<button class="btn primary" data-action="speechWarnQuiet">🔇 Włącz tryb cichy</button>
       <button class="btn" data-action="speechWarnKeep">Zostaw</button>`));
    setPageInert(true);
    $("#speechWarn .btn.primary").focus();
  };
  show();
}

/** Profil → "Sprawdź lektora": reads a sentence aloud and says which voice was found. */
async function testSpeech() {
  const box = $("#speechTest");
  if (!box) return;
  if (isQuiet()) {
    box.textContent = "🔇 Włączony jest tryb cichy – wyłącz go, żeby sprawdzić lektora.";
    return;
  }
  box.textContent = "⏳ Sprawdzam…";
  const result = await checkSpeech({ audible: true });
  const name = result.voice ? `${result.voice.name} (${result.voice.lang})` : "";
  box.textContent = result.status === "ok"
    ? `✔ Lektor działa: ${name}. Czy słychać było zdanie po angielsku? Jeśli nie – sprawdź głośność urządzenia.`
    : SPEECH_PROBLEMS[result.status] || `❔ Nie udało się sprawdzić lektora${name ? ` (głos: ${name})` : ""}. Spróbuj jeszcze raz.`;
}
