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
  const target = state.settings.music && !state.settings.noSound && musicWanted ? state.settings.musicVolume * MUSIC_BASE_GAIN * musicDuck : 0;
  try {
    musicGain.gain.setTargetAtTime(target, audioCtx.currentTime, fast ? 0.05 : 0.8);
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

/** A soft bell note (used by the "Powtórz melodię" game). */
function playNote(frequency, duration = 0.4) {
  if (!state.settings.sound || !ensureAudio()) return;
  try {
    tone(frequency, 0, duration, "sine", 0.16);
    tone(frequency * 2, 0, duration * 0.5, "sine", 0.035);
  } catch {
    /* audio not available – the game still works with colours */
  }
}

/** @param {"click"|"flip"|"ok"|"bad"|"pass"|"fanfare"|"badge"|"goal"|"gem"} name */
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

/** Correct / wrong answer sound (kept under the old name used by the exercises). */
const beep = (isCorrect) => sfx(isCorrect ? "ok" : "bad");

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
  if (!state.settings.music || state.settings.noSound) return;
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

function updateMusicButton() {
  const button = $("#musicBtn");
  if (!button) return;
  const playing = state.settings.music && !state.settings.noSound;
  button.textContent = playing ? "🎵" : "🔇";
  button.classList.toggle("off", !playing);
  button.setAttribute("aria-pressed", String(playing));
  button.title = playing && musicTimer ? `Muzyka: ${MUSIC_TRACKS[musicTrackIndex].name}` : "Muzyka w tle";
}

/** First user gesture: browsers allow audio only after it. */
function unlockAudio() {
  ensureAudio();
  if (state.settings.music) startMusic();
}

function toggleMusic() {
  if (state.settings.noSound) {
    toast("Włączony jest tryb „Brak dźwięku”. Wyłącz go w Profilu, aby słuchać muzyki.");
    return;
  }
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
