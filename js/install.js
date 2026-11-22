"use strict";

/**
 * "Dodaj do ekranu": suggests installing the app as a shortcut on the phone / computer.
 * - Opened from the shortcut (standalone window): nothing is suggested.
 * - Android / desktop Chrome, Edge, Samsung: the browser's own install window (beforeinstallprompt).
 * - iPhone / iPad: Apple allows no install button – a short picture guide (Share → Add to Home Screen).
 * - Other browsers: where to find "Install" in the browser menu.
 * Shown on the 2nd launch in a browser; after "Nie teraz" again 10 launches later. Also in Profil.
 * Kept under its own key, so "Wyczyść profil" does not bring it back.
 */
const INSTALL_KEY = "wordol.install.v1";
const INSTALL_FIRST_LAUNCH = 2;
const INSTALL_SNOOZE_LAUNCHES = 10;

let installPromptEvent = null;
let installCheckedThisLaunch = false;

const isStandaloneApp = () =>
  window.matchMedia("(display-mode: fullscreen), (display-mode: standalone), (display-mode: minimal-ui)").matches || navigator.standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const launchCount = () => Number(readSupportStore().launches) || 0;

function readInstallStore() {
  try {
    return JSON.parse(localStorage.getItem(INSTALL_KEY) || "null") || {};
  } catch {
    return {};
  }
}

function writeInstallStore(changes) {
  try {
    localStorage.setItem(INSTALL_KEY, JSON.stringify({ ...readInstallStore(), ...changes }));
  } catch {
    /* storage blocked – nothing to remember */
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault(); // our own, friendlier window instead of the browser's banner
  installPromptEvent = event;
});

window.addEventListener("appinstalled", () => {
  installPromptEvent = null;
  writeInstallStore({ installed: Date.now() });
  closeModal("installAsk");
  setPageInert(false);
  toast("📲 Gotowe! WORD4ALL jest na ekranie – otwieraj ją ikonką.");
});

/** Chrome on Android can tell whether this app is already installed (via related_applications in the manifest). */
async function alreadyInstalled() {
  if (readInstallStore().installed) return true;
  try {
    if (navigator.getInstalledRelatedApps) return (await navigator.getInstalledRelatedApps()).length > 0;
  } catch {
    /* not supported */
  }
  return false;
}

/** What the window says and offers on this device. */
function installGuideHtml() {
  if (installPromptEvent) {
    return {
      text: "Dodaj WORD4ALL do ekranu – będzie pod ręką jak zwykła aplikacja, otworzy się na cały ekran i zadziała bez internetu.",
      buttons: `<button class="btn primary" data-action="installNow">📲 Zainstaluj</button>
        <button class="btn" data-action="installLater">Nie teraz</button>`,
    };
  }
  const steps = isIos()
    ? `<ol class="install-steps">
        <li>Stuknij <b>Udostępnij</b> <span class="install-key">⬆️</span> na dole (lub u góry) Safari.</li>
        <li>Przewiń i wybierz <b>Do ekranu początkowego</b> <span class="install-key">➕</span>.</li>
        <li>Stuknij <b>Dodaj</b>. Ikonka z Rychem pojawi się na ekranie.</li>
      </ol>`
    : `<ol class="install-steps">
        <li>Otwórz menu przeglądarki <span class="install-key">⋮</span> (albo <span class="install-key">☰</span>).</li>
        <li>Wybierz <b>Zainstaluj aplikację</b> albo <b>Dodaj do ekranu głównego</b>.</li>
        <li>Potwierdź. Ikonka z Rychem pojawi się na ekranie.</li>
      </ol>`;
  return {
    text: `Dodaj WORD4ALL do ekranu – będzie pod ręką jak zwykła aplikacja i zadziała bez internetu.${steps}`,
    buttons: `<button class="btn primary" data-action="installLater">👍 OK</button>`,
  };
}

function openInstallWindow() {
  if ($("#installAsk")) return;
  const { text, buttons } = installGuideHtml();
  document.body.insertAdjacentHTML("beforeend", quietModalHtml("installAsk", "📲 WORD4ALL na ekranie telefonu", text, buttons));
  setPageInert(true);
  $("#installAsk .btn.primary").focus();
}

/** After a screen change: on the chosen launches, in a browser (not from the shortcut), in menus only. */
async function maybeSuggestInstall() {
  if (installCheckedThisLaunch || isStandaloneApp()) return;
  if (["welcome", "session", "game", "result"].includes(view) || $(".modal-backdrop") || $("#tutorial") || $("#celebrate")) return;
  const store = readInstallStore();
  if (launchCount() < (store.nextAt || INSTALL_FIRST_LAUNCH)) return;
  installCheckedThisLaunch = true;
  if (await alreadyInstalled()) return;
  // Chrome-like browsers announce installability a moment after loading; no announcement there = probably installed already
  if ("onbeforeinstallprompt" in window && !installPromptEvent && !isIos()) return;
  writeInstallStore({ nextAt: launchCount() + INSTALL_SNOOZE_LAUNCHES });
  openInstallWindow();
}

async function installNow() {
  const event = installPromptEvent;
  closeModal("installAsk");
  setPageInert(false);
  if (!event) {
    openInstallWindow(); // the browser withdrew the offer: show the menu guide instead
    return;
  }
  installPromptEvent = null;
  event.prompt();
  try {
    const choice = await event.userChoice;
    if (choice.outcome === "accepted") writeInstallStore({ installed: Date.now() });
  } catch {
    /* the window was closed */
  }
}

function installLater() {
  closeModal("installAsk");
  setPageInert(false);
}

/** Profil: a permanent place to install (or the confirmation that the app runs from the shortcut). */
function installSectionHtml() {
  return isStandaloneApp()
    ? `<p class="muted small">✔ WORD4ALL działa jako aplikacja – otwierasz ją ikonką z ekranu.</p>`
    : `<button class="btn" data-action="installOpen">📲 Zainstaluj na telefonie</button>
       <p class="muted small">Ikonka na ekranie, pełny ekran i działanie bez internetu.</p>`;
}
