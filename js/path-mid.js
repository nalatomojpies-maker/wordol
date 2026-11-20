"use strict";

// ====================== GRADE 4 ======================
unit("tobe", 4, "🧍", "To be – być", "am / is / are w pełnej formie", [
  step("tobe.1", "Twierdzenia", card(
    ["**to be** (być) w czasie teraźniejszym zmienia się zależnie od osoby.", "Mówimy, kim ktoś jest, jaki jest, ile ma lat i gdzie jest."],
    [["I am eleven years old.", "Mam jedenaście lat."], ["She is my best friend.", "Ona jest moją najlepszą przyjaciółką."], ["We are in class four.", "Jesteśmy w czwartej klasie."]],
    { table: { head: ["Osoba", "Forma", "Skrót"], rows: [["I", "am", "I'm"], ["he / she / it", "is", "he's / she's / it's"], ["we / you / they", "are", "we're / you're / they're"]] } }), [
    choice("I ___ ten years old.", "am", "is", "are"), choice("She ___ my best friend.", "is", "am", "are"),
    choice("We ___ in class 4.", "are", "is", "am"), choice("My parents ___ at work.", "are", "is", "am"),
  ]),
  step("tobe.2", "Przeczenia", card(
    ["Do **to be** dodajemy **not**: I am **not**, he is**n't**, we are**n't**.", "isn't = is not, aren't = are not"],
    [["He isn't a doctor.", "On nie jest lekarzem."], ["They aren't at home.", "Oni nie są w domu."], ["I'm not hungry.", "Nie jestem głodny."]]), [
    gap("He ___ a doctor. (przeczenie)", "isn't/is not"), gap("They ___ at home. (przeczenie)", "aren't/are not"),
    gap("I ___ not hungry.", "am"), choice("It ___ a big dog. (przeczenie)", "isn't", "aren't", "am not"),
  ]),
  step("tobe.3", "Pytania", card(
    ["W pytaniu **to be** idzie na początek: **Are you** happy?", "Krótkie odpowiedzi: Yes, I am. / No, she isn't."],
    [["Are you hungry?", "Czy jesteś głodny?"], ["Is your brother a student?", "Czy twój brat jest uczniem?"], ["Yes, he is.", "Tak, jest."]]), [
    gap("___ you happy?", "Are"), choice("___ your brother at home?", "Is", "Are", "Am"),
    gap("___ it cold today?", "Is"), choice("Is she a nurse? Yes, she ___.", "is", "are", "am"),
  ]),
  step("tobe.4", "Sprawdź się", card(["Połącz wszystko, czego się nauczyłeś o **to be**."], [["My name is Anna.", "Mam na imię Anna."]]), [
    choice("Tom and Ann ___ cousins.", "are", "is", "am"), choice("The cat ___ under the table.", "is", "are", "am"),
    gap("We ___ not tired.", "are"), ord("Is your brother a student?", "Czy twój brat jest uczniem?"),
  ]),
]);

unit("havegot", 4, "🎒", "Have got – mieć", "have got / has got", [
  step("havegot.1", "Twierdzenia", card(
    ["Mówimy, **co ktoś ma** albo **jak wygląda**.", "**I / you / we / they have got**, ale **he / she / it has got**."],
    [["I have got a new bike.", "Mam nowy rower."], ["She has got long hair.", "Ona ma długie włosy."], ["They have got a big house.", "Oni mają duży dom."]],
    { table: { head: ["Osoba", "Forma", "Skrót"], rows: [["I / you / we / they", "have got", "'ve got"], ["he / she / it", "has got", "'s got"]] } }), [
    choice("I ___ got two brothers.", "have", "has", "am"), choice("She ___ got a new bike.", "has", "have", "is"),
    choice("They ___ got a big house.", "have", "has", "are"), gap("It ___ got four legs.", "has"),
  ]),
  step("havegot.2", "Przeczenia i pytania", card(
    ["Przeczenie: **haven't got / hasn't got**.", "Pytanie: **Have / Has** idzie na początek: **Has** he got a pen?", "Odpowiedzi: Yes, I have. / No, she hasn't."],
    [["We haven't got a dog.", "Nie mamy psa."], ["Has he got a sister?", "Czy on ma siostrę?"], ["Have you got a pencil?", "Czy masz ołówek?"]]), [
    gap("He ___ got a computer. (przeczenie)", "hasn't/has not"), choice("We ___ got a cat. (przeczenie)", "haven't", "hasn't", "aren't"),
    gap("___ you got a pen?", "Have"), choice("Has Tom got a ball? No, he ___.", "hasn't", "haven't", "isn't"),
  ]),
  step("havegot.3", "Sprawdź się", card(["Powtórka: have got / has got."], []), [
    gap("My parents ___ got a garden.", "have"), choice("___ she got a sister?", "Has", "Have", "Is"),
    choice("Have you got a dog? Yes, I ___.", "have", "has", "am"), ord("My cat has got green eyes.", "Mój kot ma zielone oczy."),
  ]),
]);

unit("can", 4, "💪", "Can – umieć, móc", "can / can't / Can I…?", [
  step("can.1", "Can i can't", card(
    ["**can** – umieć, móc. Dla wszystkich osób ta sama forma.", "Przeczenie: **can't** (cannot).", "Po **can** czasownik jest **bez to i bez -s**: She can swim."],
    [["I can swim very well.", "Potrafię bardzo dobrze pływać."], ["She can't ride a horse.", "Ona nie potrafi jeździć konno."], ["Birds can fly.", "Ptaki potrafią latać."]]), [
    choice("He can ___ the piano.", "play", "plays", "to play"), choice("My little brother ___ read yet.", "can't", "can", "cans"),
    gap("Penguins ___ fly. (przeczenie)", "can't/cannot"), choice("Birds can ___.", "fly", "flies", "to fly"),
  ]),
  step("can.2", "Pytania i prośby", card(
    ["Pytanie: **Can + osoba + czasownik?** Can you swim?", "**Can I…?** – prośba o zgodę: Can I open the window?"],
    [["Can you help me?", "Czy możesz mi pomóc?"], ["Can I open the window?", "Czy mogę otworzyć okno?"]]), [
    gap("___ you speak English?", "Can"), choice("Can she dance? Yes, she ___.", "can", "does", "is"),
    gap("___ I open the window?", "Can"), ord("Can you help me?", "Czy możesz mi pomóc?"),
  ]),
]);

unit("thereis", 4, "📍", "There is / There are", "Co gdzie jest", [
  step("thereis.1", "There is, there are", card(
    ["**There is** – dla jednej rzeczy i rzeczy niepoliczalnych (milk, water).", "**There are** – dla kilku rzeczy.", "**a** przed spółgłoską, **an** przed samogłoską."],
    [["There is a lamp in my room.", "W moim pokoju jest lampa."], ["There are two windows in the kitchen.", "W kuchni są dwa okna."]]), [
    choice("There ___ a cat on the sofa.", "is", "are"), choice("There ___ three books on the desk.", "are", "is"),
    gap("There ___ a boy in the garden.", "is"), choice("There is ___ apple on the table.", "an", "a", "some"),
  ]),
  step("thereis.2", "Przeczenia i pytania", card(
    ["Przeczenie: **There isn't / There aren't**.", "Pytanie: **Is there…? Are there…?**", "Odpowiedzi: Yes, there is. / No, there aren't."],
    [["Is there a park near your house?", "Czy w pobliżu twojego domu jest park?"], ["There aren't any chairs.", "Nie ma żadnych krzeseł."]]), [
    choice("There ___ any milk. (przeczenie)", "isn't", "aren't"), gap("___ there a park near your house?", "Is"),
    gap("___ there any eggs in the fridge?", "Are"), choice("Is there a TV in your room? Yes, there ___.", "is", "are", "has"),
  ]),
  step("thereis.3", "some i any", card(
    ["**some** – w zdaniach twierdzących: There are some apples.", "**any** – w przeczeniach i pytaniach: There aren't any apples. Are there any apples?"],
    [["Are there any apples?", "Czy są jakieś jabłka?"], ["There isn't any milk in the fridge.", "W lodówce nie ma mleka."]]), [
    choice("There are ___ apples on the table.", "some", "any"), choice("There aren't ___ chairs.", "any", "some", "a"),
    choice("Are there ___ biscuits?", "any", "some", "a"), gap("There isn't ___ juice.", "any"),
  ]),
]);

unit("possessives", 4, "🧑", "Moje, twoje, jego", "my, your, his, her… i 's", [
  step("possessives.1", "my, your, his, her", card(
    ["Pokazujemy, **do kogo coś należy**:", "Nie mylimy **his** (jego) i **her** (jej)."],
    [["My bag is red.", "Moja torba jest czerwona."], ["Her bag is blue.", "Jej torba jest niebieska."]],
    { table: { head: ["Osoba", "Czyj?"], rows: [["I", "my"], ["you", "your"], ["he", "his"], ["she", "her"], ["it", "its"], ["we", "our"], ["they", "their"]] } }), [
    choice("I have a dog. ___ dog is big.", "My", "Your", "His"), choice("She has a bag. ___ bag is red.", "Her", "His", "Their"),
    choice("He has a bike. ___ bike is new.", "His", "Her", "My"), choice("We have a house. ___ house is big.", "Our", "Their", "Your"),
  ]),
  step("possessives.2", "Dopełniacz 's", card(
    ["Dla osób dodajemy **'s**: Tom's book = książka Tomka.", "Pytanie: **Whose** pen is it? – Czyj to długopis?"],
    [["This is Tom's ball.", "To jest piłka Tomka."], ["Whose pen is it?", "Czyj to długopis?"]]), [
    choice("This is ___ bag. (Anna)", "Anna's", "Annas", "Anna"), choice("It is my ___ car. (brother)", "brother's", "brothers", "brother is"),
    gap("Whose ball is it? – It is Tom___ ball.", "'s"), choice("Whose pen is it? – It's the ___ pen.", "teacher's", "teachers", "teacher"),
  ]),
]);

unit("timeprep", 4, "🕒", "at, on, in w czasie", "O której? Którego dnia? Kiedy?", [
  step("timeprep.1", "at, on, in", card(
    ["**at** – godziny: at seven o'clock", "**on** – dni: on Monday, on Sundays", "**in** – miesiące, pory roku, lata, części dnia: in May, in summer, in 2024, in the morning"],
    [["I get up at seven.", "Wstaję o siódmej."], ["We have PE on Monday.", "W poniedziałek mamy WF."], ["My birthday is in May.", "Moje urodziny są w maju."]]), [
    choice("I get up ___ seven o'clock.", "at", "on", "in"), choice("We have PE ___ Monday.", "on", "at", "in"),
    choice("My birthday is ___ May.", "in", "on", "at"), choice("I play football ___ the afternoon.", "in", "on", "at"),
  ]),
  step("timeprep.2", "Sprawdź się", card(["Powtórka: at, on, in."], []), [
    choice("The film starts ___ 6 p.m.", "at", "on", "in"), choice("We go skiing ___ winter.", "in", "on", "at"),
    choice("She was born ___ 2014.", "in", "on", "at"), choice("They visit us ___ Sundays.", "on", "at", "in"),
  ]),
]);

unit("shopexpr", 4, "🛍️", "Na zakupach", "How much is it?", [
  step("shopexpr.1", "W sklepie", card(
    ["**Can I help you?** – Czym mogę służyć?", "**How much is it?** – Ile to kosztuje?", "**It's five pounds.** – To kosztuje pięć funtów.", "**Here you are.** – Proszę (gdy coś podajesz)."],
    [["How much is it?", "Ile to kosztuje?"], ["It's five pounds.", "To kosztuje pięć funtów."]]), [
    choice("Sprzedawca pyta: „Can I help you?”. Odpowiadasz:", "Yes, I'd like a banana, please.", "I'm fine.", "My name is Tom."),
    choice("Pytasz o cenę:", "How much is it?", "How old are you?", "What time is it?"),
    choice("How much is it? – ___", "It's five pounds.", "It's five o'clock.", "It's five years old."),
    choice("Podajesz coś komuś i mówisz:", "Here you are.", "Excuse me.", "Good night."),
  ]),
  step("shopexpr.2", "Grzeczne zwroty", card(
    ["**I'd like…** – chciałbym… (grzeczna prośba)", "**You're welcome.** – Proszę (odpowiedź na „Thank you”)."],
    [["I'd like a sandwich, please.", "Poproszę kanapkę."], ["You're welcome.", "Proszę bardzo."]]), [
    ord("Can I help you?", "Czy mogę pomóc?"), ord("I'd like a sandwich, please.", "Poproszę kanapkę."),
    gap("How ___ is it?", "much"), choice("Thank you! – ___", "You're welcome.", "Good night.", "I'm sorry."),
  ]),
]);

unit("clocktime", 4, "⏰", "Godziny", "o'clock, half past, quarter", [
  step("clocktime.1", "Pełne, wpół i kwadranse", card(
    ["**o'clock** – pełna godzina: 3:00 – three o'clock", "**half past** – po wpół: 3:30 – half past three", "**quarter past** – kwadrans po: 6:15", "**quarter to** – za kwadrans: 6:45 – quarter to seven"],
    [["It's half past three.", "Jest wpół do czwartej (3:30)."], ["It's quarter to seven.", "Jest za piętnaście siódma (6:45)."]]), [
    choice("3:00 – It's ___.", "three o'clock", "half past three", "quarter past three"), choice("3:30 – It's ___.", "half past three", "three o'clock", "half past four"),
    choice("6:15 – It's ___.", "quarter past six", "quarter to six", "half past six"), choice("6:45 – It's ___.", "quarter to seven", "quarter past seven", "quarter to six"),
  ]),
  step("clocktime.2", "Pytania o czas", card(
    ["**What time is it?** – Która godzina?", "**What time do you get up?** – O której wstajesz? – I get up at seven."],
    [["What time is it?", "Która jest godzina?"], ["I get up at seven.", "Wstaję o siódmej."]]), [
    choice("What time is it? – ___", "It's ten o'clock.", "I'm ten.", "It's Monday."), choice("What time do you get up? – ___", "I get up at seven.", "I'm seven.", "It's seven."),
    gap("What ___ is it?", "time"), choice("Co znaczy „half past two”?", "wpół do trzeciej (2:30)", "za piętnaście trzecia", "druga piętnaście"),
  ]),
]);

// ====================== GRADE 5 ======================
unit("presimple", 5, "🔁", "Present Simple", "Nawyki, zwyczaje, fakty", [
  step("presimple.1", "I / you / we / they", card(
    ["**Present Simple** – czas na nawyki, zwyczaje i fakty.", "Dla **I, you, we, they** używamy czasownika w formie podstawowej.", "Słowa-sygnały: always, usually, often, sometimes, never, every day."],
    [["I get up at seven o'clock.", "Wstaję o siódmej."], ["We have lunch at school.", "Jemy obiad w szkole."], ["They live in Warsaw.", "Oni mieszkają w Warszawie."]]), [
    choice("I ___ TV every evening.", "watch", "watches", "watching"), choice("We ___ breakfast at 7:30.", "have", "has", "having"),
    choice("They ___ in Warsaw.", "live", "lives", "living"), gap("You ___ (go) to school by bus.", "go"),
  ]),
  step("presimple.2", "he / she / it – końcówka -s", card(
    ["Dla **he, she, it** dodajemy **-s / -es** do czasownika.", "Po s, sh, ch, x, o: **-es** (watch → watches, go → goes).", "Spółgłoska + y: **y → ies** (study → studies). Wyjątek: have → **has**."],
    [["She plays tennis on Saturdays.", "Ona gra w tenisa w soboty."], ["My dad works in a bank.", "Mój tata pracuje w banku."]],
    { table: { head: ["Zasada", "Przykład"], rows: [["zwykle + s", "play → plays"], ["s, sh, ch, x, o + es", "watch → watches, go → goes"], ["spółgłoska + y → ies", "study → studies"], ["wyjątek", "have → has"]] } }), [
    choice("He ___ to school by bus.", "goes", "go", "going"), gap("She ___ (study) English on Mondays.", "studies"),
    gap("My dad ___ (watch) football on TV.", "watches"), gap("My cat never ___ (eat) fish.", "eats"),
  ]),
  step("presimple.3", "Przeczenia", card(
    ["Przeczenie: **don't** (I, you, we, they) i **doesn't** (he, she, it) + czasownik podstawowy.", "Uwaga: po **doesn't** czasownik **bez -s**: She doesn't like fish."],
    [["He doesn't like fish.", "On nie lubi ryb."], ["They don't watch TV in the morning.", "Oni nie oglądają telewizji rano."]]), [
    choice("They ___ like spiders.", "don't", "doesn't", "aren't"), choice("She doesn't ___ milk.", "drink", "drinks", "drinking"),
    gap("He ___ play the guitar. (przeczenie)", "doesn't/does not"), gap("We ___ have lunch at school. (przeczenie)", "don't/do not"),
  ]),
  step("presimple.4", "Pytania", card(
    ["Pytanie: **Do** + I/you/we/they…? i **Does** + he/she/it…?", "Czasownik po **do / does** jest w formie podstawowej: Does she play?", "Odpowiedzi: Yes, I do. / No, she doesn't."],
    [["Do you walk to school?", "Czy chodzisz do szkoły pieszo?"], ["Does she speak English?", "Czy ona mówi po angielsku?"]]), [
    gap("___ you like pizza?", "Do"), gap("___ Tom play the guitar?", "Does"),
    choice("Does she like pizza? Yes, she ___.", "does", "do", "is"), ord("Does she speak English?", "Czy ona mówi po angielsku?"),
  ]),
]);

unit("precont", 5, "▶️", "Present Continuous", "Co dzieje się teraz", [
  step("precont.1", "Twierdzenia", card(
    ["**Present Continuous** – to, co dzieje się **teraz**, w momencie mówienia.", "Budowa: **am / is / are + czasownik-ing**.", "Pisownia: make → making, run → running, write → writing."],
    [["I am reading a book now.", "Teraz czytam książkę."], ["He is playing football.", "On gra w piłkę."], ["We are having lunch at the moment.", "W tej chwili jemy obiad."]],
    { table: { head: ["Osoba", "Forma"], rows: [["I", "am playing"], ["he / she / it", "is playing"], ["we / you / they", "are playing"]] } }), [
    choice("Look! The baby ___.", "is sleeping", "sleeps", "sleep"), choice("We ___ English now.", "are learning", "learn", "learns"),
    gap("I ___ (write) a letter now.", "am writing"), gap("She ___ (run) in the park at the moment.", "is running"),
  ]),
  step("precont.2", "Przeczenia i pytania", card(
    ["Przeczenie: **am not / isn't / aren't + -ing**.", "Pytanie: **Am / Is / Are** + podmiot + -ing? Is she reading?", "Nie używamy -ing z czasownikami stanu (like, love, want, know)."],
    [["They aren't watching TV.", "Oni nie oglądają telewizji."], ["What are you doing?", "Co robisz?"], ["Is it raining?", "Czy pada deszcz?"]]), [
    choice("They ___ playing now. (przeczenie)", "aren't", "isn't", "don't"), gap("___ he watching TV?", "Is"),
    gap("What ___ you doing?", "are"), choice("I ___ my homework right now. (przeczenie)", "am not doing", "don't do", "not doing"),
  ]),
  step("precont.3", "Sprawdź się", card(["Powtórka: Present Continuous."], []), [
    choice("Listen! Mum ___ a song.", "is singing", "sings", "sing"), gap("The children ___ (swim) in the lake.", "are swimming"),
    choice("Are you listening? Yes, I ___.", "am", "do", "listen"), ord("What are you doing?", "Co robisz?"),
  ]),
]);

unit("simplevscont", 5, "⚖️", "Simple czy Continuous?", "Jak wybrać czas", [
  step("simplevscont.1", "Nawyk czy teraz?", card(
    ["Zadaj sobie pytanie: **czy to się dzieje regularnie, czy właśnie teraz?**", "Regularnie (always, usually, every day): **Present Simple**.", "Teraz (now, at the moment, Look!, Listen!): **Present Continuous**."],
    [["I play tennis every Sunday.", "Gram w tenisa w każdą niedzielę."], ["I am playing tennis now.", "Teraz gram w tenisa."]],
    { table: { head: ["", "Present Simple", "Present Continuous"], rows: [["Kiedy?", "zawsze, zwykle, co dzień", "teraz, w tej chwili"], ["Budowa", "play / plays", "am / is / are + playing"]] } }), [
    choice("Tom ___ football every Saturday.", "plays", "is playing"), choice("Tom ___ football now.", "is playing", "plays"),
    choice("She always ___ breakfast at home.", "has", "is having"), choice("Be quiet! The baby ___.", "is sleeping", "sleeps"),
  ]),
  step("simplevscont.2", "Sprawdź się", card(["Czasowniki stanu (like, love, want, know) zwykle w Present Simple."], []), [
    choice("We ___ to school on foot every day.", "go", "are going"), choice("Look! It ___.", "is raining", "rains"),
    choice("My mum ___ in a bank.", "works", "is working"), gap("Listen! Somebody ___ (knock) at the door.", "is knocking"),
  ]),
]);

unit("waswere", 5, "⏮️", "Was / Were", "Czas przeszły od „to be”", [
  step("waswere.1", "Twierdzenia", card(
    ["**was / were** to czas przeszły od **to be**: byłem, byłeś, była…", "**I, he, she, it → was**, **we, you, they → were**.", "Słowa-sygnały: yesterday, last night, last week, two days ago, in 2020."],
    [["I was at home yesterday.", "Wczoraj byłem w domu."], ["They were in London last year.", "Oni byli w Londynie w zeszłym roku."]]), [
    choice("I ___ at home yesterday.", "was", "were"), choice("They ___ in London last year.", "were", "was"),
    choice("She ___ happy.", "was", "were"), gap("We ___ at the cinema on Sunday.", "were"),
  ]),
  step("waswere.2", "Przeczenia", card(
    ["Przeczenia: **wasn't** (was not) i **weren't** (were not)."],
    [["She wasn't happy.", "Ona nie była szczęśliwa."], ["We weren't tired after the match.", "Nie byliśmy zmęczeni po meczu."]]), [
    choice("The shops ___ open yesterday.", "weren't", "wasn't", "aren't"), gap("He ___ tired after the game. (przeczenie)", "wasn't/was not"),
    choice("It ___ cold last night. (przeczenie)", "wasn't", "weren't", "isn't"), gap("They ___ at school yesterday. (przeczenie)", "weren't/were not"),
  ]),
  step("waswere.3", "Pytania", card(
    ["Pytanie: **Was / Were** na początku: Were you at home?", "Odpowiedzi: Yes, I was. / No, they weren't."],
    [["Were you at school on Monday?", "Czy byłeś w szkole w poniedziałek?"], ["Was the film interesting?", "Czy film był ciekawy?"]]), [
    gap("___ you at school yesterday?", "Were"), choice("___ Tom in the garden?", "Was", "Were"),
    choice("Was it a good film? Yes, it ___.", "was", "were", "is"), ord("Was the film interesting?", "Czy film był ciekawy?"),
  ]),
]);

unit("pastregular", 5, "📜", "Past Simple – regularne", "Czasowniki z końcówką -ed", [
  step("pastregular.1", "Twierdzenia (-ed)", card(
    ["**Past Simple** – zakończone czynności w przeszłości.", "Czasownik regularny + **-ed**: play → played, watch → watched.", "Kończy się na -e: + **d** (like → liked). Spółgłoska + y: **ied** (study → studied). Podwajamy: stop → stopped.", "Ta sama forma dla wszystkich osób."],
    [["I played football yesterday.", "Wczoraj grałem w piłkę."], ["We visited our grandma on Sunday.", "W niedzielę odwiedziliśmy babcię."]]), [
    choice("I ___ football yesterday.", "played", "play", "playing"), gap("She ___ (watch) a film last night.", "watched"),
    gap("We ___ (visit) our grandma last Sunday.", "visited"), gap("They ___ (study) for the test.", "studied"),
  ]),
  step("pastregular.2", "Przeczenia i pytania", card(
    ["Przeczenie: **didn't + czasownik podstawowy**: I didn't play.", "Pytanie: **Did + podmiot + czasownik podstawowy?** Did you play?", "Po **did / didn't** nie dodajemy -ed!"],
    [["He didn't open the window.", "On nie otworzył okna."], ["Did you help your mum?", "Czy pomogłeś mamie?"]]), [
    choice("He didn't ___ the window.", "open", "opened", "opens"), gap("___ you help your mum yesterday?", "Did"),
    choice("Did she call you? No, she ___.", "didn't", "wasn't", "doesn't"), gap("We didn't ___ the soup. (like)", "like"),
  ]),
  step("pastregular.3", "Sprawdź się", card(["Powtórka: Past Simple z czasownikami regularnymi."], []), [
    choice("I ___ my room two days ago.", "cleaned", "clean", "cleans"), gap("She ___ (stop) at the traffic lights.", "stopped"),
    choice("He ___ in Paris in 2019.", "lived", "live", "lives"), ord("Did you help your mum?", "Czy pomogłeś mamie?"),
  ]),
]);

unit("directions", 5, "🧭", "Jak dojść?", "Turn left, go straight on", [
  step("directions.1", "Left, right, straight", card(
    ["**Turn left.** – Skręć w lewo.", "**Turn right.** – Skręć w prawo.", "**Go straight on.** – Idź prosto.", "**next to** – obok, **opposite** – naprzeciwko"],
    [["Turn left.", "Skręć w lewo."], ["Go straight on.", "Idź prosto."]]), [
    choice("Skręć w lewo:", "Turn left.", "Turn right.", "Go straight on."), choice("Idź prosto:", "Go straight on.", "Turn left.", "Stop."),
    choice("Co znaczy „Turn right”?", "Skręć w prawo", "Skręć w lewo", "Idź prosto"), choice("The bank is ___ the post office. (obok)", "next to", "under", "in"),
  ]),
  step("directions.2", "Pytamy o drogę", card(
    ["**Excuse me, where is the bank?** – Przepraszam, gdzie jest bank?", "**It's on the left / on the right.** – To jest po lewej / po prawej."],
    [["Excuse me, where is the bank?", "Przepraszam, gdzie jest bank?"], ["It's on the left.", "To jest po lewej."]]), [
    choice("Pytasz o drogę:", "Excuse me, where is the station?", "Excuse me, what time is it?", "Excuse me, how much is it?"),
    choice("Where is the post office? – It's ___.", "on the left", "five pounds", "at seven"),
    ord("Excuse me, where is the bank?", "Przepraszam, gdzie jest bank?"), gap("Excuse me, ___ is the museum?", "where"),
  ]),
]);

unit("countability", 5, "🥛", "Policzalne i niepoliczalne", "much, many, a lot of", [
  step("countability.1", "much czy many?", card(
    ["**Policzalne** (można policzyć): apple – apples, book – books → **many**", "**Niepoliczalne** (nie liczymy na sztuki): milk, water, bread, money → **much**", "How **many** apples? How **much** milk?"],
    [["How many apples are there?", "Ile jest jabłek?"], ["How much milk is there?", "Ile jest mleka?"]]), [
    choice("Które słowo jest niepoliczalne?", "milk", "apple", "egg"), choice("How ___ apples are there?", "many", "much"),
    choice("How ___ milk is there?", "much", "many"), choice("There isn't ___ bread.", "much", "many"),
  ]),
  step("countability.2", "a lot of", card(
    ["**a lot of** – dużo (pasuje do policzalnych i niepoliczalnych): a lot of books, a lot of water.", "W zdaniach twierdzących zwykle mówimy **a lot of**. Słów **much / many** używamy głównie w pytaniach i przeczeniach."],
    [["We have a lot of friends.", "Mamy dużo przyjaciół."], ["I drink a lot of water.", "Piję dużo wody."]]), [
    gap("We have a ___ of friends.", "lot"), gap("I drink a lot ___ water.", "of"),
    choice("There is a lot of ___ in the glass.", "water", "waters", "a water"), choice("How ___ money have you got?", "much", "many", "lot"),
  ]),
]);
