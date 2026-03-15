import { useState, useEffect, useRef, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePopulationState } from '@/context/PopulationContext';
import { useGetCityPopulation, useGetPopulationTimeseries } from '@workspace/api-client-react';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { formatPopulation } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AncientEraPanel } from '@/components/ui/AncientEraPanel';
import { isAncient } from '@/lib/timeUtils';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Search, X, TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

interface SearchResult { name: string; continent: string; }

export default function Cities() {
  const { year } = usePopulationState();
  const ancient = isAncient(year);
  const limit = 20;

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setDropdownOpen(false); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/population/search?q=${encodeURIComponent(query)}&type=city`);
        const json = await res.json();
        setResults(json.results || []);
        setDropdownOpen(true);
      } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Data queries
  const { data, isLoading, isError, refetch } = useGetCityPopulation({ year, limit });
  const { data: data2050 } = useGetCityPopulation({ year: 2050, limit });
  const { data: tsData, isLoading: tsLoading } = useGetPopulationTimeseries(
    { locations: selectedCity ?? '', type: 'city' },
    { enabled: !!selectedCity } as any,
  );

  const pop2050Map = useMemo(() => {
    const m: Record<string, number> = {};
    data2050?.data?.forEach(c => { m[c.name] = c.populationMillions; });
    return m;
  }, [data2050]);

  const maxPop = data?.data?.[0]?.populationMillions || 50;

  const selectCity = (name: string) => {
    setSelectedCity(name);
    setQuery(name);
    setDropdownOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedCity(null);
    setDropdownOpen(false);
    inputRef.current?.focus();
  };

  if (isLoading && !ancient) return <Layout><LoadingScreen message="Loading Top Cities..." /></Layout>;
  if (isError && !ancient) return <Layout><ErrorState error={null} retry={() => refetch()} /></Layout>;
  if (ancient) return <Layout><AncientEraPanel year={year} pageName="Top cities" /></Layout>;

  const cityTimeseries = tsData?.locations?.[0];
  const chartData = cityTimeseries?.data?.map((p: any) => ({
    year: p.year,
    pop: p.populationMillions,
  })) ?? [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-32">
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold">Top {limit} Largest Cities</h1>
            <p className="text-muted-foreground mt-1">
              Rankings for {year} · hover a row for 2050 projection
            </p>
          </div>

          {/* Search bar */}
          <div className="sm:ml-auto relative" style={{ minWidth: 260 }}>
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedCity(null); }}
                onFocus={() => results.length > 0 && setDropdownOpen(true)}
                placeholder="Search any city…"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-colors"
              />
              {query && (
                <button onClick={clearSearch} className="absolute right-2.5 text-muted-foreground hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && results.length > 0 && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border border-white/10 bg-[rgba(3,7,18,0.97)] shadow-2xl overflow-hidden"
                >
                  {results.map(r => (
                    <button
                      key={r.name}
                      onClick={() => selectCity(r.name)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 text-left transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-sm font-medium text-white">{r.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{r.continent}</span>
                    </button>
                  ))}
                </motion.div>
              )}
              {dropdownOpen && results.length === 0 && query.trim() && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border border-white/10 bg-[rgba(3,7,18,0.97)] shadow-2xl px-4 py-3"
                >
                  <p className="text-sm text-muted-foreground">No cities found for "{query}"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected city detail card */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              key={selectedCity}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCity}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {cityTimeseries?.continent ?? ''} · Population trend 1950–2100
                  </p>
                </div>
                {!tsLoading && chartData.length > 0 && (() => {
                  const curr = chartData.find((d: any) => d.year === year)?.pop
                    ?? chartData[chartData.length - 1]?.pop ?? 0;
                  const proj = chartData.find((d: any) => d.year === 2050)?.pop ?? 0;
                  const pct = curr > 0 ? ((proj - curr) / curr) * 100 : 0;
                  return (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{formatPopulation(curr)}</div>
                      <div className={`text-xs font-semibold mt-0.5 flex items-center justify-end gap-1 ${pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {pct >= 0 ? '+' : ''}{pct.toFixed(1)}% by 2050
                      </div>
                    </div>
                  );
                })()}
              </div>

              {tsLoading && (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading chart…</div>
              )}
              {!tsLoading && chartData.length > 0 && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="cityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false}
                        tickFormatter={(v: number) => `${v.toFixed(0)}M`} />
                      <RechartsTooltip
                        formatter={(v: number) => [`${v.toFixed(1)}M`, 'Population']}
                        contentStyle={{ backgroundColor: 'rgba(3,7,18,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: 12 }}
                      />
                      <ReferenceLine x={year} stroke="rgba(6,182,212,0.5)" strokeDasharray="4 2"
                        label={{ value: String(year), position: 'top', fontSize: 9, fill: '#06b6d4' }} />
                      <Area type="monotone" dataKey="pop" stroke="#06b6d4" strokeWidth={2}
                        fill="url(#cityGrad)" dot={false} activeDot={{ r: 4, fill: '#06b6d4' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {!tsLoading && chartData.length === 0 && (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">No timeseries data available</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top 20 list */}
        <div className="glass-panel rounded-2xl p-5 overflow-y-auto">
          <ul className="flex flex-col gap-2.5">
            <AnimatePresence>
              {data?.data?.map((city, index) => {
                const widthPct = (city.populationMillions / maxPop) * 100;
                const pop50 = pop2050Map[city.name];
                const growthPct = pop50 != null && city.populationMillions > 0
                  ? ((pop50 - city.populationMillions) / city.populationMillions) * 100
                  : null;
                const isSelected = city.name === selectedCity;

                return (
                  <motion.li
                    key={city.id || city.name}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, type: 'spring', bounce: 0.2, delay: index * 0.02 }}
                    className={`relative flex items-center p-3.5 rounded-xl border transition-all overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'bg-primary/15 border-primary/40'
                        : 'bg-white/5 hover:bg-white/8 border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => {
                      if (isSelected) { setSelectedCity(null); setQuery(''); }
                      else { selectCity(city.name); }
                    }}
                  >
                    {/* Background bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-500 ease-out"
                      style={{ width: `${widthPct}%` }}
                    />

                    <div className="relative z-10 flex items-center w-full gap-3">
                      {/* Rank */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border shadow-[0_0_8px_rgba(6,182,212,0.2)] ${
                        isSelected ? 'bg-primary text-background border-primary' : 'bg-background text-primary border-primary/30'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Name + location */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-white truncate leading-tight">{city.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{city.country} · {city.continent}</p>
                      </div>

                      {/* 2050 projection */}
                      {pop50 != null && growthPct != null && (
                        <div className="hidden sm:flex flex-col items-end shrink-0 mr-3">
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">2050</div>
                          <div className="text-sm font-semibold text-white/70">{formatPopulation(pop50)}</div>
                          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${
                            growthPct > 5 ? 'text-emerald-400'
                            : growthPct < -5 ? 'text-red-400'
                            : 'text-muted-foreground'
                          }`}>
                            {growthPct > 5 ? <TrendingUp className="w-2.5 h-2.5" />
                            : growthPct < -5 ? <TrendingDown className="w-2.5 h-2.5" />
                            : <Minus className="w-2.5 h-2.5" />}
                            {growthPct > 0 ? '+' : ''}{growthPct.toFixed(0)}%
                          </div>
                        </div>
                      )}

                      {/* Current population */}
                      <div className="text-right shrink-0">
                        <div className="font-bold text-lg text-accent text-glow leading-tight">
                          {formatPopulation(city.populationMillions)}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {city.urbanizationLevel}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
