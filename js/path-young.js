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
 * Text supports **bold**.
 */
const PATH_UNITS = [];

const choice = (q, answer, ...wrong) => ({ t: "choice", q, o: [answer, ...wrong], a: answer });
const gap = (q, answer) => ({ t: "gap", q, a: answer });
const ord = (en, pl) => ({ t: "order", en, pl });
const card = (lines, examples = [], extra = {}) => ({ lines, examples, ...extra });
const step = (id, title, cardData, exercises) => ({ id, title, card: cardData, exercises });
const unit = (id, grade, icon, title, summary, steps) => PATH_UNITS.push({ id, grade, icon, title, summary, steps });

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
    ["**Hello!** / **Hi!** – cześć (na powitanie)", "**Goodbye!** / **Bye!** – do widzenia, pa"],
    [["Hello!", "Cześć!"], ["Goodbye!", "Do widzenia!"], ["Hi, Tom!", "Cześć, Tomku!"]], { emoji: "👋" }), [
    choice("Spotykasz kolegę rano. Co mówisz?", "Hello!", "Goodbye!", "Sorry!"),
    choice("Wychodzisz ze szkoły. Co mówisz?", "Goodbye!", "Hello!", "Please!"),
    choice("Co znaczy „Hi”?", "Cześć", "Dziękuję", "Do widzenia"),
    choice("Co znaczy „Bye”?", "Pa, do widzenia", "Dziękuję", "Przepraszam"),
  ]),
  step("g1-hi.2", "Please, thank you, sorry", card(
    ["**Please** – proszę (gdy o coś prosisz)", "**Thank you** – dziękuję", "**Sorry** – przepraszam"],
    [["Please!", "Proszę!"], ["Thank you!", "Dziękuję!"], ["Sorry!", "Przepraszam!"]], { emoji: "🙏" }), [
    choice("Ktoś dał Ci prezent. Co mówisz?", "Thank you!", "Sorry!", "Goodbye!"),
    choice("Prosisz o wodę. Dodajesz słowo…", "Please", "Sorry", "Hello"),
    choice("Nadepnąłeś koledze na stopę. Mówisz…", "Sorry!", "Thank you!", "Hello!"),
    choice("Co znaczy „Thank you”?", "Dziękuję", "Przepraszam", "Proszę"),
  ]),
  step("g1-hi.3", "My name is…", card(
    ["**My name is Ola.** – Mam na imię Ola.", "**I am seven.** – Mam siedem lat."],
    [["My name is Ola.", "Mam na imię Ola."], ["I am seven.", "Mam siedem lat."]], { emoji: "🙂" }), [
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
    ["**I am** (I'm) – jestem", "**You are** (you're) – jesteś, jesteście"],
    [["I am Tom.", "Jestem Tomek."], ["You are my friend.", "Jesteś moim przyjacielem."], ["I'm seven.", "Mam siedem lat."]]), [
    choice("I ___ a boy.", "am", "is", "are"), choice("You ___ my friend.", "are", "am", "is"),
    choice("I ___ happy.", "am", "are", "is"), choice("You ___ tall.", "are", "am", "is"),
  ]),
  step("g2-am.2", "He is, she is, it is", card(
    ["**He is** – on jest", "**She is** – ona jest", "**It is** – ono jest (o rzeczach i zwierzętach)"],
    [["He is a boy.", "On jest chłopcem."], ["She is a girl.", "Ona jest dziewczynką."], ["It is a dog.", "To jest pies."]]), [
    choice("She ___ my mum.", "is", "are", "am"), choice("He ___ a teacher.", "is", "are", "am"),
    choice("It ___ a cat.", "is", "am", "are"), choice("My dog ___ big.", "is", "are", "am"),
  ]),
  step("g2-am.3", "We are, they are", card(
    ["**We are** – jesteśmy", "**They are** – oni / one są"],
    [["We are friends.", "Jesteśmy przyjaciółmi."], ["They are at school.", "Są w szkole."]]), [
    choice("We ___ friends.", "are", "is", "am"), choice("They ___ at school.", "are", "is", "am"),
    choice("Tom and I ___ happy.", "are", "is", "am"), choice("My parents ___ at home.", "are", "is", "am"),
  ]),
]);
unit("g2-like", 2, "👍", "I like…", "Co lubimy, a czego nie", [
  step("g2-like.1", "I like", card(
    ["**I like** – lubię", "Po „like” podajemy, co lubimy: I like pizza."],
    [["I like pizza.", "Lubię pizzę."], ["I like cats.", "Lubię koty."], ["I like ice cream.", "Lubię lody."]], { emoji: "🍕" }), [
    choice("Lubisz pizzę. Powiesz:", "I like pizza.", "I am pizza.", "I can pizza."),
    choice("I ___ ice cream.", "like", "am", "is"),
    choice("Jak powiesz „Lubię koty”?", "I like cats.", "I am cats.", "Cats like I."),
    choice("Co znaczy „I like apples”?", "Lubię jabłka", "Mam jabłka", "Jestem jabłkiem"),
  ]),
  step("g2-like.2", "I don't like", card(
    ["**I don't like** – nie lubię", "don't = do not"],
    [["I don't like fish.", "Nie lubię ryb."], ["I don't like spiders.", "Nie lubię pająków."]], { emoji: "🕷️" }), [
    choice("Nie lubisz ryb. Powiesz:", "I don't like fish.", "I like fish.", "I am fish."),
    choice("I ___ like spiders. (nie lubię)", "don't", "am not", "can't"),
    choice("Co znaczy „I don't like”?", "Nie lubię", "Lubię", "Nie mam"),
    choice("I don't ___ milk.", "like", "likes", "am"),
  ]),
]);
unit("g2-name", 2, "🙋", "Poznajemy się", "Jak masz na imię? Jak się masz?", [
  step("g2-name.1", "What's your name?", card(
    ["**What's your name?** – Jak masz na imię?", "**How are you?** – Jak się masz?", "**How old are you?** – Ile masz lat?"],
    [["What's your name?", "Jak masz na imię?"], ["My name is Ola.", "Mam na imię Ola."], ["How old are you?", "Ile masz lat?"], ["I'm eight.", "Mam osiem lat."]]), [
    choice("What's your name? – ___", "My name is Ola.", "I'm fine.", "I'm seven."),
    choice("How are you? – ___", "I'm fine, thank you.", "My name is Tom.", "Goodbye."),
    choice("How old are you? – ___", "I'm eight.", "I'm fine.", "My name is Anna."),
    choice("Co znaczy „How are you?”", "Jak się masz?", "Ile masz lat?", "Jak masz na imię?"),
  ]),
  step("g2-name.2", "Good morning, good night", card(
    ["**Good morning!** – dzień dobry (rano)", "**Good night!** – dobranoc"],
    [["Good morning!", "Dzień dobry!"], ["Good night!", "Dobranoc!"]], { emoji: "🌞" }), [
    choice("Rano mówisz:", "Good morning!", "Good night!", "Goodbye!"),
    choice("Idziesz spać. Mówisz:", "Good night!", "Good morning!", "Hello!"),
    choice("Co znaczy „Good morning”?", "Dzień dobry", "Dobranoc", "Do widzenia"),
    choice("Co znaczy „Good night”?", "Dobranoc", "Dzień dobry", "Cześć"),
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
    ["**I have got** (I've got) – mam", "**You have got** – masz"],
    [["I have got a dog.", "Mam psa."], ["You have got a ball.", "Masz piłkę."]], { emoji: "🐶" }), [
    choice("I ___ got a cat.", "have", "has", "am"), choice("Mam psa. Po angielsku:", "I have got a dog.", "I am a dog.", "I can a dog."),
    choice("You ___ got a book.", "have", "has", "is"), choice("Co znaczy „I have got”?", "Mam", "Jestem", "Lubię"),
  ]),
  step("g2-ihave.2", "He has got, she has got", card(
    ["**He / she / it has got** – on / ona / ono ma", "Uwaga: przy he, she, it mówimy **has**, nie have!"],
    [["She has got a bike.", "Ona ma rower."], ["He has got a ball.", "On ma piłkę."]]), [
    choice("She ___ got a bike.", "has", "have", "is"), choice("He ___ got a ball.", "has", "have", "are"),
    choice("My dad ___ got a car.", "has", "have", "is"), choice("It ___ got four legs.", "has", "have", "am"),
  ]),
]);

// ====================== GRADE 3 – first rules ======================
unit("g3-aan", 3, "🅰️", "a / an", "Przedimek: a czy an?", [
  step("g3-aan.1", "a czy an?", card(
    ["**a** – przed słowem zaczynającym się od spółgłoski (a dog, a book)", "**an** – przed samogłoską a, e, i, o, u (an apple, an egg)"],
    [["a dog", "pies"], ["an apple", "jabłko"], ["an egg", "jajko"], ["a book", "książka"]]), [
    choice("___ apple", "an", "a"), choice("___ dog", "a", "an"), choice("___ elephant", "an", "a"), choice("___ umbrella", "an", "a"),
  ]),
]);
unit("g3-plural", 3, "➕", "Liczba mnoga", "Jeden pies – dwa psy", [
  step("g3-plural.1", "Dodajemy -s, -es, -ies", card(
    ["Zwykle dodajemy **-s**: book → books", "Po s, x, ch, sh dodajemy **-es**: box → boxes, bus → buses, watch → watches", "Spółgłoska + y: **y → ies**: baby → babies"],
    [["one book – two books", "jedna książka – dwie książki"], ["one box – two boxes", ""], ["one baby – two babies", ""]]), [
    gap("one cat – two ___", "cats"), gap("one box – two ___", "boxes"), gap("one baby – two ___", "babies"), gap("one bus – two ___", "buses"),
  ]),
  step("g3-plural.2", "Nieregularne", card(
    ["Niektóre słowa mają własną liczbę mnogą:", "man → **men**, woman → **women**, child → **children**, foot → **feet**, tooth → **teeth**, mouse → **mice**"],
    [["one child – two children", "jedno dziecko – dwoje dzieci"], ["one foot – two feet", "jedna stopa – dwie stopy"]]), [
    gap("one child – two ___", "children"), gap("one foot – two ___", "feet"), gap("one tooth – two ___", "teeth"), gap("one mouse – two ___", "mice"),
  ]),
]);
unit("g3-thisis", 3, "👉", "This, that, these, those", "To jest – tamto", [
  step("g3-thisis.1", "This is, that is", card(
    ["**This is** – to jest (blisko mnie)", "**That is** – tamto / to tam (daleko ode mnie)"],
    [["This is a ball.", "To jest piłka."], ["That is a tree.", "Tamto to drzewo."]]), [
    choice("Trzymasz piłkę w ręce: ___ is a ball.", "This", "That"), choice("Pokazujesz drzewo daleko: ___ is a tree.", "That", "This"),
    choice("___ is my bag. (mam go przy sobie)", "This", "That"), choice("___ is a bird. (na dachu, daleko)", "That", "This"),
  ]),
  step("g3-thisis.2", "These are, those are", card(
    ["**These are** – to są (blisko)", "**Those are** – tamte / to tamte (daleko)"],
    [["These are my shoes.", "To są moje buty."], ["Those are birds.", "Tamte to ptaki."]]), [
    choice("___ are my shoes. (mam je przy sobie)", "These", "Those"), choice("___ are birds. (daleko, na niebie)", "Those", "These"),
    choice("___ are my books. (na moim biurku)", "These", "Those"), choice("___ are trees. (daleko w parku)", "Those", "These"),
  ]),
]);
unit("g3-can", 3, "💪", "I can…", "Co umiemy zrobić", [
  step("g3-can.1", "I can", card(
    ["**can** – umieć, móc", "Po **can** czasownik jest w formie podstawowej: I can swim."],
    [["I can swim.", "Umiem pływać."], ["She can dance.", "Ona umie tańczyć."]]), [
    choice("I can ___.", "swim", "swims", "to swim"), choice("Umiem skakać:", "I can jump.", "I can jumps.", "I jump can."),
    choice("Birds can ___.", "fly", "flying", "flies"), choice("She can ___ the guitar.", "play", "plays", "playing"),
  ]),
  step("g3-can.2", "Can't i pytania", card(
    ["**can't** – nie umiem / nie mogę", "**Can you…?** – Czy umiesz…? Odpowiedź: Yes, I can. / No, I can't."],
    [["I can't fly.", "Nie umiem latać."], ["Can you swim?", "Czy umiesz pływać?"]]), [
    choice("Penguins ___ fly.", "can't", "can", "cans"), choice("___ you swim?", "Can", "Are", "Do"),
    choice("Can you run? Yes, I ___.", "can", "am", "do"), choice("Co znaczy „I can't”?", "Nie umiem / nie mogę", "Umiem", "Nie lubię"),
  ]),
]);
unit("g3-inon", 3, "📦", "in, on, under…", "Gdzie to jest?", [
  step("g3-inon.1", "in, on, under", card(
    ["**in** – w", "**on** – na", "**under** – pod"],
    [["The cat is in the box.", "Kot jest w pudełku."], ["The book is on the table.", "Książka jest na stole."], ["The ball is under the chair.", "Piłka jest pod krzesłem."]]), [
    choice("The cat is ___ the box. (w pudełku)", "in", "on", "under"), choice("The book is ___ the table. (na stole)", "on", "in", "under"),
    choice("The ball is ___ the chair. (pod krzesłem)", "under", "on", "in"), choice("The fish is ___ the water.", "in", "on", "under"),
  ]),
  step("g3-inon.2", "next to, behind, in front of", card(
    ["**next to** – obok", "**behind** – za", "**in front of** – przed"],
    [["The dog is behind the house.", "Pies jest za domem."], ["The tree is next to the house.", "Drzewo jest obok domu."]]), [
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
    ["**What time is it?** – Która godzina?", "**It's three o'clock.** – Jest trzecia (pełna godzina)."],
    [["What time is it?", "Która jest godzina?"], ["It's seven o'clock.", "Jest siódma."]], { emoji: "⏰" }), [
    choice("Godzina 7:00. Po angielsku:", "It's seven o'clock.", "It's seven clock.", "It is seven hour."),
    choice("What time is it? – It's ___. (godz. 2:00)", "two o'clock", "two hour", "two clock"),
    choice("Co znaczy „What time is it?”", "Która jest godzina?", "Ile masz lat?", "Jak się masz?"),
    choice("It's ten ___.", "o'clock", "clock", "hour"),
  ]),
]);
unit("g3-thereis", 3, "📍", "There is / There are", "Co gdzie jest", [
  step("g3-thereis.1", "There is, there are", card(
    ["**There is** + jedna rzecz: There is a cat.", "**There are** + kilka rzeczy: There are two cats."],
    [["There is a book on the desk.", "Na biurku jest książka."], ["There are two cats.", "Są dwa koty."]]), [
    choice("There ___ a book on the desk.", "is", "are"), choice("There ___ two cats.", "are", "is"),
    choice("Co znaczy „There is a lamp”?", "Jest lampa", "Mam lampę", "To lampa"), choice("There ___ three birds in the tree.", "are", "is"),
  ]),
]);
unit("g3-shop", 3, "🛍️", "Prosimy grzecznie", "Can I have…?", [
  step("g3-shop.1", "Can I have…?", card(
    ["**Can I have a sandwich, please?** – Poproszę kanapkę.", "**Here you are.** – Proszę (gdy coś podajesz).", "**Thank you.** – Dziękuję."],
    [["Can I have an apple, please?", "Poproszę jabłko."], ["Here you are.", "Proszę bardzo."]], { emoji: "🥪" }), [
    choice("Prosisz o sok. Mówisz:", "Can I have a juice, please?", "I am a juice.", "Good night."),
    choice("Podajesz komuś ołówek. Mówisz:", "Here you are.", "Good morning.", "I'm sorry."),
    choice("Ktoś Ci coś podał. Mówisz:", "Thank you.", "Goodbye.", "Here you are."),
    choice("Can I have an apple, ___?", "please", "sorry", "hello"),
  ]),
]);
unit("g3-home", 3, "🏠", "Pokoje w domu", "Kitchen, bathroom…", [
  vocabStep("g3-home.1", "Kitchen, bathroom, bedroom, garden", "home", ["kitchen", "bathroom", "bedroom", "garden"], "tr"),
]);
