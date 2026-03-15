import { Landmark, AlertTriangle } from 'lucide-react';
import { formatYearFull, getEraLabel } from '@/lib/timeUtils';
import { useGetPopulationSummary } from '@workspace/api-client-react';
import { formatPopulation } from '@/lib/utils';

interface Props {
  year: number;
  pageName?: string;
}

const ERA_DESC: Record<string, string> = {
  'Prehistoric': 'Hunter-gatherers spread across continents. No cities, no agriculture.',
  'Ancient World': 'Early agriculture and first city-states emerge in Mesopotamia, Egypt, and the Indus Valley.',
  'Classical Era': 'Roman Empire, Han China, and Mauryan Empire reach their peak.',
  'Early Medieval': 'Fall of Rome, rise of Islam, Byzantine Empire.',
  'Medieval': 'Crusades, Mongol Empire, Black Death devastates Eurasia.',
  'Early Modern': 'Age of Exploration, printing press, Renaissance.',
};

export function AncientEraPanel({ year, pageName }: Props) {
  const era = getEraLabel(year);
  const { data } = useGetPopulationSummary({ year });

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
        <Landmark className="w-10 h-10 text-amber-400" />
      </div>

      <div>
        <div className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-1">{era}</div>
        <h2 className="text-4xl font-bold text-white mb-2">{formatYearFull(year)}</h2>
        {ERA_DESC[era] && (
          <p className="text-muted-foreground max-w-md">{ERA_DESC[era]}</p>
        )}
      </div>

      {data && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="glass-panel p-4 rounded-xl">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">World Population</div>
            <div className="text-2xl font-bold text-primary">{formatPopulation(data.worldPopulationMillions)}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Urbanization</div>
            <div className="text-2xl font-bold text-accent">{data.urbanPopulationPercent.toFixed(1)}%</div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Dominant Region</div>
            <div className="text-sm font-bold text-pink-400 leading-tight">{data.largestCountry}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Largest City</div>
            <div className="text-sm font-bold text-purple-400 leading-tight">{data.largestCity}</div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 text-left max-w-md glass-panel p-4 rounded-xl border border-amber-500/20">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {pageName ? `${pageName} data` : 'Country-level data'} is only available from 1800 CE onward. 
          Ancient estimates come from HYDE 3.3, McEvedy &amp; Jones, and the Maddison Project — 
          uncertainty is ±30–100% depending on the period.
        </p>
      </div>
    </div>
  );
}
