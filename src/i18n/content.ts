import type { CitySpot, CountryProfile } from "@/data/types";
import { countryName } from "./country-name";
import type { Locale, Messages } from "./types";

const FALLBACK_TALE_3 = "Cada país guarda histórias únicas — volte em breve para ler as deste.";
const FALLBACK_OUTFIT = "roupa nas cores da bandeira deste país";

const TALES: Record<string, Partial<Record<Locale, string>>> = {
  "Saci-Pererê": {},
  Curupira: {},
  "Iara, a mãe-d'água": {
    "en-GB": "Iara, mother of the waters",
    "de-DE": "Iara, die Mutter der Wasser",
    "fr-FR": "Iara, la mère des eaux",
  },
  "Boto-cor-de-rosa": {
    "en-GB": "The pink river dolphin",
    "de-DE": "Der rosarote Flussdelfin",
    "fr-FR": "Le dauphin rose",
  },
  "Lobisomem do sertão": {
    "en-GB": "The werewolf of the sertão",
    "de-DE": "Der Werwolf aus dem Sertão",
    "fr-FR": "Le loup-garou du sertão",
  },
  "Pedro e o lobo (versão popular)": {
    "en-GB": "Peter and the Wolf (folk version)",
    "de-DE": "Peter und der Wolf (volkstümlich)",
    "fr-FR": "Pierre et le loup (version populaire)",
  },
  "A lenda de D. Pedro e Inês": {
    "en-GB": "The legend of Dom Pedro and Inês",
    "de-DE": "Die Sage von Dom Pedro und Inês",
    "fr-FR": "La légende de Dom Pedro et Inês",
  },
  "O Galo de Barcelos": {
    "en-GB": "The Rooster of Barcelos",
    "de-DE": "Der Hahn von Barcelos",
    "fr-FR": "Le coq de Barcelos",
  },
  "A Moura Encantada": {
    "en-GB": "The Enchanted Moura",
    "de-DE": "Die verzauberte Moura",
    "fr-FR": "La Moura enchantée",
  },
  "O Homem do Saco": {
    "en-GB": "The Sack Man",
    "de-DE": "Der Sackmann",
    "fr-FR": "Le croque-mitaine",
  },
  "Momotarō, o menino-pêssego": {
    "en-GB": "Momotarō, the peach boy",
    "de-DE": "Momotarō, der Pfirsichjunge",
    "fr-FR": "Momotarō, le garçon-pêche",
  },
  "A Princesa Kaguya": {
    "en-GB": "Princess Kaguya",
    "de-DE": "Prinzessin Kaguya",
    "fr-FR": "La princesse Kaguya",
  },
  "Urashima Tarō": {},
  "O Coelho de Inaba": {
    "en-GB": "The Hare of Inaba",
    "de-DE": "Der Hase von Inaba",
    "fr-FR": "Le lièvre d’Inaba",
  },
  "Issun-bōshi, o polegarzinho": {
    "en-GB": "Issun-bōshi, the tiny samurai",
    "de-DE": "Issun-bōshi, der daumengroße Junge",
    "fr-FR": "Issun-bōshi, le petit poucet",
  },
  "Ísis e Osíris": {
    "en-GB": "Isis and Osiris",
    "de-DE": "Isis und Osiris",
    "fr-FR": "Isis et Osiris",
  },
  "O tesouro de Tutancâmon": {
    "en-GB": "The treasure of Tutankhamun",
    "de-DE": "Der Schatz des Tutanchamun",
    "fr-FR": "Le trésor de Toutânkhamon",
  },
  "O gato Bastet": {
    "en-GB": "The cat Bastet",
    "de-DE": "Die Katze Bastet",
    "fr-FR": "La chatte Bastet",
  },
  "A barca do Sol": {
    "en-GB": "The boat of the Sun",
    "de-DE": "Die Barke der Sonne",
    "fr-FR": "La barque du Soleil",
  },
  "Alibabá das areias (conto popular)": {
    "en-GB": "Alibaba of the sands (folk tale)",
    "de-DE": "Alibaba aus dem Sand (Volksmärchen)",
    "fr-FR": "Ali Baba des sables (conte populaire)",
  },
  "La Llorona": {},
  "Popocatépetl e Iztaccíhuatl": {
    "en-GB": "Popocatépetl and Iztaccíhuatl",
    "de-DE": "Popocatépetl und Iztaccíhuatl",
    "fr-FR": "Popocatépetl et Iztaccíhuatl",
  },
  "O Alebrije mágico": {
    "en-GB": "The magic alebrije",
    "de-DE": "Der magische Alebrije",
    "fr-FR": "L’alebrije magique",
  },
  Quetzalcóatl: {},
  "O tesouro do Chupacabra (lenda moderna)": {
    "en-GB": "The chupacabra’s treasure (modern legend)",
    "de-DE": "Der Schatz des Chupacabra (moderne Sage)",
    "fr-FR": "Le trésor du chupacabra (légende moderne)",
  },
  "O Pequeno Polegar": {
    "en-GB": "Little Thumb",
    "de-DE": "Der kleine Däumling",
    "fr-FR": "Le Petit Poucet",
  },
  "Cinderela (Perrault)": {
    "en-GB": "Cinderella (Perrault)",
    "de-DE": "Aschenputtel (Perrault)",
    "fr-FR": "Cendrillon (Perrault)",
  },
  "O Gato de Botas": {
    "en-GB": "Puss in Boots",
    "de-DE": "Der gestiefelte Kater",
    "fr-FR": "Le Chat botté",
  },
  "A Bela Adormecida": {
    "en-GB": "Sleeping Beauty",
    "de-DE": "Dornröschen",
    "fr-FR": "La Belle au bois dormant",
  },
  "Barba Azul": {
    "en-GB": "Bluebeard",
    "de-DE": "Blaubart",
    "fr-FR": "Barbe bleue",
  },
  "As fábulas de Panchatantra": {
    "en-GB": "The fables of the Panchatantra",
    "de-DE": "Die Fabeln des Panchatantra",
    "fr-FR": "Les fables du Panchatantra",
  },
  "Rama e Sita": {
    "en-GB": "Rama and Sita",
    "de-DE": "Rama und Sita",
    "fr-FR": "Rama et Sita",
  },
  "O elefante Ganesha": {
    "en-GB": "The elephant Ganesha",
    "de-DE": "Der Elefant Ganesha",
    "fr-FR": "L’éléphant Ganesha",
  },
  "A tartaruga e os gansos": {
    "en-GB": "The turtle and the geese",
    "de-DE": "Die Schildkröte und die Gänse",
    "fr-FR": "La tortue et les oies",
  },
  "Akbar e Birbal": {
    "en-GB": "Akbar and Birbal",
    "de-DE": "Akbar und Birbal",
    "fr-FR": "Akbar et Birbal",
  },
  "Como o leopardo ganhou as pintas": {
    "en-GB": "How the leopard got his spots",
    "de-DE": "Wie der Leopard seine Flecken bekam",
    "fr-FR": "Comment le léopard eut ses taches",
  },
  "Hare e o poço": {
    "en-GB": "Hare and the well",
    "de-DE": "Hase und der Brunnen",
    "fr-FR": "Le lièvre et le puits",
  },
  "A origem do Monte Quênia": {
    "en-GB": "The origin of Mount Kenya",
    "de-DE": "Der Ursprung des Mount Kenya",
    "fr-FR": "L’origine du mont Kenya",
  },
  "O elefante e o pássaro-tecelão": {
    "en-GB": "The elephant and the weaver bird",
    "de-DE": "Der Elefant und der Webervogel",
    "fr-FR": "L’éléphant et l’oiseau tisserand",
  },
  "Nyai e o gado do céu": {
    "en-GB": "Nyai and the cattle of the sky",
    "de-DE": "Nyai und die Rinder des Himmels",
    "fr-FR": "Nyai et le troupeau du ciel",
  },
  "A kianda do mar": {
    "en-GB": "The kianda of the sea",
    "de-DE": "Die Kianda des Meeres",
    "fr-FR": "La kianda de la mer",
  },
  "O soba e a árvore sagrada": {
    "en-GB": "The soba and the sacred tree",
    "de-DE": "Der Soba und der heilige Baum",
    "fr-FR": "Le soba et l’arbre sacré",
  },
  "Como o imbondeiro ficou torto": {
    "en-GB": "How the baobab grew crooked",
    "de-DE": "Wie der Baobab krumm wurde",
    "fr-FR": "Comment le baobab devint tordu",
  },
  "O coelho e o leão": {
    "en-GB": "The hare and the lion",
    "de-DE": "Der Hase und der Löwe",
    "fr-FR": "Le lièvre et le lion",
  },
  "A princesa Nzinga nas estrelas": {
    "en-GB": "Princess Nzinga in the stars",
    "de-DE": "Prinzessin Nzinga in den Sternen",
    "fr-FR": "La princesse Nzinga dans les étoiles",
  },
  "Maui pesca as ilhas": {
    "en-GB": "Māui fishes up the islands",
    "de-DE": "Māui angelt die Inseln",
    "fr-FR": "Māui pêche les îles",
  },
  "A lenda do kiwi": {
    "en-GB": "The legend of the kiwi",
    "de-DE": "Die Sage vom Kiwi",
    "fr-FR": "La légende du kiwi",
  },
  "Tāne e as florestas": {
    "en-GB": "Tāne and the forests",
    "de-DE": "Tāne und die Wälder",
    "fr-FR": "Tāne et les forêts",
  },
  "Kupe, o navegador": {
    "en-GB": "Kupe the navigator",
    "de-DE": "Kupe, der Seefahrer",
    "fr-FR": "Kupe le navigateur",
  },
  "O taniwha do rio": {
    "en-GB": "The taniwha of the river",
    "de-DE": "Der Taniwha des Flusses",
    "fr-FR": "Le taniwha de la rivière",
  },
};

const OUTFITS: Record<string, Partial<Record<Locale, string>>> = {
  "vestido de Festa Junina com bandeirinhas": {
    "en-GB": "June-festival dress with little flags",
    "de-DE": "Festkleid der Festa Junina mit Fähnchen",
    "fr-FR": "robe de Festa Junina avec des petits drapeaux",
  },
  "traje de folclore minhoto com barrete": {
    "en-GB": "Minho folk costume with a barrete cap",
    "de-DE": "Minho-Tracht mit Barrete-Mütze",
    "fr-FR": "costume folklorique du Minho avec un bonnet",
  },
  "quimono floral com obi e mei-pad": {
    "en-GB": "floral kimono with an obi sash",
    "de-DE": "geblümter Kimono mit Obi",
    "fr-FR": "kimono fleuri avec un obi",
  },
  "galabeya clara e colar dourado de escaravelho": {
    "en-GB": "pale galabeya and a golden scarab necklace",
    "de-DE": "helle Galabija und goldene Skarabäus-Kette",
    "fr-FR": "galabeya claire et collier scarabée doré",
  },
  "vestido típico de China Poblana e moño": {
    "en-GB": "China Poblana dress with a bow",
    "de-DE": "China-Poblana-Kleid mit Schleife",
    "fr-FR": "robe de China Poblana avec un nœud",
  },
  "listras bretãs, boina e lenço": {
    "en-GB": "Breton stripes, a beret and a scarf",
    "de-DE": "bretonische Streifen, Baskenmütze und Schal",
    "fr-FR": "rayures bretonnes, béret et foulard",
  },
  "sari brilhante com bindi e pulseiras": {
    "en-GB": "bright sari with a bindi and bangles",
    "de-DE": "leuchtender Sari mit Bindi und Armreifen",
    "fr-FR": "sari brillant avec bindi et bracelets",
  },
  "shuka maasai vermelha com contas": {
    "en-GB": "red Maasai shuka with beads",
    "de-DE": "roter Maasai-Shuka mit Perlen",
    "fr-FR": "shuka massaï rouge avec des perles",
  },
  "pano africano estampado e colares": {
    "en-GB": "printed African cloth and necklaces",
    "de-DE": "gemusterter afrikanischer Stoff und Ketten",
    "fr-FR": "tissu africain imprimé et colliers",
  },
  "piupiu maori e pingentes de pounamu": {
    "en-GB": "Māori piupiu and pounamu pendants",
    "de-DE": "maorischer Piupiu und Pounamu-Anhänger",
    "fr-FR": "piupiu maori et pendentifs de pounamu",
  },
};

const PHRASES: Record<Exclude<Locale, "pt-BR">, [string, string][]> = {
  "en-GB": [
    ["traje folclórico", "folk costume"],
    ["traje de", "costume of"],
    ["traje", "costume"],
    ["vestido de", "dress of"],
    ["vestido", "dress"],
    ["chapéu de", "hat of"],
    ["chapéu", "hat"],
    ["com flores", "with flowers"],
    ["flores", "flowers"],
    ["bordado", "embroidered"],
    ["bordada", "embroidered"],
    ["colorido", "colourful"],
    ["colorida", "colourful"],
    ["vermelho", "red"],
    ["vermelha", "red"],
    ["branco", "white"],
    ["branca", "white"],
    ["azul", "blue"],
    ["dourado", "golden"],
    ["dourada", "golden"],
    ["saia", "skirt"],
    ["colete", "waistcoat"],
    ["lenço", "scarf"],
    ["de seda", "of silk"],
    ["estampado", "printed"],
    ["estampada", "printed"],
    ["e ", "and "],
    ["com ", "with "],
  ],
  "de-DE": [
    ["traje folclórico", "Volkstracht"],
    ["traje de", "Tracht aus"],
    ["traje", "Tracht"],
    ["vestido de", "Kleid aus"],
    ["vestido", "Kleid"],
    ["chapéu de", "Hut aus"],
    ["chapéu", "Hut"],
    ["com flores", "mit Blumen"],
    ["flores", "Blumen"],
    ["bordado", "bestickt"],
    ["bordada", "bestickt"],
    ["colorido", "bunt"],
    ["colorida", "bunt"],
    ["vermelho", "rot"],
    ["vermelha", "rot"],
    ["branco", "weiß"],
    ["branca", "weiß"],
    ["azul", "blau"],
    ["dourado", "golden"],
    ["dourada", "golden"],
    ["saia", "Rock"],
    ["colete", "Weste"],
    ["lenço", "Tuch"],
    ["de seda", "aus Seide"],
    ["estampado", "gemustert"],
    ["estampada", "gemustert"],
    ["e ", "und "],
    ["com ", "mit "],
  ],
  "fr-FR": [
    ["traje folclórico", "costume folklorique"],
    ["traje de", "costume de"],
    ["traje", "costume"],
    ["vestido de", "robe de"],
    ["vestido", "robe"],
    ["chapéu de", "chapeau de"],
    ["chapéu", "chapeau"],
    ["com flores", "avec des fleurs"],
    ["flores", "fleurs"],
    ["bordado", "brodé"],
    ["bordada", "brodée"],
    ["colorido", "coloré"],
    ["colorida", "colorée"],
    ["vermelho", "rouge"],
    ["vermelha", "rouge"],
    ["branco", "blanc"],
    ["branca", "blanche"],
    ["azul", "bleu"],
    ["dourado", "doré"],
    ["dourada", "dorée"],
    ["saia", "jupe"],
    ["colete", "gilet"],
    ["lenço", "foulard"],
    ["de seda", "de soie"],
    ["estampado", "imprimé"],
    ["estampada", "imprimée"],
    ["e ", "et "],
    ["com ", "avec "],
  ],
};

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

function translateOutfit(outfit: string, locale: Locale, messages: Messages): string {
  if (locale === "pt-BR") {
    return outfit === FALLBACK_OUTFIT ? messages.fallbackOutfit : outfit;
  }
  if (outfit === FALLBACK_OUTFIT) return messages.fallbackOutfit;
  const exact = OUTFITS[outfit]?.[locale];
  if (exact) return exact;
  let next = outfit;
  for (const [from, to] of PHRASES[locale]) next = next.split(from).join(to);
  return next;
}

function translateTale(title: string, locale: Locale): string {
  if (locale === "pt-BR") return title;
  return TALES[title]?.[locale] ?? title;
}

function translateCity(city: CitySpot, name: string, messages: Messages): CitySpot {
  if (city.spots === "paisagens e monumentos famosos") {
    return { ...city, spots: messages.fallbackSpotFamous };
  }
  if (city.spots === "gire o globo e descobre os vizinhos deste país" || city.spots === "gire o globo e descubra os vizinhos deste país") {
    return { city: fill(messages.fallbackReturnCity, { name }), spots: messages.fallbackReturnSpot };
  }
  if (city.spots === "explora o mapa e imagina as paisagens deste país" || city.spots === "explore o mapa e imagine as paisagens deste país") {
    return { ...city, spots: messages.fallbackExploreSpot };
  }
  return city;
}

export function localizeCountry(
  country: CountryProfile,
  locale: Locale,
  messages: Messages,
): CountryProfile {
  const name = countryName(country.iso, locale, country.name);
  const fallback = country.tales[2] === FALLBACK_TALE_3;
  return {
    ...country,
    name,
    outfit: translateOutfit(country.outfit, locale, messages),
    tales: fallback
      ? [
          fill(messages.fallbackTale1, { name }),
          messages.fallbackTale2,
          messages.fallbackTale3,
        ]
      : country.tales.map((title) => translateTale(title, locale)),
    cities: country.cities.map((city) => translateCity(city, name, messages)),
  };
}
