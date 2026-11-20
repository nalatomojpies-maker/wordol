"use strict";

// ====================== GRADE 6 ======================
unit("pastirregular", 6, "🔀", "Past Simple – nieregularne", "go → went, see → saw", [
  step("pastirregular.1", "Formy nieregularne", card(
    ["Wiele ważnych czasowników **nie ma końcówki -ed** – ich formy trzeba zapamiętać.", "W zdaniu twierdzącym używamy drugiej formy: I **went** home."],
    [["I went to the cinema yesterday.", "Wczoraj poszedłem do kina."], ["She had pizza for dinner.", "Na kolację zjadła pizzę."], ["We saw a lion at the zoo.", "Widzieliśmy lwa w zoo."]],
    { table: { head: ["Podstawowa", "Past Simple", "Po polsku"], rows: [["go", "went", "iść"], ["have", "had", "mieć"], ["see", "saw", "widzieć"], ["eat", "ate", "jeść"], ["buy", "bought", "kupować"], ["make", "made", "robić"], ["take", "took", "brać"], ["come", "came", "przychodzić"], ["write", "wrote", "pisać"], ["drink", "drank", "pić"]] } }), [
    choice("Yesterday I ___ to the cinema.", "went", "go", "goed"), gap("She ___ (have) pizza for dinner.", "had"),
    gap("We ___ (see) a lion at the zoo.", "saw"), choice("He ___ a new bike last week.", "bought", "buyed", "buy"),
  ]),
  step("pastirregular.2", "Przeczenia i pytania", card(
    ["Przeczenia i pytania tworzymy jak zawsze: **did / didn't + czasownik podstawowy**.", "I didn't **go**. Did you **go**? (nie: didn't went)"],
    [["She didn't drink her milk.", "Ona nie wypiła swojego mleka."], ["Did you see the film?", "Czy widziałeś ten film?"]]), [
    choice("Did you ___ the film?", "see", "saw", "seen"), choice("She didn't ___ milk.", "drink", "drank", "drinks"),
    gap("___ he make a cake? No, he didn't.", "Did"), ord("Did you see the film?", "Czy widziałeś ten film?"),
  ]),
  step("pastirregular.3", "Więcej czasowników", card(["Ćwicz też w trybie **Czasowniki nieregularne**: sleep – slept, swim – swam, run – ran, meet – met, give – gave."],
    [["I wrote an email to my friend.", "Napisałem e-mail do przyjaciela."], ["They ate all the cake.", "Zjedli całe ciasto."]]), [
    gap("They ___ (eat) all the cake.", "ate"), gap("I ___ (write) an email yesterday.", "wrote"),
    gap("Tom ___ (swim) in the sea last summer.", "swam"), choice("We ___ home at 5 o'clock.", "came", "come", "comed"),
  ]),
]);

unit("will", 6, "🔮", "Future: will", "Przewidywania, obietnice, decyzje", [
  step("will.1", "Przewidywania", card(
    ["**will + czasownik podstawowy** – przyszłość: przewidywania, obietnice, decyzje w chwili mówienia.", "Dla wszystkich osób ta sama forma: I will, she will, they will.", "Słowa-sygnały: tomorrow, next week, soon, in 2030, I think, probably."],
    [["It will rain tomorrow.", "Jutro będzie padać."], ["I think she will win.", "Myślę, że ona wygra."], ["He will be twelve next month.", "On skończy dwanaście lat w przyszłym miesiącu."]]), [
    choice("It ___ rain tomorrow.", "will", "wills", "is"), gap("I think she ___ win the match.", "will"),
    choice("He will ___ 12 next month.", "be", "is", "am"), gap("Tomorrow we ___ (visit) our aunt.", "will visit"),
  ]),
  step("will.2", "Won't i pytania", card(
    ["Przeczenie: **won't** (will not).", "Pytanie: **Will + podmiot + czasownik?** Will you come?", "Odpowiedzi: Yes, I will. / No, I won't."],
    [["We won't go to school on Sunday.", "W niedzielę nie pójdziemy do szkoły."], ["Will you help me, please?", "Czy pomożesz mi, proszę?"]]), [
    choice("We ___ go to the cinema. (przeczenie)", "won't", "don't", "aren't"), gap("___ you help me, please?", "Will"),
    choice("Will they come? Yes, they ___.", "will", "do", "are"), gap("I ___ forget your birthday. (przeczenie)", "won't/will not"),
  ]),
  step("will.3", "Decyzje i obietnice", card(
    ["Gdy decydujemy **w chwili mówienia** albo coś obiecujemy – używamy **will**: It's hot. I will open the window."],
    [["I will open the window.", "Otworzę okno."], ["I won't forget your birthday.", "Nie zapomnę o twoich urodzinach."]]), [
    choice("It's hot. I ___ open the window.", "will", "am", "does"), choice("She ___ buy a new phone next week.", "will", "wills", "going"),
    ord("I will open the window.", "Otworzę okno."), ord("I won't forget your birthday.", "Nie zapomnę o twoich urodzinach."),
  ]),
]);

unit("goingto", 6, "🗓️", "Future: going to", "Plany i zamiary", [
  step("goingto.1", "Twierdzenia", card(
    ["**am / is / are going to + czasownik podstawowy** – plany i zamiary.", "Przewidywanie, gdy widzimy oznaki: Look at the clouds! It is going to rain.", "Słowa-sygnały: tonight, tomorrow, next week, this summer."],
    [["I am going to visit my grandma.", "Zamierzam odwiedzić babcię."], ["It is going to rain.", "Zaraz będzie padać."]]), [
    choice("I ___ visit my grandma tomorrow.", "am going to", "will going to", "go to"), choice("She ___ buy a present.", "is going to", "are going to", "going to"),
    gap("We ___ going to play football.", "are"), choice("Look at the clouds! It ___ rain.", "is going to", "will going to", "goes to"),
  ]),
  step("goingto.2", "Przeczenia i pytania", card(
    ["Przeczenie: **am not / isn't / aren't going to**.", "Pytanie: **Are you going to…?** Odpowiedź: Yes, I am. / No, I'm not."],
    [["They aren't going to go on holiday.", "Oni nie zamierzają jechać na wakacje."], ["Are you going to watch TV tonight?", "Czy zamierzasz oglądać telewizję dziś wieczorem?"]]), [
    choice("They ___ going to go on holiday. (przeczenie)", "aren't", "isn't", "don't"), gap("___ you going to watch TV tonight?", "Are"),
    gap("I am ___ going to cook dinner. (przeczenie)", "not"), choice("What are you going to ___?", "do", "doing", "did"),
  ]),
  step("goingto.3", "Will czy going to?", card(
    ["**going to** – wcześniej zaplanowane: I'm going to buy a bike (decyzja podjęta wcześniej).", "**will** – decyzja w chwili mówienia: The phone is ringing. I'll answer it."],
    [["He is going to be a doctor.", "On zamierza zostać lekarzem."], ["What are you going to do?", "Co zamierzasz zrobić?"]]), [
    choice("I've decided: I ___ buy a new bike.", "am going to", "will"), choice("The phone is ringing. – I ___ answer it.", "will", "am going to"),
    gap("My sister ___ going to be a doctor.", "is"), ord("What are you going to do?", "Co zamierzasz zrobić?"),
  ]),
]);

unit("comparatives", 6, "📈", "Stopniowanie przymiotników", "taller, the tallest, more interesting", [
  step("comparatives.1", "Krótkie przymiotniki", card(
    ["Stopień wyższy: **-er + than**: tall → taller than.", "Stopień najwyższy: **the + -est**: the tallest.", "Pisownia: nice → nicer (tylko -r), big → bigger (podwojenie), happy → happier (y → i)."],
    [["Summer is hotter than spring.", "Lato jest cieplejsze niż wiosna."], ["This is the happiest day of my life.", "To najszczęśliwszy dzień w moim życiu."]],
    { table: { head: ["Podstawowy", "Wyższy", "Najwyższy"], rows: [["tall", "taller", "the tallest"], ["nice", "nicer", "the nicest"], ["big", "bigger", "the biggest"], ["happy", "happier", "the happiest"]] } }), [
    choice("A cheetah is ___ than a horse.", "faster", "fast", "fastest"), choice("This is the ___ day of my life.", "happiest", "happy", "happier"),
    gap("My bag is ___ (heavy) than yours.", "heavier"), gap("Summer is ___ (hot) than spring.", "hotter"),
  ]),
  step("comparatives.2", "Długie przymiotniki", card(
    ["Dłuższe przymiotniki (3 sylaby i więcej): **more + przymiotnik** i **the most + przymiotnik**.", "beautiful → more beautiful → the most beautiful"],
    [["English is more interesting than maths.", "Angielski jest ciekawszy niż matematyka."], ["She is the most beautiful girl in our class.", "Ona jest najpiękniejszą dziewczyną w naszej klasie."]]), [
    choice("English is ___ interesting than maths.", "more", "most", "very"), choice("She is the ___ girl in our class.", "most beautiful", "more beautiful", "beautifuler"),
    choice("This film is ___ exciting than that one.", "more", "most", "much"), gap("It is the ___ (dangerous) animal here.", "most dangerous"),
  ]),
  step("comparatives.3", "Nieregularne", card(
    ["Nieregularne: **good → better → the best**, **bad → worse → the worst**.", "Po stopniu wyższym: **than** (niż)."],
    [["He is better than me at tennis.", "On jest lepszy ode mnie w tenisie."], ["Elephants are the biggest animals on land.", "Słonie są największymi zwierzętami lądowymi."]]), [
    gap("He is ___ (good) than me at tennis.", "better"), choice("The weather is ___ today than yesterday. (bad)", "worse", "worst", "badder"),
    gap("Elephants are the ___ (big) animals on land.", "biggest"), choice("My brother is ___ than me. (old)", "older", "oldest", "more old"),
  ]),
]);

unit("modals", 6, "🚦", "must, mustn't, should", "Obowiązek, zakaz, rada", [
  step("modals.1", "must i mustn't", card(
    ["**must** – musisz (obowiązek): You must wear a helmet.", "**mustn't** – nie wolno ci (zakaz): You mustn't run in the corridor.", "Po must / mustn't czasownik jest w formie podstawowej."],
    [["You must wear a helmet.", "Musisz nosić kask."], ["You mustn't run here.", "Nie wolno tu biegać."]]), [
    choice("You ___ wear a helmet. It's the rule.", "must", "mustn't", "can"), choice("You ___ run in the corridor. It's forbidden.", "mustn't", "must", "don't"),
    choice("Co znaczy „You mustn't run here”?", "Nie wolno tu biegać", "Nie musisz tu biegać", "Musisz tu biegać"), gap("You ___ be late for school. (zakaz)", "mustn't/must not"),
  ]),
  step("modals.2", "should", card(
    ["**should** – powinieneś (rada): You should drink more water.", "Przeczenie: **shouldn't** – nie powinieneś."],
    [["You should drink more water.", "Powinieneś pić więcej wody."], ["You shouldn't eat so many sweets.", "Nie powinieneś jeść tyle słodyczy."]]), [
    choice("I have a headache. – You ___ go to bed.", "should", "mustn't", "can't"), choice("You ___ eat so many sweets. It's not healthy.", "shouldn't", "should", "must"),
    choice("Co znaczy „You should study more”?", "Powinieneś więcej się uczyć", "Musisz się uczyć", "Nie wolno ci się uczyć"), gap("You ___ (not) watch TV all day.", "shouldn't/should not"),
  ]),
  step("modals.3", "mustn't czy don't have to?", card(
    ["**mustn't** – zakaz: You mustn't park here. (nie wolno)", "**don't have to** – nie musisz (nie ma obowiązku, ale wolno): You don't have to wear a uniform."],
    [["You don't have to come.", "Nie musisz przychodzić."], ["You mustn't smoke here.", "Nie wolno tu palić."]]), [
    choice("It's a holiday. You ___ go to school.", "don't have to", "mustn't", "shouldn't"), choice("It's dangerous! You ___ touch it.", "mustn't", "don't have to", "should"),
    choice("Co znaczy „You don't have to wait”?", "Nie musisz czekać", "Nie wolno czekać", "Powinieneś czekać"), choice("Students ___ cheat in the exam. (zakaz)", "mustn't", "don't have to", "should"),
  ]),
]);

unit("restaurant", 6, "🍽️", "W restauracji", "Ordering food", [
  step("restaurant.1", "Zamawiamy", card(
    ["**Can I have the menu, please?** – Poproszę kartę.", "**I'd like a pizza, please.** – Poproszę pizzę.", "**Can I have the bill, please?** – Poproszę rachunek."],
    [["Can I have the menu, please?", "Poproszę kartę dań."], ["I'd like a pizza, please.", "Poproszę pizzę."]], { emoji: "🍽️" }), [
    choice("Chcesz zobaczyć kartę dań. Mówisz:", "Can I have the menu, please?", "Can I have the bill, please?", "I'm full."),
    choice("Chcesz zapłacić. Mówisz:", "Can I have the bill, please?", "Can I have the menu, please?", "Good morning."),
    choice("Zamawiasz zupę:", "I'd like a soup, please.", "I am a soup.", "Soup is me, please."), ord("I'd like a pizza, please.", "Poproszę pizzę."),
  ]),
  step("restaurant.2", "Would you like…?", card(
    ["**Would you like a drink?** – Czy chciałbyś coś do picia?", "Odpowiedzi: **Yes, please.** / **No, thank you.**"],
    [["Would you like a drink?", "Czy chciałbyś coś do picia?"], ["No, thank you.", "Nie, dziękuję."]]), [
    choice("Would you like some tea? – ___", "Yes, please.", "Yes, I am.", "Yes, I'm tea."), choice("Would you like a dessert? (nie chcesz)", "No, thank you.", "No, please.", "Yes, I do."),
    choice("Co znaczy „Would you like…?”", "Czy chciałbyś…?", "Czy masz…?", "Czy lubisz…?"), gap("___ you like some juice?", "Would"),
  ]),
]);

unit("adverbs", 6, "🐢", "Przysłówki sposobu", "quickly, well, hard", [
  step("adverbs.1", "Końcówka -ly", card(
    ["Przysłówek mówi, **jak** ktoś coś robi. Zwykle: przymiotnik + **-ly**: quick → quickly, slow → slowly, careful → carefully.", "Przymiotnik opisuje rzeczownik: a **quick** boy. Przysłówek opisuje czasownik: He runs **quickly**."],
    [["She sings beautifully.", "Ona śpiewa pięknie."], ["He runs quickly.", "On biega szybko."]]), [
    choice("She sings ___. (beautiful)", "beautifully", "beautiful", "beauty"), choice("He runs ___. (quick)", "quickly", "quick", "quicker"),
    gap("Please speak ___. (slow)", "slowly"), gap("Drive ___. (careful)", "carefully"),
  ]),
  step("adverbs.2", "good – well, fast, hard", card(
    ["**good** (przymiotnik) → **well** (przysłówek): He is a good player. He plays well.", "**fast** i **hard** mają tę samą formę: a fast car – drives fast; a hard test – works hard."],
    [["He plays football well.", "On dobrze gra w piłkę."], ["She works hard.", "Ona ciężko pracuje."]]), [
    choice("He is a good singer. He sings ___.", "well", "good", "goodly"), choice("She is a fast runner. She runs ___.", "fast", "fastly", "quicklyer"),
    choice("They work ___. (ciężko)", "hard", "hardly", "harder"), gap("My sister speaks English very ___. (good)", "well"),
  ]),
]);

// ====================== GRADE 7 ======================
unit("presentperfect", 7, "✅", "Present Perfect", "have / has + trzecia forma", [
  step("presentperfect.1", "Trzecia forma czasownika", card(
    ["Czasowniki regularne: trzecia forma = **-ed** (play – played – played).", "Nieregularne trzeba zapamiętać: go – went – **gone**, see – saw – **seen**."],
    [["I have seen this film.", "Widziałem ten film."]],
    { table: { head: ["V1", "V2 (Past Simple)", "V3 (Past Participle)"], rows: [["go", "went", "gone"], ["see", "saw", "seen"], ["eat", "ate", "eaten"], ["write", "wrote", "written"], ["take", "took", "taken"], ["do", "did", "done"], ["make", "made", "made"], ["buy", "bought", "bought"], ["ride", "rode", "ridden"], ["have", "had", "had"]] } }), [
    gap("go – went – ___", "gone"), gap("see – saw – ___", "seen"), gap("write – wrote – ___", "written"), gap("make – made – ___", "made"),
  ]),
  step("presentperfect.2", "have / has + V3", card(
    ["**Present Perfect** łączy przeszłość z teraźniejszością: coś się wydarzyło i **ma znaczenie teraz** albo opowiada o doświadczeniu.", "Budowa: **have / has + trzecia forma**. Przeczenie: haven't / hasn't. Pytanie: Have you…? Has she…?", "Nie podajemy konkretnej daty (nie: yesterday)."],
    [["I have finished my homework.", "Skończyłem pracę domową."], ["She has visited London.", "Ona była w Londynie."]]), [
    choice("I ___ finished my homework.", "have", "has", "am"), choice("She ___ visited London.", "has", "have", "is"),
    choice("They have ___ their dinner. (eat)", "eaten", "ate", "eat"), gap("He has ___ (see) this film.", "seen"),
  ]),
  step("presentperfect.3", "ever i never", card(
    ["**ever** – kiedykolwiek (w pytaniach): Have you ever been to Spain?", "**never** – nigdy: I have never eaten sushi."],
    [["Have you ever been to London?", "Czy kiedykolwiek byłeś w Londynie?"], ["I have never eaten sushi.", "Nigdy nie jadłem sushi."]]), [
    choice("Have you ___ been to London?", "ever", "never", "already"), choice("I have ___ eaten sushi. (nigdy)", "never", "ever", "yet"),
    gap("Has she ___ been to Spain? (kiedykolwiek)", "ever"), choice("I've never ___ a horse.", "ridden", "rode", "ride"),
  ]),
  step("presentperfect.4", "just, already, yet", card(
    ["**just** – właśnie: I have just finished.", "**already** – już (w zdaniach twierdzących): She has already left.", "**yet** – jeszcze nie (w przeczeniach) i już (w pytaniach): I haven't called him yet."],
    [["She has already left.", "Ona już wyszła."], ["I haven't called him yet.", "Jeszcze do niego nie zadzwoniłem."]]), [
    choice("I have ___ finished. (właśnie)", "just", "yet", "ever"), choice("She has ___ left. (już)", "already", "yet", "ever"),
    choice("I haven't called him ___. (jeszcze nie)", "yet", "already", "just"), gap("They have ___ arrived. (właśnie)", "just"),
  ]),
  step("presentperfect.5", "for i since", card(
    ["**for** + okres: for two years, for three days.", "**since** + punkt w czasie: since 2020, since Monday, since I was five."],
    [["I have lived here since 2019.", "Mieszkam tu od 2019 roku."], ["She has been ill for three days.", "Ona choruje od trzech dni."]]), [
    choice("I have lived here ___ 2019.", "since", "for"), choice("She has been ill ___ three days.", "for", "since"),
    choice("We have known him ___ Monday.", "since", "for"), choice("He has played the guitar ___ five years.", "for", "since"),
  ]),
]);

unit("pastcont", 7, "⏳", "Past Continuous", "was / were + -ing", [
  step("pastcont.1", "Budowa", card(
    ["**Past Continuous** – czynność, która **trwała** w określonym momencie przeszłości: At 8 o'clock I was watching TV.", "Budowa: **was / were + czasownik-ing**. Przeczenie: wasn't / weren't."],
    [["At eight I was watching TV.", "O ósmej oglądałem telewizję."], ["They were playing football at four.", "O czwartej grali w piłkę."]]), [
    choice("At 8 o'clock I ___ TV.", "was watching", "watched", "am watching"), gap("They ___ (play) football at four.", "were playing"),
    choice("She ___ reading at nine.", "was", "were", "is"), gap("We ___ sleeping. (przeczenie)", "weren't/were not"),
  ]),
  step("pastcont.2", "when i while", card(
    ["Długa czynność (Past Continuous) i krótka, która jej przerwała (Past Simple):", "I **was cooking** when the phone **rang**. / While I **was cooking**, the phone **rang**."],
    [["I was watching TV when the phone rang.", "Oglądałem telewizję, gdy zadzwonił telefon."], ["While I was cooking, the phone rang.", "Gdy gotowałem, zadzwonił telefon."]]), [
    choice("I ___ TV when the phone rang.", "was watching", "watched", "watch"), choice("The phone ___ while I was cooking.", "rang", "was ringing", "rings"),
    choice("While she ___ , it started to rain. (walk)", "was walking", "walked", "walks"), choice("They ___ when the teacher came in. (talk)", "were talking", "talked", "talk"),
  ]),
  step("pastcont.3", "Pytania", card(
    ["Pytanie: **Was / Were + podmiot + -ing?** Were you sleeping? What were you doing?"],
    [["What were you doing yesterday?", "Co robiłeś wczoraj?"], ["Were you sleeping?", "Czy spałeś?"]]), [
    gap("___ you sleeping at 10?", "Were"), choice("What ___ you doing at 5?", "were", "was", "are"),
    choice("___ he playing when you came?", "Was", "Were", "Did"), ord("What were you doing yesterday?", "Co robiłeś wczoraj?"),
  ]),
]);

unit("conditionals", 7, "🔀", "Zdania warunkowe 0 i 1", "If it rains, I will stay at home", [
  step("conditionals.1", "Zero conditional", card(
    ["**Zero conditional** – prawdy ogólne i fakty: **If + Present Simple, Present Simple**.", "If you heat ice, it melts."],
    [["If you heat ice, it melts.", "Jeśli podgrzejesz lód, topnieje."], ["If I am tired, I go to bed early.", "Gdy jestem zmęczony, wcześnie idę spać."]]), [
    choice("If you heat ice, it ___.", "melts", "would melt", "melted"), choice("If it rains, the grass ___ wet.", "gets", "getting", "got"),
    gap("If I am tired, I ___ (go) to bed early.", "go"), choice("Water ___ if you heat it to 100 degrees.", "boils", "boiling", "boiled"),
  ]),
  step("conditionals.2", "First conditional", card(
    ["**First conditional** – realna możliwość w przyszłości: **If + Present Simple, will + czasownik**.", "W zdaniu z **if** nie używamy will!"],
    [["If it rains tomorrow, we will stay at home.", "Jeśli jutro będzie padać, zostaniemy w domu."], ["I will call you if I have time.", "Zadzwonię do ciebie, jeśli będę miał czas."]]), [
    choice("If it rains tomorrow, we ___ at home.", "will stay", "stay", "stayed"), choice("If you study hard, you ___ the test next week.", "will pass", "pass", "passed"),
    gap("If she ___ (come), I will be happy.", "comes"), choice("I will call you if I ___ time.", "have", "will have", "had"),
  ]),
  step("conditionals.3", "Przeczenia", card(
    ["Przeczenia: If you **don't** hurry, you **will** be late. / If he doesn't study, he **won't** pass."],
    [["If it rains, we will stay at home.", "Jeśli będzie padać, zostaniemy w domu."], ["If you don't hurry, you will be late.", "Jeśli się nie pospieszysz, spóźnisz się."]]), [
    choice("If you ___ hurry, you will be late.", "don't", "won't", "aren't"), gap("If he ___ (not) study, he won't pass.", "doesn't/does not"),
    ord("If it rains, we will stay at home.", "Jeśli będzie padać, zostaniemy w domu."), choice("Co znaczy „If I win, I will be happy”?", "Jeśli wygram, będę szczęśliwy", "Wygrałem, więc jestem szczęśliwy", "Gdybym wygrał, byłbym szczęśliwy"),
  ]),
]);

unit("usedto", 7, "📼", "Used to", "Co kiedyś było inaczej", [
  step("usedto.1", "I used to…", card(
    ["**used to + czasownik** – coś, co **kiedyś** robiliśmy regularnie, a teraz już nie.", "Ta sama forma dla wszystkich osób."],
    [["I used to play with toys.", "Kiedyś bawiłem się zabawkami."], ["She used to live in London.", "Kiedyś mieszkała w Londynie."]]), [
    choice("When I was little, I ___ play with toys.", "used to", "use to", "am used"), gap("She ___ to live in London. (kiedyś mieszkała)", "used"),
    choice("Co znaczy „I used to swim every day”?", "Kiedyś pływałem codziennie", "Pływam codziennie", "Będę pływał codziennie"), choice("We ___ to go to the beach every summer.", "used", "use", "uses"),
  ]),
  step("usedto.2", "Przeczenia i pytania", card(
    ["Przeczenie i pytanie z **did** – wtedy wraca **use to** (bez d): I **didn't use to** like fish. **Did** you **use to** play chess?"],
    [["I didn't use to like fish.", "Kiedyś nie lubiłem ryb."], ["Did you use to play chess?", "Czy kiedyś grałeś w szachy?"]]), [
    choice("Did you ___ play chess?", "use to", "used to", "using to"), gap("He didn't ___ to like carrots.", "use"),
    choice("I ___ like fish. (kiedyś nie lubiłem)", "didn't use to", "don't use to", "wasn't use to"), choice("Co znaczy „Did you use to play?”", "Czy kiedyś grałeś?", "Czy grasz teraz?", "Czy będziesz grał?"),
  ]),
]);

unit("relatives", 7, "🔗", "who, which, where, whose", "Zdania względne", [
  step("relatives.1", "who, which, that", card(
    ["**who** – o osobach: the boy who is sitting there", "**which** – o rzeczach i zwierzętach: the book which I like", "**that** – może zastąpić who lub which"],
    [["The boy who is sitting there is my brother.", "Chłopiec, który tam siedzi, to mój brat."], ["This is the book which I like.", "To jest książka, którą lubię."]]), [
    choice("The boy ___ is sitting there is my brother.", "who", "which", "where"), choice("This is the book ___ I like.", "which", "who", "where"),
    choice("A teacher is a person ___ works at school.", "who", "which", "where"), choice("The pizza ___ I ate was delicious.", "which", "who", "where"),
  ]),
  step("relatives.2", "where i whose", card(
    ["**where** – o miejscach: the town where I live", "**whose** – czyj: the girl whose bag is red"],
    [["This is the town where I live.", "To jest miasto, w którym mieszkam."], ["That is the girl whose bag is red.", "To jest dziewczyna, której torba jest czerwona."]]), [
    choice("This is the town ___ I live.", "where", "who", "which"), choice("That is the girl ___ bag is red.", "whose", "who", "which"),
    choice("The museum ___ we visited was huge.", "which", "where", "who"), choice("A library is a place ___ you borrow books.", "where", "who", "which"),
  ]),
]);

unit("opinions", 7, "💭", "Wyrażamy opinię", "I agree, I think…", [
  step("opinions.1", "Zgadzam się, nie zgadzam się", card(
    ["**I think…** – myślę, że…", "**In my opinion,…** – moim zdaniem…", "**I agree.** – zgadzam się. **I disagree.** – nie zgadzam się."],
    [["In my opinion, it is a good idea.", "Moim zdaniem to dobry pomysł."], ["I agree with you.", "Zgadzam się z tobą."]]), [
    choice("Chcesz powiedzieć „Zgadzam się”:", "I agree.", "I disagree.", "I don't know."), choice("Co znaczy „I disagree”?", "Nie zgadzam się", "Zgadzam się", "Nie wiem"),
    ord("In my opinion, it is a good idea.", "Moim zdaniem to dobry pomysł."), choice("Chcesz przedstawić swój pogląd. Mówisz:", "In my opinion…", "Thank you…", "Good night…"),
  ]),
  step("opinions.2", "To zależy…", card(
    ["**It depends.** – To zależy.", "**By the way,…** – À propos…", "**On the other hand,…** – Z drugiej strony…"],
    [["It depends on the weather.", "To zależy od pogody."], ["On the other hand, it is expensive.", "Z drugiej strony, jest drogie."]]), [
    choice("Co znaczy „It depends”?", "To zależy", "To jest drogie", "To nieważne"), choice("Co znaczy „on the other hand”?", "z drugiej strony", "na pierwszym miejscu", "przy okazji"),
    choice("Nie jesteś pewien, odpowiadasz:", "It depends.", "Good night.", "I'm fine."), choice("Chcesz zmienić temat. Mówisz:", "By the way,…", "On the other hand,…", "In conclusion,…"),
  ]),
]);

unit("invitations", 7, "📞", "Zaproszenia i telefon", "Would you like to come?", [
  step("invitations.1", "Zapraszamy", card(
    ["**Would you like to come to my party?** – Czy chciałbyś przyjść na moją imprezę?", "Przyjęcie: **Yes, I'd love to.** – Chętnie. Odmowa: **Sorry, I can't.** – Przykro mi, nie mogę."],
    [["Would you like to come to my party?", "Czy chciałbyś przyjść na moją imprezę?"], ["Yes, I'd love to.", "Tak, chętnie."]]), [
    choice("Ktoś Cię zaprasza. Chcesz przyjść. Mówisz:", "Yes, I'd love to.", "Sorry, I can't.", "Good night."), choice("Nie możesz przyjść. Mówisz:", "Sorry, I can't.", "Yes, I'd love to.", "You're welcome."),
    choice("Co znaczy „I'd love to”?", "Chętnie", "Nie chcę", "Nie wiem"), ord("Would you like to come?", "Czy chciałbyś przyjść?"),
  ]),
  step("invitations.2", "Rozmowa telefoniczna", card(
    ["**Hello, this is Anna.** – Cześć, tu Anna.", "**Can I speak to Tom, please?** – Czy mogę prosić Tomka?", "**Hold on, please.** – Proszę poczekać.", "**Can I take a message?** – Czy mogę przekazać wiadomość?"],
    [["Can I speak to Tom, please?", "Czy mogę prosić Tomka?"], ["Hold on, please.", "Proszę poczekać."]]), [
    choice("Dzwonisz i prosisz Toma do telefonu:", "Can I speak to Tom, please?", "Can I have the bill?", "Where is Tom?"), choice("Co znaczy „Hold on, please”?", "Proszę poczekać", "Proszę zadzwonić jutro", "Przepraszam, pomyłka"),
    choice("Przedstawiasz się przez telefon:", "Hello, this is Anna.", "Hello, I am telephone.", "Good night, Anna."), choice("Co znaczy „Can I take a message?”", "Czy mogę przekazać wiadomość?", "Czy mogę usiąść?", "Czy mogę wyjść?"),
  ]),
]);

// ====================== GRADE 8 ======================
unit("conditional2", 8, "🌈", "Second conditional", "If I were rich, I would…", [
  step("conditional2.1", "Sytuacje nierealne", card(
    ["**Second conditional** – sytuacje nierealne lub mało prawdopodobne w teraźniejszości: **If + Past Simple, would + czasownik**.", "Z **I / he / she / it** w części z if często używamy **were**: If I were rich…"],
    [["If I were rich, I would buy a boat.", "Gdybym był bogaty, kupiłbym łódź."], ["If she had more time, she would learn French.", "Gdyby miała więcej czasu, uczyłaby się francuskiego."]]), [
    choice("If I ___ rich, I would buy a boat.", "were", "am", "will be"), choice("If she ___ more time, she would learn French.", "had", "has", "would have"),
    choice("If I won, I ___ happy.", "would be", "will be", "am"), gap("If I ___ (be) you, I would study.", "were"),
  ]),
  step("conditional2.2", "Pytania i przeczenia", card(
    ["Pytanie: **What would you do if…?** Przeczenie: **wouldn't**.", "W części z if – Past Simple, nie would!"],
    [["What would you do if you saw a ghost?", "Co byś zrobił, gdybyś zobaczył ducha?"], ["I wouldn't go if I were you.", "Nie poszedłbym na twoim miejscu."]]), [
    choice("What ___ you do if you saw a ghost?", "would", "will", "did"), choice("If it ___ sunny, we would go out.", "were", "is", "will be"),
    gap("I ___ go if I were you. (przeczenie)", "wouldn't/would not"), ord("What would you do?", "Co byś zrobił?"),
  ]),
  step("conditional2.3", "Pierwszy czy drugi?", card(
    ["**First:** realne – If it rains tomorrow, I **will** stay at home.", "**Second:** nierealne / mało prawdopodobne – If I **were** a bird, I **would** fly."],
    [["If I were a bird, I would fly.", "Gdybym był ptakiem, latałbym."]]), [
    choice("If it rains tomorrow, I ___ at home. (realna możliwość)", "will stay", "would stay"), choice("If I were a bird, I ___ fly. (nierealne)", "would", "will"),
    choice("If I ___ the lottery, I would travel the world.", "won", "win", "will win"), choice("If he ___ hard, he will pass. (realne)", "works", "worked", "would work"),
  ]),
]);

unit("passive", 8, "🔄", "Strona bierna", "English is spoken here", [
  step("passive.1", "Present Simple Passive", card(
    ["**Strona bierna** – ważne jest, **co się dzieje z czymś**, a nie kto to robi.", "Budowa: **am / is / are + trzecia forma (V3)**.", "English is spoken in many countries."],
    [["English is spoken all over the world.", "Po angielsku mówi się na całym świecie."], ["These cars are made in Germany.", "Te samochody są produkowane w Niemczech."]]), [
    choice("English ___ in many countries.", "is spoken", "speaks", "spoke"), choice("These cars ___ in Germany.", "are made", "is made", "make"),
    gap("Milk ___ (sell) in shops.", "is sold"), choice("Cheese ___ from milk.", "is made", "makes", "made"),
  ]),
  step("passive.2", "Past Simple Passive", card(
    ["Budowa: **was / were + trzecia forma (V3)**.", "The window was broken yesterday. The pyramids were built thousands of years ago."],
    [["The pyramids were built thousands of years ago.", "Piramidy zbudowano tysiące lat temu."], ["America was discovered in 1492.", "Amerykę odkryto w 1492 roku."]]), [
    choice("The window ___ yesterday.", "was broken", "broke", "is broken"), choice("The letters ___ last week.", "were sent", "was sent", "sent"),
    gap("America ___ (discover) in 1492.", "was discovered"), choice("The pyramids ___ thousands of years ago.", "were built", "was built", "built"),
  ]),
  step("passive.3", "Przeczenia i pytania", card(
    ["Przeczenie: **isn't / aren't / wasn't / weren't + V3**.", "Pytanie: **Is / Are / Was / Were + podmiot + V3?** Was the book written by Tom?"],
    [["Was the book written by Tom?", "Czy książkę napisał Tom?"], ["These shoes aren't made in Italy.", "Te buty nie są produkowane we Włoszech."]]), [
    choice("The cake ___ eaten yesterday. (nie zjedzono)", "wasn't", "isn't", "didn't"), gap("___ the book written by Tom?", "Was"),
    choice("Where ___ this phone made?", "is", "does", "has"), choice("These shoes ___ made in Italy. (nie są)", "aren't", "isn't", "don't"),
  ]),
  step("passive.4", "by + wykonawca", card(
    ["Wykonawcę czynności (jeśli jest ważny) podajemy z **by**: The picture was painted **by** Picasso.", "Zdanie czynne → bierne: Tom broke the window. → The window was broken by Tom."],
    [["The picture was painted by Picasso.", "Obraz został namalowany przez Picassa."]]), [
    choice("The Mona Lisa was painted ___ Leonardo.", "by", "from", "with"), ord("The picture was painted by Picasso.", "Obraz został namalowany przez Picassa."),
    choice("Tom broke the window. → The window ___ by Tom.", "was broken", "broke", "is broken"), choice("They built this house in 1990. → This house ___ in 1990.", "was built", "were built", "built"),
  ]),
]);

unit("reported", 8, "🗣️", "Mowa zależna", "He said that…", [
  step("reported.1", "Zdania oznajmujące", card(
    ["Gdy relacjonujemy, co ktoś powiedział, czas „cofamy” o krok: **Present Simple → Past Simple**, **am / is / are → was / were**, **will → would**.", "Używamy **said (that)…**"],
    [["Tom said he liked pizza.", "Tomek powiedział, że lubi pizzę."], ["They said they were tired.", "Powiedzieli, że są zmęczeni."]]), [
    choice("„I like pizza,” said Tom. → Tom said he ___ pizza.", "liked", "likes", "like"), choice("„We are tired,” they said. → They said they ___ tired.", "were", "are", "was"),
    choice("„I will help you,” she said. → She said she ___ help me.", "would", "will", "did"), gap("„I live in Paris,” he said. → He said he ___ in Paris.", "lived"),
  ]),
  step("reported.2", "Zaimki i okoliczności", card(
    ["Zmieniają się też zaimki i okoliczności: **now → then**, **today → that day**, **tomorrow → the next day**, **here → there**, **my → his / her**."],
    [["She said she was busy then.", "Powiedziała, że jest wtedy zajęta."], ["He said he would come the next day.", "Powiedział, że przyjdzie następnego dnia."]]), [
    choice("„I'm busy now,” she said. → She said she was busy ___.", "then", "now", "today"), choice("„I'll come tomorrow,” he said. → He said he would come ___.", "the next day", "tomorrow", "yesterday"),
    choice("„I love my dog,” said Ann. → Ann said she loved ___ dog.", "her", "my", "his"), choice("„We are here,” they said. → They said they were ___.", "there", "here", "where"),
  ]),
  step("reported.3", "Pytania i polecenia", card(
    ["Pytanie z what/where/why: **He asked where I lived.** (szyk jak w zdaniu oznajmującym, bez do/does)", "Pytanie tak/nie: **She asked if I liked tea.**", "Polecenie: **Mum told me to close the door.**"],
    [["He asked where I lived.", "Zapytał, gdzie mieszkam."], ["She asked if I liked tea.", "Zapytała, czy lubię herbatę."]]), [
    choice("„Where do you live?” → He asked me where I ___.", "lived", "live", "do live"), choice("„Do you like tea?” → She asked me ___ I liked tea.", "if", "that", "what"),
    choice("„Close the door,” said Mum. → Mum told me ___ the door.", "to close", "closing", "close"), choice("„Are you tired?” → He asked if I ___ tired.", "was", "am", "were"),
  ]),
]);

unit("ppvsps", 8, "⚔️", "Present Perfect czy Past Simple?", "Doświadczenie czy konkretny czas", [
  step("ppvsps.1", "Jak wybrać?", card(
    ["**Past Simple** – czynność zakończona w **konkretnym czasie** (yesterday, in 2019, last week, two days ago).", "**Present Perfect** – czas nieokreślony lub trwający do teraz (ever, never, just, already, yet, for, since)."],
    [["I went to London last year.", "Byłem w Londynie w zeszłym roku."], ["I have been to London.", "Byłem w Londynie (kiedykolwiek)."]]), [
    choice("I ___ to London last year.", "went", "have been"), choice("I ___ him yesterday.", "saw", "have seen"),
    choice("Have you ever ___ sushi?", "eaten", "ate", "eat"), choice("We ___ our homework two hours ago.", "finished", "have finished"),
  ]),
  step("ppvsps.2", "Sprawdź się", card(["Pytanie z **When…?** (o konkretny czas) zawsze w Past Simple: When did you visit Rome?"], [["When did you visit Rome?", "Kiedy odwiedziłeś Rzym?"]]), [
    choice("When ___ you visit Rome?", "did", "have", "do"), choice("They ___ just arrived.", "have", "did", "are"),
    choice("She has lived here ___ 2018.", "since", "for", "ago"), choice("I ___ never seen snow.", "have", "did", "was"),
  ]),
]);

unit("deduction", 8, "🕵️", "must, can't, might", "Przypuszczenia", [
  step("deduction.1", "Jak bardzo jesteś pewien?", card(
    ["**must be** – na pewno tak jest (jestem prawie pewien).", "**can't be** – na pewno tak nie jest.", "**might / may / could be** – możliwe (nie jestem pewien)."],
    [["He must be tired.", "On musi być zmęczony."], ["She can't be at home.", "Na pewno nie ma jej w domu."], ["It might rain later.", "Może później padać."]]), [
    choice("He has been running all day. He ___ be tired.", "must", "can't", "might not"), choice("She's in Paris. She ___ be at home.", "can't", "must", "might"),
    choice("I'm not sure, but it ___ rain later.", "might", "must", "can't"), choice("The phone is ringing. It ___ be Tom. (nie jestem pewien)", "might", "must", "can't"),
  ]),
  step("deduction.2", "Sprawdź się", card(["Powtórka: must be / can't be / might be."], [["It can't be true.", "To nie może być prawda."]]), [
    choice("He is wearing a uniform. He ___ be a pilot. (jestem prawie pewien)", "must", "can't", "mustn't"), choice("That ___ be true! It's impossible.", "can't", "must", "might"),
    choice("Ann isn't here. She ___ be ill. (to możliwe)", "might", "must", "can't"), gap("It's very quiet. They ___ be asleep. (na pewno)", "must"),
  ]),
]);

unit("articles", 8, "📰", "Przedimki a, an, the", "Kiedy a, kiedy the, kiedy nic", [
  step("articles.1", "a / an czy the?", card(
    ["**a / an** – pierwsze wspomnienie lub „jakiś”: I saw a dog.", "**the** – coś znanego lub jedyne w swoim rodzaju: The dog was big. The sun, the Moon.", "**an** przed samogłoską: an engineer."],
    [["I saw a dog. The dog was big.", "Widziałem psa. Pies był duży."]]), [
    choice("Look at ___ sun!", "the", "a", "an"), choice("She is ___ engineer.", "an", "a", "the"),
    choice("I saw a dog. ___ dog was big.", "The", "A", "An"), choice("___ Moon goes round the Earth.", "The", "A", "(nic)"),
  ]),
  step("articles.2", "Bez przedimka", card(
    ["Bez przedimka: ogólne rzeczowniki w liczbie mnogiej (I like cats), posiłki (have breakfast), języki (speak English), dyscypliny sportu (play football)."],
    [["I have breakfast at seven.", "Jem śniadanie o siódmej."], ["I like pizza.", "Lubię pizzę."]]), [
    choice("I have ___ breakfast at 7.", "(nic)", "a", "the"), choice("I like ___ pizza. (ogólnie)", "(nic)", "a", "the"),
    choice("She plays ___ tennis every day.", "(nic)", "the", "a"), choice("He speaks ___ English very well.", "(nic)", "the", "an"),
  ]),
]);

unit("linking", 8, "🧵", "Łączymy zdania", "because, so, but, although, however", [
  step("linking.1", "because, so, but", card(
    ["**because** – ponieważ (podaje przyczynę): I stayed at home because it was raining.", "**so** – więc (podaje skutek): It was raining, so I stayed at home.", "**but** – ale"],
    [["I stayed at home because it was raining.", "Zostałem w domu, bo padało."], ["It was raining, so I stayed at home.", "Padało, więc zostałem w domu."]]), [
    choice("I stayed at home ___ it was raining.", "because", "so", "but"), choice("It was raining, ___ I stayed at home.", "so", "because", "although"),
    choice("I like tea, ___ I don't like coffee.", "but", "because", "so"), choice("She was tired ___ she went to bed early.", "so", "because", "but"),
  ]),
  step("linking.2", "although i however", card(
    ["**although** – chociaż (w środku lub na początku zdania): Although it was cold, we went swimming.", "**however** – jednak (na początku nowego zdania, po przecinku): I like pizza. However, I don't like cheese."],
    [["Although it was cold, we went swimming.", "Chociaż było zimno, poszliśmy pływać."]]), [
    choice("___ it was cold, we went swimming.", "Although", "Because", "So"), choice("I like pizza. ___, I don't like cheese.", "However", "Because", "So"),
    choice("He went to school ___ he was ill.", "although", "because", "so"), choice("Co znaczy „however”?", "jednak", "ponieważ", "więc"),
  ]),
]);
