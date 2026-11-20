"use strict";

/**
 * LEARNING PATH – units made of small steps. Every step = one explanation card + confirming exercises.
 * A step is passed with ~70% correct answers and unlocks the next step in the unit.
 *
 * Exercise kinds:
 *  choice – q (with ___ or a question), o (options incl. answer), a
 *  gap    – q (with ___), a (variants separated by "/")
 *  order  – build a sentence from words (en, pl)
 *  pic    – hear the word, tap the right picture (topic, a, pool)       [grades 0]
 *  see    – see the picture, choose the written word (topic, a, pool)   [grade 1+]
 *  tr     – English word -> choose the Polish meaning (a = built-in English word, pool)
 *
 * Card fields (all optional except lines/examples):
 *  intro    – Rychu's one-sentence explanation in child language
 *  when     – "Kiedy tego używamy?" box
 *  timeline – list of time-line pictures (habit, now, past, pastlong, future, plan, perfect, since, usedto, unreal)
 *  scene    – picture tiles [emoji, caption]; illus – named SVG illustration (see learn.js)
 *  pattern  – sentence building blocks made with pat()
 *  signals  – signal words; mistake – [wrong, right, why]
 * Text supports **bold**.
 */
const PATH_UNITS = [];

const choice = (q, answer, ...wrong) => ({ t: "choice", q, o: [answer, ...wrong], a: answer });
const gap = (q, answer) => ({ t: "gap", q, a: answer });
const ord = (en, pl) => ({ t: "order", en, pl });
const card = (lines, examples = [], extra = {}) => ({ lines, examples, ...extra });
const step = (id, title, cardData, exercises) => ({ id, title, card: cardData, exercises });
const unit = (id, grade, icon, title, summary, steps) => PATH_UNITS.push({ id, grade, icon, title, summary, steps });
/** One row of sentence blocks: pat("➕", "S:She", "V:plays", "R:tennis.") – role letter before the colon. */
const pat = (label, ...parts) => ({ label, parts: parts.map((part) => [part[0], part.slice(2)]) });

/** Vocabulary step: a picture card, then one exercise per word (kind = "pic" | "see" | "tr"). */
const vocabStep = (id, title, topic, words, kind) =>
  step(id, title, { lines: [], examples: [], vocab: { topic, words } }, words.map((word) => ({ t: kind, topic, a: word, pool: words })));

// ====================== GRADE 0 – only pictures and sound ======================
unit("g0-hello", 0, "👋", "Hello!", "Pierwsze słowa", [
  vocabStep("g0-hello.1", "Hello, yes, no", "phrases", ["hello", "yes", "no", "thank you"], "pic"),
]);
unit("g0-colours", 0, "🎨", "Kolory", "Red, blue, green…", [
  vocabStep("g0-colours.1", "Red, blue, green, yellow", "colours", ["red", "blue", "green", "yellow"], "pic"),
  vocabStep("g0-colours.2", "Orange, purple, black, white", "colours", ["orange", "purple", "black", "white"], "pic"),
]);
unit("g0-numbers", 0, "🔢", "Liczby 1–5", "One, two, three…", [
  vocabStep("g0-numbers.1", "One to five", "numbers", ["one", "two", "three", "four", "five"], "pic"),
]);
unit("g0-animals", 0, "🐶", "Zwierzęta", "Cat, dog, bird…", [
  vocabStep("g0-animals.1", "Cat, dog, bird, fish", "animals", ["cat", "dog", "bird", "fish"], "pic"),
  vocabStep("g0-animals.2", "Rabbit, duck, cow, pig", "animals", ["rabbit", "duck", "cow", "pig"], "pic"),
]);
unit("g0-me", 0, "🧒", "Rodzina i ciało", "Mum, dad, eye, nose…", [
  vocabStep("g0-me.1", "Mum, dad, baby", "family", ["mum", "dad", "baby"], "pic"),
  vocabStep("g0-me.2", "Eye, nose, mouth, ear, hand", "body", ["eye", "nose", "mouth", "ear", "hand"], "pic"),
]);
unit("g0-food", 0, "🍎", "Jedzenie", "Milk, bread, apple…", [
  vocabStep("g0-food.1", "Milk, bread, egg, water", "food", ["milk", "bread", "egg", "water"], "pic"),
  vocabStep("g0-food.2", "Apple, banana, cake, ice cream", "food", ["apple", "banana", "cake", "ice cream"], "pic"),
]);
unit("g0-toys", 0, "🧸", "Zabawki", "Ball, teddy bear, kite…", [
  vocabStep("g0-toys.1", "Ball, teddy bear, kite, balloon", "toys", ["ball", "teddy bear", "kite", "balloon"], "pic"),
]);

// ====================== GRADE 1 – first reading of short words ======================
unit("g1-numbers", 1, "🔢", "Liczby 6–10", "Six, seven, eight…", [
  vocabStep("g1-numbers.1", "Six to ten", "numbers", ["six", "seven", "eight", "nine", "ten"], "see"),
]);
unit("g1-colours", 1, "🎨", "Kolory – czytamy", "Black, white, pink, brown", [
  vocabStep("g1-colours.1", "Black, white, pink, brown", "colours", ["black", "white", "pink", "brown"], "see"),
]);
unit("g1-classroom", 1, "✏️", "W klasie", "Book, pen, pencil, ruler…", [
  vocabStep("g1-classroom.1", "Book, pen, pencil, ruler", "school", ["book", "pen", "pencil", "ruler"], "see"),
  vocabStep("g1-classroom.2", "Crayon, paper, teacher, pupil", "school", ["crayon", "paper", "teacher", "pupil"], "see"),
]);
unit("g1-animals", 1, "🦁", "Więcej zwierząt", "Horse, sheep, lion…", [
  vocabStep("g1-animals.1", "Horse, sheep, hen, mouse", "animals", ["horse", "sheep", "hen", "mouse"], "see"),
  vocabStep("g1-animals.2", "Frog, lion, elephant, monkey", "animals", ["frog", "lion", "elephant", "monkey"], "see"),
]);
unit("g1-family", 1, "👨‍👩‍👧", "Rodzina", "Mum, dad, grandma, grandpa", [
  vocabStep("g1-family.1", "Mum, dad, grandma, grandpa, baby", "family", ["mum", "dad", "grandma", "grandpa", "baby"], "see"),
]);
unit("g1-body", 1, "🖐️", "Ciało", "Face, hair, arm, leg…", [
  vocabStep("g1-body.1", "Face, hair, arm, leg", "body", ["face", "hair", "arm", "leg"], "see"),
  vocabStep("g1-body.2", "Foot, finger, hand, eye", "body", ["foot", "finger", "hand", "eye"], "see"),
]);
unit("g1-food", 1, "🍕", "Smaczne słowa", "Pizza, juice, orange…", [
  vocabStep("g1-food.1", "Pizza, chocolate, cheese, juice", "food", ["pizza", "chocolate", "cheese", "juice"], "see"),
  vocabStep("g1-food.2", "Orange, strawberry, grapes, apple", "fruit", ["orange", "strawberry", "grapes", "apple"], "see"),
]);
unit("g1-clothes", 1, "👕", "Ubrania", "Hat, shoes, socks, T-shirt", [
  vocabStep("g1-clothes.1", "Hat, shoes, socks, T-shirt", "clothes", ["hat", "shoes", "socks", "T-shirt"], "see"),
]);
unit("g1-hi", 1, "💬", "Hello! – zwroty", "Powitania i grzeczne słowa", [
  step("g1-hi.1", "Hello i goodbye", card(
    ["**Hello!** albo **Hi!** – cześć (gdy się spotykamy)", "**Goodbye!** albo **Bye!** – do widzenia, pa (gdy wychodzimy)"],
    [["Hello!", "Cześć!"], ["Hi, Tom!", "Cześć, Tomku!"], ["Goodbye!", "Do widzenia!"]],
    { intro: "Gdy kogoś spotykasz, mówisz Hello. Gdy wychodzisz, mówisz Goodbye. Proste!", scene: [["👋🙂", "**Hello!** – na powitanie"], ["🙂👋🚪", "**Goodbye!** – na pożegnanie"]] }), [
    choice("Spotykasz kolegę rano. Co mówisz?", "Hello!", "Goodbye!", "Sorry!"),
    choice("Wychodzisz ze szkoły. Co mówisz?", "Goodbye!", "Hello!", "Please!"),
    choice("Co znaczy „Hi!”?", "Cześć!", "Dziękuję!", "Do widzenia!"),
    choice("Co znaczy „Bye!”?", "Pa! / Do widzenia!", "Dziękuję!", "Przepraszam!"),
  ]),
  step("g1-hi.2", "Please, thank you, sorry", card(
    ["**please** – proszę (gdy o coś prosisz)", "**Thank you!** – dziękuję", "**Sorry!** – przepraszam (gdy zrobisz coś niechcący)"],
    [["Water, please.", "Poproszę wodę."], ["Thank you!", "Dziękuję!"], ["Sorry!", "Przepraszam!"]],
    { intro: "To są czarodziejskie słowa – dzięki nim każdy chętnie Ci pomoże!", scene: [["🙏", "**please** – proszę"], ["🎁😊", "**Thank you!** – dziękuję"], ["😳🦶", "**Sorry!** – przepraszam"]] }), [
    choice("Ktoś dał Ci prezent. Co mówisz?", "Thank you!", "Sorry!", "Goodbye!"),
    choice("Prosisz o wodę. Dodajesz słowo…", "please", "sorry", "hello"),
    choice("Niechcący nadepnąłeś koledze na stopę. Mówisz…", "Sorry!", "Thank you!", "Hello!"),
    choice("Co znaczy „Thank you!”?", "Dziękuję!", "Przepraszam!", "Proszę!"),
  ]),
  step("g1-hi.3", "My name is…", card(
    ["**My name is Ola.** – Mam na imię Ola.", "**How old are you?** – Ile masz lat?", "**I am seven.** – Mam siedem lat."],
    [["My name is Ola.", "Mam na imię Ola."], ["How old are you?", "Ile masz lat?"], ["I am seven.", "Mam siedem lat."]],
    { intro: "Przedstaw się po angielsku! Powiedz, jak masz na imię i ile masz lat.", emoji: "🙋",
      mistake: ["I have seven years.", "I am seven.", "Po angielsku o wieku mówimy z **am / is / are**, a nie z have."] }), [
    choice("Jak powiesz po angielsku: „Mam na imię Ola”?", "My name is Ola.", "I am Ola name.", "Name my is Ola."),
    choice("My name ___ Tom.", "is", "are", "am"),
    choice("I ___ seven.", "am", "is", "are"),
    choice("Co znaczy „How old are you?”", "Ile masz lat?", "Jak się masz?", "Jak masz na imię?"),
  ]),
]);

// ====================== GRADE 2 – words with Polish, first sentences ======================
unit("g2-days", 2, "📅", "Dni tygodnia", "Monday, Tuesday…", [
  vocabStep("g2-days.1", "Monday – Thursday", "time", ["Monday", "Tuesday", "Wednesday", "Thursday"], "tr"),
  vocabStep("g2-days.2", "Friday – Sunday", "time", ["Friday", "Saturday", "Sunday", "Monday", "Thursday"], "tr"),
]);
unit("g2-numbers", 2, "🔢", "Liczby 11–20", "Eleven, twelve…", [
  vocabStep("g2-numbers.1", "Eleven – fifteen", "numbers", ["eleven", "twelve", "thirteen", "fourteen", "fifteen"], "tr"),
  vocabStep("g2-numbers.2", "Sixteen – twenty", "numbers", ["sixteen", "seventeen", "eighteen", "nineteen", "twenty"], "tr"),
]);
unit("g2-am", 2, "🧍", "I am, you are, he is", "Czasownik „być” – pierwsze zdania", [
  step("g2-am.1", "I am, you are", card(
    ["**I am** – jestem. Krócej: **I'm**.", "**You are** – jesteś. Krócej: **you're**."],
    [["I am Tom.", "Jestem Tomek."], ["You are my friend.", "Jesteś moim przyjacielem."], ["I'm happy.", "Jestem szczęśliwy."]],
    { intro: "Słowo „być” po angielsku zmienia się jak kameleon. Przy I zawsze jest am!",
      pattern: [pat("🙋", "S:I", "V:am", "R:happy."), pat("👉", "S:You", "V:are", "R:my friend.")] }), [
    choice("I ___ a boy.", "am", "is", "are"), choice("You ___ my friend.", "are", "am", "is"),
    choice("I ___ happy.", "am", "are", "is"), choice("You ___ tall.", "are", "am", "is"),
  ]),
  step("g2-am.2", "He is, she is, it is", card(
    ["**He is** – on jest (o chłopcu, panu)", "**She is** – ona jest (o dziewczynce, pani)", "**It is** – to jest (o rzeczy albo zwierzątku)"],
    [["He is a boy.", "On jest chłopcem."], ["She is a girl.", "Ona jest dziewczynką."], ["It is a dog.", "To jest pies."]],
    { intro: "Przy he, she i it zawsze mówimy is.", scene: [["👦", "**he** – on"], ["👧", "**she** – ona"], ["🐶", "**it** – ono / to"]],
      pattern: [pat("👦", "S:He", "V:is", "R:a boy."), pat("👧", "S:She", "V:is", "R:a girl.")] }), [
    choice("She ___ my mum.", "is", "are", "am"), choice("He ___ a teacher.", "is", "are", "am"),
    choice("It ___ a cat.", "is", "am", "are"), choice("My dog ___ big.", "is", "are", "am"),
  ]),
  step("g2-am.3", "We are, they are", card(
    ["**We are** – jesteśmy (ja i ktoś jeszcze)", "**They are** – oni są / one są"],
    [["We are friends.", "Jesteśmy przyjaciółmi."], ["They are at school.", "Są w szkole."]],
    { intro: "Gdy jest nas więcej – mówimy are.", scene: [["🙋‍♀️🙋", "**we** – my"], ["👫", "**they** – oni"]],
      pattern: [pat("👫", "S:We / They", "V:are", "R:friends.")] }), [
    choice("We ___ friends.", "are", "is", "am"), choice("They ___ at school.", "are", "is", "am"),
    choice("Tom and I ___ happy.", "are", "is", "am"), choice("My parents ___ at home.", "are", "is", "am"),
  ]),
]);
unit("g2-like", 2, "👍", "I like…", "Co lubimy, a czego nie", [
  step("g2-like.1", "I like", card(
    ["**I like** – lubię", "Po **like** mówimy, co lubimy: I like pizza."],
    [["I like pizza.", "Lubię pizzę."], ["I like cats.", "Lubię koty."], ["I like ice cream.", "Lubię lody."]],
    { intro: "Powiedz, co lubisz! Zacznij od I like…", scene: [["😋🍕", "I like **pizza**."], ["😊🐱", "I like **cats**."]],
      pattern: [pat("👍", "S:I", "V:like", "R:pizza.")] }), [
    choice("Lubisz pizzę. Powiesz:", "I like pizza.", "I am pizza.", "I can pizza."),
    choice("I ___ ice cream.", "like", "am", "is"),
    choice("Jak powiesz „Lubię koty”?", "I like cats.", "I am cats.", "Cats like I."),
    choice("Co znaczy „I like apples”?", "Lubię jabłka.", "Mam jabłka.", "Jestem jabłkiem."),
  ]),
  step("g2-like.2", "I don't like", card(
    ["**I don't like** – nie lubię", "**don't** to skrót od **do not**."],
    [["I don't like fish.", "Nie lubię ryb."], ["I don't like spiders.", "Nie lubię pająków."]],
    { intro: "Czego nie lubisz? Dodaj don't przed like.", scene: [["😖🐟", "I **don't** like fish."], ["😱🕷️", "I **don't** like spiders."]],
      pattern: [pat("👎", "S:I", "N:don't", "V:like", "R:fish.")] }), [
    choice("Nie lubisz ryb. Powiesz:", "I don't like fish.", "I like fish.", "I am fish."),
    choice("I ___ like spiders. (nie lubię)", "don't", "am not", "can't"),
    choice("Co znaczy „I don't like”?", "nie lubię", "lubię", "nie mam"),
    choice("I don't ___ milk.", "like", "likes", "am"),
  ]),
]);
unit("g2-name", 2, "🙋", "Poznajemy się", "Jak masz na imię? Jak się masz?", [
  step("g2-name.1", "What's your name?", card(
    ["**What's your name?** – Jak masz na imię?", "**How are you?** – Jak się masz? – **I'm fine, thank you.** – Dobrze, dziękuję.", "**How old are you?** – Ile masz lat? – **I'm eight.** – Mam osiem lat."],
    [["What's your name?", "Jak masz na imię?"], ["My name is Ola.", "Mam na imię Ola."], ["How are you?", "Jak się masz?"], ["I'm fine, thank you.", "Dobrze, dziękuję."]],
    { intro: "Trzy pytania na dobry początek znajomości. Do każdego pytania pasuje jedna odpowiedź." }), [
    choice("What's your name? – ___", "My name is Ola.", "I'm fine.", "I'm seven."),
    choice("How are you? – ___", "I'm fine, thank you.", "My name is Tom.", "Goodbye."),
    choice("How old are you? – ___", "I'm eight.", "I'm fine.", "My name is Anna."),
    choice("Co znaczy „How are you?”", "Jak się masz?", "Ile masz lat?", "Jak masz na imię?"),
  ]),
  step("g2-name.2", "Good morning, good night", card(
    ["**Good morning!** – Dzień dobry! (rano)", "**Good night!** – Dobranoc! (przed snem)"],
    [["Good morning!", "Dzień dobry!"], ["Good night!", "Dobranoc!"]],
    { intro: "Rano mówimy Good morning, a wieczorem przed snem Good night.", scene: [["🌞", "**Good morning!**"], ["🌙😴", "**Good night!**"]] }), [
    choice("Rano mówisz:", "Good morning!", "Good night!", "Goodbye!"),
    choice("Idziesz spać. Mówisz:", "Good night!", "Good morning!", "Hello!"),
    choice("Co znaczy „Good morning!”?", "Dzień dobry!", "Dobranoc!", "Do widzenia!"),
    choice("Co znaczy „Good night!”?", "Dobranoc!", "Dzień dobry!", "Cześć!"),
  ]),
]);
unit("g2-animals", 2, "🐯", "Dzikie zwierzęta", "Tiger, bear, giraffe…", [
  vocabStep("g2-animals.1", "Tiger, bear, giraffe", "animals", ["tiger", "bear", "giraffe"], "see"),
  vocabStep("g2-animals.2", "Zebra, snake, butterfly, spider", "animals", ["zebra", "snake", "butterfly", "spider"], "see"),
]);
unit("g2-body", 2, "🦷", "Ciało – więcej słów", "Tooth, neck, back…", [
  vocabStep("g2-body.1", "Tooth, neck, back, tummy, toe", "body", ["tooth", "neck", "back", "tummy", "toe"], "tr"),
]);
unit("g2-ihave", 2, "🎒", "I have got…", "Co mamy", [
  step("g2-ihave.1", "I have got", card(
    ["**I have got** – mam. Krócej: **I've got**.", "**You have got** – masz."],
    [["I have got a dog.", "Mam psa."], ["You have got a ball.", "Masz piłkę."]],
    { intro: "Chcesz pochwalić się, co masz? Powiedz I have got…", scene: [["🧒🐶", "I have got **a dog**."], ["🧒⚽", "You have got **a ball**."]],
      pattern: [pat("🎒", "S:I / You", "V:have got", "R:a dog.")] }), [
    choice("I ___ got a cat.", "have", "has", "am"), choice("Mam psa. Po angielsku:", "I have got a dog.", "I am a dog.", "I can a dog."),
    choice("You ___ got a book.", "have", "has", "is"), choice("Co znaczy „I have got”?", "mam", "jestem", "lubię"),
  ]),
  step("g2-ihave.2", "He has got, she has got", card(
    ["**He has got** – on ma, **she has got** – ona ma, **it has got** – ono ma.", "Przy **he, she, it** mówimy **has**, a nie have!"],
    [["She has got a bike.", "Ona ma rower."], ["He has got a ball.", "On ma piłkę."]],
    { intro: "Gdy mówimy o kimś jednym (on, ona, ono), have zamienia się w has.",
      pattern: [pat("👧", "S:She / He / It", "V:has got", "R:a bike.")], mistake: ["She have got a bike.", "She has got a bike."] }), [
    choice("She ___ got a bike.", "has", "have", "is"), choice("He ___ got a ball.", "has", "have", "are"),
    choice("My dad ___ got a car.", "has", "have", "is"), choice("It ___ got four legs.", "has", "have", "am"),
  ]),
]);

// ====================== GRADE 3 – first rules ======================
unit("g3-aan", 3, "🅰️", "a / an", "Przedimek: a czy an?", [
  step("g3-aan.1", "a czy an?", card(
    ["**a** – przed słowem, które zaczyna się od spółgłoski: a dog, a book", "**an** – przed słowem, które zaczyna się od samogłoski a, e, i, o, u: an apple, an egg", "Słówko a / an stawiamy przed jedną rzeczą. Po polsku go nie tłumaczymy."],
    [["I have got a dog.", "Mam psa."], ["I have got an apple.", "Mam jabłko."], ["This is an egg.", "To jest jajko."], ["It is a book.", "To jest książka."]],
    { intro: "Spróbuj powiedzieć „a apple” – trudno, prawda? Dlatego przed a, e, i, o, u mówimy an.", scene: [["🐶", "**a** dog"], ["📖", "**a** book"], ["🍎", "**an** apple"], ["🥚", "**an** egg"]] }), [
    choice("I have got ___ apple.", "an", "a"), choice("This is ___ dog.", "a", "an"), choice("I can see ___ elephant.", "an", "a"), choice("Take ___ umbrella, please.", "an", "a"),
  ]),
]);
unit("g3-plural", 3, "➕", "Liczba mnoga", "Jeden pies – dwa psy", [
  step("g3-plural.1", "Dodajemy -s, -es, -ies", card(
    ["Zwykle dodajemy **-s**: book → books, cat → cats", "Po s, x, ch, sh dodajemy **-es**: box → boxes, bus → buses, watch → watches", "Gdy przed y jest spółgłoska: **y → ies**: baby → babies"],
    [["I have got one book and two notebooks.", "Mam jedną książkę i dwa zeszyty."], ["There are two boxes on the table.", "Na stole są dwa pudełka."], ["The babies are sleeping.", "Niemowlęta śpią."]],
    { intro: "Gdy coś jest więcej niż jedno, na końcu słowa zwykle dopisujemy -s.", scene: [["🐱 → 🐱🐱", "cat → cat**s**"], ["📦 → 📦📦", "box → box**es**"], ["👶 → 👶👶", "baby → bab**ies**"]] }), [
    gap("I have got two ___. (cat)", "cats"), gap("There are three ___ in my room. (box)", "boxes"), gap("The ___ are sleeping. (baby)", "babies"), gap("I can see two ___ in the street. (bus)", "buses"),
  ]),
  step("g3-plural.2", "Nieregularne", card(
    ["Kilka słów ma swoją własną liczbę mnogą – trzeba je zapamiętać:", "man → **men**, woman → **women**, child → **children**", "foot → **feet**, tooth → **teeth**, mouse → **mice**"],
    [["Two children are playing in the park.", "Dwoje dzieci bawi się w parku."], ["My feet are cold.", "Zmarzły mi stopy."]],
    { intro: "Te słowa to łobuziaki – nie dostają -s, tylko zmieniają się całe!", scene: [["🧒 → 🧒🧒", "child → **children**"], ["🦶 → 🦶🦶", "foot → **feet**"], ["🐭 → 🐭🐭", "mouse → **mice**"]],
      mistake: ["two childs", "two children"] }), [
    gap("Three ___ are playing football. (child)", "children"), gap("My ___ are wet. (foot)", "feet"), gap("I brush my ___ every day. (tooth)", "teeth"), gap("There are two ___ in the kitchen! (mouse)", "mice"),
  ]),
]);
unit("g3-thisis", 3, "👉", "This, that, these, those", "To jest – tamto", [
  step("g3-thisis.1", "This is, that is", card(
    ["**This is** – to jest (blisko mnie, mogę dotknąć)", "**That is** – tamto jest / to tam (daleko ode mnie)"],
    [["This is a ball.", "To jest piłka."], ["That is a tree.", "Tamto to drzewo."]],
    { intro: "This – to, co blisko. That – to, co daleko. Pokaż palcem!", scene: [["🧒⚽", "**this** – blisko"], ["🧒 · · · · 🌳", "**that** – daleko"]] }), [
    choice("Trzymasz piłkę w ręce: ___ is a ball.", "This", "That"), choice("Pokazujesz drzewo daleko: ___ is a tree.", "That", "This"),
    choice("___ is my bag. (mam go przy sobie)", "This", "That"), choice("___ is a bird. (na dachu, daleko)", "That", "This"),
  ]),
  step("g3-thisis.2", "These are, those are", card(
    ["**These are** – to są (kilka rzeczy blisko)", "**Those are** – tamte są / to tam (kilka rzeczy daleko)"],
    [["These are my shoes.", "To są moje buty."], ["Those are birds.", "Tamte to ptaki."]],
    { intro: "Gdy rzeczy jest więcej: this zmienia się w these, a that w those.", scene: [["🧒👟👟", "**these** – blisko"], ["🧒 · · · · 🐦🐦", "**those** – daleko"]] }), [
    choice("___ are my shoes. (mam je przy sobie)", "These", "Those"), choice("___ are birds. (daleko, na niebie)", "Those", "These"),
    choice("___ are my books. (na moim biurku)", "These", "Those"), choice("___ are trees. (daleko w parku)", "Those", "These"),
  ]),
]);
unit("g3-can", 3, "💪", "I can…", "Co umiemy zrobić", [
  step("g3-can.1", "I can", card(
    ["**can** – umiem, potrafię, mogę", "Po **can** czasownik się nie zmienia: I can swim. She can swim."],
    [["I can swim.", "Umiem pływać."], ["She can dance.", "Ona umie tańczyć."]],
    { intro: "Pochwal się, co potrafisz! I can…", scene: [["🏊", "I can **swim**."], ["💃", "She can **dance**."], ["🐦", "Birds can **fly**."]],
      pattern: [pat("💪", "S:I / She", "H:can", "V:swim.")], mistake: ["She can swims.", "She can swim."] }), [
    choice("I can ___.", "swim", "swims", "to swim"), choice("Umiem skakać:", "I can jump.", "I can jumps.", "I jump can."),
    choice("Birds can ___.", "fly", "flying", "flies"), choice("She can ___ the guitar.", "play", "plays", "playing"),
  ]),
  step("g3-can.2", "Can't i pytania", card(
    ["**can't** – nie umiem, nie mogę", "Pytanie: **Can you…?** – Czy umiesz…?", "Odpowiedź: **Yes, I can.** / **No, I can't.**"],
    [["I can't fly.", "Nie umiem latać."], ["Can you swim?", "Czy umiesz pływać?"], ["Yes, I can.", "Tak, umiem."]],
    { intro: "Żeby zapytać, postaw can na początku zdania.", pattern: [pat("👎", "S:I", "N:can't", "V:fly."), pat("❓", "H:Can", "S:you", "V:swim?")] }), [
    choice("Penguins ___ fly.", "can't", "can", "cans"), choice("___ you swim?", "Can", "Are", "Do"),
    choice("Can you run? Yes, I ___.", "can", "am", "do"), choice("Co znaczy „I can't”?", "nie umiem / nie mogę", "umiem", "nie lubię"),
  ]),
]);
unit("g3-inon", 3, "📦", "in, on, under…", "Gdzie to jest?", [
  step("g3-inon.1", "in, on, under", card(
    ["**in** – w (w środku)", "**on** – na", "**under** – pod"],
    [["The cat is in the box.", "Kot jest w pudełku."], ["The book is on the table.", "Książka jest na stole."], ["The ball is under the chair.", "Piłka jest pod krzesłem."]],
    { intro: "Gdzie schował się kot? Zobacz obrazki!", illus: "prepPlace" }), [
    choice("The cat is ___ the box. (w pudełku)", "in", "on", "under"), choice("The book is ___ the table. (na stole)", "on", "in", "under"),
    choice("The ball is ___ the chair. (pod krzesłem)", "under", "on", "in"), choice("The fish is ___ the water.", "in", "on", "under"),
  ]),
  step("g3-inon.2", "next to, behind, in front of", card(
    ["**next to** – obok", "**behind** – za", "**in front of** – przed"],
    [["The dog is behind the house.", "Pies jest za domem."], ["The tree is next to the house.", "Drzewo jest obok domu."], ["The car is in front of the house.", "Samochód stoi przed domem."]],
    { intro: "Teraz piesek bawi się w chowanego koło domu.", illus: "prepPlace2" }), [
    choice("The dog is ___ the house. (za domem)", "behind", "next to", "in front of"),
    choice("The tree is ___ the house. (obok domu)", "next to", "behind", "under"),
    choice("The car is ___ the house. (przed domem)", "in front of", "behind", "in"),
    choice("Co znaczy „behind”?", "za", "przed", "obok"),
  ]),
]);
unit("g3-months", 3, "🗓️", "Miesiące", "January, February…", [
  vocabStep("g3-months.1", "January – June", "time", ["January", "February", "March", "April", "May", "June"], "tr"),
  vocabStep("g3-months.2", "July – December", "time", ["July", "August", "September", "October", "November", "December"], "tr"),
]);
unit("g3-time", 3, "⏰", "Która godzina?", "It's three o'clock", [
  step("g3-time.1", "O'clock", card(
    ["**What time is it?** – Która (jest) godzina?", "Pełna godzina: **It's … o'clock.** – Jest …", "Uwaga: **o'clock** dodajemy tylko do pełnych godzin."],
    [["What time is it?", "Która jest godzina?"], ["It's seven o'clock.", "Jest siódma."]],
    { intro: "Gdy duża wskazówka pokazuje 12, mówimy o'clock.", illus: "clocksFull" }), [
    choice("Godzina 7:00. Po angielsku:", "It's seven o'clock.", "It's seven clock.", "It is seven hour."),
    choice("What time is it? – It's ___. (godz. 2:00)", "two o'clock", "two hour", "two clock"),
    choice("Co znaczy „What time is it?”", "Która jest godzina?", "Ile masz lat?", "Jak się masz?"),
    choice("It's ten ___.", "o'clock", "clock", "hour"),
  ]),
]);
unit("g3-thereis", 3, "📍", "There is / There are", "Co gdzie jest", [
  step("g3-thereis.1", "There is, there are", card(
    ["**There is** + jedna rzecz: There is a cat. – Jest (tu) kot.", "**There are** + dwie lub więcej rzeczy: There are two cats. – Są (tu) dwa koty."],
    [["There is a book on the desk.", "Na biurku jest książka."], ["There are two cats in the garden.", "W ogrodzie są dwa koty."]],
    { intro: "Opowiadasz, co gdzie jest? Zacznij od There is albo There are.", scene: [["🐱", "There **is** a cat."], ["🐱🐱", "There **are** two cats."]],
      pattern: [pat("1️⃣", "S:There is", "R:a cat."), pat("🔢", "S:There are", "R:two cats.")] }), [
    choice("There ___ a book on the desk.", "is", "are"), choice("There ___ two cats.", "are", "is"),
    choice("Co znaczy „There is a lamp”?", "Jest lampa.", "Mam lampę.", "To lampa."), choice("There ___ three birds in the tree.", "are", "is"),
  ]),
]);
unit("g3-shop", 3, "🛍️", "Prosimy grzecznie", "Can I have…?", [
  step("g3-shop.1", "Can I have…?", card(
    ["**Can I have a sandwich, please?** – Poproszę kanapkę.", "**Here you are.** – Proszę (gdy coś komuś podajesz).", "**Thank you.** – Dziękuję."],
    [["Can I have an apple, please?", "Poproszę jabłko."], ["Here you are.", "Proszę bardzo."], ["Thank you.", "Dziękuję."]],
    { intro: "Tak grzecznie prosimy w sklepie albo przy stole. Nie zapomnij o please!", scene: [["🧒🥪", "**Can I have** a sandwich, **please**?"], ["🙋‍♀️🥪", "**Here you are.**"], ["😊", "**Thank you.**"]] }), [
    choice("Prosisz o sok. Mówisz:", "Can I have some juice, please?", "I am a juice.", "Good night."),
    choice("Podajesz komuś ołówek. Mówisz:", "Here you are.", "Good morning.", "I'm sorry."),
    choice("Ktoś Ci coś podał. Mówisz:", "Thank you.", "Goodbye.", "Here you are."),
    choice("Can I have an apple, ___?", "please", "sorry", "hello"),
  ]),
]);
unit("g3-home", 3, "🏠", "Pokoje w domu", "Kitchen, bathroom…", [
  vocabStep("g3-home.1", "Kitchen, bathroom, bedroom, garden", "home", ["kitchen", "bathroom", "bedroom", "garden"], "tr"),
]);
