import { useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { usePopulationState } from '@/context/PopulationContext';
import { useGetCityPopulation, useGetPopulationTimeseries } from '@workspace/api-client-react';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { formatPopulation } from '@/lib/utils';
import { SEO, generateDatasetJsonLd } from '@/components/SEO';
import { formatYearFull } from '@/lib/timeUtils';
import { getFlagUrl, getIso3FromCountryName } from '@/lib/countryUtils';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Building2, Users, MapPin, TrendingUp, TrendingDown, Minus,
  ArrowLeft, Calendar, Globe2, BarChart2, Sparkles,
} from 'lucide-react';
import { ShareButton } from '@/components/share/ShareButton';
import { buildCityUrl } from '@/lib/share';

export default function City() {
  const { slug } = useParams<{ slug: string }>();
  const { year } = usePopulationState();
  
  const { data: citiesData, isLoading, isError, refetch } = useGetCityPopulation({ year, limit: 100 });
  const { data: data2050 } = useGetCityPopulation({ year: 2050, limit: 100 });

  const city = useMemo(() => {
    if (!citiesData?.data || !slug) return null;
    const normalizedSlug = slug.toLowerCase().replace(/-/g, ' ');
    return citiesData.data.find(c => 
      c.name.toLowerCase() === normalizedSlug ||
      c.id === slug ||
      c.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
    );
  }, [citiesData, slug]);

  const { data: tsData } = useGetPopulationTimeseries({
    locations: city?.name || '',
    type: 'city',
  });

  const city2050 = useMemo(() => {
    if (!data2050?.data || !city) return null;
    return data2050.data.find(c => c.name === city.name);
  }, [data2050, city]);

  const rank = useMemo(() => {
    if (!citiesData?.data || !city) return null;
    const sorted = [...citiesData.data].sort((a, b) => b.population - a.population);
    return sorted.findIndex(c => c.name === city.name) + 1;
  }, [citiesData, city]);

  const chartData = useMemo(() => {
    if (!tsData?.locations?.[0]?.data) return [];
    return tsData.locations[0].data.map((pt: any) => ({
      year: pt.year,
      population: pt.populationMillions,
      isProjection: pt.isProjection,
    }));
  }, [tsData]);

  const similarCities = useMemo(() => {
    if (!citiesData?.data || !city) return [];
    return citiesData.data
      .filter(c => c.continent === city.continent && c.name !== city.name)
      .sort((a, b) => b.population - a.population)
      .slice(0, 6);
  }, [citiesData, city]);

  if (isLoading) return <Layout><LoadingScreen message="Loading City Data..." /></Layout>;
  if (isError) return <Layout><ErrorState error={null} retry={() => refetch()} /></Layout>;
  
  if (!city) {
    return (
      <Layout hideYearSlider>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Building2 className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">City Not Found</h1>
          <p className="text-muted-foreground">The city "{slug}" was not found in our database.</p>
          <Link href="/cities" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Cities
          </Link>
        </div>
      </Layout>
    );
  }

  const projection2050 = city2050 
    ? ((city2050.populationMillions - city.populationMillions) / city.populationMillions * 100)
    : null;
  
  const isMegacity = city.populationMillions >= 10;
  const countryIso3 = getIso3FromCountryName(city.country);

  return (
    <Layout>
      <SEO
        title={`${city.name} Population ${year} | ${formatPopulation(city.populationMillions)} | Populle`}
        description={`${city.name}, ${city.country} population in ${year}: ${formatPopulation(city.populationMillions)}. ${isMegacity ? 'One of the world\'s megacities. ' : ''}Explore historical data, growth trends, and future projections.`}
        keywords={`${city.name} population, ${city.name} demographics, ${city.country} cities, ${city.continent} cities, ${isMegacity ? 'megacity, ' : ''}urban population`}
        path={`/city/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
        jsonLd={generateDatasetJsonLd(
          `${city.name} Population Data`,
          `Population statistics for ${city.name}, ${city.country} from 1950 to 2100`
        )}
      />

      <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-32">
        {/* Back link */}
        <Link href="/cities" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Cities
        </Link>

        {/* Hero Section */}
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* City Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {isMegacity && (
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Megacity
                  </span>
                )}
                {rank && rank <= 20 && (
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">
                    #{rank} Largest City
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold">{city.name}</h1>
                <ShareButton
                  title={`${city.name} population — Populle`}
                  text={`${city.name}, ${city.country}: ${formatPopulation(city.populationMillions)}. Explore on Populle.`}
                  url={buildCityUrl(city.name)}
                  variant="ghost"
                  size="sm"
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  {countryIso3 && (
                    <img
                      src={getFlagUrl(countryIso3)}
                      alt={city.country}
                      className="w-5 h-3.5 object-cover rounded-sm border border-white/10"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  {city.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4" />
                  {city.continent}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatYearFull(year)}
                </span>
              </div>
            </div>

            {/* Main Population Stat */}
            <div className="flex flex-col items-end justify-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Population</div>
              <div className="text-4xl md:text-5xl font-bold text-primary text-glow">
                {formatPopulation(city.populationMillions)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {city.urbanizationLevel === 'megacity' ? '10M+ metro' : 
                 city.urbanizationLevel === 'large' ? '5-10M metro' :
                 city.urbanizationLevel === 'medium' ? '1-5M metro' : '<1M metro'}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatBox
              label="World Rank"
              value={rank ? `#${rank}` : '–'}
              icon={BarChart2}
              color="text-primary"
            />
            <StatBox
              label="Metro Type"
              value={city.urbanizationLevel || 'Unknown'}
              icon={Building2}
              color="text-accent"
            />
            <StatBox
              label="Country"
              value={city.country}
              icon={MapPin}
              color="text-amber-400"
            />
            <StatBox
              label="2050 Change"
              value={projection2050 != null ? `${projection2050 >= 0 ? '+' : ''}${projection2050.toFixed(1)}%` : '–'}
              icon={projection2050 == null ? Minus : projection2050 >= 0 ? TrendingUp : TrendingDown}
              color={projection2050 == null ? 'text-muted-foreground' : projection2050 >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
          </div>
        </div>

        {/* Population Trend Chart */}
        {chartData.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Population History & Projections</h2>
                <p className="text-sm text-muted-foreground mt-1">From 1950 to 2100 (millions)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-accent rounded" />
                  Historical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-accent/50 rounded" />
                  Projection
                </span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}M`}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value.toFixed(1)}M`, 'Population']}
                    contentStyle={{
                      backgroundColor: 'rgba(3,7,18,0.95)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: 12,
                    }}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <ReferenceLine
                    x={year}
                    stroke="rgba(245,158,11,0.6)"
                    strokeDasharray="4 2"
                    label={{ value: String(year), position: 'top', fontSize: 10, fill: '#f59e0b' }}
                  />
                  <ReferenceLine
                    x={2025}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="2 2"
                  />
                  <Area
                    type="monotone"
                    dataKey="population"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#cityGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#f59e0b' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2050 Projection Card */}
        {projection2050 != null && city2050 && (
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">2050 Projection</h2>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-white">
                    {formatPopulation(city2050.populationMillions)}
                  </span>
                  <span className={`flex items-center gap-1 text-lg font-bold ${projection2050 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {projection2050 >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {projection2050 >= 0 ? '+' : ''}{projection2050.toFixed(1)}%
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {projection2050 >= 0 
                    ? `${city.name} is projected to grow by ${formatPopulation(Math.abs(city2050.populationMillions - city.populationMillions))} by 2050`
                    : `${city.name} is projected to decline by ${formatPopulation(Math.abs(city2050.populationMillions - city.populationMillions))} by 2050`
                  }
                </p>
              </div>
              <div className="hidden md:block">
                <Building2 className="w-16 h-16 text-accent/30" />
              </div>
            </div>
          </div>
        )}

        {/* Cities in Same Region */}
        {similarCities.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Other Cities in {city.continent}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {similarCities.map(c => (
                <Link
                  key={c.id}
                  href={`/city/${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.country} · {formatPopulation(c.populationMillions)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* View Country CTA */}
        {countryIso3 && (
          <div className="glass-panel rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Explore {city.country}</h2>
            <p className="text-muted-foreground mb-4">See country-level population data and compare with other nations</p>
            <Link
              href={`/country/${countryIso3.toLowerCase()}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Globe2 className="w-4 h-4" />
              View {city.country}
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatBox({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-xl font-bold ${color} capitalize`}>{value}</div>
    </div>
  );
}
