// African postcard name maps for the continent-wide batch (2026-11).
// Kept in its own module so scripts/city-photo-names.mjs stays a thin merge.
// CITY_SEARCH_NAMES: English label used for search + identity tokens.
// CITY_TEXT_ALIASES: extra place tokens that may appear in Commons metadata.
// TOURIST_SEARCH_NAMES: first entry becomes the postcard caption subject.
export const AFRICA_SEARCH_NAMES = {
  ao: {
    Benguela: "Benguela",
  },
  bf: {
    "A savana": "Mare aux Hippopotames",
    "Bobo-Dioulasso": "Bobo-Dioulasso",
    Uagadugu: "Ouagadougou",
  },
  bi: {
    "As colinas": "Kibira National Park",
    Gitega: "Gitega",
  },
  bw: {
    Gaborone: "Gaborone",
    "uma aldeia tswana": "Kalamare village",
  },
  cd: {
    Kinshasa: "Kinshasa",
    Kisangani: "Kisangani",
  },
  cf: {
    Floresta: "Dzanga-Sangha",
    "Rio Ubangi": "Ubangi River",
  },
  cg: {
    Brazzaville: "Brazzaville",
    "Pointe-Noire": "Pointe-Noire",
    "Rio Congo": "Congo River",
  },
  ci: {
    "Abidjã": "Abidjan",
    "Grand-Bassam": "Grand-Bassam",
    Yamoussoukro: "Yamoussoukro",
  },
  cm: {
    Duala: "Douala",
    Limbe: "Limbe",
  },
  cv: {
    Praia: "Praia",
  },
  dj: {
    Djibuti: "Djibouti City",
    "O lago Assal": "Lake Assal",
    Tadjourah: "Tadjoura",
  },
  dz: {
    "Tamanrasset / Tassili": "Tassili n'Ajjer",
  },
  er: {
    "As terras altas": "Keren",
    Asmara: "Asmara",
    Massawa: "Massawa",
  },
  et: {
    "Adis Abeba": "Addis Ababa",
    Axum: "Aksum",
    Lalibela: "Lalibela",
  },
  ga: {
    Floresta: "Lopé National Park",
    Libreville: "Libreville",
    "Port-Gentil": "Port-Gentil",
  },
  gh: {
    Acra: "Accra",
    "Cape Coast": "Cape Coast Castle",
    Kumasi: "Kumasi",
  },
  gm: {
    Juffureh: "Jufureh",
    "O rio Gâmbia": "Gambia River",
  },
  gq: {
    Bata: "Bata",
    Malabo: "Malabo",
    "Parque Nacional de Monte Alén": "Monte Alén National Park",
  },
  gw: {
    "Arquipélago dos Bijagós": "Bijagós Archipelago",
    Bissau: "Bissau",
    Bolama: "Bolama",
  },
  ls: {
    "as montanhas": "Maloti Mountains",
  },
  ly: {
    Ghat: "Ghat",
    "Trípoli": "Tripoli",
  },
  ma: {
    Marraquexe: "Marrakesh",
  },
  mg: {
    Antananarivo: "Antananarivo",
    "a costa": "Nosy Boraha",
    "a floresta": "Andasibe-Mantadia National Park",
  },
  ml: {
    Bamaco: "Bamako",
    "Rio Níger": "Niger River",
    Tombuctu: "Timbuktu",
  },
  mr: {
    Chinguetti: "Chinguetti",
    Deserto: "Adrar Plateau",
    Nouakchott: "Nouakchott",
  },
  mw: {
    Lilongwe: "Lilongwe",
    Zomba: "Zomba Plateau",
  },
  mz: {
    "Parque Nacional da Gorongosa": "Gorongosa National Park",
  },
  na: {
    Windhoek: "Windhoek",
    "a duna": "Sossusvlei",
    "o deserto": "Deadvlei",
  },
  ne: {
    Niamei: "Niamey",
    Sahel: "Sahel",
  },
  rw: {
    "As mil colinas": "Hills of Rwanda",
    Kigali: "Kigali",
  },
  sd: {
    "A confluência dos Nilos": "Confluence of the Niles",
    Cartum: "Khartoum",
    "Um palmar": "Date palms",
  },
  sl: {
    "A península": "Freetown Peninsula",
    Bo: "Bo",
    Freetown: "Freetown",
  },
  sn: {
    Dacar: "Dakar",
    "Lac Rose": "Lake Retba",
    "Saint-Louis": "Saint-Louis",
  },
  eh: {
    "o deserto": "Laayoune",
    "o mar": "Dakhla",
    "um acampamento": "Sahrawi refugee camps",
  },
  so: {
    Berbera: "Berbera",
    "Mogadíscio": "Mogadishu",
    "O mato": "Somali bush",
  },
  somaliland: {
    "As montanhas": "Daallo Mountain",
    Berbera: "Berbera",
    Hargeisa: "Hargeisa",
  },
  ss: {
    Juba: "Juba",
    "O Nilo": "Nile",
    "Um acampamento de gado": "Cattle camp",
  },
  st: {
    "Príncipe": "Príncipe",
    "São Tomé": "São Tomé",
  },
  sz: {
    Lobamba: "Lobamba",
    Mbabane: "Mbabane",
    "o vale": "Mlilwane Wildlife Sanctuary",
  },
  td: {
    "Lago Chade": "Lake Chad",
    "N'Djamena": "N'Djamena",
    "Rio Chari": "Chari River",
  },
  tg: {
    "Kpalimé": "Kpalimé",
    "Lomé": "Lomé",
    "O lago Togo": "Lake Togo",
  },
  tn: {
    "El Djem / Tozeur": "El Djem",
    "Sidi Bou Said": "Sidi Bou Said",
  },
  ug: {
    "As margens do lago Vitória": "Lake Victoria",
    Jinja: "Jinja",
    Kampala: "Kampala",
  },
  za: {
    Joanesburgo: "Johannesburg",
  },
  zm: {
    Lusaca: "Lusaka",
  },
  zw: {
    Harare: "Harare",
    "as ruínas de pedra": "Great Zimbabwe",
    "o Zambeze": "Zambezi",
  },
};

export const AFRICA_TEXT_ALIASES = {
  ao: {
    Benguela: ["Benguela"],
  },
  bf: {
    "A savana": ["Mare aux Hippopotames","Burkina Faso"],
    "Bobo-Dioulasso": ["Bobo-Dioulasso"],
    Uagadugu: ["Ouagadougou"],
  },
  bi: {
    "As colinas": ["Kibira National Park","Kibira","Burundi"],
    Gitega: ["Gitega","Diocese Gitega"],
  },
  bw: {
    Gaborone: ["Gaborone"],
    "uma aldeia tswana": ["Kalamare village","Kalamare","Serowe","Mochudi","Botswana"],
  },
  cd: {
    Kinshasa: ["Kinshasa"],
    Kisangani: ["Kisangani","Boyoma","Zaire"],
  },
  cf: {
    Floresta: ["Dzanga-Sangha","Dzanga","Sangha","Central African Republic"],
    "Rio Ubangi": ["Ubangi River","Bangui","Ubangi","Oubangui"],
  },
  cg: {
    Brazzaville: ["Brazzaville"],
    "Pointe-Noire": ["Pointe-Noire","Pointe Noire"],
    "Rio Congo": ["Congo River","Kisangani"],
  },
  ci: {
    "Abidjã": ["Abidjan","Lagune"],
    "Grand-Bassam": ["Grand-Bassam","Bassam"],
    Yamoussoukro: ["Yamoussoukro"],
  },
  cm: {
    Duala: ["Douala","Douala Cameroun"],
    Limbe: ["Limbe","Cameroon"],
  },
  cv: {
    Praia: ["Praia","Cape Verde"],
  },
  dj: {
    Djibuti: ["Djibouti City","Djibouti","Menelik"],
    "O lago Assal": ["Lake Assal","Assal","Djibouti"],
    Tadjourah: ["Tadjoura","Tadjourah"],
  },
  dz: {
    "Tamanrasset / Tassili": ["Tassili n'Ajjer","Ahaggar","Tamanrasset"],
  },
  er: {
    "As terras altas": ["Keren","Eritrea"],
    Asmara: ["Asmara","Fiat Tagliero"],
    Massawa: ["Massawa"],
  },
  et: {
    "Adis Abeba": ["Addis Ababa","Addis"],
    Axum: ["Aksum","Axum"],
    Lalibela: ["Lalibela"],
  },
  ga: {
    Floresta: ["Lopé National Park","Lope","Lopé","Gabon"],
    Libreville: ["Libreville"],
    "Port-Gentil": ["Port-Gentil","Port Gentil"],
  },
  gh: {
    Acra: ["Accra"],
    "Cape Coast": ["Cape Coast Castle","Cape Coast"],
    Kumasi: ["Kumasi","Kronum"],
  },
  gm: {
    Juffureh: ["Jufureh","Juffureh","Albreda"],
    "O rio Gâmbia": ["Gambia River","Gambia"],
  },
  gq: {
    Bata: ["Bata"],
    Malabo: ["Malabo","Santa Isabel"],
    "Parque Nacional de Monte Alén": ["Monte Alén National Park","Monte Alen","Monte Alén"],
  },
  gw: {
    "Arquipélago dos Bijagós": ["Bijagós Archipelago","Bijagos","Orango","Bissagos"],
    Bissau: ["Bissau"],
    Bolama: ["Bolama"],
  },
  ls: {
    "as montanhas": ["Maloti Mountains","Sani","Maloti","Lesotho"],
  },
  ly: {
    Ghat: ["Ghat"],
    "Trípoli": ["Tripoli"],
  },
  ma: {
    Marraquexe: ["Marrakesh","Marrakech","Djemaa"],
  },
  mg: {
    Antananarivo: ["Antananarivo","Rova"],
    "a costa": ["Nosy Boraha","Sainte-Marie","Madagascar"],
    "a floresta": ["Andasibe-Mantadia National Park","Andasibe","Mantadia"],
  },
  ml: {
    Bamaco: ["Bamako"],
    "Rio Níger": ["Niger River","Bamako","Niger"],
    Tombuctu: ["Timbuktu","Tombouctou","Sankore"],
  },
  mr: {
    Chinguetti: ["Chinguetti"],
    Deserto: ["Adrar Plateau","Adrar","Mauritania"],
    Nouakchott: ["Nouakchott"],
  },
  mw: {
    Lilongwe: ["Lilongwe"],
    Zomba: ["Zomba Plateau","Zomba"],
  },
  mz: {
    "Parque Nacional da Gorongosa": ["Gorongosa National Park","Gorongosa"],
  },
  na: {
    Windhoek: ["Windhoek"],
    "a duna": ["Sossusvlei","Namib"],
    "o deserto": ["Deadvlei","Dead Vlei","Namib"],
  },
  ne: {
    Niamei: ["Niamey"],
    Sahel: ["Sahel","Melek","Mélèk","Niger"],
  },
  rw: {
    "As mil colinas": ["Hills of Rwanda","Kivu","Rwanda","Karongi"],
    Kigali: ["Kigali"],
  },
  sd: {
    "A confluência dos Nilos": ["Confluence of the Niles","Confluence","Khartoum","Nile"],
    Cartum: ["Khartoum"],
    "Um palmar": ["Date palms","Dates","palm","Sudan"],
  },
  sl: {
    "A península": ["Freetown Peninsula","Freetown","Peninsula","Sierra Leone"],
    Bo: ["Bo","Sierra Leone"],
    Freetown: ["Freetown"],
  },
  sn: {
    Dacar: ["Dakar","Renaissance"],
    "Lac Rose": ["Lake Retba","Retba","Lac Rose"],
    "Saint-Louis": ["Saint-Louis","Saint Louis"],
  },
  eh: {
    "o deserto": ["Smara","Sahara","Laayoune","El Aaiun","Western Sahara"],
    "o mar": ["Dakhla","Dajla","Western Sahara","lagoon"],
    "um acampamento": ["Sahrawi","Tindouf","refugee","El Aioun","camp","khaima"],
  },
  so: {
    Berbera: ["Berbera"],
    "Mogadíscio": ["Mogadishu","Mogadiscio"],
    "O mato": ["Somali bush","Somalia","Somaliland"],
  },
  somaliland: {
    "As montanhas": ["Daallo","Erigavo","Sanaag","Cal Madow","Somaliland"],
    Berbera: ["Berbera","Somaliland"],
    Hargeisa: ["Hargeisa","Somaliland","Naasa Hablood"],
  },
  ss: {
    Juba: ["Juba","Garang"],
    "O Nilo": ["Nile","White Nile"],
    "Um acampamento de gado": ["Cattle camp","Mundari","cattle","South Sudan"],
  },
  st: {
    "Príncipe": ["Príncipe","Principe"],
    "São Tomé": ["São Tomé","Sao Tome","Views of São Tomé"],
  },
  sz: {
    Lobamba: ["Lobamba","Eswatini"],
    Mbabane: ["Mbabane"],
    "o vale": ["Mlilwane Wildlife Sanctuary","Mlilwane","Ezulwini","Eswatini"],
  },
  td: {
    "Lago Chade": ["Lake Chad","Tchad"],
    "N'Djamena": ["N'Djamena","Ndjamena","Djamena"],
    "Rio Chari": ["Chari River","Chari","Douguia"],
  },
  tg: {
    "Kpalimé": ["Kpalimé","Kpalime"],
    "Lomé": ["Lomé","Lome"],
    "O lago Togo": ["Lake Togo","Togo","Aneho","Aného"],
  },
  tn: {
    "El Djem / Tozeur": ["El Djem","El Jem","Thysdrus"],
    "Sidi Bou Said": ["Sidi Bou Said","Sidi Chebaan"],
  },
  ug: {
    "As margens do lago Vitória": ["Lake Victoria","Victoria"],
    Jinja: ["Jinja","Nile"],
    Kampala: ["Kampala"],
  },
  za: {
    Joanesburgo: ["Johannesburg"],
  },
  zm: {
    Lusaca: ["Lusaka"],
  },
  zw: {
    Harare: ["Harare"],
    "as ruínas de pedra": ["Great Zimbabwe","Zimbabwe"],
    "o Zambeze": ["Zambezi","Zambeze"],
  },
};

export const AFRICA_TOURIST_NAMES = {
  ao: {
    Benguela: ["Igreja de Benguela","Benguela"],
  },
  bf: {
    "A savana": ["Mare aux Hippopotames","Mare aux Hippopotames","Burkina Faso"],
    "Bobo-Dioulasso": ["Bobo-Dioulasso market","Bobo-Dioulasso"],
    Uagadugu: ["Monument aux héros nationaux","Ouagadougou"],
  },
  bi: {
    "As colinas": ["Kibira hills","Kibira","Burundi"],
    Gitega: ["Gitega cathedral","Gitega","Diocese Gitega"],
  },
  bw: {
    Gaborone: ["Gaborone city view","Gaborone"],
    "uma aldeia tswana": ["Kalamare village","Kalamare","Serowe","Mochudi","Botswana"],
  },
  cd: {
    Kinshasa: ["Kinshasa seen from Brazzaville","Kinshasa"],
    Kisangani: ["Boyoma Falls","Kisangani","Boyoma","Zaire"],
  },
  cf: {
    Floresta: ["Dzanga Bai","Dzanga","Sangha","Central African Republic"],
    "Rio Ubangi": ["O rio Ubangi","Bangui","Ubangi","Oubangui"],
  },
  cg: {
    Brazzaville: ["Brazzaville city view","Brazzaville"],
    "Pointe-Noire": ["Pointe-Noire","Pointe-Noire","Pointe Noire"],
    "Rio Congo": ["Pirogas no rio Congo","Congo River","Kisangani"],
  },
  ci: {
    "Abidjã": ["Abidjan lagoon","Abidjan","Lagune"],
    "Grand-Bassam": ["Grand-Bassam greenery","Bassam","Grand-Bassam"],
    Yamoussoukro: ["Yamoussoukro panorama","Yamoussoukro"],
  },
  cm: {
    Duala: ["Bali quarter, Douala","Douala","Douala Cameroun"],
    Limbe: ["Limbe Atlantic coast","Limbe","Cameroon"],
  },
  cv: {
    Praia: ["Palácio da Cultura","Praia","Cape Verde"],
  },
  dj: {
    Djibuti: ["Place Menelik","Djibouti","Menelik"],
    "O lago Assal": ["Lake Assal","Assal","Djibouti"],
    Tadjourah: ["Tadjourah white city","Tadjourah","Tadjoura"],
  },
  dz: {
    "Tamanrasset / Tassili": ["Tassili n'Ajjer desert","Tassili n'Ajjer","Ahaggar","Tamanrasset"],
  },
  er: {
    "As terras altas": ["Keren highlands","Keren","Eritrea"],
    Asmara: ["Fiat Tagliero building","Asmara","Fiat Tagliero"],
    Massawa: ["Massawa harbour","Massawa"],
  },
  et: {
    "Adis Abeba": ["Addis Ababa city view","Addis Ababa","Addis"],
    Axum: ["Stelae of Aksum","Aksum","Axum"],
    Lalibela: ["Church of Saint George","Lalibela"],
  },
  ga: {
    Floresta: ["Elephants in Lopé","Lope","Lopé","Gabon"],
    Libreville: ["Libreville waterfront","Libreville"],
    "Port-Gentil": ["Port-Gentil from the air","Port-Gentil","Port Gentil"],
  },
  gh: {
    Acra: ["Accra town view","Accra"],
    "Cape Coast": ["Cape Coast Castle","Cape Coast"],
    Kumasi: ["Kumasi street","Kumasi","Kronum"],
  },
  gm: {
    Juffureh: ["Albreda-Jufureh archway","Jufureh","Juffureh","Albreda"],
    "O rio Gâmbia": ["Gambia River","Gambia River","Gambia"],
  },
  gq: {
    Bata: ["Bata city view","Bata"],
    Malabo: ["Santa Isabel cathedral","Malabo","Santa Isabel"],
    "Parque Nacional de Monte Alén": ["Monte Alén rainforest","Monte Alen","Monte Alén"],
  },
  gw: {
    "Arquipélago dos Bijagós": ["Orango lagoon","Bijagos","Orango","Bissagos"],
    Bissau: ["Bissau street scene","Bissau"],
    Bolama: ["Bolama monument","Bolama"],
  },
  ls: {
    "as montanhas": ["Sani Pass","Sani","Maloti","Lesotho"],
  },
  ly: {
    Ghat: ["Ghat from the fortress","Ghat"],
    "Trípoli": ["Marcus Aurelius Arch","Tripoli"],
  },
  ma: {
    Marraquexe: ["Jemaa el-Fnaa square","Marrakesh","Marrakech","Djemaa"],
  },
  mg: {
    Antananarivo: ["Rova of Antananarivo","Antananarivo","Rova"],
    "a costa": ["Beach at Sainte-Marie","Sainte-Marie","Nosy Boraha","Madagascar"],
    "a floresta": ["Andasibe-Mantadia forest","Andasibe","Mantadia"],
  },
  ml: {
    Bamaco: ["Place de la Liberté","Bamako"],
    "Rio Níger": ["Bamako bridge over the Niger","Bamako","Niger"],
    Tombuctu: ["Sankoré Mosque","Timbuktu","Tombouctou","Sankore"],
  },
  mr: {
    Chinguetti: ["Old town of Chinguetti","Chinguetti"],
    Deserto: ["Adrar reg","Adrar","Mauritania"],
    Nouakchott: ["Nouakchott beach","Nouakchott"],
  },
  mw: {
    Lilongwe: ["Lilongwe clock tower","Lilongwe"],
    Zomba: ["Zomba Plateau","Zomba"],
  },
  mz: {
    "Parque Nacional da Gorongosa": ["Mount Gorongosa","Gorongosa"],
  },
  na: {
    Windhoek: ["Christ Church","Windhoek"],
    "a duna": ["Dune at Sossusvlei","Sossusvlei","Namib"],
    "o deserto": ["Deadvlei","Deadvlei","Dead Vlei","Namib"],
  },
  ne: {
    Niamei: ["Niamey from the Grand Mosque","Niamey"],
    Sahel: ["Mélèk village","Melek","Mélèk","Sahel","Niger"],
  },
  rw: {
    "As mil colinas": ["Hills above Lake Kivu","Kivu","Rwanda","Karongi"],
    Kigali: ["Kigali city view","Kigali"],
  },
  sd: {
    "A confluência dos Nilos": ["Confluence of the Blue and White Nile","Confluence","Khartoum","Nile"],
    Cartum: ["Khartoum market","Nile at Khartoum","Khartoum"],
    "Um palmar": ["Date palm grove","Dates","palm","Sudan"],
  },
  sl: {
    "A península": ["Beach on the peninsula","Freetown","Peninsula","Sierra Leone"],
    Bo: ["Rice fields around Bo","Bo","Sierra Leone"],
    Freetown: ["Freetown aerial view","Freetown"],
  },
  sn: {
    Dacar: ["African Renaissance Monument","Dakar","Renaissance"],
    "Lac Rose": ["Lake Retba","Retba","Lac Rose"],
    "Saint-Louis": ["Saint-Louis island","Saint-Louis","Saint Louis"],
  },
  eh: {
    "o deserto": ["Laayoune in the Sahara","Laayoune","Sahara"],
    "o mar": ["Dakhla waterfront","Dakhla","Western Sahara"],
    "um acampamento": ["Sahrawi refugee camp","Tindouf","khaima"],
  },
  so: {
    Berbera: ["Berbera city","Berbera"],
    "Mogadíscio": ["Lido beach","Mogadishu","Mogadiscio"],
    "O mato": ["Somali landscape from the air","Somalia","Somaliland"],
  },
  somaliland: {
    "As montanhas": ["Daallo Mountain","Erigavo","Cal Madow","Somaliland"],
    Berbera: ["Berbera harbour","Berbera","Somaliland"],
    Hargeisa: ["Hargeisa city view","Hargeisa","Somaliland"],
  },
  ss: {
    Juba: ["John Garang Mausoleum","Juba","Garang"],
    "O Nilo": ["Nile river landscape","Nile","White Nile"],
    "Um acampamento de gado": ["Mundari cattle camp","Mundari","cattle","South Sudan"],
  },
  st: {
    "Príncipe": ["Praia Boi","Principe","Príncipe"],
    "São Tomé": ["Vista de São Tomé","Sao Tome","São Tomé","Views of São Tomé"],
  },
  sz: {
    Lobamba: ["Parliament of Eswatini","Lobamba","Eswatini"],
    Mbabane: ["Mbabane city view","Mbabane"],
    "o vale": ["Mlilwane valley","Mlilwane","Ezulwini","Eswatini"],
  },
  td: {
    "Lago Chade": ["Lake Chad fisherman","Lake Chad","Tchad"],
    "N'Djamena": ["Avenida Alifa Zezerty","N'Djamena","Ndjamena","Djamena"],
    "Rio Chari": ["Chari river at Douguia","Chari","Douguia"],
  },
  tg: {
    "Kpalimé": ["Holy Spirit Cathedral","Kpalime","Kpalimé"],
    "Lomé": ["Independence monument","Lome","Lomé"],
    "O lago Togo": ["Lagoon at Aného","Togo","Aneho","Aného"],
  },
  tn: {
    "El Djem / Tozeur": ["Amphitheatre of El Jem","El Jem","El Djem","Thysdrus"],
    "Sidi Bou Said": ["Sidi Bou Said village view","Sidi Bou Said","Sidi Chebaan"],
  },
  ug: {
    "As margens do lago Vitória": ["Boats on Lake Victoria","Lake Victoria","Victoria"],
    Jinja: ["Source of the Nile","Jinja","Nile"],
    Kampala: ["Kasubi Tombs","Kampala"],
  },
  za: {
    Joanesburgo: ["Johannesburg CBD","Johannesburg"],
  },
  zm: {
    Lusaca: ["Downtown Lusaka","Lusaka"],
  },
  zw: {
    Harare: ["Harare city view","Harare"],
    "as ruínas de pedra": ["Conical Tower, Great Zimbabwe","Zimbabwe","Great Zimbabwe"],
    "o Zambeze": ["Rio Zambeze em Mana Pools","Zambezi","Zambeze"],
  },
};
