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
0|nature|Ma długie uszy, skacze i lubi marchewkę. Kto to?|Zając (albo królik).|
0|nature|Mieszka w ulu i robi miód. Kto to?|Pszczoła.|
0|nature|Jest zielona, rośnie na łące i krowy ją jedzą. Co to?|Trawa.|
0|logic|Nie ma nóg, a chodzi. Pokazuje, która jest godzina. Co to?|Zegar.|
0|maths|Na drzewie siedziały dwa ptaszki. Przyleciał jeszcze jeden. Ile ptaszków jest na drzewie?|Trzy.|2 + 1 = 3.
0|english|Jak po angielsku jest „kot”? Podpowiedź: zaczyna się na C.|Cat.|
0|english|Jaki kolor to po angielsku „red”?|Czerwony.|
0|nature|Pada z chmur, a po nim na ziemi robią się kałuże. Co to?|Deszcz.|
0|logic|Ma dwa kółka i pedały. Jeździsz na nim w kasku. Co to?|Rower.|
0|nature|Ma ogon, robi „hau, hau” i pilnuje domu. Kto to?|Pies.|
0|maths|Ile palców masz u jednej ręki?|Pięć.|
1|nature|Ma pancerz na plecach i chodzi bardzo powoli. Kto to?|Żółw.|
1|logic|Ma grzbiet i kartki, ale nie jest zwierzęciem. Co to?|Książka.|
1|maths|Ile kółek mają razem dwa rowery?|Cztery.|2 + 2 = 4.
1|english|Jak po angielsku jest „jeden”?|One.|
1|english|Które zwierzę robi „moo”: cow czy dog?|Cow – krowa.|
1|nature|Z zewnątrz jest białe, w środku żółte, a wykluwa się z niego kurczątko. Co to?|Jajko.|
1|logic|Jest pełna dziur, a jednak trzyma wodę. Co to?|Gąbka.|
1|maths|Ile dni ma tydzień?|Siedem.|
1|nature|Jaka pora roku przychodzi po zimie?|Wiosna.|
1|english|Co znaczy po polsku „sun”?|Słońce.|
1|logic|Nie ma skrzydeł, a lata. Nie ma oczu, a płacze. Co to?|Chmura.|
2|maths|Na łące pasą się 3 krowy i 2 konie. Ile nóg mają razem?|20 nóg.|5 zwierząt × 4 nogi = 20.
2|english|Jakie zwierzę ukrywa się w angielskim słowie „BATh” (kąpiel)?|BAT – nietoperz.|
2|nature|Ma kapelusz, ale nie ma głowy. Ma nóżkę, ale nie nosi butów. Co to?|Grzyb.|
2|logic|Co biegnie, chociaż nie ma nóg?|Rzeka (albo czas).|
2|maths|Ile to jest dwa razy po pięć?|Dziesięć.|
2|english|Jak po angielsku powiesz „dzień dobry” rano?|Good morning.|
2|nature|Jakie zwierzę wyrasta z kijanki?|Żaba.|
2|logic|Co jest zawsze przed tobą, ale nigdy tego nie zobaczysz?|Jutro (przyszłość).|
2|maths|Ola ma 8 cukierków i daje po 2 każdej z trzech koleżanek. Ile jej zostaje?|2 cukierki.|8 − 3 × 2 = 2.
2|english|Które angielskie słowo oznacza i kolor, i owoc?|Orange – pomarańczowy i pomarańcza.|
3|logic|Biegnie dookoła podwórka, ale wcale się nie rusza. Co to?|Płot.|
3|maths|Ile minut ma pół godziny?|30 minut.|Godzina to 60 minut, połowa to 30.
3|english|Z jakich dwóch angielskich słów składa się „football”?|Foot (stopa) i ball (piłka).|
3|nature|Ten ptak nie umie latać, ale świetnie pływa i mieszka tam, gdzie zimno. Kto to?|Pingwin.|
3|logic|Chodzi za tobą w słońcu, a znika w ciemności. Co to?|Twój cień.|
3|maths|Ile nóg mają razem 3 pająki?|24 nogi.|Każdy pająk ma 8 nóg: 3 × 8 = 24.
3|english|Co znaczy po polsku „rainbow”? Podpowiedź: rain to deszcz, a bow to łuk.|Tęcza.|
3|nature|Z czego pszczoły robią miód?|Z nektaru kwiatów.|
3|logic|Który miesiąc ma 28 dni?|Każdy!|Wszystkie miesiące mają co najmniej 28 dni.
4|maths|Ile to jest ćwierć ze stu?|25.|100 : 4 = 25.
4|english|Połącz angielskie słowa „sun” i „flower”. Co powstanie?|Sunflower – słonecznik.|
4|logic|Co możesz trzymać w lewej ręce, ale nigdy w prawej?|Prawy łokieć.|
4|nature|Ile nóg ma każdy owad?|Sześć.|
4|logic|Pan Kowalski ma pięć córek, a każda z nich ma jednego brata. Ile dzieci ma pan Kowalski?|Sześcioro.|Wszystkie córki mają tego samego brata.
4|maths|Ile sekund mają 2 minuty?|120 sekund.|2 × 60 = 120.
4|english|Który miesiąc po angielsku ma tylko trzy litery?|May – maj.|
4|nature|Która planeta jest najbliżej Słońca?|Merkury.|
4|logic|Rano chodzi na czterech nogach, w południe na dwóch, a wieczorem na trzech. Kto to?|Człowiek.|Niemowlę raczkuje, dorosły chodzi, a starsza osoba podpiera się laską. To zagadka Sfinksa!
5|maths|Ile jest liczb dwucyfrowych?|90.|Od 10 do 99 jest 90 liczb.
5|english|Które angielskie słowo znaczy i „mucha”, i „latać”?|Fly.|
5|logic|W każdym z 4 rogów pokoju siedzi kot. Naprzeciw każdego kota siedzą 3 koty. Ile kotów jest w pokoju?|4 koty.|Każdy kot widzi trzy pozostałe.
5|nature|Jak nazywa się największy ocean na Ziemi?|Ocean Spokojny (Pacyfik).|
5|maths|Ile to jest 25% z 80?|20.|25% to ćwierć: 80 : 4 = 20.
5|logic|Jest lżejszy od piórka, a nawet najsilniejszy człowiek nie utrzyma go długo. Co to?|Oddech.|
5|english|Jakie angielskie słowo powstanie, gdy przeczytasz STOP od tyłu?|POTS – garnki.|
5|nature|Jakie zwierzę jest największe na świecie?|Płetwal błękitny.|Jest większy nawet od dinozaurów.
5|maths|Jaka liczba jest następna: 1, 2, 4, 8, 16…?|32.|Każda liczba jest dwa razy większa od poprzedniej.
6|maths|Mama jest 4 razy starsza od córki. Za 20 lat będzie od niej 2 razy starsza. Ile lat ma córka?|10 lat.|Teraz: córka 10, mama 40. Za 20 lat: 30 i 60.
6|english|What begins with T, ends with T, and has T in it?|A teapot – czajniczek.|Gra słów: „tea” (herbata) brzmi jak litera T.
6|logic|Pan wyszedł na deszcz bez parasola i bez czapki, a ani jeden włos na jego głowie nie zmókł. Jak to możliwe?|Był łysy.|
6|nature|Ile kości ma dorosły człowiek?|206.|
6|maths|Ile wynosi suma kątów w trójkącie?|180 stopni.|
6|logic|Ile razy można odjąć 10 od 100?|Raz – potem odejmujesz już od 90.|
6|english|What has words but never speaks?|A book – książka.|
6|nature|Jaki gaz rośliny pobierają z powietrza, żeby rosnąć?|Dwutlenek węgla (CO₂).|W zamian oddają tlen.
6|maths|Ile to jest 1 + 2 + 3 + … + 10?|55.|Pary 1 + 10, 2 + 9… dają 5 × 11 = 55.
7|logic|Biegniesz w wyścigu i wyprzedzasz osobę na drugim miejscu. Na którym miejscu jesteś?|Na drugim.|Zająłeś jej miejsce, a pierwszy wciąż jest przed tobą.
7|maths|Ile to jest 2 do potęgi 10?|1024.|
7|english|What has one head, one foot and four legs?|A bed – łóżko.|Head i foot to wezgłowie i nogi łóżka.
7|logic|Wszystkie cztery ściany domu wychodzą na południe. Obok przechodzi niedźwiedź. Jakiego jest koloru?|Biały – to niedźwiedź polarny.|Taki dom może stać tylko na biegunie północnym.
7|nature|Która planeta Układu Słonecznego jest największa?|Jowisz.|
7|maths|Prostokąt ma obwód 20 cm, a jeden bok 6 cm. Jakie ma pole?|24 cm².|Drugi bok: (20 − 12) : 2 = 4 cm, pole: 6 × 4 = 24.
7|english|Forward I am heavy, backward I am not. What am I?|TON – tona.|Od tyłu „ton” to „not” – „nie”.
7|nature|Dlaczego latem jest cieplej niż zimą?|Bo oś Ziemi jest nachylona i latem słońce świeci na naszą półkulę bardziej z góry.|O porach roku nie decyduje odległość od Słońca!
7|logic|Zegar wybija 6 uderzeń w 5 sekund. Ile czasu zajmie mu wybicie 12 uderzeń?|11 sekund.|Między 6 uderzeniami jest 5 przerw po sekundzie, a między 12 – 11 przerw.
8|maths|Ile przekątnych ma sześciokąt?|9.|n · (n − 3) : 2 = 6 · 3 : 2 = 9.
8|logic|Dwóch ojców i dwóch synów złowiło 3 ryby – każdy po jednej. Jak to możliwe?|To dziadek, ojciec i syn.|Ojciec jest jednocześnie synem.
8|english|What comes once in a minute, twice in a moment, but never in a thousand years?|The letter M – litera M.|
8|nature|Jak szybko porusza się światło?|Około 300 000 km na sekundę.|Ze Słońca do Ziemi leci około 8 minut.
8|maths|Jaka jest jedyna parzysta liczba pierwsza?|2.|Każda inna liczba parzysta dzieli się przez 2.
8|logic|W szufladzie leży 10 czarnych i 10 białych skarpet. Ile musisz wyjąć po ciemku, żeby mieć pewność, że masz parę?|3 skarpety.|Spośród trzech skarpet dwie muszą być tego samego koloru.
8|english|What building has the most stories?|A library – biblioteka.|Story to historia, a w Ameryce także piętro.
8|nature|Z czego składa się woda?|Z wodoru i tlenu (H₂O).|
8|maths|Średnia trzech liczb wynosi 10. Dwie z nich to 8 i 9. Jaka jest trzecia?|13.|Suma to 30, więc 30 − 8 − 9 = 13.
8|logic|Masz dwie klepsydry: 4-minutową i 7-minutową. Jak odmierzyć dokładnie 9 minut?|Włącz obie. Po 4 min odwróć małą. Po 7 min odwróć dużą. Po 8 min (mała się skończyła) odwróć dużą jeszcze raz – przesypie się 1 minuta, razem 9.|
`;

const RIDDLE_KIND_ICONS = { logic: "🧠", maths: "🔢", english: "🇬🇧", nature: "🌿" };

/** @type {Array<{id: string, level: number, kind: string, question: string, answer: string, why: string}>} */
const RIDDLES = RIDDLE_DATA.trim().split("\n").map((line, index) => {
  const [level, kind, question, answer, why = ""] = line.split("|");
  return { id: `r${index + 1}`, level: Number(level), kind, question, answer, why };
});

/** Riddles suitable for a class: its own level and up to three levels below. */
const riddlesForGrade = (grade) => RIDDLES.filter((riddle) => riddle.level <= grade && riddle.level >= grade - 3);
