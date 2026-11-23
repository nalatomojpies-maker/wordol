"use strict";

/**
 * "Przewodnik dla rodziców i opiekunów" (Profil): everything explained in detail, with screenshots and FAQ.
 * The children's tutorial stays short; this page is for adults.
 * Screenshots live in assets/guide/ and are loaded only when the page is opened.
 */
const GUIDE_SECTIONS = [
  {
    id: "start", icon: "👋", title: "Czym jest WORD4ALL",
    html: `<p>WORD4ALL to darmowa aplikacja do nauki angielskich słówek i gramatyki dla dzieci od zerówki do 8. klasy. Prowadzi je trener – sowa <b>Rychu</b>.</p>
      <ul>
        <li><b>Bez kont i reklam.</b> Imię, klasa i postępy są zapisane tylko na tym urządzeniu (w przeglądarce). Nic nie jest wysyłane.</li>
        <li><b>Działa bez internetu</b> po pierwszym otwarciu, także po instalacji na telefonie lub komputerze (Profil → „Aplikacja na telefonie i komputerze”).</li>
        <li><b>Dopasowuje się do klasy:</b> słówka, rodzaje ćwiczeń, długość ćwiczeń i lekcje gramatyki zależą od klasy wybranej przy starcie (zmienisz ją w Profilu).</li>
        <li>Rychu zwraca się do dziecka w formie żeńskiej lub męskiej – rozpoznaje to po imieniu, a w Profilu można to zmienić.</li>
      </ul>`,
  },
  {
    id: "training", icon: "🏋️", title: "Trening – codzienna nauka", shot: "home",
    html: `<p><b>🎯 Zadanie dnia</b> to 3 krótkie ćwiczenia po 5 pytań, codziennie inne. Za każde ćwiczenie dziecko dostaje klejnoty 💎 (3 za wynik od 85%, 2 od 50%, 1 poniżej), za całe zadanie +3 premii i do +3 za serię dni z rzędu – razem do 15 💎 dziennie. Wykonane dni zapisują się w Kalendarzu.</p>
      <p><b>🧰 Dodatkowy trening</b> – każde ćwiczenie poza zadaniem dnia napełnia Skrzynię skarbów: co 3 ćwiczenia skrzynia z 2 💎 (najwyżej 2 skrzynie dziennie). Dziecko otwiera ją, stukając 3 razy.</p>
      <p><b>Lista ćwiczeń</b> (12 rodzajów): Wskaż obrazek, Memory, Fiszki, Obrazki, Łączenie par, Układanka z liter, Test wyboru, Wpisywanie, Układanie zdań, Dyktando, Brakujące litery i Czasowniki nieregularne. Młodsze klasy widzą tylko te, które są dla nich odpowiednie (np. bez pisania w zerówce).</p>
      <p><b>Cel dnia</b> – liczba odpowiedzi, którą warto zrobić dziennie (zależy od klasy, np. 15 w klasie 3).</p>
      <p>Po dobrej odpowiedzi gra wesoła melodyjka, po złej – smutna; Rychu skacze z radości albo kręci głową. Na końcu jest ocena od 1 do 6 i słowa do powtórki.</p>`,
  },
  {
    id: "settings", icon: "⚙️", title: "Ustawienia treningu – co i jak ćwiczyć", shot: "options",
    html: `<p>Na ekranie Treningu, pod listą ćwiczeń, jest rozwijana karta <b>„⚙️ Ustawienia treningu”</b>. Ustawienia dotyczą ćwiczeń ze słówkami.</p>
      <dl class="guide-dl">
        <dt>🌱🔥🚀 Poziom trudności</dt>
        <dd><b>Łatwy</b> – 3 odpowiedzi do wyboru z różnych tematów, obrazki, podpowiedziana pierwsza litera, mało luk, 3 pary w Memory. <b>Średni</b> – 4 podobne odpowiedzi, przy wpisywaniu widać tylko liczbę liter, 5 par. <b>Trudny</b> – 6 bardzo podobnych odpowiedzi, bez podpowiedzi, litery-pułapki, 8 par i dłuższe ćwiczenia.</dd>
        <dt>📏 Zakres słów</dt>
        <dd><b>„Tylko klasa X”</b> – słówka wyłącznie z klasy dziecka. <b>„Od początku do: klasa X”</b> – także z niższych klas, czyli powtórka starszego materiału (ustawienie domyślne).</dd>
        <dt>📖 Podejrzyj materiał</dt>
        <dd>Okno ze wszystkimi słówkami, zwrotami i lekcjami z wybranego zakresu – opisane niżej.</dd>
        <dt>🔎 Które słowa</dt>
        <dd><b>Wszystkie</b>, <b>Nowe</b> (jeszcze nie ćwiczone), <b>Uczę się</b> (ćwiczone, ale jeszcze nie opanowane), <b>Trudne</b> (ponad 25% błędnych odpowiedzi) albo <b>Opanowane</b> (co najmniej 3 dobre odpowiedzi i 80% skuteczności). Dobre do powtórek przed kartkówką.</dd>
        <dt>🔁 Tłumaczę (od klasy 4)</dt>
        <dd><b>Z angielskiego na polski</b> – łatwiej, ćwiczy rozumienie („dog” → pies). <b>Z polskiego na angielski</b> – trudniej, ćwiczy samodzielne przypominanie i pisownię („pies” → dog). <b>Na zmianę</b> – oba kierunki losowo (domyślnie). W klasach 0–3 zawsze z angielskiego na polski.</dd>
        <dt>🗂️ Zbiory tematyczne</dt>
        <dd>Kafelki tematów (kolory, zwierzęta, jedzenie…). Wybierz jeden lub kilka, a ćwiczenia będą tylko z nich. „🌈 Wszystkie” – całe słownictwo. „⭐ Dodane słowa” – słowa dodane przez Was (niżej).</dd>
      </dl>
      <p>Na dole karty widać, ile słówek jest wybranych i ile pytań ma jedno ćwiczenie.</p>`,
  },
  {
    id: "material", icon: "📖", title: "Podejrzyj materiał, druk i PDF", shot: "material",
    html: `<p>Przycisk <b>„📖 Podejrzyj materiał”</b> (pod „Zakres słów”) otwiera okno z całym materiałem z wybranego zakresu i zbiorów:</p>
      <ul>
        <li><b>🔤 Słówka i zwroty</b> – według tematów, z wymową 🔊 i kółkiem postępu (✔ opanowane, ◐ w trakcie, ! trudne, puste – nowe). Wyszukiwarka działa po angielsku i po polsku.</li>
        <li><b>🎯 Ćwicz ten zbiór</b> – przy każdym temacie; wybiera tylko ten temat i wraca do Treningu.</li>
        <li><b>🎓 Lekcje</b> – tematy gramatyki z klas w zakresie, z postępem i przyciskiem „Otwórz”.</li>
        <li><b>🎴 Ucz się fiszkami</b> – od razu fiszki z tego materiału.</li>
        <li><b>🖨️ Drukuj / PDF</b> – czarno-biała lista słówek w dwóch kolumnach i spis lekcji. W oknie drukowania wybierz drukarkę albo „Zapisz jako PDF”. Jeśli coś wpisano w wyszukiwarce, drukują się tylko znalezione słowa.</li>
      </ul>`,
  },
  {
    id: "learn", icon: "🎓", title: "Nauka – lekcje gramatyki", shot: "learn",
    html: `<p>Zakładka <b>Nauka</b> to ścieżka lekcji dla każdej klasy (np. „to be”, Present Simple, czasy przeszłe). Każdy temat ma kilka <b>kroków</b>: najpierw krótka karta z wyjaśnieniem Rycha i przykładami, potem ćwiczenie.</p>
      <ul>
        <li>Krok jest zaliczony przy co najmniej <b>70% dobrych odpowiedzi</b>.</li>
        <li>Kolejny krok otwiera się po zaliczeniu poprzedniego.</li>
        <li>Można wybrać inną klasę, żeby powtórzyć wcześniejsze tematy.</li>
      </ul>`,
  },
  {
    id: "rewards", icon: "🎁", title: "Nagrody, sklepik i tempo", shot: "shop",
    html: `<p>Za klejnoty 💎 dziecko kupuje w <b>sklepiku</b> niespodzianki: dowcip (3 💎), zagadkę (3 💎) albo gierkę (12 💎). Co jest w środku, widać dopiero po zakupie. Zdobyte rzeczy są w zakładce <b>Nagrody</b>.</p>
      <ul>
        <li><b>Nagrody odblokowują się powoli:</b> co 3 ukończone ćwiczenia otwierają się 2 nowe; dziennie liczy się do tego najwyżej 9 ćwiczeń. Dzięki temu nagród starcza na dłużej.</li>
        <li><b>Gierki</b> (krótkie, zwykle 20 sekund, spokojne i bez przemocy) po każdym zagraniu ładują się – znów można zagrać po 3 ukończonych ćwiczeniach.</li>
        <li><b>Odznaki</b> (140) – za treningi, serie dni, opanowane słowa, bezbłędne ćwiczenia, święta i wiele innych. Nową odznakę dziecko odbiera kliknięciem.</li>
      </ul>`,
  },
  {
    id: "stats", icon: "📊", title: "Wyniki – co pokazują", shot: "stats",
    html: `<p>Zakładka <b>Wyniki</b> to podsumowanie dla dziecka i dla Was:</p>
      <ul>
        <li>kafelki: ukończone ćwiczenia, dobre odpowiedzi, skuteczność, średnia ocen, seria dni, opanowane słowa, <b>czas nauki</b>, XP i poziom;</li>
        <li>wykresy z 7, 30 lub 90 dni: <b>aktywność</b> (odpowiedzi dziennie, porównanie z poprzednim tygodniem) i <b>skuteczność</b>; kalendarz nauki z 12 tygodni;</li>
        <li>słówka: opanowane, w trakcie, trudne i jeszcze nie ćwiczone; rekordy; rozkład ocen; tabela ćwiczeń; ścieżka nauki; odznaki; słowa do powtórki i najlepiej opanowane.</li>
      </ul>
      <p>Dotknięcie słupka lub punktu na wykresie pokazuje dokładne liczby.</p>`,
  },
  {
    id: "profile", icon: "👤", title: "Profil, dźwięk i wygląd", shot: "profile",
    html: `<ul>
        <li><b>Imię i klasa</b>; „Rychu zwraca się do Ciebie jak do” – automatycznie po imieniu, dziewczynki albo chłopca.</li>
        <li><b>Wygląd</b> – kilka motywów kolorów, w tym <b>„Dla niedowidzących”</b>: większy tekst, wysoki kontrast i kolory bez zestawienia czerwony–zielony.</li>
        <li><b>🔇 Tryb cichy</b> (też przycisk 🔊 u góry) – wyłącza muzykę, efekty i lektora oraz <b>ukrywa ćwiczenia z lektorem</b> (np. Dyktando). Przydatny w szkole lub autobusie.</li>
        <li><b>Muzyka, efekty, automatyczne czytanie słów</b> i <b>🔊 Sprawdź lektora</b> – test, czy na urządzeniu działa angielski głos.</li>
        <li><b>Dodawanie własnych słów</b> – np. ze szkolnej kartkówki. Wpisz parę „apple - jabłko” albo samo słowo (tłumaczenie z bazy lub ze słownika online MyMemory). Trafiają do zbioru „⭐ Dodane słowa”.</li>
        <li><b>Zacznij od nowa → Samouczki:</b> samouczek dla dziecka i ten przewodnik. Przy uruchomieniu aplikacja pyta, który pokazać – aż do zaznaczenia „Nie pokazuj więcej” (można to zmienić tutaj: „Pokazuj wybór samouczka przy każdym uruchomieniu”).</li>
        <li><b>Wyczyść profil</b> – usuwa wszystko z tego urządzenia; nie da się tego cofnąć.</li>
      </ul>`,
  },
  {
    id: "privacy", icon: "🔒", title: "Prywatność i bezpieczeństwo",
    html: `<ul>
        <li>Bez kont, ciasteczek, reklam, analityki i śledzenia.</li>
        <li>Dane (imię, klasa, postępy) są tylko w pamięci przeglądarki na tym urządzeniu.</li>
        <li>Jedyne połączenie z zewnętrzną usługą: przy dodawaniu własnych słów bez tłumaczenia wpisane słowa trafiają do słownika MyMemory (translated.net). Lektor korzysta z syntezatora mowy urządzenia (niektóre głosy działają przez internet).</li>
        <li>Prośba o „kawę” dla autora jest dobrowolna, skierowana do rodzica lub opiekuna i nic nie odblokowuje.</li>
      </ul>`,
  },
];

const GUIDE_FAQ = [
  ["Czy aplikacja jest naprawdę darmowa?", "Tak, w całości. Nie ma płatnych funkcji ani reklam. Postawienie kawy autorowi jest dobrowolne i niczego nie zmienia w aplikacji."],
  ["Gdzie są zapisane postępy? Co przy zmianie telefonu?", "Tylko na tym urządzeniu, w tej przeglądarce. Postępy nie przenoszą się na inny telefon ani do innej przeglądarki. Wyczyszczenie danych przeglądarki albo „Wyczyść profil” usuwa je na stałe."],
  ["Jak ćwiczyć tylko słówka z kartkówki?", "Profil → Dodaj słowa: wpisz słówka (np. „apple - jabłko”, każde w nowym wierszu) i kliknij „🎯 Ćwicz dodane słowa”. Możesz też w Ustawieniach treningu wybrać tylko jeden zbiór tematyczny."],
  ["Jak wydrukować słówka albo zapisać je jako PDF?", "Trening → Ustawienia treningu → 📖 Podejrzyj materiał → 🖨️ Drukuj / PDF. W oknie drukowania wybierz drukarkę albo „Zapisz jako PDF”."],
  ["Dziecko nie słyszy lektora. Co zrobić?", "Sprawdź głośność urządzenia i to, czy nie jest włączony tryb cichy (🔇 u góry). W Profilu użyj „🔊 Sprawdź lektora”. Jeśli na urządzeniu nie ma angielskiego głosu, doinstaluj go w ustawieniach systemu (mowa / zamiana tekstu na mowę) albo włącz tryb cichy – ćwiczenia z lektorem zostaną ukryte."],
  ["Dlaczego w sklepiku są kłódki?", "Nagrody odblokowują się stopniowo: co 3 ukończone ćwiczenia 2 nowe, a dziennie liczy się do tego najwyżej 9 ćwiczeń. Na kłódce widać, ile ćwiczeń zostało."],
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
