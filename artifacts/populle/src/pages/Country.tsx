import { useMemo } from 'react';
import { useParams, Link } from 'wouter';
import { Layout } from '@/components/layout/Layout';
import { usePopulationState } from '@/context/PopulationContext';
import { useGetCountryPopulation, useGetPopulationTimeseries } from '@workspace/api-client-react';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { formatPopulation, formatLargeNumber } from '@/lib/utils';
import { SEO, generateDatasetJsonLd } from '@/components/SEO';
import { formatYearFull } from '@/lib/timeUtils';
import { getFlagUrl } from '@/lib/countryUtils';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar,
} from 'recharts';
import {
  Globe2, Users, MapPin, TrendingUp, TrendingDown, Minus,
  Building, ArrowLeft, Calendar, Ruler, BarChart2,
} from 'lucide-react';
import { ShareButton } from '@/components/share/ShareButton';
import { buildCountryUrl } from '@/lib/share';

const COUNTRY_EXTRAS: Record<string, { capital: string; area: number }> = {
  CHN: { capital: 'Beijing', area: 9_596_960 },
  IND: { capital: 'New Delhi', area: 3_287_263 },
  USA: { capital: 'Washington D.C.', area: 9_629_091 },
  IDN: { capital: 'Jakarta', area: 1_904_569 },
  PAK: { capital: 'Islamabad', area: 796_095 },
  BRA: { capital: 'Brasília', area: 8_514_877 },
  NGA: { capital: 'Abuja', area: 923_768 },
  BGD: { capital: 'Dhaka', area: 147_570 },
  RUS: { capital: 'Moscow', area: 17_098_242 },
  MEX: { capital: 'Mexico City', area: 1_964_375 },
  JPN: { capital: 'Tokyo', area: 377_930 },
  DEU: { capital: 'Berlin', area: 357_114 },
  GBR: { capital: 'London', area: 243_610 },
  FRA: { capital: 'Paris', area: 643_801 },
  ITA: { capital: 'Rome', area: 301_340 },
  KOR: { capital: 'Seoul', area: 100_210 },
  ESP: { capital: 'Madrid', area: 505_990 },
  CAN: { capital: 'Ottawa', area: 9_984_670 },
  AUS: { capital: 'Canberra', area: 7_692_024 },
  ARG: { capital: 'Buenos Aires', area: 2_780_400 },
  ZAF: { capital: 'Pretoria', area: 1_219_090 },
  EGY: { capital: 'Cairo', area: 1_001_450 },
  TUR: { capital: 'Ankara', area: 783_562 },
  IRN: { capital: 'Tehran', area: 1_648_195 },
  THA: { capital: 'Bangkok', area: 513_120 },
  POL: { capital: 'Warsaw', area: 312_679 },
  COL: { capital: 'Bogotá', area: 1_141_748 },
  SAU: { capital: 'Riyadh', area: 2_149_690 },
  MYS: { capital: 'Kuala Lumpur', area: 329_847 },
  PER: { capital: 'Lima', area: 1_285_216 },
  VNM: { capital: 'Hanoi', area: 331_210 },
  PHL: { capital: 'Manila', area: 300_000 },
  ETH: { capital: 'Addis Ababa', area: 1_104_300 },
  COD: { capital: 'Kinshasa', area: 2_344_858 },
  KEN: { capital: 'Nairobi', area: 580_367 },
  TZA: { capital: 'Dodoma', area: 945_087 },
  UKR: { capital: 'Kyiv', area: 603_550 },
  IRQ: { capital: 'Baghdad', area: 438_317 },
  AFG: { capital: 'Kabul', area: 652_230 },
  MMR: { capital: 'Naypyidaw', area: 676_578 },
  NLD: { capital: 'Amsterdam', area: 41_543 },
  CHE: { capital: 'Bern', area: 41_285 },
  SWE: { capital: 'Stockholm', area: 450_295 },
  NOR: { capital: 'Oslo', area: 323_802 },
};

export default function Country() {
  const { iso3 } = useParams<{ iso3: string }>();
  const { year, variant } = usePopulationState();
  
  const { data: countriesData, isLoading, isError, refetch } = useGetCountryPopulation({ year, variant });
  const { data: data2050 } = useGetCountryPopulation({ year: 2050, variant });
  const { data: tsData } = useGetPopulationTimeseries({
    locations: countriesData?.data?.find(c => c.iso3 === iso3?.toUpperCase())?.name || '',
    type: 'country',
    variant,
  });

  const country = useMemo(() => 
    countriesData?.data?.find(c => c.iso3 === iso3?.toUpperCase()),
  [countriesData, iso3]);

  const country2050 = useMemo(() =>
    data2050?.data?.find(c => c.iso3 === iso3?.toUpperCase()),
  [data2050, iso3]);

  const worldTotal = useMemo(() =>
    countriesData?.data?.reduce((sum, c) => sum + c.population, 0) || 0,
  [countriesData]);

  const rank = useMemo(() => {
    if (!countriesData?.data || !country) return null;
    const sorted = [...countriesData.data].sort((a, b) => b.population - a.population);
    return sorted.findIndex(c => c.iso3 === country.iso3) + 1;
  }, [countriesData, country]);

  const chartData = useMemo(() => {
    if (!tsData?.locations?.[0]?.data) return [];
    return tsData.locations[0].data.map((pt: any) => ({
      year: pt.year,
      population: pt.populationMillions,
      isProjection: pt.isProjection,
    }));
  }, [tsData]);

  if (isLoading) return <Layout><LoadingScreen message="Loading Country Data..." /></Layout>;
  if (isError) return <Layout><ErrorState error={null} retry={() => refetch()} /></Layout>;
  
  if (!country) {
    return (
      <Layout hideYearSlider>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Globe2 className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Country Not Found</h1>
          <p className="text-muted-foreground">The country with code "{iso3}" was not found.</p>
          <Link href="/map" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Map
          </Link>
        </div>
      </Layout>
    );
  }

  const extras = COUNTRY_EXTRAS[country.iso3];
  const worldShare = worldTotal > 0 ? (country.population / worldTotal * 100) : 0;
  const projection2050 = country2050 
    ? ((country2050.populationMillions - country.populationMillions) / country.populationMillions * 100)
    : null;
  const density = extras?.area ? Math.round(country.population * 1000 / extras.area) : country.density;

  return (
    <Layout>
      <SEO
        title={`${country.name} Population ${year} | ${formatPopulation(country.populationMillions)} | Populle`}
        description={`${country.name} population in ${year}: ${formatPopulation(country.populationMillions)}. Explore historical data, future projections, density (${density}/km²), growth trends, and compare with other countries.`}
        keywords={`${country.name} population, ${country.name} demographics, ${country.name} population ${year}, ${country.continent} population`}
        path={`/country/${country.iso3.toLowerCase()}`}
        jsonLd={generateDatasetJsonLd(
          `${country.name} Population Data`,
          `Population statistics for ${country.name} from 1800 to 2100, including historical data and UN projections`
        )}
      />

      <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-32">
        {/* Back link */}
        <Link href="/map" className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Map
        </Link>

        {/* Hero Section */}
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Flag & Basic Info */}
            <div className="flex items-start gap-4 md:gap-6">
              <img
                src={getFlagUrl(country.iso3)}
                alt={`${country.name} flag`}
                className="w-24 h-16 md:w-32 md:h-20 object-cover rounded-lg border border-white/10 shadow-lg"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold">{country.name}</h1>
                  {rank && (
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">
                      #{rank} in world
                    </span>
                  )}
                  <ShareButton
                    title={`${country.name} population — Populle`}
                    text={`${country.name}: ${formatPopulation(country.populationMillions)} people in ${year}. Explore on Populle.`}
                    url={buildCountryUrl(country.iso3)}
                    variant="ghost"
                    size="sm"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {country.continent}
                  </span>
                  {extras?.capital && (
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4 h-4" />
                      {extras.capital}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatYearFull(year)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatBox
              label="Population"
              value={formatPopulation(country.populationMillions)}
              subValue={`${formatLargeNumber(country.population)} thousand`}
              icon={Users}
              color="text-primary"
            />
            <StatBox
              label="World Share"
              value={`${worldShare.toFixed(2)}%`}
              subValue={`of ${formatPopulation(worldTotal / 1000)} total`}
              icon={Globe2}
              color="text-accent"
            />
            <StatBox
              label="Density"
              value={`${density?.toLocaleString() || '–'}/km²`}
              subValue={extras?.area ? `${extras.area.toLocaleString()} km² area` : 'Area not available'}
              icon={Ruler}
              color="text-amber-400"
            />
            <StatBox
              label="Growth Rate"
              value={country.growthRate != null ? `${country.growthRate > 0 ? '+' : ''}${country.growthRate.toFixed(2)}%` : '–'}
              subValue="Annual change"
              icon={country.growthRate == null ? Minus : country.growthRate >= 0 ? TrendingUp : TrendingDown}
              color={country.growthRate == null ? 'text-muted-foreground' : country.growthRate >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
          </div>
        </div>

        {/* Population Trend Chart */}
        {chartData.length > 0 && (
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Population History & Projections</h2>
                <p className="text-sm text-muted-foreground mt-1">From 1800 to 2100 (millions)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary rounded" />
                  Historical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary/50 rounded" style={{ borderStyle: 'dashed' }} />
                  Projection
                </span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
                    stroke="rgba(6,182,212,0.6)"
                    strokeDasharray="4 2"
                    label={{ value: String(year), position: 'top', fontSize: 10, fill: '#06b6d4' }}
                  />
                  <ReferenceLine
                    x={2025}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="2 2"
                  />
                  <Area
                    type="monotone"
                    dataKey="population"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#popGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#06b6d4' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2050 Projection Card */}
        {projection2050 != null && (
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">2050 Projection</h2>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-white">
                    {formatPopulation(country2050?.populationMillions || 0)}
                  </span>
                  <span className={`flex items-center gap-1 text-lg font-bold ${projection2050 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {projection2050 >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {projection2050 >= 0 ? '+' : ''}{projection2050.toFixed(1)}%
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {projection2050 >= 0 
                    ? `Expected to grow by ${formatPopulation(Math.abs((country2050?.populationMillions || 0) - country.populationMillions))} from ${year}`
                    : `Expected to decline by ${formatPopulation(Math.abs((country2050?.populationMillions || 0) - country.populationMillions))} from ${year}`
                  }
                </p>
              </div>
              <div className="hidden md:block">
                <BarChart2 className="w-16 h-16 text-primary/30" />
              </div>
            </div>
          </div>
        )}

        {/* Related Countries */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Countries in {country.continent}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {countriesData?.data
              ?.filter(c => c.continent === country.continent && c.iso3 !== country.iso3)
              .sort((a, b) => b.population - a.population)
              .slice(0, 8)
              .map(c => (
                <Link
                  key={c.iso3}
                  href={`/country/${c.iso3.toLowerCase()}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all"
                >
                  <img
                    src={getFlagUrl(c.iso3)}
                    alt={c.name}
                    className="w-8 h-5 object-cover rounded-sm border border-white/10"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{formatPopulation(c.populationMillions)}</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Compare CTA */}
        <div className="glass-panel rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Compare {country.name}</h2>
          <p className="text-muted-foreground mb-4">See how {country.name}'s population compares to other countries over time</p>
          <Link
            href={`/compare?locations=${encodeURIComponent(country.name)}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            Compare Population
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function StatBox({
  label,
  value,
  subValue,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{subValue}</div>
    </div>
  );
}
