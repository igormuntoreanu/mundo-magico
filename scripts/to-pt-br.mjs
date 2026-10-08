/**
 * Rewrite European Portuguese copy in the content data to Brazilian Portuguese.
 * UI strings are translated separately. This script is idempotent enough to
 * re-run: already-Brazilian forms are not in the source patterns.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (/\.(ts|json)$/.test(name)) acc.push(path);
  }
  return acc;
}

const PHRASES = [
  ["português europeu simples", "português do Brasil"],
  ["português europeu", "português do Brasil"],
  ["Macedónia do Norte", "Macedônia do Norte"],
  ["Nova Caledónia", "Nova Caledônia"],
  ["Ilhas Falkland", "Ilhas Malvinas"],
  ["Sara Ocidental", "Saara Ocidental"],
  ["Turquemenistão", "Turcomenistão"],
  ["Tajiquistão", "Tadjiquistão"],
  ["Burquina Faso", "Burkina Faso"],
  ["pequeno-almoço", "café da manhã"],
  ["casas de banho", "banheiros"],
  ["casa de banho", "banheiro"],
  ["de facto", "de fato"],
  ["às riscas", "com listras"],
  ["noutras", "em outras"],
  ["noutros", "em outros"],
  ["noutra", "em outra"],
  ["noutro", "em outro"],
  ["Zimbabué", "Zimbábue"],
  ["no ecrã", "na tela"],
  ["num ecrã", "numa tela"],
  ["do ecrã", "da tela"],
  ["o ecrã", "a tela"],
  ["ecrã", "tela"],
];

const WORDS = [
  ["Zimbabué", "Zimbábue"],
  ["Madagáscar", "Madagascar"],
  ["Baamas", "Bahamas"],
  ["Benim", "Benin"],
  ["Amazónia", "Amazônia"],
  ["Eslovénia", "Eslovênia"],
  ["Macedónia", "Macedônia"],
  ["Letónia", "Letônia"],
  ["Estónia", "Estônia"],
  ["Polónia", "Polônia"],
  ["Roménia", "Romênia"],
  ["Arménia", "Armênia"],
  ["Quénia", "Quênia"],
  ["Egipto", "Egito"],
  ["Iémen", "Iêmen"],
  ["Irão", "Irã"],
  ["macedónio", "macedônio"],
  ["macedónia", "macedônia"],
  ["arménio", "armênio"],
  ["arménia", "armênia"],
  ["raparigas", "meninas"],
  ["rapariga", "menina"],
  ["Rapariga", "Menina"],
  ["exactamente", "exatamente"],
  ["Exactamente", "Exatamente"],
  ["húmida", "úmida"],
  ["húmido", "úmido"],
  ["Húmido", "Úmido"],
  ["Gronelândia", "Groenlândia"],
  ["pêlo", "pelo"],
  ["pêlos", "pelos"],
  ["actos", "atos"],
  ["acto", "ato"],
  ["actriz", "atriz"],
  ["actor", "ator"],
  ["actores", "atores"],
  ["pormenores", "detalhes"],
  ["pormenor", "detalhe"],
  ["Pormenor", "Detalhe"],
  ["connosco", "conosco"],
  ["convosco", "com vocês"],
  ["contigo", "com você"],
  ["ecrãs", "telas"],
  ["ecrã", "tela"],
  ["Ecrã", "Tela"],
  ["autocarros", "ônibus"],
  ["autocarro", "ônibus"],
  ["comboios", "trens"],
  ["comboio", "trem"],
  ["telemóveis", "celulares"],
  ["telemóvel", "celular"],
  ["ficheiros", "arquivos"],
  ["ficheiro", "arquivo"],
  ["sandes", "sanduíches"],
  ["desportos", "esportes"],
  ["desporto", "esporte"],
  ["equipas", "equipes"],
  ["equipa", "equipe"],
  ["camisola", "suéter"],
  ["Camisola", "Suéter"],
  ["riscas", "listras"],
  ["factos", "fatos"],
  ["facto", "fato"],
  ["contactos", "contatos"],
  ["contacto", "contato"],
  ["óptimos", "ótimos"],
  ["óptimas", "ótimas"],
  ["óptimo", "ótimo"],
  ["óptima", "ótima"],
  ["eléctricos", "elétricos"],
  ["eléctricas", "elétricas"],
  ["eléctrico", "elétrico"],
  ["eléctrica", "elétrica"],
  ["electricidade", "eletricidade"],
  ["acções", "ações"],
  ["acção", "ação"],
  ["receções", "recepções"],
  ["receção", "recepção"],
  ["conceções", "concepções"],
  ["conceção", "concepção"],
  ["perceções", "percepções"],
  ["perceção", "percepção"],
  ["infeções", "infecções"],
  ["infeção", "infecção"],
  ["baptizados", "batizados"],
  ["baptizadas", "batizadas"],
  ["baptizado", "batizado"],
  ["baptizada", "batizada"],
  ["baptismo", "batismo"],
  ["baptizar", "batizar"],
  ["géneros", "gêneros"],
  ["género", "gênero"],
  ["secções", "seções"],
  ["secção", "seção"],
  ["sítios", "lugares"],
  ["sítio", "lugar"],
  ["Sítios", "Lugares"],
  ["Sítio", "Lugar"],
];

const PRESENT = {
  podes: "pode",
  vais: "vai",
  estás: "está",
  tens: "tem",
  ficas: "fica",
  precisas: "precisa",
  deixas: "deixa",
  sabes: "sabe",
  fazes: "faz",
  gostas: "gosta",
  queres: "quer",
  dizes: "diz",
  deves: "deve",
  vens: "vem",
  consegues: "consegue",
  comes: "come",
  ouves: "ouve",
  levas: "leva",
  esperas: "espera",
  olhas: "olha",
  bebes: "bebe",
  pensas: "pensa",
  conheces: "conhece",
  escolhes: "escolhe",
  partilhas: "partilha",
  encontras: "encontra",
  continuas: "continua",
  respeitas: "respeita",
  agradeces: "agradece",
  pisas: "pisa",
  sais: "sai",
  gritas: "grita",
  entras: "entra",
  perdes: "perde",
  chegas: "chega",
  cuidas: "cuida",
  vês: "vê",
  lês: "lê",
  dás: "dá",
  pões: "põe",
  trazes: "traz",
  és: "é",
  Podes: "Pode",
  Vais: "Vai",
  Estás: "Está",
  Tens: "Tem",
  Ficas: "Fica",
  Precisas: "Precisa",
  Queres: "Quer",
  Vês: "Vê",
  Sabes: "Sabe",
};

const FUTURE = {
  fores: "for",
  vires: "vir",
  tiveres: "tiver",
  quiseres: "quiser",
  estiveres: "estiver",
  souberes: "souber",
  fizeres: "fizer",
  puderes: "puder",
  deres: "der",
  vieres: "vier",
  disseres: "disser",
  trouxeres: "trouxer",
  houveres: "houver",
  couberes: "couber",
  ouvires: "ouvir",
  encontrares: "encontrar",
  entrares: "entrar",
  levares: "levar",
  ajudares: "ajudar",
  ficares: "ficar",
  teres: "ter",
  receberes: "receber",
  precisares: "precisar",
  chegares: "chegar",
  tratares: "tratar",
  passares: "passar",
  abrires: "abrir",
  beberes: "beber",
  veres: "ver",
  perderes: "perder",
  deixares: "deixar",
  sentires: "sentir",
  seguires: "seguir",
  subires: "subir",
  sentares: "sentar",
  aprenderes: "aprender",
  tirares: "tirar",
  leres: "ler",
  Fores: "For",
  Vires: "Vir",
};

const BLOCK = new Set([
  "mulheres",
  "lugares",
  "mares",
  "colheres",
  "prazeres",
  "interesses",
  "afazeres",
  "deveres",
  "pares",
  "lares",
  "ares",
  "quereres",
  "familiares",
  "populares",
  "particulares",
  "regulares",
  "circulares",
]);

/** Real verbs that are also nouns. Convert only next to "tu". */
const AMBIGUOUS = new Set(["seres", "olhares", "saberes", "falares"]);

const IRREG_GERUND = {
  ser: "sendo",
  ter: "tendo",
  ver: "vendo",
  vir: "vindo",
  ir: "indo",
  pôr: "pondo",
  por: "pondo",
  rir: "rindo",
  ler: "lendo",
  crer: "crendo",
  caber: "cabendo",
};

function sameCase(source, next) {
  if (source[0] && source[0] === source[0].toUpperCase()) {
    return next[0].toUpperCase() + next.slice(1);
  }
  return next;
}

function gerund(inf) {
  const lower = inf.toLowerCase();
  if (IRREG_GERUND[lower]) return sameCase(inf, IRREG_GERUND[lower]);
  if (/ar$/i.test(inf)) return `${inf.slice(0, -2)}ando`;
  if (/er$/i.test(inf)) return `${inf.slice(0, -2)}endo`;
  if (/ir$/i.test(inf)) return `${inf.slice(0, -2)}indo`;
  return null;
}

function isInfinitive(word) {
  const lower = word.toLowerCase();
  if (IRREG_GERUND[lower]) return true;
  return /(?:ar|er|ir)$/i.test(word) && word.length > 3;
}

function mapVerbForm(word, allowStem = false) {
  if (PRESENT[word]) return PRESENT[word];
  if (FUTURE[word]) return FUTURE[word];
  if (!allowStem) return null;
  const lower = word.toLowerCase();
  if (BLOCK.has(lower)) return null;
  if (/(?:ares|eres|ires)$/i.test(word)) {
    const stem = word.slice(0, -2);
    // "tir" ends in "ir" but is not an infinitive. Real infinitives here are longer.
    if (stem.length >= 4 && /(?:ar|er|ir)$/i.test(stem)) return stem;
  }
  return null;
}

function applyPhrases(text) {
  let next = text;
  for (const [from, to] of PHRASES) next = next.split(from).join(to);
  for (const [from, to] of WORDS) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    next = next.replace(
      new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, "gu"),
      to,
    );
  }
  return next;
}

const SKIP_DROP_S = new Set([
  "antes",
  "mais",
  "pois",
  "após",
  "três",
  "dois",
  "elas",
  "eles",
  "lhes",
  "quis",
  "pôs",
  "nas",
  "nos",
  "pelos",
  "pelas",
  "vocês",
]);

function dropTuEnding(word) {
  const lower = word.toLowerCase();
  if (lower === "vás") return sameCase(word, "vá");
  if (lower === "ris") return sameCase(word, "ri");
  if (SKIP_DROP_S.has(lower) || BLOCK.has(lower) || /mos$/i.test(word)) return null;
  if (/(?:ares|eres|ires)$/i.test(word)) {
    const stem = word.slice(0, -2);
    const short = new Set(["ler", "ver", "ser", "ter", "vir", "ir", "rir", "pôr", "por", "crer", "dar"]);
    if (short.has(stem.toLowerCase())) return stem.toLowerCase() === stem ? stem : sameCase(word, stem.toLowerCase());
    if (stem.length >= 4 && /(?:ar|er|ir)$/i.test(stem) && !BLOCK.has(stem.toLowerCase())) return stem;
    if (word.length >= 4 && /[aeiouáéíóúâêôãõ]s$/i.test(word)) return word.slice(0, -1);
    return null;
  }
  if (word.length < 4) return null;
  if (/[aeiouáéíóúâêôãõ]s$/i.test(word)) return word.slice(0, -1);
  return null;
}

function applyAgreement(text) {
  const afterVoce = text.replace(
    /\b([Vv]ocê)(\s+não)?(\s+se)?(\s+(?:também|ainda|só|sempre|nunca|já|bem))?(\s+)([A-Za-zÀ-úÁÀÂÃÉÊÍÓÔÕÚÇ]+)/g,
    (full, voce, nao = "", se = "", adv = "", space, verb) => {
      const mapped = dropTuEnding(verb);
      if (!mapped || mapped === verb) return full;
      return `${voce}${nao}${se}${adv}${space}${mapped}`;
    },
  );
  const withClitic = afterVoce.replace(
    /\b(não|nem|Não|Nem)(\s+)(o|a|os|as|lhe|lhes)(\s+)([A-Za-zÀ-úÁÀÂÃÉÊÍÓÔÕÚÇ]+)/g,
    (full, neg, s1, art, s2, verb) => {
      const mapped = dropTuEnding(verb);
      if (!mapped || mapped === verb) return full;
      return `${neg}${s1}${art}${s2}${mapped}`;
    },
  );
  return withClitic.replace(
    /\b(não|nem|Não|Nem)(\s+)([A-Za-zÀ-úÁÀÂÃÉÊÍÓÔÕÚÇ]+)/g,
    (full, neg, space, verb) => {
      const mapped = dropTuEnding(verb);
      if (!mapped || mapped === verb) return full;
      return `${neg}${space}${mapped}`;
    },
  );
}

function applyGerunds(text) {
  return text.replace(
    /\b(estou|estás|está|estamos|estão|estava|estavas|estávamos|estavam|anda|andam|andava|andavam|fica|ficam|ficava|ficavam|ficou)\s+a\s+([A-Za-zÀ-úÁÀÂÃÉÊÍÓÔÕÚÇ]+)(-se)?\b/g,
    (full, estar, verb, clitic) => {
      if (!isInfinitive(verb)) return full;
      const ing = gerund(verb);
      if (!ing) return full;
      if (clitic === "-se") return `${estar} se ${ing}`;
      return `${estar} ${ing}`;
    },
  );
}

function applyPronounClause(text) {
  return text.replace(
    /\b([Tt]u)(\s+não)?(\s+(?:também|ainda|só|sempre|nunca|já|bem))?(\s+te)?\s+([A-Za-zÀ-úÁÀÂÃÉÊÍÓÔÕÚÇ]+)\b/g,
    (full, tu, nao = "", adv = "", reflex = "", verb) => {
      const mapped = mapVerbForm(verb, true);
      if (!mapped) return full;
      const pronoun = tu[0] === "T" ? "Você" : "você";
      const se = reflex ? " se" : "";
      return `${pronoun}${nao}${adv}${se} ${mapped}`;
    },
  );
}

function applyBareVerbs(text) {
  return text.replace(/\b([A-Za-zÀ-úÁÀÂÃÉÊÍÓÔÕÚÇ]+)\b/g, (word) => mapVerbForm(word) ?? word);
}

function applyPossessives(text) {
  return text
    .replace(/\b[Tt]eus\b/g, (w) => (w[0] === "T" ? "Seus" : "seus"))
    .replace(/\b[Tt]uas\b/g, (w) => (w[0] === "T" ? "Suas" : "suas"))
    .replace(/\b[Tt]eu\b/g, (w) => (w[0] === "T" ? "Seu" : "seu"))
    .replace(/\b[Tt]ua\b/g, (w) => (w[0] === "T" ? "Sua" : "sua"));
}

function applyLeftoverTu(text) {
  return text.replace(/\b[Tt]u\b/g, (w) => (w[0] === "T" ? "Você" : "você"));
}

const IMPERATIVES = [
  ["Lembra-te", "Lembre-se"],
  ["lembra-te", "lembre-se"],
  ["Senta-te", "Sente-se"],
  ["senta-te", "sente-se"],
  ["Levanta-te", "Levante-se"],
  ["levanta-te", "levante-se"],
];

function applyImperatives(text) {
  let next = text;
  for (const [from, to] of IMPERATIVES) next = next.split(from).join(to);
  return next;
}

function applyDeInfinitive(text) {
  return text.replace(
    /\bde ([oa]s?) ([A-Za-zÀ-úÁÀÂÃÉÊÍÓÔÕÚÇ]+)\b/g,
    (full, _art, verb) => (isInfinitive(verb) ? `de ${verb}` : full),
  );
}

export function toBrazilian(text) {
  let next = applyPhrases(text);
  next = applyGerunds(next);
  next = applyDeInfinitive(next);
  next = applyImperatives(next);
  next = applyPronounClause(next);
  next = applyBareVerbs(next);
  next = applyPossessives(next);
  next = applyLeftoverTu(next);
  next = applyAgreement(next);
  next = next.replace(/\bpara ti\b/g, "para você");
  next = next.replace(/\bde ti\b/g, "de você");
  next = next.replace(/\ba ti\b/g, "a você");
  return next;
}

function assertCase(input, expected) {
  const got = toBrazilian(input);
  if (got !== expected) {
    console.error("FAIL\n in: ", input, "\n got:", got, "\n exp:", expected);
    process.exitCode = 1;
  }
}

assertCase("Se tu vires um ninho", "Se você vir um ninho");
assertCase("Tu podes olhar", "Você pode olhar");
assertCase("Tu não precisas de entrar", "Você não precisa de entrar");
assertCase("estava a ser escrito", "estava sendo escrito");
assertCase("está a chegar", "está chegando");
assertCase("está a água", "está a água");
assertCase("estava a meio", "estava a meio");
assertCase("as tuas mãos", "as suas mãos");
assertCase("o teu nome", "o seu nome");
assertCase("Se tu te vires num espelho", "Se você se vir num espelho");
assertCase("lembra-te do leão", "lembre-se do leão");
assertCase("noutras terras", "em outras terras");
assertCase("a rapariga correu", "a menina correu");
assertCase("no Egipto antigo", "no Egito antigo");
assertCase("contos do Irão", "contos do Irã");
assertCase("veio ter connosco", "veio ter conosco");
assertCase("sem pormenores", "sem detalhes");
assertCase("ninguém precisou de o puxar", "ninguém precisou de puxar");
assertCase("os seres humanos", "os seres humanos");
assertCase("as mulheres cantaram", "as mulheres cantaram");
assertCase("Tu já sabes qual", "Você já sabe qual");
assertCase("quando fores a mais forte", "quando for a mais forte");
assertCase("os olhares dela", "os olhares dela");
assertCase("se tu olhares", "se você olhar");
assertCase("Você levas a luz", "Você leva a luz");
assertCase("não subas para elas", "não suba para elas");
assertCase("nem forces uma junta", "nem force uma junta");
assertCase("no ecrã da máquina", "na tela da máquina");
assertCase("Grande Zimbabué", "Grande Zimbábue");
assertCase("uns estão a visitar familiares", "uns estão visitando familiares");
assertCase("a vergonha miúda", "a vergonha miúda");
assertCase("não tires isso", "não tire isso");
assertCase("não o tires", "não o tire");
assertCase("Se tu as ouvires hoje, ouves o original", "Se você as ouvir hoje, ouve o original");
assertCase("se tu leres um animal", "se você ler um animal");

if (process.exitCode) {
  console.error("Brazilian Portuguese checks failed. No files written.");
  process.exit(process.exitCode);
}

const files = [
  ...walk(join(ROOT, "src/data/stories")),
  join(ROOT, "src/data/countries.json"),
  join(ROOT, "src/data/world-meta.json"),
];

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  const after = toBrazilian(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed += 1;
  }
}

const countriesPath = join(ROOT, "src/data/countries.json");
const countries = JSON.parse(readFileSync(countriesPath, "utf8"));
const names = new Intl.DisplayNames(["pt-BR"], { type: "region" });
for (const [iso, country] of Object.entries(countries)) {
  if (!/^[a-z]{2}$/.test(iso)) continue;
  const localized = names.of(iso.toUpperCase());
  if (!localized || localized === country.name) continue;
  const previous = country.name;
  country.name = localized;
  country.aliases = Array.isArray(country.aliases) ? country.aliases : [];
  if (!country.aliases.includes(previous)) country.aliases.push(previous);
}
writeFileSync(countriesPath, `${JSON.stringify(countries, null, 2)}\n`);

const metaPath = join(ROOT, "src/data/world-meta.json");
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
for (const [iso, name] of Object.entries(meta.names ?? {})) {
  if (!/^[a-z]{2}$/.test(iso)) continue;
  const localized = names.of(iso.toUpperCase());
  if (localized) meta.names[iso] = localized;
  else meta.names[iso] = name;
}
writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`);

console.log(`Updated ${changed} files, then normalized country names to pt-BR.`);
