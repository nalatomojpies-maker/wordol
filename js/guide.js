"use strict";

/**
 * "Przewodnik dla rodziców i opiekunów" (Profil): everything explained in detail, with screenshots and FAQ.
 * The children's tutorial stays short; this page is for adults.
 * Screenshots live in assets/guide/ and are loaded only when the page is opened.
 */
/* Small building blocks, so that the text is split into short, airy pieces. */
const gTip = (text) => `<p class="guide-tip">💡 ${text}</p>`;
const gBoxes = (items) => `<div class="guide-boxes">${items.map(([icon, title, body]) =>
  `<div class="guide-box"><h4><span aria-hidden="true">${icon}</span> ${title}</h4>${body}</div>`).join("")}</div>`;
const gOptions = (items) => `<ul class="guide-options">${items.map(([name, text]) => `<li><b>${name}</b><span>${text}</span></li>`).join("")}</ul>`;
const gFacts = (items) => `<table class="guide-facts"><tbody>${items.map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join("")}</tbody></table>`;
const gChips = (items) => `<div class="guide-chips">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;
const gList = (items) => `<ul class="guide-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

const GUIDE_SECTIONS = [
  {
    id: "start", icon: "👋", title: "Czym jest WORD4ALL",
    html: `<p class="guide-lead">Darmowa aplikacja do nauki angielskich słówek i gramatyki dla dzieci <b>od zerówki do 8. klasy</b>. Prowadzi je trener – sowa <b>Rychu</b>.</p>
      ${gBoxes([
        ["🔒", "Bez kont i reklam", "<p>Imię, klasa i postępy są zapisane tylko na tym urządzeniu. Nic nie jest wysyłane.</p>"],
        ["📶", "Działa bez internetu", "<p>Po pierwszym otwarciu – także po instalacji na telefonie lub komputerze.</p>"],
        ["🎒", "Dopasowana do klasy", "<p>Słówka, ćwiczenia, ich długość i lekcje zależą od klasy. Zmienisz ją w Profilu.</p>"],
        ["🦉", "Mówi do dziecka po imieniu", "<p>W formie żeńskiej lub męskiej – rozpoznaje to po imieniu; w Profilu można to zmienić.</p>"],
      ])}`,
  },
  {
    id: "training", icon: "🏋️", title: "Trening – codzienna nauka", shot: "home",
    html: `${gBoxes([
        ["🎯", "Zadanie dnia", `<p>3 krótkie ćwiczenia po 5 pytań – codziennie inne. Za wykonanie dziecko dostaje klejnoty 💎:</p>
          ${gFacts([["wynik od 85%", "3 💎 za ćwiczenie"], ["wynik od 50%", "2 💎"], ["poniżej 50%", "1 💎"], ["całe zadanie", "+3 💎"], ["seria dni z rzędu", "do +3 💎"], ["razem", "<b>do 15 💎 dziennie</b>"]])}`],
        ["🧰", "Dodatkowy trening", "<p>Ćwiczenia poza zadaniem dnia napełniają <b>Skrzynię skarbów</b>: co 3 ćwiczenia skrzynia z 2 💎, najwyżej 2 skrzynie dziennie.</p>"],
        ["🥅", "Cel dnia", "<p>Liczba odpowiedzi, którą warto zrobić dziennie – zależy od klasy (np. 15 w klasie 3).</p>"],
      ])}
      <h3>12 rodzajów ćwiczeń</h3>
      ${gChips(["👂 Wskaż obrazek", "🧠 Memory", "🎴 Fiszki", "🖼️ Obrazki", "🔗 Łączenie par", "🔤 Układanka z liter", "✅ Test wyboru", "⌨️ Wpisywanie", "🧩 Układanie zdań", "🎧 Dyktando", "🔡 Brakujące litery", "⏪ Czasowniki nieregularne"])}
      <p>Młodsze klasy widzą tylko ćwiczenia dla siebie – np. w zerówce nie ma pisania.</p>
      ${gTip("Po dobrej odpowiedzi gra wesoła melodyjka, po złej – smutna. Na końcu ćwiczenia jest ocena od 1 do 6 i lista słów do powtórki.")}`,
  },
  {
    id: "settings", icon: "⚙️", title: "Ustawienia treningu", shot: "options",
    html: `<p class="guide-lead">Na ekranie Treningu, pod listą ćwiczeń, jest rozwijana karta <b>„⚙️ Ustawienia treningu”</b>. Dotyczy ćwiczeń ze słówkami.</p>
      <h3>🌱🔥🚀 Poziom trudności</h3>
      ${gBoxes([
        ["🌱", "Łatwy", gList(["3 odpowiedzi do wyboru", "obrazki i pierwsza litera podpowiedziana", "3 pary w Memory"])],
        ["🔥", "Średni", gList(["4 podobne odpowiedzi", "przy wpisywaniu widać liczbę liter", "5 par w Memory"])],
        ["🚀", "Trudny", gList(["6 bardzo podobnych odpowiedzi", "bez podpowiedzi, litery-pułapki", "8 par, dłuższe ćwiczenia"])],
      ])}
      <h3>📏 Zakres słów</h3>
      ${gOptions([["Tylko klasa X", "słówka wyłącznie z klasy dziecka"], ["Od początku do: klasa X", "także z niższych klas – powtórka (domyślnie)"]])}
      <h3>🔎 Które słowa</h3>
      ${gOptions([["Wszystkie", "całe słownictwo z zakresu"], ["Nowe", "jeszcze nie ćwiczone"], ["Uczę się", "ćwiczone, ale jeszcze nie opanowane"], ["Trudne", "ponad 25% błędnych odpowiedzi"], ["Opanowane", "co najmniej 3 dobre odpowiedzi i 80% skuteczności"]])}
      ${gTip("„Trudne” i „Nowe” świetnie sprawdzają się przed kartkówką.")}
      <h3>🔁 Tłumaczę <small class="muted">(od klasy 4)</small></h3>
      ${gOptions([["Z angielskiego na polski", "łatwiej – ćwiczy rozumienie (dog → pies)"], ["Z polskiego na angielski", "trudniej – ćwiczy przypominanie i pisownię (pies → dog)"], ["Na zmianę", "oba kierunki losowo (domyślnie)"]])}
      <p class="muted">W klasach 0–3 zawsze z angielskiego na polski.</p>
      <h3>🗂️ Zbiory tematyczne</h3>
      <p>Kafelki tematów (kolory, zwierzęta, jedzenie…). Wybierz jeden lub kilka – ćwiczenia będą tylko z nich.</p>
      ${gOptions([["🌈 Wszystkie", "całe słownictwo"], ["⭐ Dodane słowa", "słowa dodane przez Was w Profilu"]])}
      ${gTip("Na dole karty widać, ile słówek jest wybranych i ile pytań ma jedno ćwiczenie.")}`,
  },
  {
    id: "material", icon: "📖", title: "Podejrzyj materiał, druk i PDF", shot: "material",
    html: `<p class="guide-lead">Przycisk <b>„📖 Podejrzyj materiał”</b> (pod „Zakres słów”) pokazuje cały materiał z wybranego zakresu i zbiorów.</p>
      ${gOptions([
        ["🔤 Słówka i zwroty", "według tematów, z wymową 🔊 i znaczkiem postępu; wyszukiwarka po polsku i po angielsku"],
        ["🎯 Ćwicz ten zbiór", "przy każdym temacie – wybiera tylko ten temat i wraca do Treningu"],
        ["🎓 Lekcje", "tematy gramatyki z postępem i przyciskiem „Otwórz”"],
        ["🎴 Ucz się fiszkami", "od razu fiszki z tego materiału"],
        ["🖨️ Drukuj / PDF", "czarno-biała lista słówek i spis lekcji"],
      ])}
      ${gTip("Żeby dostać PDF, w oknie drukowania wybierz „Zapisz jako PDF”. Jeśli coś wpisano w wyszukiwarce, drukują się tylko znalezione słowa.")}`,
  },
  {
    id: "learn", icon: "🎓", title: "Nauka – lekcje gramatyki", shot: "learn",
    html: `<p class="guide-lead">Zakładka <b>Nauka</b> to ścieżka lekcji dla każdej klasy – np. „to be”, Present Simple, czasy przeszłe.</p>
      ${gFacts([["Temat", "kilka kroków"], ["Krok", "karta z wyjaśnieniem Rycha i przykładami, potem ćwiczenie"], ["Zaliczenie", "co najmniej <b>70%</b> dobrych odpowiedzi"], ["Kolejny krok", "otwiera się po zaliczeniu poprzedniego"]])}
      ${gTip("Można wybrać niższą klasę, żeby powtórzyć wcześniejsze tematy.")}`,
  },
  {
    id: "rewards", icon: "🎁", title: "Nagrody, sklepik i tempo", shot: "shop",
    html: `<p class="guide-lead">Za klejnoty 💎 dziecko kupuje w <b>sklepiku</b> niespodzianki. Co jest w środku, widać dopiero po zakupie.</p>
      ${gFacts([["😄 Dowcip", "3 💎"], ["🧩 Zagadka", "3 💎"], ["🎮 Gierka", "12 💎"]])}
      ${gBoxes([
        ["🔒", "Nagrody odblokowują się po kolei", "<p>Pierwsze <b>Zadanie dnia</b> otwiera pierwszy dowcip, pierwszą zagadkę i pierwszą gierkę. Potem co <b>2 ukończone ćwiczenia</b> otwiera się jedna kolejna nagroda – zawsze w kolejności dowcip → zagadka → gierka. Dziennie liczy się do tego najwyżej 9 ćwiczeń, więc nagród starcza na długo.</p>"],
        ["🔋", "Gierki się ładują", "<p>Krótkie, spokojne, bez przemocy. Po zagraniu znów dostępne po 3 ukończonych ćwiczeniach.</p>"],
        ["🏅", "140 odznak", "<p>Za treningi, serie dni, opanowane słowa, bezbłędne ćwiczenia, święta i więcej. Nową odznakę dziecko odbiera kliknięciem.</p>"],
      ])}
      <p>Wszystko, co zdobyte, jest w zakładce <b>Nagrody</b>.</p>`,
  },
  {
    id: "stats", icon: "📊", title: "Wyniki – co pokazują", shot: "stats",
    html: `<p class="guide-lead">Zakładka <b>Wyniki</b> to podsumowanie dla dziecka i dla Was.</p>
      ${gOptions([
        ["Kafelki", "ćwiczenia, dobre odpowiedzi, skuteczność, średnia ocen, seria dni, opanowane słowa, czas nauki, XP"],
        ["Wykresy (7 / 30 / 90 dni)", "aktywność dzień po dniu i skuteczność; porównanie z poprzednim tygodniem"],
        ["Kalendarz nauki", "12 ostatnich tygodni – im ciemniej, tym więcej nauki"],
        ["Słówka", "opanowane, w trakcie, trudne i jeszcze nie ćwiczone"],
        ["Więcej", "rekordy, oceny, tabela ćwiczeń, ścieżka nauki, odznaki, słowa do powtórki"],
      ])}
      ${gTip("Dotknięcie słupka lub punktu na wykresie pokazuje dokładne liczby.")}`,
  },
  {
    id: "profile", icon: "👤", title: "Profil, dźwięk i wygląd", shot: "profile",
    html: `${gOptions([
        ["Imię i klasa", "oraz „Rychu zwraca się do Ciebie jak do” – automatycznie, dziewczynki albo chłopca"],
        ["Wygląd", "kilka motywów, w tym <b>„Dla niedowidzących”</b>: większy tekst, wysoki kontrast, kolory bez zestawienia czerwony–zielony"],
        ["🔇 Tryb cichy", "wyłącza muzykę, efekty i lektora oraz ukrywa ćwiczenia z lektorem (to samo co przycisk 🔊 u góry)"],
        ["Dźwięk", "muzyka, efekty, automatyczne czytanie słów i <b>🔊 Sprawdź lektora</b>"],
        ["Dodaj słowa", "np. ze szkolnej kartkówki – trafiają do zbioru „⭐ Dodane słowa”"],
        ["Zacznij od nowa", "przewodnik dla dziecka, ten przewodnik, przełącznik „Pokazuj wybór przewodnika przy każdym uruchomieniu” i „Wyczyść profil” (usuwa wszystko z urządzenia)"],
      ])}
      ${gTip("Wulgaryzmy w dodawanych słowach i w imieniu są blokowane – Rychu prosi wtedy, żeby przestać.")}`,
  },
  {
    id: "privacy", icon: "🔒", title: "Prywatność i bezpieczeństwo",
    html: gList([
      "Bez kont, ciasteczek, reklam, analityki i śledzenia.",
      "Dane (imię, klasa, postępy) są tylko w pamięci przeglądarki na tym urządzeniu.",
      "Przy dodawaniu własnych słów bez tłumaczenia słowa trafiają do słownika online MyMemory (translated.net).",
      "Lektor korzysta z syntezatora mowy urządzenia (niektóre głosy działają przez internet).",
      "Prośba o „kawę” dla autora jest dobrowolna, skierowana do rodzica lub opiekuna i nic nie odblokowuje.",
    ]),
  },
];

const GUIDE_FAQ = [
  ["Czy aplikacja jest naprawdę darmowa?", "Tak, w całości. Nie ma płatnych funkcji ani reklam. Postawienie kawy autorowi jest dobrowolne i niczego nie zmienia w aplikacji."],
  ["Gdzie są zapisane postępy? Co przy zmianie telefonu?", "Tylko na tym urządzeniu, w tej przeglądarce. Postępy nie przenoszą się na inny telefon ani do innej przeglądarki. Wyczyszczenie danych przeglądarki albo „Wyczyść profil” usuwa je na stałe."],
  ["Jak ćwiczyć tylko słówka z kartkówki?", "Profil → Dodaj słowa: wpisz słówka (np. „apple - jabłko”, każde w nowym wierszu) i kliknij „🎯 Ćwicz dodane słowa”. Możesz też w Ustawieniach treningu wybrać tylko jeden zbiór tematyczny."],
  ["Jak wydrukować słówka albo zapisać je jako PDF?", "Trening → Ustawienia treningu → 📖 Podejrzyj materiał → 🖨️ Drukuj / PDF. W oknie drukowania wybierz drukarkę albo „Zapisz jako PDF”."],
  ["Dziecko nie słyszy lektora. Co zrobić?", "Sprawdź głośność urządzenia i to, czy nie jest włączony tryb cichy (🔇 u góry). W Profilu użyj „🔊 Sprawdź lektora”. Jeśli na urządzeniu nie ma angielskiego głosu, doinstaluj go w ustawieniach systemu (mowa / zamiana tekstu na mowę) albo włącz tryb cichy – ćwiczenia z lektorem zostaną ukryte."],
  ["Dlaczego w sklepiku są kłódki?", "Nagrody otwierają się po kolei: pierwsze trzy (dowcip, zagadka, gierka) po pierwszym Zadaniu dnia, potem jedna co 2 ukończone ćwiczenia, a dziennie liczy się do tego najwyżej 9 ćwiczeń. Na kłódce widać, kiedy się otworzy."],
  ["Dlaczego gierka się nie uruchamia?", "Po zagraniu gierka się „ładuje” – można zagrać znowu po 3 ukończonych ćwiczeniach. Postęp widać w Nagrody → Moje gierki."],
  ["Co się stanie po zmianie klasy?", "Zmienia się zakres słówek, dostępne ćwiczenia i lekcje. Zdobyte postępy, nagrody i odznaki zostają."],
  ["Dziecko robi za dużo albo za mało?", "Cel dnia i Zadanie dnia są dopasowane do klasy. Tempo nagród jest celowo spokojne. W Wynikach widać czas nauki, kalendarz i wykres aktywności."],
  ["Aplikacja pokazuje starą wersję.", "Z internetem aplikacja pobiera najnowsze pliki. Odśwież stronę albo zamknij i otwórz aplikację jeszcze raz."],
  ["Czy aplikacja zbiera dane dziecka?", "Nie. Nie ma kont ani śledzenia, a dane zostają na urządzeniu. Szczegóły: stopka → „Regulamin, licencja i prywatność”."],
  ["Jak zainstalować aplikację?", "Profil → „Aplikacja na telefonie i komputerze” → Zainstaluj. Na iPhonie: Udostępnij → Do ekranu początkowego. Na komputerze: Chrome lub Edge → ikonka instalacji w pasku adresu."],
];

function renderGuide() {
  const shot = (name, alt) => `<figure class="guide-shot"><img src="assets/guide/${name}.jpg" alt="${esc(alt)}" loading="lazy" width="390" height="600"><figcaption>${esc(alt)}</figcaption></figure>`;
  app.innerHTML = `
    <button class="btn ghost" data-action="nav" data-view="settings">← Profil</button>
    <section class="card hero" style="margin-top:12px">${rychuBubble("happy", "Przewodnik dla rodziców i opiekunów – wszystko, co warto wiedzieć o WORD4ALL.", 84)}</section>
    <nav class="card guide-toc" aria-label="Spis treści"><h2>Spis treści</h2>
      <ol>${GUIDE_SECTIONS.map((section) => `<li><a href="#guide-${section.id}" data-guide-link="${section.id}">${section.icon} ${esc(section.title)}</a></li>`).join("")}
        <li><a href="#guide-faq" data-guide-link="faq">❓ Najczęstsze pytania</a></li></ol>
    </nav>
    ${GUIDE_SECTIONS.map((section) => `
      <section class="card guide-section" id="guide-${section.id}">
        <h2>${section.icon} ${esc(section.title)}</h2>
        ${section.html}
        ${section.shot ? shot(section.shot, section.title) : ""}
      </section>`).join("")}
    <section class="card guide-section" id="guide-faq"><h2>❓ Najczęstsze pytania</h2>
      ${GUIDE_FAQ.map(([question, answer]) => `<details class="guide-faq"><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join("")}
    </section>
    <button class="btn" data-action="nav" data-view="settings">← Wróć do Profilu</button>`;
}

/** Table of contents: smooth scroll inside the app (the page has no real anchors in single-page mode). */
document.addEventListener("click", (event) => {
  const link = event.target.closest && event.target.closest("[data-guide-link]");
  if (!link) return;
  event.preventDefault();
  const target = document.getElementById(`guide-${link.dataset.guideLink}`);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
});
