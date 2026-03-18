import { useEffect, useState, useRef, useMemo, Component, type ReactNode, type ErrorInfo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePopulationState } from '@/context/PopulationContext';
import { useGetCountryPopulation, useGetCityPopulation } from '@workspace/api-client-react';
import { LoadingScreen, ErrorState } from '@/components/ui/loading';
import { formatPopulation } from '@/lib/utils';
import { scaleSequential, interpolateRgb } from 'd3-scale';
import { Globe2, Map, Sun, Moon, Radio } from 'lucide-react';
import { AncientEraPanel } from '@/components/ui/AncientEraPanel';
import { isAncient } from '@/lib/timeUtils';

class GlobeErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(_err: Error, _info: ErrorInfo) {}
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

function GlobeFallback({ data }: { data: any[] }) {
  const top8 = [...(data || [])].sort((a, b) => b.populationMillions - a.populationMillions).slice(0, 8);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-accent/60 flex items-center justify-center border border-primary/30 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
        <Globe2 className="w-16 h-16 text-primary" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">3D Globe</h2>
        <p className="text-muted-foreground text-sm max-w-sm">Interactive 3D globe requires WebGL support. Here are the top populated countries:</p>
      </div>
      <div className="w-full max-w-lg space-y-2">
        {top8.map((country, i) => (
          <div key={country.iso3} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <span className="text-primary font-bold w-6 text-center">{i + 1}</span>
            <span className="flex-1 font-medium">{country.name}</span>
            <span className="text-accent font-bold">{formatPopulation(country.populationMillions)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

let GlobeComponent: React.ComponentType<any> | null = null;

type MapMode = 'globe' | 'heatmap' | 'night';

function countryTooltip(d: any) {
  return `
    <div style="background:rgba(3,7,18,0.95);border:1px solid rgba(6,182,212,0.3);padding:14px 16px;border-radius:14px;box-shadow:0 20px 40px rgba(0,0,0,0.6);min-width:170px;pointer-events:none;font-family:sans-serif">
      <div style="font-weight:700;color:white;font-size:15px;margin-bottom:6px">${d.name}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
        <span style="color:#06b6d4;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Population</span>
      </div>
      <div style="color:#f5f5f5;font-size:20px;font-weight:700;margin-bottom:6px">${formatPopulation(d.populationMillions)}</div>
      <div style="display:flex;align-items:center;gap:4px">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b"></span>
        <span style="color:rgba(255,255,255,0.5);font-size:12px">${d.continent}</span>
      </div>
    </div>
  `;
}

function cityTooltip(d: any) {
  const isMegacity = d.populationMillions >= 10;
  return `
    <div style="background:rgba(3,7,18,0.95);border:1px solid rgba(245,158,11,0.35);padding:14px 16px;border-radius:14px;box-shadow:0 20px 40px rgba(0,0,0,0.6);min-width:170px;pointer-events:none;font-family:sans-serif">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
        <span style="color:#f59e0b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em">${isMegacity ? '🌆 Megacity' : '🏙️ City'}</span>
      </div>
      <div style="font-weight:700;color:white;font-size:15px;margin-bottom:4px">${d.name}</div>
      <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:8px">${d.country} · ${d.continent}</div>
      <div style="color:#06b6d4;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px">Population</div>
      <div style="color:#f5f5f5;font-size:20px;font-weight:700">${formatPopulation(d.populationMillions)}</div>
    </div>
  `;
}

export default function Home() {
  const { year, variant } = usePopulationState();
  const globeRef = useRef<any>();
  const [globeReady, setGlobeReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mapMode, setMapMode] = useState<MapMode>('globe');
  const containerRef = useRef<HTMLDivElement>(null);
  const [GlobeLoaded, setGlobeLoaded] = useState<React.ComponentType<any> | null>(GlobeComponent);

  useEffect(() => {
    if (!GlobeLoaded) {
      import('react-globe.gl').then(mod => {
        GlobeComponent = mod.default;
        setGlobeLoaded(() => mod.default);
      }).catch(() => {});
    }
  }, []);

  const { data, isLoading, isError, refetch } = useGetCountryPopulation({ year, variant });
  const { data: citiesData } = useGetCityPopulation({ year, limit: 30 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    ro.observe(el);
    const { clientWidth, clientHeight } = el;
    if (clientWidth > 0 && clientHeight > 0) setDimensions({ width: clientWidth, height: clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (globeRef.current && globeReady) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.4;
    }
  }, [globeReady]);

  const colorScale = useMemo(() => {
    if (!data?.data) return () => '#06b6d4';
    const maxPop = Math.max(...data.data.map(d => d.populationMillions));
    return scaleSequential<string>()
      .domain([0, maxPop * 0.5])
      .range(['rgba(6,182,212,0.4)', 'rgba(245,158,11,1)']);
  }, [data]);

  // Enhanced heatmap color scale with glow effect
  const heatmapColorScale = useMemo(() => {
    if (!data?.data) return () => '#ef4444';
    const maxPop = Math.max(...data.data.map((d: any) => d.populationMillions));
    return (pop: number) => {
      const t = pop / maxPop;
      // More intense colors for heatmap
      if (t > 0.7) return `rgba(239, 68, 68, ${0.6 + t * 0.4})`; // intense red
      if (t > 0.4) return `rgba(245, 158, 11, ${0.5 + t * 0.5})`; // orange
      if (t > 0.2) return `rgba(234, 179, 8, ${0.4 + t * 0.6})`; // yellow
      return `rgba(34, 197, 94, ${0.3 + t * 0.7})`; // green
    };
  }, [data]);

  const cities = citiesData?.data || [];
  const fallback = <GlobeFallback data={data?.data || []} />;

  // Globe configurations based on map mode
  const globeConfigs = {
    globe: {
      image: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
      showBars: true,
      showHeatmap: false,
      showSpread: false,
    },
    night: {
      image: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
      bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
      showBars: false,
      showHeatmap: false,
      showSpread: false,
    },
    heatmap: {
      image: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
      bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
      showBars: true,
      showHeatmap: true,
      showCities: false,
    },
    night: {
      image: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
      bump: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
      showBars: false,
      showHeatmap: false,
      showCities: false,
    },
  };
  
  const nightTooltip = "Night Lights: Based on NASA's Black Marble satellite data showing Earth's city lights at night. Brighter areas indicate larger cities and higher population density.";
  
  const config = globeConfigs[mapMode];
  
  // Render globe content based on state
  const renderGlobeContent = () => {
    if (isAncient(year)) return <AncientEraPanel year={year} pageName="3D Globe & country" />;
    if (isLoading) return <LoadingScreen message="Initializing 3D Environment..." />;
    if (isError) return <ErrorState error={null} retry={() => refetch()} />;
    if (!GlobeLoaded) return fallback;
    
    return (
      <GlobeErrorBoundary fallback={fallback}>
        <GlobeLoaded
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={config.image}
          bumpImageUrl={config.bump}
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          onGlobeReady={() => setGlobeReady(true)}

          /* Country bars/population indicators */
          pointsData={config.showBars || config.showHeatmap ? data?.data || [] : []}
          pointLat="lat"
          pointLng="lon"
          pointAltitude={(d: any) => config.showHeatmap 
            ? 0.01 
            : Math.max(0.02, Math.min(d.populationMillions / 300, 0.6))
          }
          pointColor={(d: any) => config.showHeatmap 
            ? heatmapColorScale(d.populationMillions)
            : colorScale(d.populationMillions)
          }
          pointRadius={(d: any) => config.showHeatmap 
            ? Math.max(1.5, Math.min(d.populationMillions / 30, 4.5)) // Larger for heatmap
            : 0.4
          }
          pointsMerge={false}
          pointLabel={countryTooltip}

          /* Heatmap rings effect - glowing circles around high population areas */
          ringsData={config.showHeatmap ? data?.data?.filter((d: any) => d.populationMillions > 50) || [] : []}
          ringLat="lat"
          ringLng="lon"
          ringAltitude={0.01}
          ringColor={(d: any) => heatmapColorScale(d.populationMillions)}
          ringMaxRadius={3}
          ringPropagationSpeed={1}
          ringRepeatPeriod={2000}

          /* City dots - hidden in heatmap and night modes */
          labelsData={config.showCities !== false ? cities : []}
          labelLat="lat"
          labelLng="lon"
          labelAltitude={0.01}
          labelText={() => ''}
          labelSize={0}
          labelDotRadius={(d: any) => Math.max(0.3, Math.min(d.populationMillions / 12, 0.8))}
          labelDotOrientation={() => 'bottom'}
          labelColor={() => 'rgba(245,158,11,0.9)'}
          labelLabel={cityTooltip}
          labelResolution={6}
          
          /* Night mode - brighter glow effect */
          atmosphereColor={config.showHeatmap ? undefined : '#06b6d4'}
          atmosphereAltitude={config.showHeatmap ? undefined : 0.15}
        />
      </GlobeErrorBoundary>
    );
  };

  return (
    <Layout>
      <div className="w-full h-full flex flex-col relative">
        {/* Desktop info overlay */}
        <div className="hidden lg:block absolute top-4 left-4 z-10 glass-panel p-4 rounded-2xl max-w-xs pointer-events-none">
          <h1 className="text-2xl font-bold mb-1">Global Population</h1>
          <p className="text-muted-foreground text-xs">Hover over a country or city marker for details.</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-primary/40 to-accent" />
          </div>
          <div className="flex justify-between text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-primary/70" />
              Countries
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent border border-accent/50" />
              Cities
            </span>
          </div>
        </div>

        {/* Map Mode Switcher */}
        <div className="hidden lg:flex absolute top-4 right-4 z-10 flex-col gap-2">
          {[
            { id: 'globe', icon: Globe2, label: '3D Globe' },
            { id: 'heatmap', icon: Map, label: 'Heatmap' },
            { id: 'night', icon: Moon, label: 'Night Lights', tooltip: nightTooltip },
          ].map((mode) => {
            const isActive = mapMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setMapMode(mode.id as MapMode)}
                className={`glass-panel p-3 rounded-xl flex items-center gap-3 transition-all min-w-[140px] cursor-pointer text-left ${
                  isActive ? 'border-primary/50 bg-primary/10' : 'hover:bg-white/5'
                }`}
                title={(mode as any).tooltip || mode.label}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile title */}
        <div className="lg:hidden mb-2 px-1">
          <h1 className="text-xl font-bold">Global Population</h1>
          <p className="text-muted-foreground text-xs">Tap a marker for country or city details</p>
        </div>

        <div className="flex-1 w-full rounded-2xl overflow-hidden glass-panel border border-white/5" ref={containerRef}>
          {renderGlobeContent()}
        </div>
      </div>
    </Layout>
  );
}
