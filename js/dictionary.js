"use strict";

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const TRANSLATION_MAX_LENGTH = 40;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Translates a short text using the free MyMemory API (no key needed).
 * The top-level "translatedText" is often just the input echoed back,
 * so the best candidate is chosen from the "matches" array instead.
 * @param {string} text
 * @param {"en"|"pl"} from
 * @param {"en"|"pl"} to
 * @returns {Promise<string>} translation, or "" when nothing sensible was found
 * @throws {Error} on network failure or exhausted quota
 */
async function translateOnline(text, from, to) {
  const query = text.trim();
  const url = `${MYMEMORY_URL}?q=${encodeURIComponent(query)}&langpair=${from}|${to}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Słownik online jest niedostępny.");
    const json = await response.json();
    if (json.quotaFinished) throw new Error("Dzienny limit słownika online został wyczerpany.");
    return pickBestTranslation(json, query);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @param {{responseData?: {translatedText?: string}, matches?: Array<Record<string, unknown>>}} json
 * @param {string} query
 * @returns {string}
 */
function pickBestTranslation(json, query) {
  const queryKey = normalize(query);
  const isUsable = (candidate) =>
    typeof candidate === "string" &&
    candidate.length > 0 &&
    candidate.length <= TRANSLATION_MAX_LENGTH &&
    !/MYMEMORY WARNING/i.test(candidate) &&
    normalize(candidate) !== queryKey;

  const matches = (json.matches || [])
    .filter((entry) => normalize(String(entry.segment || "")) === queryKey && isUsable(entry.translation))
    .sort((first, second) => Number(second.match) - Number(first.match) || Number(second["usage-count"]) - Number(first["usage-count"]));

  const best = matches.length > 0 ? String(matches[0].translation) : json.responseData?.translatedText;
  if (!isUsable(best)) return "";
  const cleaned = best.replace(/[.!]+$/, "").trim();
  const keepLowercase = query[0] === query[0].toLowerCase();
  return keepLowercase ? cleaned.charAt(0).toLowerCase() + cleaned.slice(1) : cleaned;
}
