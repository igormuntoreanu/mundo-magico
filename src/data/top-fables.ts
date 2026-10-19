export type TopFable = {
  iso: string;
  taleIndex: number;
  estimatedDate: string | null;
  creator?: string;
};

type Entry = [estimatedDate: string | null, creator?: string];

function country(iso: string, entries: Entry[]): TopFable[] {
  return entries.map(([estimatedDate, creator], taleIndex) => ({
    iso,
    taleIndex,
    estimatedDate,
    ...(creator ? { creator } : {}),
  }));
}

const oral = null;

const COUNTRY_ENTRIES: TopFable[] = [
  ...country("br", [[oral], [oral], [oral], [oral], [oral]]),
  ...country("us", [
    ["c. 1906", "James MacGillivray (early printed account)"],
    ["19th century", "Based on John Chapman (1774–1845)"],
    ["1923", "Edward O'Reilly"],
    ["Late 19th century"],
    ["1819", "Washington Irving"],
  ]),
  ...country("gb", [
    ["15th century"],
    ["c. 1136", "Geoffrey of Monmouth (early chronicler)"],
    ["1734"],
    ["1843", "James Orchard Halliwell (collector)"],
  ]),
  ...country("de", [
    ["1812", "Jacob and Wilhelm Grimm (collectors)"],
    ["1697; later collected by the Grimms", "Charles Perrault (literary version)"],
    ["1812", "Jacob and Wilhelm Grimm (collectors)"],
    ["1812", "Jacob and Wilhelm Grimm (collectors)"],
    ["1284 (legend)"],
  ]),
  ...country("fr", [
    ["1697", "Charles Perrault"],
    ["1697", "Charles Perrault"],
    ["1697", "Charles Perrault"],
    ["1697", "Charles Perrault"],
    ["1697", "Charles Perrault"],
  ]),
  ...country("it", [
    ["1881", "Carlo Collodi"],
    ["Medieval tradition"],
    ["17th century"],
    ["16th century"],
    ["1st century BCE"],
  ]),
  ...country("gr", [
    ["c. 700 BCE"],
    ["c. 700 BCE", "Homer (traditional attribution)"],
    ["c. 700 BCE"],
    ["c. 700 BCE"],
    ["c. 700 BCE", "Hesiod"],
  ]),
  ...country("jp", [
    ["17th century"],
    ["10th century", "Anonymous court-era author"],
    ["8th century"],
    ["8th-century Kojiki"],
    ["16th century"],
  ]),
  ...country("cn", [
    ["Han dynasty (206 BCE–220 CE)"],
    ["1592", "Traditionally attributed to Wu Cheng'en"],
    ["c. 4th–6th century"],
    [oral],
    [oral],
  ]),
  ...country("in", [
    ["c. 3rd century BCE", "Traditionally attributed to Vishnu Sharma"],
    ["c. 5th century BCE–1st century CE", "Traditionally attributed to Valmiki"],
    ["Ancient; written versions developed over centuries"],
    ["c. 3rd century BCE", "Traditionally attributed to Vishnu Sharma"],
    ["16th century"],
  ]),
  ...country("kr", [
    [oral],
    ["19th century"],
    [oral],
    ["Traditional Korean tale; date unknown"],
    [oral],
  ]),
  ...country("id", [[oral], [oral], [oral], [oral], [oral]]),
  ...country("au", [[oral], ["20th century (recorded version)"], [oral], [oral], [oral]]),
  ...country("gh", [["19th century (written records)"], [oral], [oral], [oral], [oral]]),
  ...country("ke", [[oral], [oral], [oral], [oral], [oral]]),
  ...country("za", [[oral], [oral], [oral], [oral], [oral]]),
  ...country("eg", [
    ["c. 2400 BCE"],
    [oral],
    ["Ancient; sources span millennia"],
    ["Ancient; sources span millennia"],
    [oral],
  ]),
  ...country("mx", [
    ["19th century (written records)"],
    ["Pre-Hispanic; written versions from the 16th century"],
    ["1936", "Pedro Linares (alebrijes tradition)"],
    ["Ancient; versions span several centuries"],
    [oral],
  ]),
  ...country("ie", [
    ["19th century (written records)"],
    ["8th century"],
    ["19th century (written records)"],
    ["12th century"],
    [oral],
  ]),
  ...country("th", [
    [oral],
    ["20th century (written record)"],
    ["1873", "Sunthorn Phu"],
    ["18th century", "King Rama I's court (compiler)"],
    [oral],
  ]),
  ...country("tr", [["15th century"]]),
];

const FAME_ORDER = [
  "fr:1",
  "de:1",
  "de:2",
  "gb:3",
  "gb:2",
  "fr:3",
  "fr:2",
  "de:0",
  "de:3",
  "it:0",
  "gb:0",
  "gb:1",
  "fr:4",
  "gr:4",
  "gr:3",
  "gr:2",
  "gr:1",
  "us:4",
  "jp:1",
  "cn:1",
  "cn:2",
  "in:1",
  "in:0",
  "eg:0",
  "mx:0",
  "de:4",
  "jp:0",
  "ie:1",
  "ie:3",
  "gh:0",
  "jp:2",
  "mx:3",
  "br:0",
  "us:0",
  "us:1",
  "us:3",
  "us:2",
  "fr:0",
  "gr:0",
  "mx:1",
  "br:1",
  "br:2",
  "br:3",
  "br:4",
  "cn:0",
  "cn:3",
  "cn:4",
  "it:4",
  "it:1",
  "it:2",
  "it:3",
  "jp:3",
  "jp:4",
  "in:2",
  "in:3",
  "in:4",
  "kr:1",
  "kr:2",
  "kr:3",
  "kr:0",
  "kr:4",
  "id:1",
  "id:2",
  "id:3",
  "id:0",
  "id:4",
  "au:4",
  "au:1",
  "au:0",
  "au:2",
  "au:3",
  "gh:1",
  "gh:3",
  "gh:2",
  "gh:4",
  "ke:0",
  "ke:1",
  "ke:2",
  "ke:3",
  "ke:4",
  "za:0",
  "za:1",
  "za:2",
  "za:3",
  "za:4",
  "eg:3",
  "eg:2",
  "eg:1",
  "eg:4",
  "ie:0",
  "ie:2",
  "ie:4",
  "th:2",
  "th:3",
  "th:1",
  "th:4",
  "th:0",
  "tr:0",
  "mx:2",
  "mx:4",
];

const entriesByKey = new Map(
  COUNTRY_ENTRIES.map((entry) => [`${entry.iso}:${entry.taleIndex}`, entry]),
);

if (
  COUNTRY_ENTRIES.length !== 100 ||
  FAME_ORDER.length !== COUNTRY_ENTRIES.length ||
  entriesByKey.size !== COUNTRY_ENTRIES.length ||
  new Set(FAME_ORDER).size !== FAME_ORDER.length ||
  FAME_ORDER.some((key) => !entriesByKey.has(key))
) {
  throw new Error("The Top 100 list must rank every unique curated story exactly once.");
}

export const TOP_FABLES = FAME_ORDER.map((key) => {
  const entry = entriesByKey.get(key);
  if (!entry) {
    throw new Error(`Missing ranked story ${key}.`);
  }
  return entry;
});
