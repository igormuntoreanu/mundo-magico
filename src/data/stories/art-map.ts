const RULES: [RegExp, string[]][] = [
  [/saci/i, ["saci", "forest", "stars", "jungle"]],
  [/curupira/i, ["curupira", "forest", "jungle", "moon"]],
  [/iara|sereia|pincoya|kianda/i, ["mermaid", "river", "moon", "ocean"]],
  [/boto|golfinho|baleia/i, ["dolphin", "ocean", "moon", "river"]],
  [/galo de barcelos|galo /i, ["rooster", "village", "castle", "market"]],
  [/momotar|pêssego|pessego/i, ["peach", "forest", "village", "island"]],
  [/kaguya|bambu/i, ["bamboo", "moon", "stars", "forest"]],
  [/urashima|tartaruga/i, ["turtle", "ocean", "island", "boat"]],
  [/anansi|aranha/i, ["anansi", "village", "stars", "savanna"]],
  [/baba yaga|hut/i, ["hut", "forest", "snow", "moon"]],
  [/robin hood/i, ["forest", "village", "castle", "forest"]],
  [/feijão|beanstalk|askeladden/i, ["beanstalk", "castle", "village", "stars"]],
  [/chapeuzinho|lobo|wolf|lobisom/i, ["wolf", "forest", "village", "moon"]],
  [/rapunzel|torre/i, ["castle", "stars", "village", "forest"]],
  [/branca de neve|cinderela|bela adormecida|gato de botas/i, ["castle", "forest", "stars", "village"]],
  [/joão e maria|hansel/i, ["forest", "village", "castle", "moon"]],
  [/pinóquio|pinocchio/i, ["village", "ocean", "stars", "boat"]],
  [/maui|ilhas/i, ["boat", "ocean", "island", "stars"]],
  [/macaco|wukong|hanuman/i, ["jungle", "mountain", "stars", "village"]],
  [/minotauro|tese|troia|ícaro|icaro|hércules|hercules|pandora/i, ["castle", "ocean", "stars", "mountain"]],
  [/quetzal|popocat|llorona|alebrije/i, ["volcano", "moon", "jungle", "river"]],
  [/ganesha|rama|panchatantra|akbar|birbal/i, ["elephant", "jungle", "village", "market"]],
  [/ísis|isis|osíris|osiris|bastet|barca do sol|tutanc/i, ["desert", "river", "stars", "market"]],
  [/zebra|tokoloshe|chuva|kilimanjaro|lebre|elefante/i, ["savanna", "mountain", "hare", "jungle"]],
  [/leprechaun|cú chulainn|banshee|fionn|selkie/i, ["forest", "ocean", "stars", "village"]],
  [/paul bunyan|johnny|pecos|john henry|rip van/i, ["forest", "mountain", "village", "river"]],
  [/artur|excalibur|porquinhos/i, ["castle", "forest", "village", "stars"]],
  [/tiddalik|canguru|arco-íris|bunjil|serpente/i, ["desert", "river", "stars", "savanna"]],
  [/nanabozho|wendigo|glooscap|corvo|maple/i, ["forest", "snow", "stars", "river"]],
  [/dragão|dragon|golem/i, ["dragon", "castle", "mountain", "cave"]],
  [/nasreddin|keloğlan|keloglan/i, ["market", "village", "desert", "stars"]],
  [/gilgamesh|alibabá|alibaba|sindbad/i, ["desert", "market", "castle", "cave"]],
  [/nils|tomte|pippi|heidi/i, ["snow", "forest", "village", "mountain"]],
  [/maneki|naga|nian/i, ["jungle", "river", "stars", "dragon"]],
  [/vulcão|volcan|mayon|cotopaxi|fogo/i, ["volcano", "mountain", "stars", "village"]],
  [/deserto|sahara|oásis|oasis|camelo/i, ["desert", "stars", "village", "market"]],
  [/mar|oceano|pirata|navio|ilha/i, ["ocean", "island", "boat", "stars"]],
  [/montanha|monte|everest|yeti/i, ["mountain", "snow", "stars", "forest"]],
  [/floresta|selva|duende|trauco|pombero/i, ["jungle", "forest", "moon", "stars"]],
  [/rio|lago|água/i, ["river", "moon", "forest", "ocean"]],
  [/castelo|rei|princesa/i, ["castle", "stars", "village", "forest"]],
  [/neve|inverno|aurora|gelo/i, ["snow", "stars", "mountain", "village"]],
  [/aldeia|vila|povo/i, ["village", "forest", "stars", "market"]],
];

const DEFAULT_ART = ["forest", "village", "stars", "moon"];

export function artForTitle(title: string): string[] {
  for (const [re, arts] of RULES) {
    if (re.test(title)) {
      return arts.length ? arts : DEFAULT_ART;
    }
  }
  return DEFAULT_ART;
}
