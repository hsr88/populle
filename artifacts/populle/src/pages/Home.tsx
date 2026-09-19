import { useEffect, useState, useMemo } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { useGetPopulationSummary } from '@workspace/api-client-react';
import { Sparkles, SplitSquareVertical, Brain, Globe2, ArrowRight } from 'lucide-react';

const BIRTHS_PER_SECOND = 4.3;
const NOW_YEAR = 2026;

function useLivePopulation(baseMillions: number | undefined) {
  const [now, setNow] = useState(() => Date.now());
  const baseAt = useMemo(() => Date.now(), [baseMillions]);

  useEffect(() => {
    if (baseMillions == null) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [baseMillions]);

  if (baseMillions == null) return null;
  const elapsedSec = (now - baseAt) / 1000;
  const added = (elapsedSec * BIRTHS_PER_SECOND) / 1_000_000;
  return baseMillions + added;
}

export default function Home() {
  const { data } = useGetPopulationSummary({ year: NOW_YEAR });
  const live = useLivePopulation(data?.worldPopulationMillions);
  const [birthYear, setBirthYear] = useState(1995);

  const displayPop = live ?? data?.worldPopulationMillions;
  const formattedLive = displayPop != null
    ? displayPop >= 1000
      ? `${(displayPop / 1000).toFixed(3)}B`
      : `${displayPop.toFixed(1)}M`
    : '…';

  return (
    <Layout hideYearSlider fullBleed>
      <SEO
        title="Populle — Your Story in the Scale of Humanity"
        description="See how the world changed since you were born. Live population clock, birth-year stories, dramatic contrasts, and a quiz worth sharing."
        keywords="world population, birth year, population clock, demographics, viral population story"
        path="/"
      />

      <div className="relative min-h-full w-full overflow-hidden">
        {/* Full-bleed atmosphere over space bg */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_25%,rgba(6,182,212,0.22),transparent_55%),radial-gradient(ellipse_at_85%_70%,rgba(245,158,11,0.14),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
        </div>

        <section className="relative z-10 flex flex-col justify-center min-h-[100dvh] lg:min-h-full px-6 sm:px-10 lg:px-16 xl:px-24 py-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-sm tracking-[0.25em] uppercase text-primary mb-4">
              Populle
            </p>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Your story
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                in the scale of humanity
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              When you were born, the world was smaller. See how much it changed — then share it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-10"
          >
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Live world population
            </div>
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary text-glow tabular-nums">
              {formattedLive}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              ≈ {BIRTHS_PER_SECOND} births every second · {NOW_YEAR} estimate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row sm:items-end gap-4"
          >
            <div>
              <label htmlFor="birth-year" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Your birth year
              </label>
              <input
                id="birth-year"
                type="number"
                min={1920}
                max={2025}
                value={birthYear}
                onChange={(e) => setBirthYear(Math.min(2025, Math.max(1920, Number(e.target.value) || 1995)))}
                className="w-36 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-2xl font-display font-bold text-white focus:outline-none focus:border-primary/60 tabular-nums"
              />
            </div>
            <Link
              href={`/story/${birthYear}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-[0_0_40px_rgba(6,182,212,0.35)]"
            >
              Tell my story
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
          >
            <QuickLink href="/contrast" icon={SplitSquareVertical} label="Contrast" sub="India vs Europe" />
            <QuickLink href="/quiz" icon={Brain} label="Quiz" sub="Share your type" />
            <QuickLink href="/globe" icon={Globe2} label="3D Globe" sub="Explore the map" />
            <QuickLink href="/story" icon={Sparkles} label="Any year" sub="Pick & scroll" />
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  sub,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/30 transition-all"
    >
      <Icon className="w-5 h-5 text-primary mb-1 group-hover:scale-110 transition-transform" />
      <span className="font-medium text-white text-sm">{label}</span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </Link>
  );
}
