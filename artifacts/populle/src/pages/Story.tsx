import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  useGetPopulationSummary,
  useGetCountryPopulation,
  useGetCityPopulation,
} from '@workspace/api-client-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Slider } from '@/components/ui/slider';
import { ShareCard } from '@/components/share/ShareCard';
import { ShareButton } from '@/components/share/ShareButton';
import { formatPopulation, formatLargeNumber, cn } from '@/lib/utils';
import { getLifetimeEvents, getEventsAroundBirth } from '@/data/historicalEvents';
import { formatYearFull } from '@/lib/timeUtils';
import { ChevronDown, ArrowRight, RotateCcw } from 'lucide-react';

/** Orval types require queryKey; enabled-only overrides are valid at runtime. */
type QueryEnabled = { enabled: boolean };

const MIN_YEAR = 1920;
const MAX_YEAR = 2025;
const DEFAULT_YEAR = 1990;
const NOW_YEAR = 2026;
const SITE_STORY_URL = 'https://populle.com/story';

function clampYear(year: number): number {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(year)));
}

function parseYearParam(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return null;
  return clampYear(n);
}

function growthMultiplier(thenM: number, nowM: number): number {
  if (thenM <= 0) return 0;
  return nowM / thenM;
}

function Scene({
  children,
  className,
  accent = 'cyan',
}: {
  children: ReactNode;
  className?: string;
  accent?: 'cyan' | 'amber';
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section
      ref={ref}
      className={cn(
        'relative min-h-[100dvh] flex flex-col justify-center px-5 sm:px-8 py-20',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 opacity-40',
          accent === 'cyan'
            ? 'bg-[radial-gradient(ellipse_at_30%_20%,rgba(6,182,212,0.18),transparent_55%)]'
            : 'bg-[radial-gradient(ellipse_at_70%_30%,rgba(245,158,11,0.16),transparent_55%)]',
        )}
      />
      <motion.div
        className="relative z-10 mx-auto w-full max-w-3xl"
        initial={{ opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function AnimatedStat({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <motion.div
      className={cn('font-display font-bold tracking-tight text-white', className)}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {value}
    </motion.div>
  );
}

function YearPicker({
  year,
  onChange,
  onStart,
}: {
  year: number;
  onChange: (year: number) => void;
  onStart: () => void;
}) {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center px-5 sm:px-8 py-16 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.22),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(245,158,11,0.12),transparent_45%),linear-gradient(180deg,#020617_0%,#0a1628_55%,#020617_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <motion.p
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Populle
        </motion.p>
        <motion.p
          className="mt-4 text-base sm:text-lg text-white/55 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          Your birth year. The story of humanity since then.
        </motion.p>

        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <label htmlFor="birth-year" className="sr-only">
            Birth year
          </label>
          <input
            id="birth-year"
            type="number"
            inputMode="numeric"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={year}
            onChange={(e) => {
              const next = Number.parseInt(e.target.value, 10);
              if (Number.isFinite(next)) onChange(clampYear(next));
            }}
            className="w-full bg-transparent text-center font-display text-[5.5rem] sm:text-[7rem] leading-none font-bold tracking-tighter text-cyan-300 caret-cyan-400 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-amber-400/80">
            Birth year
          </p>
        </motion.div>

        <motion.div
          className="mt-10 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Slider
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={[year]}
            onValueChange={(vals) => {
              const next = vals[0];
              if (typeof next === 'number') onChange(clampYear(next));
            }}
            className="w-full"
          />
          <div className="mt-3 flex justify-between text-[11px] text-white/35 font-medium tracking-wide">
            <span>{MIN_YEAR}</span>
            <span className="text-white/50">1950 – 2020 sweet spot</span>
            <span>{MAX_YEAR}</span>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={onStart}
          className="mt-12 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_40px_rgba(6,182,212,0.25)] transition hover:brightness-110 active:scale-[0.98]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileTap={{ scale: 0.98 }}
        >
          Tell my story
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </section>
  );
}

export default function Story() {
  const params = useParams<{ year?: string }>();
  const [, setLocation] = useLocation();
  const urlYear = parseYearParam(params.year);

  const [pickedYear, setPickedYear] = useState(urlYear ?? DEFAULT_YEAR);
  const [storyYear, setStoryYear] = useState<number | null>(urlYear);
  const [phase, setPhase] = useState<'picker' | 'story'>(urlYear ? 'story' : 'picker');

  useEffect(() => {
    if (urlYear != null) {
      setPickedYear(urlYear);
      setStoryYear(urlYear);
      setPhase('story');
    }
  }, [urlYear]);

  const activeYear = storyYear ?? pickedYear;
  const queriesEnabled = phase === 'story' && storyYear != null;

  const queryOpts = { query: { enabled: queriesEnabled } as QueryEnabled };

  const thenSummary = useGetPopulationSummary({ year: activeYear }, queryOpts as never);
  const nowSummary = useGetPopulationSummary({ year: NOW_YEAR }, queryOpts as never);
  const thenCountries = useGetCountryPopulation(
    { year: activeYear, variant: 'medium' },
    queryOpts as never,
  );
  const nowCountries = useGetCountryPopulation(
    { year: NOW_YEAR, variant: 'medium' },
    queryOpts as never,
  );
  const thenCities = useGetCityPopulation(
    { year: activeYear, limit: 5 },
    queryOpts as never,
  );
  const nowCities = useGetCityPopulation(
    { year: NOW_YEAR, limit: 5 },
    queryOpts as never,
  );

  const startStory = useCallback(() => {
    const year = clampYear(pickedYear);
    setStoryYear(year);
    setPhase('story');
    setLocation(`/story/${year}`);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [pickedYear, setLocation]);

  const resetStory = useCallback(() => {
    setPhase('picker');
    setStoryYear(null);
    setLocation('/story');
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [setLocation]);

  const thenWorldM = thenSummary.data?.worldPopulationMillions ?? 0;
  const nowWorldM = nowSummary.data?.worldPopulationMillions ?? 0;
  const multiplier = growthMultiplier(thenWorldM, nowWorldM);
  const addedM = nowWorldM - thenWorldM;

  const largestThen = useMemo(() => {
    const list = thenCountries.data?.data ?? [];
    if (list.length === 0) return null;
    const byName = thenSummary.data?.largestCountry
      ? list.find((c) => c.name === thenSummary.data?.largestCountry)
      : undefined;
    return byName ?? [...list].sort((a, b) => b.population - a.population)[0] ?? null;
  }, [thenCountries.data, thenSummary.data?.largestCountry]);

  const largestNow = useMemo(() => {
    const list = nowCountries.data?.data ?? [];
    if (list.length === 0) return null;
    const byName = nowSummary.data?.largestCountry
      ? list.find((c) => c.name === nowSummary.data?.largestCountry)
      : undefined;
    return byName ?? [...list].sort((a, b) => b.population - a.population)[0] ?? null;
  }, [nowCountries.data, nowSummary.data?.largestCountry]);

  const topCityThen = thenCities.data?.data?.[0] ?? null;
  const topCityNow = nowCities.data?.data?.[0] ?? null;
  const urbanThen = thenSummary.data?.urbanPopulationPercent;
  const urbanNow = nowSummary.data?.urbanPopulationPercent;
  const hasUrbanScene =
    (typeof urbanThen === 'number' && urbanThen > 0) ||
    topCityThen != null ||
    topCityNow != null;

  const lifetimeEvents = useMemo(
    () => (storyYear != null ? getLifetimeEvents(storyYear, NOW_YEAR, 14) : []),
    [storyYear],
  );
  const birthContextEvents = useMemo(
    () => (storyYear != null ? getEventsAroundBirth(storyYear, 2) : []),
    [storyYear],
  );

  const isLoading =
    queriesEnabled &&
    (thenSummary.isLoading || nowSummary.isLoading);

  const seoTitle =
    phase === 'story' && storyYear != null
      ? `Born in ${storyYear} — World Population Story | Populle`
      : 'Your Birth Year Story | Populle';
  const seoDescription =
    phase === 'story' && storyYear != null && thenWorldM > 0
      ? `In ${storyYear} the world had ${formatPopulation(thenWorldM)} people. Today it's ${formatPopulation(nowWorldM)}. Explore your personal population story on Populle.`
      : 'Enter your birth year and scroll through a cinematic story of how world population changed during your lifetime.';

  return (
    <Layout hideYearSlider fullBleed>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="birth year population, world population story, demographic story, population growth, viral population facts, historical events"
        path={storyYear != null ? `/story/${storyYear}` : '/story'}
      />

      <div className="relative min-h-[100dvh] w-full bg-[#020617] text-white">
        <AnimatePresence mode="wait">
          {phase === 'picker' && (
            <motion.div
              key="picker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <YearPicker
                year={pickedYear}
                onChange={setPickedYear}
                onStart={startStory}
              />
            </motion.div>
          )}

          {phase === 'story' && storyYear != null && (
            <motion.div
              key={`story-${storyYear}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {isLoading ? (
                <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6">
                  <motion.div
                    className="h-10 w-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-sm text-white/50">Gathering your timeline…</p>
                </div>
              ) : (
                <>
                  {/* 1 — Born */}
                  <Scene accent="cyan">
                    <p className="font-display text-2xl sm:text-3xl text-white/40 mb-4">
                      Populle
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1]">
                      You were born in{' '}
                      <span className="text-cyan-300">{formatYearFull(storyYear)}</span>
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-white/55 max-w-xl leading-relaxed">
                      Scroll to see how the human story unfolded in your lifetime.
                    </p>
                    <motion.div
                      className="mt-16 flex flex-col items-center gap-2 text-white/30"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </Scene>

                  {/* 2 — World then */}
                  <Scene accent="amber">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-400/90 mb-5">
                      Then · {formatYearFull(storyYear)}
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                      The world held
                    </h2>
                    <AnimatedStat
                      value={thenWorldM > 0 ? formatPopulation(thenWorldM) : '—'}
                      className="mt-4 text-6xl sm:text-7xl md:text-8xl text-amber-300"
                    />
                    <p className="mt-4 text-lg text-white/50">
                      people when you arrived
                      {thenSummary.data?.worldPopulation
                        ? ` — about ${formatLargeNumber(thenSummary.data.worldPopulation * 1000)} souls.`
                        : '.'}
                    </p>
                    {birthContextEvents.length > 0 && (
                      <div className="mt-10 space-y-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                          Around your birth
                        </p>
                        {birthContextEvents.map((ev) => (
                          <div
                            key={`${ev.year}-${ev.label}`}
                            className="flex gap-3 items-start border-l-2 pl-4 py-1"
                            style={{ borderColor: ev.color }}
                          >
                            <span className="text-lg leading-none mt-0.5">{ev.icon}</span>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                <span className="text-white/40 font-normal mr-2">{ev.year}</span>
                                {ev.label}
                              </p>
                              <p className="text-sm text-white/45 mt-0.5">{ev.impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Scene>

                  {/* 3 — World now */}
                  <Scene accent="cyan">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90 mb-5">
                      Now · {formatYearFull(NOW_YEAR)}
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                      Today we are
                    </h2>
                    <AnimatedStat
                      value={nowWorldM > 0 ? formatPopulation(nowWorldM) : '—'}
                      className="mt-4 text-6xl sm:text-7xl md:text-8xl text-cyan-300"
                    />
                    {multiplier > 0 && (
                      <p className="mt-6 text-xl sm:text-2xl text-white/70 leading-relaxed max-w-xl">
                        Roughly{' '}
                        <span className="text-cyan-300 font-semibold">
                          {multiplier.toFixed(multiplier >= 10 ? 0 : 1)}×
                        </span>{' '}
                        the population of your birth year
                        {addedM > 0 && (
                          <>
                            {' '}
                            —{' '}
                            <span className="text-amber-300 font-semibold">
                              {formatPopulation(addedM)}
                            </span>{' '}
                            more people share the planet with you.
                          </>
                        )}
                      </p>
                    )}
                  </Scene>

                  {/* 4 — Largest country then vs now */}
                  <Scene accent="amber">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-400/90 mb-5">
                      Largest country
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-10">
                      Who led the world?
                    </h2>
                    <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
                      <div>
                        <p className="text-sm text-white/40 mb-2">{formatYearFull(storyYear)}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {largestThen?.name ?? thenSummary.data?.largestCountry ?? '—'}
                        </p>
                        <AnimatedStat
                          value={
                            largestThen
                              ? formatPopulation(largestThen.populationMillions)
                              : '—'
                          }
                          className="mt-3 text-4xl sm:text-5xl text-amber-300"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-white/40 mb-2">{formatYearFull(NOW_YEAR)}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">
                          {largestNow?.name ?? nowSummary.data?.largestCountry ?? '—'}
                        </p>
                        <AnimatedStat
                          value={
                            largestNow
                              ? formatPopulation(largestNow.populationMillions)
                              : '—'
                          }
                          className="mt-3 text-4xl sm:text-5xl text-cyan-300"
                        />
                      </div>
                    </div>
                    {largestThen && largestNow && largestThen.name !== largestNow.name && (
                      <p className="mt-10 text-lg text-white/55 leading-relaxed">
                        The crown shifted — from {largestThen.name} to {largestNow.name}.
                      </p>
                    )}
                    {largestThen && largestNow && largestThen.name === largestNow.name && (
                      <p className="mt-10 text-lg text-white/55 leading-relaxed">
                        {largestNow.name} has held the lead across your lifetime.
                      </p>
                    )}
                  </Scene>

                  {/* 5 — Urbanization / cities */}
                  {hasUrbanScene && (
                    <Scene accent="cyan">
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/90 mb-5">
                        Cities rising
                      </p>
                      <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                        Humanity went urban
                      </h2>
                      {typeof urbanThen === 'number' && typeof urbanNow === 'number' && (
                        <p className="mt-6 text-xl sm:text-2xl text-white/70 leading-relaxed max-w-xl">
                          Urban share rose from{' '}
                          <span className="text-amber-300 font-semibold">
                            {urbanThen.toFixed(0)}%
                          </span>{' '}
                          to{' '}
                          <span className="text-cyan-300 font-semibold">
                            {urbanNow.toFixed(0)}%
                          </span>
                          .
                        </p>
                      )}
                      <div className="mt-10 space-y-6">
                        {topCityThen && (
                          <div>
                            <p className="text-sm text-white/40 mb-1">
                              Largest city · {formatYearFull(storyYear)}
                            </p>
                            <p className="text-xl sm:text-2xl font-semibold">
                              {topCityThen.name}
                              <span className="text-white/40 font-normal">
                                {' '}
                                · {formatPopulation(topCityThen.populationMillions)}
                              </span>
                            </p>
                          </div>
                        )}
                        {topCityNow && (
                          <div>
                            <p className="text-sm text-white/40 mb-1">
                              Largest city · {formatYearFull(NOW_YEAR)}
                            </p>
                            <p className="text-xl sm:text-2xl font-semibold">
                              {topCityNow.name}
                              <span className="text-white/40 font-normal">
                                {' '}
                                · {formatPopulation(topCityNow.populationMillions)}
                              </span>
                            </p>
                          </div>
                        )}
                        {!topCityThen && thenSummary.data?.largestCity && (
                          <p className="text-lg text-white/55">
                            In {formatYearFull(storyYear)}, the largest city was{' '}
                            <span className="text-white">{thenSummary.data.largestCity}</span>.
                          </p>
                        )}
                      </div>
                    </Scene>
                  )}

                  {/* 5b — Lifetime historical timeline */}
                  {lifetimeEvents.length > 0 && (
                    <Scene accent="amber">
                      <p className="text-xs uppercase tracking-[0.3em] text-amber-400/90 mb-5">
                        Your lifetime · {formatYearFull(storyYear)}–{formatYearFull(NOW_YEAR)}
                      </p>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
                        Wars, crises & turning points
                      </h2>
                      <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
                        While you were alive, history did not pause.
                      </p>
                      <ol className="relative space-y-0 border-l border-white/15 ml-3">
                        {lifetimeEvents.map((ev, i) => (
                          <li key={`${ev.year}-${ev.label}-${i}`} className="relative pl-8 pb-8 last:pb-0">
                            <span
                              className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#020617]"
                              style={{ backgroundColor: ev.color }}
                            />
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <span className="text-sm font-bold tabular-nums" style={{ color: ev.color }}>
                                {ev.year}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider text-white/35">
                                {ev.category}
                              </span>
                            </div>
                            <p className="mt-1 text-lg sm:text-xl font-semibold text-white">
                              <span className="mr-2">{ev.icon}</span>
                              {ev.label}
                            </p>
                            <p className="mt-1 text-sm sm:text-base text-white/45 leading-relaxed">
                              {ev.impact}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </Scene>
                  )}

                  {/* 6 — Shareable finale */}
                  <Scene accent="amber" className="pb-28">
                    <p className="font-display text-xl text-white/40 mb-3">
                      Populle
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                      Your chapter in{' '}
                      <span className="text-cyan-300">{formatPopulation(nowWorldM || thenWorldM)}</span>
                    </h2>
                    <p className="mt-6 text-lg sm:text-xl text-white/55 max-w-xl leading-relaxed">
                      Born in {formatYearFull(storyYear)}
                      {multiplier > 0
                        ? ` — you've watched the world grow ${multiplier.toFixed(multiplier >= 10 ? 0 : 1)}×.`
                        : '.'}{' '}
                      Pass the story on.
                    </p>

                    <div className="mt-10 flex flex-col items-start gap-8">
                      <ShareCard
                        title={`Born in ${formatYearFull(storyYear)}`}
                        subtitle="My population story"
                        bigStat={
                          multiplier > 0
                            ? `${multiplier.toFixed(multiplier >= 10 ? 0 : 1)}×`
                            : formatPopulation(nowWorldM || thenWorldM)
                        }
                        bigStatLabel={
                          multiplier > 0
                            ? 'world population growth since birth'
                            : 'world population now'
                        }
                        bullets={[
                          thenWorldM > 0
                            ? `Then: ${formatPopulation(thenWorldM)} people`
                            : null,
                          nowWorldM > 0
                            ? `Now: ${formatPopulation(nowWorldM)} people`
                            : null,
                          lifetimeEvents.length > 0
                            ? `${lifetimeEvents.length} landmark events in your lifetime`
                            : null,
                          largestThen && largestNow
                            ? largestThen.name === largestNow.name
                              ? `Largest country: ${largestNow.name}`
                              : `${largestThen.name} → ${largestNow.name}`
                            : null,
                        ].filter((b): b is string => b != null)}
                        footer={`${SITE_STORY_URL.replace('https://', '')}/${storyYear}`}
                        accent="cyan"
                      />
                      <ShareButton
                        title={`Born in ${storyYear} | Populle`}
                        text={`I was born in ${storyYear}. Here's how the world changed since then — on Populle.`}
                        url={`${SITE_STORY_URL}/${storyYear}`}
                        variant="primary"
                        label="Share my story"
                        size="lg"
                        className="rounded-full px-8"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={resetStory}
                      className="mt-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white/70"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Try another year
                    </button>
                  </Scene>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
