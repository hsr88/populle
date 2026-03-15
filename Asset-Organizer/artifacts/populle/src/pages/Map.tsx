import { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePopulationState } from '@/context/PopulationContext';
import { useGetCountryPopulation } from '@workspace/api-client-react';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { formatPopulation } from '@/lib/utils';
import { scaleSequential, scaleLog } from 'd3-scale';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Sphere } from "react-simple-maps";
import { AncientEraPanel } from '@/components/ui/AncientEraPanel';
import { isAncient, formatYearFull } from '@/lib/timeUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Globe2, Users, BarChart2, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import { getFlagUrl } from '@/lib/countryUtils';

type MapMode = 'population' | 'density';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Capital cities and area (km²) for all tracked countries
const COUNTRY_EXTRAS: Record<string, { capital: string; area: number }> = {
  CHN: { capital: 'Beijing',        area: 9_596_960 },
  IND: { capital: 'New Delhi',      area: 3_287_263 },
  USA: { capital: 'Washington D.C.', area: 9_629_091 },
  IDN: { capital: 'Jakarta',        area: 1_904_569 },
  PAK: { capital: 'Islamabad',      area:   796_095 },
  BRA: { capital: 'Brasília',       area: 8_514_877 },
  NGA: { capital: 'Abuja',          area:   923_768 },
  BGD: { capital: 'Dhaka',          area:   147_570 },
  ETH: { capital: 'Addis Ababa',    area: 1_104_300 },
  RUS: { capital: 'Moscow',         area: 17_098_242 },
  MEX: { capital: 'Mexico City',    area: 1_964_375 },
  COD: { capital: 'Kinshasa',       area: 2_344_858 },
  DEU: { capital: 'Berlin',         area:   357_114 },
  GBR: { capital: 'London',         area:   243_610 },
  FRA: { capital: 'Paris',          area:   643_801 },
  JPN: { capital: 'Tokyo',          area:   377_930 },
  KEN: { capital: 'Nairobi',        area:   580_367 },
  TZA: { capital: 'Dodoma',         area:   945_087 },
  SAU: { capital: 'Riyadh',         area: 2_149_690 },
  EGY: { capital: 'Cairo',          area: 1_001_450 },
  ZAF: { capital: 'Pretoria',       area: 1_219_090 },
  ARG: { capital: 'Buenos Aires',   area: 2_780_400 },
  CAN: { capital: 'Ottawa',         area: 9_984_670 },
  AUS: { capital: 'Canberra',       area: 7_692_024 },
  KOR: { capital: 'Seoul',          area:   100_210 },
  THA: { capital: 'Bangkok',        area:   513_120 },
  IRN: { capital: 'Tehran',         area: 1_648_195 },
  POL: { capital: 'Warsaw',         area:   312_679 },
  UKR: { capital: 'Kyiv',           area:   603_550 },
  COL: { capital: 'Bogotá',         area: 1_141_748 },
  ESP: { capital: 'Madrid',         area:   505_990 },
  ITA: { capital: 'Rome',           area:   301_340 },
  MAR: { capital: 'Rabat',          area:   446_550 },
  PER: { capital: 'Lima',           area: 1_285_216 },
  VNM: { capital: 'Hanoi',          area:   331_210 },
  GHA: { capital: 'Accra',          area:   238_533 },
  SDN: { capital: 'Khartoum',       area: 1_861_484 },
  MYS: { capital: 'Kuala Lumpur',   area:   329_847 },
  AGO: { capital: 'Luanda',         area: 1_246_700 },
  PHL: { capital: 'Manila',         area:   300_000 },
  CMR: { capital: 'Yaoundé',        area:   475_442 },
  SWE: { capital: 'Stockholm',      area:   450_295 },
  NOR: { capital: 'Oslo',           area:   323_802 },
  CHE: { capital: 'Bern',           area:    41_285 },
  NLD: { capital: 'Amsterdam',      area:    41_543 },
  TUR: { capital: 'Ankara',          area:   783_562 },
  MMR: { capital: 'Naypyidaw',      area:   676_578 },
  AFG: { capital: 'Kabul',          area:   652_230 },
  UGA: { capital: 'Kampala',        area:   241_038 },
  IRQ: { capital: 'Baghdad',        area:   438_317 },
  // Africa (additional)
  DZA: { capital: 'Algiers',        area: 2_381_741 },
  TUN: { capital: 'Tunis',          area:   163_610 },
  LBY: { capital: 'Tripoli',        area: 1_759_540 },
  SOM: { capital: 'Mogadishu',      area:   637_657 },
  MLI: { capital: 'Bamako',         area: 1_240_192 },
  NER: { capital: 'Niamey',         area: 1_267_000 },
  BFA: { capital: 'Ouagadougou',    area:   274_200 },
  GIN: { capital: 'Conakry',        area:   245_857 },
  ZWE: { capital: 'Harare',         area:   390_757 },
  ZMB: { capital: 'Lusaka',         area:   752_612 },
  MOZ: { capital: 'Maputo',         area:   801_590 },
  MDG: { capital: 'Antananarivo',   area:   587_041 },
  SEN: { capital: 'Dakar',          area:   196_722 },
  RWA: { capital: 'Kigali',         area:    26_338 },
  BDI: { capital: 'Gitega',         area:    27_816 },
  TCD: { capital: "N'Djamena",      area: 1_284_000 },
  SLE: { capital: 'Freetown',       area:    71_740 },
  TGO: { capital: 'Lomé',           area:    56_785 },
  BEN: { capital: 'Porto-Novo',     area:   112_622 },
  ERI: { capital: 'Asmara',         area:   117_600 },
  MWI: { capital: 'Lilongwe',       area:   118_484 },
  NAM: { capital: 'Windhoek',       area:   825_615 },
  BWA: { capital: 'Gaborone',       area:   581_730 },
  LBR: { capital: 'Monrovia',       area:   111_369 },
  COG: { capital: 'Brazzaville',    area:   342_000 },
  SSD: { capital: 'Juba',           area:   619_745 },
  CIV: { capital: 'Yamoussoukro',   area:   322_463 },
  GNB: { capital: 'Bissau',         area:    36_125 },
  GAB: { capital: 'Libreville',     area:   267_668 },
  GMB: { capital: 'Banjul',         area:    11_295 },
  CAF: { capital: 'Bangui',         area:   622_984 },
  MRT: { capital: 'Nouakchott',     area: 1_030_700 },
  LSO: { capital: 'Maseru',         area:    30_355 },
  SWZ: { capital: 'Mbabane',        area:    17_364 },
  DJI: { capital: 'Djibouti',       area:    23_200 },
  MUS: { capital: 'Port Louis',     area:     2_040 },
  COM: { capital: 'Moroni',         area:     2_235 },
  SYC: { capital: 'Victoria',       area:       459 },
  CPV: { capital: 'Praia',          area:     4_033 },
  GNQ: { capital: 'Malabo',         area:    28_051 },
  STP: { capital: 'São Tomé',       area:       964 },
  // Asia (additional)
  NPL: { capital: 'Kathmandu',      area:   147_181 },
  LKA: { capital: 'Sri Jayawardenepura Kotte', area: 65_610 },
  KHM: { capital: 'Phnom Penh',     area:   181_035 },
  LAO: { capital: 'Vientiane',      area:   236_800 },
  MNG: { capital: 'Ulaanbaatar',    area: 1_564_116 },
  PRK: { capital: 'Pyongyang',      area:   120_538 },
  KGZ: { capital: 'Bishkek',        area:   199_951 },
  TJK: { capital: 'Dushanbe',       area:   143_100 },
  TKM: { capital: 'Ashgabat',       area:   488_100 },
  UZB: { capital: 'Tashkent',       area:   448_978 },
  KAZ: { capital: 'Astana',         area: 2_724_900 },
  ARM: { capital: 'Yerevan',        area:    29_743 },
  AZE: { capital: 'Baku',           area:    86_600 },
  GEO: { capital: 'Tbilisi',        area:    69_700 },
  LBN: { capital: 'Beirut',         area:    10_452 },
  JOR: { capital: 'Amman',          area:    89_342 },
  SYR: { capital: 'Damascus',       area:   185_180 },
  ISR: { capital: 'Jerusalem',      area:    22_072 },
  YEM: { capital: "Sana'a",         area:   527_968 },
  OMN: { capital: 'Muscat',         area:   309_500 },
  ARE: { capital: 'Abu Dhabi',      area:    83_600 },
  QAT: { capital: 'Doha',           area:    11_586 },
  KWT: { capital: 'Kuwait City',    area:    17_818 },
  BHR: { capital: 'Manama',         area:       778 },
  BTN: { capital: 'Thimphu',        area:    38_394 },
  MDV: { capital: 'Malé',           area:       298 },
  TLS: { capital: 'Dili',           area:    14_919 },
  SGP: { capital: 'Singapore',      area:       719 },
  // Europe (additional)
  ROU: { capital: 'Bucharest',      area:   238_397 },
  HUN: { capital: 'Budapest',       area:    93_028 },
  CZE: { capital: 'Prague',         area:    78_866 },
  SVK: { capital: 'Bratislava',     area:    49_035 },
  BGR: { capital: 'Sofia',          area:   110_879 },
  SRB: { capital: 'Belgrade',       area:    77_474 },
  HRV: { capital: 'Zagreb',         area:    56_594 },
  BIH: { capital: 'Sarajevo',       area:    51_209 },
  SVN: { capital: 'Ljubljana',      area:    20_271 },
  ALB: { capital: 'Tirana',         area:    28_748 },
  MKD: { capital: 'Skopje',         area:    25_713 },
  MNE: { capital: 'Podgorica',      area:    13_812 },
  MDA: { capital: 'Chișinău',       area:    33_851 },
  BLR: { capital: 'Minsk',          area:   207_600 },
  LTU: { capital: 'Vilnius',        area:    65_300 },
  LVA: { capital: 'Riga',           area:    64_589 },
  EST: { capital: 'Tallinn',        area:    45_228 },
  FIN: { capital: 'Helsinki',       area:   338_145 },
  DNK: { capital: 'Copenhagen',     area:    43_094 },
  AUT: { capital: 'Vienna',         area:    83_871 },
  PRT: { capital: 'Lisbon',         area:    92_212 },
  GRC: { capital: 'Athens',         area:   131_957 },
  IRL: { capital: 'Dublin',         area:    70_273 },
  BEL: { capital: 'Brussels',       area:    30_528 },
  LUX: { capital: 'Luxembourg City', area:    2_586 },
  ISL: { capital: 'Reykjavik',      area:   102_775 },
  MLT: { capital: 'Valletta',       area:       316 },
  CYP: { capital: 'Nicosia',        area:     9_241 },
  // North America (additional)
  GTM: { capital: 'Guatemala City', area:   108_889 },
  HND: { capital: 'Tegucigalpa',    area:   112_492 },
  SLV: { capital: 'San Salvador',   area:    20_720 },
  NIC: { capital: 'Managua',        area:   130_370 },
  CRI: { capital: 'San José',       area:    51_100 },
  PAN: { capital: 'Panama City',    area:    75_517 },
  CUB: { capital: 'Havana',         area:   109_884 },
  HTI: { capital: 'Port-au-Prince', area:    27_750 },
  DOM: { capital: 'Santo Domingo',  area:    48_671 },
  JAM: { capital: 'Kingston',       area:    10_990 },
  TTO: { capital: 'Port of Spain',  area:     5_131 },
  // South America (additional)
  CHL: { capital: 'Santiago',       area:   756_950 },
  VEN: { capital: 'Caracas',        area:   916_050 },
  ECU: { capital: 'Quito',          area:   283_561 },
  BOL: { capital: 'Sucre',          area: 1_098_581 },
  PRY: { capital: 'Asunción',       area:   406_752 },
  URY: { capital: 'Montevideo',     area:   175_016 },
  GUY: { capital: 'Georgetown',     area:   214_969 },
  SUR: { capital: 'Paramaribo',     area:   163_820 },
  // Oceania (additional)
  NZL: { capital: 'Wellington',     area:   270_467 },
  PNG: { capital: 'Port Moresby',   area:   462_840 },
  FJI: { capital: 'Suva',           area:    18_333 },
  SLB: { capital: 'Honiara',        area:    28_960 },
  VUT: { capital: 'Port Vila',      area:    12_189 },
  WSM: { capital: 'Apia',           area:     2_831 },
  TON: { capital: "Nuku'alofa",     area:       747 },
};

function fmt(n: number) {
  return n.toLocaleString('en-US');
}

export default function MapPage() {
  const { year, variant, setVariant } = usePopulationState();
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>('population');

  const { data, isLoading, isError, refetch } = useGetCountryPopulation({ year, variant });
  const { data: data2050 } = useGetCountryPopulation({ year: 2050, variant });

  const colorScale = useMemo(() => {
    if (!data?.data) return () => '#1e293b';
    const maxPop = Math.max(...(data.data as any[]).map((d: any) => d.populationMillions));
    return scaleSequential<string>()
      .domain([0, maxPop * 0.3])
      .range(['#0f172a', '#06b6d4']);
  }, [data]);

  const densityScale = useMemo(() => {
    if (!data?.data) return () => '#1e293b';
    const vals = (data.data as any[]).map((d: any) => d.density).filter((v: number) => v > 0);
    if (!vals.length) return () => '#1e293b';
    return scaleLog<string>()
      .domain([Math.max(0.1, Math.min(...vals)), Math.max(...vals)])
      .range(['#0f172a', '#f59e0b'])
      .clamp(true);
  }, [data]);

  const worldTotal = useMemo(() =>
    (data?.data as any[])?.reduce((sum: number, c: any) => sum + c.population, 0) || 0,
  [data]);

  const selectedCountry = useMemo(() =>
    (data?.data as any[])?.find((c: any) => c.iso3 === selectedIso) || null,
  [data, selectedIso]);

  const country2050 = useMemo(() =>
    (data2050?.data as any[])?.find((c: any) => c.iso3 === selectedIso) || null,
  [data2050, selectedIso]);

  if (isLoading && !isAncient(year)) return <Layout><LoadingScreen message="Loading Map Data..." /></Layout>;
  if (isError && !isAncient(year)) return <Layout><ErrorState error={null} retry={() => refetch()} /></Layout>;
  if (isAncient(year)) return <Layout><AncientEraPanel year={year} pageName="Choropleth map" /></Layout>;

  const extras = selectedIso ? COUNTRY_EXTRAS[selectedIso] : null;
  const worldShare = selectedCountry && worldTotal > 0
    ? (selectedCountry.population / worldTotal * 100).toFixed(1)
    : null;
  const absoluteChange = selectedCountry
    ? selectedCountry.populationMillions * selectedCountry.growthRate / 100
    : 0;
  const projection2050Pct = selectedCountry && country2050
    ? ((country2050.populationMillions - selectedCountry.populationMillions) / selectedCountry.populationMillions * 100)
    : null;

  return (
    <Layout>
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Choropleth Map</h1>
            <p className="text-muted-foreground mt-1">
              Global population distribution in {formatYearFull(year)}
              {selectedCountry ? ` · Click a country for details` : ` · Click any country for details`}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Map mode toggle */}
            <div className="glass-panel px-1 py-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setMapMode('population')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${mapMode === 'population' ? 'bg-primary/30 text-primary border border-primary/40' : 'text-muted-foreground hover:text-white'}`}
              >
                <Layers className="w-3.5 h-3.5" /> Population
              </button>
              <button
                onClick={() => setMapMode('density')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${mapMode === 'density' ? 'bg-accent/30 text-accent border border-accent/40' : 'text-muted-foreground hover:text-white'}`}
              >
                <Users className="w-3.5 h-3.5" /> Density
              </button>
            </div>
            {/* Variant selector */}
            <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Variant:</span>
              <select
                className="bg-transparent border border-white/10 rounded-md py-1 px-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                value={variant}
                onChange={(e) => setVariant(e.target.value as any)}
                disabled={year < 2025}
              >
                <option value="medium" className="bg-slate-900">Medium</option>
                <option value="high" className="bg-slate-900">High</option>
                <option value="low" className="bg-slate-900">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Map */}
          <div className="flex-1 w-full rounded-2xl glass-panel relative overflow-hidden flex items-center justify-center p-2">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120 }}
              className="w-full h-full"
            >
              <ZoomableGroup center={[0, 0]} maxZoom={5}>
                <Sphere stroke="rgba(255,255,255,0.05)" strokeWidth={1} id="sphere" fill="transparent" />
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryId = geo.id || geo.properties.ISO_A3 || '';
                      const geoName = (geo.properties.name || '').toLowerCase();
                      const d = (data?.data as any[])?.find((s: any) =>
                        s.iso3 === countryId ||
                        s.name.toLowerCase() === geoName ||
                        geoName.includes(s.name.toLowerCase().split(' ')[0])
                      );
                      const isSelected = d?.iso3 === selectedIso;
                      const fillColor = isSelected ? '#f59e0b' : d
                        ? (mapMode === 'density'
                            ? densityScale(d.density > 0 ? d.density : 0.1)
                            : colorScale(d.populationMillions))
                        : '#1e293b';
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fillColor}
                          stroke={isSelected ? '#f59e0b' : '#0f172a'}
                          strokeWidth={isSelected ? 1.5 : 0.5}
                          style={{
                            default: { outline: 'none', transition: 'fill 0.2s ease' },
                            hover: { fill: d?.iso3 === selectedIso ? '#f59e0b' : '#7dd3fc', outline: 'none', cursor: 'pointer' },
                            pressed: { fill: '#f59e0b', outline: 'none' },
                          }}
                          onClick={() => setSelectedIso(d?.iso3 === selectedIso ? null : (d?.iso3 || null))}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Side panel */}
          <AnimatePresence>
            {selectedCountry && (
              <motion.div
                key={selectedCountry.iso3}
                initial={{ opacity: 0, x: 40, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 320 }}
                exit={{ opacity: 0, x: 40, width: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="shrink-0 glass-panel rounded-2xl overflow-hidden flex flex-col"
                style={{ minWidth: 280, maxWidth: 340 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between p-5 pb-4 border-b border-white/10">
                  <div className="min-w-0 flex items-start gap-3">
                    {(() => {
                      const f = getFlagUrl(selectedCountry.iso3);
                      return f ? (
                        <img
                          src={f}
                          alt={selectedCountry.name}
                          className="w-12 h-8 object-cover rounded border border-white/10 shadow-md shrink-0 mt-0.5"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : null;
                    })()}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Globe2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">{selectedCountry.continent}</span>
                      </div>
                      <h2 className="text-xl font-bold text-white leading-tight">{selectedCountry.name}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIso(null)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors shrink-0 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                  {/* Population */}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-medium">
                      Population ({formatYearFull(year)})
                    </div>
                    <div className="text-3xl font-bold text-primary leading-none mb-1">
                      {formatPopulation(selectedCountry.populationMillions)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {fmt(selectedCountry.population * 1000)} people
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {absoluteChange !== 0 && (
                        <span className={`flex items-center gap-1 text-sm font-semibold ${absoluteChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {absoluteChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {absoluteChange > 0 ? '+' : ''}{absoluteChange.toFixed(1)}M ({selectedCountry.growthRate > 0 ? '+' : ''}{selectedCountry.growthRate.toFixed(1)}%)
                        </span>
                      )}
                      {worldShare && (
                        <span className="text-sm text-accent font-semibold">
                          {worldShare}% of world
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Geography */}
                  {extras && (
                    <div className="space-y-3">
                      <div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Geography</div>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" /> Capital
                          </span>
                          <span className="text-sm font-semibold text-white">{extras.capital}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5">
                          <span className="text-sm text-muted-foreground">Area</span>
                          <span className="text-sm font-semibold text-white">{fmt(extras.area)} km²</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-3.5 h-3.5" /> Density
                          </span>
                          <span className="text-sm font-semibold text-white">{fmt(selectedCountry.density)} p/km²</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2050 Projection */}
                  {country2050 && projection2050Pct !== null && (
                    <div className="glass-panel rounded-xl p-4 border border-accent/20">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart2 className="w-4 h-4 text-accent" />
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">2050 Projection ({variant})</span>
                      </div>
                      <div className="text-2xl font-bold text-accent mb-1">
                        {formatPopulation(country2050.populationMillions)}
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${projection2050Pct > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {projection2050Pct > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {projection2050Pct > 0 ? '+' : ''}{projection2050Pct.toFixed(1)}% vs. {formatYearFull(year)}
                      </div>
                    </div>
                  )}

                  {/* No extras note */}
                  {!extras && (
                    <div className="text-xs text-muted-foreground italic">
                      Detailed geography data not available for this country.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
