"use strict";

// ====================== GRADE 4 ======================
unit("tobe", 4, "🧍", "To be – być", "am / is / are", [
  step("tobe.1", "Twierdzenia", card(
    ["**to be** znaczy „być”. Ma trzy formy: **am, is, are**.", "Używamy go, gdy mówimy, **kim** ktoś jest, **jaki** jest, **ile ma lat** i **gdzie** jest."],
    [["I am eleven years old.", "Mam jedenaście lat."], ["She is my best friend.", "Ona jest moją najlepszą przyjaciółką."], ["We are in class four.", "Jesteśmy w czwartej klasie."]],
    { intro: "Am, is, are – trzy bliźniaki. Każdy pasuje do innej osoby. Zobacz tabelkę!",
      table: { head: ["Osoba", "Forma", "Skrót"], rows: [["I", "am", "I'm"], ["he / she / it", "is", "he's / she's / it's"], ["we / you / they", "are", "we're / you're / they're"]] },
      pattern: [pat("➕", "S:She", "V:is", "R:my friend.")], mistake: ["I have eleven years.", "I am eleven (years old).", "O wieku mówimy z **to be**, nie z have."] }), [
    choice("I ___ ten years old.", "am", "is", "are"), choice("She ___ my best friend.", "is", "am", "are"),
    choice("We ___ in class 4.", "are", "is", "am"), choice("My parents ___ at work.", "are", "is", "am"),
  ]),
  step("tobe.2", "Przeczenia", card(
    ["Żeby powiedzieć „nie jestem”, dodajemy **not**: I am **not**, he is **not**, we are **not**.", "Krócej: **isn't** = is not, **aren't** = are not. Uwaga: „am not” nie ma skrótu – mówimy **I'm not**."],
    [["He isn't a doctor.", "On nie jest lekarzem."], ["They aren't at home.", "Nie ma ich w domu."], ["I'm not hungry.", "Nie jestem głodny."]],
    { intro: "Mówisz „nie”? Po am, is, are dodaj not.", pattern: [pat("➖", "S:He", "V:is", "N:not / isn't", "R:a doctor.")] }), [
    gap("He ___ a doctor. (przeczenie)", "isn't/is not"), gap("They ___ at home. (przeczenie)", "aren't/are not"),
    gap("I ___ not hungry.", "am"), choice("It ___ a big dog. (przeczenie)", "isn't", "aren't", "am not"),
  ]),
  step("tobe.3", "Pytania", card(
    ["W pytaniu **am / is / are** przeskakuje na początek: You are happy. → **Are you** happy?", "Krótkie odpowiedzi: **Yes, I am.** / **No, she isn't.**"],
    [["Are you hungry?", "Czy jesteś głodny?"], ["Is your brother a student?", "Czy twój brat jest uczniem?"], ["Yes, he is.", "Tak, jest."]],
    { intro: "Pytanie to zamiana miejsc: is albo are skacze na sam przód!", pattern: [pat("❓", "V:Are", "S:you", "R:happy?"), pat("❓", "V:Is", "S:he", "R:at home?")] }), [
    gap("___ you happy?", "Are"), choice("___ your brother at home?", "Is", "Are", "Am"),
    gap("___ it cold today?", "Is"), choice("Is she a nurse? Yes, she ___.", "is", "are", "am"),
  ]),
  step("tobe.4", "Sprawdź się", card(["Powtórka: **I am**, **he / she / it is**, **we / you / they are**."], [["My name is Anna.", "Mam na imię Anna."], ["Tom and Ann are cousins.", "Tomek i Ania są kuzynami."]],
    { intro: "Czas na mały sprawdzian. Dasz radę!" }), [
    choice("Tom and Ann ___ cousins.", "are", "is", "am"), choice("The cat ___ under the table.", "is", "are", "am"),
    gap("We ___ not tired.", "are"), ord("Is your brother a student?", "Czy twój brat jest uczniem?"),
  ]),
]);

unit("havegot", 4, "🎒", "Have got – mieć", "have got / has got", [
  step("havegot.1", "Twierdzenia", card(
    ["**have got** – mieć. Mówimy tak o tym, **co ktoś ma** i **jak wygląda**.", "**I / you / we / they have got**, ale **he / she / it has got**."],
    [["I have got a new bike.", "Mam nowy rower."], ["She has got long hair.", "Ona ma długie włosy."], ["They have got a big house.", "Oni mają duży dom."]],
    { intro: "Have got to „mam”. Przy he, she, it zamienia się w has got.",
      table: { head: ["Osoba", "Forma", "Skrót"], rows: [["I / you / we / they", "have got", "'ve got"], ["he / she / it", "has got", "'s got"]] },
      pattern: [pat("➕", "S:I", "V:have got", "R:a bike."), pat("➕", "S:She", "V:has got", "R:long hair.")] }), [
    choice("I ___ got two brothers.", "have", "has", "am"), choice("She ___ got a new bike.", "has", "have", "is"),
    choice("They ___ got a big house.", "have", "has", "are"), gap("It ___ got four legs.", "has"),
  ]),
  step("havegot.2", "Przeczenia i pytania", card(
    ["Przeczenie: **haven't got / hasn't got**.", "Pytanie: **Have / Has** idzie na początek: **Has** he got a pen?", "Krótkie odpowiedzi: **Yes, I have.** / **No, she hasn't.**"],
    [["We haven't got a dog.", "Nie mamy psa."], ["Has he got a sister?", "Czy on ma siostrę?"], ["Have you got a pencil?", "Czy masz ołówek?"]],
    { intro: "Tak jak przy to be: w pytaniu have albo has idzie na początek.",
      pattern: [pat("➖", "S:We", "N:haven't got", "R:a dog."), pat("❓", "H:Has", "S:he", "V:got", "R:a sister?")] }), [
    gap("He ___ got a computer. (przeczenie)", "hasn't/has not"), choice("We ___ got a cat. (przeczenie)", "haven't", "hasn't", "aren't"),
    gap("___ you got a pen?", "Have"), choice("Has Tom got a ball? No, he ___.", "hasn't", "haven't", "isn't"),
  ]),
  step("havegot.3", "Sprawdź się", card(["Powtórka: **have got** (I, you, we, they) i **has got** (he, she, it)."], [["My cat has got green eyes.", "Mój kot ma zielone oczy."]],
    { intro: "Pokaż, co zapamiętałeś!" }), [
    gap("My parents ___ got a garden.", "have"), choice("___ she got a sister?", "Has", "Have", "Is"),
    choice("Have you got a dog? Yes, I ___.", "have", "has", "am"), ord("My cat has got green eyes.", "Mój kot ma zielone oczy."),
  ]),
]);

unit("can", 4, "💪", "Can – umieć, móc", "can / can't / Can I…?", [
  step("can.1", "Can i can't", card(
    ["**can** – umiem, potrafię, mogę. Dla wszystkich osób wygląda tak samo.", "Przeczenie: **can't** (= cannot).", "Po **can** czasownik jest **bez to i bez -s**: She can swim."],
    [["I can swim very well.", "Potrafię bardzo dobrze pływać."], ["She can't ride a horse.", "Ona nie umie jeździć konno."], ["Birds can fly.", "Ptaki potrafią latać."]],
    { intro: "Can to łatwe słówko – nigdy się nie zmienia!", scene: [["🏊", "I **can** swim."], ["🐧", "Penguins **can't** fly."]],
      pattern: [pat("➕", "S:She", "H:can", "V:swim."), pat("➖", "S:She", "N:can't", "V:ride", "R:a horse.")], mistake: ["He can to play.", "He can play."] }), [
    choice("He can ___ the piano.", "play", "plays", "to play"), choice("My little brother ___ read yet.", "can't", "can", "cans"),
    gap("Penguins ___ fly. (przeczenie)", "can't/cannot"), choice("Birds can ___.", "fly", "flies", "to fly"),
  ]),
  step("can.2", "Pytania i prośby", card(
    ["Pytanie: **Can + osoba + czasownik?** Can you swim?", "**Can I…?** – tak grzecznie pytamy o pozwolenie: Can I open the window?", "**Can you…?** – tak prosimy kogoś o pomoc: Can you help me?"],
    [["Can you help me?", "Czy możesz mi pomóc?"], ["Can I open the window?", "Czy mogę otworzyć okno?"]],
    { intro: "Can przydaje się też, gdy o coś prosisz!", pattern: [pat("❓", "H:Can", "S:I", "V:open", "R:the window?")] }), [
    gap("___ you speak English?", "Can"), choice("Can she dance? Yes, she ___.", "can", "does", "is"),
    gap("___ I open the window?", "Can"), ord("Can you help me?", "Czy możesz mi pomóc?"),
  ]),
]);

unit("thereis", 4, "📍", "There is / There are", "Co gdzie jest", [
  step("thereis.1", "There is, there are", card(
    ["**There is** – gdy mówimy o jednej rzeczy albo o czymś, czego nie liczymy (milk, water).", "**There are** – gdy rzeczy jest więcej.", "Po polsku zwykle mówimy po prostu „jest / są”."],
    [["There is a lamp in my room.", "W moim pokoju jest lampa."], ["There are two windows in the kitchen.", "W kuchni są dwa okna."]],
    { intro: "Opisujesz swój pokój? There is i There are bardzo Ci pomogą.", scene: [["💡", "There **is** a lamp."], ["🪟🪟", "There **are** two windows."]] }), [
    choice("There ___ a cat on the sofa.", "is", "are"), choice("There ___ three books on the desk.", "are", "is"),
    gap("There ___ a boy in the garden.", "is"), choice("There is ___ apple on the table.", "an", "a", "some"),
  ]),
  step("thereis.2", "Przeczenia i pytania", card(
    ["Przeczenie: **There isn't / There aren't**.", "Pytanie: **Is there…? / Are there…?**", "Odpowiedzi: **Yes, there is.** / **No, there aren't.**"],
    [["Is there a park near your house?", "Czy w pobliżu twojego domu jest park?"], ["There aren't any chairs.", "Nie ma żadnych krzeseł."]],
    { intro: "W pytaniu is albo are znów skacze na początek.", pattern: [pat("❓", "V:Is", "S:there", "R:a park?")] }), [
    choice("There ___ any milk. (przeczenie)", "isn't", "aren't"), gap("___ there a park near your house?", "Is"),
    gap("___ there any eggs in the fridge?", "Are"), choice("Is there a TV in your room? Yes, there ___.", "is", "are", "has"),
  ]),
  step("thereis.3", "some i any", card(
    ["**some** – trochę, kilka. Używamy go w zdaniach twierdzących: There are some apples.", "**any** – żadne / jakieś. Używamy go w przeczeniach i pytaniach: There aren't any apples. Are there any apples?"],
    [["There are some apples.", "Jest kilka jabłek."], ["Are there any apples?", "Czy są jakieś jabłka?"], ["There isn't any milk in the fridge.", "W lodówce nie ma mleka."]],
    { intro: "Some lubi zdania na tak, a any – pytania i zdania na nie." }), [
    choice("There are ___ apples on the table.", "some", "any"), choice("There aren't ___ chairs.", "any", "some", "a"),
    choice("Are there ___ biscuits?", "any", "some", "a"), gap("There isn't ___ juice.", "any"),
  ]),
]);

unit("possessives", 4, "🧑", "Moje, twoje, jego", "my, your, his, her… i 's", [
  step("possessives.1", "my, your, his, her", card(
    ["Te słówka mówią, **do kogo coś należy**.", "Uważaj: **his** = jego (chłopca), **her** = jej (dziewczynki)."],
    [["My bag is red.", "Moja torba jest czerwona."], ["Her bag is blue.", "Jej torba jest niebieska."], ["His dog is big.", "Jego pies jest duży."]],
    { intro: "Czyje to? Odpowiedź znajdziesz w tabelce.",
      table: { head: ["Osoba", "Czyj?"], rows: [["I", "my – mój"], ["you", "your – twój"], ["he", "his – jego"], ["she", "her – jej"], ["it", "its – jego / jej (o rzeczy, zwierzęciu)"], ["we", "our – nasz"], ["they", "their – ich"]] } }), [
    choice("I have a dog. ___ dog is big.", "My", "Your", "His"), choice("She has a bag. ___ bag is red.", "Her", "His", "Their"),
    choice("He has a bike. ___ bike is new.", "His", "Her", "My"), choice("We have a house. ___ house is big.", "Our", "Their", "Your"),
  ]),
  step("possessives.2", "Dopełniacz 's", card(
    ["Gdy coś należy do konkretnej osoby, dodajemy **'s**: Tom's book = książka Tomka.", "Pytanie: **Whose** pen is it? – Czyj to długopis?"],
    [["This is Tom's ball.", "To jest piłka Tomka."], ["Whose pen is it?", "Czyj to długopis?"], ["It's my sister's pen.", "To długopis mojej siostry."]],
    { intro: "Apostrof i s – i już wiadomo, czyje to jest!", scene: [["👦⚽", "Tom**'s** ball"], ["👩‍🏫📕", "the teacher**'s** book"]] }), [
    choice("This is ___ bag. (Anna)", "Anna's", "Annas", "Anna"), choice("It is my ___ car. (brother)", "brother's", "brothers", "brother is"),
    gap("Whose ball is it? – It is Tom___ ball.", "'s"), choice("Whose pen is it? – It's the ___ pen.", "teacher's", "teachers", "teacher"),
  ]),
]);

unit("timeprep", 4, "🕒", "at, on, in w czasie", "O której? Którego dnia? Kiedy?", [
  step("timeprep.1", "at, on, in", card(
    ["**at** – przy godzinach: at seven o'clock, at 5 p.m.", "**on** – przy dniach: on Monday, on Sundays, on my birthday", "**in** – przy miesiącach, porach roku, latach i częściach dnia: in May, in summer, in 2024, in the morning"],
    [["I get up at seven.", "Wstaję o siódmej."], ["We have PE on Monday.", "W poniedziałek mamy WF."], ["My birthday is in May.", "Moje urodziny są w maju."]],
    { intro: "Zapamiętaj: małe rzeczy (godzina) – at, dzień – on, duże (miesiąc, rok) – in.",
      scene: [["⏰", "**at** 7 o'clock"], ["📅", "**on** Monday"], ["🌸", "**in** May, **in** spring"]], mistake: ["in Monday", "on Monday"] }), [
    choice("I get up ___ seven o'clock.", "at", "on", "in"), choice("We have PE ___ Monday.", "on", "at", "in"),
    choice("My birthday is ___ May.", "in", "on", "at"), choice("I play football ___ the afternoon.", "in", "on", "at"),
  ]),
  step("timeprep.2", "Sprawdź się", card(["Powtórka: **at** – godzina, **on** – dzień, **in** – miesiąc, pora roku, rok."], [["She was born in 2014.", "Ona urodziła się w 2014 roku."]],
    { intro: "Sprawdź, czy pamiętasz at, on i in." }), [
    choice("The film starts ___ 6 p.m.", "at", "on", "in"), choice("We go skiing ___ winter.", "in", "on", "at"),
    choice("She was born ___ 2014.", "in", "on", "at"), choice("They visit us ___ Sundays.", "on", "at", "in"),
  ]),
]);

unit("shopexpr", 4, "🛍️", "Na zakupach", "How much is it?", [
  step("shopexpr.1", "W sklepie", card(
    ["**Can I help you?** – W czym mogę pomóc?", "**How much is it?** – Ile to kosztuje?", "**It's five pounds.** – To kosztuje pięć funtów.", "**Here you are.** – Proszę (gdy coś podajesz)."],
    [["Can I help you?", "W czym mogę pomóc?"], ["How much is it?", "Ile to kosztuje?"], ["It's five pounds.", "To kosztuje pięć funtów."]],
    { intro: "Idziemy na zakupy do Londynu! Tak wygląda rozmowa w sklepie.", scene: [["🙋‍♀️", "**Can I help you?**"], ["🧒❓💷", "**How much is it?**"], ["💷", "**It's five pounds.**"]] }), [
    choice("Sprzedawca pyta: „Can I help you?”. Odpowiadasz:", "Yes, I'd like a banana, please.", "I'm fine.", "My name is Tom."),
    choice("Pytasz o cenę:", "How much is it?", "How old are you?", "What time is it?"),
    choice("How much is it? – ___", "It's five pounds.", "It's five o'clock.", "It's five years old."),
    choice("Podajesz coś komuś i mówisz:", "Here you are.", "Excuse me.", "Good night."),
  ]),
  step("shopexpr.2", "Grzeczne zwroty", card(
    ["**I'd like…** – Chciałbym… / Poproszę… (grzeczna prośba). I'd = I would.", "**You're welcome.** – Proszę bardzo / Nie ma za co (odpowiedź na „Thank you”)."],
    [["I'd like a sandwich, please.", "Poproszę kanapkę."], ["Thank you! – You're welcome.", "Dziękuję! – Nie ma za co."]],
    { intro: "I'd like brzmi grzeczniej niż I want. Spróbuj!", mistake: ["I want a sandwich.", "I'd like a sandwich, please.", "Obie formy są poprawne, ale ta druga jest dużo grzeczniejsza."] }), [
    ord("Can I help you?", "W czym mogę pomóc?"), ord("I'd like a sandwich, please.", "Poproszę kanapkę."),
    gap("How ___ is it?", "much"), choice("Thank you! – ___", "You're welcome.", "Good night.", "I'm sorry."),
  ]),
]);

unit("clocktime", 4, "⏰", "Godziny", "o'clock, half past, quarter", [
  step("clocktime.1", "Pełne, wpół i kwadranse", card(
    ["**o'clock** – pełna godzina: 3:00 – three o'clock", "**half past** – „pół po”: 3:30 – half past three (wpół do czwartej)", "**(a) quarter past** – kwadrans po: 6:15 – quarter past six", "**(a) quarter to** – za kwadrans: 6:45 – quarter to seven"],
    [["It's half past three.", "Jest wpół do czwartej (3:30)."], ["It's quarter to seven.", "Jest za piętnaście siódma (6:45)."]],
    { intro: "Uwaga, pułapka! Half past three to 3:30, czyli po polsku „wpół do czwartej”.", illus: "clocks",
      mistake: ["3:30 – half past four", "3:30 – half past three", "Anglik mówi „pół godziny PO trzeciej”, a Polak „wpół DO czwartej”."] }), [
    choice("3:00 – It's ___.", "three o'clock", "half past three", "quarter past three"), choice("3:30 – It's ___.", "half past three", "three o'clock", "half past four"),
    choice("6:15 – It's ___.", "quarter past six", "quarter to six", "half past six"), choice("6:45 – It's ___.", "quarter to seven", "quarter past seven", "quarter to six"),
  ]),
  step("clocktime.2", "Pytania o czas", card(
    ["**What time is it?** – Która (jest) godzina?", "**What time do you get up?** – O której wstajesz? – **I get up at seven.** – Wstaję o siódmej."],
    [["What time is it?", "Która jest godzina?"], ["What time do you get up?", "O której wstajesz?"], ["I get up at seven.", "Wstaję o siódmej."]],
    { intro: "Pytamy o godzinę albo o to, o której coś robimy." }), [
    choice("What time is it? – ___", "It's ten o'clock.", "I'm ten.", "It's Monday."), choice("What time do you get up? – ___", "I get up at seven.", "I'm seven.", "It's seven."),
    gap("What ___ is it?", "time"), choice("Co znaczy „half past two”?", "wpół do trzeciej (2:30)", "za piętnaście trzecia", "druga piętnaście"),
  ]),
]);

// ====================== GRADE 5 ======================
unit("presimple", 5, "🔁", "Present Simple", "Nawyki, zwyczaje, fakty", [
  step("presimple.1", "I / you / we / they", card(
    ["Dla **I, you, we, they** czasownik zostaje bez zmian: I play, we play, they play.", "Zwykle mówimy w tym czasie o sobie, kolegach i rodzinie: co robimy codziennie."],
    [["I get up at seven o'clock.", "Wstaję o siódmej."], ["We have lunch at school.", "Jemy obiad w szkole."], ["They live in Warsaw.", "Oni mieszkają w Warszawie."]],
    { intro: "Present Simple to czas „zwykłych dni”. Opowiadasz w nim, co robisz zawsze, często albo codziennie.",
      when: "Gdy coś **powtarza się regularnie** (nawyk, plan dnia) albo jest **zawsze prawdą** (fakt): I go to school every day. The sun is hot.",
      timeline: ["habit"], pattern: [pat("➕", "S:I / you / we / they", "V:play", "R:football.")],
      signals: ["always – zawsze", "usually – zwykle", "often – często", "sometimes – czasami", "never – nigdy", "every day – codziennie", "on Mondays – w poniedziałki"] }), [
    choice("I ___ TV every evening.", "watch", "watches", "watching"), choice("We ___ breakfast at 7:30.", "have", "has", "having"),
    choice("They ___ in Warsaw.", "live", "lives", "living"), gap("You ___ (go) to school by bus.", "go"),
  ]),
  step("presimple.2", "he / she / it – końcówka -s", card(
    ["Dla **he, she, it** dodajemy do czasownika **-s**: play → plays.", "Po s, sh, ch, x, o dodajemy **-es**: watch → watches, go → goes.", "Gdy przed y jest spółgłoska: **y → ies**: study → studies.", "Wyjątek: have → **has**."],
    [["She plays tennis on Saturdays.", "Ona gra w tenisa w soboty."], ["My dad works in a bank.", "Mój tata pracuje w banku."], ["The sun rises in the east.", "Słońce wschodzi na wschodzie."]],
    { intro: "Najważniejsza zasada: on, ona, ono – czasownik dostaje -s. Jak syk węża: sssss!",
      table: { head: ["Zasada", "Przykład"], rows: [["zwykle + s", "play → plays"], ["s, sh, ch, x, o + es", "watch → watches, go → goes"], ["spółgłoska + y → ies", "study → studies"], ["wyjątek", "have → has"]] },
      pattern: [pat("➕", "S:he / she / it", "V:plays", "R:tennis.")], mistake: ["She play tennis.", "She plays tennis.", "Przy he / she / it nie zapominaj o **-s**!"] }), [
    choice("He ___ to school by bus.", "goes", "go", "going"), gap("She ___ (study) English on Mondays.", "studies"),
    gap("My dad ___ (watch) football on TV.", "watches"), gap("My cat never ___ (eat) fish.", "eats"),
  ]),
  step("presimple.3", "Przeczenia", card(
    ["Przeczenie robimy z pomocnikiem: **don't** (I, you, we, they) i **doesn't** (he, she, it).", "Po **doesn't** czasownik jest **bez -s**, bo -s „zabrał” pomocnik: She doesn't like fish."],
    [["He doesn't like fish.", "On nie lubi ryb."], ["They don't watch TV in the morning.", "Oni nie oglądają telewizji rano."]],
    { intro: "W przeczeniu pojawia się pomocnik do albo does. Does zabiera czasownikowi -s!",
      pattern: [pat("➖", "S:I / you / we / they", "N:don't", "V:like", "R:fish."), pat("➖", "S:he / she / it", "N:doesn't", "V:like", "R:fish.")],
      mistake: ["She doesn't likes fish.", "She doesn't like fish."] }), [
    choice("They ___ like spiders.", "don't", "doesn't", "aren't"), choice("She doesn't ___ milk.", "drink", "drinks", "drinking"),
    gap("He ___ play the guitar. (przeczenie)", "doesn't/does not"), gap("We ___ have lunch at school. (przeczenie)", "don't/do not"),
  ]),
  step("presimple.4", "Pytania", card(
    ["Pytanie zaczynamy od pomocnika: **Do** (I, you, we, they) albo **Does** (he, she, it).", "Czasownik po **do / does** jest bez zmian: Does she **play**?", "Krótkie odpowiedzi: **Yes, I do.** / **No, she doesn't.**"],
    [["Do you walk to school?", "Czy chodzisz do szkoły pieszo?"], ["Does she speak English?", "Czy ona mówi po angielsku?"], ["Yes, she does.", "Tak, mówi."]],
    { intro: "Pytanie? Postaw do albo does na początku. Reszta zdania prawie się nie zmienia.",
      pattern: [pat("❓", "H:Do", "S:you", "V:play", "R:football?"), pat("❓", "H:Does", "S:she", "V:play", "R:football?")] }), [
    gap("___ you like pizza?", "Do"), gap("___ Tom play the guitar?", "Does"),
    choice("Does she like pizza? Yes, she ___.", "does", "do", "is"), ord("Does she speak English?", "Czy ona mówi po angielsku?"),
  ]),
]);

unit("precont", 5, "▶️", "Present Continuous", "Co dzieje się teraz", [
  step("precont.1", "Twierdzenia", card(
    ["Budowa: **am / is / are + czasownik z końcówką -ing**.", "Pisownia: make → making (znika e), run → running (podwajamy literę), play → playing."],
    [["I am reading a book now.", "Teraz czytam książkę."], ["He is playing football.", "On gra (teraz) w piłkę."], ["We are having lunch at the moment.", "W tej chwili jemy obiad."]],
    { intro: "Present Continuous to czas „na żywo”. Opisujesz w nim to, co dzieje się właśnie teraz – jak w transmisji sportowej!",
      when: "Gdy coś dzieje się **w tej chwili**, kiedy o tym mówimy: Look! The baby is sleeping.",
      timeline: ["now"], table: { head: ["Osoba", "Forma"], rows: [["I", "am playing"], ["he / she / it", "is playing"], ["we / you / they", "are playing"]] },
      pattern: [pat("➕", "S:She", "H:is", "V:reading", "R:a book.")], signals: ["now – teraz", "right now – właśnie teraz", "at the moment – w tej chwili", "Look! – Patrz!", "Listen! – Słuchaj!"],
      mistake: ["She reading a book.", "She is reading a book.", "Nie zapominaj o pomocniku **am / is / are**!"] }), [
    choice("Look! The baby ___.", "is sleeping", "sleeps", "sleep"), choice("We ___ English now.", "are learning", "learn", "learns"),
    gap("I ___ (write) a letter now.", "am writing"), gap("She ___ (run) in the park at the moment.", "is running"),
  ]),
  step("precont.2", "Przeczenia i pytania", card(
    ["Przeczenie: **am not / isn't / aren't + -ing**.", "Pytanie: **Am / Is / Are** na początek: Is she reading?", "Czasowników „uczuć i myśli” (like, love, want, know) zwykle nie używamy z -ing."],
    [["They aren't watching TV.", "Oni nie oglądają (teraz) telewizji."], ["What are you doing?", "Co (teraz) robisz?"], ["Is it raining?", "Czy pada deszcz?"]],
    { intro: "Pytanie jak przy to be: am, is albo are skacze na początek.",
      pattern: [pat("➖", "S:They", "H:aren't", "V:watching", "R:TV."), pat("❓", "H:Is", "S:it", "V:raining?")], mistake: ["I am knowing the answer.", "I know the answer."] }), [
    choice("They ___ playing now. (przeczenie)", "aren't", "isn't", "don't"), gap("___ he watching TV?", "Is"),
    gap("What ___ you doing?", "are"), choice("I ___ my homework right now. (przeczenie)", "am not doing", "don't do", "not doing"),
  ]),
  step("precont.3", "Sprawdź się", card(["Powtórka: **am / is / are + -ing** – to, co dzieje się teraz."], [["Listen! Mum is singing a song.", "Posłuchaj! Mama śpiewa piosenkę."]],
    { intro: "Co dzieje się teraz? Sprawdź się!", timeline: ["now"] }), [
    choice("Listen! Mum ___ a song.", "is singing", "sings", "sing"), gap("The children ___ (swim) in the lake.", "are swimming"),
    choice("Are you listening? Yes, I ___.", "am", "do", "listen"), ord("What are you doing?", "Co robisz?"),
  ]),
]);

unit("simplevscont", 5, "⚖️", "Simple czy Continuous?", "Jak wybrać czas", [
  step("simplevscont.1", "Nawyk czy teraz?", card(
    ["Zadaj sobie pytanie: **czy to dzieje się regularnie, czy właśnie teraz?**", "Regularnie (always, usually, every day) → **Present Simple**.", "Teraz (now, at the moment, Look!, Listen!) → **Present Continuous**."],
    [["I play tennis every Sunday.", "Gram w tenisa w każdą niedzielę."], ["I am playing tennis now.", "Teraz gram w tenisa."]],
    { intro: "Dwa czasy teraźniejsze, a po polsku często brzmią tak samo. Rychu ma na to trik: szukaj słów-podpowiedzi!",
      timeline: ["habit", "now"],
      table: { head: ["", "Present Simple", "Present Continuous"], rows: [["Kiedy?", "zawsze, zwykle, co dzień", "teraz, w tej chwili"], ["Budowa", "play / plays", "am / is / are + playing"], ["Przykład", "I **play** every day.", "I **am playing** now."]] } }), [
    choice("Tom ___ football every Saturday.", "plays", "is playing"), choice("Tom ___ football now.", "is playing", "plays"),
    choice("She always ___ breakfast at home.", "has", "is having"), choice("Be quiet! The baby ___.", "is sleeping", "sleeps"),
  ]),
  step("simplevscont.2", "Sprawdź się", card(["Czasowniki uczuć i myśli (like, love, want, know) zwykle są w **Present Simple**, nawet gdy mówimy o teraz."], [["I like this song.", "Lubię tę piosenkę."], ["Look! It is raining.", "Patrz! Pada deszcz."]],
    { intro: "Ostatnia próba: nawyk czy teraz?" }), [
    choice("We ___ to school on foot every day.", "go", "are going"), choice("Look! It ___.", "is raining", "rains"),
    choice("My mum ___ in a bank.", "works", "is working"), gap("Listen! Somebody ___ (knock) at the door.", "is knocking"),
  ]),
]);

unit("waswere", 5, "⏮️", "Was / Were", "Czas przeszły od „to be”", [
  step("waswere.1", "Twierdzenia", card(
    ["**was / were** to „byłem, byłeś, była…” – przeszłość od am / is / are.", "**I, he, she, it → was**", "**we, you, they → were**"],
    [["I was at home yesterday.", "Wczoraj byłem w domu."], ["They were in London last year.", "W zeszłym roku byli w Londynie."]],
    { intro: "Am i is zamieniają się w was, a are zamienia się w were. To wszystko!",
      when: "Gdy mówimy, gdzie ktoś **był** albo jaki **był** w przeszłości.", timeline: ["past"],
      table: { head: ["Teraz", "Wczoraj"], rows: [["I am", "I was"], ["he / she / it is", "he / she / it was"], ["we / you / they are", "we / you / they were"]] },
      signals: ["yesterday – wczoraj", "last night – wczoraj wieczorem", "last week – w zeszłym tygodniu", "two days ago – dwa dni temu", "in 2020 – w 2020 roku"] }), [
    choice("I ___ at home yesterday.", "was", "were"), choice("They ___ in London last year.", "were", "was"),
    choice("She ___ happy yesterday.", "was", "were"), gap("We ___ at the cinema on Sunday.", "were"),
  ]),
  step("waswere.2", "Przeczenia", card(
    ["Przeczenia: **wasn't** (= was not) i **weren't** (= were not)."],
    [["She wasn't happy.", "Ona nie była szczęśliwa."], ["We weren't tired after the match.", "Nie byliśmy zmęczeni po meczu."]],
    { intro: "Dodaj not – i już masz przeczenie.", pattern: [pat("➖", "S:She", "V:wasn't", "R:happy."), pat("➖", "S:We", "V:weren't", "R:tired.")] }), [
    choice("The shops ___ open yesterday.", "weren't", "wasn't", "aren't"), gap("He ___ tired after the game. (przeczenie)", "wasn't/was not"),
    choice("It ___ cold last night. (przeczenie)", "wasn't", "weren't", "isn't"), gap("They ___ at school yesterday. (przeczenie)", "weren't/were not"),
  ]),
  step("waswere.3", "Pytania", card(
    ["Pytanie: **Was / Were** na początku: Were you at home?", "Krótkie odpowiedzi: **Yes, I was.** / **No, they weren't.**"],
    [["Were you at school on Monday?", "Czy byłeś w szkole w poniedziałek?"], ["Was the film interesting?", "Czy film był ciekawy?"]],
    { intro: "Tak jak przy am, is, are: was albo were skacze na początek.", pattern: [pat("❓", "V:Were", "S:you", "R:at home?")] }), [
    gap("___ you at school yesterday?", "Were"), choice("___ Tom in the garden?", "Was", "Were"),
    choice("Was it a good film? Yes, it ___.", "was", "were", "is"), ord("Was the film interesting?", "Czy film był ciekawy?"),
  ]),
]);

unit("pastregular", 5, "📜", "Past Simple – regularne", "Czasowniki z końcówką -ed", [
  step("pastregular.1", "Twierdzenia (-ed)", card(
    ["Czasownik regularny dostaje **-ed**: play → played, watch → watched.", "Gdy kończy się na -e, dodajemy tylko **-d**: like → liked.", "Spółgłoska + y: **-ied**: study → studied. Czasem podwajamy literę: stop → stopped.", "Forma jest **taka sama dla wszystkich osób**: I played, she played."],
    [["I played football yesterday.", "Wczoraj grałem w piłkę."], ["We visited our grandma on Sunday.", "W niedzielę odwiedziliśmy babcię."]],
    { intro: "Past Simple to czas opowieści o tym, co się wydarzyło i już się skończyło.",
      when: "Gdy opowiadamy o czymś, co **wydarzyło się i skończyło w przeszłości**, często z konkretnym czasem (yesterday, last week).", timeline: ["past"],
      pattern: [pat("➕", "S:I / She / They", "V:played", "R:football yesterday.")], signals: ["yesterday", "last week / last year", "two days ago", "in 2019", "when I was little"] }), [
    choice("I ___ football yesterday.", "played", "play", "playing"), gap("She ___ (watch) a film last night.", "watched"),
    gap("We ___ (visit) our grandma last Sunday.", "visited"), gap("They ___ (study) for the test yesterday.", "studied"),
  ]),
  step("pastregular.2", "Przeczenia i pytania", card(
    ["Przeczenie: **didn't + czasownik bez zmian**: I didn't play.", "Pytanie: **Did + osoba + czasownik bez zmian?** Did you play?", "Pomocnik **did** sam pokazuje przeszłość, więc czasownik nie dostaje już -ed."],
    [["He didn't open the window.", "On nie otworzył okna."], ["Did you help your mum?", "Czy pomogłeś mamie?"], ["Yes, I did.", "Tak, pomogłem."]],
    { intro: "Did to pomocnik od przeszłości. Gdy on się pojawia, -ed znika!",
      pattern: [pat("➖", "S:He", "N:didn't", "V:open", "R:the window."), pat("❓", "H:Did", "S:you", "V:help", "R:your mum?")], mistake: ["He didn't opened the window.", "He didn't open the window."] }), [
    choice("He didn't ___ the window.", "open", "opened", "opens"), gap("___ you help your mum yesterday?", "Did"),
    choice("Did she call you? No, she ___.", "didn't", "wasn't", "doesn't"), gap("We didn't ___ the soup. (like)", "like"),
  ]),
  step("pastregular.3", "Sprawdź się", card(["Powtórka: **-ed** w zdaniach twierdzących, **did / didn't** w pytaniach i przeczeniach."], [["I cleaned my room two days ago.", "Dwa dni temu posprzątałem pokój."]],
    { intro: "Pokaż, że znasz Past Simple!", timeline: ["past"] }), [
    choice("I ___ my room two days ago.", "cleaned", "clean", "cleans"), gap("She ___ (stop) at the traffic lights.", "stopped"),
    choice("He ___ in Paris in 2019.", "lived", "live", "lives"), ord("Did you help your mum?", "Czy pomogłeś mamie?"),
  ]),
]);

unit("directions", 5, "🧭", "Jak dojść?", "Turn left, go straight on", [
  step("directions.1", "Left, right, straight", card(
    ["**Turn left.** – Skręć w lewo.", "**Turn right.** – Skręć w prawo.", "**Go straight on.** – Idź prosto.", "**next to** – obok, **opposite** – naprzeciwko"],
    [["Turn left.", "Skręć w lewo."], ["Go straight on.", "Idź prosto."], ["The bank is opposite the school.", "Bank jest naprzeciwko szkoły."]],
    { intro: "Zgubiłeś się w mieście? Te zwroty pomogą Ci trafić na miejsce.", scene: [["⬅️", "**Turn left.**"], ["➡️", "**Turn right.**"], ["⬆️", "**Go straight on.**"]] }), [
    choice("Skręć w lewo:", "Turn left.", "Turn right.", "Go straight on."), choice("Idź prosto:", "Go straight on.", "Turn left.", "Stop."),
    choice("Co znaczy „Turn right”?", "Skręć w prawo.", "Skręć w lewo.", "Idź prosto."), choice("The bank is ___ the post office. (obok)", "next to", "under", "in"),
  ]),
  step("directions.2", "Pytamy o drogę", card(
    ["**Excuse me, where is the bank?** – Przepraszam, gdzie jest bank?", "**It's on the left.** – Jest po lewej stronie. **It's on the right.** – Jest po prawej stronie."],
    [["Excuse me, where is the bank?", "Przepraszam, gdzie jest bank?"], ["It's on the left.", "Jest po lewej stronie."]],
    { intro: "Zanim zapytasz o drogę, powiedz grzecznie Excuse me." }), [
    choice("Pytasz o drogę:", "Excuse me, where is the station?", "Excuse me, what time is it?", "Excuse me, how much is it?"),
    choice("Where is the post office? – ___", "It's on the left.", "It's five pounds.", "It's at seven."),
    ord("Excuse me, where is the bank?", "Przepraszam, gdzie jest bank?"), gap("Excuse me, ___ is the museum?", "where"),
  ]),
]);

unit("countability", 5, "🥛", "Policzalne i niepoliczalne", "much, many, a lot of", [
  step("countability.1", "much czy many?", card(
    ["**Policzalne** – można je policzyć na sztuki: one apple, two apples → **many**", "**Niepoliczalne** – nie liczymy ich na sztuki: milk, water, bread, money → **much**", "How **many** apples? – Ile jabłek? How **much** milk? – Ile mleka?"],
    [["How many apples are there?", "Ile jest jabłek?"], ["How much milk is there?", "Ile jest mleka?"]],
    { intro: "Jabłka policzysz: jedno, dwa, trzy. Mleka nie policzysz na sztuki – dlatego mówimy much!",
      scene: [["🍎🍎🍎", "**many** apples"], ["🥛", "**much** milk"]], mistake: ["How much apples?", "How many apples?"] }), [
    choice("Które słowo jest niepoliczalne?", "milk", "apple", "egg"), choice("How ___ apples are there?", "many", "much"),
    choice("How ___ milk is there?", "much", "many"), choice("There isn't ___ bread.", "much", "many"),
  ]),
  step("countability.2", "a lot of", card(
    ["**a lot of** – dużo. Pasuje do wszystkiego: a lot of books, a lot of water.", "W zdaniach twierdzących zwykle mówimy **a lot of**. **much / many** używamy głównie w pytaniach i przeczeniach."],
    [["We have a lot of friends.", "Mamy dużo przyjaciół."], ["I drink a lot of water.", "Piję dużo wody."]],
    { intro: "Nie wiesz, czy much, czy many? W zdaniu twierdzącym powiedz a lot of – zawsze pasuje!" }), [
    gap("We have a ___ of friends.", "lot"), gap("I drink a lot ___ water.", "of"),
    choice("There is a lot of ___ in the glass.", "water", "waters", "a water"), choice("How ___ money have you got?", "much", "many", "lot"),
  ]),
]);
