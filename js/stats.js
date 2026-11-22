"use strict";

/**
 * "Wyniki": detailed statistics with small charts (inline SVG, no libraries).
 * Data: the last saved exercises (state.stats.sessions, up to MAX_SAVED_SESSIONS), word statistics,
 * the learning path, counters kept for badges and the real use time.
 * Charts: one hue for one series (--primary), a calendar heatmap (one hue, light → dark),
 * and word statuses with a validated 4-colour palette (light and dark variants in CSS).
 * Every mark has a tooltip (hover or tap) and every chart has its numbers in text next to it.
 */
const STATS_RANGES = [7, 30, 90];
let statsRange = 30;
const WEEKDAYS_SHORT = ["nd", "pn", "wt", "śr", "cz", "pt", "sb"];

const percentOf = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
const shortDate = (date) => `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
const dayLabel = (date) => `${WEEKDAYS_SHORT[date.getDay()]} ${shortDate(date)}`;

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

const answersWord = (count) => (count === 1 ? "odpowiedź" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? "odpowiedzi" : "odpowiedzi");

/** One entry per calendar day for the last `days` days (oldest first). */
function dailyActivity(days) {
  const byDay = new Map();
  state.stats.sessions.forEach((entry) => {
    const key = dayKey(new Date(entry.t));
    const day = byDay.get(key) || { answers: 0, correct: 0, sessions: 0 };
    day.answers += entry.total;
    day.correct += entry.correct;
    day.sessions++;
    byDay.set(key, day);
  });
  const list = [];
  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    list.push({ date, ...(byDay.get(dayKey(date)) || { answers: 0, correct: 0, sessions: 0 }) });
  }
  return list;
}

/** A "nice" axis maximum: 5, 10, 20, 25, 50, 100… */
function niceMax(value) {
  if (value <= 5) return 5;
  const power = 10 ** Math.floor(Math.log10(value));
  return [1, 2, 2.5, 5, 10].map((step) => step * power).find((candidate) => candidate >= value);
}

// ====================================================================
// Charts
// ====================================================================
const CHART_W = 320;
const CHART_H = 150;
const PAD = { left: 30, right: 6, top: 10, bottom: 22 };

/** Column chart: answers per day. Rounded tops, anchored to the baseline. */
function activityChartSvg(days) {
  const max = niceMax(Math.max(...days.map((day) => day.answers), 1));
  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const slot = plotW / days.length;
  const barW = Math.max(2, Math.min(18, slot - 2));
  const y = (value) => PAD.top + plotH - (value / max) * plotH;
  const grid = [0, max / 2, max].map((value) => `
    <line class="grid" x1="${PAD.left}" x2="${CHART_W - PAD.right}" y1="${y(value)}" y2="${y(value)}"/>
    <text class="axis" x="${PAD.left - 4}" y="${y(value) + 3}" text-anchor="end">${Math.round(value)}</text>`).join("");
  const bars = days.map((day, index) => {
    const x = PAD.left + index * slot + (slot - barW) / 2;
    const tip = day.answers
      ? `${dayLabel(day.date)}: ${day.answers} ${answersWord(day.answers)}, ${percentOf(day.correct, day.answers)}% dobrych, ćwiczeń: ${day.sessions}`
      : `${dayLabel(day.date)}: bez nauki`;
    const hit = `<rect class="hit" x="${PAD.left + index * slot}" y="${PAD.top}" width="${slot}" height="${plotH}" data-tip="${esc(tip)}"/>`;
    if (!day.answers) return hit;
    const top = y(day.answers);
    const height = PAD.top + plotH - top;
    const radius = Math.min(4, barW / 2, height);
    const path = `M${x},${PAD.top + plotH} V${top + radius} Q${x},${top} ${x + radius},${top} H${x + barW - radius} Q${x + barW},${top} ${x + barW},${top + radius} V${PAD.top + plotH} Z`;
    return `<path class="bar-mark" d="${path}"/>${hit}`;
  }).join("");
  const labelEvery = Math.ceil(days.length / 6);
  const labels = days.map((day, index) => ((days.length - 1 - index) % labelEvery === 0
    ? `<text class="axis" x="${PAD.left + index * slot + slot / 2}" y="${CHART_H - 6}" text-anchor="middle">${days.length <= 7 ? WEEKDAYS_SHORT[day.date.getDay()] : shortDate(day.date)}</text>` : "")).join("");
  return `<svg class="chart" viewBox="0 0 ${CHART_W} ${CHART_H}" role="img" aria-label="Liczba odpowiedzi dzień po dniu">${grid}${bars}${labels}</svg>`;
}

/** Line chart: share of correct answers on the days with learning (0–100%). */
function accuracyChartSvg(days) {
  const active = days.map((day, index) => ({ ...day, index })).filter((day) => day.answers > 0);
  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const slot = plotW / days.length;
  const x = (index) => PAD.left + index * slot + slot / 2;
  const y = (percent) => PAD.top + plotH - (percent / 100) * plotH;
  const grid = [0, 50, 100].map((value) => `
    <line class="grid" x1="${PAD.left}" x2="${CHART_W - PAD.right}" y1="${y(value)}" y2="${y(value)}"/>
    <text class="axis" x="${PAD.left - 4}" y="${y(value) + 3}" text-anchor="end">${value}%</text>`).join("");
  const points = active.map((day) => ({ x: x(day.index), y: y(percentOf(day.correct, day.answers)), day }));
  const line = points.length > 1 ? `<polyline class="line-mark" points="${points.map((point) => `${point.x},${point.y}`).join(" ")}"/>` : "";
  const dots = points.map((point) => `
    <circle class="dot-mark" cx="${point.x}" cy="${point.y}" r="4"/>
    <circle class="hit" cx="${point.x}" cy="${point.y}" r="12" data-tip="${esc(`${dayLabel(point.day.date)}: ${percentOf(point.day.correct, point.day.answers)}% dobrych (${point.day.correct}/${point.day.answers})`)}"/>`).join("");
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const labels = `<text class="axis" x="${PAD.left}" y="${CHART_H - 6}">${shortDate(first)}</text>
    <text class="axis" x="${CHART_W - PAD.right}" y="${CHART_H - 6}" text-anchor="end">${shortDate(last)}</text>`;
  return `<svg class="chart" viewBox="0 0 ${CHART_W} ${CHART_H}" role="img" aria-label="Procent dobrych odpowiedzi w kolejnych dniach">${grid}${line}${dots}${labels}</svg>`;
}

/** Calendar heatmap of the last 12 weeks (one hue: more answers → darker). */
function heatmapHtml() {
  const weeks = 12;
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const days = dailyActivity((weeks - 1) * 7 + todayIndex + 1); // full weeks, Monday first, up to today
  const startPad = 0;
  const max = Math.max(...days.map((day) => day.answers), 1);
  const level = (answers) => (answers === 0 ? 0 : Math.min(4, Math.ceil((answers / max) * 4)));
  const cells = [...Array(startPad).fill(`<span class="heat-cell empty"></span>`), ...days.map((day) =>
    `<span class="heat-cell l${level(day.answers)}" data-tip="${esc(day.answers ? `${dayLabel(day.date)}: ${day.answers} ${answersWord(day.answers)}` : `${dayLabel(day.date)}: bez nauki`)}"></span>`)].join("");
  const activeDays = days.filter((day) => day.answers > 0).length;
  return `
    <div class="heatmap-wrap">
      <div class="heat-days"><span>pn</span><span></span><span>śr</span><span></span><span>pt</span><span></span><span>nd</span></div>
      <div class="heatmap">${cells}</div>
    </div>
    <div class="heat-legend"><span class="muted small">Dni z nauką: <b>${activeDays}</b> z ${days.length}</span>
      <span class="muted small">mniej</span>${[0, 1, 2, 3, 4].map((value) => `<span class="heat-cell l${value}"></span>`).join("")}<span class="muted small">więcej</span></div>`;
}

/** Word statuses as one stacked bar plus a legend that is also the table of numbers. */
function wordStatusHtml() {
  const words = wordsInScope();
  const kinds = [
    { id: "mastered", label: "Opanowane", hint: "co najmniej 3 dobre odpowiedzi, 80% skuteczności" },
    { id: "learning", label: "W trakcie", hint: "już ćwiczone" },
    { id: "hard", label: "Trudne", hint: "więcej błędów niż trafień" },
    { id: "new", label: "Jeszcze nie ćwiczone", hint: "" },
  ];
  const counts = Object.fromEntries(kinds.map((kind) => [kind.id, 0]));
  words.forEach((word) => { counts[wordStatus(word)]++; });
  const total = words.length || 1;
  const segments = kinds.filter((kind) => counts[kind.id] > 0).map((kind) =>
    `<span class="seg seg-${kind.id}" style="flex-grow:${counts[kind.id]}" data-tip="${esc(`${kind.label}: ${counts[kind.id]} (${percentOf(counts[kind.id], total)}%)`)}"></span>`).join("");
  return `
    <div class="stack-bar">${segments}</div>
    <div class="stack-legend">${kinds.map((kind) => `
      <div><span class="key seg-${kind.id}"></span><span>${kind.label}${kind.hint ? ` <small class="muted">(${kind.hint})</small>` : ""}</span>
        <b>${counts[kind.id]}</b><span class="muted">${percentOf(counts[kind.id], total)}%</span></div>`).join("")}
    </div>
    <p class="muted small">Słówka z Twojego zakresu: ${words.length}.</p>`;
}

/** How often each mark (1–6) came out; horizontal bars, best mark on top. */
function marksHtml(sessions) {
  const counts = [6, 5, 4, 3, 2, 1].map((grade) => ({ grade, count: sessions.filter((entry) => entry.grade === grade).length }));
  const max = Math.max(...counts.map((entry) => entry.count), 1);
  return `<div class="hbars">${counts.map(({ grade, count }) => `
    <div class="hbar-row" data-tip="${esc(`Ocena ${grade} (${MARKS.find((mark) => mark.grade === grade).label}): ${count}`)}">
      <span class="hbar-label">${grade}</span>
      <span class="hbar-track"><span class="hbar-fill" style="width:${(count / max) * 100}%"></span></span>
      <b>${count}</b></div>`).join("")}</div>`;
}

// ====================================================================
// Page
// ====================================================================
function renderStats() {
  if (checkBadges().length) saveState(); // e.g. words mastered meanwhile: the badge is simply there
  const { sessions } = state.stats;
  const counters = badgeStats();
  const level = levelInfo();
  const days = dailyActivity(statsRange);
  const inRange = sessions.filter((entry) => entry.t >= days[0].date.getTime() - 12 * 3600000);
  const rangeAnswers = inRange.reduce((sum, entry) => sum + entry.total, 0);
  const rangeCorrect = inRange.reduce((sum, entry) => sum + entry.correct, 0);
  const allAnswers = sessions.reduce((sum, entry) => sum + entry.total, 0);
  const allCorrect = sessions.reduce((sum, entry) => sum + entry.correct, 0);
  const average = (list) => (list.length ? (list.reduce((sum, entry) => sum + entry.grade, 0) / list.length).toFixed(1) : "–");

  // this week compared with the week before
  const week = dailyActivity(14);
  const thisWeek = week.slice(7).reduce((sum, day) => sum + day.answers, 0);
  const lastWeek = week.slice(0, 7).reduce((sum, day) => sum + day.answers, 0);
  const weekChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;
  const weekText = weekChange === null ? (thisWeek ? "pierwszy tydzień nauki" : "") : weekChange >= 0 ? `▲ ${weekChange}% więcej niż tydzień temu` : `▼ ${-weekChange}% mniej niż tydzień temu`;

  const words = allWords();
  const hardWords = words.filter((word) => wordStat(word).bad > 0)
    .sort((a, b) => (wordStat(b).bad - wordStat(b).ok) - (wordStat(a).bad - wordStat(a).ok)).slice(0, 10);
  const bestWords = words.filter(isMastered).sort((a, b) => wordStat(b).ok - wordStat(a).ok).slice(0, 10);

  const modeRows = MODES.map((mode) => {
    const list = sessions.filter((entry) => entry.mode === mode.id);
    if (!list.length) return null;
    const total = list.reduce((sum, entry) => sum + entry.total, 0);
    const correct = list.reduce((sum, entry) => sum + entry.correct, 0);
    return { mode, count: list.length, percent: percentOf(correct, total), average: average(list), last: Math.max(...list.map((entry) => entry.t)) };
  }).filter(Boolean).sort((a, b) => b.count - a.count);

  const pathRows = GRADE_INFO.map((info) => {
    const units = unitsForGrade(info.id);
    const steps = units.reduce((sum, unit) => sum + unit.steps.length, 0);
    const passed = units.reduce((sum, unit) => sum + unitPassedCount(unit), 0);
    if (!steps) return "";
    return `<div class="meter-row" data-tip="${esc(`${info.label}: ${passed} z ${steps} kroków`)}"><span>${info.emoji} ${info.label}</span>
      <span class="muted">${passed}/${steps} kroków · ${percentOf(passed, steps)}%</span><div class="meter"><div style="width:${percentOf(passed, steps)}%"></div></div></div>`;
  }).join("");

  const tile = (value, label, extra = "") => `<div class="card stat"><b>${value}</b>${label}${extra ? `<small class="muted">${extra}</small>` : ""}</div>`;
  const record = (icon, label, value) => `<div class="record"><span>${icon}</span><span>${label}</span><b>${value}</b></div>`;
  const rangeLabel = statsRange === 7 ? "7 dni" : `${statsRange} dni`;

  app.innerHTML = `
    <section class="card hero">${rychuBubble("cheer", state.games.exercises > 0
      ? `Masz się czym pochwalić rodzicom lub opiekunom! Pokaż im swoje wyniki. 🌟`
      : `Tu zobaczysz swoje postępy. Zrób pierwsze ćwiczenie, a potem pochwal się rodzicom lub opiekunom! 🌟`, 84)}
      <p class="hero-level">⚡ Poziom ${level.level}: <b>${level.title}</b> · do następnego poziomu brakuje ${level.need - level.into} XP</p>
      <div class="xp-bar" title="${level.into}/${level.need} XP"><div style="width:${Math.round((level.into / level.need) * 100)}%"></div></div>
    </section>

    <section class="grid stat-grid">
      ${tile(state.games.exercises, "ukończonych ćwiczeń")}
      ${tile(state.stats.correctTotal, "dobrych odpowiedzi")}
      ${tile(`${percentOf(allCorrect, allAnswers)}%`, "skuteczność", `ostatnie ${sessions.length} ćwiczeń`)}
      ${tile(average(sessions.slice(-20)), "średnia ocen", "ostatnie 20 ćwiczeń")}
      ${tile(currentStreak(), "dni z rzędu", `rekord: ${Math.max(counters.bestStreak, currentStreak())}`)}
      ${tile(words.filter(isMastered).length, "opanowanych słów")}
      ${tile(`<span class="stat-small">${formatDuration(state.support.seconds || 0)}</span>`, "czasu nauki")}
      ${tile(state.stats.xp, "XP", `poziom ${level.level}`)}
    </section>

    <div class="range-tabs" role="tablist" aria-label="Okres">
      ${STATS_RANGES.map((range) => `<button class="chip ${range === statsRange ? "active" : ""}" role="tab" aria-selected="${range === statsRange}" data-action="statsRange" data-range="${range}">${range} dni</button>`).join("")}
    </div>

    <section class="card chart-card">
      <h2>📈 Aktywność</h2>
      <p class="muted small">Odpowiedzi w ciągu ${rangeLabel}: <b>${rangeAnswers}</b> · ćwiczeń: <b>${inRange.length}</b>${weekText ? ` · ${weekText}` : ""}</p>
      ${rangeAnswers ? activityChartSvg(days) : `<p class="muted">W tym okresie nie było jeszcze ćwiczeń.</p>`}
    </section>

    <section class="card chart-card">
      <h2>🎯 Skuteczność</h2>
      <p class="muted small">Dobre odpowiedzi w ciągu ${rangeLabel}: <b>${percentOf(rangeCorrect, rangeAnswers)}%</b> (${rangeCorrect}/${rangeAnswers}) · średnia ocen: <b>${average(inRange)}</b></p>
      ${inRange.length ? accuracyChartSvg(days) : `<p class="muted">Zrób ćwiczenie, a pojawi się tu wykres.</p>`}
    </section>

    <section class="card"><h2>🗓️ Kalendarz nauki</h2><p class="muted small">Ostatnie 12 tygodni – im ciemniej, tym więcej odpowiedzi.</p>${heatmapHtml()}</section>

    <section class="card"><h2>🔤 Słówka</h2>${wordStatusHtml()}</section>

    <section class="card"><h2>🏆 Twoje rekordy</h2>
      <div class="records">
        ${record("🔥", "Najdłuższa seria dni", Math.max(counters.bestStreak, currentStreak()))}
        ${record("🎳", "Najwięcej dobrych odpowiedzi pod rząd", counters.bestRun)}
        ${record("🏃", "Najwięcej ćwiczeń jednego dnia", counters.bestDay)}
        ${record("💯", "Bezbłędnych ćwiczeń", counters.perfect)}
        ${record("💎", "Zebranych klejnotów", counters.gemsTotal)}
        ${record("🧰", "Otwartych skrzyń skarbów", counters.chests)}
        ${record("📅", "Wykonanych zadań dnia", Object.keys(state.calendar).length)}
        ${record("🥅", "Dni z osiągniętym celem", counters.goalDays)}
      </div>
    </section>

    ${sessions.length ? `<section class="card"><h2>📝 Oceny</h2><p class="muted small">Ostatnie ${sessions.length} ćwiczeń · średnia <b>${average(sessions)}</b></p>${marksHtml(sessions)}</section>` : ""}

    ${modeRows.length ? `<section class="card"><h2>🧩 Ćwiczenia</h2>
      <div class="mode-table">
        <div class="mode-head"><span>Ćwiczenie</span><span>Razy</span><span>Skuteczność</span><span>Ocena</span></div>
        ${modeRows.map((row) => `<div class="mode-row" data-tip="${esc(`${row.mode.name}: ostatnio ${new Date(row.last).toLocaleDateString("pl-PL")}`)}">
          <span>${row.mode.icon} ${esc(row.mode.name)}</span><span>${row.count}</span>
          <span class="mode-acc"><span class="meter"><span style="width:${row.percent}%"></span></span>${row.percent}%</span><span>${row.average}</span></div>`).join("")}
      </div></section>` : ""}

    <section class="card"><h2>🎓 Ścieżka nauki</h2>${pathRows}</section>

    ${badgeSectionHtml()}

    <section class="card"><h2>🔁 Do powtórki</h2>
      ${hardWords.length > 0
        ? hardWords.map((word) => `<div class="word-item"><span><b>${esc(word.en)}</b> – ${esc(word.pl)}</span><span class="muted">✔ ${wordStat(word).ok} · ✘ ${wordStat(word).bad}</span></div>`).join("")
        : `<p class="muted">Brak trudnych słów. Świetnie!</p>`}
    </section>
    ${bestWords.length ? `<section class="card"><h2>⭐ Najlepiej opanowane</h2>
      ${bestWords.map((word) => `<div class="word-item"><span><b>${esc(word.en)}</b> – ${esc(word.pl)}</span><span class="muted">✔ ${wordStat(word).ok}</span></div>`).join("")}</section>` : ""}
    <button class="btn danger" data-action="resetStats">Wyzeruj postępy</button>`;
}

function setStatsRange(range) {
  statsRange = STATS_RANGES.includes(range) ? range : 30;
  render(true);
}

// ====================================================================
// Tooltip for every [data-tip] in the statistics (hover with a mouse, tap on a phone)
// ====================================================================
function showChartTip(target, event) {
  let tip = $("#chartTip");
  if (!tip) {
    document.body.insertAdjacentHTML("beforeend", `<div id="chartTip" class="chart-tip" role="status"></div>`);
    tip = $("#chartTip");
  }
  tip.textContent = target.dataset.tip;
  tip.classList.add("show");
  const rect = target.getBoundingClientRect();
  const x = event && event.clientX ? event.clientX : rect.left + rect.width / 2;
  const top = rect.top - tip.offsetHeight - 8;
  tip.style.left = `${Math.min(window.innerWidth - tip.offsetWidth - 8, Math.max(8, x - tip.offsetWidth / 2))}px`;
  tip.style.top = `${top < 8 ? rect.bottom + 8 : top}px`;
}

function hideChartTip() {
  const tip = $("#chartTip");
  if (tip) tip.classList.remove("show");
}

document.addEventListener("pointerover", (event) => {
  const target = event.target.closest && event.target.closest("#app [data-tip]");
  if (target && event.pointerType === "mouse") showChartTip(target, event);
});
document.addEventListener("pointerout", (event) => {
  if (event.target.closest && event.target.closest("#app [data-tip]") && event.pointerType === "mouse") hideChartTip();
});
document.addEventListener("click", (event) => {
  const target = event.target.closest && event.target.closest("#app [data-tip]");
  if (target) showChartTip(target, event);
  else hideChartTip();
});
window.addEventListener("scroll", hideChartTip, { passive: true });
