"use strict";

const TESSERACT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
const OCR_LANGUAGES = "eng+pol";
const OCR_MAX_IMAGE_SIDE = 1800;

/** @param {string} src @returns {Promise<void>} */
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (window.Tesseract) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Nie udało się pobrać modułu OCR (brak internetu?)."));
    document.head.appendChild(script);
  });
}

/**
 * Shrinks large phone photos so OCR runs faster and uses less memory.
 * @param {File} file
 * @returns {Promise<Blob>}
 */
async function downscaleImage(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, OCR_MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob || file), "image/png"));
  } catch {
    return file;
  }
}

/**
 * Runs Tesseract.js (in the browser, free, no API key) on an image.
 * @param {File} file
 * @param {(progress: number) => void} onProgress value 0..1
 * @returns {Promise<string>}
 */
async function recognizeText(file, onProgress) {
  await loadScriptOnce(TESSERACT_URL);
  const image = await downscaleImage(file);
  const result = await Tesseract.recognize(image, OCR_LANGUAGES, {
    logger: (message) => {
      if (message.status === "recognizing text") onProgress(message.progress);
    },
  });
  return result.data.text;
}
