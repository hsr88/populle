import { annualPopulation } from "./annualPopulation";

export const EDITION_YEAR = 2026;
export const FIRST_YEAR = 1950;
export const PROJECTION_START = 2024;
export const LAST_YEAR = 2100;
export const WPP_URL = "https://population.un.org/wpp/";
export const COMPARISON_PATH = "/contrast";
export type PopulationVariant = "medium" | "high" | "low";
export type WppLocation = keyof typeof annualPopulation;

export function hasAnnualData(year: number): boolean {
  return Number.isInteger(year) && year >= FIRST_YEAR && year <= LAST_YEAR;
}

export function population(location: WppLocation, year: number, variant: PopulationVariant = "medium"): number {
  if (!hasAnnualData(year)) throw new RangeError(`WPP has no annual value for ${year}`);
  return annualValue(annualPopulation[location], year, variant);
}

export function annualValue(series: Record<PopulationVariant, number[]>, year: number, variant: PopulationVariant): number {
  if (year < PROJECTION_START || variant === "medium") return series.medium[year - FIRST_YEAR];
  return series[variant][year - PROJECTION_START];
}

export const comparisonYears = Array.from({ length: EDITION_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);
export const crossoverYear = comparisonYears.find(year => population("IND", year) > population("Europe", year))!;

export function comparisonPath(search: URLSearchParams): string {
  const mode = search.get("mode") || "preset";
  if (mode === "preset") {
    const pair = search.get("pair") || "india-europe";
    return pair === "india-europe" ? COMPARISON_PATH : `/contrast?pair=${encodeURIComponent(pair)}`;
  }
  const params = new URLSearchParams({ mode, left: search.get("left") || "", right: search.get("right") || "" });
  return `/contrast?${params}`;
}
