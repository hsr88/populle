import { useCallback, useMemo, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetPopulationSummary,
  useGetCountryPopulation,
  useGetCityPopulation,
} from '@workspace/api-client-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { ShareButton } from '@/components/share/ShareButton';
import { SITE_URL } from '@/lib/share';
import { cn, formatPopulation } from '@/lib/utils';
import { Dices, ArrowLeftRight } from 'lucide-react';

const CURRENT_YEAR = 2026;

type Mode = 'preset' | 'country' | 'city' | 'continent';

interface ContrastSide {
  label: string;
  sublabel?: string;
  valueMillions: number;
  tone: 'cyan' | 'amber';
}

interface ContrastView {
  left: ContrastSide;
  right: ContrastSide;
  insight: string;
  title: string;
}

interface Preset {
  id: string;
  label: string;
  group: 'shock' | 'cities' | 'eras' | 'regions';
}

const PRESETS: Preset[] = [
  // Shock country / region
  { id: 'india-europe', label: 'India vs Europe', group: 'shock' },
  { id: 'nigeria-europe', label: 'Nigeria vs Europe', group: 'shock' },
  { id: 'usa-indonesia', label: 'USA vs Indonesia', group: 'shock' },
  { id: 'japan-ethiopia', label: 'Japan vs Ethiopia', group: 'shock' },
  { id: 'brazil-russia', label: 'Brazil vs Russia', group: 'shock' },
  { id: 'pakistan-germany', label: 'Pakistan vs Germany', group: 'shock' },
  { id: 'bangladesh-russia', label: 'Bangladesh vs Russia', group: 'shock' },
  { id: 'mexico-japan', label: 'Mexico vs Japan', group: 'shock' },
  { id: 'egypt-france', label: 'Egypt vs France', group: 'shock' },
  { id: 'philippines-uk', label: 'Philippines vs UK', group: 'shock' },
  { id: 'vietnam-germany', label: 'Vietnam vs Germany', group: 'shock' },
  { id: 'poland-korea', label: 'Poland vs South Korea', group: 'shock' },
  // Cities
  { id: 'lagos-london', label: 'Lagos vs London', group: 'cities' },
  { id: 'tokyo-new-york', label: 'Tokyo vs New York', group: 'cities' },
  { id: 'delhi-paris', label: 'Delhi vs Paris', group: 'cities' },
  { id: 'mumbai-moscow', label: 'Mumbai vs Moscow', group: 'cities' },
  { id: 'shanghai-cairo', label: 'Shanghai vs Cairo', group: 'cities' },
  { id: 'sao-paulo-berlin', label: 'São Paulo vs Berlin', group: 'cities' },
  { id: 'dhaka-rome', label: 'Dhaka vs Rome', group: 'cities' },
  { id: 'kinshasa-madrid', label: 'Kinshasa vs Madrid', group: 'cities' },
  { id: 'jakarta-toronto', label: 'Jakarta vs Toronto', group: 'cities' },
  { id: 'karachi-sydney', label: 'Karachi vs Sydney', group: 'cities' },
  // Eras
  { id: '1800-2026', label: 'World 1800 vs 2026', group: 'eras' },
  { id: '1950-2026', label: 'World 1950 vs 2026', group: 'eras' },
  { id: 'china-1970-2026', label: 'China 1970 vs 2026', group: 'eras' },
  { id: 'india-1970-2026', label: 'India 1970 vs 2026', group: 'eras' },
  { id: 'usa-1970-2026', label: 'USA 1970 vs 2026', group: 'eras' },
  { id: 'nigeria-1970-2026', label: 'Nigeria 1970 vs 2026', group: 'eras' },
  // Continents
  { id: 'africa-europe', label: 'Africa vs Europe', group: 'regions' },
  { id: 'asia-europe', label: 'Asia vs Europe', group: 'regions' },
  { id: 'asia-americas', label: 'Asia vs Americas', group: 'regions' },
  { id: 'africa-namerica', label: 'Africa vs N. America', group: 'regions' },
];

const GROUP_LABEL: Record<Preset['group'], string> = {
  shock: 'Countries',
  cities: 'Cities',
  eras: 'Then vs now',
  regions: 'Continents',
};

const CITY_ALIASES: Record<string, string[]> = {
  'New York': ['New York', 'New York City', 'NYC'],
  Delhi: ['Delhi', 'New Delhi'],
  'São Paulo': ['São Paulo', 'Sao Paulo'],
};

function findCountry(
  list: { iso3: string; name: string; populationMillions: number }[] | undefined,
  iso3: string,
) {
  return list?.find((c) => c.iso3 === iso3) ?? null;
}

function findCity(
  list: { name: string; country: string; populationMillions: number }[] | undefined,
  name: string,
) {
  if (!list) return null;
  const aliases = CITY_ALIASES[name] ?? [name];
  return (
    list.find((c) =>
      aliases.some((a) => c.name.toLowerCase() === a.toLowerCase()),
    ) ?? null
  );
}

function findContinent(
  breakdown: { continent: string; populationMillions: number }[] | undefined,
  name: string,
) {
  if (!breakdown) return null;
  if (name === 'Americas') {
    const na = breakdown.find((c) => c.continent === 'North America');
    const sa = breakdown.find((c) => c.continent === 'South America');
    if (!na && !sa) return null;
    return {
      continent: 'Americas',
      populationMillions: (na?.populationMillions ?? 0) + (sa?.populationMillions ?? 0),
    };
  }
  if (name === 'N. America' || name === 'North America') {
    return breakdown.find((c) => c.continent === 'North America') ?? null;
  }
  return breakdown.find((c) => c.continent === name) ?? null;
}

function formatMultiplier(larger: number, smaller: number): string {
  if (smaller <= 0) return '—';
  const ratio = larger / smaller;
  if (ratio >= 10) return `${Math.round(ratio)}×`;
  return `${ratio.toFixed(1)}×`;
}

function buildInsight(left: ContrastSide, right: ContrastSide): string {
  const delta = Math.abs(left.valueMillions - right.valueMillions);
  const leftWins = left.valueMillions >= right.valueMillions;
  const winner = leftWins ? left : right;
  const loser = leftWins ? right : left;
  const mult = formatMultiplier(winner.valueMillions, loser.valueMillions);
  return `${winner.label} is ${mult} ${loser.label} — a gap of ${formatPopulation(delta)}.`;
}

function SidePanel({
  side,
  align,
}: {
  side: ContrastSide;
  align: 'left' | 'right';
}) {
  const isCyan = side.tone === 'cyan';

  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -36 : 36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 min-h-[42vh] lg:min-h-0',
        align === 'left' ? 'items-start text-left' : 'items-end text-right',
        isCyan
          ? 'bg-gradient-to-br from-primary/35 via-background/40 to-transparent'
          : 'bg-gradient-to-bl from-accent/35 via-background/40 to-transparent',
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-60',
          isCyan
            ? 'bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.35),transparent_55%)]'
            : 'bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.35),transparent_55%)]',
        )}
      />
      <div className="relative z-10 w-full max-w-xl">
        <p
          className={cn(
            'font-display text-xs sm:text-sm uppercase tracking-[0.28em] mb-3',
            isCyan ? 'text-primary' : 'text-accent',
          )}
        >
          {side.label}
        </p>
        {side.sublabel ? (
          <p className="text-muted-foreground text-sm mb-3">{side.sublabel}</p>
        ) : null}
        <motion.p
          key={`${side.label}-${side.valueMillions}`}
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'font-display font-bold leading-none tracking-tight text-white',
            'text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]',
            isCyan && 'text-glow',
          )}
          style={
            !isCyan
              ? { textShadow: '0 0 20px hsl(var(--accent) / 0.45)' }
              : undefined
          }
        >
          {formatPopulation(side.valueMillions)}
        </motion.p>
      </div>
    </motion.div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0 flex-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 truncate"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-slate-900">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Contrast() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const mode = (params.get('mode') as Mode) || 'preset';
  const pairId = params.get('pair') || 'india-europe';
  const leftKey = params.get('left') || '';
  const rightKey = params.get('right') || '';

  const [customMode, setCustomMode] = useState<'country' | 'city' | 'continent'>(
    mode === 'city' || mode === 'continent' ? mode : 'country',
  );

  const summary2026 = useGetPopulationSummary({ year: CURRENT_YEAR });
  const summary1800 = useGetPopulationSummary({ year: 1800 });
  const summary1950 = useGetPopulationSummary({ year: 1950 });
  const countries2026 = useGetCountryPopulation({ year: CURRENT_YEAR, variant: 'medium' });
  const countries1970 = useGetCountryPopulation({ year: 1970, variant: 'medium' });
  const cities2026 = useGetCityPopulation({ year: CURRENT_YEAR, limit: 80 });

  const countries = countries2026.data?.data ?? [];
  const cities = cities2026.data?.data ?? [];
  const continents = summary2026.data?.continentBreakdown ?? [];

  const countryOptions = useMemo(
    () =>
      [...countries]
        .sort((a, b) => b.populationMillions - a.populationMillions)
        .map((c) => ({ value: c.iso3, label: `${c.name} (${formatPopulation(c.populationMillions)})` })),
    [countries],
  );

  const cityOptions = useMemo(
    () =>
      [...cities]
        .sort((a, b) => b.populationMillions - a.populationMillions)
        .map((c) => ({
          value: c.name,
          label: `${c.name} · ${c.country} (${formatPopulation(c.populationMillions)})`,
        })),
    [cities],
  );

  const continentOptions = useMemo(() => {
    const base = continents.map((c) => ({
      value: c.continent,
      label: `${c.continent} (${formatPopulation(c.populationMillions)})`,
    }));
    const na = continents.find((c) => c.continent === 'North America');
    const sa = continents.find((c) => c.continent === 'South America');
    if (na && sa) {
      base.push({
        value: 'Americas',
        label: `Americas (${formatPopulation(na.populationMillions + sa.populationMillions)})`,
      });
    }
    return base;
  }, [continents]);

  const isLoading =
    countries2026.isLoading ||
    cities2026.isLoading ||
    summary2026.isLoading;

  const isError =
    countries2026.isError || cities2026.isError || summary2026.isError;

  const retry = useCallback(() => {
    void countries2026.refetch();
    void cities2026.refetch();
    void summary2026.refetch();
    void summary1800.refetch();
    void summary1950.refetch();
    void countries1970.refetch();
  }, [countries2026, cities2026, summary2026, summary1800, summary1950, countries1970]);

  const resolvePreset = useCallback(
    (id: string): ContrastView | null => {
      const c26 = countries2026.data?.data;
      const c70 = countries1970.data?.data;
      const cityList = cities2026.data?.data;
      const br = summary2026.data?.continentBreakdown;

      const countryPair = (a: string, b: string, title: string): ContrastView | null => {
        const leftC = findCountry(c26, a);
        const rightC = findCountry(c26, b);
        if (!leftC || !rightC) return null;
        const left: ContrastSide = {
          label: leftC.name,
          sublabel: String(CURRENT_YEAR),
          valueMillions: leftC.populationMillions,
          tone: 'cyan',
        };
        const right: ContrastSide = {
          label: rightC.name,
          sublabel: String(CURRENT_YEAR),
          valueMillions: rightC.populationMillions,
          tone: 'amber',
        };
        return { left, right, insight: buildInsight(left, right), title };
      };

      const cityPair = (a: string, b: string, title: string): ContrastView | null => {
        const leftC = findCity(cityList, a);
        const rightC = findCity(cityList, b);
        if (!leftC || !rightC) return null;
        const left: ContrastSide = {
          label: leftC.name,
          sublabel: `${leftC.country} · ${CURRENT_YEAR}`,
          valueMillions: leftC.populationMillions,
          tone: 'cyan',
        };
        const right: ContrastSide = {
          label: rightC.name,
          sublabel: `${rightC.country} · ${CURRENT_YEAR}`,
          valueMillions: rightC.populationMillions,
          tone: 'amber',
        };
        return { left, right, insight: buildInsight(left, right), title };
      };

      const continentPair = (a: string, b: string, title: string): ContrastView | null => {
        const leftC = findContinent(br, a);
        const rightC = findContinent(br, b);
        if (!leftC || !rightC) return null;
        const left: ContrastSide = {
          label: leftC.continent,
          sublabel: String(CURRENT_YEAR),
          valueMillions: leftC.populationMillions,
          tone: 'cyan',
        };
        const right: ContrastSide = {
          label: rightC.continent,
          sublabel: String(CURRENT_YEAR),
          valueMillions: rightC.populationMillions,
          tone: 'amber',
        };
        return { left, right, insight: buildInsight(left, right), title };
      };

      const eraCountry = (iso: string, title: string): ContrastView | null => {
        const then = findCountry(c70, iso);
        const now = findCountry(c26, iso);
        if (!then || !now) return null;
        const left: ContrastSide = {
          label: then.name,
          sublabel: '1970',
          valueMillions: then.populationMillions,
          tone: 'cyan',
        };
        const right: ContrastSide = {
          label: now.name,
          sublabel: String(CURRENT_YEAR),
          valueMillions: now.populationMillions,
          tone: 'amber',
        };
        const delta = now.populationMillions - then.populationMillions;
        return {
          left,
          right,
          title,
          insight: `${now.name} added ${formatPopulation(Math.abs(delta))} people between 1970 and ${CURRENT_YEAR}.`,
        };
      };

      const map: Record<string, () => ContrastView | null> = {
        'india-europe': () => {
          const india = findCountry(c26, 'IND');
          const europe = findContinent(br, 'Europe');
          if (!india || !europe) return null;
          const left: ContrastSide = { label: 'India', sublabel: String(CURRENT_YEAR), valueMillions: india.populationMillions, tone: 'cyan' };
          const right: ContrastSide = { label: 'Europe', sublabel: 'Entire continent', valueMillions: europe.populationMillions, tone: 'amber' };
          return { left, right, title: 'India vs Europe', insight: `One country — India — is ${formatMultiplier(india.populationMillions, europe.populationMillions)} Europe’s entire population.` };
        },
        'nigeria-europe': () => {
          const nga = findCountry(c26, 'NGA');
          const europe = findContinent(br, 'Europe');
          if (!nga || !europe) return null;
          const left: ContrastSide = { label: 'Nigeria', sublabel: String(CURRENT_YEAR), valueMillions: nga.populationMillions, tone: 'cyan' };
          const right: ContrastSide = { label: 'Europe', sublabel: 'Entire continent', valueMillions: europe.populationMillions, tone: 'amber' };
          return { left, right, title: 'Nigeria vs Europe', insight: buildInsight(left, right) };
        },
        'usa-indonesia': () => countryPair('USA', 'IDN', 'USA vs Indonesia'),
        'japan-ethiopia': () => countryPair('JPN', 'ETH', 'Japan vs Ethiopia'),
        'brazil-russia': () => countryPair('BRA', 'RUS', 'Brazil vs Russia'),
        'pakistan-germany': () => countryPair('PAK', 'DEU', 'Pakistan vs Germany'),
        'bangladesh-russia': () => countryPair('BGD', 'RUS', 'Bangladesh vs Russia'),
        'mexico-japan': () => countryPair('MEX', 'JPN', 'Mexico vs Japan'),
        'egypt-france': () => countryPair('EGY', 'FRA', 'Egypt vs France'),
        'philippines-uk': () => countryPair('PHL', 'GBR', 'Philippines vs UK'),
        'vietnam-germany': () => countryPair('VNM', 'DEU', 'Vietnam vs Germany'),
        'poland-korea': () => countryPair('POL', 'KOR', 'Poland vs South Korea'),
        'lagos-london': () => cityPair('Lagos', 'London', 'Lagos vs London'),
        'tokyo-new-york': () => cityPair('Tokyo', 'New York', 'Tokyo vs New York'),
        'delhi-paris': () => cityPair('Delhi', 'Paris', 'Delhi vs Paris'),
        'mumbai-moscow': () => cityPair('Mumbai', 'Moscow', 'Mumbai vs Moscow'),
        'shanghai-cairo': () => cityPair('Shanghai', 'Cairo', 'Shanghai vs Cairo'),
        'sao-paulo-berlin': () => cityPair('São Paulo', 'Berlin', 'São Paulo vs Berlin'),
        'dhaka-rome': () => cityPair('Dhaka', 'Rome', 'Dhaka vs Rome'),
        'kinshasa-madrid': () => cityPair('Kinshasa', 'Madrid', 'Kinshasa vs Madrid'),
        'jakarta-toronto': () => cityPair('Jakarta', 'Toronto', 'Jakarta vs Toronto'),
        'karachi-sydney': () => cityPair('Karachi', 'Sydney', 'Karachi vs Sydney'),
        '1800-2026': () => {
          const then = summary1800.data?.worldPopulationMillions;
          const now = summary2026.data?.worldPopulationMillions;
          if (then == null || now == null) return null;
          const left: ContrastSide = { label: 'World · 1800', valueMillions: then, tone: 'cyan' };
          const right: ContrastSide = { label: `World · ${CURRENT_YEAR}`, valueMillions: now, tone: 'amber' };
          return {
            left,
            right,
            title: 'World 1800 vs 2026',
            insight: `Humanity grew ${formatMultiplier(now, then)} — adding ${formatPopulation(now - then)} in two centuries.`,
          };
        },
        '1950-2026': () => {
          const then = summary1950.data?.worldPopulationMillions;
          const now = summary2026.data?.worldPopulationMillions;
          if (then == null || now == null) return null;
          const left: ContrastSide = { label: 'World · 1950', valueMillions: then, tone: 'cyan' };
          const right: ContrastSide = { label: `World · ${CURRENT_YEAR}`, valueMillions: now, tone: 'amber' };
          return {
            left,
            right,
            title: 'World 1950 vs 2026',
            insight: `Since 1950 the world added ${formatPopulation(now - then)} people — ${formatMultiplier(now, then)} growth.`,
          };
        },
        'china-1970-2026': () => eraCountry('CHN', 'China 1970 vs 2026'),
        'india-1970-2026': () => eraCountry('IND', 'India 1970 vs 2026'),
        'usa-1970-2026': () => eraCountry('USA', 'USA 1970 vs 2026'),
        'nigeria-1970-2026': () => eraCountry('NGA', 'Nigeria 1970 vs 2026'),
        'africa-europe': () => continentPair('Africa', 'Europe', 'Africa vs Europe'),
        'asia-europe': () => continentPair('Asia', 'Europe', 'Asia vs Europe'),
        'asia-americas': () => continentPair('Asia', 'Americas', 'Asia vs Americas'),
        'africa-namerica': () => continentPair('Africa', 'North America', 'Africa vs N. America'),
      };

      return map[id]?.() ?? null;
    },
    [
      countries2026.data,
      countries1970.data,
      cities2026.data,
      summary2026.data,
      summary1800.data,
      summary1950.data,
    ],
  );

  const contrast: ContrastView | null = useMemo(() => {
    if (mode === 'country' && leftKey && rightKey) {
      const leftC = findCountry(countries, leftKey);
      const rightC = findCountry(countries, rightKey);
      if (!leftC || !rightC) return null;
      const left: ContrastSide = {
        label: leftC.name,
        sublabel: String(CURRENT_YEAR),
        valueMillions: leftC.populationMillions,
        tone: 'cyan',
      };
      const right: ContrastSide = {
        label: rightC.name,
        sublabel: String(CURRENT_YEAR),
        valueMillions: rightC.populationMillions,
        tone: 'amber',
      };
      return {
        left,
        right,
        insight: buildInsight(left, right),
        title: `${leftC.name} vs ${rightC.name}`,
      };
    }

    if (mode === 'city' && leftKey && rightKey) {
      const leftC = findCity(cities, leftKey);
      const rightC = findCity(cities, rightKey);
      if (!leftC || !rightC) return null;
      const left: ContrastSide = {
        label: leftC.name,
        sublabel: `${leftC.country} · ${CURRENT_YEAR}`,
        valueMillions: leftC.populationMillions,
        tone: 'cyan',
      };
      const right: ContrastSide = {
        label: rightC.name,
        sublabel: `${rightC.country} · ${CURRENT_YEAR}`,
        valueMillions: rightC.populationMillions,
        tone: 'amber',
      };
      return {
        left,
        right,
        insight: buildInsight(left, right),
        title: `${leftC.name} vs ${rightC.name}`,
      };
    }

    if (mode === 'continent' && leftKey && rightKey) {
      const leftC = findContinent(continents, leftKey);
      const rightC = findContinent(continents, rightKey);
      if (!leftC || !rightC) return null;
      const left: ContrastSide = {
        label: leftC.continent,
        sublabel: String(CURRENT_YEAR),
        valueMillions: leftC.populationMillions,
        tone: 'cyan',
      };
      const right: ContrastSide = {
        label: rightC.continent,
        sublabel: String(CURRENT_YEAR),
        valueMillions: rightC.populationMillions,
        tone: 'amber',
      };
      return {
        left,
        right,
        insight: buildInsight(left, right),
        title: `${leftC.continent} vs ${rightC.continent}`,
      };
    }

    return resolvePreset(pairId);
  }, [
    mode,
    leftKey,
    rightKey,
    pairId,
    countries,
    cities,
    continents,
    resolvePreset,
  ]);

  const goPreset = (id: string) => {
    setLocation(`/contrast?pair=${id}`);
  };

  const goCustom = (m: 'country' | 'city' | 'continent', left: string, right: string) => {
    setCustomMode(m);
    setLocation(`/contrast?mode=${m}&left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`);
  };

  const swapSides = () => {
    if (mode === 'preset') return;
    goCustom(customMode, rightKey || leftKey, leftKey || rightKey);
  };

  const randomize = () => {
    const pool = PRESETS.filter((p) => p.group === 'shock' || p.group === 'cities');
    const pick = pool[Math.floor(Math.random() * pool.length)];
    goPreset(pick.id);
  };

  const shareUrl =
    mode === 'preset'
      ? `${SITE_URL}/contrast?pair=${pairId}`
      : `${SITE_URL}/contrast?mode=${mode}&left=${encodeURIComponent(leftKey)}&right=${encodeURIComponent(rightKey)}`;

  const displayTitle = contrast?.title ?? PRESETS.find((p) => p.id === pairId)?.label ?? 'Contrast';

  const activeLeft =
    mode === 'country'
      ? leftKey || countryOptions[0]?.value || ''
      : mode === 'city'
        ? leftKey || cityOptions[0]?.value || ''
        : mode === 'continent'
          ? leftKey || continentOptions[0]?.value || ''
          : '';
  const activeRight =
    mode === 'country'
      ? rightKey || countryOptions[1]?.value || ''
      : mode === 'city'
        ? rightKey || cityOptions[1]?.value || ''
        : mode === 'continent'
          ? rightKey || continentOptions[1]?.value || ''
          : '';

  const groups = (['shock', 'cities', 'eras', 'regions'] as const).map((g) => ({
    key: g,
    label: GROUP_LABEL[g],
    items: PRESETS.filter((p) => p.group === g),
  }));

  return (
    <Layout hideYearSlider fullBleed>
      <SEO
        title={`${displayTitle} | Population Contrast | Populle`}
        description={
          contrast
            ? `${contrast.left.label} ${formatPopulation(contrast.left.valueMillions)} vs ${contrast.right.label} ${formatPopulation(contrast.right.valueMillions)}. ${contrast.insight}`
            : 'Dramatic population contrasts — countries, cities, continents, and eras.'
        }
        keywords="population contrast, country comparison, city comparison, world population"
        path={`/contrast${search ? `?${search}` : ''}`}
      />

      <div className="relative min-h-full w-full flex flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(6,182,212,0.18),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(245,158,11,0.14),transparent_45%)]" />

        {/* Chrome */}
        <div className="relative z-20 flex flex-col gap-4 px-4 sm:px-6 lg:px-10 pt-5 pb-3 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-[11px] uppercase tracking-[0.32em] text-primary/80 mb-1">
                Populle Contrast
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {displayTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={randomize}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-sm text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                title="Random contrast"
              >
                <Dices className="w-4 h-4" />
                <span className="hidden sm:inline">Random</span>
              </button>
              <ShareButton
                title={`${displayTitle} — Populle`}
                text={contrast?.insight ?? 'Dramatic population contrasts on Populle.'}
                url={shareUrl}
                variant="ghost"
                className="border border-white/15 bg-white/5 hover:bg-white/10"
              />
            </div>
          </div>

          {/* Custom builders */}
          <div className="flex flex-col gap-3 p-3 sm:p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2">
              {(['country', 'city', 'continent'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setCustomMode(m);
                    const opts =
                      m === 'country'
                        ? countryOptions
                        : m === 'city'
                          ? cityOptions
                          : continentOptions;
                    const l = opts[0]?.value ?? '';
                    const r = opts[1]?.value ?? opts[0]?.value ?? '';
                    if (l && r) goCustom(m, l, r);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider border transition-all',
                    mode === m
                      ? 'bg-primary/20 border-primary/40 text-primary'
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white',
                  )}
                >
                  Pick {m === 'country' ? 'countries' : m === 'city' ? 'cities' : 'continents'}
                </button>
              ))}
            </div>

            {(mode === 'country' || mode === 'city' || mode === 'continent') && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <SelectField
                  label="Left"
                  value={activeLeft}
                  onChange={(v) => goCustom(customMode, v, activeRight || v)}
                  options={
                    customMode === 'country'
                      ? countryOptions
                      : customMode === 'city'
                        ? cityOptions
                        : continentOptions
                  }
                />
                <button
                  type="button"
                  onClick={swapSides}
                  className="self-center sm:mb-1 p-2.5 rounded-xl border border-white/15 bg-white/5 text-muted-foreground hover:text-white transition-colors"
                  title="Swap"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <SelectField
                  label="Right"
                  value={activeRight}
                  onChange={(v) => goCustom(customMode, activeLeft || v, v)}
                  options={
                    customMode === 'country'
                      ? countryOptions
                      : customMode === 'city'
                        ? cityOptions
                        : continentOptions
                  }
                />
              </div>
            )}
          </div>

          {/* Preset groups */}
          <div className="flex flex-col gap-3 max-h-[28vh] overflow-y-auto pr-1">
            {groups.map((g) => (
              <div key={g.key}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1.5 px-0.5">
                  {g.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((p) => {
                    const active = mode === 'preset' && p.id === pairId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goPreset(p.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all border',
                          active
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:border-white/25',
                        )}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div className="relative z-10 flex-1 flex flex-col min-h-0">
          {isLoading ? (
            <LoadingScreen message="Staging contrast..." />
          ) : isError ? (
            <ErrorState error={null} retry={retry} />
          ) : !contrast ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground px-6 text-center">
              Could not resolve this contrast. Try another pair.
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${pairId}-${leftKey}-${rightKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="relative flex-1 flex flex-col lg:flex-row min-h-[50vh]">
                  <SidePanel side={contrast.left} align="left" />
                  <div className="relative z-20 flex lg:flex-col items-center justify-center shrink-0 -my-3 lg:my-0 lg:-mx-5 pointer-events-none">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.18, type: 'spring', stiffness: 260, damping: 18 }}
                      className="flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-background/90 shadow-xl shadow-black/50"
                    >
                      <span className="font-display text-sm font-bold tracking-widest text-white">
                        VS
                      </span>
                    </motion.div>
                  </div>
                  <SidePanel side={contrast.right} align="right" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.45 }}
                  className="relative z-20 px-4 sm:px-8 py-5 border-t border-white/10 bg-black/50 backdrop-blur-md"
                >
                  <p className="text-center font-display text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-snug">
                    {contrast.insight}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </Layout>
  );
}
