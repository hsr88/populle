import { buildQuizResultUrl, SITE_URL } from '@/lib/share';

export interface QuizPersonality {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  insight: string;
  /** ShareCard accent */
  accent: 'cyan' | 'amber';
  /** Inclusive minimum score percentage (0–100) */
  minPct: number;
}

/** Ordered highest → lowest. First match where pct >= minPct wins. */
export const quizPersonalities: QuizPersonality[] = [
  {
    slug: 'future-demographer',
    title: 'Future Demographer',
    tagline: 'You see the century coming',
    description:
      'You read population curves like other people read weather apps. Capitals, continents, and century-scale shifts — all locked in.',
    insight: 'Your brain already lives in 2100. The rest of us are still buffering.',
    accent: 'amber',
    minPct: 90,
  },
  {
    slug: 'map-maximalist',
    title: 'Map Maximalist',
    tagline: 'Borders, flags, and vibes',
    description:
      'You know enough to impress at dinner and still argue about which megacity is “really” biggest. Strong atlas energy.',
    insight: 'You don’t just travel — you mentally recolor the choropleth.',
    accent: 'cyan',
    minPct: 70,
  },
  {
    slug: 'casual-world-citizen',
    title: 'Casual World Citizen',
    tagline: 'Globally aware, locally cozy',
    description:
      'You’ve got the big picture: India is huge, Tokyo is a lot, Europe is smaller than it feels. The fine print can wait.',
    insight: 'Solid world citizen energy — curious, not encyclopedic.',
    accent: 'cyan',
    minPct: 45,
  },
  {
    slug: 'living-in-1950',
    title: 'Still Living in 1950 Europe',
    tagline: 'Charming. Also outdated.',
    description:
      'Your mental map still puts Western Europe at the center of everything. Cute vintage vibe — the planet moved on.',
    insight: 'Time for a refresh: try the globe, then rematch.',
    accent: 'amber',
    minPct: 0,
  },
];

export function getPersonalityForScore(score: number, maxScore: number): QuizPersonality {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  for (const personality of quizPersonalities) {
    if (pct >= personality.minPct) return personality;
  }
  return quizPersonalities[quizPersonalities.length - 1]!;
}

export function getPersonalityBySlug(slug: string | null | undefined): QuizPersonality | null {
  if (!slug) return null;
  return quizPersonalities.find((p) => p.slug === slug) ?? null;
}

export function buildQuizSharePayload(
  personality: QuizPersonality,
  score: number,
  maxScore: number
): { title: string; text: string; url: string } {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const url = buildQuizResultUrl(personality.slug);
  return {
    title: `Populle Quiz — ${personality.title}`,
    text: `I'm a "${personality.title}" on the Populle Population Quiz (${score}/${maxScore} pts, ${pct}%). ${personality.tagline}.`,
    url,
  };
}

export { SITE_URL };
