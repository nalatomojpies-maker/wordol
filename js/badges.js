"use strict";

/**
 * Badges ("Odznaki"): many small goals so there is always a next one within reach.
 * - Tiered badges: a counter (exercises, correct answers, streak…) and thresholds.
 * - Mode masters: 15 finished exercises in one kind of exercise.
 * - Special badges: time of day, holidays, comebacks, weekends.
 * Earned badges are stored in state.stats.badges as { id: timestamp }.
 */
const MODE_MASTER_GOAL = 15;

/** Counters kept only for badges (older saves get them filled in from what is already known). */
function badgeStats() {
  const stats = state.stats;
  if (!stats.counters || typeof stats.counters !== "object") stats.counters = {};
  const counters = stats.counters;
  if (!counters.modes || typeof counters.modes !== "object") {
    counters.modes = {};
    stats.sessions.forEach((entry) => { counters.modes[entry.mode] = (counters.modes[entry.mode] || 0) + 1; });
  }
  if (!Number.isFinite(counters.perfect)) counters.perfect = stats.sessions.filter((entry) => entry.total >= 4 && entry.correct === entry.total).length;
  if (!Number.isFinite(counters.bestStreak)) counters.bestStreak = stats.streak || 0;
  if (!Number.isFinite(counters.gemsTotal)) {
    counters.gemsTotal = state.gems + (state.jokes.owned.length + state.riddles.owned.length) * 3 + state.games.owned.length * 12;
  }
  ["run", "bestRun", "goalDays", "chests", "bestDay"].forEach((key) => { if (!Number.isFinite(counters[key])) counters[key] = 0; });
  if (!counters.today || typeof counters.today !== "object") counters.today = { day: "", count: 0 };
  return counters;
}

/** Every gem that comes in goes through here, so "Klejnoty" badges count all gems ever collected. */
function addGems(amount) {
  state.gems += amount;
  badgeStats().gemsTotal += amount;
}

const stepsPassed = () => Object.values(state.path).filter((entry) => entry.passed).length;
const totalPlays = () => Object.values(state.games.plays || {}).reduce((sum, count) => sum + count, 0);
const modesTried = () => Object.keys(badgeStats().modes).filter((id) => id !== "lessonTest").length;

/** [threshold, icon, name] for each tier; the badge id is `${group}-${threshold}`. */
const BADGE_GROUPS = [
  { id: "train", title: "Treningi", unit: "ukończonych ćwiczeń", value: () => state.games.exercises, tiers: [
    [1, "🐣", "Pierwszy krok"], [5, "🌱", "Rozgrzany"], [10, "🥉", "Dziesiątka"], [25, "🥈", "Pracuś"], [50, "🥇", "Pół setki"],
    [100, "🏅", "Setka!"], [200, "🎖️", "Niezmordowany"], [300, "🏆", "Mistrz treningu"], [500, "👑", "Król ćwiczeń"], [1000, "🌌", "Legenda WORD4ALL"]] },
  { id: "correct", title: "Dobre odpowiedzi", unit: "dobrych odpowiedzi", value: () => state.stats.correctTotal, tiers: [
    [10, "✔️", "Dobry start"], [50, "🎯", "Celne oko"], [100, "🏹", "Łucznik"], [250, "⚡", "Błyskawica"], [500, "🚀", "Rakieta"],
    [1000, "🌠", "Spadająca gwiazda"], [2500, "🧨", "Petarda"], [5000, "💫", "Kometa"], [10000, "🪐", "Galaktyka wiedzy"]] },
  { id: "streak", title: "Seria dni", unit: "dni nauki z rzędu", value: () => badgeStats().bestStreak, tiers: [
    [2, "✨", "Iskierka"], [3, "🔥", "Płomyk"], [5, "🕯️", "Ognisko"], [7, "🌟", "Tydzień mocy"], [14, "☄️", "Dwa tygodnie"],
    [21, "🌋", "Wulkan"], [30, "📅", "Miesiąc bez przerwy"], [50, "💎", "Diamentowa seria"], [100, "🏔️", "Szczyt"], [365, "🌞", "Cały rok!"]] },
  { id: "words", title: "Opanowane słowa", unit: "opanowanych słów", value: () => allWords().filter(isMastered).length, tiers: [
    [10, "📗", "Mały słownik"], [25, "📘", "Zbieracz słów"], [50, "🧠", "Bystra głowa"], [100, "📚", "Biblioteka"],
    [200, "🗂️", "Encyklopedia"], [300, "🦉", "Mądra sowa"], [500, "🎓", "Profesor"]] },
  { id: "perfect", title: "Bez błędów", unit: "bezbłędnych ćwiczeń", value: () => badgeStats().perfect, tiers: [
    [1, "💯", "Bezbłędny"], [3, "✨", "Perfekcjonista"], [10, "💠", "Diamentowa precyzja"], [25, "🎯", "Snajper"], [50, "🥷", "Ninja"], [100, "🦄", "Jednorożec"]] },
  { id: "run", title: "Seria trafień", unit: "dobrych odpowiedzi pod rząd", value: () => badgeStats().bestRun, tiers: [
    [5, "🎳", "Piątka pod rząd"], [10, "🎲", "Dziesiątka pod rząd"], [20, "🌈", "Tęcza"], [35, "🐉", "Smok"], [50, "🦸", "Superbohater"], [100, "🧙", "Czarodziej"]] },
  { id: "steps", title: "Ścieżka nauki", unit: "zaliczonych kroków", value: stepsPassed, tiers: [
    [1, "👣", "Pierwsza lekcja"], [5, "🪜", "Po drabinie"], [10, "🧗", "Wspinacz"], [20, "⛰️", "Zdobywca"], [50, "🏔️", "Himalaista"], [100, "🚩", "Na szczycie"]] },
  { id: "units", title: "Tematy", unit: "ukończonych tematów", value: () => PATH_UNITS.filter(isUnitDone).length, tiers: [
    [1, "🎓", "Ukończony temat"], [3, "📖", "Trzy tematy"], [5, "🏫", "Prymus"], [10, "🧑‍🎓", "Absolwent"], [20, "🏛️", "Akademik"]] },
  { id: "level", title: "Poziomy", unit: "poziom", value: () => levelInfo().level, tiers: [
    [2, "⭐", "Poziom 2"], [5, "🌟", "Poziom 5"], [10, "💫", "Poziom 10"], [15, "🌠", "Poziom 15"], [20, "☀️", "Poziom 20"], [30, "🌞", "Poziom 30"], [50, "🌌", "Poziom 50"]] },
  { id: "daily", title: "Zadania dnia", unit: "wykonanych zadań dnia", value: () => Object.keys(state.calendar).length, tiers: [
    [1, "📅", "Pierwsze zadanie"], [3, "🗓️", "Trzy zadania"], [7, "📆", "Tydzień zadań"], [14, "🎗️", "Dwa tygodnie zadań"],
    [30, "🏵️", "Miesiąc zadań"], [60, "🎀", "Dwa miesiące zadań"], [100, "🏆", "Setka zadań"]] },
  { id: "goal", title: "Cel dnia", unit: "dni z osiągniętym celem", value: () => badgeStats().goalDays, tiers: [
    [1, "🥅", "Gol!"], [5, "⚽", "Strzelec"], [15, "🏟️", "Kapitan drużyny"], [40, "🏆", "Mistrz ligi"]] },
  { id: "day", title: "Maraton", unit: "ćwiczeń jednego dnia", value: () => badgeStats().bestDay, tiers: [
    [5, "🏃", "Biegacz"], [10, "🏃‍♀️", "Maratończyk"], [20, "🦾", "Ultramaraton"]] },
  { id: "gems", title: "Klejnoty", unit: "zebranych klejnotów", value: () => badgeStats().gemsTotal, tiers: [
    [10, "💎", "Pierwsze klejnoty"], [50, "💍", "Skarbczyk"], [100, "👛", "Sakiewka"], [250, "💰", "Skarbiec"], [500, "🏦", "Bank klejnotów"], [1000, "👑", "Korona"]] },
  { id: "chests", title: "Skrzynie skarbów", unit: "otwartych skrzyń", value: () => badgeStats().chests, tiers: [
    [1, "🧰", "Pierwsza skrzynia"], [10, "🗝️", "Poszukiwacz skarbów"], [30, "🏴‍☠️", "Pirat"], [75, "⚓", "Kapitan skarbów"]] },
  { id: "jokes", title: "Dowcipy", unit: "dowcipów w kolekcji", value: () => state.jokes.owned.length, tiers: [
    [1, "😄", "Śmieszek"], [5, "😆", "Wesołek"], [15, "🤣", "Kabareciarz"], [30, "🎭", "Mistrz humoru"]] },
  { id: "riddles", title: "Zagadki", unit: "zagadek w kolekcji", value: () => state.riddles.owned.length, tiers: [
    [1, "🧩", "Zagadkowy"], [5, "🔍", "Detektyw"], [15, "🕵️", "Sherlock"], [30, "🧠", "Geniusz zagadek"]] },
  { id: "games", title: "Gierki", unit: "gierek w kolekcji", value: () => state.games.owned.length, tiers: [
    [1, "🎮", "Gracz"], [4, "🕹️", "Kolekcjoner gierek"], [8, "👾", "Salon gier"], [16, "🏆", "Wszystkie gierki"]] },
  { id: "plays", title: "Granie", unit: "rozegranych gierek", value: totalPlays, tiers: [
    [1, "🎲", "Pierwsza gra"], [10, "🎯", "Zapalony gracz"], [30, "🏓", "Turniej"], [75, "🥇", "Mistrz gier"]] },
  { id: "explore", title: "Odkrywca", unit: "różnych rodzajów ćwiczeń", value: modesTried, tiers: [
    [3, "🧭", "Odkrywca"], [6, "🗺️", "Podróżnik"], [10, "🌍", "Zdobywca świata"]] },
  { id: "custom", title: "Własne słowa", unit: "dodanych własnych słów", value: () => state.custom.length, tiers: [
    [1, "✏️", "Autor"], [10, "📝", "Notatnik"], [30, "📒", "Własny słownik"]] },
];

/** One-off badges checked at the end of an exercise. */
const SPECIAL_BADGES = [
  { id: "early", icon: "🐓", name: "Ranny ptaszek", desc: "Ćwiczenie przed 8:00", test: (c) => c.finished && c.hour < 8 },
  { id: "night", icon: "🌙", name: "Nocna sowa", desc: "Ćwiczenie po 20:00", test: (c) => c.finished && c.hour >= 20 },
  { id: "weekend", icon: "🛹", name: "Weekendowiec", desc: "Nauka w sobotę i w niedzielę", test: (c) => c.weekend },
  { id: "comeback", icon: "🔄", name: "Wielki powrót", desc: "Powrót do nauki po tygodniu przerwy", test: (c) => c.comeback },
  { id: "perfect10", icon: "🎯", name: "Bez pudła", desc: "Bezbłędne ćwiczenie z co najmniej 10 pytaniami", test: (c) => c.perfect && c.total >= 10 },
  { id: "phoenix", icon: "🐦‍🔥", name: "Feniks", desc: "Zaliczony krok, którego wcześniej się nie udało", test: (c) => c.phoenix },
  { id: "christmas", icon: "🎄", name: "Świąteczny", desc: "Nauka w Święta (24–26 grudnia)", test: (c) => c.month === 12 && c.date >= 24 && c.date <= 26 },
  { id: "newyear", icon: "🎆", name: "Noworoczny", desc: "Nauka 1 stycznia", test: (c) => c.month === 1 && c.date === 1 },
  { id: "valentine", icon: "💝", name: "Walentynkowy", desc: "Nauka 14 lutego", test: (c) => c.month === 2 && c.date === 14 },
  { id: "spring", icon: "🌷", name: "Pierwszy dzień wiosny", desc: "Nauka 21 marca", test: (c) => c.month === 3 && c.date === 21 },
  { id: "earth", icon: "🌍", name: "Dzień Ziemi", desc: "Nauka 22 kwietnia", test: (c) => c.month === 4 && c.date === 22 },
  { id: "childday", icon: "🎈", name: "Dzień Dziecka", desc: "Nauka 1 czerwca", test: (c) => c.month === 6 && c.date === 1 },
  { id: "summer", icon: "⛱️", name: "Wakacyjny uczeń", desc: "Nauka w wakacje (lipiec lub sierpień)", test: (c) => c.month === 7 || c.month === 8 },
  { id: "school", icon: "🎒", name: "Witaj, szkoło!", desc: "Nauka 1 września", test: (c) => c.month === 9 && c.date === 1 },
  { id: "teacher", icon: "🍎", name: "Dzień Nauczyciela", desc: "Nauka 14 października", test: (c) => c.month === 10 && c.date === 14 },
  { id: "halloween", icon: "🎃", name: "Halloween", desc: "Nauka 31 października", test: (c) => c.month === 10 && c.date === 31 },
];

/** Every badge as { id, group, icon, name, desc, goal?, value? (counter badges), test? (special) }. */
const BADGES = [
  ...BADGE_GROUPS.flatMap((group) => group.tiers.map(([goal, icon, name]) => ({
    id: `${group.id}-${goal}`, group: group.title, icon, name, goal, value: group.value,
    desc: group.id === "level" ? `Zdobądź poziom ${goal}` : `${goal} ${group.unit}`,
  }))),
  ...MODES.filter((mode) => mode.id !== "lessonTest").map((mode) => ({
    id: `mode-${mode.id}`, group: "Mistrz ćwiczenia", icon: mode.icon, name: `Mistrz: ${mode.name}`, goal: MODE_MASTER_GOAL,
    value: () => badgeStats().modes[mode.id] || 0, desc: `${MODE_MASTER_GOAL} ukończonych ćwiczeń „${mode.name}”`,
  })),
  ...SPECIAL_BADGES.map((badge) => ({ ...badge, group: "Specjalne" })),
];

/** Badges from before this version keep their place. */
const OLD_BADGE_IDS = {
  first: "train-1", ten: "train-10", fifty: "train-50", streak3: "streak-3", streak7: "streak-7", perfect: "perfect-1",
  answers100: "correct-100", answers500: "correct-500", words50: "words-50", unit: "units-1", steps20: "steps-20",
};

const badgeEarned = (badge) => Boolean(state.stats.badges[badge.id]);
const badgeReached = (badge, context) => (badge.test ? Boolean(badge.test(context)) : badge.value() >= badge.goal);

/** @returns {Array} badges earned just now */
function checkBadges(context = {}) {
  const earned = BADGES.filter((badge) => !badgeEarned(badge) && badgeReached(badge, context));
  earned.forEach((badge) => { state.stats.badges[badge.id] = Date.now(); });
  return earned;
}

/** Outside exercises (shop, games, own words): a toast and a sound for a new badge. */
function announceBadges() {
  const earned = checkBadges();
  if (earned.length === 0) return;
  saveState();
  sfx("badge");
  toast(`🏅 Nowa odznaka: ${earned.map((badge) => `${badge.icon} ${badge.name}`).join(", ")}`);
}

/** Called after every answer in an exercise: the run of correct answers in a row. */
function trackAnswerForBadges(isCorrect) {
  const counters = badgeStats();
  counters.run = isCorrect ? counters.run + 1 : 0;
  counters.bestRun = Math.max(counters.bestRun, counters.run);
}

/**
 * Called when an exercise ends (before checkBadges): updates the counters and builds the context
 * for the special badges. `previousDay` is the last day of learning before today ("" if none).
 */
function trackSessionForBadges({ finished, perfect, total, goalReached, phoenix, previousDay }) {
  const counters = badgeStats();
  const now = new Date();
  const today = dayKey(now);
  if (finished) {
    counters.modes[session.mode] = (counters.modes[session.mode] || 0) + 1;
    if (counters.today.day !== today) counters.today = { day: today, count: 0 };
    counters.today.count++;
    counters.bestDay = Math.max(counters.bestDay, counters.today.count);
  }
  if (perfect) counters.perfect++;
  if (goalReached) counters.goalDays++;
  counters.bestStreak = Math.max(counters.bestStreak, state.stats.streak || 0);
  // weekend: Saturday remembered, Sunday right after it completes the badge
  let weekend = false;
  if (finished && now.getDay() === 6) counters.saturday = today;
  if (finished && now.getDay() === 0) {
    const saturday = new Date(now);
    saturday.setDate(saturday.getDate() - 1);
    weekend = counters.saturday === dayKey(saturday);
  }
  let comeback = false;
  if (finished && previousDay && previousDay !== today) {
    const [year, month, date] = previousDay.split("-").map(Number);
    comeback = (now - new Date(year, month - 1, date)) / 86400000 >= 7;
  }
  return { finished, perfect, total, phoenix, weekend, comeback, hour: now.getHours(), month: now.getMonth() + 1, date: now.getDate() };
}

/** First start with this version: badges already deserved are given quietly (no flood of messages). */
function backfillBadges() {
  if (state.stats.badgesV2) return;
  Object.entries(OLD_BADGE_IDS).forEach(([oldId, newId]) => {
    if (state.stats.badges[oldId]) state.stats.badges[newId] = state.stats.badges[oldId];
  });
  badgeStats();
  checkBadges();
  state.stats.badgesV2 = true;
  saveState();
}

// ====================================================================
// "Wyniki" page: progress, the nearest badges and the whole collection
// ====================================================================
function badgeProgress(badge) {
  if (badge.test) return badgeEarned(badge) ? 1 : 0;
  return Math.min(1, badge.value() / badge.goal);
}

let showAllBadges = false;

function toggleAllBadges() {
  showAllBadges = !showAllBadges;
  render(true);
}

function badgeSectionHtml() {
  const earnedCount = BADGES.filter(badgeEarned).length;
  const nearest = BADGES.filter((badge) => !badgeEarned(badge) && !badge.test && badgeProgress(badge) < 1)
    .map((badge) => ({ badge, progress: badgeProgress(badge) }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);
  const groups = [...new Set(BADGES.map((badge) => badge.group))];
  const medal = (badge) => {
    const earned = badgeEarned(badge);
    const status = earned ? "✔ zdobyta" : badge.test ? badge.desc : `${Math.min(badge.value(), badge.goal)}/${badge.goal}`;
    return `<div class="medal ${earned ? "earned" : ""}" title="${esc(`${badge.name} – ${badge.desc}`)}">
      <span>${badge.icon}</span><small>${esc(badge.name)}</small><em>${esc(status)}</em></div>`;
  };
  return `
    <section class="card"><h2>Odznaki <span class="badge-count">${earnedCount}/${BADGES.length}</span></h2>
      <div class="xp-bar badge-total" title="${earnedCount} z ${BADGES.length}"><div style="width:${Math.round((earnedCount / BADGES.length) * 100)}%"></div></div>
      ${nearest.length ? `<h3>🎯 Najbliższe odznaki</h3>
        <div class="next-badges">${nearest.map(({ badge, progress }) => `
          <div class="next-badge"><span class="next-badge-icon">${badge.icon}</span>
            <div><b>${esc(badge.name)}</b><small class="muted">${esc(badge.desc)} · ${Math.min(badge.value(), badge.goal)}/${badge.goal}</small>
              <div class="xp-bar"><div style="width:${Math.round(progress * 100)}%"></div></div></div></div>`).join("")}</div>` : ""}
      ${showAllBadges
        ? groups.map((group) => {
          const list = BADGES.filter((badge) => badge.group === group);
          return `<h3 class="badge-group">${esc(group)} <small class="muted">${list.filter(badgeEarned).length}/${list.length}</small></h3>
            <div class="badge-grid">${list.map(medal).join("")}</div>`;
        }).join("")
        : earnedCount
          ? `<h3 class="badge-group">🏅 Twoje odznaki</h3><div class="badge-grid">${BADGES.filter(badgeEarned).map(medal).join("")}</div>`
          : `<p class="muted">Jeszcze nie masz odznak – zrób pierwsze ćwiczenie!</p>`}
      <button class="btn" data-action="toggleAllBadges" style="margin-top:12px">${showAllBadges ? "Zwiń listę" : `🗂️ Pokaż wszystkie odznaki (${BADGES.length})`}</button>
    </section>`;
}
