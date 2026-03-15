import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPopulation(val: number): string {
  if (val >= 1000) {
    return `${(val / 1000).toFixed(2)}B`;
  }
  return `${val.toFixed(1)}M`;
}

export function formatLargeNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}
