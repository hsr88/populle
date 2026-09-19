export interface HistoricalEvent {
  year: number;
  icon: string;
  label: string;
  color: string;
  impact: string;
  category: 'war' | 'conflict' | 'disaster' | 'science' | 'society' | 'milestone';
}

/** Shared timeline used by YearSlider + Birth Year Story */
export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // Ancient
  { year: -5500, icon: '🌾', label: 'Neolithic Revolution', color: '#22c55e', impact: 'Agriculture spreads — first sustained population growth', category: 'society' },
  { year: -3500, icon: '🏙️', label: 'First Cities', color: '#06b6d4', impact: 'Mesopotamia & Egypt urbanize; writing emerges', category: 'society' },
  { year: -430, icon: '☠️', label: 'Plague of Athens', color: '#ef4444', impact: '~25% of Athenian forces and population lost', category: 'disaster' },
  { year: 165, icon: '☠️', label: 'Antonine Plague', color: '#ef4444', impact: '5–10M deaths across the Roman Empire', category: 'disaster' },
  { year: 541, icon: '☠️', label: 'Plague of Justinian', color: '#ef4444', impact: '25–50M deaths — first recorded pandemic', category: 'disaster' },
  { year: 1200, icon: '⚔️', label: 'Mongol Conquests', color: '#f97316', impact: '30–40M deaths; conquered lands lost up to 80%', category: 'war' },
  { year: 1347, icon: '☠️', label: 'Black Death', color: '#ef4444', impact: '75–200M deaths — 30–60% of Europe', category: 'disaster' },
  { year: 1492, icon: '⚓', label: 'Columbian Exchange', color: '#f59e0b', impact: 'Diseases wipe out ~90% of indigenous American peoples', category: 'disaster' },
  { year: 1618, icon: '⚔️', label: "Thirty Years' War", color: '#f97316', impact: '~8M deaths; Central Europe lost up to a third', category: 'war' },
  { year: 1720, icon: '☠️', label: 'Great Plague of Marseille', color: '#ef4444', impact: 'Last major plague in Western Europe; ~100K dead', category: 'disaster' },
  { year: 1800, icon: '🌍', label: '1 Billion People', color: '#06b6d4', impact: 'World population crosses 1 billion', category: 'milestone' },
  { year: 1845, icon: '🥔', label: 'Irish Potato Famine', color: '#f97316', impact: '1M dead, 2M emigrated — Ireland lost 25%', category: 'disaster' },
  { year: 1850, icon: '🏭', label: 'Industrial Revolution', color: '#06b6d4', impact: 'Steam, cities & medicine accelerate growth', category: 'science' },
  { year: 1861, icon: '⚔️', label: 'American Civil War', color: '#f97316', impact: '~750K dead — deadliest US conflict', category: 'war' },
  { year: 1914, icon: '⚔️', label: 'World War I', color: '#f97316', impact: '20M deaths; reshapes Europe and the Middle East', category: 'war' },
  { year: 1917, icon: '🚩', label: 'Russian Revolution', color: '#f97316', impact: 'Empire collapses; civil war and famine follow', category: 'conflict' },
  { year: 1918, icon: '😷', label: 'Spanish Flu', color: '#ef4444', impact: '50–100M deaths — one of history’s deadliest pandemics', category: 'disaster' },
  { year: 1928, icon: '💊', label: 'Penicillin Discovered', color: '#22c55e', impact: 'Antibiotics begin saving hundreds of millions', category: 'science' },
  { year: 1929, icon: '📉', label: 'Great Depression', color: '#f59e0b', impact: 'Global economic collapse reshapes migration & births', category: 'society' },
  { year: 1937, icon: '⚔️', label: 'Second Sino-Japanese War', color: '#f97316', impact: 'Millions dead in East Asia before WWII expands', category: 'war' },
  { year: 1939, icon: '⚔️', label: 'World War II', color: '#f97316', impact: '70–85M deaths — deadliest conflict in history', category: 'war' },
  { year: 1945, icon: '☢️', label: 'Atomic Age Begins', color: '#f59e0b', impact: 'Hiroshima & Nagasaki; Cold War nuclear era starts', category: 'war' },
  { year: 1945, icon: '🕊️', label: 'UN Founded · Baby Boom', color: '#22c55e', impact: 'Birth rates surge; new world order takes shape', category: 'society' },
  { year: 1947, icon: '🔀', label: 'Partition of India', color: '#f97316', impact: '~1M dead, 10–15M displaced — largest migration of era', category: 'conflict' },
  { year: 1948, icon: '🇮🇱', label: 'Israel Founded', color: '#f59e0b', impact: 'Middle East conflicts reshape the region for decades', category: 'conflict' },
  { year: 1950, icon: '⚔️', label: 'Korean War', color: '#f97316', impact: '~3M dead; peninsula divided to this day', category: 'war' },
  { year: 1959, icon: '🌾', label: 'Great Chinese Famine', color: '#ef4444', impact: '15–55M deaths during the Great Leap Forward', category: 'disaster' },
  { year: 1960, icon: '🌱', label: 'Green Revolution', color: '#22c55e', impact: 'High-yield crops feed billions; famines decline', category: 'science' },
  { year: 1961, icon: '🧱', label: 'Berlin Wall Built', color: '#f59e0b', impact: 'Cold War hardens; Europe split for 28 years', category: 'conflict' },
  { year: 1962, icon: '☢️', label: 'Cuban Missile Crisis', color: '#f97316', impact: 'Closest brush with global nuclear war', category: 'conflict' },
  { year: 1965, icon: '⚔️', label: 'Vietnam War Escalates', color: '#f97316', impact: 'Millions dead across Indochina by 1975', category: 'war' },
  { year: 1967, icon: '💉', label: 'Smallpox Eradication Drive', color: '#22c55e', impact: 'Global campaign begins; disease gone by 1980', category: 'science' },
  { year: 1969, icon: '🚀', label: 'Moon Landing', color: '#06b6d4', impact: 'First humans on another world', category: 'science' },
  { year: 1971, icon: '⚔️', label: 'Bangladesh Liberation War', color: '#f97316', impact: 'Hundreds of thousands dead; new nation born', category: 'war' },
  { year: 1973, icon: '🛢️', label: 'Oil Crisis', color: '#f59e0b', impact: 'Energy shock hits global economy and migration', category: 'society' },
  { year: 1974, icon: '🌍', label: '4 Billion People', color: '#06b6d4', impact: 'Doubled in just 47 years', category: 'milestone' },
  { year: 1975, icon: '☠️', label: 'Cambodian Genocide', color: '#ef4444', impact: '~1.5–2M dead under the Khmer Rouge', category: 'conflict' },
  { year: 1979, icon: '🇮🇷', label: 'Iranian Revolution', color: '#f97316', impact: 'Shah falls; region enters a new era of conflict', category: 'conflict' },
  { year: 1979, icon: '⚔️', label: 'Soviet–Afghan War', color: '#f97316', impact: 'Decade-long war; millions of refugees', category: 'war' },
  { year: 1986, icon: '☢️', label: 'Chernobyl Disaster', color: '#ef4444', impact: 'Nuclear accident forces mass evacuations', category: 'disaster' },
  { year: 1987, icon: '🌍', label: '5 Billion People', color: '#06b6d4', impact: 'World population reaches 5 billion', category: 'milestone' },
  { year: 1989, icon: '🧱', label: 'Berlin Wall Falls', color: '#22c55e', impact: 'Cold War ends; Europe reunifies', category: 'society' },
  { year: 1990, icon: '⚔️', label: 'Gulf War', color: '#f97316', impact: 'Coalition war reshapes Middle East politics', category: 'war' },
  { year: 1991, icon: '🏳️', label: 'Soviet Union Dissolves', color: '#f59e0b', impact: '15 new states; end of bipolar world', category: 'society' },
  { year: 1991, icon: '⚔️', label: 'Yugoslav Wars Begin', color: '#f97316', impact: 'Ethnic conflict and genocide in the Balkans', category: 'war' },
  { year: 1994, icon: '☠️', label: 'Rwandan Genocide', color: '#ef4444', impact: '~800K killed in ~100 days', category: 'conflict' },
  { year: 1999, icon: '🌍', label: '6 Billion People', color: '#06b6d4', impact: 'World population reaches 6 billion', category: 'milestone' },
  { year: 2001, icon: '✈️', label: 'September 11 Attacks', color: '#f97316', impact: 'Global war on terror era begins', category: 'conflict' },
  { year: 2003, icon: '⚔️', label: 'Iraq War', color: '#f97316', impact: 'Invasion and years of instability follow', category: 'war' },
  { year: 2004, icon: '🌊', label: 'Indian Ocean Tsunami', color: '#ef4444', impact: '~230K dead across 14 countries', category: 'disaster' },
  { year: 2008, icon: '📉', label: 'Global Financial Crisis', color: '#f59e0b', impact: 'Worst recession since the Depression', category: 'society' },
  { year: 2011, icon: '🌍', label: '7 Billion People', color: '#06b6d4', impact: 'World population reaches 7 billion', category: 'milestone' },
  { year: 2011, icon: '✊', label: 'Arab Spring', color: '#f97316', impact: 'Uprisings reshape North Africa & Middle East', category: 'conflict' },
  { year: 2011, icon: '⚔️', label: 'Syrian Civil War', color: '#f97316', impact: 'Millions displaced — largest refugee crisis of era', category: 'war' },
  { year: 2014, icon: '⚔️', label: 'War in Donbas', color: '#f97316', impact: 'Conflict in eastern Ukraine begins', category: 'war' },
  { year: 2015, icon: '🤝', label: 'Paris Climate Accord', color: '#22c55e', impact: 'Near-global pact on climate action', category: 'society' },
  { year: 2020, icon: '🦠', label: 'COVID-19 Pandemic', color: '#ef4444', impact: '7M+ official deaths; world briefly stops', category: 'disaster' },
  { year: 2022, icon: '🌍', label: '8 Billion People', color: '#06b6d4', impact: 'Slowest growth rate since 1950', category: 'milestone' },
  { year: 2022, icon: '⚔️', label: 'Russia Invades Ukraine', color: '#f97316', impact: 'Largest war in Europe since WWII', category: 'war' },
  { year: 2023, icon: '⚔️', label: 'Israel–Hamas War', color: '#f97316', impact: 'Gaza war triggers wider regional crisis', category: 'war' },
  { year: 2080, icon: '📉', label: 'Peak Population (proj.)', color: '#06b6d4', impact: 'UN median: peaks ~10.3B then slowly declines', category: 'milestone' },
];

/** Events that happened during someone's lifetime (birthYear → now), prioritized */
export function getLifetimeEvents(
  birthYear: number,
  nowYear = 2026,
  limit = 12,
): HistoricalEvent[] {
  const inLife = HISTORICAL_EVENTS.filter(
    (e) => e.year >= birthYear && e.year <= nowYear,
  );

  const priority: HistoricalEvent['category'][] = [
    'war',
    'conflict',
    'disaster',
    'milestone',
    'science',
    'society',
  ];

  const scored = [...inLife].sort((a, b) => {
    const pa = priority.indexOf(a.category);
    const pb = priority.indexOf(b.category);
    if (pa !== pb) return pa - pb;
    return a.year - b.year;
  });

  // Keep chronological for display, but prefer high-priority if over limit
  if (scored.length <= limit) {
    return [...inLife].sort((a, b) => a.year - b.year);
  }

  const picked = new Set<HistoricalEvent>();
  for (const e of scored) {
    if (picked.size >= limit) break;
    picked.add(e);
  }
  // Always include first year after birth if any, and most recent
  const first = inLife[0];
  const last = inLife[inLife.length - 1];
  if (first) picked.add(first);
  if (last) picked.add(last);

  return [...picked].sort((a, b) => a.year - b.year).slice(0, limit);
}

export function getEventsAroundBirth(birthYear: number, window = 3): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(
    (e) => e.year >= birthYear - window && e.year <= birthYear + window,
  ).sort((a, b) => a.year - b.year);
}
