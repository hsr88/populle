import { useState, useMemo, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useGetCountryPopulation } from '@workspace/api-client-react';
import { formatPopulation } from '@/lib/utils';
import { getFlagUrl, shuffle } from '@/lib/countryUtils';
import { Trophy, RefreshCw, ChevronRight, Target, Zap, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_YEAR = 2024;
const TOTAL_ROUNDS = 10;

type Choice = { iso3: string; name: string; populationMillions: number };
type Round = { country: Choice; choices: Choice[] };
type AnswerResult = 'correct' | 'wrong' | null;

function buildRounds(countries: Choice[]): Round[] {
  const eligible = countries.filter(c => c.populationMillions >= 0.3);
  const picked = shuffle(eligible).slice(0, TOTAL_ROUNDS);
  return picked.map(country => {
    const others = eligible.filter(c => c.iso3 !== country.iso3);
    const wrongs = shuffle(others).slice(0, 3);
    return { country, choices: shuffle([country, ...wrongs]) };
  });
}

function ScoreBar({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? (score / (total * 100)) * 100 : 0;
  const grade = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 45 ? 'C' : 'D';
  const gradeColor = pct >= 90 ? 'text-yellow-400' : pct >= 75 ? 'text-green-400' : pct >= 60 ? 'text-cyan-400' : pct >= 45 ? 'text-orange-400' : 'text-red-400';
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">{score} / {total * 100} pts</span>
        <span className={`text-3xl font-black ${gradeColor}`}>{grade}</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function Quiz() {
  const { data, isLoading } = useGetCountryPopulation({ year: QUIZ_YEAR, variant: 'medium' });

  const rounds = useMemo(() => {
    if (!data?.data) return [];
    return buildRounds(data.data as Choice[]);
  }, [data]);

  const [phase, setPhase] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult>(null);

  const current = rounds[roundIdx];

  const handleStart = useCallback(() => {
    setPhase('playing');
    setRoundIdx(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setResult(null);
  }, []);

  const handleSelect = useCallback((iso3: string) => {
    if (result !== null) return;
    setSelected(iso3);
    const isCorrect = iso3 === current.country.iso3;
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 20 : newStreak >= 2 ? 10 : 0;
      setScore(s => s + 100 + bonus);
    } else {
      setStreak(0);
    }
  }, [result, current, streak]);

  const handleNext = useCallback(() => {
    if (roundIdx + 1 >= TOTAL_ROUNDS) {
      setPhase('finished');
    } else {
      setRoundIdx(i => i + 1);
      setSelected(null);
      setResult(null);
    }
  }, [roundIdx]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading quiz data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Population Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Guess the {QUIZ_YEAR} population of each country · {TOTAL_ROUNDS} rounds
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {/* Idle / Start screen */}
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/40 flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">How well do you know the world?</h2>
                  <p className="text-muted-foreground text-sm">
                    Pick the correct {QUIZ_YEAR} population from 4 real countries.
                    Streak bonuses for consecutive correct answers!
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Rounds', value: `${TOTAL_ROUNDS}` },
                    { label: 'Max Score', value: '1200' },
                    { label: 'Streak Bonus', value: '+20' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3">
                      <div className="text-xl font-bold text-primary">{value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleStart}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground font-bold text-lg transition-all active:scale-95 shadow-lg shadow-primary/30"
                >
                  Start Quiz
                </button>
              </motion.div>
            )}

            {/* Playing */}
            {phase === 'playing' && current && (
              <motion.div
                key={`round-${roundIdx}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="glass-panel rounded-2xl p-6 max-w-lg w-full space-y-5"
              >
                {/* Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full flex-1 transition-colors ${
                          i < roundIdx ? 'bg-primary' : i === roundIdx ? 'bg-primary/60' : 'bg-white/10'
                        }`}
                        style={{ width: 20 }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {streak >= 2 && (
                      <span className="flex items-center gap-1 text-accent font-bold">
                        <Zap className="w-3.5 h-3.5" /> ×{streak}
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      {roundIdx + 1} / {TOTAL_ROUNDS}
                    </span>
                    <span className="font-bold text-primary">{score} pts</span>
                  </div>
                </div>

                {/* Question */}
                <div className="text-center py-4 space-y-3">
                  {(() => {
                    const flagUrl = getFlagUrl(current.country.iso3);
                    return flagUrl ? (
                      <img
                        src={flagUrl}
                        alt={current.country.name}
                        className="w-20 h-14 object-cover rounded-lg border border-white/10 shadow-md mx-auto"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center mx-auto">
                        <Globe2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      What is the {QUIZ_YEAR} population of
                    </div>
                    <div className="text-2xl font-bold">{current.country.name}</div>
                  </div>
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 gap-2">
                  {current.choices.map((choice) => {
                    const isCorrect = choice.iso3 === current.country.iso3;
                    const isSelected = selected === choice.iso3;
                    let bg = 'bg-white/5 hover:bg-white/10 border-white/10 cursor-pointer';
                    if (result !== null) {
                      if (isCorrect) bg = 'bg-green-500/20 border-green-500/50 text-green-300';
                      else if (isSelected) bg = 'bg-red-500/20 border-red-500/50 text-red-300';
                      else bg = 'bg-white/5 border-white/5 opacity-50';
                    }
                    return (
                      <motion.button
                        key={choice.iso3}
                        whileTap={result === null ? { scale: 0.98 } : {}}
                        onClick={() => handleSelect(choice.iso3)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${bg}`}
                        disabled={result !== null}
                      >
                        <div className="flex items-center gap-3">
                          {(() => {
                            const f = getFlagUrl(choice.iso3);
                            return f ? (
                              <img src={f} alt="" className="w-7 h-5 object-cover rounded border border-white/10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            ) : null;
                          })()}
                          <span className="font-medium">{choice.name}</span>
                        </div>
                        <span className="text-sm font-bold text-primary shrink-0">
                          {formatPopulation(choice.populationMillions)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Result feedback */}
                <AnimatePresence>
                  {result !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                        result === 'correct' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                      }`}
                    >
                      <div>
                        <span className={`font-bold ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                          {result === 'correct' ? '✓ Correct!' : '✗ Wrong'}
                        </span>
                        {result === 'correct' && streak >= 2 && (
                          <span className="ml-2 text-xs text-accent font-bold">
                            +{streak >= 3 ? 20 : 10} streak bonus!
                          </span>
                        )}
                        {result === 'wrong' && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Correct: {current.country.name} — {formatPopulation(current.country.populationMillions)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-bold transition-colors"
                      >
                        {roundIdx + 1 >= TOTAL_ROUNDS ? 'Results' : 'Next'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Finished */}
            {phase === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-2xl p-8 max-w-md w-full text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/30 to-primary/40 flex items-center justify-center mx-auto border border-accent/20 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                  <Trophy className="w-10 h-10 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Quiz Complete!</h2>
                  <p className="text-muted-foreground text-sm">
                    You scored {score} out of {TOTAL_ROUNDS * 100} possible points
                  </p>
                </div>
                <ScoreBar score={score} total={TOTAL_ROUNDS} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xl font-bold text-primary">{score}</div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xl font-bold text-accent">{Math.round((score / (TOTAL_ROUNDS * 100)) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                <button
                  onClick={handleStart}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" /> Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
