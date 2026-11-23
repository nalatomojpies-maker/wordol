"use strict";

/**
 * "Buy me a coffee" invitation, footer and legal information. Addressed to parents and guardians, never to children.
 *
 * - A window after 6, 16, 40, 60 and 90 finished exercises (in menus only, never during an exercise).
 *   After 6 and 16: "Pokaż numer" + "Dalej"; later "Pokaż numer" / "Już postawiłem" / "Może później…".
 *   "Już postawiłem" hides it for good.
 * The answer and the launch count are kept under their own key, so "Wyczyść profil" does not remove them.
 * The phone number is stored encoded and is drawn on a canvas only after a click, so simple scrapers cannot read it.
 */
const SUPPORT_KEY = "wordol.support.v1";
const SUPPORT_TICK_MS = 15000;
const SUPPORT_IDLE_LIMIT_MS = 60000;
const SUPPORT_CHECK_DELAY_MS = 1200;
/** The banner shows after this many finished exercises (counted on this device, also across "Wyczyść profil"). */
const SUPPORT_BANNER_AT = [6, 16, 40, 60, 90];
/** The first two times only "Pokaż numer" and "Dalej"; from 40 on also "Już postawiłem" / "Może później…". */
const SUPPORT_WINDOW_SIMPLE = [6, 16];
const SUPPORT_QUIET_VIEWS = ["session", "result", "step", "welcome"];
const AUTHOR_LINE = "Bartek";
/** The author's invitation – in the welcome notice and in the banner that shows up now and then under the title bar. */
const SHARE_TEXT = "Używaj, rozpowszechniaj, dziel się z innymi, a jeśli spodoba Ci się moja praca i chcesz zobaczyć więcej moich projektów, Twój rodzic lub opiekun może postawić mi kawę";
const COPYRIGHT_YEAR = 2026;

// ====================================================================
// Persistent answer (survives "Wyczyść profil")
// ====================================================================
let supportStoreMemory = null;

function readSupportStore() {
  if (supportStoreMemory) return supportStoreMemory;
  try {
    const stored = JSON.parse(localStorage.getItem(SUPPORT_KEY) || "null");
    supportStoreMemory = stored && typeof stored === "object" ? stored : {};
  } catch {
    supportStoreMemory = {};
  }
  return supportStoreMemory;
}

function writeSupportStore(changes) {
  supportStoreMemory = { ...readSupportStore(), ...changes };
  try {
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(supportStoreMemory));
  } catch {
    /* storage blocked – remembered until the page is closed */
  }
}

/** Only "donated" stops the invitation for good (older saves may still hold "declined", which no longer counts). */
const hasDonated = () => readSupportStore().status === "donated";
const writeSupportStatus = (status) => writeSupportStore({ status, at: Date.now() });

// ====================================================================
// Obfuscated phone number
// ====================================================================
const BLIK_KEY = "WORDOL-Rychu";
const BLIK_CODED = [124, 123, 106, 115, 118, 121, 28, 103, 75, 87, 92, 69];
const decodeBlik = () => BLIK_CODED.map((value, index) => String.fromCharCode(value ^ BLIK_KEY.charCodeAt(index % BLIK_KEY.length))).join("");

/** Draws the number as an image with slightly jittered characters and noise lines (no text in the page). */
function drawBlik(canvas) {
  const digits = decodeBlik();
  const shown = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  const ratio = window.devicePixelRatio || 1;
  const width = 300;
  const height = 64;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.fillStyle = "#f8f9ff";
  context.fillRect(0, 0, width, height);
  context.font = "800 30px Segoe UI, Arial, sans-serif";
  context.textBaseline = "middle";
  let x = 14;
  for (const char of shown) {
    context.save();
    context.translate(x, height / 2 + (Math.random() * 6 - 3));
    context.rotate(Math.random() * 0.14 - 0.07);
    context.fillStyle = ["#2b3a8f", "#1c5fa8", "#3b2f8f"][Math.floor(Math.random() * 3)];
    context.fillText(char, 0, 0);
    context.restore();
    x += context.measureText(char).width + 1.5;
  }
  context.lineWidth = 1.2;
  for (let line = 0; line < 5; line++) {
    context.strokeStyle = `rgba(${60 + line * 30}, 90, 170, .35)`;
    context.beginPath();
    context.moveTo(Math.random() * width, Math.random() * height);
    context.lineTo(Math.random() * width, Math.random() * height);
    context.stroke();
  }
}

async function copyBlik() {
  const number = decodeBlik();
  try {
    await navigator.clipboard.writeText(number);
  } catch {
    const area = document.createElement("textarea");
    area.value = number;
    area.style.cssText = "position:fixed;opacity:0;left:-1000px";
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    area.remove();
    if (!copied) {
      toast("Nie udało się skopiować numeru.");
      return;
    }
  }
  toast("Numer skopiowany – dziękuję! ☕");
}

function showBlik() {
  const box = $("#blikBox");
  if (!box) return;
  box.innerHTML = `
    <canvas id="blikCanvas" class="blik-canvas" role="img" aria-label="Numer telefonu do przelewu BLIK na telefon"></canvas>
    <button class="btn" data-action="copyBlik">📋 Kopiuj numer</button>
    <p class="muted small">BLIK na telefon: w aplikacji banku wybierz „przelew na telefon” i wpisz ten numer.</p>`;
  drawBlik($("#blikCanvas"));
}

// ====================================================================
// Modals
// ====================================================================
const closeModal = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.remove();
};

/** Opened by the user (footer, profile, banner "Postaw kawę"). */
function openSupportModal() {
  if ($("#supportModal")) return;
  const title = "Aplikacja jest w pełni darmowa ☕";
  const text = "WORD4ALL jest i zawsze będzie w całości <b>darmowy</b>. Jeśli Ci się podoba, Twój <b>rodzic lub opiekun</b> może postawić autorowi kawę BLIKIEM na numer telefonu. To zupełnie dobrowolne.";
  const actions = `<button class="btn primary" data-action="supportDonated">✔ Już postawiłem</button>
       <button class="btn" data-action="supportLater">Zamknij</button>`;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="supportModal" role="dialog" aria-modal="true" aria-labelledby="supportTitle">
      <div class="modal">
        <div class="modal-rychu">${rychuSvg("cheer", 76)}</div>
        <h2 id="supportTitle">${title}</h2>
        <p>${text}</p>
        <div id="blikBox" class="blik-box"><button class="btn" data-action="showBlik">📱 Pokaż numer BLIK</button></div>
        <div class="modal-actions">${actions}</div>
        <p class="small muted center-text">– ${AUTHOR_LINE}</p>
      </div>
    </div>`);
  const first = $("#supportModal .btn.primary");
  if (first) first.focus();
}

const repoIssuesUrl = () => {
  const host = location.hostname;
  const repository = location.pathname.split("/")[1];
  if (!host.endsWith(".github.io") || !repository) return null;
  return `https://github.com/${host.split(".")[0]}/${repository}/issues`;
};

function openLegalModal() {
  if ($("#legalModal")) return;
  const issues = repoIssuesUrl();
  const contact = issues
    ? `przez zakładkę <a href="${issues}" target="_blank" rel="noopener noreferrer">Issues w repozytorium aplikacji na GitHubie</a>`
    : "przez zakładkę Issues w repozytorium aplikacji na GitHubie";
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="legalModal" role="dialog" aria-modal="true" aria-labelledby="legalTitle">
      <div class="modal legal">
        <h2 id="legalTitle">Regulamin, licencja i prywatność</h2>
        <h3>Autor i licencja</h3>
        <p>WORD4ALL. © ${COPYRIGHT_YEAR} ${AUTHOR_LINE}. <b>Wszelkie prawa zastrzeżone.</b> Aplikacja (kod, teksty, ilustracje, maskotka Rychu, dźwięki) jest <b>darmowa do użytku niekomercyjnego</b> – domowego i edukacyjnego. Bez zgody autora nie wolno jej sprzedawać, wykorzystywać komercyjnie ani rozpowszechniać zmienionych kopii.</p>
        <h3>Ciasteczka i dane na urządzeniu</h3>
        <p>Aplikacja <b>nie używa ciasteczek (cookies)</b>, analityki, reklam, śledzenia ani profilowania. Imię, klasa, postępy i ustawienia są zapisywane wyłącznie w pamięci przeglądarki (localStorage) na Twoim urządzeniu. Są potrzebne do działania aplikacji i nie są nigdzie wysyłane. Usuniesz je w Profil → „Wyczyść profil” albo czyszcząc dane strony w przeglądarce. Wybór dotyczący prośby o wsparcie jest zapisany osobno i znika tylko po wyczyszczeniu danych strony.</p>
        <h3>Dane osobowe</h3>
        <p>Aplikacja nie ma kont, rejestracji ani formularzy kontaktowych. Autor nie zbiera ani nie przetwarza danych osobowych użytkowników, w tym dzieci.</p>
        <h3>Usługi zewnętrzne</h3>
        <ul>
          <li><b>Hosting:</b> aplikacja jest udostępniana przez GitHub Pages (GitHub, Inc.), który może zapisywać techniczne logi, np. adres IP (zob. polityka prywatności GitHub).</li>
          <li><b>Tłumaczenie własnych słów:</b> wpisane słowa są wysyłane do usługi MyMemory (translated.net).</li>
          <li><b>Dźwięki odpowiedzi:</b> melodyjki z zestawu „Music Jingles” autorstwa Kenney (kenney.nl), licencja CC0 (domena publiczna).</li>
          <li><b>Czytanie słów:</b> korzysta z syntezatora mowy przeglądarki lub urządzenia. Niektóre głosy (np. w Chrome) mogą działać przez internet.</li>
        </ul>
        <h3>Wsparcie autora</h3>
        <p>Wsparcie (kawa BLIKIEM) jest <b>całkowicie dobrowolne</b>, nie odblokowuje żadnych funkcji i nie jest warunkiem korzystania z aplikacji.</p>
        <h3>Zasady korzystania</h3>
        <ul>
          <li>Usługa: bezpłatna aplikacja przeglądarkowa do nauki angielskiego (klasy 0–8).</li>
          <li>Wymagania: nowoczesna przeglądarka z włączoną obsługą JavaScript i localStorage.</li>
          <li>Aplikacja jest udostępniana „tak jak jest”, bez gwarancji. Treści edukacyjne mogą zawierać błędy i nie zastępują nauczyciela. Autor może zmienić lub zakończyć działanie aplikacji.</li>
          <li>Korzystanie z aplikacji możesz zakończyć w każdej chwili, usuwając dane strony.</li>
        </ul>
        <h3>Kontakt, reklamacje i prywatność</h3>
        <p>Błędy, reklamacje i pytania dotyczące prywatności zgłaszaj ${contact}.</p>
        <div class="modal-actions"><button class="btn primary" data-action="closeLegal">Zamknij</button></div>
      </div>
    </div>`);
  const close = $("#legalModal .btn.primary");
  if (close) close.focus();
}

/** Very small, always visible licence line (appended below every screen except exercises). */
const footerHtml = () => `
  <div class="coffee-bar"><button class="coffee-link" data-action="openSupport">☕ Postaw kawę · BLIK · program jest w pełni darmowy</button></div>
  <footer class="site-footer">
    © ${COPYRIGHT_YEAR} ${AUTHOR_LINE} · Darmowe do użytku niekomercyjnego · Wszelkie prawa zastrzeżone ·
    <button class="link" data-action="openLegal">Regulamin, licencja i prywatność</button> · Bez ciasteczek
  </footer>`;

// ====================================================================
// When to ask
// ====================================================================
/** Called once when the app starts: counts launches (used by the install suggestion). */
function countLaunch() {
  const launches = (Number(readSupportStore().launches) || 0) + 1;
  writeSupportStore({ launches });
}

/** Called after every finished exercise. Older saves start from the exercises already done. */
function countExerciseForSupport() {
  const store = readSupportStore();
  const done = Number.isFinite(store.exercises) ? store.exercises : Math.max(0, state.games.exercises - 1);
  writeSupportStore({ exercises: done + 1 });
}

/** The highest threshold reached and not answered yet (or null). */
function dueBannerThreshold() {
  const store = readSupportStore();
  const exercises = Number.isFinite(store.exercises) ? store.exercises : state.games.exercises;
  const answered = Array.isArray(store.bannerDone) ? store.bannerDone : [];
  const due = SUPPORT_BANNER_AT.filter((threshold) => exercises >= threshold && !answered.includes(threshold));
  return due.length ? due[due.length - 1] : null;
}

/** "Dalej" / "Może później…": this threshold (and any lower one) is done. */
function markBannerAnswered() {
  const threshold = dueBannerThreshold();
  if (threshold === null) return;
  const answered = Array.isArray(readSupportStore().bannerDone) ? readSupportStore().bannerDone : [];
  writeSupportStore({ bannerDone: [...new Set([...answered, ...SUPPORT_BANNER_AT.filter((value) => value <= threshold)])] });
}

/** After every screen change: shows the banner in menus (on the chosen launches); hides it elsewhere. */
function checkSupport() {
  const busy = $(".modal-backdrop") || $("#tutorial") || $("#celebrate") || SUPPORT_QUIET_VIEWS.includes(view) || view === "game";
  if (hasDonated() || busy) return;
  const threshold = dueBannerThreshold();
  if (threshold !== null) showSupportWindow(threshold);
}

/** The coffee window: after 6 and 16 exercises "Pokaż numer" + "Dalej"; later also "Już postawiłem" / "Może później…". */
function showSupportWindow(threshold) {
  if ($("#supportAsk")) return;
  const firstTimes = SUPPORT_WINDOW_SIMPLE.includes(threshold);
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="supportAsk" role="dialog" aria-modal="true" aria-labelledby="supportAskTitle">
      <div class="modal">
        <div class="modal-rychu">${rychuSvg("cheer", 76)}</div>
        <h2 id="supportAskTitle">Podoba Ci się aplikacja? Pokaż to rodzicowi/opiekunowi ☕</h2>
        <p>${SHARE_TEXT} ❤️</p>
        <p class="support-note">👨‍👩‍👧 To <b>dobrowolna i niezobowiązująca propozycja</b> skierowana <b>do rodzica lub opiekuna – nie do dziecka</b>. Kawa niczego nie odblokowuje, a aplikacja zawsze pozostaje w pełni darmowa.</p>
        <div id="blikBox" class="blik-box"><button class="btn primary" data-action="showBlik">📱 Pokaż numer</button></div>
        <div class="modal-actions">${firstTimes
          ? `<button class="btn" data-action="supportDeclined">Dalej →</button>`
          : `<button class="btn" data-action="supportDonated">✔ Już postawiłem</button>
             <button class="btn ghost" data-action="supportDeclined">Może później…</button>`}
        </div>
        <p class="small muted center-text">– ${AUTHOR_LINE}</p>
      </div>
    </div>`);
  setPageInert(true);
  // "Pokaż numer" is the default choice: Enter presses it
  $("#supportAsk [data-action='showBlik']").focus();
}

/** "Dalej" / "Może później…": closes the window until the next number of exercises is reached. */
function declineSupport() {
  markBannerAnswered();
  closeModal("supportModal");
  closeModal("supportAsk");
  setPageInert(false);
}

/** "Już postawiłem": never ask again. */
function confirmDonated() {
  writeSupportStatus("donated");
  closeModal("supportModal");
  closeModal("supportAsk");
  setPageInert(false);
  toast("Dziękuję! ☕ Ta prośba już się nie pojawi.");
}

/** Counts real use time (the page is visible and touched within the last minute). */
let lastActivityAt = Date.now();

function startSupportTimer() {
  countLaunch();
  ["pointerdown", "keydown", "scroll"].forEach((type) =>
    document.addEventListener(type, () => { lastActivityAt = Date.now(); }, { passive: true }));
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeModal("supportModal");
    closeModal("legalModal");
  });
  setInterval(() => {
    if (document.hidden || Date.now() - lastActivityAt > SUPPORT_IDLE_LIMIT_MS) return;
    state.support.seconds += SUPPORT_TICK_MS / 1000;
    saveState();
  }, SUPPORT_TICK_MS);
}

const scheduleSupportCheck = () => setTimeout(checkSupport, SUPPORT_CHECK_DELAY_MS);

// ====================================================================
// Welcome notice ("Zanim zaczniesz") – shown until confirmed, again after "Wyczyść profil"
// ====================================================================
/** Raise this number when the text below changes in a way users should read again. */
const TERMS_VERSION = 1;

const termsAccepted = () => Number(state.settings.termsAccepted) >= TERMS_VERSION;

function setPageInert(isInert) {
  [$(".topbar"), $("#app")].forEach((element) => {
    if (element) element.inert = isInert;
  });
}

function openIntroModal() {
  if ($("#introModal")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal-backdrop" id="introModal" role="dialog" aria-modal="true" aria-labelledby="introTitle">
      <div class="modal legal intro">
        <div class="modal-rychu">${rychuSvg("cheer", 76)}</div>
        <h2 id="introTitle">Zanim zaczniesz 👋</h2>
        <ul class="intro-list">
          <li>💚 <b>Całkowicie darmowy.</b> WORD4ALL jest w pełni darmowy i powstał na własne potrzeby, żeby ułatwić naukę angielskiego. Nie ma reklam, kont ani ukrytych opłat.</li>
          <li>📜 <b>Licencja.</b> © ${COPYRIGHT_YEAR} ${AUTHOR_LINE}. Darmowy do użytku niekomercyjnego (domowego i edukacyjnego), wszelkie prawa zastrzeżone. Bez zgody autora nie wolno go sprzedawać, wykorzystywać komercyjnie ani rozpowszechniać zmienionych kopii.</li>
          <li>🔧 <b>Z czego korzysta:</b>
            <ul>
              <li><b>Głos (lektor)</b> – wbudowany syntezator mowy Twojej przeglądarki lub urządzenia. Aplikacja nie ma własnych nagrań, a jakość zależy od zainstalowanych głosów (niektóre, np. w Chrome, działają przez internet).</li>
              <li><b>Muzyka i dźwięki</b> – generowane w przeglądarce.</li>
              <li><b>Tłumaczenie własnych słów</b> – usługa MyMemory (translated.net), do której trafiają wpisane słowa.</li>
             <li><b>Hosting</b> – GitHub Pages.</li>
              <li><b>Bez ciasteczek, reklam i śledzenia.</b> Imię, klasa i postępy zostają tylko na Twoim urządzeniu.</li>
            </ul>
          </li>
          <li>🔇 <b>Nie masz dźwięku?</b> Włącz <i>tryb cichy</i> – przyciskiem 🔊 u góry albo w Profilu. Aplikacja wyciszy wszystko i ukryje ćwiczenia wymagające słuchania.</li>
          <li>☕ ${SHARE_TEXT} ❤️
            <div id="blikBox" class="blik-box"><button class="btn" data-action="showBlik">📱 Pokaż numer BLIK</button></div>
          </li>
          <li>👨‍👩‍👧 <b>Dla rodziców i opiekunów.</b> Szczegółowy <b>przewodnik dla rodziców</b> znajdziesz w <i>Profil → Zacznij od nowa</i>. W trakcie korzystania z aplikacji <b>kilka razy</b> może pojawić się <b>niezobowiązująca propozycja dobrowolnego postawienia kawy</b> autorowi. Jest skierowana <b>do rodziców i opiekunów, nie do dzieci</b>, niczego nie odblokowuje i można ją po prostu zamknąć.</li>
        </ul>
        <p class="small muted center-text"><button class="link" data-action="openLegal">Pełny regulamin, licencja i prywatność</button></p>
        <div class="modal-actions"><button class="btn primary big" data-action="acceptTerms">✔ Rozumiem, zaczynamy</button></div>
      </div>
    </div>`);
  setPageInert(true);
  const accept = $("#introModal .btn.primary");
  if (accept) accept.focus();
}

function acceptTerms() {
  state.settings.termsAccepted = TERMS_VERSION;
  saveState();
  closeModal("introModal");
  setPageInert(false);
  scheduleSupportCheck();
}

function showIntroIfNeeded() {
  if (!termsAccepted()) openIntroModal();
}
