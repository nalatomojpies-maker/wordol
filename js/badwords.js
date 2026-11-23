"use strict";

/**
 * Filter for swear words (Polish and English) in what children type into the app:
 * own words to add (and their dictionary translations) and the name.
 * Catches common disguises: no Polish letters, digits/symbols for letters (k0rwa, $hit),
 * repeated letters (kuuurwa) and letters split by dots or spaces (k.u.r.w.a).
 * Built to avoid false alarms on normal words (e.g. "class", "pass", "suka" as a female dog is allowed).
 */

/** Stems that never appear in ordinary words – found anywhere in a word. */
const BAD_ANYWHERE = [
  "kurw", "chuj", "pierdol", "pierdal", "jeban", "jebac", "jebie", "jebn", "jebl", "zajeb", "pojeb", "wyjeb", "odjeb", "rozjeb",
  "zjeb", "pizd", "skurw", "kutas", "fuck", "fck", "motherf", "cunt", "bitch", "shit", "asshole", "ashole", "nigg", "wanker", "bollock", "bolock",
];

/** Stems that must start a word (so that e.g. "class" or "gown" stay allowed). */
const BAD_START = [
  "huj", "jeb", "fiut", "korwa", "korwy", "korwo", "korwisk", "korwic", "cwel", "gowno", "gowna", "gownian", "gowien", "sraj", "srac", "sral", "sracz", "dupa", "dupy", "dupe", "dupie", "dupek", "dupk", "dupsk",
  "ciota", "cioty", "bastard", "arsehole", "dickhead", "faggot", "slut", "whore", "twat", "piss",
];

/** Ordinary words that would otherwise look rude. */
const FILTER_ALLOWED = ["shiitake", "scunthorpe"];

/** Whole words only. */
const BAD_EXACT = ["ass", "arse", "dick", "dicks", "fag", "fags", "cipa", "cipy", "cipe", "cipie", "cipka", "cipki"];

const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", 8: "b", "@": "a", $: "s", "!": "i", "|": "l", "€": "e" };

/** Lower case, no Polish letters, digits and symbols turned into letters. */
function normalizeForFilter(text) {
  return String(text)
    .toLocaleLowerCase("pl")
    .replace(/ł/g, "l")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[0134578@$!|€]/g, (char) => LEET[char] || char);
}

/** "k.u.r.w.a" / "k u r w a" → "kurwa" (only runs of single letters, so normal sentences are not glued together). */
const joinSpelledOut = (text) => text.replace(/\b(?:[a-z][^a-z\n]{1,2}){2,}[a-z]\b/g, (run) => run.replace(/[^a-z]/g, ""));

function wordIsBad(word) {
  if (!word || FILTER_ALLOWED.includes(word)) return false;
  // a star instead of a letter (ch*j, f*ck): try the letters it usually hides
  if (word.includes("*")) {
    const stars = (word.match(/\*/g) || []).length;
    if (stars > 2) return wordIsBad(word.replace(/\*/g, ""));
    return [..."aeiouyckr"].some((letter) => wordIsBad(word.replace("*", letter)));
  }
  const variants = new Set([word, word.replace(/(.)\1+/g, "$1")]); // also without repeated letters: kuuurwa → kurwa
  for (const variant of variants) {
    if (BAD_ANYWHERE.some((stem) => variant.includes(stem))) return true;
    if (BAD_START.some((stem) => variant.startsWith(stem))) return true;
    if (BAD_EXACT.map(normalizeForFilter).includes(variant)) return true;
  }
  return false;
}

/** Does the text contain a swear word (in Polish or English)? */
function containsBadWord(text) {
  if (!text) return false;
  const normalized = joinSpelledOut(normalizeForFilter(text));
  return normalized.split(/[^a-z*]+/).some((word) => wordIsBad(word.replace(/^\*+|\*+$/g, "")));
}

/** The gentle telling-off: a sad Rychu and a short message. */
function showBadWordsWarning() {
  sfx("bad");
  if ($("#badWords")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="badWords" role="alertdialog" aria-modal="true" aria-labelledby="badWordsTitle">
      <div class="modal bad-words">
        <div class="modal-rychu">${rychuSvg("sad", 90)}</div>
        <div class="bad-words-face" aria-hidden="true">😢</div>
        <h2 id="badWordsTitle">Nie ładnie, próbujesz zakazanych słów. Przestań proszę.</h2>
        <div class="modal-actions"><button class="btn primary" data-action="badWordsOk">OK</button></div>
      </div>
    </div>`);
  setPageInert(true);
  $("#badWords .btn.primary").focus();
}

function closeBadWordsWarning() {
  closeModal("badWords");
  setPageInert(false);
}
