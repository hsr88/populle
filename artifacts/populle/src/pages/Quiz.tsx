import { useState, useMemo, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { quizQuestions, getRandomQuestions, QuizQuestion, QuestionType } from '@/data/quizQuestions';
import { Trophy, RefreshCw, ChevronRight, Target, Zap, HelpCircle, Globe2, Building2, MapPin, Clock, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TOTAL_ROUNDS = 10;

type AnswerResult = 'correct' | 'wrong' | null;

const TYPE_ICONS: Record<QuestionType, React.ElementType> = {
  population: Globe2,
  comparison: Target,
  capital: Building2,
  flag: Flag,
  history: Clock,
};

const TYPE_LABELS: Record<QuestionType, string> = {
  population: 'Population',
  comparison: 'Comparison',
  capital: 'Capital Cities',
  flag: 'Flags',
  history: 'History',
};

const TYPE_COLORS: Record<QuestionType, string> = {
  population: 'text-cyan-400 bg-cyan-400/10',
  comparison: 'text-purple-400 bg-purple-400/10',
  capital: 'text-emerald-400 bg-emerald-400/10',
  flag: 'text-amber-400 bg-amber-400/10',
  history: 'text-rose-400 bg-rose-400/10',
};

function ScoreBar({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? (score / total) * 100 : 0;
  const grade = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 60 ? 'B' : pct >= 45 ? 'C' : 'D';
  const gradeColor = pct >= 90 ? 'text-yellow-400' : pct >= 75 ? 'text-green-400' : pct >= 60 ? 'text-cyan-400' : pct >= 45 ? 'text-orange-400' : 'text-red-400';
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">{score} / {total} pts</span>
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

function QuestionTypeBadge({ type }: { type: QuestionType }) {
  const Icon = TYPE_ICONS[type];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", TYPE_COLORS[type])}>
      <Icon className="w-3.5 h-3.5" />
      {TYPE_LABELS[type]}
    </span>
  );
}

export default function Quiz() {
  const [rounds, setRounds] = useState<QuizQuestion[]>([]);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const current = rounds[roundIdx];

  const handleStart = useCallback(() => {
    const newRounds = getRandomQuestions(TOTAL_ROUNDS);
    setRounds(newRounds);
    setPhase('playing');
    setRoundIdx(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setResult(null);
    setShowExplanation(false);
  }, []);

  const handleSelect = useCallback((answerIndex: number) => {
    if (result !== null || !current) return;
    setSelected(answerIndex);
    const isCorrect = answerIndex === current.correctAnswer;
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const bonus = newStreak >= 3 ? 2 : newStreak >= 2 ? 1 : 0;
      setScore(s => s + 10 + bonus);
    } else {
      setStreak(0);
    }
    setShowExplanation(true);
  }, [result, current, streak]);

  const handleNext = useCallback(() => {
    if (roundIdx + 1 >= TOTAL_ROUNDS) {
      setPhase('finished');
    } else {
      setRoundIdx(i => i + 1);
      setSelected(null);
      setResult(null);
      setShowExplanation(false);
    }
  }, [roundIdx]);

  const questionStats = useMemo(() => {
    if (!rounds.length) return { population: 0, comparison: 0, capital: 0, flag: 0, history: 0 };
    return rounds.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {} as Record<QuestionType, number>);
  }, [rounds]);

  return (
    <Layout>
      <SEO
        title="Population Quiz | Populle"
        description="Test your knowledge with 10 random questions about world population, countries, capitals, and demographics."
        keywords="population quiz, geography quiz, country quiz, demographics quiz, world quiz"
      />
      
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Population Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Test your knowledge with {TOTAL_ROUNDS} random questions
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
                    Answer {TOTAL_ROUNDS} random questions about population, geography, capitals, and history.
                    Build streaks for bonus points!
                  </p>
                </div>
                
                {/* Question type preview */}
                <div className="flex flex-wrap justify-center gap-2">
                  {(['population', 'comparison', 'capital', 'flag', 'history'] as QuestionType[]).map(type => {
                    const Icon = TYPE_ICONS[type];
                    return (
                      <div key={type} className={cn("px-3 py-2 rounded-xl text-xs", TYPE_COLORS[type])}>
                        <Icon className="w-4 h-4 mx-auto mb-1" />
                        {TYPE_LABELS[type]}
                      </div>
                    );
                  })}
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Rounds', value: `${TOTAL_ROUNDS}` },
                    { label: 'Max Score', value: `${TOTAL_ROUNDS * 12}` },
                    { label: 'Streak Bonus', value: '+2' },
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

                {/* Question Type */}
                <div className="flex justify-center">
                  <QuestionTypeBadge type={current.type} />
                </div>

                {/* Question */}
                <div className="text-center py-4 space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                      Question {roundIdx + 1}
                    </div>
                    <div className="text-xl font-bold">{current.question}</div>
                  </div>
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 gap-2">
                  {current.options.map((option, index) => {
                    const isCorrect = index === current.correctAnswer;
                    const isSelected = selected === index;
                    let bg = 'bg-white/5 hover:bg-white/10 border-white/10 cursor-pointer';
                    if (result !== null) {
                      if (isCorrect) bg = 'bg-green-500/20 border-green-500/50 text-green-300';
                      else if (isSelected) bg = 'bg-red-500/20 border-red-500/50 text-red-300';
                      else bg = 'bg-white/5 border-white/5 opacity-50';
                    }
                    return (
                      <motion.button
                        key={index}
                        whileTap={result === null ? { scale: 0.98 } : {}}
                        onClick={() => handleSelect(index)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${bg}`}
                        disabled={result !== null}
                      >
                        <span className="font-medium">{option}</span>
                        {result !== null && isCorrect && <span className="text-green-400 text-sm">✓ Correct</span>}
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
                      className={`rounded-xl border ${
                        result === 'correct' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                            {result === 'correct' ? '✓ Correct!' : '✗ Wrong'}
                          </span>
                          {result === 'correct' && streak >= 2 && (
                            <span className="text-xs text-accent font-bold">
                              +{streak >= 3 ? 2 : 1} streak bonus!
                            </span>
                          )}
                        </div>
                        
                        {current.explanation && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {current.explanation}
                          </p>
                        )}
                        
                        <button
                          onClick={handleNext}
                          className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-bold transition-colors"
                        >
                          {roundIdx + 1 >= TOTAL_ROUNDS ? 'See Results' : 'Next Question'}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
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
                    You scored {score} out of {TOTAL_ROUNDS * 12} possible points
                  </p>
                </div>
                <ScoreBar score={score} total={TOTAL_ROUNDS * 12} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xl font-bold text-primary">{score}</div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-xl font-bold text-accent">{Math.round((score / (TOTAL_ROUNDS * 12)) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                
                {/* Question breakdown */}
                <div className="text-left">
                  <h3 className="text-sm font-semibold mb-2 text-center">Question Types</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(['population', 'comparison', 'capital', 'flag', 'history'] as QuestionType[]).map(type => {
                      const count = questionStats[type] || 0;
                      if (count === 0) return null;
                      const Icon = TYPE_ICONS[type];
                      return (
                        <div key={type} className={cn("px-2 py-1 rounded-lg text-xs flex items-center gap-1", TYPE_COLORS[type])}>
                          <Icon className="w-3 h-3" />
                          {count} {TYPE_LABELS[type]}
                        </div>
                      );
                    })}
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
