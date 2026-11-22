"use strict";

/**
 * Reward moments: a new badge must be tapped, then it flies towards the player;
 * a treasure chest must be tapped three times, opens, and its gems fly towards the player.
 * Rewards wait in a queue and are shown one after another (chest first, then badges).
 */
const CHEST_TAPS = 3;
const celebrationQueue = [];
let celebrationBusy = false;

/** @param {Array<{type: "badge", badge: object} | {type: "chest", gems: number}>} items */
function celebrate(items) {
  celebrationQueue.push(...items);
  if (!celebrationBusy) showNextCelebration();
}

const prefersLessMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function showNextCelebration() {
  const item = celebrationQueue.shift();
  if (!item) {
    celebrationBusy = false;
    setPageInert(false);
    return;
  }
  celebrationBusy = true;
  setPageInert(true);
  document.body.insertAdjacentHTML("beforeend", `
    <div class="celebrate" id="celebrate" role="dialog" aria-modal="true" aria-labelledby="celebrateTitle">
      <div class="cel-rays" aria-hidden="true"></div>
      ${item.type === "chest" ? chestCelebrationHtml(item) : badgeCelebrationHtml(item.badge)}
    </div>`);
  const target = $("#celebrate .cel-target");
  if (target) target.focus();
  sfx(item.type === "chest" ? "flip" : "badge");
}

// ---------- badge ----------
function badgeCelebrationHtml(badge) {
  return `
    <h2 id="celebrateTitle" class="cel-title">🏅 Nowa odznaka!</h2>
    <button class="cel-target cel-badge" data-action="claimBadge" aria-label="Odbierz odznakę ${esc(badge.name)}">
      <span class="cel-badge-icon">${badge.icon}</span>
    </button>
    <p class="cel-name">${esc(badge.name)}</p>
    <p class="cel-desc">${esc(badge.desc)}</p>
    <p class="cel-hint">👆 Kliknij odznakę, żeby ją odebrać!</p>`;
}

function claimBadge() {
  const box = $("#celebrate");
  if (!box || box.classList.contains("claimed")) return;
  box.classList.add("claimed");
  sfx("goal");
  burstParticles(box, ["✨", "⭐", "🌟", "💫"], 18);
  finishCelebration(box, 1100);
}

// ---------- chest ----------
function chestCelebrationHtml(item) {
  return `
    <h2 id="celebrateTitle" class="cel-title">🧰 Skrzynia skarbów!</h2>
    <button class="cel-target cel-chest" data-action="tapChest" data-taps="0" data-gems="${item.gems}" aria-label="Stuknij skrzynię">
      ${chestSvg()}
    </button>
    <p class="cel-hint" id="chestHint">👆 Stuknij skrzynię ${CHEST_TAPS} razy, żeby ją otworzyć!</p>
    <div class="chest-dots" aria-hidden="true">${Array.from({ length: CHEST_TAPS }, () => "<i></i>").join("")}</div>`;
}

/** A small wooden treasure chest (inline SVG); the lid is a separate group that swings open. */
function chestSvg() {
  return `<svg viewBox="0 0 120 110" width="170" height="156" aria-hidden="true">
    <ellipse cx="60" cy="102" rx="44" ry="6" fill="rgba(0,0,0,.25)"/>
    <g class="chest-glow"><ellipse cx="60" cy="52" rx="40" ry="10" fill="#fff3b0"/></g>
    <rect x="14" y="50" width="92" height="48" rx="8" fill="#a0612b"/>
    <rect x="14" y="50" width="92" height="10" fill="#8a4f1f"/>
    <rect x="22" y="50" width="10" height="48" fill="#e2b13c"/><rect x="88" y="50" width="10" height="48" fill="#e2b13c"/>
    <rect x="14" y="88" width="92" height="10" rx="4" fill="#8a4f1f"/>
    <g class="chest-lid">
      <path d="M14 52 V38 Q14 16 60 16 Q106 16 106 38 V52 Z" fill="#b8702f"/>
      <path d="M22 52 V36 Q22 20 32 18 V52 Z M88 18 Q98 20 98 36 V52 H88 Z" fill="#e2b13c"/>
      <path d="M14 46 H106 V52 H14 Z" fill="#8a4f1f"/>
    </g>
    <rect x="50" y="46" width="20" height="22" rx="4" fill="#f4c542" stroke="#8a5a12" stroke-width="2"/>
    <circle cx="60" cy="56" r="3.5" fill="#5a3a10"/><rect x="58.5" y="57" width="3" height="6" fill="#5a3a10"/>
  </svg>`;
}

function tapChest() {
  const box = $("#celebrate");
  const chest = $("#celebrate .cel-chest");
  if (!box || !chest || box.classList.contains("claimed")) return;
  const taps = Number(chest.dataset.taps) + 1;
  chest.dataset.taps = String(taps);
  document.querySelectorAll("#celebrate .chest-dots i").forEach((dot, index) => dot.classList.toggle("on", index < taps));
  chest.classList.remove("hit1", "hit2", "hit3");
  void chest.offsetWidth; // restart the wobble
  chest.classList.add(`hit${Math.min(taps, 3)}`);
  const hint = $("#chestHint");
  if (taps < CHEST_TAPS) {
    sfx("flip");
    const left = CHEST_TAPS - taps;
    if (hint) hint.textContent = left === 1 ? "👆 Jeszcze raz!" : `👆 Jeszcze ${left} razy!`;
    return;
  }
  box.classList.add("claimed", "open");
  const gems = Number(chest.dataset.gems) || 0;
  if (hint) hint.innerHTML = `<b class="cel-gems">+${gems} 💎</b>`;
  sfx("gem");
  setTimeout(() => sfx("fanfare"), 250);
  burstParticles(box, ["💎", "💎", "✨", "🪙", "💎"], 16, true);
  finishCelebration(box, 1700);
}

// ---------- shared ----------
/** Little emoji particles shooting out of the reward and flying towards the player. */
function burstParticles(box, symbols, count, fromChest = false) {
  if (prefersLessMotion()) return;
  const origin = $(".cel-target", box).getBoundingClientRect();
  const x = origin.left + origin.width / 2;
  const y = origin.top + origin.height * (fromChest ? 0.4 : 0.5);
  const html = Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 90 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - (fromChest ? 80 : 0);
    const delay = Math.round(Math.random() * 180);
    return `<span class="cel-particle" style="left:${x}px;top:${y}px;--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;animation-delay:${delay}ms">${symbols[index % symbols.length]}</span>`;
  }).join("");
  box.insertAdjacentHTML("beforeend", html);
}

function finishCelebration(box, delay) {
  setTimeout(() => {
    box.classList.add("leaving");
    setTimeout(() => {
      box.remove();
      showNextCelebration();
    }, 250);
  }, prefersLessMotion() ? 600 : delay);
}

document.addEventListener("keydown", (event) => {
  if (!$("#celebrate") || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  if ($("#celebrate .cel-chest")) tapChest();
  else claimBadge();
});
