"use strict";

/**
 * "Moje gierki": short, gentle mini-games bought with gems.
 * A bought game can be played once, then it recharges after 3 finished exercises.
 * Every game works with touch, mouse and (where it helps) the keyboard arrows; graphics are drawn in code (no images).
 * Nobody gets hurt: flies float away in soap bubbles, cars only bump, the frog just hops back to the start.
 */
const GAME_PRICE = 12;
const GAME_RECHARGE_EXERCISES = 3;
const GAME_SECONDS = 20;
const SCORES_KEPT = 5;

/** Game tempo by class: 0–2 calm, 3–5 a bit faster, 6–8 faster again (never hectic). */
const gameSpeed = () => (currentGrade() <= 2 ? 1 : currentGrade() <= 5 ? 1.2 : 1.4);
const GAME_AUTO_RETURN_MS = 4500;
const EMOJI_FONT = `"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;

const GAMES = [
  { id: "tictactoe", name: "Kółko i krzyżyk", icon: "⭕", desc: "3 partie z Rychem", start: (api) => startTicTacToe(api) },
  { id: "bounce", name: "Odbijanka", icon: "🧱", desc: "Rozbijaj kolorowe klocki – 20 s", start: (api) => startBounce(api) },
  { id: "mosquito", name: "Komar i bańki", icon: "🦟", desc: "Zamknij muchy w bańkach – 20 s", start: (api) => startMosquito(api) },
  { id: "slingshot", name: "Jabłkowa proca", icon: "🍎", desc: "Traf jabłkiem w tarczę 3 razy", start: (api) => startSlingshot(api) },
  { id: "checkers", name: "Zagadka warcabowa", icon: "♟️", desc: "Zbij wszystkie pionki kilkoma skokami", start: (api) => startCheckers(api) },
  { id: "traffic", name: "Wymijanie", icon: "🚗", desc: "Omijaj samochody – 20 s", start: (api) => startTraffic(api) },
  { id: "balloons", name: "Balonowy festyn", icon: "🎈", desc: "Przekłuwaj balony – 20 s", start: (api) => startBalloons(api) },
  { id: "caterpillar", name: "Głodna gąsienica", icon: "🐛", desc: "Zbieraj listki – 20 s", start: (api) => startCaterpillar(api) },
  { id: "frog", name: "Żabka przez drogę", icon: "🐸", desc: "Przeprowadź żabkę na drugą stronę – 20 s", start: (api) => startFrog(api) },
  { id: "fruits", name: "Łapanie owoców", icon: "🧺", desc: "Łap owoce, omijaj kamyki – 20 s", start: (api) => startFruits(api) },
  { id: "memorydash", name: "Memory na czas", icon: "🃏", desc: "Znajdź jak najwięcej par – 20 s", start: (api) => startMemoryDash(api) },
  { id: "flight", name: "Lot Rycha", icon: "🦉", desc: "Przeleć przez bramki z chmurek – 20 s", start: (api) => startFlight(api) },
  { id: "melody", name: "Powtórz melodię", icon: "🔔", desc: "Zapamiętaj kolejność dzwoneczków", start: (api) => startMelody(api) },
  { id: "mole", name: "Kret mówi „cześć”", icon: "🥕", desc: "Przywitaj krety marchewką – 20 s", start: (api) => startMole(api) },
  { id: "maze", name: "Labirynt myszki", icon: "🧀", desc: "Doprowadź myszkę do sera – 20 s", start: (api) => startMaze(api) },
  { id: "tower", name: "Wieża z klocków", icon: "🏗️", desc: "Buduj jak najwyższą wieżę – 20 s", start: (api) => startTower(api) },
];

const gameById = (id) => GAMES.find((game) => game.id === id);

// ====================================================================
// Owning, recharging and test unlock
// ====================================================================
const isGameOwned = (id) => state.games.owned.includes(id);

// ---------- slow unlocking: every 3 finished exercises open 2 more rewards, at most 9 exercises a day count ----------
const UNLOCK_EVERY_EXERCISES = 3;
const UNLOCK_DAILY_MAX = 9;
const UNLOCK_PER_STEP = 2;
const UNLOCK_AT_START = 2;
/** Order in which reward "slots" open; games are the rarest. */
const UNLOCK_PATTERN = ["joke", "riddle", "joke", "riddle", "game"];

const unlockedSlots = (exercises) => UNLOCK_AT_START + UNLOCK_PER_STEP * Math.floor(exercises / UNLOCK_EVERY_EXERCISES);

/** How many rewards of a type ("joke" | "riddle" | "game") are unlocked after a number of exercises. */
function unlockedCount(type, exercises = state.games.unlockProgress) {
  const slots = unlockedSlots(exercises);
  let count = 0;
  for (let slot = 0; slot < slots; slot++) if (UNLOCK_PATTERN[slot % UNLOCK_PATTERN.length] === type) count++;
  return count;
}

/** Exercises still needed until at least `needed` rewards of the type are unlocked. */
function exercisesUntilUnlocked(type, needed) {
  if (state.testUnlock) return 0;
  const start = Number(state.games.unlockProgress) || 0;
  let exercises = start;
  // Safety limit: needed rewards always open within a few hundred exercises; never loop forever.
  while (unlockedCount(type, exercises) < needed && exercises - start < 10000) exercises++;
  return exercises - start;
}

/** May the pupil buy one more reward of this type? */
const canUnlockMore = (type, ownedCount) => state.testUnlock || ownedCount < unlockedCount(type);
const gameIndex = (id) => GAMES.findIndex((game) => game.id === id);
const isGameUnlocked = (id) => state.testUnlock || gameIndex(id) < unlockedCount("game");
const exercisesWord = (count) => (count === 1 ? "ćwiczenie" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? "ćwiczenia" : "ćwiczeń");

// ---------- scores ----------
/** Saves a result; returns whether it is a new record and the best score. */
function saveGameScore(id, score) {
  const list = state.games.scores[id] || [];
  const previousBest = list.length ? list[0].s : 0;
  list.push({ s: score, d: todayIso() });
  list.sort((a, b) => b.s - a.s);
  state.games.scores[id] = list.slice(0, SCORES_KEPT);
  saveState();
  return { isRecord: score > previousBest, best: state.games.scores[id][0].s };
}
const bestScore = (id) => (state.games.scores[id] && state.games.scores[id].length ? state.games.scores[id][0].s : null);

/** Exercises still needed before the game can be played again (0 = ready). */
function exercisesToRecharge(id) {
  if (state.testUnlock || !(id in state.games.charge)) return 0;
  return Math.max(0, GAME_RECHARGE_EXERCISES - (state.games.exercises - state.games.charge[id]));
}

const isGameReady = (id) => state.testUnlock || (isGameOwned(id) && exercisesToRecharge(id) === 0);

/** Called after every finished exercise (also learning-path steps) – recharges the games. */
function countExerciseForGames() {
  state.games.exercises++;
}

/** Exercises that may still count towards unlocking today (0 = today's limit reached). */
function unlockLeftToday() {
  const today = state.games.unlockToday;
  return today.day === todayIso() ? Math.max(0, UNLOCK_DAILY_MAX - today.count) : UNLOCK_DAILY_MAX;
}

/** Called after every finished exercise: moves unlocking on (within the daily limit). Returns true when new rewards opened. */
function countExerciseForUnlock() {
  if (unlockLeftToday() === 0) return false;
  const day = todayIso();
  if (state.games.unlockToday.day !== day) state.games.unlockToday = { day, count: 0 };
  state.games.unlockToday.count++;
  const before = unlockedSlots(state.games.unlockProgress);
  state.games.unlockProgress++;
  return unlockedSlots(state.games.unlockProgress) > before;
}

function buyGame(id) {
  const game = gameById(id);
  if (!game || isGameOwned(id)) return;
  if (!isGameUnlocked(id)) {
    sfx("bad");
    const missing = exercisesUntilUnlocked("game", gameIndex(id) + 1);
    toast(`🔒 Ta gierka odblokuje się za ${missing} ${exercisesWord(missing)}.`);
    return;
  }
  if (state.gems < GAME_PRICE) {
    sfx("bad");
    toast(`Brakuje ${GAME_PRICE - state.gems} 💎. Zrób zadanie dnia!`);
    return;
  }
  state.gems -= GAME_PRICE;
  state.games.owned.push(id);
  saveState();
  sfx("badge");
  toast(`🎮 Masz nową gierkę: ${game.name}!`);
  setTimeout(announceBadges, 2500);
  render(true);
}

let currentGameId = null;
/** The running game (its api), so it can be stopped when the view changes. */
let activeGame = null;

function playGame(id) {
  if (!isGameReady(id)) {
    sfx("bad");
    toast(isGameOwned(id) ? `Gierka się ładuje – zrób jeszcze ${exercisesToRecharge(id)} ${exercisesWord(exercisesToRecharge(id))}.` : "Najpierw kup tę gierkę w sklepiku.");
    return;
  }
  if (!state.testUnlock) state.games.charge[id] = state.games.exercises;
  state.games.plays[id] = (state.games.plays[id] || 0) + 1;
  saveState();
  setTimeout(announceBadges, 600);
  currentGameId = id;
  view = "game";
  render();
}

function stopActiveGame() {
  if (activeGame) activeGame.stop();
  activeGame = null;
}

/** Test mode (experimental functions): every joke, riddle and game unlocked, games never need recharging. */
function setTestUnlock(isOn) {
  state.testUnlock = isOn;
  if (isOn) {
    const addAll = (owned, ids) => ids.forEach((id) => { if (!owned.includes(id)) owned.push(id); });
    addAll(state.jokes.owned, JOKES.map((joke) => joke.id));
    addAll(state.riddles.owned, RIDDLES.map((riddle) => riddle.id));
    addAll(state.games.owned, GAMES.map((game) => game.id));
  }
  saveState();
  toast(isOn ? "🧪 Wszystkie nagrody odblokowane (tryb testowy)." : "Tryb testowy wyłączony – gierki znów się ładują po ćwiczeniach.");
}

// ====================================================================
// Game screen and shared engine
// ====================================================================
function renderGame() {
  const game = gameById(currentGameId);
  app.innerHTML = `
    <div class="game-head">
      <button class="btn ghost round" data-action="quitGame" aria-label="Wróć do nagród">✕</button>
      <b class="game-title">${game.icon} ${esc(game.name)}</b>
      <span class="game-info" id="gameInfo" aria-live="polite"></span>
    </div>
    <div class="game-stage" id="gameStage"></div>
    <p class="muted small center-text game-help" id="gameHelp"></p>`;
  activeGame = makeGameApi(game);
  game.start(activeGame);
}

function makeGameApi(game) {
  const stage = $("#gameStage");
  const cleanups = [];
  let finished = false;
  const api = {
    stage,
    timeLeft: GAME_SECONDS,
    get finished() { return finished; },
    setInfo: (text) => { const info = $("#gameInfo"); if (info) info.textContent = text; },
    setHelp: (text) => { const help = $("#gameHelp"); if (help) help.textContent = text; },

    /** Canvas in logical pixels, sharp on high-density screens. */
    canvas(width, height) {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.className = "game-canvas";
      canvas.style.aspectRatio = `${width} / ${height}`;
      canvas.logicalWidth = width;
      canvas.logicalHeight = height;
      const ctx = canvas.getContext("2d");
      ctx.scale(ratio, ratio);
      stage.appendChild(canvas);
      return { canvas, ctx, width, height };
    },

    /** Pointer (touch + mouse) in the element's logical coordinates. */
    onPointer(element, { down = () => {}, move = () => {}, up = () => {} }) {
      let isDown = false;
      const point = (event) => {
        const rect = element.getBoundingClientRect();
        const width = element.logicalWidth || rect.width;
        const height = element.logicalHeight || rect.height;
        return { x: ((event.clientX - rect.left) * width) / rect.width, y: ((event.clientY - rect.top) * height) / rect.height };
      };
      const onDown = (event) => {
        event.preventDefault();
        isDown = true;
        if (element.setPointerCapture) element.setPointerCapture(event.pointerId);
        down(point(event));
      };
      const onMove = (event) => move(point(event), isDown);
      const onUp = (event) => {
        if (!isDown) return;
        isDown = false;
        up(point(event));
      };
      element.addEventListener("pointerdown", onDown);
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerup", onUp);
      element.addEventListener("pointercancel", onUp);
      cleanups.push(() => {
        element.removeEventListener("pointerdown", onDown);
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerup", onUp);
        element.removeEventListener("pointercancel", onUp);
      });
    },

    onKey(handler) {
      const listener = (event) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
          event.preventDefault();
          handler(event.key);
        }
      };
      document.addEventListener("keydown", listener);
      cleanups.push(() => document.removeEventListener("keydown", listener));
    },

    onClick(element, handler) {
      element.addEventListener("click", handler);
      cleanups.push(() => element.removeEventListener("click", handler));
    },

    /** Animation loop; update(dt in seconds, already sped up for older classes – see gameSpeed). */
    loop(update) {
      let last = performance.now();
      let frameId = 0;
      let running = true;
      const tempo = gameSpeed();
      const frame = (now) => {
        if (!running) return;
        const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;
        update(dt * tempo);
        frameId = requestAnimationFrame(frame);
      };
      frameId = requestAnimationFrame(frame);
      cleanups.push(() => { running = false; cancelAnimationFrame(frameId); });
    },

    /** Countdown shown by the game; onEnd is called once. */
    countdown(seconds, onEnd) {
      const endAt = performance.now() + seconds * 1000;
      api.timeLeft = seconds;
      const timerId = setInterval(() => {
        api.timeLeft = Math.max(0, Math.ceil((endAt - performance.now()) / 1000));
        if (api.timeLeft <= 0) {
          clearInterval(timerId);
          onEnd();
        }
      }, 100);
      cleanups.push(() => clearInterval(timerId));
    },

    later(callback, delayMs) {
      const timeoutId = setTimeout(() => { if (!finished) callback(); }, delayMs);
      cleanups.push(() => clearTimeout(timeoutId));
    },

    /** Ends the game: summary with points and record, then back to "Nagrody". */
    finish(message, score = 0) {
      if (finished) return;
      finished = true;
      api.stop();
      const points = Math.max(0, Math.round(score));
      const result = saveGameScore(game.id, points);
      sfx(result.isRecord ? "badge" : "fanfare");
      const overlay = document.createElement("div");
      overlay.className = "game-over";
      overlay.innerHTML = `<div class="game-over-box">
          <div class="game-over-icon">${result.isRecord ? "🏆" : game.icon}</div>
          <p>${esc(message)}</p>
          <p class="game-score">⭐ Punkty: <b>${points}</b></p>
          <p class="game-record ${result.isRecord ? "new" : ""}">${result.isRecord ? "🎉 Nowy rekord!" : `🏆 Twój rekord: ${result.best}`}</p>
          <button class="btn primary big" data-action="quitGame">← Wróć do nagród</button>
        </div>`;
      stage.appendChild(overlay);
      const gameId = game.id;
      setTimeout(() => {
        if (view === "game" && currentGameId === gameId && activeGame === api) goTo("rewards");
      }, GAME_AUTO_RETURN_MS);
    },

    stop() {
      cleanups.splice(0).forEach((cleanup) => cleanup());
    },
  };
  return api;
}

// ---------- drawing helpers ----------
function roundRect(ctx, x, y, width, height, radius, fill) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawEmoji(ctx, emoji, x, y, size) {
  ctx.font = `${size}px ${EMOJI_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, x, y);
}

function skyBackground(ctx, width, height, top, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

const PASTELS = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];
const randomBetween = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Arrow buttons under the canvas for games moved step by step (caterpillar, frog). */
function arrowPad(api, onArrow) {
  const pad = document.createElement("div");
  pad.className = "arrow-pad";
  pad.innerHTML = [["ArrowUp", "⬆️", "Do góry"], ["ArrowLeft", "⬅️", "W lewo"], ["ArrowDown", "⬇️", "W dół"], ["ArrowRight", "➡️", "W prawo"]]
    .map(([key, icon, label]) => `<button class="btn arrow-btn" data-key="${key}" aria-label="${label}">${icon}</button>`).join("");
  api.stage.appendChild(pad);
  pad.addEventListener("pointerdown", (event) => {
    const button = event.target.closest("[data-key]");
    if (!button) return;
    event.preventDefault();
    onArrow(button.dataset.key);
  });
  api.onKey(onArrow);
}

/** Swipe on a canvas -> arrow key; a short tap calls onTap(point). */
function swipeControls(api, canvas, onArrow, onTap) {
  let start = null;
  api.onPointer(canvas, {
    down: (point) => { start = point; },
    up: (point) => {
      if (!start) return;
      const dx = point.x - start.x;
      const dy = point.y - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) {
        if (onTap) onTap(point);
      } else if (Math.abs(dx) > Math.abs(dy)) {
        onArrow(dx > 0 ? "ArrowRight" : "ArrowLeft");
      } else {
        onArrow(dy > 0 ? "ArrowDown" : "ArrowUp");
      }
      start = null;
    },
  });
}

// ====================================================================
// 1. Tic-tac-toe – 3 games against Rychu
// ====================================================================
function startTicTacToe(api) {
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const ROUNDS = 3;
  const score = { win: 0, draw: 0, lose: 0 };
  let round = 1;
  let board = [];
  let locked = false;

  const winnerOf = (cells) => {
    for (const [a, b, c] of LINES) if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
    return cells.every(Boolean) ? "draw" : null;
  };
  const updateInfo = () => api.setInfo(`Partia ${round}/${ROUNDS} · 🏆 ${score.win} · 🤝 ${score.draw} · 🦉 ${score.lose}`);

  /** Rychu plays well, but not perfectly – children can win. */
  function rychuMove() {
    const empty = board.map((cell, index) => (cell ? -1 : index)).filter((index) => index >= 0);
    const winningFor = (mark) => empty.find((index) => { const copy = [...board]; copy[index] = mark; return winnerOf(copy) === mark; });
    let move = winningFor("O");
    if (move === undefined && Math.random() < 0.7) move = winningFor("X");
    if (move === undefined && !board[4] && Math.random() < 0.5) move = 4;
    if (move === undefined) move = shuffle(empty)[0];
    board[move] = "O";
  }

  function draw(message) {
    api.stage.innerHTML = `
      <p class="game-msg">${esc(message)}</p>
      <div class="ttt">${board.map((cell, index) => `<button class="ttt-cell ${cell ? "taken" : ""}" data-cell="${index}" aria-label="Pole ${index + 1}">${cell === "X" ? "❌" : cell === "O" ? "⭕" : ""}</button>`).join("")}</div>`;
    updateInfo();
  }

  function endRound(result) {
    locked = true;
    if (result === "X") { score.win++; sfx("pass"); }
    else if (result === "O") { score.lose++; sfx("flip"); }
    else { score.draw++; sfx("ok"); }
    draw(result === "X" ? "Wygrałeś tę partię! 🎉" : result === "O" ? "Tym razem wygrał Rychu 🦉" : "Remis! 🤝");
    api.later(() => {
      if (round === ROUNDS) {
        api.finish(`Koniec! Wygrane: ${score.win}, remisy: ${score.draw}, przegrane: ${score.lose}.`, score.win * 3 + score.draw);
        return;
      }
      round++;
      newRound();
    }, 1400);
  }

  function newRound() {
    board = Array(9).fill(null);
    locked = false;
    const rychuStarts = round === 2;
    if (rychuStarts) rychuMove();
    draw(rychuStarts ? "Rychu zaczął. Twój ruch – jesteś ❌" : "Zaczynasz! Jesteś ❌");
  }

  api.onClick(api.stage, (event) => {
    const cell = event.target.closest("[data-cell]");
    if (!cell || locked) return;
    const index = Number(cell.dataset.cell);
    if (board[index]) return;
    board[index] = "X";
    sfx("click");
    let result = winnerOf(board);
    if (result) { endRound(result); return; }
    rychuMove();
    result = winnerOf(board);
    if (result) { endRound(result); return; }
    draw("Twój ruch ❌");
  });
  api.setHelp("Ułóż trzy ❌ w rzędzie – poziomo, pionowo albo na ukos.");
  newRound();
}

// ====================================================================
// 2. Bounce – a gentle brick-breaker
// ====================================================================
function startBounce(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  const COLS = 6;
  const ROWS = 5;
  const paddle = { x: width / 2, y: height - 34, w: 84, h: 14 };
  const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 8, stuck: true };
  let bricks = [];
  let score = 0;
  let launchIn = 0.8;
  let message = "";
  let messageTime = 0;

  function buildWall() {
    bricks = [];
    const brickWidth = (width - 20 - (COLS - 1) * 6) / COLS;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) bricks.push({ x: 10 + col * (brickWidth + 6), y: 50 + row * 24, w: brickWidth, h: 18, color: PASTELS[(row + col) % PASTELS.length], alive: true });
    }
  }
  function resetBall() {
    ball.stuck = true;
    launchIn = 0.8;
  }
  api.onPointer(canvas, {
    down: (point) => { paddle.x = point.x; },
    move: (point) => { paddle.x = point.x; },
  });
  api.onKey((key) => {
    if (key === "ArrowLeft") paddle.x -= 36;
    if (key === "ArrowRight") paddle.x += 36;
  });

  api.loop((dt) => {
    paddle.x = clamp(paddle.x, paddle.w / 2, width - paddle.w / 2);
    if (ball.stuck) {
      ball.x = paddle.x;
      ball.y = paddle.y - ball.r - 2;
      launchIn -= dt;
      if (launchIn <= 0) {
        ball.stuck = false;
        const angle = randomBetween(-0.6, 0.6);
        ball.vx = Math.sin(angle) * 250;
        ball.vy = -Math.cos(angle) * 250;
      }
    } else {
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.x < ball.r || ball.x > width - ball.r) { ball.vx *= -1; ball.x = clamp(ball.x, ball.r, width - ball.r); }
      if (ball.y < ball.r) { ball.vy = Math.abs(ball.vy); }
      const hitsPaddle = ball.vy > 0 && ball.y + ball.r >= paddle.y && ball.y < paddle.y + paddle.h && Math.abs(ball.x - paddle.x) < paddle.w / 2 + ball.r;
      if (hitsPaddle) {
        const offset = (ball.x - paddle.x) / (paddle.w / 2);
        const speed = Math.min(360, Math.hypot(ball.vx, ball.vy) + 5);
        ball.vx = offset * speed * 0.8;
        ball.vy = -Math.sqrt(Math.max(1, speed * speed - ball.vx * ball.vx));
        sfx("click");
      }
      for (const brick of bricks) {
        if (!brick.alive) continue;
        if (ball.x + ball.r > brick.x && ball.x - ball.r < brick.x + brick.w && ball.y + ball.r > brick.y && ball.y - ball.r < brick.y + brick.h) {
          brick.alive = false;
          score++;
          ball.vy *= -1;
          sfx("ok");
          break;
        }
      }
      if (bricks.every((brick) => !brick.alive)) {
        buildWall();
        message = "Nowa ściana! 🎉";
        messageTime = 1.2;
        resetBall();
      }
      if (ball.y > height + 20) {
        message = "Ups! Piłka uciekła";
        messageTime = 1;
        resetBall();
      }
    }
    messageTime -= dt;

    skyBackground(ctx, width, height, "#e7f5ff", "#fff0f6");
    bricks.filter((brick) => brick.alive).forEach((brick) => roundRect(ctx, brick.x, brick.y, brick.w, brick.h, 6, brick.color));
    roundRect(ctx, paddle.x - paddle.w / 2, paddle.y, paddle.w, paddle.h, 7, "#5b6cff");
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ff8fab";
    ctx.fill();
    if (messageTime > 0) {
      ctx.fillStyle = "#1f2340";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(message, width / 2, height / 2);
    }
    api.setInfo(`⏱ ${api.timeLeft} s · 🧱 ${score}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Rozbiłeś ${score} klocków! 🧱`, score));
  api.setHelp("Przesuwaj paletkę palcem, myszką albo strzałkami.");
  buildWall();
  resetBall();
}

// ====================================================================
// 3. Mosquito and bubbles – flies float away in soap bubbles
// ====================================================================
function drawMosquito(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(200, 230, 255, .8)";
  ctx.beginPath(); ctx.ellipse(-12, -10, 12, 6, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(12, -10, 12, 6, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#8d6e63";
  ctx.beginPath(); ctx.ellipse(0, 4, 8, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#6d4c41";
  ctx.beginPath(); ctx.arc(0, -14, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(-3, -16, 3, 0, Math.PI * 2); ctx.arc(3, -16, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1f2340";
  ctx.beginPath(); ctx.arc(-3, -16, 1.4, 0, Math.PI * 2); ctx.arc(3, -16, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#6d4c41";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(0, -32); ctx.stroke();
  ctx.restore();
}

function drawFly(ctx, x, y, flap) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(220, 240, 255, .9)";
  ctx.beginPath(); ctx.ellipse(-9, -8, 9, 5 + flap, -0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(9, -8, 9, 5 + flap, 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#4a5568";
  ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#e53e3e";
  ctx.beginPath(); ctx.arc(-4, -3, 3.5, 0, Math.PI * 2); ctx.arc(4, -3, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 3, 4, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.restore();
}

function startMosquito(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  const player = { x: width / 2, target: width / 2, y: height - 46 };
  let flies = [];
  let bubbles = [];
  let floating = [];
  let direction = 1;
  let waveSpeed = 40;
  let shootIn = 0;
  let score = 0;
  let time = 0;

  function newWave() {
    flies = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) flies.push({ x: 50 + col * 52, y: 60 + row * 44 });
    }
  }
  function shoot() {
    bubbles.push({ x: player.x, y: player.y - 30, r: 7 });
    shootIn = 0.45;
  }
  api.onPointer(canvas, {
    down: (point) => { player.target = point.x; if (shootIn < 0.25) shoot(); },
    move: (point) => { player.target = point.x; },
  });
  api.onKey((key) => {
    if (key === "ArrowLeft") player.target -= 40;
    if (key === "ArrowRight") player.target += 40;
    if (key === " " || key === "ArrowUp") shoot();
  });

  api.loop((dt) => {
    time += dt;
    player.target = clamp(player.target, 24, width - 24);
    player.x += (player.target - player.x) * Math.min(1, dt * 12);
    shootIn -= dt;
    if (shootIn <= 0) shoot();
    bubbles.forEach((bubble) => { bubble.y -= 320 * dt; });
    let edge = false;
    flies.forEach((fly) => {
      fly.x += direction * waveSpeed * dt;
      if (fly.x < 20 || fly.x > width - 20) edge = true;
    });
    if (edge) {
      direction *= -1;
      flies.forEach((fly) => { fly.y += 12; fly.x = clamp(fly.x, 20, width - 20); });
    }
    for (const bubble of bubbles) {
      const hit = flies.find((fly) => Math.hypot(fly.x - bubble.x, fly.y - bubble.y) < 20);
      if (hit) {
        flies = flies.filter((fly) => fly !== hit);
        floating.push({ x: hit.x, y: hit.y, age: 0 });
        bubble.used = true;
        score++;
        sfx("ok");
      }
    }
    bubbles = bubbles.filter((bubble) => !bubble.used && bubble.y > -10);
    floating.forEach((item) => { item.age += dt; item.y -= 90 * dt; item.x += Math.sin(item.age * 6) * 0.8; });
    floating = floating.filter((item) => item.y > -40);
    if (flies.length === 0) {
      waveSpeed += 15;
      newWave();
    }
    if (flies.some((fly) => fly.y > height - 110)) newWave(); // the flies get bored and fly back up

    skyBackground(ctx, width, height, "#e3fafc", "#f4fce3");
    flies.forEach((fly) => drawFly(ctx, fly.x, fly.y, Math.sin(time * 30) * 2));
    floating.forEach((item) => {
      drawFly(ctx, item.x, item.y, 0);
      ctx.beginPath();
      ctx.arc(item.x, item.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(160, 196, 255, .35)";
      ctx.fill();
      ctx.strokeStyle = "rgba(91, 108, 255, .6)";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (item.age < 1) {
        ctx.fillStyle = "#5b6cff";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("pa, pa! 👋", item.x, item.y - 28);
      }
    });
    bubbles.forEach((bubble) => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(155, 246, 255, .55)";
      ctx.fill();
      ctx.strokeStyle = "#4dabf7";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    drawMosquito(ctx, player.x, player.y);
    api.setInfo(`⏱ ${api.timeLeft} s · 🫧 ${score}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`${score} much odleciało w bańkach! 🫧`, score));
  api.setHelp("Przesuwaj komara – sam puszcza bańki. Dotknięcie = dodatkowa bańka.");
  newWave();
}

// ====================================================================
// 4. Apple slingshot – hit the target 3 times
// ====================================================================
function startSlingshot(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  const anchor = { x: 80, y: 360 };
  const GRAVITY = 520;
  const NEEDED_HITS = 3;
  const MAX_SHOTS = 15;
  const apple = { x: anchor.x, y: anchor.y, vx: 0, vy: 0, flying: false, r: 13 };
  const target = { x: 280, y: 220, r: 30, phase: 0 };
  let dragging = false;
  let hits = 0;
  let shots = 0;
  let points = 0;
  let message = "";
  let messageTime = 0;

  function placeTarget() {
    target.x = randomBetween(220, 320);
    target.y = randomBetween(110, 330);
  }
  function resetApple() {
    Object.assign(apple, { x: anchor.x, y: anchor.y, vx: 0, vy: 0, flying: false });
  }
  function pulled(point) {
    const dx = point.x - anchor.x;
    const dy = point.y - anchor.y;
    const length = Math.hypot(dx, dy);
    const max = 90;
    return length > max ? { x: anchor.x + (dx / length) * max, y: anchor.y + (dy / length) * max } : point;
  }
  api.onPointer(canvas, {
    down: (point) => { if (!apple.flying && Math.hypot(point.x - apple.x, point.y - apple.y) < 70) dragging = true; },
    move: (point, isDown) => {
      if (!dragging || !isDown) return;
      const position = pulled(point);
      apple.x = position.x;
      apple.y = position.y;
    },
    up: () => {
      if (!dragging) return;
      dragging = false;
      const dx = anchor.x - apple.x;
      const dy = anchor.y - apple.y;
      if (Math.hypot(dx, dy) < 12) { resetApple(); return; }
      apple.vx = dx * 7.5;
      apple.vy = dy * 7.5;
      apple.flying = true;
      shots++;
      sfx("flip");
    },
  });

  api.loop((dt) => {
    target.phase += dt;
    const targetY = target.y + (hits > 0 ? Math.sin(target.phase * 1.6) * 30 : 0);
    if (apple.flying) {
      apple.vy += GRAVITY * dt;
      apple.x += apple.vx * dt;
      apple.y += apple.vy * dt;
      const distance = Math.hypot(apple.x - target.x, apple.y - targetY);
      if (distance < target.r + apple.r * 0.6) {
        hits++;
        const gained = distance < target.r * 0.4 ? 10 : distance < target.r * 0.75 ? 5 : 3;
        points += gained;
        sfx("pass");
        message = `${gained === 10 ? "W sam środek!" : "Trafione!"} +${gained} 🎯`;
        messageTime = 1.2;
        resetApple();
        if (hits >= NEEDED_HITS) api.later(() => api.finish(`Brawo! 3 trafienia w ${shots} rzutach! 🎯`, points + Math.max(0, (NEEDED_HITS + 3 - shots) * 2)), 900);
        else placeTarget();
      } else if (apple.y > height + 30 || apple.x > width + 30 || apple.x < -30) {
        message = "Pudło – spróbuj jeszcze raz!";
        messageTime = 1;
        resetApple();
        if (shots >= MAX_SHOTS) api.finish(`Trafienia: ${hits} z ${NEEDED_HITS}. Następnym razem się uda! 🍎`, points);
      }
    }
    messageTime -= dt;

    skyBackground(ctx, width, height, "#d0ebff", "#ebfbee");
    ctx.fillStyle = "#b2f2bb";
    ctx.fillRect(0, height - 60, width, 60);
    [target.r, target.r * 0.66, target.r * 0.33].forEach((radius, index) => {
      ctx.beginPath();
      ctx.arc(target.x, targetY, radius, 0, Math.PI * 2);
      ctx.fillStyle = ["#ff8787", "#ffffff", "#ff8787"][index];
      ctx.fill();
    });
    ctx.strokeStyle = "#868e96";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(target.x, targetY + target.r); ctx.lineTo(target.x, height - 60); ctx.stroke();
    // slingshot
    ctx.strokeStyle = "#a0522d";
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(anchor.x, height - 60); ctx.lineTo(anchor.x, anchor.y + 30); ctx.lineTo(anchor.x - 18, anchor.y - 6); ctx.moveTo(anchor.x, anchor.y + 30); ctx.lineTo(anchor.x + 18, anchor.y - 6); ctx.stroke();
    if (dragging) {
      ctx.strokeStyle = "#5c3d2e";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(anchor.x - 18, anchor.y - 6); ctx.lineTo(apple.x, apple.y); ctx.lineTo(anchor.x + 18, anchor.y - 6); ctx.stroke();
      // dotted path preview
      let px = apple.x;
      let py = apple.y;
      let vx = (anchor.x - apple.x) * 7.5;
      let vy = (anchor.y - apple.y) * 7.5;
      ctx.fillStyle = "rgba(91, 108, 255, .5)";
      for (let i = 0; i < 14; i++) {
        vy += GRAVITY * 0.05;
        px += vx * 0.05;
        py += vy * 0.05;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
      }
    }
    drawEmoji(ctx, "🍎", apple.x, apple.y, 28);
    if (messageTime > 0) {
      ctx.fillStyle = "#1f2340";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(message, width / 2, 60);
    }
    api.setInfo(`🎯 ${hits}/${NEEDED_HITS} · 🍎 ${shots} · ⭐ ${points}`);
  });
  api.setHelp("Złap jabłko, odciągnij do tyłu i puść. Kropki pokazują lot.");
  placeTarget();
}

// ====================================================================
// 5. Checkers puzzle – a random position every time: capture as many black pieces as possible in one series of jumps
// ====================================================================
const CHECKERS_SIZE = 8;
const CHECKERS_PUZZLES = 3;
const DIAGONALS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const checkersInside = (row, col) => row >= 0 && col >= 0 && row < CHECKERS_SIZE && col < CHECKERS_SIZE;
const pieceAt = (pieces, row, col) => pieces.find((piece) => piece.row === row && piece.col === col);

/** Possible single jumps of the white piece: over a black piece onto a free square. */
function checkersJumps(white, blacks) {
  return DIAGONALS
    .map(([dr, dc]) => ({ mid: pieceAt(blacks, white.row + dr, white.col + dc), row: white.row + 2 * dr, col: white.col + 2 * dc }))
    .filter((move) => move.mid && checkersInside(move.row, move.col) && !pieceAt(blacks, move.row, move.col));
}

/** The longest capture series from this position (captured pieces disappear as you go). */
function longestCapture(white, blacks) {
  let best = 0;
  for (const move of checkersJumps(white, blacks)) {
    best = Math.max(best, 1 + longestCapture({ row: move.row, col: move.col }, blacks.filter((piece) => piece !== move.mid)));
  }
  return best;
}

/** Difficulty by class: length of the main capture chain and number of "dead-end" pieces. */
function checkersLevel() {
  const grade = currentGrade();
  if (grade <= 2) return { jumps: [2, 3], decoys: [1, 1] };
  if (grade <= 5) return { jumps: [3, 4], decoys: [1, 2] };
  return { jumps: [4, 5], decoys: [2, 3] };
}
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

/**
 * Random puzzle: a chain of jumps for the white piece, plus extra black pieces that lead into dead ends.
 * target = the best possible number of captures (checked by a full search).
 */
function makeCheckersPuzzle(jumps, decoys = 0) {
  for (let attempt = 0; attempt < 500; attempt++) {
    const row = Math.floor(Math.random() * CHECKERS_SIZE);
    const start = { row, col: Math.floor(Math.random() * 4) * 2 + (row % 2 === 0 ? 1 : 0) };
    const used = new Set([`${start.row},${start.col}`]);
    const blacks = [];
    const path = [start];
    let position = start;
    let isValid = true;
    for (let jump = 0; jump < jumps; jump++) {
      const options = shuffle(DIAGONALS).filter(([dr, dc]) => checkersInside(position.row + 2 * dr, position.col + 2 * dc) &&
        !used.has(`${position.row + dr},${position.col + dc}`) && !used.has(`${position.row + 2 * dr},${position.col + 2 * dc}`));
      if (options.length === 0) { isValid = false; break; }
      const [dr, dc] = options[0];
      blacks.push({ row: position.row + dr, col: position.col + dc });
      position = { row: position.row + 2 * dr, col: position.col + 2 * dc };
      used.add(`${blacks[blacks.length - 1].row},${blacks[blacks.length - 1].col}`);
      used.add(`${position.row},${position.col}`);
      path.push(position);
    }
    if (!isValid) continue;
    // dead ends: an extra piece next to the path that can be captured, but leads nowhere
    let placed = 0;
    for (let decoy = 0; decoy < decoys; decoy++) {
      const from = path[Math.floor(Math.random() * (path.length - 1))];
      const options = shuffle(DIAGONALS).filter(([dr, dc]) => checkersInside(from.row + 2 * dr, from.col + 2 * dc) &&
        !used.has(`${from.row + dr},${from.col + dc}`) && !used.has(`${from.row + 2 * dr},${from.col + 2 * dc}`));
      if (options.length === 0) continue;
      const [dr, dc] = options[0];
      blacks.push({ row: from.row + dr, col: from.col + dc });
      used.add(`${from.row + dr},${from.col + dc}`);
      used.add(`${from.row + 2 * dr},${from.col + 2 * dc}`);
      placed++;
    }
    if (placed < decoys) continue;
    const target = longestCapture(start, blacks);
    if (target >= jumps) return { start, blacks: shuffle(blacks), path, target };
  }
  return null;
}

function startCheckers(api) {
  const level = checkersLevel();
  let puzzleIndex = 0;
  let puzzle = null;
  let white = null;
  let blacks = [];
  let captured = 0;
  let tries = 0;
  let points = 0;
  let solved = 0;
  let showHints = false;

  const key = (row, col) => `${row},${col}`;
  /** Hint: only jumps that still allow the best result. */
  const bestJumps = () => checkersJumps(white, blacks)
    .filter((move) => 1 + longestCapture({ row: move.row, col: move.col }, blacks.filter((piece) => piece !== move.mid)) === puzzle.target - captured);

  function loadPuzzle() {
    puzzle = makeCheckersPuzzle(randomInt(...level.jumps), randomInt(...level.decoys));
    tries = 0;
    showHints = false;
    restart("Dotknij pola, na które ma skoczyć biały pionek.");
  }
  function restart(message) {
    white = { ...puzzle.start };
    blacks = puzzle.blacks.map((piece) => ({ ...piece }));
    captured = 0;
    draw(message);
  }

  function draw(message) {
    const hinted = showHints ? new Set(bestJumps().map((move) => key(move.row, move.col))) : new Set();
    let cells = "";
    for (let row = 0; row < CHECKERS_SIZE; row++) {
      for (let col = 0; col < CHECKERS_SIZE; col++) {
        const dark = (row + col) % 2 === 1;
        const piece = white.row === row && white.col === col ? `<span class="piece white">⚪</span>` : pieceAt(blacks, row, col) ? `<span class="piece black">⚫</span>` : "";
        cells += `<button class="chk-cell ${dark ? "dark" : "light"} ${hinted.has(key(row, col)) ? "hint" : ""}" data-row="${row}" data-col="${col}" ${dark ? "" : "tabindex=\"-1\""}>${piece}</button>`;
      }
    }
    api.stage.innerHTML = `
      <p class="game-msg">${esc(message)}</p>
      <div class="chk-board">${cells}</div>
      <div class="row center"><button class="btn" data-chk="restart">↺ Od nowa</button><button class="btn ghost" data-chk="hint">💡 Podpowiedź</button></div>`;
    api.setInfo(`Zagadka ${puzzleIndex + 1}/${CHECKERS_PUZZLES} · 🎯 zbij ${puzzle.target} · ✅ ${captured} · ⭐ ${points}`);
  }

  function nextPuzzle() {
    if (puzzleIndex === CHECKERS_PUZZLES - 1) {
      api.finish(`Rozwiązane zagadki: ${solved} z ${CHECKERS_PUZZLES}. ${solved === CHECKERS_PUZZLES ? "Mistrz warcabów! ♟️" : "Następnym razem pójdzie lepiej! ♟️"}`, points);
      return;
    }
    puzzleIndex++;
    api.later(loadPuzzle, 1100);
  }

  /** The series has ended (no more jumps). */
  function seriesEnded() {
    if (captured >= puzzle.target) {
      solved++;
      const gained = captured * 2 + Math.max(0, 3 - tries);
      points += gained;
      sfx("pass");
      draw(`Brawo! Najlepszy wynik: ${captured} zbitych. +${gained} ⭐`);
      nextPuzzle();
      return;
    }
    tries++;
    sfx("bad");
    if (tries >= 3) {
      points += captured;
      draw(`Zbiłeś ${captured} z ${puzzle.target}. Przechodzimy dalej!`);
      nextPuzzle();
      return;
    }
    showHints = showHints || tries >= 2;
    draw(`Zbiłeś ${captured}, a da się ${puzzle.target}. Spróbuj innej drogi!`);
    api.later(() => restart(tries >= 2 ? "Zielone pola prowadzą do najlepszego wyniku." : "Od nowa – szukaj dłuższej serii skoków."), 1400);
  }

  api.onClick(api.stage, (event) => {
    const control = event.target.closest("[data-chk]");
    if (control) {
      if (control.dataset.chk === "restart") restart("Od nowa – powodzenia!");
      if (control.dataset.chk === "hint") { showHints = true; draw("Zielone pola prowadzą do najlepszego wyniku."); }
      return;
    }
    const cell = event.target.closest("[data-row]");
    if (!cell || api.finished || captured >= puzzle.target) return;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const move = checkersJumps(white, blacks).find((candidate) => candidate.row === row && candidate.col === col);
    if (!move) {
      sfx("bad");
      draw("Biały pionek skacze na ukos nad czarnym na wolne pole tuż za nim.");
      return;
    }
    blacks = blacks.filter((piece) => piece !== move.mid);
    white = { row, col };
    captured++;
    sfx("ok");
    if (checkersJumps(white, blacks).length === 0) {
      seriesEnded();
      return;
    }
    draw("Dobrze! Skacz dalej.");
  });
  api.setHelp("Biały pionek bije czarne, przeskakując je na ukos. Uwaga na ślepe uliczki – znajdź najdłuższą serię skoków!");
  loadPuzzle();
}

// ====================================================================
// 6. Safe driving – avoid the cars
// ====================================================================
function drawCar(ctx, x, y, color, isPlayer) {
  roundRect(ctx, x - 22, y - 34, 44, 68, 12, color);
  roundRect(ctx, x - 16, y - (isPlayer ? 22 : 10), 32, 18, 6, "rgba(255,255,255,.85)");
  ctx.fillStyle = "#343a40";
  [[-24, -22], [18, -22], [-24, 12], [18, 12]].forEach(([dx, dy]) => ctx.fillRect(x + dx, y + dy, 6, 14));
  if (isPlayer) drawEmoji(ctx, "🙂", x, y + 14, 16);
}

function startTraffic(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  const LANES = [80, 180, 280];
  const player = { lane: 1, x: LANES[1], y: height - 60, bumpTime: 0 };
  let cars = [];
  let spawnIn = 0.6;
  let speed = 220;
  let passed = 0;
  let bumps = 0;
  let stripes = 0;

  const setLane = (lane) => { player.lane = clamp(lane, 0, 2); };
  api.onPointer(canvas, {
    down: (point) => setLane(LANES.reduce((best, laneX, index) => (Math.abs(laneX - point.x) < Math.abs(LANES[best] - point.x) ? index : best), 0)),
    move: (point, isDown) => { if (isDown) setLane(LANES.reduce((best, laneX, index) => (Math.abs(laneX - point.x) < Math.abs(LANES[best] - point.x) ? index : best), 0)); },
  });
  api.onKey((key) => {
    if (key === "ArrowLeft") setLane(player.lane - 1);
    if (key === "ArrowRight") setLane(player.lane + 1);
  });

  api.loop((dt) => {
    speed = Math.min(380, speed + dt * 5);
    stripes = (stripes + speed * dt) % 40;
    player.x += (LANES[player.lane] - player.x) * Math.min(1, dt * 14);
    player.bumpTime -= dt;
    spawnIn -= dt;
    if (spawnIn <= 0) {
      const lane = Math.floor(Math.random() * 3);
      cars.push({ x: LANES[lane], y: -40, color: PASTELS[Math.floor(Math.random() * PASTELS.length)] });
      spawnIn = randomBetween(0.55, 1.0) * (260 / speed);
    }
    cars.forEach((car) => { car.y += speed * dt; });
    for (const car of cars) {
      if (!car.bumped && Math.abs(car.x - player.x) < 40 && Math.abs(car.y - player.y) < 62) {
        car.bumped = true;
        bumps++;
        player.bumpTime = 0.6;
        sfx("bad");
      }
    }
    cars.forEach((car) => { if (!car.counted && car.y > height + 40) { car.counted = true; if (!car.bumped) passed++; } });
    cars = cars.filter((car) => car.y < height + 60);

    ctx.fillStyle = "#b2f2bb";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#adb5bd";
    ctx.fillRect(30, 0, width - 60, height);
    ctx.fillStyle = "#fff";
    for (let y = -40 + stripes; y < height; y += 40) {
      ctx.fillRect(128, y, 4, 22);
      ctx.fillRect(228, y, 4, 22);
    }
    cars.forEach((car) => drawCar(ctx, car.x, car.y, car.color, false));
    const wobble = player.bumpTime > 0 ? Math.sin(player.bumpTime * 40) * 4 : 0;
    drawCar(ctx, player.x + wobble, player.y, "#ff6b6b", true);
    if (player.bumpTime > 0) {
      ctx.fillStyle = "#1f2340";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Bum! Ostrożnie!", width / 2, 60);
    }
    api.setInfo(`⏱ ${api.timeLeft} s · 🚗 ${passed}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Wyminąłeś ${passed} aut${bumps === 0 ? " i ani razu się nie stuknąłeś! 🏆" : `. Stuknięcia: ${bumps}.`}`, Math.max(0, passed - bumps)));
  api.setHelp("Dotknij pasa albo użyj strzałek, żeby zmienić pas.");
}

// ====================================================================
// 7. Balloon festival – pop balloons
// ====================================================================
function startBalloons(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  let balloons = [];
  let sparks = [];
  let spawnIn = 0;
  let score = 0;
  let time = 0;

  api.onPointer(canvas, {
    down: (point) => {
      const hit = [...balloons].reverse().find((balloon) => Math.hypot(balloon.x - point.x, balloon.y - point.y) < balloon.r + 8);
      if (!hit) return;
      balloons = balloons.filter((balloon) => balloon !== hit);
      score += hit.golden ? 3 : 1;
      sfx(hit.golden ? "gem" : "ok");
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        sparks.push({ x: hit.x, y: hit.y, vx: Math.cos(angle) * 120, vy: Math.sin(angle) * 120, life: 0.5, color: hit.color });
      }
    },
  });

  api.loop((dt) => {
    time += dt;
    spawnIn -= dt;
    if (spawnIn <= 0) {
      const golden = Math.random() < 0.08;
      balloons.push({ x: randomBetween(30, width - 30), y: height + 40, r: golden ? 20 : randomBetween(22, 30), speed: randomBetween(60, 120) + time * 2, color: golden ? "#ffd43b" : PASTELS[Math.floor(Math.random() * PASTELS.length)], golden, phase: Math.random() * 6 });
      spawnIn = randomBetween(0.35, 0.7);
    }
    balloons.forEach((balloon) => { balloon.y -= balloon.speed * dt; balloon.x += Math.sin(time * 2 + balloon.phase) * 0.6; });
    balloons = balloons.filter((balloon) => balloon.y > -60);
    sparks.forEach((spark) => { spark.x += spark.vx * dt; spark.y += spark.vy * dt; spark.life -= dt; });
    sparks = sparks.filter((spark) => spark.life > 0);

    skyBackground(ctx, width, height, "#d0ebff", "#fff9db");
    balloons.forEach((balloon) => {
      ctx.strokeStyle = "#868e96";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(balloon.x, balloon.y + balloon.r); ctx.quadraticCurveTo(balloon.x + 6, balloon.y + balloon.r + 20, balloon.x, balloon.y + balloon.r + 40); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(balloon.x, balloon.y, balloon.r * 0.85, balloon.r, 0, 0, Math.PI * 2);
      ctx.fillStyle = balloon.color; ctx.fill();
      ctx.beginPath(); ctx.ellipse(balloon.x - balloon.r * 0.3, balloon.y - balloon.r * 0.35, balloon.r * 0.18, balloon.r * 0.28, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fill();
      if (balloon.golden) drawEmoji(ctx, "⭐", balloon.x, balloon.y, 16);
    });
    sparks.forEach((spark) => {
      ctx.globalAlpha = Math.max(0, spark.life * 2);
      ctx.fillStyle = spark.color;
      ctx.beginPath(); ctx.arc(spark.x, spark.y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });
    api.setInfo(`⏱ ${api.timeLeft} s · 🎈 ${score}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Przekłułeś balony za ${score} punktów! 🎈`, score));
  api.setHelp("Dotykaj balonów. Złoty balon ⭐ = 3 punkty.");
}

// ====================================================================
// 8. Hungry caterpillar – a gentle snake
// ====================================================================
function startCaterpillar(api) {
  const COLS = 12;
  const ROWS = 14;
  const CELL = 30;
  const { canvas, ctx, width, height } = api.canvas(COLS * CELL, ROWS * CELL);
  let body = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
  let direction = { x: 1, y: 0 };
  let nextDirection = direction;
  let leaf = null;
  let stepIn = 0;
  let score = 0;
  let ouchTime = 0;

  const DIRECTIONS = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
  function turn(key) {
    const wanted = DIRECTIONS[key];
    if (!wanted || (wanted.x === -direction.x && wanted.y === -direction.y)) return;
    nextDirection = wanted;
  }
  function placeLeaf() {
    do {
      leaf = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (body.some((part) => part.x === leaf.x && part.y === leaf.y));
  }
  swipeControls(api, canvas, turn, (point) => {
    const head = body[0];
    const dx = point.x / CELL - (head.x + 0.5);
    const dy = point.y / CELL - (head.y + 0.5);
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "ArrowRight" : "ArrowLeft") : (dy > 0 ? "ArrowDown" : "ArrowUp"));
  });
  arrowPad(api, turn);

  api.loop((dt) => {
    stepIn -= dt;
    ouchTime -= dt;
    if (stepIn <= 0) {
      stepIn = 0.17;
      direction = nextDirection;
      const head = { x: (body[0].x + direction.x + COLS) % COLS, y: (body[0].y + direction.y + ROWS) % ROWS };
      const bitten = body.findIndex((part) => part.x === head.x && part.y === head.y);
      if (bitten >= 0) {
        body = body.slice(0, Math.max(3, bitten)); // tickles itself – just gets shorter
        ouchTime = 0.8;
        sfx("bad");
      }
      body.unshift(head);
      if (head.x === leaf.x && head.y === leaf.y) {
        score++;
        sfx("ok");
        placeLeaf();
      } else {
        body.pop();
      }
    }
    ctx.fillStyle = "#ebfbee";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#d3f9d8";
    for (let row = 0; row < ROWS; row++) for (let col = (row % 2); col < COLS; col += 2) ctx.fillRect(col * CELL, row * CELL, CELL, CELL);
    ctx.fillStyle = "#40c057";
    ctx.beginPath(); ctx.ellipse(leaf.x * CELL + 15, leaf.y * CELL + 15, 11, 7, -0.6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#2b8a3e"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(leaf.x * CELL + 6, leaf.y * CELL + 22); ctx.lineTo(leaf.x * CELL + 24, leaf.y * CELL + 8); ctx.stroke();
    body.slice().reverse().forEach((part, reverseIndex) => {
      const index = body.length - 1 - reverseIndex;
      ctx.beginPath();
      ctx.arc(part.x * CELL + 15, part.y * CELL + 15, index === 0 ? 14 : 12, 0, Math.PI * 2);
      ctx.fillStyle = index === 0 ? "#94d82d" : index % 2 ? "#a9e34b" : "#c0eb75";
      ctx.fill();
    });
    const head = body[0];
    ctx.fillStyle = "#1f2340";
    ctx.beginPath(); ctx.arc(head.x * CELL + 10, head.y * CELL + 12, 2.5, 0, Math.PI * 2); ctx.arc(head.x * CELL + 20, head.y * CELL + 12, 2.5, 0, Math.PI * 2); ctx.fill();
    if (ouchTime > 0) {
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Hihi, łaskocze!", width / 2, 24);
    }
    api.setInfo(`⏱ ${api.timeLeft} s · 🍃 ${score}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Gąsienica zjadła ${score} listków! 🐛`, score));
  api.setHelp("Steruj strzałkami, przesuwając palcem albo dotykając obok głowy.");
  placeLeaf();
}

// ====================================================================
// 9. Frog crossing – road and river, no harm: the frog just hops back
// ====================================================================
function startFrog(api) {
  const COLS = 9;
  const ROWS = 9;
  const CELL = 40;
  const { canvas, ctx, width, height } = api.canvas(COLS * CELL, ROWS * CELL);
  // row 0 = goal, 1-3 river, 4 grass, 5-7 road, 8 start
  const lanes = [
    { row: 7, type: "road", speed: 70, items: [0, 4.5] },
    { row: 6, type: "road", speed: -95, items: [1, 5] },
    { row: 5, type: "road", speed: 120, items: [2, 6.5] },
    { row: 3, type: "river", speed: -60, items: [0, 3, 6], size: 2 },
    { row: 2, type: "river", speed: 80, items: [1, 5], size: 3 },
    { row: 1, type: "river", speed: -50, items: [0, 4, 7], size: 2 },
  ].map((lane) => ({ ...lane, items: lane.items.map((col) => col * CELL), size: lane.size || 1 }));
  const frog = { col: 4, row: 8, x: 4 * CELL };
  let crossings = 0;
  let bestRow = 0; // rows reached in the current attempt – partial points
  let message = "";
  let messageTime = 0;

  function backToStart(text) {
    frog.col = 4;
    frog.row = 8;
    frog.x = 4 * CELL;
    message = text;
    messageTime = 1;
    sfx("bad");
  }
  function hop(key) {
    if (key === "ArrowUp") frog.row--;
    if (key === "ArrowDown") frog.row = Math.min(8, frog.row + 1);
    if (key === "ArrowLeft") frog.x -= CELL;
    if (key === "ArrowRight") frog.x += CELL;
    frog.x = clamp(frog.x, 0, (COLS - 1) * CELL);
    bestRow = Math.max(bestRow, 8 - frog.row);
    sfx("click");
    if (frog.row <= 0) {
      crossings++;
      bestRow = 0;
      sfx("pass");
      frog.row = 8;
      frog.x = 4 * CELL;
      message = "Hurra, udało się! 🎉";
      messageTime = 1;
    }
  }
  swipeControls(api, canvas, hop, (point) => {
    const dx = point.x - (frog.x + CELL / 2);
    const dy = point.y - (frog.row * CELL + CELL / 2);
    hop(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "ArrowRight" : "ArrowLeft") : (dy > 0 ? "ArrowDown" : "ArrowUp"));
  });
  arrowPad(api, hop);

  api.loop((dt) => {
    messageTime -= dt;
    const span = width + 3 * CELL;
    lanes.forEach((lane) => {
      lane.items = lane.items.map((x) => {
        let next = x + lane.speed * dt;
        if (next > width + CELL) next -= span;
        if (next < -lane.size * CELL - CELL) next += span;
        return next;
      });
    });
    const lane = lanes.find((entry) => entry.row === frog.row);
    if (lane && lane.type === "road") {
      if (lane.items.some((x) => frog.x + CELL - 8 > x && frog.x + 8 < x + CELL)) backToStart("Uwaga, auto! Wracamy na start 🚗");
    } else if (lane && lane.type === "river") {
      const pad = lane.items.find((x) => frog.x + CELL / 2 > x && frog.x + CELL / 2 < x + lane.size * CELL);
      if (pad === undefined) backToStart("Plum! Żabka zmokła – od początku 💦");
      else {
        frog.x += lane.speed * dt;
        if (frog.x < -CELL / 2 || frog.x > width - CELL / 2) backToStart("Żabka odpłynęła za daleko – od początku");
      }
    }

    for (let row = 0; row < ROWS; row++) {
      ctx.fillStyle = row === 0 ? "#ffdeeb" : row <= 3 ? "#a5d8ff" : row === 4 || row === 8 ? "#b2f2bb" : "#ced4da";
      ctx.fillRect(0, row * CELL, width, CELL);
    }
    for (let col = 0; col < COLS; col += 2) drawEmoji(ctx, "🌸", col * CELL + CELL / 2, CELL / 2, 20);
    ctx.fillStyle = "#fff";
    [5.5, 6.5].forEach((line) => { for (let x = 0; x < width; x += 40) ctx.fillRect(x + 8, line * CELL + CELL / 2 - 1, 22, 3); });
    lanes.forEach((entry) => entry.items.forEach((x) => {
      if (entry.type === "road") {
        roundRect(ctx, x + 2, entry.row * CELL + 6, CELL - 4, CELL - 12, 8, entry.speed > 0 ? "#ffa8a8" : "#ffe066");
        ctx.fillStyle = "rgba(255,255,255,.8)";
        ctx.fillRect(x + (entry.speed > 0 ? 24 : 8), entry.row * CELL + 11, 8, CELL - 22);
      } else {
        for (let i = 0; i < entry.size; i++) {
          ctx.beginPath();
          ctx.arc(x + i * CELL + CELL / 2, entry.row * CELL + CELL / 2, CELL / 2 - 3, 0.3, Math.PI * 2);
          ctx.lineTo(x + i * CELL + CELL / 2, entry.row * CELL + CELL / 2);
          ctx.fillStyle = "#69db7c";
          ctx.fill();
        }
      }
    }));
    drawEmoji(ctx, "🐸", frog.x + CELL / 2, frog.row * CELL + CELL / 2 + 1, 28);
    if (messageTime > 0) {
      roundRect(ctx, 20, height / 2 - 22, width - 40, 40, 12, "rgba(255,255,255,.9)");
      ctx.fillStyle = "#1f2340";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(message, width / 2, height / 2 - 2);
    }
    api.setInfo(`⏱ ${api.timeLeft} s · 🐸 ${crossings}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Żabka przeszła na drugą stronę ${crossings} razy! 🐸`, crossings * 5 + bestRow));
  api.setHelp("Na drodze omijaj auta, na rzece skacz po liściach. Steruj strzałkami lub dotykiem.");
}

// ====================================================================
// 10. Fruit catching
// ====================================================================
function startFruits(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  const FRUITS = ["🍎", "🍐", "🍊", "🍌", "🍇", "🍓", "🍒"];
  const basket = { x: width / 2, target: width / 2, y: height - 40, wobble: 0 };
  let items = [];
  let spawnIn = 0;
  let score = 0;
  let time = 0;

  api.onPointer(canvas, {
    down: (point) => { basket.target = point.x; },
    move: (point) => { basket.target = point.x; },
  });
  api.onKey((key) => {
    if (key === "ArrowLeft") basket.target -= 45;
    if (key === "ArrowRight") basket.target += 45;
  });

  api.loop((dt) => {
    time += dt;
    basket.target = clamp(basket.target, 36, width - 36);
    basket.x += (basket.target - basket.x) * Math.min(1, dt * 14);
    basket.wobble -= dt;
    spawnIn -= dt;
    if (spawnIn <= 0) {
      const isStone = Math.random() < 0.22;
      items.push({ x: randomBetween(24, width - 24), y: -20, speed: randomBetween(140, 200) + time * 4, stone: isStone, emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)] });
      spawnIn = randomBetween(0.45, 0.8);
    }
    items.forEach((item) => { item.y += item.speed * dt; });
    for (const item of items) {
      if (!item.caught && item.y > basket.y - 24 && item.y < basket.y + 10 && Math.abs(item.x - basket.x) < 38) {
        item.caught = true;
        if (item.stone) {
          score = Math.max(0, score - 1);
          basket.wobble = 0.5;
          sfx("bad");
        } else {
          score++;
          sfx("ok");
        }
      }
    }
    items = items.filter((item) => !item.caught && item.y < height + 30);

    skyBackground(ctx, width, height, "#fff3bf", "#d3f9d8");
    items.forEach((item) => {
      if (item.stone) {
        ctx.beginPath(); ctx.ellipse(item.x, item.y, 13, 10, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "#adb5bd"; ctx.fill();
      } else {
        drawEmoji(ctx, item.emoji, item.x, item.y, 28);
      }
    });
    const wobble = basket.wobble > 0 ? Math.sin(basket.wobble * 40) * 5 : 0;
    drawEmoji(ctx, "🧺", basket.x + wobble, basket.y, 46);
    api.setInfo(`⏱ ${api.timeLeft} s · 🍎 ${score}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Złapałeś ${score} owoców! 🧺`, score));
  api.setHelp("Przesuwaj koszyk. Owoc = +1, kamyk = −1.");
}

// ====================================================================
// 11. Memory on time
// ====================================================================
function startMemoryDash(api) {
  const PICTURES = ["🐶", "🐱", "🐰", "🦊", "🐼", "🐸", "🐵", "🦁", "🐨", "🐷", "🐮", "🐔", "🦉", "🐢", "🐙", "🦋"];
  let cards = [];
  let open = [];
  let locked = false;
  let pairs = 0;

  function deal() {
    const chosen = shuffle(PICTURES).slice(0, 6);
    cards = shuffle([...chosen, ...chosen]).map((emoji) => ({ emoji, open: false, done: false }));
    open = [];
    draw();
  }
  function draw() {
    api.stage.innerHTML = `<div class="memdash">${cards.map((card, index) =>
      `<button class="memdash-card ${card.open || card.done ? "open" : ""} ${card.done ? "done" : ""}" data-card="${index}" aria-label="Karta">${card.open || card.done ? card.emoji : "❓"}</button>`).join("")}</div>`;
  }
  api.onClick(api.stage, (event) => {
    const button = event.target.closest("[data-card]");
    if (!button || locked || api.finished) return;
    const index = Number(button.dataset.card);
    const card = cards[index];
    if (card.open || card.done) return;
    card.open = true;
    open.push(index);
    sfx("flip");
    if (open.length === 2) {
      const [first, second] = open.map((position) => cards[position]);
      if (first.emoji === second.emoji) {
        first.done = second.done = true;
        pairs++;
        open = [];
        sfx("ok");
        if (cards.every((entry) => entry.done)) api.later(deal, 500);
      } else {
        locked = true;
        api.later(() => {
          first.open = second.open = false;
          open = [];
          locked = false;
          draw();
        }, 650);
      }
    }
    draw();
  });
  const infoTimer = setInterval(() => api.setInfo(`⏱ ${api.timeLeft} s · 🃏 ${pairs}`), 200);
  api.countdown(GAME_SECONDS, () => { clearInterval(infoTimer); api.finish(`Znalazłeś ${pairs} par! 🃏`, pairs); });
  const stopBase = api.stop;
  api.stop = () => { clearInterval(infoTimer); stopBase(); };
  api.setHelp("Odkrywaj po dwie karty i szukaj par. Gdy znajdziesz wszystkie – nowa plansza!");
  deal();
}

// ====================================================================
// 12. Rychu's flight – fly through gates made of clouds (soft clouds: bumping only costs the point)
// ====================================================================
function drawOwl(ctx, x, y, flap) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#7d5430";
  ctx.beginPath(); ctx.ellipse(-15, 2 - flap, 8, 13, -0.6 + flap * 0.05, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(15, 2 - flap, 8, 13, 0.6 - flap * 0.05, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#a0693c";
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f3d9a4";
  ctx.beginPath(); ctx.ellipse(0, 6, 10, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ef4f5f";
  ctx.fillRect(-15, -12, 30, 5);
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(-6, -4, 5, 0, Math.PI * 2); ctx.arc(6, -4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1f2340";
  ctx.beginPath(); ctx.arc(-5, -4, 2.4, 0, Math.PI * 2); ctx.arc(7, -4, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffb84d";
  ctx.beginPath(); ctx.moveTo(-3, 1); ctx.lineTo(3, 1); ctx.lineTo(0, 6); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawCloudColumn(ctx, x, top, bottom) {
  const width = 56;
  roundRect(ctx, x - width / 2, top, width, Math.max(0, bottom - top), 18, "#ffffff");
  ctx.fillStyle = "#ffffff";
  [top, bottom].forEach((edge) => {
    if (edge <= 0 || edge >= 480) return;
    [-18, 0, 18].forEach((dx) => { ctx.beginPath(); ctx.arc(x + dx, edge, 16, 0, Math.PI * 2); ctx.fill(); });
  });
}

function startFlight(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  const GRAVITY = 680;
  const FLAP = -250;
  const GAP = currentGrade() <= 2 ? 175 : currentGrade() <= 5 ? 155 : 140;
  const owl = { x: 90, y: 220, vy: 0, flapTime: 0 };
  let gates = [];
  let spawnIn = 0.6;
  let score = 0;
  let bumpTime = 0;

  const flap = () => {
    owl.vy = FLAP;
    owl.flapTime = 0.25;
    sfx("click");
  };
  api.onPointer(canvas, { down: flap });
  api.onKey((key) => { if (key === "ArrowUp" || key === " ") flap(); });

  api.loop((dt) => {
    owl.vy += GRAVITY * dt;
    owl.y += owl.vy * dt;
    owl.flapTime -= dt;
    bumpTime -= dt;
    if (owl.y < 22) { owl.y = 22; owl.vy = 0; }
    if (owl.y > height - 40) { owl.y = height - 40; owl.vy = FLAP * 0.7; } // bounces softly off the meadow
    spawnIn -= dt;
    if (spawnIn <= 0) {
      gates.push({ x: width + 40, gapY: randomBetween(120, height - 150) });
      spawnIn = 1.8;
    }
    gates.forEach((gate) => { gate.x -= 120 * dt; });
    for (const gate of gates) {
      const inColumn = Math.abs(owl.x - gate.x) < 28 + 12;
      const outsideGap = owl.y - 14 < gate.gapY - GAP / 2 || owl.y + 14 > gate.gapY + GAP / 2;
      if (inColumn && outsideGap && !gate.bumped) {
        gate.bumped = true;
        bumpTime = 0.7;
        sfx("bad");
      }
      if (!gate.passed && gate.x + 28 < owl.x) {
        gate.passed = true;
        if (!gate.bumped) { score++; sfx("ok"); }
      }
    }
    gates = gates.filter((gate) => gate.x > -60);

    skyBackground(ctx, width, height, "#a5d8ff", "#e7f5ff");
    ctx.fillStyle = "#b2f2bb";
    ctx.fillRect(0, height - 22, width, 22);
    gates.forEach((gate) => {
      drawCloudColumn(ctx, gate.x, -20, gate.gapY - GAP / 2);
      drawCloudColumn(ctx, gate.x, gate.gapY + GAP / 2, height + 20);
    });
    drawOwl(ctx, owl.x, owl.y, owl.flapTime > 0 ? 6 : 0);
    if (bumpTime > 0) {
      ctx.fillStyle = "#1f2340";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Puf! Miękka chmurka 😅", width / 2, 50);
    }
    api.setInfo(`⏱ ${api.timeLeft} s · 🦉 ${score}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Rychu przeleciał przez ${score} bramek! 🦉`, score));
  api.setHelp("Dotykaj ekranu (albo spacja / strzałka w górę), żeby Rychu machał skrzydłami.");
}

// ====================================================================
// 13. Repeat the melody – remember the order of the bells
// ====================================================================
function startMelody(api) {
  const BELLS = [
    { color: "#ff8787", note: 523.25, icon: "🔔" },
    { color: "#74c0fc", note: 659.25, icon: "🎵" },
    { color: "#8ce99a", note: 783.99, icon: "🎶" },
    { color: "#ffe066", note: 1046.5, icon: "⭐" },
  ];
  const MAX_LENGTH = 15;
  const stepMs = Math.round(620 / gameSpeed());
  const sequence = [];
  let position = 0;
  let listening = false;
  let best = 0;

  api.stage.innerHTML = `
    <p class="game-msg" id="melodyMsg">Posłuchaj i patrz…</p>
    <div class="bells">${BELLS.map((bell, index) => `<button class="bell" data-bell="${index}" style="--bell:${bell.color}" aria-label="Dzwoneczek ${index + 1}">${bell.icon}</button>`).join("")}</div>`;
  const message = (text) => { const element = $("#melodyMsg"); if (element) element.textContent = text; };
  const light = (index) => {
    const button = api.stage.querySelector(`[data-bell="${index}"]`);
    if (!button) return;
    button.classList.add("lit");
    playNote(BELLS[index].note);
    api.later(() => button.classList.remove("lit"), stepMs * 0.6);
  };
  const updateInfo = () => api.setInfo(`🔔 długość: ${sequence.length} · 🏆 ${best}`);

  function nextRound() {
    sequence.push(Math.floor(Math.random() * BELLS.length));
    position = 0;
    listening = false;
    message("Posłuchaj i patrz…");
    updateInfo();
    sequence.forEach((index, step) => api.later(() => light(index), 500 + step * stepMs));
    api.later(() => { listening = true; message("Teraz Ty! Powtórz kolejność."); }, 500 + sequence.length * stepMs);
  }

  api.onClick(api.stage, (event) => {
    const button = event.target.closest("[data-bell]");
    if (!button || !listening || api.finished) return;
    const index = Number(button.dataset.bell);
    light(index);
    if (index !== sequence[position]) {
      listening = false;
      sfx("bad");
      message("Ups, inna kolejność!");
      api.later(() => api.finish(`Zapamiętałeś melodię z ${best} dźwięków! 🔔`, best * 2), 700);
      return;
    }
    position++;
    if (position === sequence.length) {
      best = sequence.length;
      listening = false;
      sfx("ok");
      message("Brawo! Teraz będzie dłuższa…");
      if (best >= MAX_LENGTH) {
        api.later(() => api.finish(`Mistrz melodii – ${best} dźwięków! 🏆`, best * 2 + 10), 700);
        return;
      }
      api.later(nextRound, 900);
    }
  });
  api.setHelp("Dzwoneczki grają po kolei – zapamiętaj kolejność i powtórz ją. Melodia rośnie o jeden dźwięk.");
  nextRound();
}

// ====================================================================
// 14. The mole says hello – give each mole a carrot
// ====================================================================
function startMole(api) {
  const HOLES = 9;
  const showMs = Math.round(1150 / gameSpeed());
  const everyMs = Math.round(650 / gameSpeed());
  const holes = Array.from({ length: HOLES }, () => ({ mole: false, happy: false, until: 0 }));
  let score = 0;

  function draw() {
    api.stage.innerHTML = `<div class="moles">${holes.map((hole, index) => `
      <button class="mole-hole ${hole.mole ? "up" : ""} ${hole.happy ? "happy" : ""}" data-hole="${index}" aria-label="Norka ${index + 1}">
        <span class="mole">${hole.happy ? "😊" : hole.mole ? "🐹" : ""}</span>${hole.happy ? `<span class="carrot">🥕</span>` : ""}
      </button>`).join("")}</div>`;
    api.setInfo(`⏱ ${api.timeLeft} s · 🥕 ${score}`);
  }
  function popUp() {
    const now = performance.now();
    holes.forEach((hole) => { if ((hole.mole || hole.happy) && now > hole.until) { hole.mole = false; hole.happy = false; } });
    const free = holes.map((hole, index) => (hole.mole || hole.happy ? -1 : index)).filter((index) => index >= 0);
    if (free.length) {
      const hole = holes[shuffle(free)[0]];
      hole.mole = true;
      hole.until = now + showMs;
    }
    draw();
    api.later(popUp, everyMs);
  }
  api.onClick(api.stage, (event) => {
    const button = event.target.closest("[data-hole]");
    if (!button || api.finished) return;
    const hole = holes[Number(button.dataset.hole)];
    if (!hole.mole) return;
    hole.mole = false;
    hole.happy = true;
    hole.until = performance.now() + 450;
    score++;
    sfx("ok");
    draw();
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Przywitałeś ${score} kretów marchewką! 🥕`, score));
  api.setHelp("Gdy kret wychyli się z norki, dotknij go – dostanie marchewkę i się uśmiechnie.");
  draw();
  popUp();
}

// ====================================================================
// 15. Mouse maze – a new random maze every time
// ====================================================================
/** Random maze (depth-first "backtracker"); each cell keeps its open sides. */
function makeMaze(cols, rows) {
  const cells = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ n: false, e: false, s: false, w: false, seen: false })));
  const stack = [{ x: 0, y: 0 }];
  cells[0][0].seen = true;
  const steps = [{ dx: 0, dy: -1, side: "n", back: "s" }, { dx: 1, dy: 0, side: "e", back: "w" }, { dx: 0, dy: 1, side: "s", back: "n" }, { dx: -1, dy: 0, side: "w", back: "e" }];
  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = steps.filter(({ dx, dy }) => {
      const x = current.x + dx;
      const y = current.y + dy;
      return x >= 0 && y >= 0 && x < cols && y < rows && !cells[y][x].seen;
    });
    if (!options.length) { stack.pop(); continue; }
    const step = options[Math.floor(Math.random() * options.length)];
    const next = { x: current.x + step.dx, y: current.y + step.dy };
    cells[current.y][current.x][step.side] = true;
    cells[next.y][next.x][step.back] = true;
    cells[next.y][next.x].seen = true;
    stack.push(next);
  }
  return cells;
}

function startMaze(api) {
  const SIZE = 360;
  const { canvas, ctx } = api.canvas(SIZE, SIZE);
  const baseSize = currentGrade() <= 2 ? 5 : currentGrade() <= 5 ? 6 : 7;
  let size = baseSize;
  let maze = null;
  let mouse = { x: 0, y: 0 };
  let solved = 0;

  function newMaze() {
    maze = makeMaze(size, size);
    mouse = { x: 0, y: 0 };
  }
  const MOVES = { ArrowUp: { dx: 0, dy: -1, side: "n" }, ArrowDown: { dx: 0, dy: 1, side: "s" }, ArrowLeft: { dx: -1, dy: 0, side: "w" }, ArrowRight: { dx: 1, dy: 0, side: "e" } };
  function move(key) {
    const step = MOVES[key];
    if (!step || api.finished) return;
    if (!maze[mouse.y][mouse.x][step.side]) { sfx("flip"); return; }
    mouse = { x: mouse.x + step.dx, y: mouse.y + step.dy };
    if (mouse.x === size - 1 && mouse.y === size - 1) {
      solved++;
      sfx("pass");
      size = Math.min(baseSize + 3, size + 1);
      newMaze();
    }
  }
  swipeControls(api, canvas, move, (point) => {
    const cell = SIZE / size;
    const dx = point.x / cell - (mouse.x + 0.5);
    const dy = point.y / cell - (mouse.y + 0.5);
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "ArrowRight" : "ArrowLeft") : (dy > 0 ? "ArrowDown" : "ArrowUp"));
  });
  arrowPad(api, move);

  api.loop(() => {
    const cell = SIZE / size;
    ctx.fillStyle = "#fff9db";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "#845ef7";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    maze.forEach((row, y) => row.forEach((walls, x) => {
      const left = x * cell;
      const top = y * cell;
      if (!walls.n) { ctx.moveTo(left, top); ctx.lineTo(left + cell, top); }
      if (!walls.w) { ctx.moveTo(left, top); ctx.lineTo(left, top + cell); }
      if (y === size - 1 && !walls.s) { ctx.moveTo(left, top + cell); ctx.lineTo(left + cell, top + cell); }
      if (x === size - 1 && !walls.e) { ctx.moveTo(left + cell, top); ctx.lineTo(left + cell, top + cell); }
    }));
    ctx.stroke();
    drawEmoji(ctx, "🧀", (size - 0.5) * cell, (size - 0.5) * cell, cell * 0.6);
    drawEmoji(ctx, "🐭", (mouse.x + 0.5) * cell, (mouse.y + 0.5) * cell, cell * 0.62);
    api.setInfo(`⏱ ${api.timeLeft} s · 🧀 ${solved}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Myszka znalazła ser ${solved} ${solved === 1 ? "raz" : "razy"}! 🧀`, solved * 5 + mouse.x + mouse.y));
  api.setHelp("Prowadź myszkę strzałkami, przesuwając palcem albo dotykając obok niej. Każdy kolejny labirynt jest trochę większy.");
  newMaze();
}

// ====================================================================
// 16. Block tower – stop the sliding block so the tower grows straight
// ====================================================================
function startTower(api) {
  const { canvas, ctx, width, height } = api.canvas(360, 480);
  const BLOCK_HEIGHT = 26;
  const START_WIDTH = currentGrade() <= 2 ? 180 : 150;
  const MIN_WIDTH = 34;
  const blocks = [{ x: (width - START_WIDTH) / 2, w: START_WIDTH, color: PASTELS[0] }];
  let moving = { x: 0, w: START_WIDTH, dir: 1 };
  let score = 0;
  let message = "";
  let messageTime = 0;

  const top = () => blocks[blocks.length - 1];
  function drop() {
    if (api.finished) return;
    const below = top();
    const left = Math.max(moving.x, below.x);
    const right = Math.min(moving.x + moving.w, below.x + below.w);
    const overlap = right - left;
    if (overlap <= 0) {
      message = "Ups! Spróbuj jeszcze raz";
      messageTime = 0.9;
      sfx("bad");
      moving = { x: 0, w: below.w, dir: 1 };
      return;
    }
    const perfect = Math.abs(moving.x - below.x) < 6;
    let newWidth = perfect ? below.w : overlap;
    let newX = perfect ? below.x : left;
    score += perfect ? 2 : 1;
    message = perfect ? "Idealnie! +2" : "";
    messageTime = perfect ? 0.8 : 0;
    if (newWidth < MIN_WIDTH) { // Rychu glues on a wider block so the game can go on
      newX -= (80 - newWidth) / 2;
      newWidth = 80;
      message = "Rychu dokleił szerszy klocek 🦉";
      messageTime = 1;
    }
    sfx(perfect ? "pass" : "ok");
    blocks.push({ x: clamp(newX, 0, width - newWidth), w: newWidth, color: PASTELS[blocks.length % PASTELS.length] });
    moving = { x: blocks.length % 2 ? width - newWidth : 0, w: newWidth, dir: blocks.length % 2 ? -1 : 1 };
  }
  api.onPointer(canvas, { down: drop });
  api.onKey((key) => { if (key === " " || key === "ArrowDown") drop(); });

  api.loop((dt) => {
    moving.x += moving.dir * 150 * dt;
    if (moving.x < 0) { moving.x = 0; moving.dir = 1; }
    if (moving.x + moving.w > width) { moving.x = width - moving.w; moving.dir = -1; }
    messageTime -= dt;
    const visible = Math.floor((height - 120) / BLOCK_HEIGHT);
    const shift = Math.max(0, blocks.length - visible);
    const yOf = (index) => height - 30 - (index - shift + 1) * BLOCK_HEIGHT;

    skyBackground(ctx, width, height, "#e5dbff", "#fff4e6");
    ctx.fillStyle = "#b2f2bb";
    ctx.fillRect(0, height - 30, width, 30);
    blocks.forEach((block, index) => { if (index >= shift) roundRect(ctx, block.x, yOf(index), block.w, BLOCK_HEIGHT - 3, 6, block.color); });
    roundRect(ctx, moving.x, yOf(blocks.length) - 30, moving.w, BLOCK_HEIGHT - 3, 6, "#5b6cff");
    if (messageTime > 0 && message) {
      ctx.fillStyle = "#1f2340";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(message, width / 2, 40);
    }
    api.setInfo(`⏱ ${api.timeLeft} s · 🏗️ ${blocks.length - 1} · ⭐ ${score}`);
  });
  api.countdown(GAME_SECONDS, () => api.finish(`Twoja wieża ma ${blocks.length - 1} pięter! 🏗️`, score));
  api.setHelp("Dotknij ekranu (albo spacja), gdy klocek jest dokładnie nad wieżą. Idealne ułożenie = +2.");
}
