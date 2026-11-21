"use strict";

/**
 * Our own bank of clever riddles for children (logic, maths and English word riddles), graded by class.
 * Line format: "level|kind|question|answer|short explanation (optional)".
 * kind: logic 🧠, maths 🔢, english 🇬🇧 (a riddle about English words), nature 🌿.
 * level = first class for which the riddle is suitable; a pupil sees riddles of the own class and up to 3 classes below.
 */
const RIDDLE_DATA = `
0|nature|Ma cztery nogi, ale nie chodzi. Stoi w kuchni i jemy przy nim obiad. Co to?|Stół.|
0|nature|Rano jest wysoko na niebie, a wieczorem chowa się za domami. Co to?|Słońce.|
0|nature|Ma długą szyję, łaty na skórze i je liście z drzew. Kto to?|Żyrafa.|
0|logic|Co rośnie, gdy pada deszcz, i znika, gdy świeci słońce?|Kałuża.|
0|nature|Jest biały, zimny i można z niego ulepić bałwana. Co to?|Śnieg.|
1|logic|Ile nóg mają razem dwa koty?|Osiem.|Każdy kot ma cztery łapy: 4 + 4 = 8.
1|english|Jakie angielskie słowo czytane od końca nadal brzmi tak samo: MUM czy DOG?|MUM.|M-U-M od tyłu to wciąż M-U-M.
1|nature|Ma igły, ale nie szyje. Jest zielona przez cały rok. Co to?|Choinka (świerk).|
1|logic|Co ma zęby, ale nigdy nie gryzie?|Grzebień.|
1|english|Liczymy po angielsku: one, two, three… Jaka liczba jest następna?|Four – cztery.|
2|maths|Jaś miał 5 jabłek. Zjadł 2, a potem dostał 3. Ile ma teraz?|6 jabłek.|5 − 2 + 3 = 6.
2|logic|Co jest cięższe: kilogram piór czy kilogram kamieni?|Ważą tyle samo – kilogram to kilogram.|
2|english|Jakie zwierzę ukrywa się w angielskim słowie „sCATter”?|CAT – kot.|
2|logic|Im więcej z niej zabierasz, tym większa się robi. Co to?|Dziura.|
2|nature|Ma osiem nóg i tka sieci. Kto to?|Pająk.|Owady mają sześć nóg, a pająki osiem – pająk nie jest owadem!
2|english|Jaki dzień tygodnia po angielsku zaczyna się od słońca – SUN?|Sunday – niedziela.|
3|logic|Mama Ani ma czworo dzieci: Wiosnę, Lato, Jesień i…?|Anię!|Pytanie mówi, że to mama Ani.
3|maths|Ile to jest pół tuzina?|Sześć.|Tuzin to 12, połowa to 6.
3|english|Co znaczy po polsku „butterfly”, chociaż nie ma nic wspólnego z masłem (butter) ani z muchą (fly)?|Motyl.|
3|logic|Co należy do ciebie, ale inni używają tego częściej niż ty?|Twoje imię.|
3|nature|Które zwierzę śpi zimą w norze i budzi się wiosną?|Niedźwiedź (albo jeż).|Zapada w sen zimowy.
3|english|Które słowo po angielsku jest zawsze napisane źle w słowniku?|„Wrong” – bo słowo „wrong” znaczy „źle”!|
3|maths|Kura na jednej nodze waży 2 kg. Ile waży na dwóch nogach?|Też 2 kg.|
4|logic|Co ma szyję, ale nie ma głowy?|Butelka.|
4|maths|Jaką liczbę dostaniesz, jeśli pomnożysz wszystkie cyfry na klawiaturze telefonu?|Zero.|Wśród cyfr jest 0, a wszystko razy 0 daje 0.
4|english|Jakie angielskie słowo ma trzy podwójne litery pod rząd: zaczyna się na B i jest to osoba, która prowadzi księgi rachunkowe?|Bookkeeper (oo, kk, ee).|
4|logic|Wchodzi po schodach, ale nigdy nie schodzi. Co to?|Twój wiek.|
4|nature|Czy przy biegunie północnym żyją pingwiny?|Nie – pingwiny żyją na południu Ziemi.|Przy biegunie północnym spotkasz za to niedźwiedzia polarnego.
4|english|Zamień pierwszą literę w słowie CAT tak, żeby powstał nietoperz.|BAT.|CAT – kot, BAT – nietoperz.
4|maths|Ile kwadratów jest na planszy do kółka i krzyżyka (3 × 3), jeśli liczysz też te większe?|14.|9 małych + 4 średnie (2 × 2) + 1 duży = 14.
5|logic|Ola jest wyższa od Kasi, a Kasia wyższa od Zosi. Kto jest najniższy?|Zosia.|
5|maths|Kot zjada mysz w minutę. Ile minut potrzebują 3 koty na 3 myszy?|Jedną minutę.|Każdy kot je swoją mysz w tym samym czasie.
5|english|Które angielskie słowo zaczyna się na E, kończy na E, a zawiera tylko jedną literę?|ENVELOPE – koperta (w kopercie jest list – letter!).|Gra słów: letter = litera i list.
5|logic|Masz pudełko zapałek i ciemny pokój ze świecą, lampą naftową i kominkiem. Co zapalisz najpierw?|Zapałkę!|
5|nature|Które zwierzę ma najdłuższy język w stosunku do ciała?|Kameleon – jego język bywa dłuższy niż całe ciało.|
5|english|Co ma klucze (keys), ale nie otwiera drzwi?|Klawiatura albo pianino (keyboard, piano keys).|
5|maths|Pociąg ma 10 wagonów. Każdy wagon ma 4 koła z każdej strony. Ile kół ma razem?|80 kół.|10 × (4 + 4) = 80.
6|logic|Lekarz ma brata, ale brat lekarza nie ma brata. Jak to możliwe?|Lekarz to kobieta – siostra tego brata.|
6|maths|Jeśli 3 kury znoszą 3 jajka w 3 dni, ile jajek zniesie 6 kur w 6 dni?|12 jajek.|Jedna kura znosi 1 jajko w 3 dni, więc w 6 dni – 2 jajka. 6 kur × 2 = 12.
6|english|What has an eye but cannot see?|A needle – igła.|Eye to oko, ale też ucho igielne.
6|logic|Co można złamać, nawet tego nie dotykając?|Obietnicę (albo ciszę).|
6|nature|Dlaczego niebo w dzień jest niebieskie?|Bo powietrze najmocniej rozprasza niebieskie światło słońca.|
6|english|What has a head and a tail but no body?|A coin – moneta.|Head i tail to awers i rewers monety.
6|maths|Ile razy w ciągu doby wskazówki zegara pokrywają się ze sobą?|22 razy.|Nie 24 – raz na mniej więcej 65 minut.
7|logic|Stoisz przed dwojgiem drzwi. Przy jednych strażnik zawsze mówi prawdę, przy drugich zawsze kłamie. Nie wiesz, który jest który. Jakim jednym pytaniem znajdziesz drzwi do wyjścia?|Zapytaj dowolnego: „Które drzwi wskazałby drugi strażnik?” i wybierz te przeciwne.|Kłamca przekręci prawdę, prawdomówny powtórzy kłamstwo – obaj wskażą złe drzwi.
7|maths|Rower i kask kosztują razem 110 zł. Rower jest o 100 zł droższy od kasku. Ile kosztuje kask?|5 zł.|Kask 5 zł, rower 105 zł – razem 110 zł.
7|english|What can travel around the world while staying in a corner?|A stamp – znaczek pocztowy.|
7|logic|Ma miasta bez domów, lasy bez drzew i rzeki bez wody. Co to?|Mapa.|
7|english|What word becomes shorter when you add two letters to it?|SHORT → SHORTER.|
7|nature|Które zwierzę ma niebieską krew i trzy serca?|Ośmiornica.|
7|maths|Jaka jest najmniejsza liczba całkowita, która dzieli się przez 2, 3, 4, 5 i 6?|60.|To najmniejsza wspólna wielokrotność tych liczb.
8|logic|Ojciec i syn mają razem 36 lat. Ojciec jest o 30 lat starszy od syna. Ile lat ma syn?|3 lata.|Syn 3, ojciec 33 – razem 36.
8|maths|Nenufar na stawie co dzień podwaja swoją powierzchnię. Po 30 dniach pokrywa cały staw. Po ilu dniach pokrywał połowę?|Po 29 dniach.|Dzień później podwoił się i zakrył cały staw.
8|english|I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?|An echo – echo.|
8|logic|Masz 3 pudełka z błędnymi etykietami: „jabłka”, „gruszki”, „mieszane”. Wyjmujesz jeden owoc z jednego pudełka. Z którego, żeby poprawić wszystkie etykiety?|Z pudełka „mieszane”.|Skoro etykieta kłamie, są tam tylko jabłka albo tylko gruszki – i wtedy łatwo ustalić resztę.
8|english|The more you take, the more you leave behind. What are they?|Footsteps – ślady stóp.|
8|nature|Dlaczego zimą na jeziorze lód tworzy się na górze, a nie na dnie?|Bo lód jest lżejszy od wody, więc pływa.|Dzięki temu ryby przeżywają zimę pod lodem.
`;

const RIDDLE_KIND_ICONS = { logic: "🧠", maths: "🔢", english: "🇬🇧", nature: "🌿" };

/** @type {Array<{id: string, level: number, kind: string, question: string, answer: string, why: string}>} */
const RIDDLES = RIDDLE_DATA.trim().split("\n").map((line, index) => {
  const [level, kind, question, answer, why = ""] = line.split("|");
  return { id: `r${index + 1}`, level: Number(level), kind, question, answer, why };
});

/** Riddles suitable for a class: its own level and up to three levels below. */
const riddlesForGrade = (grade) => RIDDLES.filter((riddle) => riddle.level <= grade && riddle.level >= grade - 3);
