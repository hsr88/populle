// Piecewise non-linear slider: 30% ancient (-10000 to 1800), 70% modern (1800-2100)
const SLIDER_STEPS = 1000;
const SLIDER_BREAK = 300;
const YEAR_ANCIENT_MIN = -10000;
const YEAR_BREAK = 1800;
const YEAR_MAX = 2100;

export function sliderToYear(s: number): number {
  if (s <= SLIDER_BREAK) {
    return Math.round(YEAR_ANCIENT_MIN + (s / SLIDER_BREAK) * (YEAR_BREAK - YEAR_ANCIENT_MIN));
  }
  return Math.round(YEAR_BREAK + ((s - SLIDER_BREAK) / (SLIDER_STEPS - SLIDER_BREAK)) * (YEAR_MAX - YEAR_BREAK));
}

export function yearToSlider(year: number): number {
  if (year <= YEAR_BREAK) {
    return ((year - YEAR_ANCIENT_MIN) / (YEAR_BREAK - YEAR_ANCIENT_MIN)) * SLIDER_BREAK;
  }
  return SLIDER_BREAK + ((year - YEAR_BREAK) / (YEAR_MAX - YEAR_BREAK)) * (SLIDER_STEPS - SLIDER_BREAK);
}

export const SLIDER_MIN = 0;
export const SLIDER_MAX = SLIDER_STEPS;
export const YEAR_MIN = YEAR_ANCIENT_MIN;

export function formatYear(year: number): string {
  if (year <= 0) {
    const abs = Math.abs(year);
    if (abs >= 10000) return `${(abs / 1000).toFixed(0)}k BCE`;
    if (abs >= 1000) return `${(abs / 1000).toFixed(1)}k BCE`;
    return `${abs} BCE`;
  }
  if (year < 1800) return `${year} CE`;
  return year.toString();
}

export function formatYearFull(year: number): string {
  if (year === 0) return '1 BCE';
  if (year < 0) return `${Math.abs(year).toLocaleString()} BCE`;
  if (year < 1800) return `${year} CE`;
  return year.toString();
}

export function getEraLabel(year: number): string {
  if (year < -4999) return 'Prehistoric';
  if (year < -999)  return 'Ancient World';
  if (year < 500)   return 'Classical Era';
  if (year < 1000)  return 'Early Medieval';
  if (year < 1500)  return 'Medieval';
  if (year < 1800)  return 'Early Modern';
  if (year < 1950)  return 'Historical Est.';
  if (year <= 2025) return 'UN Data';
  return 'Projection';
}

export function getPlaybackStep(year: number): number {
  if (year < -4999) return 500;
  if (year < -999)  return 100;
  if (year < 1)     return 50;
  if (year < 1500)  return 25;
  if (year < 1800)  return 10;
  return 1;
}

export const isAncient = (year: number) => year < 1800;
