"use strict";

/**
 * Our own bank of kid-friendly jokes and riddles (no content from the internet), graded by class.
 * Line format: "level|English setup|English punchline|Polish setup|Polish punchline".
 * level = first class for which the joke is suitable; a pupil sees jokes of the own class and up to 3 classes below.
 * Puns carry a short Polish note in parentheses, because wordplay does not translate.
 */
const JOKE_DATA = `
0|What is big and grey?|An elephant!|Co jest duże i szare?|Słoń!
0|What says moo?|A cow!|Kto robi „muu”?|Krowa!
0|What is red and round?|An apple!|Co jest czerwone i okrągłe?|Jabłko!
0|What has four legs and barks?|A dog!|Kto ma cztery łapy i szczeka?|Pies!
0|What is yellow and shines in the sky?|The sun!|Co jest żółte i świeci na niebie?|Słońce!
0|Who says meow?|A cat!|Kto mówi „miau”?|Kot!
0|What is white and cold?|Snow!|Co jest białe i zimne?|Śnieg!
0|What swims and has fins?|A fish!|Co pływa i ma płetwy?|Ryba!
1|What is green and jumps?|A frog!|Co jest zielone i skacze?|Żaba!
1|What has a trunk but is not a tree?|An elephant!|Co ma trąbę, ale nie jest drzewem?|Słoń!
1|What is yellow and you eat it for breakfast?|A banana!|Co jest żółte i można to zjeść na śniadanie?|Banan!
1|Who has wings and says quack?|A duck!|Kto ma skrzydła i mówi „kwa”?|Kaczka!
1|What is brown and sweet?|Chocolate!|Co jest brązowe i słodkie?|Czekolada!
1|What is hot and you drink it?|Tea!|Co jest gorące i można to pić?|Herbata!
1|What goes up but never comes down?|Your age!|Co idzie w górę, ale nigdy nie spada?|Twój wiek!
1|Why is the cat happy?|It has a fish!|Dlaczego kot jest szczęśliwy?|Ma rybę!
2|Why did the dog sit in the shade?|It did not want to be a hot dog!|Dlaczego pies siedział w cieniu?|Nie chciał być hot dogiem! (hot dog = „gorący pies” i parówka w bułce)
2|What do you call a sleeping bull?|A bulldozer!|Jak nazwać śpiącego byka?|Buldożer! (bull = byk, doze = drzemać)
2|What is a cat's favourite colour?|Purr-ple!|Jaki jest ulubiony kolor kota?|Fioletowy! (purr = mruczeć, purple = fioletowy)
2|Why do birds fly south?|Because it is too far to walk!|Dlaczego ptaki lecą na południe?|Bo to za daleko, żeby iść pieszo!
2|What do you call a fish with no eyes?|A fsh!|Jak nazwać rybę bez oczu?|Rba! (w słowie „fish” nie ma litery „i”, która brzmi jak „eye”, czyli oko)
2|What is a monkey's favourite snack?|Chocolate chimp cookies!|Jaka jest ulubiona przekąska małpy?|Ciasteczka z czekoladą! (chimp = szympans, gra słów z „chip”)
2|What did the big flower say to the little flower?|Hi, bud!|Co duży kwiat powiedział małemu?|Cześć, pączku! (bud = pączek kwiatu, ale też „kolego”)
2|Why did the pencil go to school?|To get sharp!|Dlaczego ołówek poszedł do szkoły?|Żeby się zaostrzyć! (sharp = ostry i bystry)
2|What do cows drink?|Moo-lk!|Co piją krowy?|Muu-leko! (moo + milk)
2|What do you call a pig that does karate?|A pork chop!|Jak nazwać świnię, która trenuje karate?|Kotlet! (pork chop = kotlet wieprzowy, a chop to też cios)
3|Why did the teddy bear say no to dessert?|Because it was stuffed!|Dlaczego miś nie chciał deseru?|Bo był wypchany! (stuffed = wypchany i najedzony)
3|What do you get when you cross a snowman and a dog?|Frostbite!|Co powstanie ze skrzyżowania bałwana i psa?|Odmrożenie! (frost = mróz, bite = ugryzienie)
3|Why was the math book sad?|It had too many problems!|Dlaczego książka do matematyki była smutna?|Miała za dużo problemów! (problems = problemy i zadania)
3|What has hands but cannot clap?|A clock!|Co ma ręce, ale nie potrafi klaskać?|Zegar! (wskazówki to po angielsku „ręce”)
3|Why did the banana go to the doctor?|It wasn't peeling well!|Dlaczego banan poszedł do lekarza?|Źle się czuł! (peeling = obierać się, brzmi jak „feeling” = czuć się)
3|What kind of tree fits in your hand?|A palm!|Jakie drzewo mieści się w dłoni?|Palma! (palm = palma i dłoń)
3|Why can't a bicycle stand up by itself?|It is two tired!|Dlaczego rower nie może stać sam?|Jest dwa-zmęczony! (two tired brzmi jak „too tired” = zbyt zmęczony)
3|What do you call a bear with no teeth?|A gummy bear!|Jak nazwać niedźwiedzia bez zębów?|Miś z żelków! (gummy = bezzębny i żelkowy)
3|What did the ocean say to the beach?|Nothing, it just waved!|Co ocean powiedział do plaży?|Nic, tylko pomachał! (wave = fala i machać)
3|Why do bees have sticky hair?|Because they use honeycombs!|Dlaczego pszczoły mają lepkie włosy?|Bo używają plastrów miodu! (honeycomb = plaster miodu, comb = grzebień)
4|Why did the cookie go to the doctor?|Because it felt crummy!|Dlaczego ciastko poszło do lekarza?|Bo czuło się okruchowo! (crummy = marnie, crumb = okruch)
4|What is a witch's favourite subject at school?|Spelling!|Jaki jest ulubiony przedmiot czarownicy?|Czarowanie! (spelling = pisownia, spell = zaklęcie)
4|Why did the student eat his homework?|The teacher said it was a piece of cake!|Dlaczego uczeń zjadł pracę domową?|Bo nauczyciel powiedział, że to bułka z masłem! (a piece of cake = kawałek ciasta i coś łatwego)
4|What do you call a dinosaur that is never late?|A prontosaurus!|Jak nazwać dinozaura, który się nie spóźnia?|Punktozaur! (pronto = szybko, na czas)
4|Why did the scarecrow win a prize?|Because he was outstanding in his field!|Dlaczego strach na wróble dostał nagrodę?|Bo wyróżniał się w swojej dziedzinie! (field = pole i dziedzina)
4|Why are fish so smart?|Because they live in schools!|Dlaczego ryby są takie mądre?|Bo żyją w szkołach! (school = szkoła i ławica ryb)
4|What is a ghost's favourite fruit?|Boo-berries!|Jaki jest ulubiony owoc ducha?|Buu-jagody! (boo = okrzyk ducha, blueberries = jagody)
4|What goes around the world but stays in a corner?|A stamp!|Co obiega świat, a stoi w rogu?|Znaczek pocztowy!
4|Why did the sun not go to university?|It already had a million degrees!|Dlaczego słońce nie poszło na uniwersytet?|Miało już milion stopni! (degree = stopień i dyplom)
4|What do you call a boomerang that does not come back?|A stick!|Jak nazwać bumerang, który nie wraca?|Patyk!
5|Why did the computer go to the doctor?|It had a virus!|Dlaczego komputer poszedł do lekarza?|Miał wirusa!
5|Why did the music teacher need a ladder?|To reach the high notes!|Dlaczego nauczyciel muzyki potrzebował drabiny?|Żeby sięgnąć wysokich nut!
5|What do you call a sleeping dinosaur?|A dino-snore!|Jak nazwać śpiącego dinozaura?|Dino-chrapacz! (snore = chrapać, brzmi jak „dinosaur”)
5|Why was the broom late?|It overslept!|Dlaczego miotła się spóźniła?|Zaspała! (swept = zamiatała, slept = spała)
5|What did one wall say to the other?|I will meet you at the corner!|Co jedna ściana powiedziała drugiej?|Spotkamy się na rogu!
5|Why did the tomato turn red?|Because it saw the salad dressing!|Dlaczego pomidor się zaczerwienił?|Bo zobaczył sos sałatkowy! (dressing = sos i ubieranie się)
5|How does the moon cut his hair?|Eclipse it!|Jak księżyc się strzyże?|Zaćmieniem! (eclipse brzmi jak „e-clip-se it”, czyli „obetnij to”)
5|What do you call a fake noodle?|An impasta!|Jak nazwać fałszywy makaron?|Makaronowy oszust! (impasta brzmi jak „impostor” = oszust, pasta = makaron)
5|Why did the golfer bring two pairs of trousers?|In case he got a hole in one!|Dlaczego golfista wziął dwie pary spodni?|Na wypadek, gdyby zrobił dziurę! (hole in one = trafienie za pierwszym razem, hole = dziura)
5|What do you call a bear in the rain?|A drizzly bear!|Jak nazwać niedźwiedzia w deszczu?|Mżawkowy miś! (drizzly = mżawkowy, brzmi jak „grizzly” = niedźwiedź grizzly)
6|Why did the teacher wear sunglasses?|Because her students were so bright!|Dlaczego nauczycielka nosiła okulary przeciwsłoneczne?|Bo jej uczniowie byli tacy bystrzy! (bright = jasny i bystry)
6|What do you call a train that sneezes?|A choo-choo achoo train!|Jak nazwać pociąg, który kicha?|Pociąg apsik! (choo-choo to dźwięk pociągu, achoo = apsik)
6|Why did the picture go to jail?|Because it was framed!|Dlaczego obraz trafił do więzienia?|Bo został wrobiony! (framed = oprawiony w ramę i wrobiony)
6|What is a vampire's favourite fruit?|A blood orange!|Jaki jest ulubiony owoc wampira?|Czerwona pomarańcza! (blood orange = „krwawa” pomarańcza)
6|Why can't you trust stairs?|They are always up to something!|Dlaczego nie można ufać schodom?|Zawsze coś knują! (up = w górę, up to something = coś kombinować)
6|What did the left eye say to the right eye?|Between us, something smells!|Co lewe oko powiedziało prawemu?|Między nami, coś tu pachnie! (między oczami jest nos)
6|How do you organise a space party?|You planet!|Jak zorganizować kosmiczną imprezę?|Planetujesz! (plan it = zaplanuj to, planet = planeta)
6|Why did the cow go to space?|To see the Milky Way!|Dlaczego krowa poleciała w kosmos?|Żeby zobaczyć Drogę Mleczną! (milky = mleczny)
6|What do you call a factory that makes okay products?|A satisfactory!|Jak nazwać fabrykę, która robi przeciętne rzeczy?|Zadowalająca! (factory = fabryka, satisfactory = zadowalający)
6|Why did the invisible man turn down the job?|He couldn't see himself doing it!|Dlaczego niewidzialny człowiek odrzucił pracę?|Nie widział siebie w tej roli! (see himself = zobaczyć siebie)
7|Why do programmers prefer dark mode?|Because light attracts bugs!|Dlaczego programiści wolą ciemny motyw?|Bo światło przyciąga robaki! (bug = robak i błąd w programie)
7|Why did the smartphone need glasses?|It lost all its contacts!|Dlaczego smartfon potrzebował okularów?|Zgubił wszystkie kontakty! (contacts = kontakty i soczewki kontaktowe)
7|What do you call a fish wearing a bow tie?|Sofishticated!|Jak nazwać rybę w muszce?|Wyrafinowana! (so-fish-ticated = sophisticated + fish)
7|Why was the math lecture so long?|The professor kept going off on a tangent!|Dlaczego wykład z matematyki był taki długi?|Profesor ciągle zbaczał z tematu! (tangent = styczna i dygresja)
7|What do you call an alligator in a vest?|An investigator!|Jak nazwać aligatora w kamizelce?|Śledczy! (in-vest-igator = investigator + vest = kamizelka)
7|Why did the gardener plant lightbulbs?|He wanted a power plant!|Dlaczego ogrodnik posadził żarówki?|Chciał mieć elektrownię! (power plant = elektrownia, plant = sadzić i roślina)
7|Why did the library book go to the gym?|To work on its volume!|Dlaczego książka poszła na siłownię?|Żeby popracować nad objętością! (volume = tom, objętość i głośność)
7|Why did the clock get sent to the principal's office?|It talked too much, or tocked too much!|Dlaczego zegar wysłano do dyrektora?|Za dużo gadał, czyli „tykał”! (tock = tyk, brzmi jak „talk” = gadać)
7|What did the janitor say when he jumped out of the closet?|Supplies!|Co powiedział woźny, gdy wyskoczył z szafy?|Niespodzianka! (supplies = zapasy, brzmi jak „surprise”)
7|Why is a river rich?|Because it has two banks!|Dlaczego rzeka jest bogata?|Bo ma dwa brzegi! (bank = brzeg i bank)
8|Why did the scientist take a ladder to the lab?|He wanted to reach a higher level of knowledge!|Dlaczego naukowiec zabrał drabinę do laboratorium?|Chciał osiągnąć wyższy poziom wiedzy!
8|What did the zero say to the eight?|Nice belt!|Co zero powiedziało ósemce?|Ładny pasek! (ósemka wygląda jak zero z paskiem)
8|What do you call a belt made of watches?|A waist of time!|Jak nazwać pasek zrobiony z zegarków?|Strata czasu! (waist = talia, brzmi jak „waste” = strata)
8|Why did the coffee file a police report?|It got mugged!|Dlaczego kawa zgłosiła sprawę na policję?|Została napadnięta! (mugged = napadnięta, mug = kubek)
8|How do you make seven an even number?|Take away the 's'!|Jak zrobić z siódemki liczbę parzystą?|Zabierz „s”! (seven bez „s” to even = parzysta)
8|Why did the student study on an airplane?|He wanted a higher education!|Dlaczego uczeń uczył się w samolocie?|Chciał wyższego wykształcenia! (higher = wyżej i wyższe)
8|What is the best way to talk to a giant?|Use big words!|Jak najlepiej rozmawiać z olbrzymem?|Używać wielkich słów!
8|Why did the electrician start a band?|He had great connections!|Dlaczego elektryk założył zespół?|Miał świetne połączenia! (connections = połączenia i znajomości)
8|Why do mathematicians love forests?|Because of all the natural logs!|Dlaczego matematycy kochają lasy?|Bo jest tam pełno naturalnych logarytmów! (natural log = logarytm naturalny, log = kłoda)
8|Why was the equal sign so humble?|It knew it was not less than or greater than anyone else!|Dlaczego znak równości był taki skromny?|Wiedział, że nikt nie jest od niego mniejszy ani większy!
0|What has a long neck and spots?|A giraffe!|Kto ma długą szyję i łaty?|Żyrafa!
0|What is orange and long and rabbits love it?|A carrot!|Co jest pomarańczowe, długie i uwielbiają to króliki?|Marchewka!
0|What is round and you kick it?|A ball!|Co jest okrągłe i można to kopać?|Piłka!
0|What is cold and you eat it in summer?|Ice cream!|Co jest zimne i je się to latem?|Lody!
0|Who has long ears and hops?|A rabbit!|Kto ma długie uszy i skacze?|Królik!
1|Why do bees hum?|Because they forgot the words!|Dlaczego pszczoły tylko brzęczą?|Bo zapomniały słów piosenki!
1|Which animal can jump higher than a house?|All of them – houses cannot jump!|Które zwierzę skoczy wyżej niż dom?|Każde – domy nie skaczą!
1|What has ears but cannot hear?|A cornfield!|Co ma kłosy-uszy, ale nic nie słyszy?|Pole kukurydzy! (ear = ucho i kłos)
1|What do frogs order at a restaurant?|French flies!|Co żaby zamawiają w restauracji?|Frytki z muchami! (French fries = frytki, flies = muchy)
1|Why do cows wear bells?|Because their horns don't work!|Dlaczego krowy noszą dzwonki?|Bo ich rogi nie trąbią! (horn = róg i klakson)
2|Which animal is always at a cricket match?|A bat!|Które zwierzę zawsze jest na meczu krykieta?|Nietoperz! (bat = nietoperz i kij do krykieta)
2|What is a snake's favourite subject?|Hiss-tory!|Jaki jest ulubiony przedmiot węża?|Historia! (hiss = syczeć, history = historia)
2|Why don't elephants use computers?|They are afraid of the mouse!|Dlaczego słonie nie używają komputerów?|Boją się myszki!
2|What do you call a fly without wings?|A walk!|Jak nazwać muchę bez skrzydeł?|Spacer! (fly = mucha i latać, walk = chodzić)
2|What did the egg say to the frying pan?|You crack me up!|Co jajko powiedziało do patelni?|Pęknę ze śmiechu! (crack up = pękać ze śmiechu)
3|What gets wetter the more it dries?|A towel!|Co robi się coraz bardziej mokre, im więcej suszy?|Ręcznik!
3|What do you call a dog magician?|A labracadabrador!|Jak nazwać psa-magika?|Labrakadabrador!
3|Why did the girl bring a ladder to school?|She wanted to go to high school!|Dlaczego dziewczynka przyniosła do szkoły drabinę?|Chciała iść do „wysokiej” szkoły! (high school = szkoła średnia, high = wysoko)
3|Why do fish live in salt water?|Because pepper makes them sneeze!|Dlaczego ryby żyją w słonej wodzie?|Bo od pieprzu kichają!
3|What do you call a train full of toffee?|A chew-chew train!|Jak nazwać pociąg pełen krówek?|Ciuch-ciuch-ciągutka! (choo-choo = ciuchcia, chew = żuć)
4|Why are ghosts bad at lying?|Because you can see right through them!|Dlaczego duchy nie umieją kłamać?|Bo widać je na wylot!
4|Why did the girl take a ruler to bed?|To see how long she slept!|Dlaczego dziewczynka zabrała linijkę do łóżka?|Żeby zmierzyć, jak długo spała!
4|Why did the orange stop rolling?|It ran out of juice!|Dlaczego pomarańcza przestała się toczyć?|Skończył jej się sok! (run out of juice = opaść z sił)
4|What can you catch but not throw?|A cold!|Co można złapać, ale nie można tym rzucić?|Katar! (catch a cold = przeziębić się)
4|How do bees get to school?|On the school buzz!|Jak pszczoły jeżdżą do szkoły?|Szkolnym bzzzusem! (buzz = bzyczenie, bus = autobus)
5|Why was the calendar so popular?|It had a lot of dates!|Dlaczego kalendarz był taki popularny?|Miał mnóstwo randek! (date = data i randka)
5|Why did the boy throw the clock out of the window?|He wanted to see time fly!|Dlaczego chłopiec wyrzucił zegar przez okno?|Chciał zobaczyć, jak czas leci! (time flies = czas leci)
5|Why did the robot go on holiday?|It needed to recharge its batteries!|Dlaczego robot pojechał na wakacje?|Musiał naładować baterie!
5|What do you call a snowman in summer?|A puddle!|Jak nazwać bałwana latem?|Kałuża!
5|Why is the letter A like a flower?|Because a B comes after it!|Dlaczego litera A jest jak kwiat?|Bo zaraz za nią leci B! (B brzmi jak bee = pszczoła)
6|What did one plate say to the other?|Dinner is on me!|Co jeden talerz powiedział do drugiego?|Obiad jest na mnie! (on me = na mnie i „ja stawiam”)
6|What do you call a lazy kangaroo?|A pouch potato!|Jak nazwać leniwego kangura?|Torbowy leniuch! (gra słów: couch potato = kanapowy leń)
6|Why did the man put his money in the freezer?|He wanted cold, hard cash!|Dlaczego pan schował pieniądze do zamrażarki?|Chciał mieć zimną gotówkę! (cold hard cash = żywa gotówka)
6|What do clouds wear?|Thunderwear!|Co noszą chmury?|Burzo-majtki! (underwear = bielizna, thunder = grzmot)
6|Why did the barber win the race?|He knew a short cut!|Dlaczego fryzjer wygrał wyścig?|Znał skrót! (short cut = skrót i krótkie strzyżenie)
7|I'm reading a book about anti-gravity.|It's impossible to put down!|Czytam książkę o antygrawitacji.|Nie da się jej odłożyć! (put down = odłożyć)
7|What do you call a deer with no eyes?|No idea!|Jak nazwać jelenia bez oczu?|Nie mam pojęcia! („no idea” brzmi jak „no eye deer” = jeleń bez oka)
7|Why did the student bring a pillow to the history lesson?|The teacher said it would be about the Dark Ages!|Dlaczego uczeń przyniósł poduszkę na historię?|Pani mówiła, że lekcja będzie o „ciemnych wiekach”! (Dark Ages = wczesne średniowiecze)
8|Why don't scientists trust atoms?|Because they make up everything!|Dlaczego naukowcy nie ufają atomom?|Bo one wszystko zmyślają! (make up = tworzyć i zmyślać)
8|What did the triangle say to the circle?|You're pointless!|Co trójkąt powiedział do koła?|Jesteś bez sensu! (pointless = bezsensowny, dosł. „bez rogów”)
0|What is black and white and eats bamboo?|A panda!|Kto jest czarno-biały i je bambus?|Panda!
0|Who says oink?|A pig!|Kto mówi „chrum”?|Świnka!
0|What is green and long and lives in a river?|A crocodile!|Kto jest zielony, długi i mieszka w rzece?|Krokodyl!
1|What has four wheels and goes beep beep?|A car!|Co ma cztery koła i robi „bip bip”?|Samochód!
1|Who sleeps all winter?|A bear!|Kto śpi całą zimę?|Niedźwiedź!
1|What has keys but no doors?|A piano!|Co ma klawisze, ale nie ma drzwi?|Pianino! (key = klucz i klawisz)
2|What is a frog's favourite drink?|Croak-a-cola!|Jaki jest ulubiony napój żaby?|Rechot-cola! (croak = rechotać, brzmi jak „coca-cola”)
3|Why did the cow cross the road?|To get to the udder side!|Dlaczego krowa przeszła przez drogę?|Żeby dostać się na drugą stronę! (udder = wymię, brzmi jak „other” = drugi)
4|Why are piggy banks so wise?|They are full of common cents!|Dlaczego świnki-skarbonki są takie mądre?|Bo są pełne zdrowego rozsądku! (cents = centy, brzmi jak „sense” = rozsądek)
5|What do you call a dog that can tell the time?|A watchdog!|Jak nazwać psa, który zna się na zegarku?|Pies-zegarek! (watchdog = pies stróżujący, watch = zegarek)
6|What has four wheels and flies?|A rubbish truck!|Co ma cztery koła i muchy?|Śmieciarka! (flies = lata i muchy)
7|What did the paper say to the pencil?|Write on!|Co kartka powiedziała do ołówka?|Pisz dalej! (write on brzmi jak „right on” = świetnie)
7|What do you call a pile of cats?|A meowtain!|Jak nazwać górę kotów?|Miaukowa góra! (meow + mountain = góra)
7|Why was the computer cold?|It left its Windows open!|Dlaczego komputer zmarzł?|Zostawił otwarte okna! (Windows = system komputera i okna)
8|What do you call a number that cannot keep still?|A roamin' numeral!|Jak nazwać liczbę, która nie usiedzi w miejscu?|Wędrowna liczba! (roaming = wędrujący, brzmi jak „Roman numeral” = cyfra rzymska)
8|Why are spiders great at the internet?|They know how to build websites!|Dlaczego pająki świetnie znają się na internecie?|Bo umieją budować strony! (web = pajęczyna i sieć, website = strona internetowa)
8|Why can't a nose be twelve inches long?|Because then it would be a foot!|Dlaczego nos nie może mieć dwunastu cali?|Bo wtedy byłby stopą! (12 cali to 1 stopa, a foot to też stopa)
8|What is a computer's favourite snack?|Microchips!|Jaka jest ulubiona przekąska komputera?|Mikrochipsy! (microchip = układ scalony, chips = chipsy)
`;

/** @type {Array<{id: string, level: number, enQuestion: string, enAnswer: string, plQuestion: string, plAnswer: string}>} */
const JOKES = JOKE_DATA.trim().split("\n").map((line, index) => {
  const [level, enQuestion, enAnswer, plQuestion, plAnswer] = line.split("|");
  return { id: `j${index + 1}`, level: Number(level), enQuestion, enAnswer, plQuestion, plAnswer };
});

/** Jokes suitable for a class: its own level and up to three levels below. */
const jokesForGrade = (grade) => JOKES.filter((joke) => joke.level <= grade && joke.level >= grade - 3);

/** Price in gems of one joke or riddle (games cost more, see games.js). */
const JOKE_PRICE = 3;
const jokePrice = () => JOKE_PRICE;
