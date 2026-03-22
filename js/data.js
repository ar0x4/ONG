// ONG — Operation Name Generator: Data Layer

const MODIFIERS = [
  "CRIMSON", "DARK", "IRON", "SILENT", "OBSIDIAN", "FROZEN", "BURNING",
  "PHANTOM", "BLACK", "SHADOW", "STEEL", "STORM", "FALLEN", "ETERNAL",
  "HOLLOW", "BLEEDING", "BROKEN", "DIRE", "ASHEN", "SPECTRAL", "SCARLET",
  "VOID", "GRIM", "SAVAGE", "WICKED", "ROGUE", "RAPID", "COVERT",
  "LETHAL", "FERAL", "ARCTIC", "INFERNAL", "GHOSTLY", "CURSED", "PRIMAL",
  "DEEP", "BLIND", "LOST", "ANCIENT", "FINAL", "HIDDEN", "MOLTEN",
  "RAVEN", "DIRE", "SHATTERED", "RISING", "SEARING", "TWISTED", "GOLDEN",
  "EMERALD", "ONYX", "SILVER", "BLOOD", "NIGHT", "DEAD", "COLD"
];

const NOUNS = {
  norse: [
    "ODIN", "THOR", "FENRIR", "MJOLNIR", "RAGNAROK", "VALKYRIE",
    "YGGDRASIL", "LOKI", "FREYA", "HEIMDALL", "SURTR", "JORMUNGANDR",
    "BIFROST", "NIDHOGG", "SKOLL", "HATI", "TYR", "BALDUR", "HUGINN",
    "MUNINN", "SLEIPNIR", "ASGARD", "VALHALLA", "BERSERKER"
  ],
  greek: [
    "CERBERUS", "HYDRA", "TITAN", "OLYMPUS", "CHIMERA", "PROMETHEUS",
    "MEDUSA", "MINOTAUR", "PHOENIX", "ARES", "ATHENA", "HADES",
    "POSEIDON", "KRATOS", "NEMESIS", "ICARUS", "TYPHON", "STYX",
    "TARTARUS", "CHRONOS"
  ],
  egyptian: [
    "ANUBIS", "OSIRIS", "SCARAB", "SPHINX", "HORUS", "SETH",
    "PHARAOH", "THOTH", "BASTET", "SOBEK", "KHEPRI", "AMMIT",
    "APOPHIS", "SEKHMET", "WADJET"
  ],
  sumerian: [
    "TIAMAT", "MARDUK", "ENKI", "GILGAMESH", "ISHTAR", "ENLIL",
    "NERGAL", "ERESHKIGAL", "SHAMASH", "PAZUZU", "NAMTAR", "ABZU"
  ],
  celtic: [
    "MORRIGAN", "DAGDA", "BANSHEE", "SIDHE", "AVALON", "CERNUNNOS",
    "BRIGID", "DULLAHAN", "NUADA", "BALOR", "SCATHACH", "CUCHULAINN"
  ],
  military: [
    "VIPER", "SENTINEL", "BASTION", "RAPTOR", "SIEGE", "RECON",
    "SABRE", "DAGGER", "SPECTRE", "TALON", "FORTRESS", "BULWARK",
    "AMBUSH", "TRIDENT", "WARDEN", "STRIKER", "OUTPOST", "OVERLORD",
    "DRAGNET", "PHALANX"
  ],
  weather: [
    "TEMPEST", "AVALANCHE", "TYPHOON", "ECLIPSE", "INFERNO",
    "TSUNAMI", "BLIZZARD", "CYCLONE", "MAELSTROM", "MONSOON",
    "FIRESTORM", "HAILSTORM", "VORTEX", "WHITEOUT", "ERUPTION"
  ],
  celestial: [
    "NEBULA", "PULSAR", "NOVA", "VOID", "QUASAR", "AURORA",
    "ECLIPSE", "SOLARIS", "COSMOS", "ZENITH", "PERIHELION",
    "SINGULARITY", "SUPERNOVA", "HORIZON", "PARALLAX"
  ],
  cyber: [
    "CIPHER", "ENIGMA", "ZERO-DAY", "ROOTKIT", "VECTOR",
    "PAYLOAD", "DAEMON", "FIREWALL", "BACKDOOR", "EXPLOIT",
    "HASHBREAK", "OVERFLOW", "TROJAN", "KEYLOG", "SANDBOX"
  ],
  historical: [
    "THERMOPYLAE", "HASTINGS", "STALINGRAD", "VERDUN", "MIDWAY",
    "ALAMO", "CANNAE", "AGINCOURT", "GETTYSBURG", "WATERLOO",
    "MARATHON", "SOMME", "KURSK", "GALLIPOLI", "RORKE"
  ],
  chess: [
    "GAMBIT", "ZUGZWANG", "ENDGAME", "CASTLING", "CHECKMATE",
    "STALEMATE", "KINGSIDE", "FIANCHETTO", "SKEWER", "FORK"
  ],
  elements: [
    "COBALT", "TITANIUM", "OBSIDIAN", "MERCURY", "TUNGSTEN",
    "URANIUM", "PLUTONIUM", "OSMIUM", "IRIDIUM", "CHROMIUM",
    "BISMUTH", "PHOSPHORUS", "ARGON", "RADIUM", "CARBON"
  ],
  weapons: [
    "EXCALIBUR", "GUNGNIR", "KUSANAGI", "DURANDAL", "MJOLNIR",
    "LONGINUS", "GAEBOLG", "MASAMUNE", "TYRFING", "CLARENT",
    "ARONDIGHT", "FRAGARACH"
  ],
  predators: [
    "WOLF", "HAWK", "COBRA", "PANTHER", "KRAKEN", "SCORPION",
    "FALCON", "MANTIS", "BARRACUDA", "JACKAL", "LYNX", "VENOM",
    "RAPTOR", "PYTHON", "WOLVERINE"
  ]
};

const THEME_META = {
  norse:      { name: "Norse",       icon: "⚡" },
  greek:      { name: "Greek",       icon: "🏛" },
  egyptian:   { name: "Egyptian",    icon: "𓂀" },
  sumerian:   { name: "Sumerian",    icon: "𒀭" },
  celtic:     { name: "Celtic",      icon: "☘" },
  military:   { name: "Military",    icon: "🎖" },
  weather:    { name: "Weather",     icon: "🌪" },
  celestial:  { name: "Celestial",   icon: "✦" },
  cyber:      { name: "Cyber",       icon: "⟁" },
  historical: { name: "Historical",  icon: "⚔" },
  chess:      { name: "Chess",       icon: "♞" },
  elements:   { name: "Elements",    icon: "⬡" },
  weapons:    { name: "Weapons",     icon: "🗡" },
  predators:  { name: "Predators",   icon: "🐺" }
};

const CATEGORIES = {
  mythology: {
    name: "Mythology",
    icon: "⚡",
    themes: ["norse", "greek", "egyptian", "sumerian", "celtic"]
  },
  tactical: {
    name: "Tactical",
    icon: "🎖",
    themes: ["military", "historical", "weapons"]
  },
  nature: {
    name: "Nature",
    icon: "🌪",
    themes: ["weather", "celestial", "elements"]
  },
  cyber: {
    name: "Cyber",
    icon: "⟁",
    themes: ["cyber", "chess"]
  },
  predators: {
    name: "Predators",
    icon: "🐺",
    themes: ["predators"]
  }
};

const KEYWORD_MAP = {
  "bank":        ["elements", "military", "chess"],
  "finance":     ["elements", "chess", "greek"],
  "hospital":    ["greek", "weather", "elements"],
  "medical":     ["greek", "celtic", "elements"],
  "energy":      ["celestial", "weather", "norse"],
  "power":       ["norse", "celestial", "elements"],
  "tech":        ["cyber", "celestial", "chess"],
  "software":    ["cyber", "chess", "celestial"],
  "government":  ["military", "historical", "norse"],
  "defense":     ["military", "weapons", "predators"],
  "military":    ["military", "weapons", "historical"],
  "telecom":     ["cyber", "celestial", "elements"],
  "network":     ["cyber", "celestial", "predators"],
  "oil":         ["elements", "weather", "sumerian"],
  "mining":      ["elements", "norse", "sumerian"],
  "water":       ["weather", "greek", "celestial"],
  "ocean":       ["weather", "greek", "predators"],
  "air":         ["celestial", "weather", "predators"],
  "fire":        ["weather", "norse", "sumerian"],
  "space":       ["celestial", "greek", "cyber"],
  "nuclear":     ["elements", "celestial", "military"],
  "pharma":      ["egyptian", "greek", "elements"],
  "crypto":      ["cyber", "chess", "elements"],
  "hack":        ["cyber", "predators", "chess"],
  "forensic":    ["egyptian", "cyber", "historical"],
  "incident":    ["weather", "military", "predators"],
  "threat":      ["predators", "military", "norse"],
  "malware":     ["cyber", "predators", "egyptian"],
  "ransom":      ["cyber", "norse", "historical"],
  "phish":       ["predators", "cyber", "weather"],
  "intel":       ["military", "chess", "cyber"],
  "recon":       ["military", "predators", "celtic"],
  "exfil":       ["cyber", "military", "predators"],
  "persist":     ["cyber", "norse", "egyptian"],
  "lateral":     ["chess", "military", "cyber"],
  "privilege":   ["chess", "norse", "greek"],
  "supply":      ["military", "historical", "elements"],
  "cloud":       ["celestial", "weather", "cyber"],
  "data":        ["cyber", "elements", "celestial"],
  "server":      ["cyber", "military", "elements"],
  "transport":   ["military", "weather", "predators"],
  "logistics":   ["military", "chess", "historical"],
  "retail":      ["elements", "chess", "predators"],
  "education":   ["greek", "celtic", "celestial"],
  "media":       ["cyber", "celestial", "greek"],
  "legal":       ["greek", "historical", "chess"],
  "insurance":   ["elements", "weather", "chess"],
  "agriculture": ["celtic", "weather", "sumerian"],
  "construct":   ["norse", "elements", "military"],
  "manufact":    ["elements", "military", "norse"]
};
