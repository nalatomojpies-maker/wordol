"use strict";

/**
 * Pictures for concrete words. Key = lowercase English word, or "topicId:word" when the topic matters.
 * Every emoji is used once (checked by tests), so one picture never fits two different answers.
 * Flags are deliberately not used: Windows shows them as letters.
 * @type {Readonly<Record<string, string>>}
 */
const WORD_EMOJI = {
  // colours & numbers (colours:orange is only used by the learning path)
  "colours:red": "🔴", "colours:blue": "🔵", "colours:green": "🟢", "colours:yellow": "🟡", "colours:black": "⚫",
  "colours:white": "⚪", "colours:pink": "💗", "colours:brown": "🟤", "colours:purple": "🟣", "colours:orange": "🟠",
  "numbers:one": "1️⃣", "numbers:two": "2️⃣", "numbers:three": "3️⃣", "numbers:four": "4️⃣", "numbers:five": "5️⃣",
  "numbers:six": "6️⃣", "numbers:seven": "7️⃣", "numbers:eight": "8️⃣", "numbers:nine": "9️⃣", "numbers:ten": "🔟", "one hundred": "💯",
  // family
  head: "🗣️", mum: "👩", dad: "👨", baby: "👶", grandma: "👵", grandpa: "👴", boy: "👦", girl: "👧", family: "👨‍👩‍👧",
  // body
  eye: "👁️", nose: "👃", mouth: "👄", ear: "👂", hand: "✋", face: "🙂", hair: "💇", arm: "💪", leg: "🦵", foot: "🦶",
  finger: "☝️", tooth: "🦷", tongue: "👅", heart: "❤️", brain: "🧠", bone: "🦴",
  // animals
  cat: "🐱", dog: "🐶", bird: "🐦", fish: "🐟", rabbit: "🐰", duck: "🦆", cow: "🐮", pig: "🐷", horse: "🐴", sheep: "🐑",
  hen: "🐔", mouse: "🐭", frog: "🐸", lion: "🦁", elephant: "🐘", monkey: "🐵", tiger: "🐯", bear: "🐻", giraffe: "🦒",
  zebra: "🦓", snake: "🐍", spider: "🕷️", butterfly: "🦋", wolf: "🐺", fox: "🦊", crocodile: "🐊", parrot: "🦜",
  dolphin: "🐬", whale: "🐋", shark: "🦈", penguin: "🐧", owl: "🦉", bee: "🐝", turtle: "🐢", squirrel: "🐿️", camel: "🐫",
  kangaroo: "🦘", deer: "🦌", goat: "🐐", eagle: "🦅", hedgehog: "🦔", bat: "🦇", rat: "🐀", swan: "🦢", lizard: "🦎", insect: "🐛",
  // toys & celebrations
  ball: "⚽", doll: "🎎", "teddy bear": "🧸", kite: "🪁", balloon: "🎈", puzzle: "🧩", block: "🧱", robot: "🤖", present: "🎁",
  birthday: "🎂", christmas: "🎄", easter: "🐣", candle: "🕯️",
  // school
  book: "📖", pen: "🖊️", pencil: "✏️", ruler: "📏", crayon: "🖍️", paper: "📄", teacher: "🧑‍🏫", pupil: "🧒", notebook: "📓",
  scissors: "✂️", school: "🏫", "school bag": "🎒", art: "🖼️", maths: "➗", history: "🏺", geography: "🌐",
  // food
  milk: "🥛", bread: "🍞", cake: "🍰", "ice cream": "🍦", egg: "🥚", water: "💧", juice: "🧃", cheese: "🧀", chocolate: "🍫",
  pizza: "🍕", butter: "🧈", sandwich: "🥪", soup: "🍲", chicken: "🍗", rice: "🍚", salad: "🥗", tea: "🍵", meat: "🥩",
  salt: "🧂", coffee: "☕", biscuit: "🍪", sausage: "🌭", pasta: "🍝", pancake: "🥞", honey: "🍯", hamburger: "🍔",
  chips: "🍟", sweets: "🍬",
  // fruit & vegetables
  apple: "🍎", banana: "🍌", orange: "🍊", strawberry: "🍓", grapes: "🍇", pear: "🍐", lemon: "🍋", cherry: "🍒",
  potato: "🥔", tomato: "🍅", carrot: "🥕", watermelon: "🍉", onion: "🧅", cucumber: "🥒", lettuce: "🥬", pepper: "🫑",
  mushroom: "🍄", pineapple: "🍍", peach: "🍑", melon: "🍈", garlic: "🧄", corn: "🌽", broccoli: "🥦", coconut: "🥥", pumpkin: "🎃",
  // home
  house: "🏠", bed: "🛏️", door: "🚪", chair: "🪑", sofa: "🛋️", shower: "🚿", bath: "🛁",
  // clothes
  hat: "🎩", shoes: "👞", socks: "🧦", "t-shirt": "👕", dress: "👗", jeans: "👖", cap: "🧢", coat: "🧥", shirt: "👔",
  boots: "🥾", scarf: "🧣", gloves: "🧤", shorts: "🩳", trainers: "👟", wristwatch: "⌚", glasses: "👓", bag: "👜",
  umbrella: "☂️", swimsuit: "👙",
  // weather & time
  sun: "☀️", rain: "🌧️", snow: "❄️", cloud: "☁️", wind: "🌬️", storm: "⛈️", ice: "🧊", rainbow: "🌈", lightning: "⚡",
  fog: "🌫️", tornado: "🌪️", hurricane: "🌀", night: "🌃", morning: "🌅", evening: "🌆", week: "📆", calendar: "🗓️", hour: "⏳",
  // sport & hobby
  basketball: "⛹️", tennis: "🎾", volleyball: "🏐", swimming: "🏊", skiing: "🎿", skating: "⛸️", hockey: "🏒", medal: "🏅",
  cycling: "🚴", running: "🏃", gymnastics: "🤸", dancing: "🕺", golf: "⛳", boxing: "🥊", rugby: "🏉", champion: "🏆",
  climbing: "🧗", surfing: "🏄", music: "🎵", guitar: "🎸", piano: "🎹", drums: "🥁", cinema: "🎬", film: "🎞️",
  singing: "🎶", chess: "♟️", magazine: "📰", party: "🎉", violin: "🎻", trumpet: "🎺", reading: "📕",
  // town & travel
  shop: "🏪", park: "🏞️", hospital: "🏥", supermarket: "🛒", bank: "🏦", church: "⛪", museum: "🏛️", restaurant: "🍽️",
  bridge: "🌉", theatre: "🎭", "post office": "🏤", "traffic lights": "🚦", castle: "🏰", tower: "🗼", statue: "🗽",
  fountain: "⛲", factory: "🏭", city: "🏙️", village: "🏘️", "bus stop": "🚏",
  car: "🚗", bus: "🚌", train: "🚆", tram: "🚋", bike: "🚲", plane: "✈️", ship: "🚢", boat: "⛵", taxi: "🚕",
  motorbike: "🏍️", lorry: "🚚", ticket: "🎫", passport: "🛂", suitcase: "🧳", hotel: "🏨", map: "🗺️", beach: "🏖️",
  tent: "⛺", underground: "🚇", ferry: "⛴️",
  // jobs
  doctor: "🧑‍⚕️", policeman: "👮", firefighter: "🧑‍🚒", farmer: "🧑‍🌾", cook: "🧑‍🍳", pilot: "🧑‍✈️", artist: "🧑‍🎨",
  scientist: "🧑‍🔬", singer: "🧑‍🎤", judge: "🧑‍⚖️", mechanic: "🧑‍🔧", soldier: "💂", astronaut: "🧑‍🚀",
  // nature & tech
  tree: "🌳", flower: "🌸", grass: "🌿", sea: "🌊", moon: "🌙", star: "⭐", forest: "🌲", mountain: "⛰️", island: "🏝️",
  earth: "🌍", desert: "🏜️", leaf: "🍃", fire: "🔥", volcano: "🌋", planet: "🪐", rocket: "🚀", seed: "🌱",
  computer: "🖥️", laptop: "💻", "mobile phone": "📱", keyboard: "⌨️", headphones: "🎧", camera: "📷", tv: "📺",
  radio: "📻", battery: "🔋", printer: "🖨️", email: "📧", game: "🎮", video: "📹", link: "🔗",
  // feelings, actions, phrases
  happy: "😊", sad: "😢", angry: "😠", tired: "🥱", hot: "🥵", cold: "🥶", hungry: "🤤", funny: "😂", ill: "🤒", clever: "🤓",
  sleep: "😴", clap: "👏", sing: "🎤", dance: "💃", eat: "😋", drink: "🥤", walk: "🚶", look: "👀", write: "✍️", wash: "🧼",
  buy: "🛍️", love: "😍", like: "👍", think: "🤔", "wake up": "⏰", "go to bed": "🛌", invite: "💌", dream: "💭",
  hello: "👋", yes: "✅", no: "❌", "thank you": "🙏", "good night": "💤", "good morning": "🌞", congratulations: "🎊", "good luck": "🍀",
  // shopping, health, environment, science, media
  money: "💰", euro: "💶", pound: "💷", "credit card": "💳", basket: "🧺", receipt: "🧾",
  medicine: "💊", ambulance: "🚑", fever: "🌡️", vaccination: "💉",
  recycle: "♻️", rubbish: "🗑️", energy: "🔌", experiment: "⚗️", space: "🌌", magnet: "🧲", microscope: "🔬", newspaper: "🗞️",
};
