import { useState, useMemo, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePopulationState } from '@/context/PopulationContext';
import { useGetPopulationTimeseries } from '@workspace/api-client-react';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { formatPopulation } from '@/lib/utils';
import { Search, X } from 'lucide-react';

const COLORS = ['#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];

interface SearchResult { name: string; type: string; continent: string; }

function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const base = import.meta.env.BASE_URL.replace(/\/$/, '');
        const res = await fetch(`${base}/api/population/search?q=${encodeURIComponent(query)}&type=both`);
        const json = await res.json();
        setResults(json.results || []);
      } catch { setResults([]); }
    }, 200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  return results;
}

export default function Compare() {
  const { variant } = usePopulationState();
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["China", "India", "United States of America"]);
  const [searchInput, setSearchInput] = useState('');
  const searchResults = useSearch(searchInput);

  const { data, isLoading, isError, refetch } = useGetPopulationTimeseries({
    locations: selectedLocations.join(','),
    type: 'auto',
    variant
  });

  const addLocation = (loc: string) => {
    if (!selectedLocations.includes(loc) && selectedLocations.length < 5) {
      setSelectedLocations([...selectedLocations, loc]);
    }
    setSearchInput('');
  };

  const removeLocation = (loc: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== loc));
  };

  // Transform data for recharts
  const chartData = useMemo(() => {
    if (!data?.locations) return [];
    
    // Assumes all locations have same years. We pivot it.
    const yearMap = new Map<number, any>();
    
    data.locations.forEach((loc) => {
      loc.data.forEach(pt => {
        const entry = yearMap.get(pt.year) || { year: pt.year, isProjection: pt.isProjection };
        entry[loc.name] = pt.populationMillions;
        yearMap.set(pt.year, entry);
      });
    });

    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, [data]);

  return (
    <Layout>
      <div className="flex flex-col h-full gap-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Compare Growth</h1>
          <p className="text-muted-foreground mt-1">Compare population timeseries for up to 5 countries.</p>
        </div>

        {/* Controls */}
        <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Add country (e.g. Brazil, Japan)..." 
              className="w-full bg-background/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput.trim()) {
                  addLocation(searchInput.trim());
                }
              }}
            />
            {searchInput && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-lg p-2 z-50 shadow-xl">
                {searchResults.filter(r => !selectedLocations.includes(r.name)).slice(0, 8).map(result => (
                  <button key={result.name} onClick={() => addLocation(result.name)} className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-md transition-colors flex items-center justify-between gap-2">
                    <span className="text-white font-medium">{result.name}</span>
                    <span className="text-xs text-muted-foreground">{result.type === 'city' ? '🏙️' : '🌍'} {result.continent}</span>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <div className="px-4 py-2 text-muted-foreground text-sm">No results for "{searchInput}"</div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {selectedLocations.map((loc, i) => (
              <span key={loc} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-background/50" style={{ borderLeftColor: COLORS[i % COLORS.length], borderLeftWidth: 4 }}>
                <span className="text-sm font-medium">{loc}</span>
                <button onClick={() => removeLocation(loc)} className="hover:text-destructive transition-colors"><X className="w-4 h-4" /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 glass-panel rounded-2xl p-6 min-h-[400px]">
          {isLoading ? (
            <LoadingScreen message="Loading Timeseries Data..." />
          ) : isError ? (
            <ErrorState error={null} retry={() => refetch()} />
          ) : selectedLocations.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Please select at least one location to compare.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="rgba(255,255,255,0.4)" 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
                  tickMargin={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.4)" 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} 
                  tickFormatter={(val) => formatPopulation(val)}
                  width={60}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(3,7,18,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value: number) => [formatPopulation(value), undefined]}
                  labelStyle={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                <ReferenceLine x={2026} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Projection Starts', fill: '#f59e0b', fontSize: 10 }} />

                {data?.locations.map((loc, i) => (
                  <Line 
                    key={loc.name}
                    type="monotone" 
                    dataKey={loc.name} 
                    stroke={COLORS[i % COLORS.length]} 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Layout>
  );
}
