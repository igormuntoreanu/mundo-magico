import type { Locale } from "@/i18n/types";
import raw from "./dish-photos.json";

/** A photograph of one national dish, always free for commercial reuse and credited. */
export type DishPhoto = {
  src: string;
  credit: string;
  href: string;
  kind: "photo";
  objectPosition?: "top" | "center" | "bottom";
};

export type LocalizedText = Record<Locale, string>;

export type Dish = {
  slug: string;
  /** Local name of the dish; kept in its own words in every language. */
  name: LocalizedText;
  /** One easy-read line for a reader of eight to ten. */
  note: LocalizedText;
  /**
   * Photo policy flag: the dish is served on a plate, so its photo has to show
   * it on a plate. Hand food (bread, sweets) is photographed as it is served,
   * without inventing a plate for it. Not rendered in the UI — it is the
   * checklist used when the photo is chosen.
   */
  plated: boolean;
  photos: DishPhoto[];
};

type Editorial = Omit<Dish, "photos">;

/** Names that stay in their own language, the way a menu abroad would print them. */
function localName(name: string): LocalizedText {
  return { "pt-BR": name, "en-GB": name, "de-DE": name, "fr-FR": name };
}

/**
 * Signature dishes per country, released in waves: Brazil, then South America,
 * then Central America, then North America. A country missing here gets no
 * dishes section — no placeholder text. A country may carry two dishes when a
 * third has no photo that passes the check; it is never padded with a guess.
 */
const DISHES: Partial<Record<string, Editorial[]>> = {
  br: [
    {
      slug: "feijoada",
      plated: true,
      name: localName("Feijoada"),
      note: {
        "pt-BR": "Feijão preto cozido com carne de porco. Come-se com arroz, couve e laranja.",
        "en-GB": "Black beans cooked with pork. It comes with rice, greens and orange slices.",
        "de-DE":
          "Schwarze Bohnen, mit Schweinefleisch gekocht. Dazu gibt es Reis, Grünkohl und Orangen.",
        "fr-FR":
          "Des haricots noirs cuits avec du porc. On les sert avec du riz, du chou frisé et de l'orange.",
      },
    },
    {
      slug: "pao-de-queijo",
      plated: false,
      name: localName("Pão de queijo"),
      note: {
        "pt-BR": "Pãezinhos redondos de queijo, macios por dentro e crocantes por fora.",
        "en-GB": "Round cheese rolls, soft inside and crisp outside.",
        "de-DE": "Runde Käsebrötchen, innen weich und außen knusprig.",
        "fr-FR": "De petits pains ronds au fromage, moelleux dedans et croustillants dehors.",
      },
    },
    {
      slug: "brigadeiro",
      plated: false,
      name: localName("Brigadeiro"),
      note: {
        "pt-BR": "Doce de chocolate enrolado em bolinhas e coberto com granulado.",
        "en-GB": "A chocolate sweet rolled into little balls and covered with sprinkles.",
        "de-DE": "Eine Schokoladensüßigkeit, zu Kugeln gerollt und mit Streuseln bestreut.",
        "fr-FR": "Une friandise au chocolat roulée en boules et couverte de vermicelles.",
      },
    },
  ],
  ar: [
    {
      slug: "asado",
      plated: true,
      name: localName("Asado"),
      note: {
        "pt-BR": "Carne e linguiça assadas na grelha, que aqui se chama parrilla.",
        "en-GB": "Meat and sausage cooked on the grill, which here is called the parrilla.",
        "de-DE": "Fleisch und Wurst vom Grill, der hier Parrilla heißt.",
        "fr-FR": "De la viande et des saucisses grillées sur la parrilla.",
      },
    },
    {
      slug: "empanadas",
      plated: false,
      name: localName("Empanadas"),
      note: {
        "pt-BR": "Pastéis de massa assada com recheio de carne, cebola e ovo.",
        "en-GB": "Baked pastries filled with beef, onion and egg.",
        "de-DE": "Gebackene Teigtaschen mit Rindfleisch, Zwiebel und Ei.",
        "fr-FR": "Des chaussons au four, farcis de viande, d'oignon et d'œuf.",
      },
    },
    {
      slug: "alfajor",
      plated: false,
      name: localName("Alfajor"),
      note: {
        "pt-BR": "Dois biscoitos macios com doce de leite no meio, cobertos de chocolate.",
        "en-GB": "Two soft biscuits with dulce de leche inside, covered in chocolate.",
        "de-DE": "Zwei weiche Kekse mit Dulce de leche, mit Schokolade überzogen.",
        "fr-FR": "Deux biscuits moelleux au dulce de leche, enrobés de chocolat.",
      },
    },
  ],
  bo: [
    {
      slug: "pique-a-lo-macho",
      plated: true,
      name: localName("Pique a lo macho"),
      note: {
        "pt-BR": "Carne, linguiça e batata frita com pimentão, num prato grande para dividir.",
        "en-GB": "Beef, sausage and chips with peppers, on a big plate to share.",
        "de-DE": "Rindfleisch, Wurst und Pommes mit Paprika, auf einem großen Teller.",
        "fr-FR": "Du bœuf, des saucisses et des frites au poivron, sur un grand plat.",
      },
    },
    {
      slug: "saltenas",
      plated: false,
      name: localName("Salteñas"),
      note: {
        "pt-BR": "Pastéis assados e suculentos, com um ensopado de carne dentro.",
        "en-GB": "Juicy baked pastries with a meat stew inside.",
        "de-DE": "Saftige Teigtaschen mit einem Fleischeintopf darin.",
        "fr-FR": "Des chaussons juteux, avec un ragoût de viande à l'intérieur.",
      },
    },
    {
      slug: "silpancho",
      plated: true,
      name: localName("Silpancho"),
      note: {
        "pt-BR": "Carne batida bem fina com arroz, batata e ovo frito por cima.",
        "en-GB": "Thin beaten beef with rice, potatoes and a fried egg on top.",
        "de-DE": "Dünn geklopftes Rindfleisch mit Reis, Kartoffeln und Spiegelei.",
        "fr-FR": "De la viande aplatie avec du riz, des pommes de terre et un œuf.",
      },
    },
  ],
  cl: [
    {
      slug: "pastel-de-choclo",
      plated: true,
      name: localName("Pastel de choclo"),
      note: {
        "pt-BR": "Torta de milho com carne, frango e passas, assada numa tigela de barro.",
        "en-GB": "A corn pie with beef, chicken and raisins, baked in a clay dish.",
        "de-DE": "Ein Maisauflauf mit Rind, Huhn und Rosinen, in Ton gebacken.",
        "fr-FR": "Une tourte au maïs avec bœuf, poulet et raisins, cuite en terre.",
      },
    },
    {
      slug: "empanada-de-pino",
      plated: false,
      name: localName("Empanada de pino"),
      note: {
        "pt-BR": "Empanada de forno com carne, cebola, ovo e azeitona.",
        "en-GB": "An oven empanada with beef, onion, egg and olive.",
        "de-DE": "Eine Ofen-Empanada mit Rind, Zwiebel, Ei und Olive.",
        "fr-FR": "Une empanada au four avec bœuf, oignon, œuf et olive.",
      },
    },
    {
      slug: "cazuela",
      plated: true,
      name: localName("Cazuela"),
      note: {
        "pt-BR": "Sopa com carne, milho, batata e abóbora, servida na tigela.",
        "en-GB": "A soup with beef, corn, potato and pumpkin, served in a bowl.",
        "de-DE": "Eine Suppe mit Rind, Mais, Kartoffel und Kürbis, in der Schale.",
        "fr-FR": "Une soupe au bœuf, maïs, pomme de terre et potiron, en bol.",
      },
    },
  ],
  co: [
    {
      slug: "bandeja-paisa",
      plated: true,
      name: localName("Bandeja paisa"),
      note: {
        "pt-BR": "Prato grande com feijão, arroz, carne, ovo, arepa e banana frita.",
        "en-GB": "A big plate with beans, rice, beef, egg, arepa and fried plantain.",
        "de-DE": "Ein großer Teller mit Bohnen, Reis, Fleisch, Ei, Arepa und Banane.",
        "fr-FR": "Une grande assiette avec haricots, riz, viande, œuf, arepa et banane.",
      },
    },
    {
      slug: "arepas",
      plated: false,
      name: localName("Arepas"),
      note: {
        "pt-BR": "Bolinhos de milho assados na chapa, comidos com queijo.",
        "en-GB": "Corn cakes cooked on a griddle, eaten with cheese.",
        "de-DE": "Maisfladen von der Platte, mit Käse gegessen.",
        "fr-FR": "Des galettes de maïs cuites à la plancha, avec du fromage.",
      },
    },
    {
      slug: "ajiaco",
      plated: true,
      name: localName("Ajiaco"),
      note: {
        "pt-BR": "Sopa de batata com frango, milho e ervas, servida com creme.",
        "en-GB": "A potato soup with chicken, corn and herbs, served with cream.",
        "de-DE": "Eine Kartoffelsuppe mit Huhn, Mais und Kräutern, mit Sahne.",
        "fr-FR": "Une soupe de pommes de terre au poulet, maïs et herbes, avec crème.",
      },
    },
  ],
  ec: [
    {
      slug: "ceviche",
      plated: true,
      name: localName("Ceviche"),
      note: {
        "pt-BR": "Peixe ou frutos do mar com suco de limão, cebola roxa e coentro.",
        "en-GB": "Fish or seafood in lime juice, with red onion and coriander.",
        "de-DE": "Fisch oder Meeresfrüchte in Limettensaft, mit roter Zwiebel.",
        "fr-FR": "Du poisson ou des fruits de mer au citron vert, oignon rouge et coriandre.",
      },
    },
    {
      slug: "encebollado",
      plated: true,
      name: localName("Encebollado"),
      note: {
        "pt-BR": "Sopa de peixe com mandioca, cebola roxa e coentro.",
        "en-GB": "A fish soup with cassava, red onion and coriander.",
        "de-DE": "Eine Fischsuppe mit Maniok, roter Zwiebel und Koriander.",
        "fr-FR": "Une soupe de poisson au manioc, oignon rouge et coriandre.",
      },
    },
    {
      slug: "llapingachos",
      plated: true,
      name: localName("Llapingachos"),
      note: {
        "pt-BR": "Bolinhos de batata recheados com queijo, tostados na chapa.",
        "en-GB": "Potato cakes filled with cheese, toasted on the griddle.",
        "de-DE": "Kartoffelfladen mit Käsefüllung, auf der Platte gebraten.",
        "fr-FR": "Des galettes de pomme de terre au fromage, dorées à la plancha.",
      },
    },
  ],
  pe: [
    {
      slug: "ceviche",
      plated: true,
      name: localName("Ceviche"),
      note: {
        "pt-BR": "Peixe cru curado no limão, com cebola, milho e batata-doce.",
        "en-GB": "Raw fish cured in lime, with onion, corn and sweet potato.",
        "de-DE": "Roher Fisch in Limettensaft, mit Zwiebel, Mais und Süßkartoffel.",
        "fr-FR": "Du poisson cru mariné au citron vert, oignon, maïs et patate douce.",
      },
    },
    {
      slug: "lomo-saltado",
      plated: true,
      name: localName("Lomo saltado"),
      note: {
        "pt-BR": "Tiras de carne salteadas com cebola e tomate, com batata frita e arroz.",
        "en-GB": "Strips of beef stir-fried with onion and tomato, with chips and rice.",
        "de-DE": "Rindfleischstreifen mit Zwiebel und Tomate, dazu Pommes und Reis.",
        "fr-FR": "Des lamelles de bœuf sautées avec oignon et tomate, frites et riz.",
      },
    },
    {
      slug: "aji-de-gallina",
      plated: true,
      name: localName("Ají de gallina"),
      note: {
        "pt-BR": "Frango desfiado num creme amarelo de pimenta e pão.",
        "en-GB": "Shredded chicken in a yellow chilli and bread sauce.",
        "de-DE": "Zerpflücktes Huhn in gelber Chili-Brot-Sauce.",
        "fr-FR": "Du poulet effiloché dans une sauce jaune au piment et au pain.",
      },
    },
  ],
  uy: [
    {
      slug: "chivito",
      plated: false,
      name: localName("Chivito"),
      note: {
        "pt-BR": "Sanduíche grande com carne, presunto, queijo e ovo, com batata frita.",
        "en-GB": "A big sandwich with beef, ham, cheese and egg, plus chips.",
        "de-DE": "Ein großes Sandwich mit Fleisch, Schinken, Käse und Ei, mit Pommes.",
        "fr-FR": "Un grand sandwich au bœuf, jambon, fromage et œuf, avec des frites.",
      },
    },
    {
      slug: "asado",
      plated: true,
      name: localName("Asado"),
      note: {
        "pt-BR": "Carne na grelha, assada devagar sobre a brasa.",
        "en-GB": "Meat on the grill, cooked slowly over the embers.",
        "de-DE": "Fleisch vom Grill, langsam über der Glut gegart.",
        "fr-FR": "De la viande grillée, cuite lentement sur la braise.",
      },
    },
    {
      slug: "torta-frita",
      plated: false,
      name: localName("Torta frita"),
      note: {
        "pt-BR": "Massa fina frita, comida quente com açúcar ou doce.",
        "en-GB": "Thin fried dough, eaten warm with sugar or jam.",
        "de-DE": "Dünner frittierter Teig, warm mit Zucker oder Marmelade.",
        "fr-FR": "Une pâte fine frite, mangée chaude avec du sucre ou de la confiture.",
      },
    },
  ],
  ve: [
    {
      slug: "arepa",
      plated: false,
      name: localName("Arepa"),
      note: {
        "pt-BR": "Pão redondo de milho, aberto e recheado com queijo ou carne.",
        "en-GB": "A round corn bread, split open and filled with cheese or beef.",
        "de-DE": "Rundes Maisbrot, aufgeschnitten und mit Käse oder Fleisch gefüllt.",
        "fr-FR": "Un pain rond de maïs, ouvert et garni de fromage ou de viande.",
      },
    },
    {
      slug: "hallacas",
      plated: false,
      name: localName("Hallacas"),
      note: {
        "pt-BR": "Massa de milho com carne, embrulhada em folha de bananeira.",
        "en-GB": "Corn dough with a beef filling, wrapped in a banana leaf.",
        "de-DE": "Maisteig mit Fleischfüllung, in Bananenblätter gewickelt.",
        "fr-FR": "Une pâte de maïs à la viande, enveloppée dans une feuille de bananier.",
      },
    },
    {
      slug: "pabellon-criollo",
      plated: true,
      name: localName("Pabellón criollo"),
      note: {
        "pt-BR": "Carne desfiada, feijão preto, arroz e banana frita no mesmo prato.",
        "en-GB": "Shredded beef, black beans, rice and fried plantain on one plate.",
        "de-DE": "Zerpflücktes Rind, schwarze Bohnen, Reis und Banane auf einem Teller.",
        "fr-FR": "Du bœuf effiloché, des haricots noirs, du riz et de la banane.",
      },
    },
  ],
  py: [
    {
      slug: "sopa-paraguaya",
      plated: true,
      name: localName("Sopa paraguaya"),
      note: {
        "pt-BR": "Chama-se sopa, mas é um bolo salgado de milho e queijo.",
        "en-GB": "It is called a soup, but it is a savoury corn and cheese cake.",
        "de-DE": "Sie heißt Suppe, ist aber ein salziger Mais-Käse-Kuchen.",
        "fr-FR": "On l'appelle soupe, mais c'est un gâteau salé au maïs et au fromage.",
      },
    },
    {
      slug: "chipa",
      plated: false,
      name: localName("Chipa"),
      note: {
        "pt-BR": "Pãezinhos de queijo e polvilho, em forma de anel.",
        "en-GB": "Cheese and cassava bread rings.",
        "de-DE": "Käseringe aus Maniokstärke.",
        "fr-FR": "Des anneaux de pain au fromage et à la fécule de manioc.",
      },
    },
  ],
  bz: [
    {
      slug: "rice-and-beans",
      plated: true,
      name: localName("Rice and beans"),
      note: {
        "pt-BR": "Arroz cozido com feijão e leite de coco, servido com frango.",
        "en-GB": "Rice cooked with beans and coconut milk, served with chicken.",
        "de-DE": "Reis mit Bohnen und Kokosmilch, mit Huhn serviert.",
        "fr-FR": "Du riz cuit avec des haricots et du lait de coco, servi avec du poulet.",
      },
    },
    {
      slug: "panades",
      plated: false,
      name: localName("Panades"),
      note: {
        "pt-BR": "Pastéis fritos de milho, recheados com peixe.",
        "en-GB": "Fried corn pastries filled with fish.",
        "de-DE": "Frittierte Maispasteten mit Fischfüllung.",
        "fr-FR": "Des chaussons de maïs frits, farcis au poisson.",
      },
    },
    {
      slug: "fry-jacks",
      plated: false,
      name: localName("Fry jacks"),
      note: {
        "pt-BR": "Pão frito em triângulos, comido no café da manhã.",
        "en-GB": "Fried dough triangles, eaten at breakfast.",
        "de-DE": "Frittierte Teigdreiecke zum Frühstück.",
        "fr-FR": "Des triangles de pâte frits, mangés au petit-déjeuner.",
      },
    },
  ],
  cr: [
    {
      slug: "gallo-pinto",
      plated: true,
      name: localName("Gallo pinto"),
      note: {
        "pt-BR": "Arroz com feijão temperado, comido de manhã com ovo.",
        "en-GB": "Seasoned rice and beans, eaten at breakfast with egg.",
        "de-DE": "Gewürzter Reis mit Bohnen, morgens mit Ei gegessen.",
        "fr-FR": "Du riz aux haricots épicé, mangé au petit-déjeuner avec un œuf.",
      },
    },
    {
      slug: "casado",
      plated: true,
      name: localName("Casado"),
      note: {
        "pt-BR": "Prato do dia com arroz, feijão, salada, banana frita e carne.",
        "en-GB": "A set lunch with rice, beans, salad, fried plantain and meat.",
        "de-DE": "Ein Mittagsteller mit Reis, Bohnen, Salat, Banane und Fleisch.",
        "fr-FR": "Un plat du jour avec riz, haricots, salade, banane frite et viande.",
      },
    },
    {
      slug: "chifrijo",
      plated: true,
      name: localName("Chifrijo"),
      note: {
        "pt-BR": "Tigela com feijão, torresmo, tomate e torradas de milho.",
        "en-GB": "A bowl of beans, pork crackling, tomato and corn chips.",
        "de-DE": "Eine Schale mit Bohnen, Krustenfleisch, Tomate und Maischips.",
        "fr-FR": "Un bol de haricots, de couenne croustillante, de tomate et de chips.",
      },
    },
  ],
  sv: [
    {
      slug: "pupusas",
      plated: true,
      name: localName("Pupusas"),
      note: {
        "pt-BR": "Tortilhas grossas de milho, recheadas com queijo e servidas com repolho.",
        "en-GB": "Thick corn tortillas filled with cheese, served with pickled cabbage.",
        "de-DE": "Dicke Maisfladen mit Käsefüllung, dazu eingelegter Kohl.",
        "fr-FR": "Des tortillas de maïs épaisses au fromage, avec du chou mariné.",
      },
    },
    {
      slug: "yuca-frita",
      plated: true,
      name: localName("Yuca frita"),
      note: {
        "pt-BR": "Mandioca frita, crocante por fora, comida com molho.",
        "en-GB": "Fried cassava, crisp outside, eaten with a dip.",
        "de-DE": "Frittierter Maniok, außen knusprig, mit Dip.",
        "fr-FR": "Du manioc frit, croustillant dehors, mangé avec une sauce.",
      },
    },
  ],
  gt: [
    {
      slug: "kakik",
      plated: true,
      name: localName("Kak'ik"),
      note: {
        "pt-BR": "Sopa escura de peru com pimenta e ervas, do povo maia.",
        "en-GB": "A dark turkey soup with chilli and herbs, from the Maya.",
        "de-DE": "Eine dunkle Putensuppe mit Chili und Kräutern, von den Maya.",
        "fr-FR": "Une soupe sombre de dinde au piment et aux herbes, des Mayas.",
      },
    },
    {
      slug: "tamales",
      plated: true,
      name: localName("Tamales"),
      note: {
        "pt-BR": "Massa de milho com carne, cozida embrulhada em folha.",
        "en-GB": "Corn dough with meat, steamed inside a leaf wrapper.",
        "de-DE": "Maisteig mit Fleisch, in Blätter gewickelt gedämpft.",
        "fr-FR": "Une pâte de maïs à la viande, cuite vapeur dans une feuille.",
      },
    },
  ],
  hn: [
    {
      slug: "baleadas",
      plated: false,
      name: localName("Baleadas"),
      note: {
        "pt-BR": "Tortilha de trigo dobrada com feijão, queijo e creme.",
        "en-GB": "A folded wheat tortilla with beans, cheese and cream.",
        "de-DE": "Gefaltete Weizentortilla mit Bohnen, Käse und Sahne.",
        "fr-FR": "Une tortilla de blé pliée avec haricots, fromage et crème.",
      },
    },
    {
      slug: "tajadas",
      plated: true,
      name: localName("Tajadas"),
      note: {
        "pt-BR": "Fatias de banana-da-terra fritas, com carne e creme.",
        "en-GB": "Fried plantain slices with meat and cream.",
        "de-DE": "Frittierte Bananenscheiben mit Fleisch und Sahne.",
        "fr-FR": "Des tranches de banane plantain frites, avec viande et crème.",
      },
    },
  ],
  ni: [
    {
      slug: "nacatamal",
      plated: true,
      name: localName("Nacatamal"),
      note: {
        "pt-BR": "Massa de milho com carne e arroz, cozida na folha de bananeira.",
        "en-GB": "Corn dough with pork and rice, cooked in a banana leaf.",
        "de-DE": "Maisteig mit Schweinefleisch und Reis, im Bananenblatt gegart.",
        "fr-FR": "Une pâte de maïs au porc et au riz, cuite dans une feuille de bananier.",
      },
    },
    {
      slug: "vigoron",
      plated: true,
      name: localName("Vigorón"),
      note: {
        "pt-BR": "Mandioca, torresmo e salada de repolho, servidos na folha.",
        "en-GB": "Cassava, pork crackling and cabbage salad, served on a leaf.",
        "de-DE": "Maniok, Krustenfleisch und Kohlsalat, auf einem Blatt serviert.",
        "fr-FR": "Du manioc, de la couenne croustillante et du chou, sur une feuille.",
      },
    },
  ],
  pa: [
    {
      slug: "patacones",
      plated: true,
      name: localName("Patacones"),
      note: {
        "pt-BR": "Rodelas de banana-da-terra amassadas e fritas, crocantes.",
        "en-GB": "Squashed plantain slices, fried until crisp.",
        "de-DE": "Platt gedrückte Bananenscheiben, knusprig frittiert.",
        "fr-FR": "Des tranches de banane plantain écrasées et frites, croustillantes.",
      },
    },
    {
      slug: "tortilla",
      plated: true,
      name: localName("Tortilla"),
      note: {
        "pt-BR": "Torta fina de milho, assada na chapa e comida quente.",
        "en-GB": "A thin corn cake, cooked on the griddle and eaten warm.",
        "de-DE": "Ein dünner Maisfladen, auf der Platte gebacken, warm gegessen.",
        "fr-FR": "Une galette fine de maïs, cuite à la plancha et mangée chaude.",
      },
    },
  ],
  ca: [
    {
      slug: "poutine",
      plated: true,
      name: localName("Poutine"),
      note: {
        "pt-BR": "Batata frita coberta com queijo e molho de carne bem quente.",
        "en-GB": "Chips topped with cheese curds and hot gravy.",
        "de-DE": "Pommes mit Käsebruch und heißer Fleischsauce.",
        "fr-FR": "Des frites avec du fromage en grains et une sauce chaude.",
      },
    },
    {
      slug: "butter-tarts",
      plated: false,
      name: localName("Butter tarts"),
      note: {
        "pt-BR": "Tortinhas de massa doce com recheio de açúcar, manteiga e ovo.",
        "en-GB": "Small pastry tarts filled with sugar, butter and egg.",
        "de-DE": "Kleine Teigtörtchen mit Zucker, Butter und Ei.",
        "fr-FR": "De petites tartelettes au sucre, au beurre et à l'œuf.",
      },
    },
  ],
  mx: [
    {
      slug: "tacos",
      plated: true,
      name: localName("Tacos"),
      note: {
        "pt-BR": "Tortilhas de milho dobradas com carne, cebola e coentro.",
        "en-GB": "Folded corn tortillas with meat, onion and coriander.",
        "de-DE": "Gefaltete Maisfladen mit Fleisch, Zwiebel und Koriander.",
        "fr-FR": "Des tortillas de maïs pliées, avec viande, oignon et coriandre.",
      },
    },
    {
      slug: "chiles-en-nogada",
      plated: true,
      name: localName("Chiles en nogada"),
      note: {
        "pt-BR": "Pimenta recheada coberta com molho branco de nozes e romã.",
        "en-GB": "A stuffed chilli covered in white walnut sauce and pomegranate.",
        "de-DE": "Gefüllte Paprika mit weißer Walnusssauce und Granatapfel.",
        "fr-FR": "Un piment farci, nappé de sauce blanche aux noix et de grenade.",
      },
    },
    {
      slug: "mole-poblano",
      plated: true,
      name: localName("Mole poblano"),
      note: {
        "pt-BR": "Frango com molho escuro de pimenta e chocolate, servido com arroz.",
        "en-GB": "Chicken in a dark chilli and chocolate sauce, served with rice.",
        "de-DE": "Huhn in dunkler Chili-Schokoladen-Sauce, mit Reis.",
        "fr-FR": "Du poulet dans une sauce sombre au piment et au chocolat, avec du riz.",
      },
    },
  ],
  us: [
    {
      slug: "hamburger",
      plated: true,
      name: localName("Hamburger"),
      note: {
        "pt-BR": "Pão redondo com carne moída grelhada, queijo e salada.",
        "en-GB": "A round bun with grilled beef, cheese and salad.",
        "de-DE": "Ein rundes Brötchen mit gegrilltem Rind, Käse und Salat.",
        "fr-FR": "Un pain rond avec du bœuf grillé, du fromage et de la salade.",
      },
    },
    {
      slug: "bbq-ribs",
      plated: true,
      name: localName("BBQ ribs"),
      note: {
        "pt-BR": "Costelas assadas devagar com um molho de tomate defumado.",
        "en-GB": "Ribs cooked slowly with a smoky tomato sauce.",
        "de-DE": "Rippchen, langsam mit rauchiger Tomatensauce gegart.",
        "fr-FR": "Des côtes cuites lentement avec une sauce tomate fumée.",
      },
    },
    {
      slug: "apple-pie",
      plated: true,
      name: localName("Apple pie"),
      note: {
        "pt-BR": "Torta de maçã com canela, servida em fatias.",
        "en-GB": "An apple pie with cinnamon, served in slices.",
        "de-DE": "Ein Apfelkuchen mit Zimt, in Stücken serviert.",
        "fr-FR": "Une tarte aux pommes à la cannelle, servie en parts.",
      },
    },
  ],
};

const MANIFEST = raw as Record<string, Record<string, DishPhoto[]>>;

export function dishesFor(iso: string): Dish[] {
  const editorial = DISHES[iso] ?? [];
  return editorial
    .map((dish) => ({
      ...dish,
      photos: MANIFEST[iso]?.[dish.slug] ?? [],
    }))
    .filter((dish) => dish.photos.length > 0);
}

export function hasDishes(iso: string): boolean {
  return (DISHES[iso] ?? []).some((dish) => (MANIFEST[iso]?.[dish.slug]?.length ?? 0) > 0);
}
