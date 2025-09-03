export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  searchTerm: string; // Pour l'autocomplétion
}

// Base de données d'aéroports du monde
export const WORLD_AIRPORTS: Airport[] = [
  // Afrique
  { code: 'DLA', name: 'Douala International Airport', city: 'Douala', country: 'Cameroun', searchTerm: 'douala cameroun' },
  { code: 'NSI', name: 'Yaoundé Nsimalen International Airport', city: 'Yaoundé', country: 'Cameroun', searchTerm: 'yaounde cameroun' },
  { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Maroc', searchTerm: 'casablanca maroc' },
  { code: 'RBA', name: 'Rabat-Salé Airport', city: 'Rabat', country: 'Maroc', searchTerm: 'rabat maroc' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Le Caire', country: 'Égypte', searchTerm: 'cairo egypte' },
  { code: 'LAD', name: 'Quatro de Fevereiro Airport', city: 'Luanda', country: 'Angola', searchTerm: 'luanda angola' },
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', searchTerm: 'lagos nigeria' },
  { code: 'ABV', name: 'Nnamdi Azikiwe International Airport', city: 'Abuja', country: 'Nigeria', searchTerm: 'abuja nigeria' },
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', searchTerm: 'nairobi kenya' },
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'Afrique du Sud', searchTerm: 'johannesburg afrique du sud' },
  { code: 'CPT', name: 'Cape Town International Airport', city: 'Le Cap', country: 'Afrique du Sud', searchTerm: 'cape town afrique du sud' },
  { code: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis-Abeba', country: 'Éthiopie', searchTerm: 'addis abeba ethiopie' },
  { code: 'DAR', name: 'Julius Nyerere International Airport', city: 'Dar es Salaam', country: 'Tanzanie', searchTerm: 'dar es salaam tanzanie' },
  { code: 'KGL', name: 'Kigali International Airport', city: 'Kigali', country: 'Rwanda', searchTerm: 'kigali rwanda' },
  { code: 'EBB', name: 'Entebbe International Airport', city: 'Entebbe', country: 'Ouganda', searchTerm: 'entebbe ouganda' },
  { code: 'BKO', name: 'Bamako-Sénou International Airport', city: 'Bamako', country: 'Mali', searchTerm: 'bamako mali' },
  { code: 'DKR', name: 'Léopold Sédar Senghor International Airport', city: 'Dakar', country: 'Sénégal', searchTerm: 'dakar senegal' },
  { code: 'ABJ', name: 'Félix-Houphouët-Boigny International Airport', city: 'Abidjan', country: 'Côte d\'Ivoire', searchTerm: 'abidjan cote d ivoire' },
  { code: 'ACC', name: 'Kotoka International Airport', city: 'Accra', country: 'Ghana', searchTerm: 'accra ghana' },
  { code: 'LUN', name: 'Kenneth Kaunda International Airport', city: 'Lusaka', country: 'Zambie', searchTerm: 'lusaka zambie' },

  // Europe
  { code: 'CDG', name: 'Paris Charles de Gaulle Airport', city: 'Paris', country: 'France', searchTerm: 'paris france' },
  { code: 'ORY', name: 'Paris Orly Airport', city: 'Paris', country: 'France', searchTerm: 'paris orly france' },
  { code: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'France', searchTerm: 'lyon france' },
  { code: 'MRS', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France', searchTerm: 'marseille france' },
  { code: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', searchTerm: 'nice france' },
  { code: 'TLS', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'France', searchTerm: 'toulouse france' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'Londres', country: 'Royaume-Uni', searchTerm: 'london heathrow uk' },
  { code: 'LGW', name: 'London Gatwick Airport', city: 'Londres', country: 'Royaume-Uni', searchTerm: 'london gatwick uk' },
  { code: 'STN', name: 'London Stansted Airport', city: 'Londres', country: 'Royaume-Uni', searchTerm: 'london stansted uk' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'Royaume-Uni', searchTerm: 'manchester uk' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Allemagne', searchTerm: 'frankfurt allemagne' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Allemagne', searchTerm: 'munich allemagne' },
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Allemagne', searchTerm: 'berlin allemagne' },
  { code: 'AMS', name: 'Amsterdam Schiphol Airport', city: 'Amsterdam', country: 'Pays-Bas', searchTerm: 'amsterdam pays bas' },
  { code: 'MAD', name: 'Madrid Barajas Airport', city: 'Madrid', country: 'Espagne', searchTerm: 'madrid espagne' },
  { code: 'BCN', name: 'Barcelona El Prat Airport', city: 'Barcelone', country: 'Espagne', searchTerm: 'barcelone espagne' },
  { code: 'FCO', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italie', searchTerm: 'rome italie' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italie', searchTerm: 'milan italie' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Suisse', searchTerm: 'zurich suisse' },
  { code: 'GVA', name: 'Geneva Airport', city: 'Genève', country: 'Suisse', searchTerm: 'geneve suisse' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Bruxelles', country: 'Belgique', searchTerm: 'bruxelles belgique' },
  { code: 'VIE', name: 'Vienna International Airport', city: 'Vienne', country: 'Autriche', searchTerm: 'vienne autriche' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhague', country: 'Danemark', searchTerm: 'copenhague danemark' },
  { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Suède', searchTerm: 'stockholm suede' },
  { code: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norvège', searchTerm: 'oslo norvege' },
  { code: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finlande', searchTerm: 'helsinki finlande' },
  { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Varsovie', country: 'Pologne', searchTerm: 'varsovie pologne' },
  { code: 'PRG', name: 'Prague Airport', city: 'Prague', country: 'République tchèque', searchTerm: 'prague republique tcheque' },
  { code: 'BUD', name: 'Budapest Airport', city: 'Budapest', country: 'Hongrie', searchTerm: 'budapest hongrie' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turquie', searchTerm: 'istanbul turquie' },
  { code: 'ATH', name: 'Athens International Airport', city: 'Athènes', country: 'Grèce', searchTerm: 'athenes grece' },
  { code: 'LIS', name: 'Lisbon Airport', city: 'Lisbonne', country: 'Portugal', searchTerm: 'lisbonne portugal' },
  { code: 'OPO', name: 'Porto Airport', city: 'Porto', country: 'Portugal', searchTerm: 'porto portugal' },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Irlande', searchTerm: 'dublin irlande' },
  { code: 'KEF', name: 'Keflavík International Airport', city: 'Reykjavik', country: 'Islande', searchTerm: 'reykjavik islande' },

  // Amérique du Nord
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'États-Unis', searchTerm: 'new york jfk usa' },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'New York', country: 'États-Unis', searchTerm: 'newark new york usa' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'États-Unis', searchTerm: 'los angeles usa' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'États-Unis', searchTerm: 'chicago o hare usa' },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'États-Unis', searchTerm: 'dallas fort worth usa' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'États-Unis', searchTerm: 'atlanta usa' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'États-Unis', searchTerm: 'miami usa' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'États-Unis', searchTerm: 'san francisco usa' },
  { code: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'États-Unis', searchTerm: 'las vegas usa' },
  { code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'États-Unis', searchTerm: 'boston usa' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', searchTerm: 'toronto canada' },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', searchTerm: 'vancouver canada' },
  { code: 'YUL', name: 'Montréal-Trudeau International Airport', city: 'Montréal', country: 'Canada', searchTerm: 'montreal canada' },
  { code: 'YYC', name: 'Calgary International Airport', city: 'Calgary', country: 'Canada', searchTerm: 'calgary canada' },
  { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico', country: 'Mexique', searchTerm: 'mexico mexique' },
  { code: 'GDL', name: 'Guadalajara International Airport', city: 'Guadalajara', country: 'Mexique', searchTerm: 'guadalajara mexique' },
  { code: 'MTY', name: 'Monterrey International Airport', city: 'Monterrey', country: 'Mexique', searchTerm: 'monterrey mexique' },

  // Amérique du Sud
  { code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brésil', searchTerm: 'sao paulo bresil' },
  { code: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'Brésil', searchTerm: 'rio de janeiro bresil' },
  { code: 'BSB', name: 'Brasília International Airport', city: 'Brasília', country: 'Brésil', searchTerm: 'brasilia bresil' },
  { code: 'EZE', name: 'Buenos Aires Ezeiza International Airport', city: 'Buenos Aires', country: 'Argentine', searchTerm: 'buenos aires argentine' },
  { code: 'SCL', name: 'Santiago International Airport', city: 'Santiago', country: 'Chili', searchTerm: 'santiago chili' },
  { code: 'LIM', name: 'Lima Jorge Chávez International Airport', city: 'Lima', country: 'Pérou', searchTerm: 'lima perou' },
  { code: 'BOG', name: 'Bogotá El Dorado International Airport', city: 'Bogotá', country: 'Colombie', searchTerm: 'bogota colombie' },
  { code: 'CCS', name: 'Caracas Simón Bolívar International Airport', city: 'Caracas', country: 'Venezuela', searchTerm: 'caracas venezuela' },
  { code: 'UIO', name: 'Quito Mariscal Sucre International Airport', city: 'Quito', country: 'Équateur', searchTerm: 'quito equateur' },
  { code: 'ASU', name: 'Asunción Silvio Pettirossi International Airport', city: 'Asunción', country: 'Paraguay', searchTerm: 'asuncion paraguay' },
  { code: 'MVD', name: 'Montevideo Carrasco International Airport', city: 'Montevideo', country: 'Uruguay', searchTerm: 'montevideo uruguay' },

  // Asie
  { code: 'NRT', name: 'Tokyo Narita International Airport', city: 'Tokyo', country: 'Japon', searchTerm: 'tokyo narita japon' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japon', searchTerm: 'tokyo haneda japon' },
  { code: 'KIX', name: 'Osaka Kansai International Airport', city: 'Osaka', country: 'Japon', searchTerm: 'osaka kansai japon' },
  { code: 'ICN', name: 'Seoul Incheon International Airport', city: 'Séoul', country: 'Corée du Sud', searchTerm: 'seoul incheon coree du sud' },
  { code: 'GMP', name: 'Seoul Gimpo International Airport', city: 'Séoul', country: 'Corée du Sud', searchTerm: 'seoul gimpo coree du sud' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Pékin', country: 'Chine', searchTerm: 'pekin beijing chine' },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'Chine', searchTerm: 'shanghai pudong chine' },
  { code: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Canton', country: 'Chine', searchTerm: 'canton guangzhou chine' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Chine', searchTerm: 'hong kong chine' },
  { code: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taïwan', searchTerm: 'taipei taiwan' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapour', country: 'Singapour', searchTerm: 'singapour' },
  { code: 'BKK', name: 'Bangkok Suvarnabhumi Airport', city: 'Bangkok', country: 'Thaïlande', searchTerm: 'bangkok thailande' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaisie', searchTerm: 'kuala lumpur malaisie' },
  { code: 'CGK', name: 'Jakarta Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonésie', searchTerm: 'jakarta indonesie' },
  { code: 'MNL', name: 'Manila Ninoy Aquino International Airport', city: 'Manille', country: 'Philippines', searchTerm: 'manille philippines' },
  { code: 'HAN', name: 'Hanoi Noi Bai International Airport', city: 'Hanoï', country: 'Vietnam', searchTerm: 'hanoi vietnam' },
  { code: 'SGN', name: 'Ho Chi Minh City Tan Son Nhat International Airport', city: 'Ho Chi Minh-Ville', country: 'Vietnam', searchTerm: 'ho chi minh vietnam' },
  { code: 'DEL', name: 'Delhi Indira Gandhi International Airport', city: 'Delhi', country: 'Inde', searchTerm: 'delhi inde' },
  { code: 'BOM', name: 'Mumbai Chhatrapati Shivaji International Airport', city: 'Mumbai', country: 'Inde', searchTerm: 'mumbai inde' },
  { code: 'BLR', name: 'Bangalore Kempegowda International Airport', city: 'Bangalore', country: 'Inde', searchTerm: 'bangalore inde' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'Inde', searchTerm: 'chennai inde' },
  { code: 'HYD', name: 'Hyderabad Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'Inde', searchTerm: 'hyderabad inde' },
  { code: 'CCU', name: 'Kolkata Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'Inde', searchTerm: 'kolkata inde' },
  { code: 'ISB', name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan', searchTerm: 'islamabad pakistan' },
  { code: 'KHI', name: 'Karachi Jinnah International Airport', city: 'Karachi', country: 'Pakistan', searchTerm: 'karachi pakistan' },
  { code: 'DAC', name: 'Dhaka Hazrat Shahjalal International Airport', city: 'Dacca', country: 'Bangladesh', searchTerm: 'dacca dhaka bangladesh' },
  { code: 'CMB', name: 'Colombo Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka', searchTerm: 'colombo sri lanka' },
  { code: 'KTM', name: 'Kathmandu Tribhuvan International Airport', city: 'Katmandou', country: 'Népal', searchTerm: 'katmandou nepal' },
  { code: 'DOH', name: 'Doha Hamad International Airport', city: 'Doha', country: 'Qatar', searchTerm: 'doha qatar' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubaï', country: 'Émirats arabes unis', searchTerm: 'dubai emirats arabes unis' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abou Dabi', country: 'Émirats arabes unis', searchTerm: 'abou dabi emirats arabes unis' },
  { code: 'RUH', name: 'Riyadh King Khalid International Airport', city: 'Riyad', country: 'Arabie saoudite', searchTerm: 'riyad arabie saoudite' },
  { code: 'JED', name: 'Jeddah King Abdulaziz International Airport', city: 'Djeddah', country: 'Arabie saoudite', searchTerm: 'djeddah arabie saoudite' },
  { code: 'AMM', name: 'Amman Queen Alia International Airport', city: 'Amman', country: 'Jordanie', searchTerm: 'amman jordanie' },
  { code: 'BEY', name: 'Beirut Rafic Hariri International Airport', city: 'Beyrouth', country: 'Liban', searchTerm: 'beyrouth liban' },
  { code: 'TLV', name: 'Tel Aviv Ben Gurion International Airport', city: 'Tel Aviv', country: 'Israël', searchTerm: 'tel aviv israel' },
  { code: 'TBS', name: 'Tbilisi International Airport', city: 'Tbilissi', country: 'Géorgie', searchTerm: 'tbilissi georgie' },
  { code: 'GYD', name: 'Baku Heydar Aliyev International Airport', city: 'Bakou', country: 'Azerbaïdjan', searchTerm: 'bakou azerbaidjan' },
  { code: 'TAS', name: 'Tashkent International Airport', city: 'Tachkent', country: 'Ouzbékistan', searchTerm: 'tachkent ouzbekistan' },
  { code: 'ALA', name: 'Almaty International Airport', city: 'Almaty', country: 'Kazakhstan', searchTerm: 'almaty kazakhstan' },
  { code: 'FRU', name: 'Bishkek Manas International Airport', city: 'Bichkek', country: 'Kirghizistan', searchTerm: 'bichkek kirghizistan' },

  // Océanie
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australie', searchTerm: 'sydney australie' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australie', searchTerm: 'melbourne australie' },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australie', searchTerm: 'brisbane australie' },
  { code: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australie', searchTerm: 'perth australie' },
  { code: 'ADL', name: 'Adelaide Airport', city: 'Adélaïde', country: 'Australie', searchTerm: 'adelaide australie' },
  { code: 'CBR', name: 'Canberra Airport', city: 'Canberra', country: 'Australie', searchTerm: 'canberra australie' },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'Nouvelle-Zélande', searchTerm: 'auckland nouvelle zelande' },
  { code: 'WLG', name: 'Wellington Airport', city: 'Wellington', country: 'Nouvelle-Zélande', searchTerm: 'wellington nouvelle zelande' },
  { code: 'CHC', name: 'Christchurch Airport', city: 'Christchurch', country: 'Nouvelle-Zélande', searchTerm: 'christchurch nouvelle zelande' },
  { code: 'NAN', name: 'Nadi International Airport', city: 'Nadi', country: 'Fidji', searchTerm: 'nadi fidji' },
  { code: 'PPT', name: 'Faa\'a International Airport', city: 'Papeete', country: 'Polynésie française', searchTerm: 'papeete polynesie francaise' },
  { code: 'HNL', name: 'Honolulu International Airport', city: 'Honolulu', country: 'États-Unis', searchTerm: 'honolulu hawaii usa' },
  { code: 'GUM', name: 'Guam International Airport', city: 'Guam', country: 'États-Unis', searchTerm: 'guam usa' },
];

// Fonction de recherche d'aéroports avec autocomplétion
export const searchAirports = (query: string): Airport[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return WORLD_AIRPORTS.filter(airport => 
    airport.city.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.code.toLowerCase().includes(searchTerm) ||
    airport.country.toLowerCase().includes(searchTerm) ||
    airport.searchTerm.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limiter à 10 résultats
};

// Fonction pour obtenir un aéroport par code
export const getAirportByCode = (code: string): Airport | undefined => {
  return WORLD_AIRPORTS.find(airport => airport.code === code.toUpperCase());
};

// Fonction pour obtenir les aéroports populaires (pour l'affichage initial)
export const getPopularAirports = (): Airport[] => {
  return [
    getAirportByCode('CDG')!,
    getAirportByCode('JFK')!,
    getAirportByCode('LHR')!,
    getAirportByCode('NRT')!,
    getAirportByCode('SYD')!,
    getAirportByCode('LAX')!,
    getAirportByCode('FRA')!,
    getAirportByCode('AMS')!,
    getAirportByCode('DLA')!,
    getAirportByCode('CAI')!,
  ].filter(Boolean);
}; 