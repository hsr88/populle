import { Layout } from '@/components/layout/Layout';
import { usePopulationState } from '@/context/PopulationContext';
import { useGetPopulationSummary, useGetCountryPopulation } from '@workspace/api-client-react';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { formatPopulation, formatLargeNumber } from '@/lib/utils';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip as RechartsTooltip, Legend,
} from 'recharts';
import {
  Globe2, Users, Building, MapPin, AlertTriangle,
  TrendingUp, TrendingDown, Minus, Clock, Trees,
  Lightbulb, RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { getRandomFact } from '@/data/funFacts';
import { formatYearFull, isAncient } from '@/lib/timeUtils';
import { getFlagUrl } from '@/lib/countryUtils';

const PIE_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

function getPrevYear(year: number): number {
  if (year >= 1950) return Math.max(1950, year - 5);
  if (year >= 1800) return Math.max(1800, year - 10);
  return Math.max(-10000, year - 100);
}

export default function Stats() {
  const { year } = usePopulationState();
  const ancient = isAncient(year);
  const prevYear = getPrevYear(year);
  const period = Math.max(1, year - prevYear);
  const [randomFact, setRandomFact] = useState(getRandomFact());
  const [isSpinning, setIsSpinning] = useState(false);
  
  const refreshFact = () => {
    setIsSpinning(true);
    setRandomFact(getRandomFact());
    setTimeout(() => setIsSpinning(false), 500);
  };

  const { data, isLoading, isError, refetch } = useGetPopulationSummary({ year });
  const { data: prevData } = useGetPopulationSummary({ year: prevYear });
  const { data: countriesData } = useGetCountryPopulation({ year });

  if (isLoading) return <Layout><LoadingScreen message="Aggregating World Stats..." /></Layout>;
  if (isError) return <Layout><ErrorState error={null} retry={() => refetch()} /></Layout>;

  // --- Derived values ---
  const worldM = data?.worldPopulationMillions ?? 0;
  const prevM = prevData?.worldPopulationMillions ?? 0;

  const growthTotalM = prevM > 0 ? worldM - prevM : null;
  const growthPerYearM = growthTotalM != null ? growthTotalM / period : null;
  const growthPct = (growthTotalM != null && prevM > 0) ? (growthTotalM / prevM) * 100 : null;
  const growthPctPerYear = growthPct != null ? growthPct / period : null;

  const urbanM = worldM * ((data?.urbanPopulationPercent ?? 0) / 100);
  const ruralM = worldM - urbanM;
  const urbanPct = data?.urbanPopulationPercent ?? 0;

  const currentBillions = Math.floor(worldM / 1000);
  const nextBillionM = (currentBillions + 1) * 1000;
  const neededM = nextBillionM - worldM;
  let yearsToNextB: number | null = null;
  let nextBLabel = `${currentBillions + 1}B`;
  if (growthPerYearM != null && growthPerYearM > 0) {
    yearsToNextB = Math.round(neededM / growthPerYearM);
  } else if (growthPerYearM != null && growthPerYearM < 0) {
    yearsToNextB = null; // declining — never reaches next billion
  }

  // Top 5 countries
  const top5 = (countriesData?.data ?? [])
    .slice()
    .sort((a, b) => b.population - a.population)
    .slice(0, 5);

  const pieData = data?.continentBreakdown.map(c => ({
    name: c.continent,
    value: c.populationMillions,
  })) || [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Global Dashboard</h1>
          <p className="text-muted-foreground mt-1">World demographic overview for {formatYearFull(year)}</p>
        </div>

        {/* Did You Know? */}
        <div className="glass-panel rounded-xl p-4 border-l-4 border-accent">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-accent mb-1">Did you know?</h3>
                <button
                  onClick={refreshFact}
                  className="p-1.5 rounded-lg hover:bg-accent/10 text-accent/60 hover:text-accent transition-colors"
                  title="New fact"
                >
                  <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {randomFact}
              </p>
            </div>
          </div>
        </div>

        {ancient && (
          <div className="flex items-start gap-3 glass-panel p-4 rounded-xl border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-amber-400 font-semibold text-sm">Ancient era estimates — </span>
              <span className="text-muted-foreground text-sm">
                Data before 1800 CE comes from HYDE 3.3, McEvedy &amp; Jones, and Maddison Project.
                Uncertainty ranges from ±30% (medieval) to ±100% (prehistoric).
              </span>
            </div>
          </div>
        )}

        {/* ── Row 1: 6 Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* World Population */}
          <StatCard
            title="World Population"
            value={data ? formatPopulation(worldM) : '-'}
            subtitle={`${data ? formatLargeNumber(data.worldPopulation) : '-'} thousand`}
            icon={Globe2}
            color="text-primary"
            bg="bg-primary/10"
          />

          {/* Annual Growth */}
          <StatCard
            title="Annual Growth"
            value={
              growthPerYearM != null
                ? `${growthPerYearM > 0 ? '+' : ''}${formatPopulation(Math.abs(growthPerYearM))}`
                : '–'
            }
            subtitle={
              growthPctPerYear != null
                ? `${growthPctPerYear > 0 ? '+' : ''}${growthPctPerYear.toFixed(2)}% / year`
                : 'Not enough data'
            }
            icon={
              growthPerYearM == null ? Minus
              : growthPerYearM >= 0 ? TrendingUp
              : TrendingDown
            }
            color={
              growthPerYearM == null ? 'text-muted-foreground'
              : growthPerYearM >= 0 ? 'text-emerald-400'
              : 'text-red-400'
            }
            bg={
              growthPerYearM == null ? 'bg-white/5'
              : growthPerYearM >= 0 ? 'bg-emerald-400/10'
              : 'bg-red-400/10'
            }
          />

          {/* Time to Next Billion */}
          <StatCard
            title={`Until ${nextBLabel}`}
            value={
              growthPerYearM == null ? '–'
              : growthPerYearM <= 0 ? '∞'
              : yearsToNextB != null ? `~${yearsToNextB} yr`
              : '–'
            }
            subtitle={
              growthPerYearM != null && growthPerYearM <= 0
                ? 'Population declining'
                : yearsToNextB != null
                  ? `~${Math.round((year + (yearsToNextB ?? 0)))} CE`
                  : 'Based on current rate'
            }
            icon={Clock}
            color="text-amber-400"
            bg="bg-amber-400/10"
          />

          {/* Urbanization */}
          <StatCard
            title="Urbanization"
            value={`${urbanPct.toFixed(1)}%`}
            subtitle="Living in urban areas"
            icon={Building}
            color="text-accent"
            bg="bg-accent/10"
          />

          {/* Largest Country */}
          <StatCard
            title={ancient ? 'Dominant Region' : 'Largest Country'}
            value={data?.largestCountry || '-'}
            subtitle={ancient ? 'Historical estimate' : 'By population volume'}
            icon={Users}
            color="text-pink-500"
            bg="bg-pink-500/10"
          />

          {/* Largest City */}
          <StatCard
            title={ancient ? 'Largest Known City' : 'Largest City'}
            value={data?.largestCity || '-'}
            subtitle={ancient ? 'Historical estimate' : 'Metropolitan area'}
            icon={MapPin}
            color="text-purple-500"
            bg="bg-purple-500/10"
          />
        </div>

        {/* ── Row 2: Urban vs Rural ── */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Urban vs Rural Population</h3>
            <span className="text-xs text-muted-foreground">{formatYearFull(year)}</span>
          </div>
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">{formatPopulation(urbanM)}</div>
                <div className="text-[11px] text-muted-foreground">Urban ({urbanPct.toFixed(1)}%)</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">{formatPopulation(ruralM)}</div>
                <div className="text-[11px] text-muted-foreground">Rural ({(100 - urbanPct).toFixed(1)}%)</div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-muted-foreground">
                {urbanPct > 50
                  ? `Majority urban since ~1960`
                  : `Rural majority era`}
              </span>
            </div>
          </div>
          {/* Stacked bar */}
          <div className="w-full h-6 rounded-full overflow-hidden flex bg-background/50 border border-white/5">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out flex items-center justify-center"
              style={{ width: `${urbanPct}%` }}
            >
              {urbanPct > 12 && (
                <span className="text-[10px] font-bold text-white/80 px-1 truncate">
                  {urbanPct.toFixed(0)}% Urban
                </span>
              )}
            </div>
            <div
              className="h-full bg-emerald-600 transition-all duration-700 ease-out flex items-center justify-center flex-1"
            >
              {(100 - urbanPct) > 12 && (
                <span className="text-[10px] font-bold text-white/80 px-1 truncate">
                  {(100 - urbanPct).toFixed(0)}% Rural
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Row 3: Charts + Top 5 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Pie Chart */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col">
            <h3 className="text-lg font-bold mb-4">Population by Continent</h3>
            <div className="flex-1 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => [formatPopulation(value), 'Population']}
                    contentStyle={{ backgroundColor: 'rgba(3,7,18,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Continent Breakdown */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">Continent Breakdown</h3>
            <div className="space-y-3.5">
              {data?.continentBreakdown
                .slice()
                .sort((a, b) => b.populationMillions - a.populationMillions)
                .map((c, i) => (
                  <div key={c.continent}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-white">{c.continent}</span>
                      <span className="text-primary font-display">
                        {formatPopulation(c.populationMillions)}
                        <span className="text-muted-foreground ml-1 text-xs">({c.share.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2 border border-white/5 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${c.share}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top 5 Countries */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">
              {ancient ? 'Estimated Top Regions' : 'Top 5 Countries'}
            </h3>
            {top5.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                No country data for this era
              </div>
            ) : (
              <div className="space-y-3">
                {top5.map((country, i) => {
                  const sharePct = worldM > 0 ? (country.populationMillions / worldM) * 100 : 0;
                  return (
                    <div key={country.iso3} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-4 text-right shrink-0">
                        {i + 1}
                      </span>
                      <img
                        src={getFlagUrl(country.iso3)}
                        alt={country.name}
                        className="w-7 h-[18px] object-cover rounded-sm shrink-0 border border-white/10"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="text-sm font-semibold text-white truncate">{country.name}</span>
                          <span className="text-xs text-primary font-bold ml-2 shrink-0">
                            {formatPopulation(country.populationMillions)}
                          </span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-1.5 border border-white/5 overflow-hidden">
                          <div
                            className="h-1.5 rounded-full bg-primary/70"
                            style={{ width: `${sharePct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{sharePct.toFixed(1)}% of world</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className="glass-panel-hover glass-panel p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <p className="text-muted-foreground font-medium text-xs tracking-wider uppercase leading-tight">{title}</p>
        <div className={`p-1.5 rounded-lg shrink-0 ${bg} ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <h3 className={`text-2xl lg:text-3xl font-display font-bold text-glow leading-none ${color}`}>{value}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-tight">{subtitle}</p>
      </div>
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  );
}
