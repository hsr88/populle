export const ISO3_TO_ISO2: Record<string, string> = {
  AFG: 'af', AGO: 'ao', ALB: 'al', ARE: 'ae', ARG: 'ar', ARM: 'am', AUS: 'au', AUT: 'at',
  AZE: 'az', BDI: 'bi', BEL: 'be', BEN: 'bj', BFA: 'bf', BGD: 'bd', BGR: 'bg', BHR: 'bh',
  BIH: 'ba', BLR: 'by', BOL: 'bo', BRA: 'br', BTN: 'bt', BWA: 'bw', CAF: 'cf', CAN: 'ca',
  CHE: 'ch', CHL: 'cl', CHN: 'cn', CIV: 'ci', CMR: 'cm', COD: 'cd', COG: 'cg', COL: 'co',
  COM: 'km', CPV: 'cv', CRI: 'cr', CUB: 'cu', CYP: 'cy', CZE: 'cz', DEU: 'de', DJI: 'dj',
  DNK: 'dk', DOM: 'do', DZA: 'dz', ECU: 'ec', EGY: 'eg', ERI: 'er', ESP: 'es', EST: 'ee',
  ETH: 'et', FIN: 'fi', FJI: 'fj', FRA: 'fr', GAB: 'ga', GBR: 'gb', GEO: 'ge', GHA: 'gh',
  GIN: 'gn', GMB: 'gm', GNB: 'gw', GNQ: 'gq', GRC: 'gr', GTM: 'gt', GUY: 'gy', HND: 'hn',
  HRV: 'hr', HTI: 'ht', HUN: 'hu', IDN: 'id', IND: 'in', IRL: 'ie', IRN: 'ir', IRQ: 'iq',
  ISL: 'is', ISR: 'il', ITA: 'it', JAM: 'jm', JOR: 'jo', JPN: 'jp', KAZ: 'kz', KEN: 'ke',
  KGZ: 'kg', KHM: 'kh', KOR: 'kr', KWT: 'kw', LAO: 'la', LBN: 'lb', LBR: 'lr', LBY: 'ly',
  LKA: 'lk', LSO: 'ls', LTU: 'lt', LUX: 'lu', LVA: 'lv', MAR: 'ma', MDA: 'md', MDG: 'mg',
  MDV: 'mv', MEX: 'mx', MKD: 'mk', MLI: 'ml', MLT: 'mt', MNE: 'me', MNG: 'mn', MOZ: 'mz',
  MRT: 'mr', MUS: 'mu', MWI: 'mw', MYS: 'my', NAM: 'na', NER: 'ne', NGA: 'ng', NIC: 'ni',
  NLD: 'nl', NOR: 'no', NPL: 'np', NZL: 'nz', OMN: 'om', PAK: 'pk', PAN: 'pa', PER: 'pe',
  PHL: 'ph', PNG: 'pg', POL: 'pl', PRK: 'kp', PRY: 'py', PRT: 'pt', QAT: 'qa', ROU: 'ro',
  RUS: 'ru', RWA: 'rw', SAU: 'sa', SDN: 'sd', SEN: 'sn', SGP: 'sg', SLE: 'sl', SLB: 'sb',
  SLV: 'sv', SOM: 'so', SRB: 'rs', SSD: 'ss', STP: 'st', SUR: 'sr', SVK: 'sk', SVN: 'si',
  SWE: 'se', SWZ: 'sz', SYC: 'sc', SYR: 'sy', TCD: 'td', TGO: 'tg', THA: 'th', TJK: 'tj',
  TKM: 'tm', TLS: 'tl', TON: 'to', TTO: 'tt', TUN: 'tn', TUR: 'tr', TZA: 'tz', UGA: 'ug',
  UKR: 'ua', URY: 'uy', USA: 'us', UZB: 'uz', VEN: 've', VNM: 'vn', VUT: 'vu', WSM: 'ws',
  YEM: 'ye', ZAF: 'za', ZMB: 'zm', ZWE: 'zw', MMR: 'mm',
};

export function getFlagUrl(iso3: string): string | undefined {
  const iso2 = ISO3_TO_ISO2[iso3];
  return iso2 ? `https://flagcdn.com/w80/${iso2}.png` : undefined;
}

const COUNTRY_NAME_TO_ISO3: Record<string, string> = {
  'Afghanistan': 'AFG', 'Angola': 'AGO', 'Albania': 'ALB', 'United Arab Emirates': 'ARE',
  'Argentina': 'ARG', 'Armenia': 'ARM', 'Australia': 'AUS', 'Austria': 'AUT',
  'Azerbaijan': 'AZE', 'Burundi': 'BDI', 'Belgium': 'BEL', 'Benin': 'BEN',
  'Burkina Faso': 'BFA', 'Bangladesh': 'BGD', 'Bulgaria': 'BGR', 'Bahrain': 'BHR',
  'Bosnia and Herzegovina': 'BIH', 'Belarus': 'BLR', 'Bolivia': 'BOL', 'Brazil': 'BRA',
  'Bhutan': 'BTN', 'Botswana': 'BWA', 'Central African Republic': 'CAF', 'Canada': 'CAN',
  'Switzerland': 'CHE', 'Chile': 'CHL', 'China': 'CHN', 'Ivory Coast': 'CIV',
  'Cameroon': 'CMR', 'DR Congo': 'COD', 'Congo': 'COG', 'Colombia': 'COL',
  'Comoros': 'COM', 'Cape Verde': 'CPV', 'Costa Rica': 'CRI', 'Cuba': 'CUB',
  'Cyprus': 'CYP', 'Czechia': 'CZE', 'Czech Republic': 'CZE', 'Germany': 'DEU',
  'Djibouti': 'DJI', 'Denmark': 'DNK', 'Dominican Republic': 'DOM', 'Algeria': 'DZA',
  'Ecuador': 'ECU', 'Egypt': 'EGY', 'Eritrea': 'ERI', 'Spain': 'ESP', 'Estonia': 'EST',
  'Ethiopia': 'ETH', 'Finland': 'FIN', 'Fiji': 'FJI', 'France': 'FRA', 'Gabon': 'GAB',
  'United Kingdom': 'GBR', 'UK': 'GBR', 'Georgia': 'GEO', 'Ghana': 'GHA', 'Guinea': 'GIN',
  'Gambia': 'GMB', 'Guinea-Bissau': 'GNB', 'Equatorial Guinea': 'GNQ', 'Greece': 'GRC',
  'Guatemala': 'GTM', 'Guyana': 'GUY', 'Honduras': 'HND', 'Croatia': 'HRV', 'Haiti': 'HTI',
  'Hungary': 'HUN', 'Indonesia': 'IDN', 'India': 'IND', 'Ireland': 'IRL', 'Iran': 'IRN',
  'Iraq': 'IRQ', 'Iceland': 'ISL', 'Israel': 'ISR', 'Italy': 'ITA', 'Jamaica': 'JAM',
  'Jordan': 'JOR', 'Japan': 'JPN', 'Kazakhstan': 'KAZ', 'Kenya': 'KEN', 'Kyrgyzstan': 'KGZ',
  'Cambodia': 'KHM', 'South Korea': 'KOR', 'Korea': 'KOR', 'Kuwait': 'KWT', 'Laos': 'LAO',
  'Lebanon': 'LBN', 'Liberia': 'LBR', 'Libya': 'LBY', 'Sri Lanka': 'LKA', 'Lesotho': 'LSO',
  'Lithuania': 'LTU', 'Luxembourg': 'LUX', 'Latvia': 'LVA', 'Morocco': 'MAR', 'Moldova': 'MDA',
  'Madagascar': 'MDG', 'Maldives': 'MDV', 'Mexico': 'MEX', 'North Macedonia': 'MKD',
  'Mali': 'MLI', 'Malta': 'MLT', 'Montenegro': 'MNE', 'Mongolia': 'MNG', 'Mozambique': 'MOZ',
  'Mauritania': 'MRT', 'Mauritius': 'MUS', 'Malawi': 'MWI', 'Malaysia': 'MYS', 'Namibia': 'NAM',
  'Niger': 'NER', 'Nigeria': 'NGA', 'Nicaragua': 'NIC', 'Netherlands': 'NLD', 'Norway': 'NOR',
  'Nepal': 'NPL', 'New Zealand': 'NZL', 'Oman': 'OMN', 'Pakistan': 'PAK', 'Panama': 'PAN',
  'Peru': 'PER', 'Philippines': 'PHL', 'Papua New Guinea': 'PNG', 'Poland': 'POL',
  'North Korea': 'PRK', 'Paraguay': 'PRY', 'Portugal': 'PRT', 'Qatar': 'QAT', 'Romania': 'ROU',
  'Russia': 'RUS', 'Rwanda': 'RWA', 'Saudi Arabia': 'SAU', 'Sudan': 'SDN', 'Senegal': 'SEN',
  'Singapore': 'SGP', 'Sierra Leone': 'SLE', 'Solomon Islands': 'SLB', 'El Salvador': 'SLV',
  'Somalia': 'SOM', 'Serbia': 'SRB', 'South Sudan': 'SSD', 'Sao Tome and Principe': 'STP',
  'Suriname': 'SUR', 'Slovakia': 'SVK', 'Slovenia': 'SVN', 'Sweden': 'SWE', 'Eswatini': 'SWZ',
  'Seychelles': 'SYC', 'Syria': 'SYR', 'Chad': 'TCD', 'Togo': 'TGO', 'Thailand': 'THA',
  'Tajikistan': 'TJK', 'Turkmenistan': 'TKM', 'Timor-Leste': 'TLS', 'Tonga': 'TON',
  'Trinidad and Tobago': 'TTO', 'Tunisia': 'TUN', 'Turkey': 'TUR', 'Tanzania': 'TZA',
  'Uganda': 'UGA', 'Ukraine': 'UKR', 'Uruguay': 'URY', 'United States': 'USA', 'USA': 'USA',
  'United States of America': 'USA', 'Uzbekistan': 'UZB', 'Venezuela': 'VEN', 'Vietnam': 'VNM',
  'Vanuatu': 'VUT', 'Samoa': 'WSM', 'Yemen': 'YEM', 'South Africa': 'ZAF', 'Zambia': 'ZMB',
  'Zimbabwe': 'ZWE', 'Myanmar': 'MMR',
};

export function getIso3FromCountryName(countryName: string): string | undefined {
  return COUNTRY_NAME_TO_ISO3[countryName] || undefined;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
