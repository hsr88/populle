import { Link } from 'wouter';
import { SplitSquareVertical, Brain, Globe2, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { BirthYearForm, WorldAnswer, worldTitle, worldDescription } from '@/components/PopulationAnswers';
import { COMPARISON_PATH } from '@workspace/population';

export default function Home() {
  return (
    <Layout hideYearSlider fullBleed>
      <SEO title={worldTitle} description={worldDescription} path="/" />
      <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center gap-9 px-6 py-12 sm:px-12 lg:gap-12 lg:px-16">
        <WorldAnswer />
        <BirthYearForm />
        <nav aria-label="Explore population" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <QuickLink href={COMPARISON_PATH} icon={SplitSquareVertical} label="India vs Europe" sub="Compare populations" />
          <QuickLink href="/country/ven" icon={MapPin} label="Venezuela" sub="Population by year" />
          <QuickLink href="/quiz" icon={Brain} label="Population quiz" sub="Play 10 rounds" />
          <QuickLink href="/globe" icon={Globe2} label="3D globe" sub="Explore the map" />
        </nav>
        <Link href="/story" className="w-fit text-sm text-primary underline">Explore another birth year</Link>
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
