import type { CitySpot, CountryProfile } from "@/data/types";
import { countryName } from "./country-name";
import type { Locale, Messages } from "./types";

const FALLBACK_TALE_3 = "Cada país guarda histórias únicas — volte em breve para ler as deste.";
const FALLBACK_OUTFIT = "roupa nas cores da bandeira deste país";

const TALES: Record<string, Partial<Record<Locale, string>>> = {
  "Saci-Pererê": {
    "en-GB": "Saci-Pererê",
    "de-DE": "Saci-Pererê",
    "fr-FR": "Saci-Pererê",
  },
  Curupira: {
    "en-GB": "Curupira",
    "de-DE": "Curupira",
    "fr-FR": "Curupira",
  },
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
  "Urashima Tarō": {
    "en-GB": "Urashima Tarō",
    "de-DE": "Urashima Tarō",
    "fr-FR": "Urashima Tarō",
  },
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
  "La Llorona": {
    "en-GB": "La Llorona",
    "de-DE": "La Llorona",
    "fr-FR": "La Llorona",
  },
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
  Quetzalcóatl: {
    "en-GB": "Quetzalcóatl",
    "de-DE": "Quetzalcóatl",
    "fr-FR": "Quetzalcóatl",
  },
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
  "Chapeuzinho Vermelho": {
    "en-GB": "Little Red Riding Hood",
    "de-DE": "Rotkäppchen",
    "fr-FR": "Le Petit Chaperon rouge",
  },
  "Branca de Neve": {
    "en-GB": "Snow White",
    "de-DE": "Schneewittchen",
    "fr-FR": "Blanche-Neige",
  },
  "Os Três Porquinhos": {
    "en-GB": "The Three Little Pigs",
    "de-DE": "Die drei kleinen Schweinchen",
    "fr-FR": "Les Trois Petits Cochons",
  },
  "Jack e o Pé de Feijão": {
    "en-GB": "Jack and the Beanstalk",
    "de-DE": "Hans und die Bohnenranke",
    "fr-FR": "Jack et le Haricot magique",
  },
  "João e Maria": {
    "en-GB": "Hansel and Gretel",
    "de-DE": "Hänsel und Gretel",
    "fr-FR": "Hansel et Gretel",
  },
  Rapunzel: {
    "en-GB": "Rapunzel",
    "de-DE": "Rapunzel",
    "fr-FR": "Raiponce",
  },
  Pinóquio: {
    "en-GB": "Pinocchio",
    "de-DE": "Pinocchio",
    "fr-FR": "Pinocchio",
  },
  "Robin Hood": {
    "en-GB": "Robin Hood",
    "de-DE": "Robin Hood",
    "fr-FR": "Robin des Bois",
  },
  "Rei Artur e Excalibur": {
    "en-GB": "King Arthur and Excalibur",
    "de-DE": "König Artus und Excalibur",
    "fr-FR": "Le roi Arthur et Excalibur",
  },
  "Pandora e a caixa": {
    "en-GB": "Pandora's Box",
    "de-DE": "Die Büchse der Pandora",
    "fr-FR": "La boîte de Pandore",
  },
  "Hércules e os doze trabalhos": {
    "en-GB": "Heracles and the Twelve Labours",
    "de-DE": "Herakles und die zwölf Aufgaben",
    "fr-FR": "Héraclès et les douze travaux",
  },
  "Dédalo e Ícaro": {
    "en-GB": "Daedalus and Icarus",
    "de-DE": "Daidalos und Ikarus",
    "fr-FR": "Dédale et Icare",
  },
  "O cavalo de Troia": {
    "en-GB": "The Trojan Horse",
    "de-DE": "Das Trojanische Pferd",
    "fr-FR": "Le cheval de Troie",
  },
  "Rip Van Winkle": {
    "en-GB": "Rip Van Winkle",
    "de-DE": "Rip Van Winkle",
    "fr-FR": "Rip Van Winkle",
  },
  "O Rei Macaco (Sun Wukong)": {
    "en-GB": "The Monkey King (Sun Wukong)",
    "de-DE": "Der Affenkönig (Sun Wukong)",
    "fr-FR": "Le Roi des singes (Sun Wukong)",
  },
  "Hua Mulan": {
    "en-GB": "Hua Mulan",
    "de-DE": "Hua Mulan",
    "fr-FR": "Hua Mulan",
  },
  "O Flautista de Hamelin": {
    "en-GB": "The Pied Piper of Hamelin",
    "de-DE": "Der Rattenfänger von Hameln",
    "fr-FR": "Le Joueur de flûte de Hamelin",
  },
  "Cú Chulainn": {
    "en-GB": "Cú Chulainn",
    "de-DE": "Cú Chulainn",
    "fr-FR": "Cú Chulainn",
  },
  "Fionn mac Cumhaill": {
    "en-GB": "Fionn mac Cumhaill",
    "de-DE": "Fionn mac Cumhaill",
    "fr-FR": "Fionn mac Cumhaill",
  },
  "Anansi, a aranha das histórias": {
    "en-GB": "Anansi, the storyteller spider",
    "de-DE": "Anansi, die Geschichtenspinne",
    "fr-FR": "Anansi, l’araignée conteuse",
  },
  "Paul Bunyan": {
    "en-GB": "Paul Bunyan",
    "de-DE": "Paul Bunyan",
    "fr-FR": "Paul Bunyan",
  },
  "Johnny Appleseed": {
    "en-GB": "Johnny Appleseed",
    "de-DE": "Johnny Appleseed",
    "fr-FR": "Johnny Appleseed",
  },
  "John Henry": {
    "en-GB": "John Henry",
    "de-DE": "John Henry",
    "fr-FR": "John Henry",
  },
  "Pecos Bill": {
    "en-GB": "Pecos Bill",
    "de-DE": "Pecos Bill",
    "fr-FR": "Pecos Bill",
  },
  "Teseu e o Minotauro": {
    "en-GB": "Theseus and the Minotaur",
    "de-DE": "Theseus und der Minotaurus",
    "fr-FR": "Thésée et le Minotaure",
  },
  "A lenda da Deusa Chang'e": {
    "en-GB": "The legend of Chang'e",
    "de-DE": "Die Legende von Chang'e",
    "fr-FR": "La légende de Chang'e",
  },
  "Nian, o monstro do Ano Novo": {
    "en-GB": "Nian, the New Year monster",
    "de-DE": "Nian, das Neujahrsmonster",
    "fr-FR": "Nian, le monstre du Nouvel An",
  },
  "O dragão e a pérola": {
    "en-GB": "The dragon and the pearl",
    "de-DE": "Der Drache und die Perle",
    "fr-FR": "Le dragon et la perle",
  },
  "Romulo e Remo": {
    "en-GB": "Romulus and Remus",
    "de-DE": "Romulus und Remus",
    "fr-FR": "Romulus et Rémus",
  },
  "A Befana": {
    "en-GB": "La Befana",
    "de-DE": "Die Befana",
    "fr-FR": "La Befana",
  },
  Pulcinella: {
    "en-GB": "Pulcinella",
    "de-DE": "Pulcinella",
    "fr-FR": "Pulcinella",
  },
  "Colombo e o ovo": {
    "en-GB": "Columbus and the egg",
    "de-DE": "Kolumbus und das Ei",
    "fr-FR": "Christophe Colomb et l’œuf",
  },
  "Heungbu e Nolbu": {
    "en-GB": "Heungbu and Nolbu",
    "de-DE": "Heungbu und Nolbu",
    "fr-FR": "Heungbu et Nolbu",
  },
  "A fada e o lenhador": {
    "en-GB": "The fairy and the woodcutter",
    "de-DE": "Die Fee und der Holzfäller",
    "fr-FR": "La fée et le bûcheron",
  },
  "Kongjwi e Patjwi": {
    "en-GB": "Kongjwi and Patjwi",
    "de-DE": "Kongjwi und Patjwi",
    "fr-FR": "Kongjwi et Patjwi",
  },
  "O tigre e o bolo de arroz": {
    "en-GB": "The tiger and the rice cake",
    "de-DE": "Der Tiger und der Reiskuchen",
    "fr-FR": "Le tigre et le gâteau de riz",
  },
  "O dragão do mar do Leste": {
    "en-GB": "The dragon of the Eastern Sea",
    "de-DE": "Der Drache des Ostmeers",
    "fr-FR": "Le dragon de la mer de l’Est",
  },
  "Malin Kundang": {
    "en-GB": "Malin Kundang",
    "de-DE": "Malin Kundang",
    "fr-FR": "Malin Kundang",
  },
  "A lenda do Lago Toba": {
    "en-GB": "The legend of Lake Toba",
    "de-DE": "Die Legende vom Tobasee",
    "fr-FR": "La légende du lac Toba",
  },
  "Roro Jonggrang": {
    "en-GB": "Roro Jonggrang",
    "de-DE": "Roro Jonggrang",
    "fr-FR": "Roro Jonggrang",
  },
  "Timun Mas": {
    "en-GB": "Timun Mas (the golden cucumber)",
    "de-DE": "Timun Mas (die goldene Gurke)",
    "fr-FR": "Timun Mas (le concombre d’or)",
  },
  "O dragão de Komodo (lenda da ilha)": {
    "en-GB": "The Komodo dragon (island legend)",
    "de-DE": "Der Komododrache (Insellegende)",
    "fr-FR": "Le dragon de Komodo (légende de l’île)",
  },
  "A serpente arco-íris": {
    "en-GB": "The Rainbow Serpent",
    "de-DE": "Die Regenbogenschlange",
    "fr-FR": "Le Serpent arc-en-ciel",
  },
  "Tiddalik, o sapo sedento": {
    "en-GB": "Tiddalik, the thirsty frog",
    "de-DE": "Tiddalik, der durstige Frosch",
    "fr-FR": "Tiddalik, la grenouille assoiffée",
  },
  "Como o canguru ganhou a bolsa": {
    "en-GB": "How the kangaroo got its pouch",
    "de-DE": "Wie das Känguru seinen Beutel bekam",
    "fr-FR": "Comment le kangourou eut sa poche",
  },
  "O sonho do Arco-Íris": {
    "en-GB": "The Rainbow Dream",
    "de-DE": "Der Traum vom Regenbogen",
    "fr-FR": "Le rêve de l’arc-en-ciel",
  },
  "Bunjil, a águia": {
    "en-GB": "Bunjil the eagle",
    "de-DE": "Bunjil, der Adler",
    "fr-FR": "Bunjil, l’aigle",
  },
  "Como as histórias chegaram ao mundo": {
    "en-GB": "How stories came into the world",
    "de-DE": "Wie die Geschichten in die Welt kamen",
    "fr-FR": "Comment les histoires sont venues au monde",
  },
  "A tartaruga e o leopardo": {
    "en-GB": "The tortoise and the leopard",
    "de-DE": "Die Schildkröte und der Leopard",
    "fr-FR": "La tortue et le léopard",
  },
  "O tambor falante": {
    "en-GB": "The talking drum",
    "de-DE": "Die sprechende Trommel",
    "fr-FR": "Le tambour parlant",
  },
  "O rio Volta encantado": {
    "en-GB": "The enchanted Volta River",
    "de-DE": "Der verzauberte Volta-Fluss",
    "fr-FR": "Le fleuve Volta enchanté",
  },
  "Anansi na savana": {
    "en-GB": "Anansi on the savanna",
    "de-DE": "Anansi in der Savanne",
    "fr-FR": "Anansi dans la savane",
  },
  "A lenda do baobá": {
    "en-GB": "The legend of the baobab",
    "de-DE": "Die Legende des Baobabs",
    "fr-FR": "La légende du baobab",
  },
  "Como a zebra ganhou as listras": {
    "en-GB": "How the zebra got its stripes",
    "de-DE": "Wie das Zebra zu seinen Streifen kam",
    "fr-FR": "Comment le zèbre eut ses rayures",
  },
  Tokoloshe: {
    "en-GB": "The Tokoloshe",
    "de-DE": "Der Tokoloshe",
    "fr-FR": "Le Tokoloshe",
  },
  "A rainha das chuvas": {
    "en-GB": "The queen of the rains",
    "de-DE": "Die Königin des Regens",
    "fr-FR": "La reine des pluies",
  },
  "O Leprechaun e o pote de ouro": {
    "en-GB": "The leprechaun and the pot of gold",
    "de-DE": "Der Leprechaun und der Goldtopf",
    "fr-FR": "Le leprechaun et le chaudron d’or",
  },
  "A Banshee (versão suave)": {
    "en-GB": "The banshee (gentle version)",
    "de-DE": "Die Banshee (sanfte Version)",
    "fr-FR": "La banshee (version douce)",
  },
  "O selkie do mar": {
    "en-GB": "The sea selkie",
    "de-DE": "Der Selkie des Meeres",
    "fr-FR": "Le selkie de la mer",
  },
  "Phra Aphai Mani": {
    "en-GB": "Phra Aphai Mani",
    "de-DE": "Phra Aphai Mani",
    "fr-FR": "Phra Aphai Mani",
  },
  "O macaco Hanuman no Ramakien": {
    "en-GB": "Hanuman the monkey in the Ramakien",
    "de-DE": "Der Affe Hanuman im Ramakien",
    "fr-FR": "Hanuman le singe dans le Ramakien",
  },
  "A lenda de Nang Nak (versão suave)": {
    "en-GB": "The legend of Nang Nak (gentle version)",
    "de-DE": "Die Legende von Nang Nak (sanfte Version)",
    "fr-FR": "La légende de Nang Nak (version douce)",
  },
  "A princesa e o naga": {
    "en-GB": "The princess and the naga",
    "de-DE": "Die Prinzessin und der Naga",
    "fr-FR": "La princesse et le nāga",
  },
  "Siddhidhat e o elefante branco": {
    "en-GB": "Siddhidhat and the white elephant",
    "de-DE": "Siddhidhat und der weiße Elefant",
    "fr-FR": "Siddhidhat et l’éléphant blanc",
  },
  "Nasreddin Hodja": {
    "en-GB": "Nasreddin Hodja",
    "de-DE": "Nasreddin Hodja",
    "fr-FR": "Nasreddin Hodja",
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

const FABLE_DATE_TEXT: Record<string, Partial<Record<Locale, string>>> = {
  "1697; later collected by the Grimms": {
    "pt-BR": "1697; mais tarde recolhida pelos Grimm",
    "de-DE": "1697; später von den Brüdern Grimm gesammelt",
    "fr-FR": "1697 ; recueilli plus tard par les frères Grimm",
  },
  "c. 1136": { "pt-BR": "c. 1136", "de-DE": "um 1136", "fr-FR": "vers 1136" },
  "c. 700 BCE": {
    "pt-BR": "c. 700 a.C.",
    "de-DE": "um 700 v. Chr.",
    "fr-FR": "vers 700 av. J.-C.",
  },
  "c. 4th–6th century": {
    "pt-BR": "c. séculos IV–VI",
    "de-DE": "um 4.–6. Jahrhundert",
    "fr-FR": "vers les IVe–VIe siècles",
  },
  "c. 5th century BCE–1st century CE": {
    "pt-BR": "c. século V a.C.–século I d.C.",
    "de-DE": "um 5. Jahrhundert v. Chr. bis 1. Jahrhundert n. Chr.",
    "fr-FR": "vers le Ve siècle av. J.-C. au Ier siècle apr. J.-C.",
  },
  "c. 3rd century BCE": {
    "pt-BR": "c. século III a.C.",
    "de-DE": "um 3. Jahrhundert v. Chr.",
    "fr-FR": "vers le IIIe siècle av. J.-C.",
  },
  "c. 2400 BCE": {
    "pt-BR": "c. 2400 a.C.",
    "de-DE": "um 2400 v. Chr.",
    "fr-FR": "vers 2400 av. J.-C.",
  },
  "19th century (written records)": {
    "pt-BR": "século XIX (registros escritos)",
    "de-DE": "19. Jahrhundert (schriftliche Aufzeichnungen)",
    "fr-FR": "XIXe siècle (sources écrites)",
  },
  "1284 (legend)": {
    "pt-BR": "1284 (lenda)",
    "de-DE": "1284 (Legende)",
    "fr-FR": "1284 (légende)",
  },
  "Pre-Hispanic; written versions from the 16th century": {
    "pt-BR": "pré-hispânica; versões escritas a partir do século XVI",
    "de-DE": "vorspanisch; schriftliche Fassungen ab dem 16. Jahrhundert",
    "fr-FR": "préhispanique ; versions écrites à partir du XVIe siècle",
  },
  "Han dynasty (206 BCE–220 CE)": {
    "pt-BR": "dinastia Han (206 a.C.–220 d.C.)",
    "de-DE": "Han-Dynastie (206 v. Chr.–220 n. Chr.)",
    "fr-FR": "dynastie Han (206 av. J.-C.–220 apr. J.-C.)",
  },
  "1st century BCE": {
    "pt-BR": "século I a.C.",
    "de-DE": "1. Jahrhundert v. Chr.",
    "fr-FR": "Ier siècle av. J.-C.",
  },
  "Ancient; versions span several centuries": {
    "pt-BR": "Antiga; versões desenvolvidas ao longo de vários séculos",
    "de-DE": "Antike; Fassungen entstanden über mehrere Jahrhunderte",
    "fr-FR": "Antiquité ; versions développées sur plusieurs siècles",
  },
  "Late 19th century": {
    "pt-BR": "final do século XIX",
    "de-DE": "spätes 19. Jahrhundert",
    "fr-FR": "fin du XIXe siècle",
  },
  "Medieval tradition": {
    "pt-BR": "tradição medieval",
    "de-DE": "mittelalterliche Überlieferung",
    "fr-FR": "tradition médiévale",
  },
  "8th-century Kojiki": {
    "pt-BR": "Kojiki, do século VIII",
    "de-DE": "Kojiki aus dem 8. Jahrhundert",
    "fr-FR": "Kojiki du VIIIe siècle",
  },
  "Ancient; written versions developed over centuries": {
    "pt-BR": "Antiga; versões escritas desenvolvidas ao longo dos séculos",
    "de-DE": "Antike; schriftliche Fassungen entwickelten sich über Jahrhunderte",
    "fr-FR": "Antiquité ; versions écrites développées au fil des siècles",
  },
  "Traditional Korean tale; date unknown": {
    "pt-BR": "conto tradicional coreano; data desconhecida",
    "de-DE": "traditionelles koreanisches Märchen; Datierung unbekannt",
    "fr-FR": "conte traditionnel coréen ; date inconnue",
  },
  "20th century (recorded version)": {
    "pt-BR": "século XX (versão registrada)",
    "de-DE": "20. Jahrhundert (aufgezeichnete Fassung)",
    "fr-FR": "XXe siècle (version consignée)",
  },
  "Ancient; sources span millennia": {
    "pt-BR": "Antiga; as fontes abrangem milênios",
    "de-DE": "Antike; die Quellen reichen über Jahrtausende",
    "fr-FR": "Antiquité ; les sources couvrent plusieurs millénaires",
  },
  "20th century (written record)": {
    "pt-BR": "século XX (registro escrito)",
    "de-DE": "20. Jahrhundert (schriftlicher Beleg)",
    "fr-FR": "XXe siècle (source écrite)",
  },
};

const FABLE_CREATOR_TEXT: Record<string, Partial<Record<Locale, string>>> = {
  "Charles Perrault (literary version)": {
    "pt-BR": "Charles Perrault (versão literária)",
    "de-DE": "Charles Perrault (literarische Fassung)",
    "fr-FR": "Charles Perrault (version littéraire)",
  },
  "Jacob and Wilhelm Grimm (collectors)": {
    "pt-BR": "Jacob e Wilhelm Grimm (coletores)",
    "de-DE": "Jacob und Wilhelm Grimm (Sammler)",
    "fr-FR": "Jacob et Wilhelm Grimm (collecteurs)",
  },
  "James Orchard Halliwell (collector)": {
    "pt-BR": "James Orchard Halliwell (coletor)",
    "de-DE": "James Orchard Halliwell (Sammler)",
    "fr-FR": "James Orchard Halliwell (collecteur)",
  },
  "Geoffrey of Monmouth (early chronicler)": {
    "pt-BR": "Geoffrey de Monmouth (cronista antigo)",
    "de-DE": "Geoffrey of Monmouth (früher Chronist)",
    "fr-FR": "Geoffrey de Monmouth (chroniqueur ancien)",
  },
  "Homer (traditional attribution)": {
    "pt-BR": "Homero (atribuição tradicional)",
    "de-DE": "Homer (traditionelle Zuschreibung)",
    "fr-FR": "Homère (attribution traditionnelle)",
  },
  "Anonymous court-era author": {
    "pt-BR": "autor anônimo do período da corte",
    "de-DE": "anonymer Autor aus der Hofzeit",
    "fr-FR": "auteur anonyme de l’époque de la cour",
  },
  "Traditionally attributed to Wu Cheng'en": {
    "pt-BR": "tradicionalmente atribuído a Wu Cheng'en",
    "de-DE": "traditionell Wu Cheng'en zugeschrieben",
    "fr-FR": "traditionnellement attribué à Wu Cheng'en",
  },
  "Traditionally attributed to Valmiki": {
    "pt-BR": "tradicionalmente atribuído a Valmiki",
    "de-DE": "traditionell Valmiki zugeschrieben",
    "fr-FR": "traditionnellement attribué à Valmiki",
  },
  "Traditionally attributed to Vishnu Sharma": {
    "pt-BR": "tradicionalmente atribuído a Vishnu Sharma",
    "de-DE": "traditionell Vishnu Sharma zugeschrieben",
    "fr-FR": "traditionnellement attribué à Vishnu Sharma",
  },
  "James MacGillivray (early printed account)": {
    "pt-BR": "James MacGillivray (relato impresso antigo)",
    "de-DE": "James MacGillivray (früher Druckbericht)",
    "fr-FR": "James MacGillivray (premier récit imprimé)",
  },
  "Based on John Chapman (1774–1845)": {
    "pt-BR": "baseado em John Chapman (1774–1845)",
    "de-DE": "nach John Chapman (1774–1845)",
    "fr-FR": "inspiré de John Chapman (1774–1845)",
  },
  "King Rama I's court (compiler)": {
    "pt-BR": "corte do rei Rama I (compilação)",
    "de-DE": "Hof von König Rama I (Sammlung)",
    "fr-FR": "cour du roi Rama Ier (compilation)",
  },
  "Pedro Linares (alebrijes tradition)": {
    "pt-BR": "Pedro Linares (tradição dos alebrijes)",
    "de-DE": "Pedro Linares (Alebrije-Tradition)",
    "fr-FR": "Pedro Linares (tradition des alebrijes)",
  },
};

function translateCenturyDate(date: string, locale: Locale): string {
  if (locale === "pt-BR") {
    return date.replace(/\b(\d+)(st|nd|rd|th) century\b/g, (_, number) => `século ${number}`);
  }
  if (locale === "de-DE") {
    return date.replace(/\b(\d+)(st|nd|rd|th) century\b/g, (_, number) => `${number}. Jahrhundert`);
  }
  return date.replace(/\b(\d+)(st|nd|rd|th) century\b/g, (_, number) => {
    const numeral = Number(number);
    return `${number}${numeral === 1 ? "er" : "e"} siècle`;
  });
}

export function localizeFableDate(date: string | null, locale: Locale): string | null {
  if (!date || locale === "en-GB") return date;
  const exact = FABLE_DATE_TEXT[date]?.[locale];
  if (exact) return exact;
  const approximate = date.replace(
    /^c\.\s*/,
    locale === "pt-BR" ? "c. " : locale === "de-DE" ? "um " : "vers ",
  );
  if (locale === "pt-BR") {
    return translateCenturyDate(approximate, locale)
      .replace(/\bBCE\b/g, "a.C.")
      .replace(/\bCE\b/g, "d.C.");
  }
  return translateCenturyDate(approximate, locale)
    .replace(/\bBCE\b/g, "v. Chr.")
    .replace(/\bCE\b/g, "n. Chr.");
}

export function localizeFableCreator(
  creator: string | undefined,
  locale: Locale,
): string | undefined {
  if (!creator || locale === "en-GB") return creator;
  return FABLE_CREATOR_TEXT[creator]?.[locale] ?? creator;
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
  if (
    city.spots === "gire o globo e descobre os vizinhos deste país" ||
    city.spots === "gire o globo e descubra os vizinhos deste país"
  ) {
    return {
      city: fill(messages.fallbackReturnCity, { name }),
      spots: messages.fallbackReturnSpot,
    };
  }
  if (
    city.spots === "explora o mapa e imagina as paisagens deste país" ||
    city.spots === "explore o mapa e imagine as paisagens deste país"
  ) {
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
      ? [fill(messages.fallbackTale1, { name }), messages.fallbackTale2, messages.fallbackTale3]
      : country.tales.map((title) => translateTale(title, locale)),
    cities: country.cities.map((city) => translateCity(city, name, messages)),
  };
}
