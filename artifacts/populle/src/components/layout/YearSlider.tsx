import { useState } from 'react';
import { Play, Pause, FastForward, Rewind, Landmark } from 'lucide-react';
import { usePopulationState } from '@/context/PopulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  sliderToYear, yearToSlider,
  SLIDER_MIN, SLIDER_MAX,
  formatYear, formatYearFull, getEraLabel,
  isAncient,
} from '@/lib/timeUtils';

// Key years to show as tick marks — keep sparse in ancient (compressed) zone
const ALL_TICKS    = [-10000, -5000, -1000, 1800, 1900, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2026, 2030, 2040, 2050, 2100];
const MOBILE_TICKS = [-10000, -5000, -1000, 1800, 1950, 2000, 2026, 2050, 2100];

const HISTORICAL_EVENTS = [
  // Ancient plagues & catastrophes
  { year: -5500,  icon: '🌾', label: 'Neolithic Revolution',      color: '#22c55e',  impact: 'Agriculture spreads — first sustained population growth in history' },
  { year: -3500,  icon: '🏙️', label: 'First Cities',              color: '#06b6d4',  impact: 'Mesopotamia & Egypt urbanize; writing and organized society emerge' },
  { year: -430,   icon: '☠️', label: 'Plague of Athens',          color: '#ef4444',  impact: '~75–100K deaths; killed ~25% of Athenian forces and population' },
  { year: 165,    icon: '☠️', label: 'Antonine Plague',           color: '#ef4444',  impact: '5–10M deaths across the Roman Empire' },
  { year: 541,    icon: '☠️', label: 'Plague of Justinian',       color: '#ef4444',  impact: '25–50M deaths — first recorded pandemic, shrank Europe\'s population' },
  { year: 1200,   icon: '⚔️', label: 'Mongol Conquests',          color: '#f97316',  impact: '30–40M deaths; conquered lands lost up to 80% of their population' },
  { year: 1347,   icon: '☠️', label: 'Black Death',               color: '#ef4444',  impact: '75–200M deaths — killed 30–60% of Europe\'s entire population' },
  // Early Modern
  { year: 1492,   icon: '⚓', label: 'Columbian Exchange',        color: '#f59e0b',  impact: 'European diseases wiped out ~90% of indigenous American peoples' },
  { year: 1618,   icon: '⚔️', label: 'Thirty Years\' War',        color: '#f97316',  impact: '~8M deaths; Central Europe lost up to a third of its population' },
  { year: 1720,   icon: '☠️', label: 'Great Plague of Marseille', color: '#ef4444',  impact: 'Last major plague outbreak in Western Europe; ~100K dead' },
  // Industrial & Modern era
  { year: 1800,   icon: '🌍', label: '1 Billion People',          color: '#8b5cf6',  impact: 'World population crosses 1 billion for the first time' },
  { year: 1845,   icon: '🥔', label: 'Irish Potato Famine',       color: '#f97316',  impact: '1M dead, 2M emigrated — Ireland lost 25% of its population' },
  { year: 1850,   icon: '🏭', label: 'Industrial Revolution',     color: '#06b6d4',  impact: 'Steam power & medicine accelerate population growth dramatically' },
  { year: 1914,   icon: '⚔️', label: 'World War I',              color: '#f97316',  impact: '20M deaths; reshapes borders and triggers the Spanish Flu' },
  { year: 1918,   icon: '😷', label: 'Spanish Flu',               color: '#ef4444',  impact: '50–100M deaths worldwide — one of history\'s deadliest pandemics' },
  { year: 1928,   icon: '💊', label: 'Penicillin Discovered',     color: '#22c55e',  impact: 'Antibiotics begin saving hundreds of millions of lives globally' },
  { year: 1939,   icon: '⚔️', label: 'World War II',             color: '#f97316',  impact: '70–85M deaths; deadliest conflict in history' },
  { year: 1945,   icon: '🕊️', label: 'Post-WWII Baby Boom',      color: '#22c55e',  impact: 'Birth rates surge worldwide; population grows at record pace' },
  { year: 1959,   icon: '🌾', label: 'Great Chinese Famine',      color: '#ef4444',  impact: '15–55M deaths from famine during the Great Leap Forward' },
  { year: 1960,   icon: '🌱', label: 'Green Revolution',          color: '#22c55e',  impact: 'High-yield crops and fertilizers feed billions; famines decline sharply' },
  { year: 1967,   icon: '💉', label: 'Smallpox Eradication Drive',color: '#22c55e',  impact: 'Global vaccination campaign begins; smallpox eradicated by 1980' },
  { year: 1974,   icon: '🌍', label: '4 Billion People',          color: '#8b5cf6',  impact: 'World population reaches 4 billion — doubling in just 47 years' },
  { year: 1987,   icon: '🌍', label: '5 Billion People',          color: '#8b5cf6',  impact: 'World population reaches 5 billion' },
  { year: 1999,   icon: '🌍', label: '6 Billion People',          color: '#8b5cf6',  impact: 'World population reaches 6 billion' },
  { year: 2011,   icon: '🌍', label: '7 Billion People',          color: '#8b5cf6',  impact: 'World population reaches 7 billion' },
  { year: 2020,   icon: '🦠', label: 'COVID-19 Pandemic',         color: '#ef4444',  impact: '7M+ official deaths; first pandemic to halt global air travel' },
  { year: 2022,   icon: '🌍', label: '8 Billion People',          color: '#8b5cf6',  impact: 'World population reaches 8 billion — slowest growth rate since 1950' },
  { year: 2080,   icon: '📉', label: 'Peak Population (proj.)',   color: '#06b6d4',  impact: 'UN median: global population peaks ~10.3B then slowly declines' },
];

const SLIDER_BREAK_PCT = 30; // % of bar width given to ancient period (0 to 1800)

function sliderPos(year: number): string {
  return `${yearToSlider(year) / SLIDER_MAX * 100}%`;
}

export function YearSlider() {
  const { year, setYear, isPlaying, togglePlay } = usePopulationState();
  const [hoveredEvent, setHoveredEvent] = useState<typeof HISTORICAL_EVENTS[0] | null>(null);
  const [showEvents, setShowEvents] = useState(true);

  const sliderVal = yearToSlider(year);
  const progressPct = (sliderVal / SLIDER_MAX) * 100;
  const ancient = isAncient(year);
  const eraLabel = getEraLabel(year);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(sliderToYear(parseInt(e.target.value, 10)));
  };

  const renderTicks = (ticks: number[]) => (
    <div className="relative h-3 w-full select-none">
      {/* Break indicator */}
      <div
        className="absolute top-0 h-full w-px bg-accent/40"
        style={{ left: `${SLIDER_BREAK_PCT}%` }}
        title="1800 CE — country data starts here"
      />
      {ticks.map(y => {
        const left = sliderPos(y);
        const isAccent = y === 2026;
        const isBCE = y <= 0;
        return (
          <span
            key={y}
            className={`absolute text-[8px] lg:text-[9px] font-medium leading-none whitespace-nowrap
              ${isAccent ? 'text-accent font-bold' : isBCE ? 'text-amber-400/80' : 'text-muted-foreground'}
              ${y <= -10000 ? '' : y >= 2100 ? '' : '-translate-x-1/2'}`}
            style={{
              left: y >= 2100 ? 'auto' : left,
              right: y >= 2100 ? '0' : 'auto',
            }}
          >
            {formatYear(y)}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 px-3 lg:left-64 lg:px-6 z-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel rounded-2xl px-4 py-3 lg:px-6 lg:py-4"
      >
        <div className="flex items-center gap-3">
          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setYear(-10000)}
              className="p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              title="Jump to 10,000 BCE"
            >
              <Rewind className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 transition-transform active:scale-95"
            >
              {isPlaying
                ? <Pause className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />
                : <Play  className="w-4 h-4 lg:w-5 lg:h-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={() => setYear(2100)}
              className="p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              title="Jump to 2100"
            >
              <FastForward className="w-4 h-4" />
            </button>
            {/* Toggle historical events — desktop only */}
            <button
              onClick={() => setShowEvents(v => !v)}
              className={`hidden sm:flex p-1.5 rounded-full transition-colors ml-0.5 ${
                showEvents
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/10 text-muted-foreground hover:text-white'
              }`}
              title={showEvents ? 'Hide historical events' : 'Show historical events'}
            >
              <Landmark className="w-4 h-4" />
            </button>
          </div>

          {/* Slider area */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            {/* Year display + labels */}
            <div className="flex justify-between items-center px-0.5">
              <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${ancient ? 'text-amber-400' : 'text-muted-foreground'}`}>
                {ancient ? 'Ancient Era' : 'Historical'}
              </span>
              <div className="text-center flex-1 sm:flex-none">
                <span className="text-xl lg:text-3xl font-bold text-white leading-none">
                  {formatYearFull(year)}
                </span>
                <span className={`block text-[9px] uppercase tracking-widest ${ancient ? 'text-amber-400' : 'text-accent'}`}>
                  {eraLabel}
                </span>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:block">
                Projection
              </span>
            </div>

            {/* Slider track — gradient shows ancient (amber) vs modern (cyan) */}
            <div className="relative">
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step="1"
                value={sliderVal}
                onChange={handleSliderChange}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    #f59e0b ${Math.min(progressPct, SLIDER_BREAK_PCT)}%,
                    ${progressPct > SLIDER_BREAK_PCT ? `#f59e0b ${SLIDER_BREAK_PCT}%, hsl(var(--primary)) ${SLIDER_BREAK_PCT}%, hsl(var(--primary)) ${progressPct}%` : ''},
                    rgba(255,255,255,0.1) ${progressPct}%)`
                }}
              />
              {/* Historical event dots + tooltip — desktop only */}
              <AnimatePresence>
                {showEvents && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:block absolute inset-0 pointer-events-none overflow-visible"
                  >
                    {HISTORICAL_EVENTS.map(ev => (
                      <div
                        key={ev.year}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-auto overflow-visible"
                        style={{ left: sliderPos(ev.year) }}
                      >
                        <button
                          className="w-2.5 h-2.5 rounded-full border-2 bg-[rgba(0,0,0,0.85)] cursor-pointer hover:scale-[1.8] transition-transform z-10 block"
                          style={{ borderColor: ev.color }}
                          onMouseEnter={() => setHoveredEvent(ev)}
                          onMouseLeave={() => setHoveredEvent(null)}
                          onClick={() => setYear(ev.year)}
                          title={ev.label}
                        />
                        <AnimatePresence>
                          {hoveredEvent?.year === ev.year && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              className="absolute bottom-full mb-3 -translate-x-1/2 z-50 pointer-events-none w-56"
                              style={{ left: '50%' }}
                            >
                              <div
                                className="bg-[rgba(3,7,18,0.97)] border rounded-xl px-3 py-2 shadow-2xl text-left"
                                style={{ borderColor: ev.color + '60' }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm">{ev.icon}</span>
                                  <span className="font-bold text-white text-xs leading-tight">{ev.label}</span>
                                  <span className="ml-auto text-[10px] font-bold shrink-0" style={{ color: ev.color }}>
                                    {ev.year < 0 ? `${Math.abs(ev.year)} BCE` : `${ev.year} CE`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed">{ev.impact}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ticks — desktop / mobile */}
            <div className="hidden sm:block">{renderTicks(ALL_TICKS)}</div>
            <div className="sm:hidden">{renderTicks(MOBILE_TICKS)}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
