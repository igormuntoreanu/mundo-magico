// Extracted from fetch-city-photos.mjs (search-name and landmark maps).
// Generated 2026-10-21; keep in sync with that script.

export const CITY_SEARCH_NAMES = {
  us: { "Nova York": "New York City", "São Francisco": "San Francisco" },
  ca: { Quebec: "Quebec City" },
  mx: { "Cidade do México": "Mexico City", Cancún: "Cancun" },
  gt: { Antígua: "Antigua Guatemala", "Floresta alta": "Alta Verapaz Guatemala" },
  bz: { "Cidade de Belize": "Belize City" },
  hn: { Copán: "Copan Ruinas", "Lago de Yojoa": "Lake Yojoa" },
  ni: { León: "Leon Nicaragua" },
  cr: {
    "Parque Manuel Antonio": "Manuel Antonio National Park",
    "San José": "San Jose Costa Rica",
  },
  pa: { "Cidade do Panamá": "Panama City" },
  cu: { Havana: "Havana Cuba", Trinidad: "Trinidad Cuba" },
  ht: { "Porto Príncipe": "Port-au-Prince", "Cap-Haïtien": "Cap Haitien" },
  do: { "Santo Domingo": "Santo Domingo", "Puerto Plata": "Puerto Plata" },
  bs: { "A ilha do porto": "Harbour Island Bahamas" },
  tt: { "Porto de Espanha": "Port of Spain" },
  pr: { "A floresta de Yunque": "El Yunque National Forest" },
  co: { Bogotá: "Bogota", Medellín: "Medellin" },
  py: { Assunção: "Asuncion", Itaipú: "Itaipu Dam" },
  ec: { Galápagos: "Galapagos Islands" },
  gy: { "Rio Essequibo": "Essequibo River Guyana" },
  sr: { "Rio Suriname": "Suriname River" },
  fk: { "A campina": "Falkland Islands Camp" },
  jp: { Tóquio: "Tokyo", Quioto: "Kyoto", Osaka: "Osaka Japan" },
  cn: { Pequim: "Beijing", Xangai: "Shanghai", "Xi'an": "Xi'an China" },
  in: { "Nova Délhi": "New Delhi" },
  eg: { Assuão: "Aswan" },
  za: { "Cidade do Cabo": "Cape Town", Joanesburgo: "Johannesburg" },
  au: { Cairns: "Cairns Australia" },
  kr: { Seul: "Seoul", Busan: "Busan South Korea", Jeju: "Jeju Island South Korea" },
  th: { Banguecoque: "Bangkok", Phuket: "Phuket Thailand" },
  ng: { Lagos: "Lagos Nigeria", Abuja: "Abuja Nigeria", Calabar: "Calabar Nigeria" },
  ke: { Nairóbi: "Nairobi", "Masai Mara": "Maasai Mara" },
  ma: { Marraquexe: "Marrakech", Fez: "Fes Morocco", Chefchaouen: "Chefchaouen Morocco" },
  id: {
    Jacarta: "Jakarta",
    "Bali (Denpasar/Ubud)": "Bali Indonesia",
    Yogyakarta: "Yogyakarta Indonesia",
  },
  vn: {
    Hanói: "Hanoi",
    "Baía de Hạ Long": "Ha Long Bay",
    "Cidade de Ho Chi Minh": "Ho Chi Minh City",
  },
  sa: { Riade: "Riyadh", AlUla: "AlUla Saudi Arabia" },
  nz: { Auckland: "Auckland New Zealand", Queenstown: "Queenstown New Zealand" },
  gh: { Acra: "Accra Ghana", Kumasi: "Kumasi Ghana" },
  et: { "Adis Abeba": "Addis Ababa", Axum: "Aksum Ethiopia" },
  tz: {
    "Zanzibar (Stone Town)": "Stone Town Zanzibar",
    "Arusha / Serengeti": "Serengeti Tanzania",
  },
  il: { Jerusalém: "Jerusalem", Telavive: "Tel Aviv", "Mar Morto / Massada": "Dead Sea Masada" },
  pk: { Carachi: "Karachi Pakistan" },
  bd: { Daca: "Dhaka Bangladesh", "Cox's Bazar": "Cox's Bazar Bangladesh" },
  np: { Catmandu: "Kathmandu Nepal", "Everest / Namche": "Namche Bazaar Everest Nepal" },
  lk: { Sigiriya: "Sigiriya Sri Lanka" },
  sn: { Dacar: "Dakar Senegal", "Lac Rose": "Lake Retba Senegal" },
  tn: { Tunes: "Tunis Tunisia", "Sidi Bou Said": "Sidi Bou Said Tunisia" },
  dz: { Argel: "Algiers", Constantina: "Constantine Algeria" },
  cm: { Yaoundé: "Yaounde Cameroon", Duala: "Douala Cameroon", Limbe: "Limbe Cameroon" },
  tw: {
    Taipé: "Taipei Taiwan",
    "Taichung / Sun Moon Lake": "Sun Moon Lake Taiwan",
    Kaohsiung: "Kaohsiung Taiwan",
  },
  ae: { Dubai: "Dubai UAE", "Abu Dhabi": "Abu Dhabi UAE", Sharjah: "Sharjah UAE" },
  iq: { Bagdade: "Baghdad Iraq", Erbil: "Erbil Iraq" },
  fr: { Versalhes: "Versailles" },
  de: { Berlim: "Berlin", Munique: "Munich", Colônia: "Cologne", Hamburgo: "Hamburg" },
  it: { Roma: "Rome", Veneza: "Venice", Florença: "Florence", Nápoles: "Naples", Milão: "Milan" },
  es: { Sevilha: "Seville", Valência: "Valencia" },
  gb: { Londres: "London", Edimburgo: "Edinburgh" },
  ru: { Moscou: "Moscow", "São Petersburgo": "Saint Petersburg" },
  tr: { Istambul: "Istanbul", Capadócia: "Cappadocia", Ancara: "Ankara", Antália: "Antalya" },
  nl: { Amsterdã: "Amsterdam", Roterdã: "Rotterdam" },
  se: { Estocolmo: "Stockholm", Gotemburgo: "Gothenburg" },
  pl: {
    Cracóvia: "Krakow",
    Varsóvia: "Warsaw",
    Gdańsk: "Gdansk",
    Wrocław: "Wroclaw",
    Poznań: "Poznan",
  },
  no: { Tromsø: "Tromso", Ålesund: "Alesund" },
  dk: { Copenhaga: "Copenhagen" },
  ch: { Berna: "Bern", Zurique: "Zurich", Lucerna: "Lucerne", Genebra: "Geneva" },
  be: { Bruxelas: "Brussels", Antuérpia: "Antwerp" },
  at: { Viena: "Vienna", Salzburgo: "Salzburg" },
  cz: { Praga: "Prague", "Český Krumlov": "Cesky Krumlov", "Kutná Hora": "Kutna Hora" },
  hu: { Budapeste: "Budapest", "Lago Balaton": "Lake Balaton" },
  ro: { Bucareste: "Bucharest", Brașov: "Brasov", Sighișoara: "Sighisoara" },
  gr: { Atenas: "Athens", Rodes: "Rhodes", Tessalónica: "Thessaloniki" },
  pt: { Lisboa: "Lisbon", Évora: "Evora" },
  al: { Shkodër: "Shkoder" },
  cy: { Nicósia: "Nicosia", Pafos: "Paphos" },
  am: { Erevã: "Yerevan" },
  by: { Minsque: "Minsk" },
  lv: { Jūrmala: "Jurmala", Cēsis: "Cesis" },
  ee: { Talim: "Tallinn" },
  md: { Chișinău: "Chisinau" },
  is: { Reykjavík: "Reykjavik", "Círculo Dourado": "Golden Circle Iceland" },
  fi: { Helsínquia: "Helsinki" },
  bg: { Sófia: "Sofia" },
  hr: { "Lagos de Plitvice": "Plitvice Lakes" },
  rs: { Belgrado: "Belgrade", Niš: "Nis" },
  sk: { Košice: "Kosice", "Montes Tatras": "High Tatras" },
  si: { Liubliana: "Ljubljana" },
  ie: { Dublin: "Dublin", Galway: "Galway", Cork: "Cork Ireland" },
  mk: { Skopje: "Skopje", Ohrid: "Ohrid" },
  ba: { Sarajevo: "Sarajevo", Mostar: "Mostar", Blagaj: "Blagaj" },
  ge: { Tbilisi: "Tbilisi", Telavi: "Telavi", Mestia: "Mestia" },
  az: { Baku: "Baku Azerbaijan", Sheki: "Shaki Azerbaijan" },
  lt: { Vilnius: "Vilnius", Trakai: "Trakai", Nida: "Nida Lithuania" },
  lu: { Luxemburgo: "Luxembourg", Echternach: "Echternach", Vianden: "Vianden" },
  me: { Podgorica: "Podgorica", Kotor: "Kotor Montenegro", Cetinje: "Cetinje" },
  xk: { Pristina: "Pristina Kosovo", Prizren: "Prizren Kosovo", Gračanica: "Gracanica Kosovo" },
};
export const CITY_TEXT_ALIASES = {
  cu: { Havana: ["La Habana"] },
  bs: { "A ilha do porto": ["Harbor Island"] },
  it: { Florença: ["Firenze"] },
  ch: { Lucerna: ["Luzern"] },
};
export const CITY_EXCLUDE_PLACES = {
  al: { Tirana: ["Valias", "Fusha e Tiranës"] },
  au: { Melbourne: ["Bundoora"] },
  es: { Valência: ["Castellon"] },
  de: { Dresden: ["Galopprennbahn", "Gompitz A-Turm"] },
  gb: { Oxford: ["Kassam Stadium"] },
  pl: {
    Cracóvia: ["Kraków Główny", "Wołodkowicz Palace", "Pawia street"],
    Poznań: ["Bridgestone"],
  },
  ph: { Palawan: ["Bucana", "Sabang Wharf"] },
  iq: { Bagdade: ["Hatra"] },
  tn: { Tunes: ["Tunisia-2024"] },
  pk: { Islamabad: ["Rawat Fort", "Ariel View Pakistan Monument"] },
  be: { Bruxelas: ["approaching Brussels from Rome", "Rond-Point Schuman"] },
  mk: { Ohrid: ["Struga"] },
};
export const TOURIST_SEARCH_NAMES = {
  jp: {
    Tóquio: ["Tokyo Tower", "Shibuya Crossing", "Senso-ji Temple"],
    Quioto: ["Fushimi Inari Shrine", "Kinkaku-ji Temple", "Arashiyama Bamboo Grove"],
    Osaka: ["Osaka Castle", "Dotonbori", "Universal Studios Japan"],
  },
  cn: {
    Pequim: ["Great Wall of China", "Forbidden City Beijing", "Temple of Heaven Beijing"],
    Xangai: ["The Bund Shanghai", "Oriental Pearl Tower", "Yu Garden Shanghai"],
    "Xi'an": ["Terracotta Army", "Xi'an City Wall", "Giant Wild Goose Pagoda"],
  },
  in: {
    Agra: ["Taj Mahal", "Agra Fort", "Itimad-ud-Daulah"],
    Jaipur: ["Hawa Mahal", "Amber Fort", "Pink City Jaipur"],
    "Nova Délhi": ["India Gate Delhi", "Qutb Minar", "Lotus Temple Delhi"],
  },
  eg: {
    Cairo: ["Giza Pyramids", "Great Sphinx of Giza", "Egyptian Museum Cairo"],
    Luxor: ["Valley of the Kings", "Karnak Temple", "Luxor Temple"],
    Assuão: ["Philae Temple", "Aswan Dam", "Elephantine Island"],
  },
  za: {
    "Cidade do Cabo": ["Table Mountain", "Cape of Good Hope", "V&A Waterfront"],
    Joanesburgo: ["Apartheid Museum", "Soweto Johannesburg", "Johannesburg Zoo"],
    Durban: ["Golden Mile Durban", "uShaka Marine World", "Valley of a Thousand Hills"],
  },
  au: {
    Sydney: ["Sydney Opera House", "Sydney Harbour Bridge", "Bondi Beach"],
    Melbourne: ["Federation Square", "Royal Botanic Gardens Melbourne", "Melbourne skyline"],
    Cairns: ["Great Barrier Reef", "Daintree Rainforest", "Kuranda Scenic Railway"],
  },
  kr: {
    Seul: ["Gyeongbokgung Palace", "N Seoul Tower", "Bukchon Hanok Village"],
    Busan: ["Haedong Yonggungsa Temple", "Haeundae Beach", "Gamcheon Culture Village"],
    Jeju: ["Seongsan Ilchulbong", "Hallasan", "Jeju black sand beach"],
  },
  th: {
    Banguecoque: ["Grand Palace Bangkok", "Wat Arun", "Damnoen Saduak Floating Market"],
    "Chiang Mai": ["Wat Phra That Doi Suthep", "Chiang Mai Old City", "Elephant Nature Park"],
    Phuket: ["Patong Beach", "Big Buddha Phuket", "Phi Phi Islands"],
  },
  ng: {
    Lagos: ["Nike Art Gallery Lagos", "Tarkwa Bay", "Lekki Conservation Centre"],
    Abuja: ["National Mosque Abuja", "Aso Rock", "Millennium Park Abuja"],
    Calabar: ["Calabar Carnival", "Drill Ranch Calabar", "Marina Resort Calabar"],
  },
  ke: {
    Nairóbi: ["Nairobi National Park", "Giraffe Centre Nairobi", "Nairobi National Museum"],
    Mombasa: ["Fort Jesus Mombasa", "Diani Beach", "Old Town Mombasa"],
    "Masai Mara": ["Maasai Mara Great Migration", "Maasai Mara balloon safari", "Maasai Mara"],
  },
  ma: {
    Marraquexe: ["Jemaa el-Fnaa", "Jardin Majorelle", "Bahia Palace Marrakech"],
    Fez: ["Fes Medina", "Chouara Tannery", "Al Quaraouiyine University"],
    Chefchaouen: ["Chefchaouen blue city", "Chefchaouen medina", "Ras El Maa waterfall"],
  },
  id: {
    Jacarta: ["Monas Jakarta", "Kota Tua Jakarta", "Thousand Islands Indonesia"],
    "Bali (Denpasar/Ubud)": ["Tanah Lot Temple", "Ubud rice terraces", "Kuta Beach Bali"],
    Yogyakarta: ["Borobudur Temple", "Prambanan Temple", "Kraton Yogyakarta"],
  },
  vn: {
    Hanói: ["Hoan Kiem Lake", "Thang Long Imperial Citadel", "Temple of Literature Hanoi"],
    "Baía de Hạ Long": ["Ha Long Bay limestone islands", "Ha Long Bay caves", "Ha Long Bay aerial"],
    "Cidade de Ho Chi Minh": ["Ben Thanh Market", "Reunification Palace", "Cu Chi Tunnels"],
  },
  sa: {
    Riade: ["Diriyah Riyadh", "Kingdom Centre Tower", "Riyadh Boulevard"],
    Jeddah: ["Jeddah Corniche", "Al-Balad Jeddah", "King Fahd Fountain"],
    AlUla: ["Hegra AlUla", "AlUla sandstone formations", "AlUla oasis"],
  },
  nz: {
    Auckland: ["Sky Tower Auckland", "Waiheke Island", "Auckland Maritime Museum"],
    Wellington: ["Te Papa Museum", "Mount Victoria Wellington", "Cuba Street Wellington"],
    Queenstown: ["Lake Wakatipu", "The Remarkables Queenstown", "Milford Sound"],
  },
  gh: {
    Acra: ["Independence Square Accra", "Jamestown Accra", "Makola Market"],
    "Cape Coast": ["Cape Coast Castle", "Cape Coast beach", "Kakum National Park"],
    Kumasi: ["Manhyia Palace", "Kejetia Market", "Kente weaving Kumasi"],
  },
  et: {
    "Adis Abeba": ["Mercato Addis Ababa", "National Museum of Ethiopia", "Mount Entoto"],
    Lalibela: ["Lalibela rock-hewn churches", "Lalibela churches aerial", "Lalibela mountains"],
    Axum: ["Aksum obelisks", "Aksum ruins", "Church of Our Lady Mary of Zion"],
  },
  tz: {
    "Dar es Salaam": ["National Museum Tanzania", "Dar es Salaam coastline", "Kariakoo Market"],
    "Zanzibar (Stone Town)": ["Stone Town Zanzibar", "Zanzibar beach", "Zanzibar spice farm"],
    "Arusha / Serengeti": ["Serengeti Great Migration", "Ngorongoro Crater", "Mount Kilimanjaro"],
  },
  il: {
    Jerusalém: ["Jerusalem Old City", "Western Wall Jerusalem", "Mount of Olives"],
    Telavive: ["Tel Aviv beach", "Old Jaffa", "Carmel Market Tel Aviv"],
    "Mar Morto / Massada": ["Dead Sea salt shore", "Masada fortress", "Masada desert"],
  },
  pk: {
    Lahore: ["Badshahi Mosque", "Lahore Fort", "Shalimar Gardens Lahore"],
    Islamabad: [
      "Faisal Mosque Islamabad aerial",
      "Faisal Mosque Islamabad drone",
      "Margalla Hills Islamabad aerial",
    ],
    Carachi: ["Mazar-e-Quaid", "Clifton Beach Karachi", "Empress Market Karachi"],
  },
  bd: {
    Daca: ["Lalbagh Fort", "Ahsan Manzil", "Sadarghat Dhaka"],
    Sundarbans: ["Sundarbans mangrove forest", "Sundarbans tiger", "Sundarbans boat"],
    "Cox's Bazar": ["Cox's Bazar beach", "Cox's Bazar sunset", "Cox's Bazar fishing boats"],
  },
  np: {
    Catmandu: ["Kathmandu Durbar Square", "Swayambhunath Stupa", "Boudhanath Stupa"],
    Pokhara: ["Phewa Lake Pokhara", "Annapurna range Pokhara", "Pokhara paragliding"],
    "Everest / Namche": ["Everest Base Camp trail", "Namche Bazaar", "Everest monastery"],
  },
  lk: {
    Colombo: ["Galle Face Green", "Gangaramaya Temple", "Pettah Market Colombo"],
    Kandy: ["Temple of the Tooth", "Kandy Lake", "Royal Botanical Gardens Peradeniya"],
    Sigiriya: ["Sigiriya Lion Rock", "Galle Fort", "Sri Lanka beach"],
  },
  sn: {
    Dacar: ["African Renaissance Monument", "Sandaga Market Dakar", "Goree Island Senegal"],
    "Saint-Louis": [
      "Saint-Louis Senegal island",
      "Faidherbe Bridge",
      "Djoudj National Bird Sanctuary",
    ],
    "Lac Rose": ["Lake Retba Senegal", "Lake Retba dunes", "Lake Retba boats"],
  },
  tn: {
    Tunes: ["Tunis Medina", "Bardo National Museum", "Carthage archaeological site"],
    "Sidi Bou Said": [
      "Sidi Bou Said blue white houses",
      "Sidi Bou Said cafe",
      "Sidi Bou Said viewpoint",
    ],
    "El Djem / Tozeur": ["El Djem Amphitheatre", "Tozeur oasis", "Sahara desert Tunisia"],
  },
  dz: {
    Argel: ["Casbah of Algiers", "Notre Dame d'Afrique", "Garden of Test"],
    Constantina: ["Constantine Algeria bridges", "Constantine gorges", "Constantine palace"],
    "Tamanrasset / Tassili": ["Tassili n'Ajjer", "Tamanrasset desert", "Tassili rock art"],
  },
  cm: {
    Yaoundé: ["Mount Febe Yaounde", "National Museum of Cameroon", "Yaounde market"],
    Duala: ["Wouri River Douala", "Douala port", "Douala beach"],
    Limbe: ["Limbe black sand beach", "Limbe Botanic Garden", "Mount Cameroon"],
  },
  tw: {
    Taipé: ["Taipei 101", "Taipei night market", "Longshan Temple Taipei"],
    "Taichung / Sun Moon Lake": ["Sun Moon Lake Taiwan", "Wenwu Temple", "Sun Moon Lake cycling"],
    Kaohsiung: ["Kaohsiung harbor", "Fo Guang Shan Buddha Museum", "Lotus Pond Kaohsiung"],
  },
  ae: {
    Dubai: ["Burj Khalifa", "Dubai Mall", "Dubai desert aerial"],
    "Abu Dhabi": ["Sheikh Zayed Grand Mosque", "Louvre Abu Dhabi", "Yas Island"],
    Sharjah: ["Sharjah Museum", "Sharjah Souq", "Sharjah beach"],
  },
  iq: {
    Bagdade: ["Iraq Museum Baghdad", "Tigris River Baghdad", "Baghdad market"],
    "Babilónia / Hillah": ["Babylon ruins", "Lion of Babylon", "Hillah Euphrates River"],
    Erbil: ["Erbil Citadel", "Erbil bazaar", "Erbil parks"],
  },
  us: {
    "Nova York": ["Statue of Liberty", "Times Square", "Central Park"],
    "Washington, D.C.": ["White House", "Lincoln Memorial", "United States Capitol"],
    "São Francisco": [
      "Golden Gate Bridge from above",
      "Alcatraz Island aerial",
      "San Francisco Bay aerial",
    ],
  },
  ca: {
    Toronto: ["CN Tower", "Toronto Islands", "Distillery District"],
    Quebec: ["Chateau Frontenac", "Old Quebec", "Montmorency Falls"],
    Vancouver: ["Stanley Park", "Capilano Suspension Bridge", "Granville Island"],
  },
  mx: {
    "Cidade do México": [
      "Xochimilco Mexico City aerial",
      "National Museum of Anthropology Mexico City",
      "Zocalo Mexico City daylight",
    ],
    Cancún: ["Chichen Itza", "Cancun Caribbean beach", "Isla Mujeres"],
    Guadalajara: ["Hospicio Cabanas Guadalajara", "Teatro Degollado", "Tlaquepaque"],
  },
  gt: {
    Antígua: [
      "Santa Catalina Arch Antigua Guatemala",
      "Antigua Guatemala colonial center",
      "Volcan de Agua",
    ],
    "Santiago Atitlán": [
      "Lake Atitlan panoramic view",
      "San Pedro Volcano Lake Atitlan",
      "Santiago Atitlan boats",
    ],
    "Floresta alta": ["Semuc Champey aerial", "Semuc Champey pools", "Lanquin caves Guatemala"],
  },
  bz: {
    "Cidade de Belize": ["Belize Swing Bridge", "Belize City waterfront", "Baron Bliss Lighthouse"],
    "San Ignacio": ["Xunantunich Mayan ruins", "Cahal Pech Maya site", "San Ignacio Belize"],
    Dangriga: [
      "South Water Caye Belize",
      "Gulisi Garifuna Museum Dangriga",
      "Hopkins Village Belize beach",
    ],
  },
  sv: {
    "San Salvador": [
      "San Salvador historic center",
      "National Palace San Salvador",
      "El Salvador del Mundo monument",
    ],
    Suchitoto: ["Suchitoto Lake Suchitlan", "Suchitoto colonial center", "Suchitoto El Salvador"],
    Izalco: ["Izalco Volcano crater", "Cerro Verde National Park", "Izalco volcano aerial"],
  },
  hn: {
    Copán: ["Copan Ruins", "Copan Acropolis", "Copan archaeological site"],
    Tegucigalpa: ["El Picacho Tegucigalpa", "Basilica of Suyapa", "Tegucigalpa historic center"],
    "Lago de Yojoa": [
      "Pulhapanzak Waterfall",
      "Lake Yojoa panorama Honduras",
      "Catarata Pulhapanzak",
    ],
  },
  ni: {
    Granada: [
      "Granada Nicaragua cathedral",
      "Granada Nicaragua colonial center",
      "Lake Nicaragua islets",
    ],
    Ometepe: ["Ometepe Island aerial", "Concepcion Volcano Ometepe", "Maderas Volcano Ometepe"],
    León: [
      "Leon Cathedral Nicaragua aerial",
      "Cerro Negro Volcano Leon Nicaragua",
      "Leon Viejo ruins",
    ],
  },
  cr: {
    "San José": [
      "National Theatre of Costa Rica",
      "San Jose Costa Rica historic center",
      "Central Market San Jose Costa Rica",
    ],
    "La Fortuna": ["Arenal Volcano", "La Fortuna Waterfall", "La Fortuna Costa Rica aerial"],
    "Parque Manuel Antonio": [
      "Espadilla Beach Costa Rica",
      "Punta Catedral Manuel Antonio",
      "Manuel Antonio National Park viewpoint",
    ],
  },
  pa: {
    "Cidade do Panamá": ["Panama Canal aerial", "Casco Viejo Panama", "Biomuseo Panama"],
    "Bocas del Toro": [
      "Red Frog Beach Bocas del Toro",
      "Zapatilla Island Panama",
      "Starfish Beach Bocas del Toro",
    ],
    Boquete: ["Volcan Baru Boquete", "Boquete Panama coffee farms", "Boquete cloud forest"],
  },
  cu: {
    Havana: [
      "Havana Malecon aerial",
      "Plaza Vieja Havana",
      "El Capitolio Havana",
      "Morro Castle Havana",
    ],
    Trinidad: ["Trinidad Cuba Plaza Mayor", "Valle de los Ingenios", "Trinidad Cuba aerial"],
    Varadero: ["Varadero beach aerial", "Varadero Peninsula", "Varadero Cuba coastline"],
  },
  jm: {
    Kingston: [
      "Bob Marley Museum Kingston aerial",
      "Devon House Kingston Jamaica",
      "Emancipation Park Kingston Jamaica",
      "Blue Mountains Jamaica aerial",
    ],
    "Montego Bay": [
      "Doctor's Cave Beach Montego Bay",
      "Rose Hall Great House",
      "Montego Bay Hip Strip",
    ],
    "Ocho Rios": ["Dunn's River Falls", "Blue Hole Ocho Rios", "Mystic Mountain Ocho Rios"],
  },
  ht: {
    "Porto Príncipe": [
      "Iron Market Port-au-Prince",
      "Port-au-Prince waterfront",
      "National Palace Haiti",
    ],
    "Cap-Haïtien": [
      "Citadelle Laferriere aerial",
      "Sans Souci Palace Haiti",
      "Cathedral Cap Haitien",
    ],
    Jacmel: ["Jacmel Carnival Haiti", "Bassin Bleu Haiti", "Jacmel iron market"],
  },
  do: {
    "Santo Domingo": ["Alcazar de Colon", "Zona Colonial Santo Domingo aerial", "Faro a Colon"],
    "Punta Cana": ["Bavaro Beach aerial", "Saona Island aerial", "Macao Beach Punta Cana"],
    "Puerto Plata": [
      "Teleferico Puerto Plata",
      "Fortaleza San Felipe Puerto Plata",
      "Pico Isabel de Torres Puerto Plata",
    ],
  },
  bs: {
    Nassau: ["Nassau Bahamas aerial", "Fort Fincastle Nassau", "Paradise Island Bahamas"],
    Andros: ["Andros Bahamas aerial", "Andros Barrier Reef", "Andros Bahamas blue holes"],
    "A ilha do porto": [
      "Pink Sands Beach Harbour Island",
      "Dunmore Town Bahamas",
      "Harbour Island Bahamas aerial",
    ],
  },
  tt: {
    "Porto de Espanha": [
      "Port of Spain aerial",
      "Queen's Park Savannah Port of Spain",
      "Magnificent Seven Trinidad",
    ],
    Tobago: [
      "Fort King George Tobago panorama",
      "Argyle Falls Tobago",
      "Buccoo Reef Tobago",
      "Pigeon Point Tobago",
    ],
    "San Fernando": [
      "San Fernando Hill Trinidad",
      "San Fernando Trinidad aerial",
      "San Fernando waterfront Trinidad",
    ],
  },
  pr: {
    "San Juan": [
      "Old San Juan aerial",
      "San Juan Puerto Rico city walls",
      "Castillo San Felipe del Morro",
    ],
    Ponce: [
      "Parque de Bombas Ponce",
      "Ponce Puerto Rico historic center",
      "Ponce Plaza Las Delicias",
    ],
    "A floresta de Yunque": [
      "El Yunque National Forest aerial",
      "El Yunque rainforest",
      "El Yunque waterfalls",
    ],
  },
  br: {
    "Rio de Janeiro": [
      "Cristo Redentor Rio de Janeiro",
      "Christ the Redeemer Rio de Janeiro",
      "Sugarloaf Mountain Rio aerial",
    ],
    "São Paulo": [
      "Sao Paulo skyline aerial",
      "Ibirapuera Park aerial Sao Paulo",
      "Sao Paulo Paulista Avenue aerial",
    ],
    Salvador: [
      "Salvador Bahia aerial Pelourinho",
      "Elevador Lacerda Salvador aerial",
      "Barra Lighthouse Salvador aerial",
    ],
  },
  ar: {
    "Buenos Aires": [
      "Buenos Aires aerial obelisk",
      "Caminito La Boca Buenos Aires aerial",
      "Casa Rosada Buenos Aires",
    ],
    Mendoza: [
      "Mendoza Argentina aerial Andes",
      "Aconcagua aerial Argentina",
      "Mendoza vineyards aerial Argentina",
    ],
    Ushuaia: [
      "Ushuaia aerial Beagle Channel",
      "Tierra del Fuego National Park aerial",
      "Les Eclaireurs Lighthouse Ushuaia",
    ],
  },
  pe: {
    Cusco: ["Cusco aerial Machu Picchu", "Sacsayhuaman Cusco aerial", "Sacred Valley Peru aerial"],
    Lima: [
      "Lima Peru aerial Miraflores coast",
      "Plaza Mayor Lima Peru",
      "Huaca Pucllana Lima aerial",
    ],
    Arequipa: [
      "Arequipa Peru aerial Santa Catalina Monastery",
      "Yanahuara viewpoint Arequipa",
      "Colca Canyon Peru aerial",
    ],
  },
  co: {
    Cartagena: [
      "Cartagena Colombia aerial walled city",
      "Castillo San Felipe Cartagena aerial",
      "Rosario Islands Colombia aerial",
    ],
    Bogotá: [
      "Bogota Colombia aerial Monserrate",
      "La Candelaria Bogota aerial",
      "Bogota skyline Monserrate",
    ],
    Medellín: [
      "Medellin Colombia aerial Metrocable",
      "Comuna 13 Medellin aerial",
      "Pueblito Paisa Medellin",
    ],
  },
  cl: {
    Santiago: [
      "Santiago Chile aerial Cerro San Cristobal",
      "Plaza de Armas Santiago Chile",
      "Cajon del Maipo Chile aerial",
    ],
    Valparaíso: [
      "Valparaiso Chile aerial colorful hills",
      "Valparaiso port aerial Chile",
      "Valparaiso ascensores aerial",
    ],
    "San Pedro de Atacama": [
      "Valle de la Luna Atacama aerial",
      "El Tatio geysers aerial Chile",
      "San Pedro de Atacama aerial",
    ],
  },
  py: {
    Assunção: [
      "Asuncion Paraguay aerial Palacio de los Lopez",
      "Asuncion Costanera aerial",
      "Pantheon of Heroes Asuncion",
    ],
    "Ciudad del Este": [
      "Monday Falls Paraguay aerial",
      "Ciudad del Este Paraguay aerial",
      "Friendship Bridge Paraguay Brazil",
    ],
    Itaipú: [
      "Itaipu Dam aerial Paraguay",
      "Itaipu hydroelectric dam panorama",
      "Itaipu Dam Paraguay Brazil aerial",
    ],
  },
  uy: {
    Montevidéu: [
      "Montevideo Uruguay aerial Rambla",
      "Palacio Salvo Montevideo aerial",
      "Plaza Independencia Montevideo",
    ],
    "Colónia do Sacramento": [
      "Colonia del Sacramento Uruguay aerial historic quarter",
      "Colonia del Sacramento lighthouse aerial",
      "Colonia del Sacramento waterfront",
    ],
    "Punta del Este": [
      "Punta del Este Uruguay aerial coastline",
      "La Mano Punta del Este aerial",
      "Punta del Este beach aerial",
    ],
  },
  bo: {
    "La Paz": [
      "La Paz Bolivia aerial cable car",
      "Valle de la Luna La Paz Bolivia",
      "La Paz Bolivia cityscape aerial",
    ],
    Sucre: [
      "Sucre Bolivia aerial white city",
      "Sucre Bolivia historic center aerial",
      "Cal Orcko Sucre Bolivia",
    ],
    Uyuni: [
      "Salar de Uyuni aerial Bolivia",
      "Incahuasi Island Salar de Uyuni",
      "Uyuni train cemetery Bolivia",
    ],
  },
  ec: {
    Quito: [
      "Quito Ecuador aerial historic center",
      "Teleferico Quito aerial",
      "Mitad del Mundo Quito",
    ],
    Guayaquil: [
      "Guayaquil Ecuador aerial Malecon 2000",
      "Las Penas Guayaquil aerial",
      "Cerro Santa Ana Guayaquil",
    ],
    Galápagos: [
      "Galapagos Islands aerial landscape",
      "Tortuga Bay Galapagos aerial",
      "Galapagos giant tortoises",
    ],
  },
  ve: {
    Caracas: [
      "Caracas Venezuela aerial Avila",
      "Waraira Repano cable car Caracas aerial",
      "Caracas skyline Avila",
    ],
    Canaima: [
      "Angel Falls Venezuela aerial Canaima",
      "Canaima tepuis aerial Venezuela",
      "Canaima National Park aerial",
    ],
    "Los Roques": [
      "Los Roques Venezuela aerial",
      "Los Roques archipelago aerial beach",
      "Gran Roque aerial Venezuela",
    ],
  },
  gy: {
    Georgetown: [
      "Georgetown Guyana aerial Stabroek Market",
      "St George's Cathedral Georgetown Guyana",
      "Georgetown Guyana waterfront aerial",
    ],
    Bartica: [
      "Bartica Guyana aerial Essequibo River",
      "Bartica river confluence Guyana aerial",
      "Bartica Guyana waterfront",
    ],
    "Rio Essequibo": [
      "Essequibo River Guyana aerial",
      "Essequibo River islands Guyana aerial",
      "Essequibo River Guyana landscape",
    ],
  },
  sr: {
    Paramaribo: [
      "Paramaribo Suriname aerial historic center",
      "Waterkant Paramaribo Suriname",
      "Paramaribo wooden houses aerial",
    ],
    "Rio Suriname": [
      "Suriname River aerial Suriname",
      "Suriname River boats rainforest",
      "Suriname River landscape",
    ],
    Albina: [
      "Albina Suriname Marowijne River",
      "Albina Suriname waterfront aerial",
      "Marowijne River Albina aerial",
    ],
  },
  fk: {
    Stanley: [
      "Stanley Falkland Islands aerial harbor",
      "Christ Church Cathedral Stanley Falkland Islands",
      "Stanley Falkland Islands waterfront",
    ],
    Saunders: [
      "Saunders Island Falkland Islands aerial",
      "Saunders Island penguins Falkland Islands",
      "Saunders Island Falklands landscape",
    ],
    "A campina": [
      "Falkland Islands Camp landscape aerial",
      "Falkland Islands rural landscape aerial",
      "Falklands Camp settlement landscape",
    ],
  },
  fr: {
    Paris: ["Eiffel Tower aerial Paris", "Louvre Museum Paris", "Paris skyline aerial"],
    Versalhes: [
      "Palace of Versailles aerial",
      "Versailles gardens aerial",
      "Hall of Mirrors Versailles",
    ],
    Nice: ["Promenade des Anglais Nice aerial", "Castle Hill Nice France", "Old Nice aerial"],
    Lyon: ["Basilica of Notre-Dame de Fourviere Lyon", "Vieux Lyon aerial", "Place Bellecour Lyon"],
    Bordeaux: [
      "Place de la Bourse Bordeaux aerial",
      "Miroir d'eau Bordeaux",
      "Cite du Vin Bordeaux",
    ],
  },
  de: {
    Berlim: ["Brandenburg Gate Berlin", "Berlin Wall aerial", "Museum Island Berlin aerial"],
    Munique: ["Marienplatz Munich aerial", "Nymphenburg Palace Munich", "English Garden Munich"],
    Colônia: ["Cologne Cathedral aerial", "Hohenzollern Bridge Cologne", "Cologne old town aerial"],
    Dresden: ["Frauenkirche Dresden aerial", "Zwinger Palace Dresden", "Semperoper Dresden"],
    Hamburgo: ["Elbphilharmonie Hamburg", "Speicherstadt Hamburg aerial", "Hamburg harbor aerial"],
  },
  it: {
    Roma: ["Colosseum Rome aerial", "Trevi Fountain Rome", "Vatican Rome aerial"],
    Veneza: ["Piazza San Marco Venice aerial", "Grand Canal Venice aerial", "Rialto Bridge Venice"],
    Florença: ["Duomo di Firenze", "Cattedrale di Santa Maria del Fiore", "Ponte Vecchio Firenze"],
    Nápoles: ["Castel dell'Ovo Naples", "Naples historic center aerial", "Spaccanapoli Naples"],
    Milão: ["Milan Cathedral aerial", "Galleria Vittorio Emanuele II Milan", "Sforza Castle Milan"],
  },
  es: {
    Madrid: [
      "Palacio Real de Madrid",
      "Parque del Retiro Madrid aerial",
      "Plaza Mayor de Madrid",
      "Royal Palace Madrid",
      "Retiro Park Madrid aerial",
    ],
    Barcelona: [
      "Sagrada Familia Barcelona",
      "Park Guell Barcelona aerial",
      "Barcelona skyline aerial",
    ],
    Sevilha: [
      "Real Alcázar de Sevilla",
      "Catedral de Sevilla Giralda",
      "Plaza de España Sevilla aerial",
    ],
    Valência: [
      "Ciudad de las Artes y las Ciencias Valencia",
      "Lonja de la Seda Valencia",
      "Catedral de Valencia",
      "City of Arts and Sciences Valencia Spain",
    ],
    Granada: ["Alhambra Granada aerial", "Generalife Granada", "Albaicin Granada aerial"],
  },
  gb: {
    Londres: ["Big Ben London aerial", "Tower of London aerial", "London Eye aerial"],
    Edimburgo: [
      "Edinburgh Castle aerial",
      "Royal Mile Edinburgh",
      "Arthur's Seat Edinburgh aerial",
    ],
    Liverpool: ["Albert Dock Liverpool", "Cavern Club Liverpool", "Liverpool Cathedral"],
    Oxford: ["Radcliffe Camera Oxford", "University of Oxford aerial", "Bodleian Library Oxford"],
    Bath: ["Roman Baths Bath England", "Royal Crescent Bath aerial", "Bath Abbey"],
  },
  ru: {
    Moscou: ["Red Square Moscow aerial", "Moscow Kremlin aerial", "Saint Basil's Cathedral Moscow"],
    "São Petersburgo": [
      "Hermitage Museum Saint Petersburg",
      "Winter Palace Saint Petersburg",
      "Nevsky Prospect Saint Petersburg",
    ],
    Suzdal: ["Suzdal Kremlin aerial", "Suzdal monasteries Russia", "Suzdal Golden Ring"],
    Kazan: ["Kazan Kremlin aerial", "Kul Sharif Mosque Kazan", "Bauman Street Kazan"],
    Sochi: ["Sochi Olympic Park aerial", "Rosa Khutor Sochi", "Sochi Arboretum"],
  },
  tr: {
    Istambul: ["Hagia Sophia Istanbul", "Blue Mosque Istanbul aerial", "Grand Bazaar Istanbul"],
    Capadócia: [
      "Cappadocia hot air balloons aerial",
      "Cappadocia fairy chimneys",
      "Cappadocia underground city",
    ],
    Ancara: ["Anıtkabir Ankara", "Ankara Kalesi", "Museum of Anatolian Civilizations Ankara"],
    Izmir: ["Konak Clock Tower Izmir", "Agora of Smyrna Izmir", "Kemeralti Bazaar Izmir"],
    Antália: ["Kaleiçi Antalya aerial", "Hadrian Kapısı Antalya", "Düden Şelalesi Antalya"],
  },
  nl: {
    Amsterdã: [
      "Amsterdam canals aerial",
      "Van Gogh Museum Amsterdam",
      "Anne Frank House Amsterdam",
    ],
    Roterdã: ["Markthal Rotterdam", "Euromast Rotterdam", "Rotterdam harbor aerial"],
    Giethoorn: [
      "Giethoorn canals aerial",
      "Giethoorn Netherlands bridges",
      "Giethoorn village aerial",
    ],
    Utrecht: ["Dom Tower Utrecht", "Oudegracht Utrecht aerial", "St Martin's Cathedral Utrecht"],
    Delft: ["Nieuwe Kerk Delft", "Oude Kerk Delft", "Delft Market Square"],
  },
  pl: {
    Cracóvia: ["Wawel Castle Krakow aerial", "Krakow Main Market Square", "Wieliczka Salt Mine"],
    Varsóvia: ["Warsaw Old Town aerial", "Palace of Culture Warsaw", "Lazienki Park Warsaw"],
    Gdańsk: ["Long Market Gdansk", "Motlawa River Gdansk", "Sopot beach aerial"],
    Wrocław: [
      "Wroclaw Market Square aerial",
      "Raclawice Panorama Wroclaw",
      "Cathedral Island Wroclaw",
    ],
    Poznań: ["Poznan Market Square", "Poznan Town Hall", "Poznan Cathedral"],
  },
  no: {
    Oslo: ["Oslo Opera House aerial", "Vigeland Park Oslo", "Viking Ship Museum Oslo"],
    Bergen: ["Bryggen Bergen aerial", "Mount Floyen Bergen", "Bergen Norway harbor aerial"],
    Tromsø: ["Tromso Arctic Cathedral", "Fjellheisen Tromso aerial", "Tromso Norway cityscape"],
    Stavanger: ["Gamle Stavanger aerial", "Stavanger Cathedral", "Preikestolen Norway aerial"],
    Ålesund: [
      "Aksla viewpoint Alesund",
      "Alesund Art Nouveau aerial",
      "Atlanterhavsparken Alesund",
    ],
  },
  ch: {
    Berna: ["Bern old town aerial", "Zytglogge Bern", "Bern Switzerland panorama"],
    Zurique: ["Zurich lake aerial", "Bahnhofstrasse Zurich", "Chinese Garden Zurich"],
    Zermatt: ["Matterhorn Zermatt aerial", "Gornergrat railway Zermatt", "Zermatt Alps panorama"],
    Lucerna: ["Kapellbrücke Luzern", "Chapel Bridge Lucerne", "Luzern old town aerial"],
    Genebra: ["Jet d'Eau Geneva", "St Pierre Cathedral Geneva", "Palace of Nations Geneva"],
  },
  at: {
    Viena: [
      "Schonbrunn Palace Vienna aerial",
      "St Stephen's Cathedral Vienna",
      "Prater Vienna aerial",
    ],
    Salzburgo: [
      "Hohensalzburg Fortress aerial",
      "Mozart's Birthplace Salzburg",
      "Salzburg old town aerial",
    ],
    Innsbruck: ["Golden Roof Innsbruck", "Innsbruck Alps aerial", "Bergisel Ski Jump Innsbruck"],
    Graz: ["Schlossberg Graz aerial", "Kunsthaus Graz", "Clock Tower Graz"],
    Hallstatt: ["Hallstatt lake aerial", "Hallstatt Market Square", "Hallstatt salt mine"],
  },
  cz: {
    Praga: ["Prague Castle aerial", "Charles Bridge Prague", "Prague astronomical clock"],
    "Český Krumlov": [
      "Cesky Krumlov Castle aerial",
      "Vltava River Cesky Krumlov",
      "Cesky Krumlov old town",
    ],
    Brno: ["Brno Cathedral", "Villa Tugendhat Brno", "Brno Ossuary"],
    "Kutná Hora": [
      "Sedlec Ossuary Kutna Hora",
      "St Barbara's Church Kutna Hora",
      "Italian Court Kutna Hora",
    ],
    "Karlovy Vary": [
      "Mill Colonnade Karlovy Vary",
      "Karlovy Vary hot springs",
      "Hotel Thermal Karlovy Vary",
    ],
  },
  ro: {
    Bucareste: [
      "Palace of the Parliament Bucharest aerial",
      "Romanian Athenaeum Bucharest",
      "Herastrau Park Bucharest",
    ],
    Brașov: ["Tampa Mountain Brasov", "Brasov Council Square aerial", "Bran Castle Romania"],
    Sibiu: ["Sibiu Grand Square aerial", "Sibiu houses with eyes", "Fagaras Mountains Romania"],
    "Cluj-Napoca": [
      "St Michael's Church Cluj-Napoca",
      "Unirii Square Cluj-Napoca",
      "Cluj Botanical Garden",
    ],
    Sighișoara: [
      "Sighisoara Citadel aerial",
      "Clock Tower Sighisoara",
      "Vlad Dracul House Sighisoara",
    ],
  },
  gr: {
    Atenas: [
      "Acropolis Parthenon Athens aerial",
      "Ancient Agora Athens",
      "Acropolis Museum Athens",
    ],
    Santorini: ["Oia Santorini aerial", "Santorini caldera aerial", "Red Beach Santorini"],
    Rodes: ["Rhodes medieval city aerial", "Lindos Acropolis Rhodes", "Butterfly Valley Rhodes"],
    Tessalónica: [
      "White Tower Thessaloniki",
      "Rotunda Thessaloniki",
      "Arch of Galerius Thessaloniki",
    ],
    Mykonos: ["Mykonos windmills aerial", "Little Venice Mykonos", "Panagia Paraportiani Mykonos"],
  },
  pt: {
    Lisboa: ["Belem Tower Lisbon", "Sao Jorge Castle Lisbon aerial", "Santa Justa Lift Lisbon"],
    Porto: ["Ribeira Porto aerial", "Dom Luis I Bridge Porto", "Livraria Lello Porto"],
    Sintra: [
      "Palácio Nacional da Pena Sintra",
      "Castelo dos Mouros Sintra",
      "Quinta da Regaleira Sintra",
    ],
    Coimbra: ["University of Coimbra aerial", "Joanina Library Coimbra", "Old Cathedral Coimbra"],
    Évora: ["Roman Temple Evora", "Chapel of Bones Evora", "Giraldo Square Evora"],
  },
  hr: {
    Dubrovnik: ["Dubrovnik city walls aerial", "Stradun Dubrovnik", "Lokrum Island aerial"],
    Split: ["Diocletian's Palace Split aerial", "Split Riva waterfront", "Split market Croatia"],
    "Lagos de Plitvice": [
      "Plitvice Lakes waterfalls aerial",
      "Plitvice Lakes National Park",
      "Plitvice boardwalk",
    ],
    Zagreb: ["St Mark's Church Zagreb", "Ban Jelacic Square Zagreb", "Zagreb city aerial"],
    Zadar: ["Sea Organ Zadar", "Greeting to the Sun Zadar", "Roman Forum Zadar"],
  },
  ua: {
    Kyiv: ["Saint Sophia Cathedral Kyiv", "Kyiv Pechersk Lavra aerial", "Khreshchatyk Kyiv"],
    Lviv: ["Rynok Square Lviv aerial", "Lviv Cathedral", "Lviv old town aerial"],
    Odesa: ["Potemkin Stairs Odesa", "Odesa Opera House", "Odesa Black Sea beach"],
    Chernivtsi: [
      "Chernivtsi University aerial",
      "Chernivtsi Central Square",
      "Olga Kobylianska Theatre Chernivtsi",
    ],
    "Kamianets-Podilskyi": [
      "Kamianets-Podilskyi Castle aerial",
      "Smotrych Canyon",
      "Castle Bridge Kamianets-Podilskyi",
    ],
  },
  se: {
    Estocolmo: ["Stockholm City Hall", "Gamla Stan Stockholm aerial", "Vasa Museum Stockholm"],
    Gotemburgo: [
      "Gothenburg Botanical Garden",
      "Liseberg Gothenburg",
      "Gothenburg archipelago aerial",
    ],
    Kiruna: ["Kiruna Sweden aerial", "Icehotel Jukkasjarvi", "Kiruna Lapland mountains"],
  },
  ie: {
    Dublin: ["Trinity College Dublin", "Dublin Castle", "Ha'penny Bridge Dublin"],
    Galway: ["Galway Latin Quarter", "Galway Bay aerial", "Cliffs of Moher Ireland"],
    Cork: ["English Market Cork", "Blarney Castle Ireland", "River Lee Cork aerial"],
  },
  dk: {
    Copenhaga: [
      "Little Mermaid Copenhagen",
      "Tivoli Gardens Copenhagen",
      "Nyhavn Copenhagen aerial",
    ],
    Aarhus: ["Den Gamle By Aarhus", "ARoS Aarhus", "Aarhus Bay aerial"],
    Odense: ["Hans Christian Andersen House Odense", "Odense Cathedral", "Odense gardens Denmark"],
  },
  be: {
    Bruxelas: ["Grand Place Brussels aerial", "Atomium Brussels", "Manneken Pis Brussels"],
    Bruges: ["Bruges canals aerial", "Belfry of Bruges", "Bruges Market Square"],
    Antuérpia: ["Antwerp Cathedral", "Scheldt River Antwerp aerial", "Antwerp Zoo"],
  },
  hu: {
    Budapeste: [
      "Hungarian Parliament Budapest aerial",
      "Szechenyi Thermal Bath Budapest",
      "Buda Castle aerial",
    ],
    Eger: ["Eger Minaret Hungary", "Eger Castle aerial", "Valley of the Beautiful Woman Eger"],
    "Lago Balaton": [
      "Lake Balaton aerial Hungary",
      "Tihany Abbey Balaton",
      "Balaton fishing village",
    ],
  },
  al: {
    Tirana: ["Skanderbeg Square Tirana aerial", "Dajti Mountain Tirana", "Tirana bazaar"],
    Berat: ["Berat Albania aerial Ottoman houses", "Berat Castle", "Osum River Berat"],
    Shkodër: ["Rozafa Castle Shkoder aerial", "Lake Skadar Shkoder", "Shkoder bridge Albania"],
  },
  mk: {
    Skopje: ["Kale Fortress Skopje", "Stone Bridge Skopje aerial", "Old Bazaar Skopje"],
    Ohrid: ["Lake Ohrid aerial", "Ohrid old town", "Church of St John at Kaneo Ohrid"],
    Bitola: ["Bitola old bazaar", "Shirok Sokak Bitola", "Pelister National Park Bitola"],
  },
  ba: {
    Sarajevo: ["Bascarsija Sarajevo aerial", "Miljacka River Sarajevo", "Sarajevo hills panorama"],
    Mostar: ["Stari Most Mostar aerial", "Neretva River Mostar", "Mostar old town"],
    Blagaj: ["Blagaj Tekija aerial", "Buna River spring Blagaj", "Blagaj cliff monastery"],
  },
  cy: {
    Nicósia: ["Nicosia old town walls", "Nicosia city center aerial", "Famagusta Gate Nicosia"],
    Pafos: ["Paphos harbor aerial", "Tombs of the Kings Paphos", "Paphos mosaics"],
    Lefkara: ["Lefkara Cyprus aerial", "Lefkara village streets", "Lefkara mountains Cyprus"],
  },
  ge: {
    Tbilisi: [
      "Tbilisi sulfur baths aerial",
      "Tbilisi old town balconies",
      "Mtkvari River Tbilisi aerial",
    ],
    Telavi: ["Telavi Kakheti vineyards aerial", "Telavi city walls", "Alazani Valley Telavi"],
    Mestia: ["Mestia Svan towers aerial", "Mestia Caucasus mountains", "Mestia Georgia winter"],
  },
  am: {
    Erevã: ["Yerevan Cascade aerial", "Yerevan market Armenia", "Mount Aragats view Yerevan"],
    Sevan: ["Lake Sevan aerial Armenia", "Sevanavank Monastery", "Sevan Armenia landscape"],
    Dilijan: ["Dilijan forest Armenia", "Dilijan old town wooden houses", "Dilijan river Armenia"],
  },
  az: {
    Baku: ["Baku Old City aerial", "Maiden Tower Baku", "Baku Caspian Sea waterfront"],
    Ganja: ["Ganja Azerbaijan parks", "Ganja old town", "Ganja city center aerial"],
    Sheki: ["Sheki Khan's Palace", "Sheki stained glass palace", "Sheki Azerbaijan mountains"],
  },
  by: {
    Minsque: ["Minsk aerial Svislach River", "Minsk avenues cityscape", "Minsk parks aerial"],
    Mir: ["Mir Castle aerial Belarus", "Mir Castle Lake", "Mir Castle walls"],
    Brest: ["Brest Fortress aerial", "Brest Belarus river", "Brest city landscape"],
  },
  lt: {
    Vilnius: ["Vilnius old town aerial", "Neris River Vilnius", "Gediminas Tower Vilnius"],
    Trakai: ["Trakai Island Castle aerial", "Trakai lake Lithuania", "Trakai castle bridge"],
    Nida: ["Nida Curonian Spit dunes aerial", "Nida lagoon Lithuania", "Nida wooden houses"],
  },
  lv: {
    Riga: ["Riga old town aerial Daugava", "Riga central market", "Riga city center aerial"],
    Jūrmala: ["Jurmala beach aerial Latvia", "Jurmala pine forest", "Jurmala amber museum"],
    Cēsis: ["Cesis Castle aerial", "Gauja River Cesis", "Cesis Latvia landscape"],
  },
  ee: {
    Talim: ["Tallinn old town aerial", "Tallinn Baltic Sea panorama", "Tallinn city walls"],
    Tartu: ["Tartu River aerial Estonia", "Tartu Town Hall Square", "Tartu old wooden houses"],
    Kuressaare: ["Kuressaare Castle aerial", "Saaremaa island aerial", "Kuressaare Estonia coast"],
  },
  lu: {
    Luxemburgo: [
      "Luxembourg City casemates aerial",
      "Alzette River Luxembourg",
      "Luxembourg old town aerial",
    ],
    Echternach: ["Echternach bridge aerial", "Echternach basilica", "Sauer River Echternach"],
    Vianden: ["Vianden Castle aerial", "Vianden bridge Luxembourg", "Vianden valley panorama"],
  },
  md: {
    Chișinău: [
      "Chisinau triumphal arch",
      "Chisinau Cathedral aerial",
      "Valea Morilor park Chisinau",
    ],
    Orhei: ["Orheiul Vechi aerial", "Orhei cliff monastery", "Raut River Orhei"],
    Soroca: ["Soroca Fortress aerial", "Dniester River Soroca", "Soroca Moldova hills"],
  },
  me: {
    Podgorica: ["Moraca River Podgorica", "Podgorica bridges aerial", "Podgorica city park"],
    Kotor: ["Kotor Bay aerial", "Kotor old town walls", "Kotor orange roofs aerial"],
    Cetinje: ["Cetinje old royal capital", "Lovcen National Park Cetinje", "Cetinje Monastery"],
  },
  is: {
    Reykjavík: ["Hallgrimskirkja Reykjavik", "Tjornin Reykjavik aerial", "Reykjavik harbor aerial"],
    "Círculo Dourado": [
      "Gullfoss aerial Iceland",
      "Geysir Iceland aerial",
      "Thingvellir National Park aerial",
    ],
    Vik: ["Reynisfjara black beach Vik", "Reynisdrangar Vik aerial", "Vik Iceland glaciers"],
  },
  fi: {
    Helsínquia: [
      "Helsinki Cathedral aerial",
      "Suomenlinna aerial Helsinki",
      "Market Square Helsinki",
    ],
    Rovaniemi: [
      "Santa Claus Village Rovaniemi aerial",
      "Northern lights Rovaniemi",
      "Kemijoki River Rovaniemi",
    ],
    Turku: ["Turku Castle aerial", "Turku Cathedral", "Turku archipelago aerial"],
  },
  bg: {
    Sófia: ["Alexander Nevsky Cathedral Sofia", "Vitosha Mountain Sofia aerial", "Serdika Sofia"],
    Plovdiv: ["Roman theatre Plovdiv aerial", "Plovdiv old town aerial", "Plovdiv hills panorama"],
    "Veliko Tarnovo": [
      "Tsarevets Fortress Veliko Tarnovo aerial",
      "Yantra River Veliko Tarnovo",
      "Veliko Tarnovo old houses",
    ],
  },
  rs: {
    Belgrado: ["Kalemegdan Belgrade aerial", "Skadarlija Belgrade", "Sava River Belgrade aerial"],
    "Novi Sad": [
      "Petrovaradin Fortress Novi Sad aerial",
      "Liberty Square Novi Sad",
      "Danube River Novi Sad",
    ],
    Niš: ["Nis Fortress aerial", "Skull Tower Nis Serbia", "Nis spa Serbia"],
  },
  sk: {
    Bratislava: [
      "Bratislava Castle aerial",
      "Bratislava old town Danube",
      "Bratislava city panorama",
    ],
    Košice: ["St Elisabeth Cathedral Kosice", "Kosice main square", "Kosice theatre"],
    "Montes Tatras": ["High Tatras peaks aerial", "High Tatras lakes", "Tatra electric railway"],
  },
  si: {
    Liubliana: ["Ljubljana Castle aerial", "Dragon Bridge Ljubljana", "Ljubljana central market"],
    Bled: ["Lake Bled island church aerial", "Bled Castle aerial", "Lake Bled panorama"],
    Postojna: ["Postojna Cave railway", "Postojna Cave aerial", "Predjama Castle Postojna"],
  },
  xk: {
    Pristina: [
      "Pristina Newborn Monument",
      "Pristina city aerial Kosovo",
      "Mother Teresa Cathedral Pristina",
    ],
    Prizren: ["Prizren fortress aerial Kosovo", "Prizren old town aerial", "Stone Bridge Prizren"],
    Gračanica: ["Gracanica Monastery Kosovo", "Gracanica Kosovo aerial", "Gračanica monastery"],
  },
};