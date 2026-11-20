"use strict";

/**
 * Hand-made flat SVG illustrations for the most important concrete words (classes 0-3).
 * Key = lowercase English word, or "topicId:word" when the topic matters. Words without art fall back to emoji.
 * Drawn on a 100x100 canvas; sized by CSS (.art = 1em) so they scale like emoji.
 * @type {Record<string, string>}
 */
const WORD_ART = {};

(function drawArt() {
  const SKIN = "#ffd8b1";
  const A = (inner) => `<svg class="art" viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`;
  const attrs = (extra) => (extra ? ` ${extra}` : "");
  const circ = (x, y, r, fill, extra) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${attrs(extra)}/>`;
  const elli = (x, y, rx, ry, fill, extra) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"${attrs(extra)}/>`;
  const rect = (x, y, w, h, fill, rx = 0, extra) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${attrs(extra)}/>`;
  const path = (d, fill, extra) => `<path d="${d}" fill="${fill}"${attrs(extra)}/>`;
  const line = (d, stroke, width = 3) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const eyes = (y, dx = 11, r = 4.5) =>
    circ(50 - dx, y, r, "#222") + circ(50 + dx, y, r, "#222") + circ(50 - dx + 1.5, y - 1.5, r / 3, "#fff") + circ(50 + dx + 1.5, y - 1.5, r / 3, "#fff");
  const smile = (y, width = 9) => line(`M${50 - width} ${y} Q50 ${y + 9} ${50 + width} ${y}`, "#7a2e2e", 2.5);
  const blush = (y, dx = 20) => elli(50 - dx, y, 5, 3, "#ff8fa3", 'opacity=".55"') + elli(50 + dx, y, 5, 3, "#ff8fa3", 'opacity=".55"');
  const add = (keys, art) => String(keys).split(",").forEach((key) => { WORD_ART[key.trim()] = art; });

  // ---------------- colours ----------------
  const swatch = (colour, stroke) => A(
    circ(50, 52, 38, colour, stroke ? `stroke="${stroke}" stroke-width="2.5"` : "") +
    elli(36, 38, 12, 7, "#fff", 'opacity=".4" transform="rotate(-30 36 38)"') + circ(86, 18, 7, colour) + circ(14, 86, 6, colour));
  const colours = { red: "#e03131", blue: "#1c7ed6", green: "#2f9e44", yellow: "#fcc419", black: "#212529", pink: "#f783ac", brown: "#8d5524", purple: "#7950f2", orange: "#fd7e14", grey: "#adb5bd" };
  Object.entries(colours).forEach(([name, colour]) => add(`colours:${name}`, swatch(colour)));
  add("colours:white", swatch("#f8f9fa", "#ced4da"));

  // ---------------- numbers: digit + that many dots ----------------
  const NUMBER_WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  NUMBER_WORDS.forEach((word, index) => {
    const n = index + 1;
    const twoRows = n > 5;
    const dots = Array.from({ length: n }, (_, i) => {
      const row = twoRows && i >= 5 ? 1 : 0;
      const inRow = twoRows ? (row ? n - 5 : 5) : n;
      const position = row ? i - 5 : i;
      return circ(50 + (position - (inRow - 1) / 2) * 15, twoRows ? 76 + row * 14 : 82, 5.5, "#ff922b");
    }).join("");
    add(`numbers:${word}`, A(`<text x="50" y="${twoRows ? 56 : 62}" font-size="${n === 10 ? 50 : 56}" font-weight="800" text-anchor="middle" fill="#5b6cff" font-family="Segoe UI,Arial,sans-serif">${n}</text>${dots}`));
  });

  // ---------------- people ----------------
  const woman = (hair) =>
    elli(50, 54, 36, 40, hair) + path("M16 100 Q50 68 84 100Z", "#f06595") + circ(50, 52, 25, SKIN) +
    path("M25 50 Q28 22 50 22 Q72 22 75 50 Q62 36 50 35 Q38 36 25 50Z", hair) + eyes(54, 10, 3.6) + smile(63, 8) + blush(61, 17);
  add("mum", A(woman("#6d3b1f")));
  add("hair", A(woman("#e8590c")));
  add("dad", A(
    path("M14 100 Q50 70 86 100Z", "#339af0") + circ(50, 52, 26, SKIN) + path("M24 48 Q24 20 50 20 Q76 20 76 48 Q64 33 50 35 Q36 33 24 48Z", "#3b2a1a") +
    eyes(52, 10, 3.6) + path("M38 63 Q50 56 62 63 Q50 68 38 63Z", "#3b2a1a") + smile(70, 6)));
  add("baby", A(
    path("M20 100 Q50 74 80 100Z", "#fff3bf") + circ(50, 54, 31, SKIN) + line("M44 26 Q50 8 60 20", "#6d3b1f", 3) +
    eyes(55, 12, 5.5) + smile(68, 7) + blush(64, 22) + circ(50, 63, 2.5, "#e8a07a")));
  add("grandma", A(
    circ(50, 18, 11, "#ced4da") + path("M14 100 Q50 72 86 100Z", "#845ef7") + circ(50, 54, 26, SKIN) + path("M24 50 Q26 24 50 24 Q74 24 76 50 Q62 38 50 38 Q38 38 24 50Z", "#ced4da") +
    circ(40, 55, 8, "none", 'stroke="#495057" stroke-width="2"') + circ(60, 55, 8, "none", 'stroke="#495057" stroke-width="2"') + line("M48 55 L52 55", "#495057", 2) +
    circ(40, 55, 2.5, "#222") + circ(60, 55, 2.5, "#222") + smile(68, 8) + blush(66, 18)));
  add("grandpa", A(
    path("M14 100 Q50 72 86 100Z", "#2f9e44") + circ(50, 54, 27, SKIN) + elli(24, 54, 6, 12, "#f1f3f5") + elli(76, 54, 6, 12, "#f1f3f5") +
    circ(40, 52, 8, "none", 'stroke="#495057" stroke-width="2"') + circ(60, 52, 8, "none", 'stroke="#495057" stroke-width="2"') + line("M48 52 L52 52", "#495057", 2) +
    circ(40, 52, 2.5, "#222") + circ(60, 52, 2.5, "#222") + path("M34 66 Q50 58 66 66 Q50 72 34 66Z", "#f1f3f5") + smile(74, 5)));
  add("teacher", A(
    path("M14 100 Q50 70 86 100Z", "#e03131") + circ(50, 52, 25, SKIN) + path("M25 48 Q28 22 50 22 Q72 22 75 48 Q62 34 50 34 Q38 34 25 48Z", "#495057") +
    rect(30, 46, 17, 13, "none", 4, 'stroke="#212529" stroke-width="2.5"') + rect(53, 46, 17, 13, "none", 4, 'stroke="#212529" stroke-width="2.5"') + line("M47 52 L53 52", "#212529", 2.5) +
    circ(38, 53, 2.5, "#222") + circ(62, 53, 2.5, "#222") + smile(66, 8) + rect(64, 76, 26, 20, "#fff", 2, 'stroke="#868e96" stroke-width="2"') + line("M68 83 L86 83 M68 89 L82 89", "#868e96", 2)));
  add("pupil", A(
    line("M30 100 L36 74 M70 100 L64 74", "#fa5252", 6) + path("M18 100 Q50 72 82 100Z", "#51cf66") + circ(50, 50, 24, SKIN) +
    path("M26 46 Q28 22 50 22 Q72 22 74 46 Q60 38 50 36 Q40 38 26 46Z", "#8d5524") + eyes(52, 10, 3.6) + smile(61, 8) + blush(59, 16)));

  // ---------------- body ----------------
  add("head", A(
    path("M36 90 L36 74 L64 74 L64 90Z", SKIN) + circ(50, 46, 28, SKIN) + path("M22 44 Q22 14 50 16 Q78 14 78 44 Q66 28 50 30 Q34 28 22 44Z", "#6d3b1f") +
    circ(22, 50, 5, "#f4b183") + circ(78, 50, 5, "#f4b183") + eyes(48, 11, 3.6) + smile(60, 8) + circ(50, 18, 36, "none", 'stroke="#5b6cff" stroke-width="2.5" stroke-dasharray="5 4" transform="translate(0 28)"')));
  add("face", A(circ(50, 52, 38, SKIN) + eyes(46, 14, 5) + blush(60, 24) + line("M30 62 Q50 86 70 62", "#7a2e2e", 3.5) + path("M46 54 Q50 60 54 54Z", "#f4b183")));
  add("eye", A(
    path("M8 50 Q50 14 92 50 Q50 86 8 50Z", "#fff", 'stroke="#868e96" stroke-width="3"') + circ(50, 50, 19, "#339af0") + circ(50, 50, 9, "#111") + circ(56, 44, 5, "#fff") +
    line("M20 36 L14 26 M36 26 L33 15 M64 26 L67 15 M80 36 L86 26", "#212529", 3)));
  add("nose", A(
    circ(50, 50, 40, SKIN) + path("M44 24 Q40 52 28 66 Q34 80 50 78 Q66 80 72 66 Q60 52 56 24Z", "#f4b183") + elli(40, 70, 4, 3, "#a0522d") + elli(60, 70, 4, 3, "#a0522d") + elli(52, 40, 3, 9, "#fff", 'opacity=".35"')));
  add("mouth", A(
    path("M12 52 Q32 30 50 42 Q68 30 88 52 Q70 82 50 82 Q30 82 12 52Z", "#e03131") + line("M12 52 Q50 64 88 52", "#7a1f1f", 3.5) + elli(38, 44, 9, 3.5, "#fff", 'opacity=".35"')));
  add("ear", A(
    elli(50, 50, 28, 38, SKIN, 'stroke="#e8a07a" stroke-width="3"') + path("M48 24 Q72 30 66 54 Q62 72 50 74", "none", 'stroke="#e8a07a" stroke-width="3"') +
    elli(50, 52, 10, 17, "#f4b183") + elli(60, 76, 8, 6, "#f4b183")));
  add("hand", A(
    rect(30, 48, 42, 40, SKIN, 14) + [32, 44, 56, 68].map((x, i) => rect(x - 1, i === 1 || i === 2 ? 8 : 16, 11, 46, SKIN, 5.5)).join("") +
    elli(24, 66, 8, 15, SKIN, 'transform="rotate(-35 24 66)"') + line("M38 60 L38 70 M50 56 L50 68 M62 60 L62 70", "#e8a07a", 2)));
  add("finger", A(
    rect(28, 52, 46, 38, SKIN, 14) + rect(46, 10, 13, 52, SKIN, 6.5) + elli(26, 64, 7, 12, SKIN, 'transform="rotate(-25 26 64)"') + line("M42 62 L68 62", "#e8a07a", 2)));
  add("arm", A(
    line("M16 82 Q22 30 56 34 Q76 36 76 54", SKIN, 20) + circ(74, 62, 13, SKIN) + line("M70 56 L82 56", "#e8a07a", 2) + path("M10 76 L30 86 L26 100 L6 90Z", "#339af0")));
  add("leg", A(
    rect(40, 4, 22, 66, SKIN, 9) + circ(51, 58, 3, "#e8a07a") + path("M38 66 L62 66 L78 90 L34 90Q32 74 38 66Z", "#495057")));
  add("foot", A(
    path("M26 14 L56 14 L58 58 Q86 62 90 82 L24 82 Q22 40 26 14Z", SKIN) + [58, 68, 77, 85].map((x, i) => circ(x, 66 + i * 3.5, 4.5, "#ffc9a3")).join("")));

  // ---------------- animals ----------------
  add("cat", A(
    path("M16 48 L22 12 L46 30Z", "#f4a259") + path("M84 48 L78 12 L54 30Z", "#f4a259") + path("M24 38 L26 22 L38 31Z", "#ffb3c1") + path("M76 38 L74 22 L62 31Z", "#ffb3c1") +
    circ(50, 56, 34, "#f4a259") + line("M44 24 L44 33 M50 22 L50 32 M56 24 L56 33", "#c77d36", 3) + eyes(52, 13, 5.5) +
    path("M45 62 L55 62 L50 68Z", "#e64980") + line("M50 68 L50 72 M50 72 Q44 77 38 72 M50 72 Q56 77 62 72", "#6c3b1f", 2) +
    line("M12 60 L32 64 M12 70 L32 68 M88 60 L68 64 M88 70 L68 68", "#6c3b1f", 1.8)));
  add("dog", A(
    elli(20, 52, 13, 28, "#8d5524", 'transform="rotate(10 20 52)"') + elli(80, 52, 13, 28, "#8d5524", 'transform="rotate(-10 80 52)"') + circ(50, 52, 30, "#e9b872") +
    elli(50, 68, 18, 14, "#fbe3b8") + eyes(46, 12, 4.5) + elli(50, 62, 7.5, 5.5, "#222") + elli(50, 80, 6, 5, "#ff6b81") + line("M50 67 L50 72 M42 73 Q50 80 58 73", "#222", 2.5)));
  add("bird", A(
    path("M8 52 L28 48 L26 62Z", "#1c7ed6") + elli(46, 58, 28, 22, "#4dabf7") + circ(66, 38, 16, "#4dabf7") + path("M80 36 L97 43 L80 48Z", "#ffa94d") + circ(70, 35, 3.5, "#222") +
    elli(42, 60, 15, 9, "#1c7ed6", 'transform="rotate(-20 42 60)"') + line("M42 80 L42 92 M54 80 L54 92", "#ffa94d", 3)));
  add("fish", A(
    path("M70 50 L94 30 L94 70Z", "#ff922b") + elli(44, 50, 32, 22, "#ffa94d") + path("M30 30 Q44 14 58 30Z", "#ff922b") + circ(26, 46, 4.5, "#222") + circ(27.5, 44.5, 1.5, "#fff") +
    line("M18 56 Q22 60 18 64", "#e8590c", 2.5) + line("M44 38 Q50 50 44 62 M54 38 Q60 50 54 62", "#e8590c", 2)));
  add("rabbit", A(
    elli(36, 24, 9, 24, "#f1f3f5", 'stroke="#ced4da" stroke-width="1.5"') + elli(64, 24, 9, 24, "#f1f3f5", 'stroke="#ced4da" stroke-width="1.5"') + elli(36, 26, 4.5, 17, "#ffc9de") + elli(64, 26, 4.5, 17, "#ffc9de") +
    circ(50, 62, 29, "#f1f3f5", 'stroke="#ced4da" stroke-width="1.5"') + eyes(58, 11, 4) + circ(50, 67, 3.5, "#f783ac") + line("M50 70 L50 74 M44 76 Q50 80 56 76", "#868e96", 2) + rect(46, 76, 4, 6, "#fff", 1, 'stroke="#ced4da"') + rect(51, 76, 4, 6, "#fff", 1, 'stroke="#ced4da"')));
  add("duck", A(
    elli(46, 66, 32, 22, "#ffd43b") + circ(68, 36, 17, "#ffd43b") + elli(88, 40, 10, 5, "#ff922b") + circ(72, 32, 3.5, "#222") + elli(40, 68, 17, 11, "#fcc419", 'transform="rotate(-15 40 68)"') +
    path("M6 62 L20 58 L18 70Z", "#ffd43b") + line("M6 90 Q16 84 26 90 T46 90 T66 90 T86 90", "#74c0fc", 3)));
  add("cow", A(
    path("M22 28 L16 14 L32 24Z", "#f1e4c3") + path("M78 28 L84 14 L68 24Z", "#f1e4c3") + elli(14, 42, 11, 6, "#f1f3f5", 'transform="rotate(-20 14 42)"') + elli(86, 42, 11, 6, "#f1f3f5", 'transform="rotate(20 86 42)"') +
    circ(50, 50, 31, "#fff", 'stroke="#ced4da" stroke-width="1.5"') + elli(34, 36, 9, 7, "#343a40") + elli(70, 62, 8, 6, "#343a40") + eyes(46, 13, 4) + elli(50, 72, 20, 14, "#ffc9de") + circ(43, 72, 3, "#c2255c") + circ(57, 72, 3, "#c2255c")));
  add("pig", A(
    path("M20 40 L16 12 L42 28Z", "#f783ac") + path("M80 40 L84 12 L58 28Z", "#f783ac") + circ(50, 54, 34, "#faa2c1") + eyes(46, 14, 4.5) + elli(50, 66, 16, 12, "#f06595") + circ(44, 66, 3.5, "#a61e4d") + circ(56, 66, 3.5, "#a61e4d")));
  add("horse", A(
    path("M28 30 L22 8 L42 24Z", "#8d5524") + path("M72 30 L78 8 L58 24Z", "#8d5524") + path("M34 14 Q50 0 66 14 L62 40 Q50 30 38 40Z", "#3b2a1a") + elli(50, 52, 23, 38, "#a66a2f") +
    path("M44 22 Q50 18 56 22 L54 64 L46 64Z", "#fff", 'opacity=".85"') + eyes(44, 14, 4) + elli(50, 82, 17, 13, "#d9a066") + circ(43, 82, 3, "#5c3a12") + circ(57, 82, 3, "#5c3a12")));
  add("sheep", A(
    [[30, 40, 16], [50, 30, 17], [70, 40, 16], [24, 60, 14], [76, 60, 14], [50, 56, 24]].map(([x, y, r]) => circ(x, y, r, "#f8f9fa", 'stroke="#dee2e6" stroke-width="1.5"')).join("") +
    elli(50, 64, 15, 19, "#495057") + elli(34, 56, 7, 4, "#495057", 'transform="rotate(30 34 56)"') + elli(66, 56, 7, 4, "#495057", 'transform="rotate(-30 66 56)"') +
    circ(44, 60, 4, "#fff") + circ(56, 60, 4, "#fff") + circ(44, 60, 2, "#111") + circ(56, 60, 2, "#111") + elli(50, 74, 4, 3, "#f783ac")));
  add("hen", A(
    circ(46, 18, 7, "#e03131") + circ(56, 14, 7, "#e03131") + circ(36, 16, 6, "#e03131") + circ(50, 56, 32, "#fff", 'stroke="#ced4da" stroke-width="1.5"') + path("M74 44 L94 50 L74 56Z", "#ffa94d") +
    elli(72, 62, 5, 9, "#e03131") + circ(62, 42, 3.5, "#222") + elli(34, 62, 16, 12, "#f1f3f5", 'transform="rotate(-20 34 62)"') + line("M44 88 L44 98 M58 88 L58 98", "#ffa94d", 3)));
  add("mouse", A(
    circ(22, 32, 17, "#adb5bd") + circ(78, 32, 17, "#adb5bd") + circ(22, 32, 10, "#ffc9de") + circ(78, 32, 10, "#ffc9de") + elli(50, 58, 28, 26, "#adb5bd") + eyes(52, 12, 4) +
    circ(50, 64, 4.5, "#f783ac") + line("M14 62 L34 64 M14 72 L34 68 M86 62 L66 64 M86 72 L66 68", "#6c757d", 1.8) + rect(46, 70, 3.5, 6, "#fff", 1) + rect(50.5, 70, 3.5, 6, "#fff", 1)));
  add("frog", A(
    elli(50, 64, 40, 28, "#51cf66") + circ(28, 36, 14, "#51cf66") + circ(72, 36, 14, "#51cf66") + circ(28, 36, 9, "#fff") + circ(72, 36, 9, "#fff") + circ(29, 37, 4.5, "#111") + circ(71, 37, 4.5, "#111") +
    line("M24 66 Q50 88 76 66", "#2b8a3e", 3.5) + circ(44, 56, 1.8, "#2b8a3e") + circ(56, 56, 1.8, "#2b8a3e")));
  add("lion", A(
    circ(50, 52, 43, "#e67700") + circ(24, 24, 10, "#e67700") + circ(76, 24, 10, "#e67700") + circ(50, 54, 27, "#ffd43b") + circ(30, 34, 8, "#ffd43b") + circ(70, 34, 8, "#ffd43b") +
    eyes(48, 11, 4) + path("M44 58 L56 58 L50 65Z", "#5c3a12") + line("M50 65 L50 70 M42 71 Q50 78 58 71", "#5c3a12", 2.5)));
  add("elephant", A(
    circ(18, 46, 18, "#ced4da") + circ(82, 46, 18, "#ced4da") + circ(18, 46, 11, "#ffc9de", 'opacity=".6"') + circ(82, 46, 11, "#ffc9de", 'opacity=".6"') + circ(50, 46, 28, "#adb5bd") +
    path("M42 58 Q38 92 54 90 Q62 88 58 80 Q52 84 52 60Z", "#adb5bd") + eyes(40, 12, 3.8) + path("M38 68 L34 80 L42 72Z", "#fff") + path("M62 68 L66 80 L58 72Z", "#fff")));
  add("monkey", A(
    circ(14, 50, 11, "#8d5524") + circ(86, 50, 11, "#8d5524") + circ(14, 50, 6, "#f1c27d") + circ(86, 50, 6, "#f1c27d") + circ(50, 48, 31, "#8d5524") +
    path("M30 46 Q38 38 50 46 Q62 38 70 46 Q74 72 50 78 Q26 72 30 46Z", "#f1c27d") + eyes(50, 10, 4) + elli(50, 62, 4, 3, "#5c3a12") + smile(66, 7)));

  // ---------------- toys ----------------
  add("ball", A(
    circ(50, 50, 38, "#ff6b6b") + path("M13 40 Q50 28 87 40 L87 60 Q50 72 13 60Z", "#fff") + path("M13 50 Q50 40 87 50", "none", 'stroke="#fcc419" stroke-width="5"') +
    elli(34, 30, 11, 6, "#fff", 'opacity=".4" transform="rotate(-35 34 30)"') + circ(50, 50, 38, "none", 'stroke="#c92a2a" stroke-width="2"')));
  add("doll", A(
    circ(22, 52, 10, "#f59f00") + circ(78, 52, 10, "#f59f00") + path("M28 100 L38 70 L62 70 L72 100Z", "#f06595") + circ(50, 46, 23, SKIN) +
    path("M27 44 Q28 20 50 20 Q72 20 73 44 Q60 32 50 34 Q40 32 27 44Z", "#f59f00") + path("M44 22 L38 12 L50 20 L62 12 L56 22Z", "#e03131") + eyes(50, 9, 3.4) + smile(59, 6) + blush(57, 15)));
  add("teddy bear", A(
    circ(24, 26, 13, "#b9804b") + circ(76, 26, 13, "#b9804b") + circ(24, 26, 7, "#e8c9a0") + circ(76, 26, 7, "#e8c9a0") + circ(50, 50, 31, "#b9804b") + elli(50, 62, 15, 12, "#e8c9a0") +
    eyes(44, 12, 4) + elli(50, 58, 5, 3.5, "#3b2a1a") + line("M50 61 L50 66 M44 68 Q50 72 56 68", "#3b2a1a", 2) + path("M38 86 L50 92 L38 98Z", "#e03131") + path("M62 86 L50 92 L62 98Z", "#e03131") + circ(50, 92, 4, "#c92a2a")));

  add("kite", A(
    path("M50 6 L84 42 L50 82 L16 42Z", "#fa5252") + path("M50 6 L84 42 L50 42Z", "#ffd43b") + path("M16 42 L50 82 L50 42Z", "#ffd43b") + line("M50 6 L50 82 M16 42 L84 42", "#fff", 2.5) +
    line("M50 82 Q36 88 46 94 Q56 98 48 100", "#495057", 2) + path("M40 90 L48 86 L48 94Z", "#339af0") + path("M58 94 L50 92 L52 99Z", "#51cf66")));

  // ---------------- school ----------------
  add("book", A(
    rect(16, 12, 68, 78, "#1c7ed6", 6) + rect(16, 12, 10, 78, "#1864ab", 4) + rect(36, 24, 36, 26, "#fff", 3) + line("M42 33 L66 33 M42 41 L60 41", "#74c0fc", 3) + rect(30, 86, 50, 4, "#e9ecef", 2)));
  add("pen", A(`<g transform="rotate(40 50 50)">${rect(42, 6, 16, 70, "#339af0", 6)}${rect(42, 6, 16, 18, "#1864ab", 6)}${path("M42 76 L58 76 L50 94Z", "#343a40")}${line("M62 12 L62 36", "#ced4da", 3)}</g>`));
  add("pencil", A(`<g transform="rotate(-40 50 50)">${rect(42, 6, 16, 10, "#f783ac", 4)}${rect(42, 15, 16, 7, "#adb5bd")}${rect(42, 22, 16, 48, "#ffd43b")}${line("M50 22 L50 70", "#fab005", 2)}${path("M42 70 L58 70 L50 92Z", "#f1c27d")}${path("M47 83 L53 83 L50 92Z", "#343a40")}</g>`));
  add("ruler", A(`<g transform="rotate(-35 50 50)">${rect(8, 36, 84, 28, "#ffe066", 4, 'stroke="#f59f00" stroke-width="2"')}${[16, 26, 36, 46, 56, 66, 76, 86].map((x, i) => line(`M${x} 36 L${x} ${i % 2 ? 48 : 54}`, "#8d6e00", 2)).join("")}</g>`));
  add("crayon", A(`<g transform="rotate(35 50 50)">${rect(40, 22, 20, 56, "#51cf66", 3)}${rect(40, 36, 20, 24, "#f8f9fa", 0)}${line("M44 46 L56 46 M44 52 L56 52", "#2f9e44", 2.5)}${path("M40 22 L60 22 L50 6Z", "#51cf66")}</g>`));
  add("paper", A(path("M22 8 L66 8 L82 24 L82 92 L22 92Z", "#fff", 'stroke="#adb5bd" stroke-width="2.5"') + path("M66 8 L66 24 L82 24Z", "#dee2e6") + line("M32 40 L72 40 M32 52 L72 52 M32 64 L72 64 M32 76 L56 76", "#74c0fc", 3)));

  // ---------------- food ----------------
  add("milk", A(
    path("M28 34 L72 34 L72 92 L28 92Z", "#fff", 'stroke="#ced4da" stroke-width="2.5"') + path("M28 34 L50 12 L72 34Z", "#e9ecef", 'stroke="#ced4da" stroke-width="2.5"') + rect(28, 50, 44, 24, "#4dabf7") +
    circ(42, 62, 6, "#fff") + circ(58, 60, 4, "#fff") + circ(52, 68, 3, "#fff")));
  add("water", A(
    path("M26 18 L74 18 L68 90 L32 90Z", "#e7f5ff", 'stroke="#74c0fc" stroke-width="3"') + path("M29 42 L71 42 L68 90 L32 90Z", "#74c0fc") + path("M36 52 Q44 56 52 52", "none", 'stroke="#fff" stroke-width="3" opacity=".7"') + path("M60 6 L56 36", "none", 'stroke="#ff6b6b" stroke-width="4" stroke-linecap="round"')));
  add("bread", A(
    path("M12 62 Q8 30 34 28 Q50 20 66 28 Q92 30 88 62 L88 78 Q88 88 78 88 L22 88 Q12 88 12 78Z", "#e0a458") + line("M32 36 L40 52 M50 32 L58 50 M68 36 L74 52", "#b8741a", 4) + elli(34, 42, 10, 4, "#f7d29a", 'opacity=".6"')));
  add("egg", A(elli(50, 56, 25, 32, "#fff8e1", 'stroke="#e0c9a6" stroke-width="3"') + elli(40, 42, 6, 11, "#fff", 'opacity=".7" transform="rotate(20 40 42)"') + path("M30 82 Q50 96 70 82", "none", 'stroke="#d9a066" stroke-width="3" opacity=".4"')));
  add("cake", A(
    rect(12, 64, 76, 24, "#c68642", 5) + rect(12, 50, 76, 14, "#fff3bf") + path("M12 50 Q22 38 32 50 Q42 38 52 50 Q62 38 72 50 Q82 38 88 50Z", "#f783ac") +
    line("M50 34 L50 24", "#e03131", 3) + circ(50, 40, 6, "#e03131") + elli(50, 18, 3, 6, "#ffd43b")));
  add("ice cream", A(
    path("M30 50 L70 50 L50 94Z", "#e0a458") + line("M38 56 L56 80 M62 56 L44 80 M32 62 L68 62", "#b8741a", 2) + circ(50, 44, 22, "#f783ac") + circ(50, 26, 18, "#8d5524") +
    circ(50, 9, 6, "#e03131") + elli(42, 34, 5, 3, "#fff", 'opacity=".4"')));
  add("pizza", A(
    path("M50 94 L10 22 Q50 4 90 22Z", "#ffd43b") + path("M10 22 Q50 4 90 22", "none", 'stroke="#e0a458" stroke-width="9" stroke-linecap="round"') + circ(36, 36, 7, "#e03131") + circ(60, 34, 7, "#e03131") +
    circ(48, 58, 7, "#e03131") + circ(46, 42, 2.5, "#2b8a3e") + circ(66, 48, 2.5, "#2b8a3e") + circ(50, 74, 2.5, "#2b8a3e")));
  add("juice", A(
    path("M26 24 L74 24 L67 90 L33 90Z", "#ffa94d", 'stroke="#fd7e14" stroke-width="2"') + path("M29 34 L71 34", "none", 'stroke="#fff" stroke-width="3" opacity=".5"') + circ(28, 24, 11, "#fd7e14") + circ(28, 24, 7, "#ffd8a8") +
    path("M60 8 L56 44", "none", 'stroke="#e03131" stroke-width="4" stroke-linecap="round"')));
  add("cheese", A(
    path("M8 72 L92 72 L92 40Z", "#fcc419") + path("M8 72 L92 72 L92 84 L8 84Z", "#f59f00") + circ(66, 66, 5, "#f59f00") + circ(40, 74, 3.5, "#f59f00") + circ(80, 56, 4, "#f59f00") + circ(24, 78, 3, "#e67700")));
  add("chocolate", A(
    rect(20, 10, 60, 82, "#6f4e37", 6) + rect(20, 10, 60, 20, "#ced4da", 6) + line("M20 52 L80 52 M20 72 L80 72 M40 30 L40 92 M60 30 L60 92", "#8d6a4f", 3) + elli(32, 40, 6, 4, "#8d6a4f", 'opacity=".7"')));

  // ---------------- fruit ----------------
  add("apple", A(
    circ(37, 58, 28, "#e03131") + circ(63, 58, 28, "#e03131") + elli(50, 40, 12, 6, "#c92a2a") + line("M50 38 Q50 22 60 14", "#6d4c1f", 4) + path("M54 24 Q70 10 82 24 Q66 32 54 24Z", "#51cf66") + elli(32, 56, 6, 11, "#fff", 'opacity=".3"')));
  add("banana", A(
    path("M14 28 Q26 90 84 72 Q92 68 84 62 Q44 70 30 22 Q22 18 14 28Z", "#ffd43b", 'stroke="#f59f00" stroke-width="2"') + path("M12 26 L20 18 L24 28Z", "#6d4c1f") + circ(86, 66, 4, "#6d4c1f")));
  add("orange", A(
    circ(50, 54, 36, "#fd7e14") + elli(36, 40, 10, 6, "#fff", 'opacity=".35" transform="rotate(-30 36 40)"') + path("M50 20 Q62 6 76 16 Q64 28 50 20Z", "#51cf66") + circ(50, 22, 3, "#2b8a3e") +
    circ(40, 62, 1.6, "#e8590c") + circ(58, 70, 1.6, "#e8590c") + circ(66, 52, 1.6, "#e8590c") + circ(48, 50, 1.6, "#e8590c")));
  add("strawberry", A(
    path("M50 92 Q14 62 16 36 Q20 22 50 28 Q80 22 84 36 Q86 62 50 92Z", "#e03131") + path("M30 28 L40 18 L50 26 L60 18 L70 28 L50 34Z", "#51cf66") +
    [[36, 44], [52, 42], [66, 46], [42, 58], [58, 58], [50, 72], [34, 62], [68, 62]].map(([x, y]) => elli(x, y, 2, 3, "#ffe066")).join("")));
  add("grapes", A(
    path("M50 18 Q50 8 60 6", "none", 'stroke="#6d4c1f" stroke-width="4" stroke-linecap="round"') + path("M52 14 Q68 4 80 16 Q64 24 52 14Z", "#51cf66") +
    [[34, 32], [50, 30], [66, 32], [26, 48], [42, 48], [58, 48], [74, 48], [34, 64], [50, 64], [66, 64], [42, 80], [58, 80], [50, 92]].map(([x, y]) => circ(x, y, 10, "#7950f2")).join("") +
    circ(31, 28, 3, "#fff", 'opacity=".5"') + circ(47, 44, 3, "#fff", 'opacity=".5"')));

  // ---------------- home ----------------
  add("house", A(
    rect(70, 16, 10, 22, "#c92a2a") + rect(18, 46, 64, 44, "#ffd8a8") + path("M8 50 L50 12 L92 50Z", "#e03131") + rect(44, 62, 16, 28, "#8d5524", 2) + circ(56, 76, 1.8, "#ffd43b") +
    rect(26, 58, 14, 14, "#74c0fc", 2) + line("M33 58 L33 72 M26 65 L40 65", "#fff", 2) + rect(64, 58, 12, 14, "#74c0fc", 2)));
  add("bed", A(
    rect(8, 30, 8, 58, "#8d5524", 3) + rect(84, 52, 8, 36, "#8d5524", 3) + rect(12, 62, 80, 12, "#a66a2f", 3) + rect(14, 48, 72, 16, "#fff", 4) + rect(38, 48, 48, 16, "#4dabf7", 4) +
    elli(26, 48, 13, 7, "#ffe066") + line("M44 54 L80 54", "#1c7ed6", 2)));
  add("door", A(
    rect(24, 6, 52, 88, "#8d5524", 4) + rect(32, 14, 16, 30, "#a66a2f", 2) + rect(52, 14, 16, 30, "#a66a2f", 2) + rect(32, 50, 16, 36, "#a66a2f", 2) + rect(52, 50, 16, 36, "#a66a2f", 2) + circ(66, 52, 4, "#ffd43b")));
  add("table", A(
    rect(8, 36, 84, 12, "#c68642", 4) + rect(16, 48, 9, 42, "#a66a2f", 2) + rect(75, 48, 9, 42, "#a66a2f", 2) + rect(28, 48, 44, 5, "#a66a2f", 2)));
  add("chair", A(
    rect(30, 8, 8, 52, "#a66a2f", 3) + rect(30, 8, 36, 8, "#a66a2f", 3) + rect(30, 24, 36, 6, "#a66a2f", 3) + rect(24, 52, 52, 10, "#c68642", 4) + rect(26, 62, 8, 30, "#a66a2f", 2) + rect(66, 62, 8, 30, "#a66a2f", 2)));
  add("window", A(
    rect(12, 12, 76, 76, "#8d5524", 5) + rect(20, 20, 60, 60, "#74c0fc", 3) + line("M50 20 L50 80 M20 50 L80 50", "#8d5524", 5) + path("M26 30 L38 30 L26 42Z", "#fff", 'opacity=".45"')));

  // ---------------- clothes ----------------
  add("hat", A(
    elli(50, 66, 44, 13, "#e0a458") + path("M28 66 Q28 28 50 28 Q72 28 72 66Z", "#e0a458") + rect(28, 52, 44, 9, "#e03131") + elli(40, 40, 6, 9, "#f7d29a", 'opacity=".6"')));
  add("shoes", A(
    path("M10 68 L10 48 Q30 52 40 36 L60 36 Q62 54 86 60 Q94 62 94 72 L94 76 L10 76Z", "#4dabf7") + rect(8, 72, 88, 12, "#f8f9fa", 6, 'stroke="#ced4da" stroke-width="2"') +
    line("M44 42 L52 48 M50 38 L58 44 M56 40 L62 46", "#fff", 3) + path("M10 68 Q14 60 28 62 L28 76 L10 76Z", "#1c7ed6")));
  add("socks", A(
    path("M34 8 L62 8 L62 54 Q88 58 88 76 Q88 90 70 90 Q50 90 44 70 L34 54Z", "#ff8787") + rect(34, 14, 28, 8, "#fff") + rect(34, 28, 28, 8, "#fff") + path("M44 70 Q50 90 70 90 Q88 90 88 76 Q86 66 74 60 Q62 80 44 70Z", "#e03131")));
  add("t-shirt", A(
    path("M30 12 L8 28 L20 46 L32 40 L32 90 L68 90 L68 40 L80 46 L92 28 L70 12 Q50 26 30 12Z", "#4dabf7") + path("M36 12 Q50 24 64 12", "none", 'stroke="#1c7ed6" stroke-width="3"') + circ(50, 62, 8, "#ffd43b")));
  add("dress", A(
    path("M38 8 L46 8 L50 22 L54 8 L62 8 L60 38 L86 92 L14 92 L40 38Z", "#f06595") + rect(40, 36, 20, 6, "#c2255c") + circ(30, 76, 3, "#fff", 'opacity=".7"') + circ(50, 82, 3, "#fff", 'opacity=".7"') + circ(70, 74, 3, "#fff", 'opacity=".7"')));
  add("cap", A(
    path("M16 62 Q16 24 54 24 Q88 26 88 62Z", "#e03131") + path("M60 58 L98 58 Q100 72 64 70Z", "#c92a2a") + circ(54, 24, 4.5, "#fff") + line("M54 26 L54 60", "#c92a2a", 2)));
  add("trousers", A(
    path("M26 8 L74 8 L80 94 L56 94 L50 46 L44 94 L20 94Z", "#1c7ed6") + rect(26, 8, 48, 9, "#343a40", 2) + rect(46, 8, 8, 9, "#ffd43b", 1) + line("M50 18 L50 46 M32 20 L28 80 M68 20 L72 80", "#74c0fc", 1.8)));

  // ---------------- weather ----------------
  const cloudPath = "M26 66 Q6 66 8 50 Q10 36 28 38 Q32 20 52 22 Q70 22 72 38 Q92 38 90 54 Q88 66 74 66Z";
  add("sun", A([0, 45, 90, 135, 180, 225, 270, 315].map((deg) => `<path d="M50 8 L50 20" stroke="#fcc419" stroke-width="6" stroke-linecap="round" transform="rotate(${deg} 50 50)"/>`).join("") + circ(50, 50, 24, "#ffd43b") + circ(42, 42, 6, "#fff", 'opacity=".4"')));
  add("cloud", A(path(cloudPath, "#dbe4ff", 'stroke="#91a7ff" stroke-width="3" transform="translate(0 10)"')));
  add("rain", A(
    path(cloudPath, "#adb5bd", 'transform="translate(0 -6)"') + line("M26 74 L20 90 M44 74 L38 90 M62 74 L56 90 M80 74 L74 90", "#339af0", 5)));
  add("snow", A(
    path(cloudPath, "#ced4da", 'transform="translate(0 -8)"') + [[26, 82], [50, 88], [74, 82]].map(([x, y]) => line(`M${x - 7} ${y} L${x + 7} ${y} M${x} ${y - 7} L${x} ${y + 7} M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`, "#74c0fc", 2.5)).join("")));

  // ---------------- phrases ----------------
  add("hello", A(
    rect(30, 40, 40, 40, SKIN, 14) + [32, 44, 56, 68].map((x, i) => rect(x - 1, i === 1 || i === 2 ? 10 : 18, 11, 46, SKIN, 5.5)).join("") + elli(24, 60, 8, 14, SKIN, 'transform="rotate(-35 24 60)"') +
    line("M82 20 Q92 30 82 40 M90 14 Q104 30 90 46", "#fcc419", 3.5) + line("M10 20 Q2 30 10 40", "#fcc419", 3.5)));
  add("yes", A(circ(50, 50, 40, "#40c057") + line("M28 52 L44 68 L74 34", "#fff", 10)));
  add("no", A(circ(50, 50, 40, "#fa5252") + line("M32 32 L68 68 M68 32 L32 68", "#fff", 10)));
  add("thank you", A(
    path("M50 82 Q10 54 20 32 Q30 16 50 34 Q70 16 80 32 Q90 54 50 82Z", "#f03e3e") + elli(34, 36, 7, 4, "#fff", 'opacity=".4" transform="rotate(-30 34 36)"') +
    path("M82 14 L84 20 L90 22 L84 24 L82 30 L80 24 L74 22 L80 20Z", "#ffd43b") + path("M16 70 L18 75 L23 77 L18 79 L16 84 L14 79 L9 77 L14 75Z", "#ffd43b")));

  // ---------------- transport & nature ----------------
  add("car", A(
    path("M8 62 L8 52 Q8 46 16 44 L30 42 L40 28 Q42 26 46 26 L66 26 Q70 26 72 30 L80 42 L90 46 Q94 48 94 54 L94 62Z", "#fa5252") + path("M36 42 L44 31 L60 31 L60 42Z", "#a5d8ff") + path("M64 42 L64 31 L68 31 L76 42Z", "#a5d8ff") +
    circ(28, 66, 11, "#343a40") + circ(72, 66, 11, "#343a40") + circ(28, 66, 5, "#ced4da") + circ(72, 66, 5, "#ced4da")));
  add("bus", A(
    rect(8, 22, 84, 52, "#fcc419", 8) + rect(14, 30, 16, 16, "#a5d8ff", 2) + rect(34, 30, 16, 16, "#a5d8ff", 2) + rect(54, 30, 16, 16, "#a5d8ff", 2) + rect(74, 30, 12, 26, "#a5d8ff", 2) +
    rect(8, 56, 84, 6, "#e03131") + circ(26, 76, 10, "#343a40") + circ(74, 76, 10, "#343a40") + circ(26, 76, 4.5, "#ced4da") + circ(74, 76, 4.5, "#ced4da")));
  add("tree", A(
    rect(43, 56, 14, 38, "#8d5524", 3) + circ(50, 34, 28, "#2f9e44") + circ(30, 48, 18, "#40c057") + circ(70, 48, 18, "#40c057") + circ(42, 28, 6, "#69db7c", 'opacity=".7"') + circ(62, 38, 4, "#e03131") + circ(36, 46, 4, "#e03131")));
  add("flower", A(
    line("M50 52 L50 94", "#2f9e44", 5) + path("M50 80 Q70 66 82 78 Q66 90 50 80Z", "#51cf66") + [0, 72, 144, 216, 288].map((deg) => elli(50, 28, 11, 17, "#f783ac", `transform="rotate(${deg} 50 44)"`)).join("") + circ(50, 44, 11, "#ffd43b")));

  // ---------------- batch 2: classes 2-3 ----------------
  add("tiger", A(
    circ(22, 28, 11, "#f08c00") + circ(78, 28, 11, "#f08c00") + circ(22, 28, 5, "#fff") + circ(78, 28, 5, "#fff") + circ(50, 54, 34, "#f08c00") +
    line("M50 22 L50 34 M42 24 L44 34 M58 24 L56 34 M18 46 L32 50 M16 58 L32 58 M82 46 L68 50 M84 58 L68 58", "#212529", 4) + elli(50, 70, 18, 13, "#fff3e0") +
    eyes(50, 13, 4.5) + path("M44 62 L56 62 L50 68Z", "#212529") + line("M50 68 L50 73 M43 75 Q50 80 57 75", "#212529", 2.5)));
  add("bear", A(
    circ(22, 26, 12, "#7b4a21") + circ(78, 26, 12, "#7b4a21") + circ(22, 26, 6, "#b9804b") + circ(78, 26, 6, "#b9804b") + circ(50, 52, 33, "#7b4a21") + elli(50, 64, 17, 14, "#d9a066") +
    eyes(44, 13, 4) + elli(50, 58, 6, 4.5, "#212529") + line("M50 62 L50 68 M42 70 Q50 76 58 70", "#212529", 2.5)));
  add("giraffe", A(
    line("M40 18 L40 8 M60 18 L60 8", "#8d5524", 3) + circ(40, 8, 4, "#8d5524") + circ(60, 8, 4, "#8d5524") + elli(26, 30, 11, 6, "#ffd43b", 'transform="rotate(-25 26 30)"') + elli(74, 30, 11, 6, "#ffd43b", 'transform="rotate(25 74 30)"') +
    elli(50, 48, 24, 34, "#ffd43b") + elli(50, 78, 20, 14, "#ffe8a3") + circ(36, 36, 5, "#c68642") + circ(62, 30, 4, "#c68642") + circ(58, 52, 5, "#c68642") + eyes(46, 13, 4) + circ(43, 78, 3, "#8d5524") + circ(57, 78, 3, "#8d5524")));
  add("zebra", A(
    path("M28 30 L24 8 L44 24Z", "#212529") + path("M72 30 L76 8 L56 24Z", "#212529") + path("M40 8 Q50 0 60 8 L58 30 Q50 22 42 30Z", "#212529") + elli(50, 54, 25, 38, "#fff", 'stroke="#ced4da" stroke-width="1.5"') +
    line("M30 36 L40 40 M28 50 L40 52 M28 64 L40 62 M70 36 L60 40 M72 50 L60 52 M72 64 L60 62", "#212529", 4.5) + eyes(46, 13, 4) + elli(50, 82, 17, 12, "#495057") + circ(43, 82, 3, "#212529") + circ(57, 82, 3, "#212529")));
  add("snake", A(
    line("M16 84 Q8 62 32 60 Q62 58 50 40 Q42 24 68 22", "#51cf66", 14) + line("M16 84 Q8 62 32 60 Q62 58 50 40 Q42 24 68 22", "#2f9e44", 3) + circ(74, 22, 12, "#51cf66") + circ(78, 18, 3.5, "#222") +
    line("M84 24 L94 24 M94 24 L98 20 M94 24 L98 28", "#e03131", 2.5)));
  add("spider", A(
    line("M40 44 L18 28 L10 40 M38 50 L12 52 M38 56 L14 72 L8 84 M42 62 L30 88 M60 44 L82 28 L90 40 M62 50 L88 52 M62 56 L86 72 L92 84 M58 62 L70 88", "#212529", 3.5) +
    elli(50, 60, 16, 20, "#343a40") + circ(50, 38, 12, "#343a40") + circ(45, 36, 3.5, "#fff") + circ(55, 36, 3.5, "#fff") + circ(45, 36, 1.5, "#111") + circ(55, 36, 1.5, "#111") + circ(50, 58, 5, "#e03131", 'opacity=".8"')));
  add("butterfly", A(
    path("M50 46 Q18 8 14 34 Q12 54 50 52Z", "#f06595") + path("M50 46 Q82 8 86 34 Q88 54 50 52Z", "#f06595") + path("M50 54 Q22 60 26 82 Q40 90 50 62Z", "#ffa94d") + path("M50 54 Q78 60 74 82 Q60 90 50 62Z", "#ffa94d") +
    circ(28, 34, 6, "#fff", 'opacity=".7"') + circ(72, 34, 6, "#fff", 'opacity=".7"') + rect(47, 30, 6, 48, "#495057", 3) + line("M48 30 Q42 16 36 14 M52 30 Q58 16 64 14", "#495057", 2.5)));
  add("wolf", A(
    path("M18 48 L20 10 L44 28Z", "#868e96") + path("M82 48 L80 10 L56 28Z", "#868e96") + circ(50, 54, 33, "#868e96") + path("M30 62 Q50 40 70 62 Q64 90 50 92 Q36 90 30 62Z", "#e9ecef") + eyes(48, 13, 4.2) +
    path("M44 66 L56 66 L50 74Z", "#212529") + line("M50 74 L50 80 M42 82 Q50 86 58 82", "#212529", 2.5)));
  add("fox", A(
    path("M14 50 L22 8 L46 30Z", "#f76707") + path("M86 50 L78 8 L54 30Z", "#f76707") + path("M22 8 L28 22 L18 22Z", "#212529") + path("M78 8 L72 22 L82 22Z", "#212529") +
    path("M14 52 Q50 34 86 52 Q70 90 50 92 Q30 90 14 52Z", "#f76707") + path("M24 60 Q50 42 76 60 Q64 90 50 92 Q36 90 24 60Z", "#fff") + eyes(52, 14, 4) + circ(50, 76, 5.5, "#212529")));
  add("crocodile", A(
    path("M6 60 L6 46 Q6 40 14 40 L60 40 Q92 40 94 62 L94 70 L6 70Z", "#40c057") + path("M6 70 L94 70 L94 76 Q50 84 6 76Z", "#b2f2bb") + circ(64, 38, 9, "#40c057") + circ(64, 38, 5, "#fff") + circ(65, 38, 2.5, "#111") +
    path("M12 70 L18 62 L24 70 L30 62 L36 70 L42 62 L48 70 L54 62 L60 70 L66 62 L72 70Z", "#fff") + circ(16, 48, 2, "#2b8a3e") + circ(26, 48, 2, "#2b8a3e")));
  add("parrot", A(
    path("M46 70 L38 98 L52 90 L60 98 L62 70Z", "#2f9e44") + elli(46, 56, 24, 30, "#fa5252") + circ(52, 28, 17, "#fa5252") + path("M66 24 Q82 22 82 38 Q74 34 66 34Z", "#ffd43b") + circ(55, 25, 4.5, "#fff") + circ(56, 25, 2.2, "#111") +
    elli(40, 58, 12, 20, "#339af0", 'transform="rotate(10 40 58)"') + path("M32 50 Q40 74 46 76 Q34 72 32 50Z", "#ffd43b")));
  add("pear", A(
    path("M50 14 Q64 14 66 34 Q68 46 78 60 Q86 88 50 92 Q14 88 22 60 Q32 46 34 34 Q36 14 50 14Z", "#a9e34b") + line("M50 14 Q50 6 56 4", "#6d4c1f", 4) + path("M54 12 Q68 2 78 12 Q66 20 54 12Z", "#51cf66") + elli(38, 62, 5, 11, "#fff", 'opacity=".35"')));
  add("lemon", A(
    path("M6 50 Q14 40 22 38 Q50 20 78 38 Q86 40 94 50 Q86 60 78 62 Q50 80 22 62 Q14 60 6 50Z", "#ffe066", 'stroke="#fab005" stroke-width="2"') + path("M58 30 Q72 14 86 22 Q76 34 58 30Z", "#51cf66") + elli(36, 46, 9, 4, "#fff", 'opacity=".5"')));
  add("cherry", A(
    line("M30 64 Q38 30 62 12 M70 66 Q66 34 62 12", "#6d4c1f", 3.5) + path("M62 12 Q80 4 92 16 Q76 24 62 12Z", "#51cf66") + circ(30, 72, 17, "#e03131") + circ(70, 74, 17, "#c92a2a") + circ(24, 66, 4.5, "#fff", 'opacity=".4"') + circ(64, 68, 4.5, "#fff", 'opacity=".4"')));
  add("potato", A(
    elli(50, 56, 38, 28, "#c68642", 'transform="rotate(-12 50 56)"') + [[36, 48], [56, 44], [66, 62], [44, 66], [30, 62]].map(([x, y]) => circ(x, y, 2.6, "#8d5524")).join("") + elli(36, 44, 9, 4, "#e0b37a", 'opacity=".6"')));
  add("tomato", A(
    circ(50, 56, 36, "#e03131") + path("M50 24 L42 14 L50 18 L58 12 L58 24 L70 22 L58 30 L64 38 L50 32 L36 38 L42 30 L30 22Z", "#2f9e44") + elli(36, 46, 8, 5, "#fff", 'opacity=".35" transform="rotate(-30 36 46)"')));
  add("carrot", A(
    path("M30 30 Q70 30 80 38 Q40 76 14 88 Q18 56 30 30Z", "#fd7e14") + line("M42 40 L52 46 M34 56 L44 60 M26 68 L34 70", "#e8590c", 2.5) + path("M70 36 Q78 14 90 12 Q84 26 80 38Z", "#51cf66") + path("M74 40 Q94 30 96 40 Q86 46 76 44Z", "#2f9e44")));
  add("watermelon", A(
    path("M8 44 Q50 110 92 44Z", "#2f9e44") + path("M13 44 Q50 100 87 44Z", "#f1f3d9") + path("M17 44 Q50 92 83 44Z", "#fa5252") + [[36, 54], [50, 62], [64, 54], [44, 48], [58, 48]].map(([x, y]) => elli(x, y, 2.4, 4, "#212529")).join("") + rect(6, 40, 88, 6, "#2f9e44", 3)));
  add("onion", A(
    path("M50 10 Q54 22 62 34 Q86 50 80 70 Q72 92 50 92 Q28 92 20 70 Q14 50 38 34 Q46 22 50 10Z", "#f783ac") + path("M50 10 Q40 40 36 90 M50 10 Q60 40 64 90", "none", 'stroke="#c2255c" stroke-width="2" opacity=".5"') + path("M44 92 L38 98 M56 92 L62 98", "none", 'stroke="#868e96" stroke-width="3"')));
  add("cucumber", A(
    `<g transform="rotate(-35 50 50)">${rect(8, 36, 84, 28, "#40c057", 14)}${circ(26, 50, 2, "#2b8a3e")}${circ(46, 44, 2, "#2b8a3e")}${circ(62, 56, 2, "#2b8a3e")}${circ(78, 48, 2, "#2b8a3e")}${rect(14, 40, 40, 5, "#8ce99a", 2.5, 'opacity=".6"')}</g>`));
  add("train", A(
    rect(8, 40, 56, 32, "#339af0", 4) + rect(52, 26, 36, 46, "#1c7ed6", 4) + rect(58, 32, 24, 18, "#a5d8ff", 3) + rect(14, 24, 12, 18, "#495057", 2) + rect(10, 18, 20, 6, "#495057", 3) + rect(8, 58, 80, 6, "#e03131") +
    circ(22, 76, 9, "#343a40") + circ(44, 76, 9, "#343a40") + circ(72, 76, 9, "#343a40") + line("M4 88 L96 88", "#868e96", 3)));
  add("plane", A(
    `<g transform="rotate(-20 50 50)">${elli(50, 50, 42, 11, "#f1f3f5", 'stroke="#ced4da" stroke-width="2"')}${path("M44 48 L22 18 L34 18 L60 46Z", "#339af0")}${path("M44 52 L22 82 L34 82 L60 54Z", "#339af0")}${path("M12 46 L6 32 L18 32 L24 46Z", "#339af0")}${elli(74, 49, 5, 3, "#a5d8ff")}${circ(60, 50, 2, "#a5d8ff")}${circ(52, 50, 2, "#a5d8ff")}${circ(44, 50, 2, "#a5d8ff")}</g>`));
  add("bike", A(
    circ(24, 66, 18, "none", 'stroke="#343a40" stroke-width="5"') + circ(76, 66, 18, "none", 'stroke="#343a40" stroke-width="5"') + line("M24 66 L42 38 L66 38 L76 66 M42 38 L50 66 L24 66 M50 66 L66 38 M40 32 L50 32 M64 30 L70 32 L66 38", "#fa5252", 4) + circ(50, 66, 4, "#343a40")));
  add("boat", A(
    path("M10 68 L90 68 L78 86 L22 86Z", "#8d5524") + rect(48, 14, 4, 54, "#495057") + path("M52 16 L86 62 L52 62Z", "#fff", 'stroke="#ced4da" stroke-width="2"') + path("M48 24 L20 62 L48 62Z", "#ff8787") + line("M2 92 Q14 86 26 92 T50 92 T74 92 T98 92", "#74c0fc", 3)));
  add("ship", A(
    path("M6 62 L94 62 L80 84 L20 84Z", "#e03131") + rect(24, 40, 52, 22, "#f1f3f5", 3) + rect(40, 24, 20, 16, "#339af0", 3) + rect(64, 16, 10, 24, "#ffd43b", 2) + [30, 42, 54, 66].map((x) => circ(x, 51, 4, "#74c0fc")).join("") + line("M2 92 Q14 86 26 92 T50 92 T74 92 T98 92", "#74c0fc", 3)));
  add("moon", A(
    path("M62 10 Q18 16 18 56 Q20 88 62 92 Q38 76 38 50 Q38 24 62 10Z", "#ffd43b") + path("M74 20 L77 28 L86 29 L79 35 L81 44 L74 39 L66 44 L68 35 L61 29 L70 28Z", "#ffe066") + circ(82, 70, 3, "#ffe066") + circ(70, 84, 2.4, "#ffe066")));
  add("star", A(path("M50 8 L61 36 L92 38 L68 58 L76 88 L50 72 L24 88 L32 58 L8 38 L39 36Z", "#ffd43b", 'stroke="#fab005" stroke-width="3" stroke-linejoin="round"') + elli(42, 36, 5, 3, "#fff", 'opacity=".5"')));
  add("sea", A(
    rect(0, 20, 100, 80, "#a5d8ff", 0) + circ(78, 20, 12, "#ffd43b") + path("M0 46 Q12 36 25 46 T50 46 T75 46 T100 46 L100 100 L0 100Z", "#4dabf7") + path("M0 66 Q12 56 25 66 T50 66 T75 66 T100 66 L100 100 L0 100Z", "#339af0") + path("M0 86 Q12 76 25 86 T50 86 T75 86 T100 86 L100 100 L0 100Z", "#1c7ed6")));
  add("grass", A(
    [[16, 12], [28, 0], [40, 14], [50, 4], [62, 14], [72, 0], [84, 12]].map(([x, h]) => path(`M${x - 6} 92 Q${x} ${40 + h} ${x + 2} ${30 + h} Q${x + 6} ${50 + h} ${x + 6} 92Z`, "#51cf66")).join("") + rect(6, 88, 88, 8, "#8d5524", 3)));
  add("sofa", A(
    rect(10, 34, 80, 30, "#845ef7", 10) + rect(4, 48, 20, 32, "#7048e8", 8) + rect(76, 48, 20, 32, "#7048e8", 8) + rect(22, 54, 56, 24, "#9775fa", 6) + line("M50 54 L50 78", "#7048e8", 2) + rect(14, 80, 6, 10, "#495057") + rect(80, 80, 6, 10, "#495057")));
  add("lamp", A(
    path("M30 16 L70 16 L82 54 L18 54Z", "#ffd43b", 'stroke="#fab005" stroke-width="2"') + rect(47, 54, 6, 28, "#868e96", 2) + elli(50, 88, 20, 6, "#495057") + path("M26 56 L74 56 L90 70 L10 70Z", "#ffe066", 'opacity=".35"')));
  add("guitar", A(
    `<g transform="rotate(35 50 50)">${rect(46, 2, 8, 46, "#6d4c1f", 2)}${rect(43, 0, 14, 10, "#343a40", 2)}${elli(50, 66, 22, 18, "#e8590c")}${elli(50, 80, 26, 17, "#e8590c")}${circ(50, 72, 7, "#3b2a1a")}${line("M48 8 L48 76 M52 8 L52 76", "#fff", 1)}${rect(40, 88, 20, 4, "#6d4c1f", 2)}</g>`));
  add("piano", A(
    rect(6, 26, 88, 52, "#212529", 5) + [0, 1, 2, 3, 4, 5].map((i) => rect(10 + i * 14, 32, 12, 42, "#fff", 2)).join("") + [0, 1, 3, 4].map((i) => rect(20 + i * 14, 32, 8, 24, "#212529", 1.5)).join("")));
  add("drums", A(
    path("M22 50 Q22 40 50 40 Q78 40 78 50 L78 76 Q78 88 50 88 Q22 88 22 76Z", "#e03131") + elli(50, 50, 28, 8, "#f1f3f5") + path("M22 62 L38 86 M78 62 L62 86 M50 58 L50 88", "none", 'stroke="#fff" stroke-width="2" opacity=".6"') + line("M20 8 L50 44 M80 8 L52 44", "#c68642", 5) + circ(20, 8, 5, "#c68642") + circ(80, 8, 5, "#c68642")));
  add("computer", A(
    rect(12, 12, 76, 52, "#343a40", 6) + rect(18, 18, 64, 40, "#74c0fc", 3) + rect(42, 64, 16, 12, "#868e96") + rect(28, 76, 44, 6, "#868e96", 3) + path("M24 50 L40 34 L52 46 L62 36 L76 50Z", "#fff", 'opacity=".5"')));
  add("tv", A(
    line("M36 6 L50 24 L64 6", "#495057", 3) + rect(8, 24, 84, 56, "#495057", 8) + rect(14, 30, 58, 44, "#74c0fc", 4) + circ(82, 40, 4, "#fa5252") + circ(82, 54, 4, "#ffd43b") + circ(82, 68, 4, "#51cf66") + path("M20 66 L34 48 L44 58 L54 46 L66 66Z", "#fff", 'opacity=".5"')));
  add("sandwich", A(
    path("M10 44 Q10 20 50 20 Q90 20 90 44Z", "#e0a458") + rect(8, 44, 84, 8, "#51cf66", 4) + rect(10, 52, 80, 8, "#e03131", 3) + rect(8, 60, 84, 8, "#ffd43b", 3) + rect(10, 68, 80, 8, "#f783ac", 3) + path("M10 76 L90 76 L88 84 Q50 92 12 84Z", "#e0a458")));
  add("soup", A(
    path("M10 52 L90 52 Q88 88 50 88 Q12 88 10 52Z", "#4dabf7") + elli(50, 52, 40, 9, "#ff922b") + circ(36, 52, 4, "#51cf66") + circ(56, 54, 4, "#ffd43b") + circ(66, 50, 3, "#e03131") + line("M34 36 Q28 28 36 20 M50 38 Q44 28 52 18 M66 36 Q60 28 68 20", "#ced4da", 3.5)));
  add("chicken", A(
    `<g transform="rotate(-35 50 50)">${rect(44, 56, 12, 36, "#f1f3f5", 4)}${circ(40, 94, 6, "#f1f3f5")}${circ(60, 94, 6, "#f1f3f5")}${elli(50, 36, 24, 30, "#e8590c")}${elli(42, 28, 8, 12, "#f59f00", 'opacity=".7"')}</g>`));
  add("tea", A(
    path("M18 38 L72 38 Q72 80 45 80 Q18 80 18 38Z", "#fff", 'stroke="#ced4da" stroke-width="3"') + elli(45, 38, 27, 6, "#e8590c") + path("M72 46 Q92 46 88 62 Q84 72 70 70", "none", 'stroke="#ced4da" stroke-width="5"') + elli(45, 86, 34, 6, "#e9ecef") +
    line("M34 24 Q28 16 36 8 M48 24 Q42 16 50 8 M60 24 Q54 16 62 8", "#ced4da", 3.5)));
  add("doctor", A(
    path("M14 100 Q50 68 86 100Z", "#fff", 'stroke="#ced4da" stroke-width="2"') + path("M42 78 L50 100 L58 78Z", "#4dabf7") + circ(50, 50, 24, SKIN) + path("M26 46 Q28 22 50 22 Q72 22 74 46 Q60 34 50 34 Q40 34 26 46Z", "#3b2a1a") +
    circ(50, 24, 7, "#e9ecef", 'stroke="#868e96" stroke-width="2"') + eyes(52, 10, 3.6) + smile(62, 8) + line("M30 82 Q24 96 40 96", "#495057", 3) + circ(42, 96, 4, "#868e96")));
  add("cook", A(
    circ(34, 20, 14, "#fff", 'stroke="#ced4da" stroke-width="2"') + circ(50, 14, 16, "#fff", 'stroke="#ced4da" stroke-width="2"') + circ(66, 20, 14, "#fff", 'stroke="#ced4da" stroke-width="2"') + rect(34, 22, 32, 14, "#fff") +
    path("M14 100 Q50 72 86 100Z", "#fff", 'stroke="#ced4da" stroke-width="2"') + circ(50, 54, 22, SKIN) + eyes(54, 9, 3.4) + path("M40 64 Q50 60 60 64 Q50 68 40 64Z", "#3b2a1a") + smile(68, 6)));
  add("skirt", A(path("M30 14 L70 14 L74 24 L94 90 L6 90 L26 24Z", "#f06595") + rect(28, 14, 44, 10, "#c2255c", 2) + line("M40 30 L30 88 M50 30 L50 88 M60 30 L70 88", "#c2255c", 2) + circ(50, 19, 2, "#ffd43b")));
  add("coat", A(
    path("M30 10 L10 24 L6 90 L30 90 L32 36 L50 30 L68 36 L70 90 L94 90 L90 24 L70 10 L50 30Z", "#c68642") + path("M36 16 L50 52 L64 16 L50 30Z", "#a66a2f") + [52, 64, 76].map((y) => circ(50, y, 3, "#ffd43b")).join("") + line("M50 30 L50 90", "#a66a2f", 2)));
  add("shirt", A(
    path("M30 12 L8 28 L18 46 L30 40 L30 90 L70 90 L70 40 L82 46 L92 28 L70 12 L50 24Z", "#fff", 'stroke="#ced4da" stroke-width="2"') + path("M30 12 L50 36 L70 12 L50 24Z", "#e9ecef", 'stroke="#ced4da" stroke-width="2"') +
    line("M50 36 L50 90", "#ced4da", 2) + [48, 60, 72].map((y) => circ(50, y, 2.5, "#4dabf7")).join("")));
  add("jumper", A(
    path("M30 12 L6 30 L12 64 L28 60 L28 90 L72 90 L72 60 L88 64 L94 30 L70 12 Q50 24 30 12Z", "#ff8787") + rect(28, 80, 44, 10, "#fa5252") + rect(28, 44, 44, 6, "#fff", 0, 'opacity=".8"') + rect(28, 58, 44, 6, "#fff", 0, 'opacity=".8"') + path("M36 12 Q50 26 64 12", "none", 'stroke="#fa5252" stroke-width="4"')));
  add("tooth", A(
    path("M26 18 Q50 6 74 18 Q86 36 72 60 Q70 92 60 92 Q52 92 50 70 Q48 92 40 92 Q30 92 28 60 Q14 36 26 18Z", "#fff", 'stroke="#ced4da" stroke-width="3" stroke-linejoin="round"') + elli(38, 30, 6, 10, "#e7f5ff", 'transform="rotate(20 38 30)"')));
})();
