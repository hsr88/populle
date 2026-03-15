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

export function getFlagUrl(iso3: string): string | null {
  const iso2 = ISO3_TO_ISO2[iso3];
  return iso2 ? `https://flagcdn.com/w80/${iso2}.png` : null;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
