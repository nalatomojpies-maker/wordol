"use strict";

/**
 * Tutorial ("Samouczek"): after the welcome screen Rychu shows where everything is.
 * Each step highlights one element of the home screen with a spotlight and explains it in a bubble.
 * Shown once for a new player; can be replayed from Profil.
 */
const TUTORIAL_STEPS = [
  { text: "Cześć{name}! Jestem Rychu. Pokażę Ci w kilku krokach, gdzie co jest. Gotowy?" },
  { target: ".card.daily", text: "🎯 To jest Zadanie dnia: 3 krótkie ćwiczenia. Za każde dostajesz klejnoty 💎, a za całe zadanie – bonus!" },
  { target: ".extra-chest", text: "🧰 Chcesz więcej? Dodatkowy trening napełnia Skrzynię skarbów. Co 3 ćwiczenia – nowe klejnoty!" },
  { target: ".mode-group", text: "📚 Tu wybierasz ćwiczenie: fiszki, memory, dyktando, układanki i wiele innych. Każde uczy trochę inaczej." },
  { target: ".options-card", text: "⚙️ W ustawieniach treningu zmienisz poziom trudności i wybierzesz, jakich słówek chcesz się uczyć." },
  { target: ".badge-btn[data-action='openShop']", text: "💎 Tu widzisz swoje klejnoty. Kliknij, a przeniesiesz się do sklepiku." },
  { target: ".nav [data-view='learn']", text: "🎓 Nauka – lekcje gramatyki krok po kroku. Najpierw krótka karta, potem ćwiczenie." },
  { target: ".nav [data-view='rewards']", text: "🎁 Nagrody – sklepik z niespodziankami oraz Twoje dowcipy, zagadki i gierki." },
  { target: ".nav [data-view='stats']", text: "📊 Wyniki – Twoje postępy, odznaki i słówka do powtórki." },
  { target: ".nav [data-view='settings']", text: "👤 Profil – imię, klasa, dźwięk i wygląd. Tu też możesz jeszcze raz obejrzeć ten samouczek." },
  { target: "#musicBtn", text: "🔇 To tryb cichy: wyłącza wszystkie dźwięki – muzykę, melodyjki i lektora – i ukrywa ćwiczenia z lektorem. Muzykę samą wyłączysz w Profilu." },
  { text: "To wszystko! Zacznij od Zadania dnia. Powodzenia{name}! 🦉" },
];

let tutorialIndex = 0;

const isVisible = (element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== "hidden";
};

/** Steps whose element is on screen right now (e.g. the full-screen button is hidden in the installed app). */
const tutorialSteps = () => TUTORIAL_STEPS.filter((step) => !step.target || isVisible($(step.target)));

function startTutorial() {
  closeTutorial(false);
  if (view !== "home") goTo("home");
  tutorialIndex = 0;
  document.body.insertAdjacentHTML("beforeend", `
    <div id="tutorial" class="tutorial" role="dialog" aria-modal="true" aria-live="polite" aria-label="Samouczek">
      <div class="tutorial-hole"></div>
      <div class="tutorial-bubble">
        <div class="tutorial-rychu">${rychuSvg("cheer", 56)}</div>
        <p class="tutorial-text"></p>
        <div class="tutorial-actions">
          <button class="link" data-action="tutorialSkip">Pomiń</button>
          <span class="tutorial-count muted small"></span>
          <button class="btn primary" data-action="tutorialNext">Dalej →</button>
        </div>
      </div>
    </div>`);
  setPageInert(true);
  showTutorialStep();
}

function showTutorialStep() {
  const box = $("#tutorial");
  if (!box) return;
  const steps = tutorialSteps();
  const step = steps[tutorialIndex];
  if (!step) return closeTutorial(true);
  const name = state.settings.name ? `, ${state.settings.name}` : "";
  box.querySelector(".tutorial-text").textContent = step.text.replace("{name}", name);
  box.querySelector(".tutorial-count").textContent = `${tutorialIndex + 1}/${steps.length}`;
  const next = box.querySelector("[data-action='tutorialNext']");
  next.textContent = tutorialIndex === steps.length - 1 ? "Zaczynamy! 🚀" : "Dalej →";
  const target = step.target ? $(step.target) : null;
  box.classList.toggle("no-target", !target);
  if (target) target.scrollIntoView({ block: "center", behavior: "instant" });
  placeTutorial();
  next.focus();
}

/** Puts the spotlight on the target and the bubble above or below it, whichever has more room. */
function placeTutorial() {
  const box = $("#tutorial");
  if (!box) return;
  const step = tutorialSteps()[tutorialIndex];
  const hole = box.querySelector(".tutorial-hole");
  const bubble = box.querySelector(".tutorial-bubble");
  const target = step && step.target ? $(step.target) : null;
  bubble.style.top = "";
  bubble.style.bottom = "";
  if (!target) {
    hole.style.cssText = "";
    return;
  }
  const pad = 6;
  const gap = 12;
  const topbar = $(".topbar");
  const nav = $(".nav");
  const areaTop = topbar ? topbar.getBoundingClientRect().bottom : 0;
  const navRect = nav ? nav.getBoundingClientRect() : null;
  const navIsBottomBar = navRect && navRect.top > window.innerHeight / 2 && !nav.contains(target);
  const areaBottom = navIsBottomBar ? navRect.top : window.innerHeight;
  const bubbleHeight = bubble.offsetHeight;
  let rect = target.getBoundingClientRect();
  const fitsBelow = () => areaBottom - rect.bottom >= bubbleHeight + gap + pad;
  const fitsAbove = () => rect.top - areaTop >= bubbleHeight + gap + pad;
  // A tall element: move it up under the top bar so the bubble fits below it.
  if (!fitsBelow() && !fitsAbove() && !nav.contains(target) && !(topbar && topbar.contains(target))) {
    window.scrollBy({ top: rect.top - areaTop - pad - 8, behavior: "instant" });
    rect = target.getBoundingClientRect();
  }
  hole.style.cssText = `left:${rect.left - pad}px;top:${rect.top - pad}px;width:${rect.width + pad * 2}px;height:${rect.height + pad * 2}px`;
  if (fitsBelow() || (!fitsAbove() && areaBottom - rect.bottom >= rect.top - areaTop)) {
    bubble.style.top = `${Math.min(rect.bottom + pad + gap, areaBottom - bubbleHeight - gap)}px`;
  } else {
    bubble.style.bottom = `${Math.min(window.innerHeight - rect.top + pad + gap, window.innerHeight - areaTop - bubbleHeight - gap)}px`;
  }
}

function nextTutorialStep() {
  tutorialIndex++;
  if (tutorialIndex >= tutorialSteps().length) closeTutorial(true);
  else showTutorialStep();
}

function closeTutorial(markDone) {
  const box = $("#tutorial");
  if (!box) return;
  box.remove();
  setPageInert(false);
  if (markDone) {
    state.settings.tutorialDone = true;
    saveState();
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  scheduleSupportCheck();
}

window.addEventListener("resize", placeTutorial);
document.addEventListener("keydown", (event) => {
  if (!$("#tutorial")) return;
  if (event.key === "Escape") closeTutorial(true);
});
