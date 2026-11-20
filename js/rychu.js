"use strict";

/**
 * Rychu – the personal trainer owl (inline SVG, no external image).
 * @param {"happy"|"cheer"|"sad"} mood
 * @param {number} size pixels
 */
function rychuSvg(mood = "happy", size = 96) {
  const cheer = mood === "cheer";
  const sad = mood === "sad";
  const leftWing = cheer ? `<ellipse cx="20" cy="52" rx="8" ry="20" fill="#7d5430" transform="rotate(-35 20 52)"/>` : `<ellipse cx="22" cy="78" rx="9" ry="20" fill="#7d5430" transform="rotate(12 22 78)"/>`;
  const rightWing = cheer ? `<ellipse cx="100" cy="52" rx="8" ry="20" fill="#7d5430" transform="rotate(35 100 52)"/>` : `<ellipse cx="98" cy="78" rx="9" ry="20" fill="#7d5430" transform="rotate(-12 98 78)"/>`;
  const brows = sad
    ? `<path d="M36 40 L54 46" stroke="#4a2e14" stroke-width="3" stroke-linecap="round"/><path d="M84 40 L66 46" stroke="#4a2e14" stroke-width="3" stroke-linecap="round"/>`
    : "";
  const pupilY = sad ? 60 : 57;
  const sparkles = cheer ? `<text x="4" y="22" font-size="16">✨</text><text x="96" y="22" font-size="16">✨</text>` : "";
  const tear = sad ? `<ellipse cx="44" cy="72" rx="2.5" ry="4" fill="#6ec1ff"/>` : "";
  return `<svg class="rychu" viewBox="0 0 120 124" width="${size}" height="${size}" role="img" aria-label="Rychu, sowa-trener">
    <ellipse cx="60" cy="118" rx="28" ry="5" fill="rgba(0,0,0,.14)"/>
    ${leftWing}${rightWing}
    <path d="M30 40 L24 14 L48 32 Z" fill="#7d5430"/><path d="M90 40 L96 14 L72 32 Z" fill="#7d5430"/>
    <ellipse cx="60" cy="72" rx="38" ry="42" fill="#9a6b3f"/>
    <ellipse cx="60" cy="86" rx="23" ry="26" fill="#f3d9a8"/>
    <ellipse cx="60" cy="54" rx="33" ry="27" fill="#b98558"/>
    <path d="M27 42 Q60 26 93 42 L93 51 Q60 36 27 51 Z" fill="#ff4d4d"/>
    <path d="M90 44 L108 36 L104 52 Z" fill="#e03131"/>
    <circle cx="45" cy="58" r="13" fill="#fff"/><circle cx="75" cy="58" r="13" fill="#fff"/>
    <circle cx="47" cy="${pupilY}" r="6" fill="#222"/><circle cx="73" cy="${pupilY}" r="6" fill="#222"/>
    <circle cx="49" cy="${pupilY - 2}" r="2" fill="#fff"/><circle cx="75" cy="${pupilY - 2}" r="2" fill="#fff"/>
    ${brows}${tear}
    <path d="M54 66 L66 66 L60 78 Z" fill="#ffb02e"/>
    <ellipse cx="48" cy="116" rx="9" ry="4" fill="#ffb02e"/><ellipse cx="72" cy="116" rx="9" ry="4" fill="#ffb02e"/>
    ${sparkles}
  </svg>`;
}

const RYCHU_LINES = {
  greet: ["Cześć{name}! Gotowy na trening słówek?", "Hej{name}! Rozgrzewka czeka!", "Witaj{name}! Dziś zrobimy kilka serii słówek!"],
  greetKids: ["Cześć{name}! Bawimy się w słówka?", "Hej{name}! Ćwiczymy razem!", "Witaj{name}! Zaczynamy zabawę!"],
  great: ["Mistrzowska forma{name}! 🏆", "Super! Tak trzymać{name}!", "Rewelacja{name}! Jestem z Ciebie dumny!"],
  good: ["Dobra robota{name}! Jeszcze jedna seria?", "Całkiem nieźle{name}! Ćwiczymy dalej!", "Idzie Ci coraz lepiej{name}!"],
  retry: ["Nic się nie stało{name}. Trening czyni mistrza!", "Spokojnie{name}, powtórzymy trudne słowa.", "Każdy mistrz zaczynał od błędów{name}!"],
  stepPass: ["Krok zaliczony{name}! Idziemy dalej!", "Brawo{name}! Następny krok odblokowany!"],
  stepFail: ["Prawie{name}! Przeczytaj kartę jeszcze raz i spróbuj ponownie.", "Jeszcze raz{name} – dasz radę!"],
  goalDone: ["Dzienny cel zaliczony{name}! 🎉"],
};

/** Random Rychu line of the given kind; {name} becomes ", Ania" or an empty string. */
function rychuLine(kind) {
  const options = RYCHU_LINES[kind];
  const name = state.settings.name ? `, ${state.settings.name}` : "";
  return options[Math.floor(Math.random() * options.length)].replace("{name}", name);
}

const rychuBubble = (mood, text, size = 84) =>
  `<div class="rychu-row"><div class="rychu-wrap">${rychuSvg(mood, size)}</div><div class="bubble">${esc(text)}</div></div>`;

/** Falling confetti, pure CSS – shown after a good result. */
function confettiHtml() {
  const colors = ["#ff6b6b", "#ffd43b", "#51cf66", "#339af0", "#cc5de8", "#ff922b"];
  return `<div class="confetti" aria-hidden="true">${Array.from({ length: 36 }, (_, index) =>
    `<i style="left:${Math.round((index * 97) % 100)}%;background:${colors[index % colors.length]};animation-delay:${((index * 37) % 100) / 100}s;animation-duration:${1.6 + (index % 5) * 0.3}s"></i>`).join("")}</div>`;
}
