import React, { useState } from "react";
import {
  COMPARISON_PATH, EDITION_YEAR, FIRST_YEAR, PROJECTION_START, WPP_URL,
  comparisonYears, crossoverYear, population, type PopulationVariant,
} from "@workspace/population";

const number = new Intl.NumberFormat("en-US");
const millions = (value: number) => (value / 1_000_000).toFixed(1);
const worldBillions = (population("World", EDITION_YEAR) / 1_000_000_000).toFixed(2);

export const quizIntro = "Test your knowledge with 10 random questions about world population, countries, capitals, and demographics.";
export const worldTitle = `World Population in ${EDITION_YEAR} | Populle`;
export const worldDescription = `The UN projects a world population of ${worldBillions} billion on 1 July ${EDITION_YEAR}. Explore how the world has changed since your birth year.`;
export const contrastTitle = `India vs Europe Population in ${EDITION_YEAR} | Populle`;
export function comparisonAnswer(year: number): string {
  const india = population("IND", year);
  const europe = population("Europe", year);
  const period = year < PROJECTION_START ? "UN estimates" : "UN medium projections";
  return `${period} for 1 July ${year} put India at ${number.format(Number(millions(india)))} million people and Europe at ${millions(europe)} million. India’s population was ${(india / europe).toFixed(2)} times Europe’s on that basis.`;
}
export function venezuelaAnswer(year: number, variant: PopulationVariant = "medium"): string {
  const value = population("VEN", year, variant);
  const label = year < PROJECTION_START ? "UN estimate" : `UN ${variant} projection`;
  const first = `${label} for 1 July ${year}: ${number.format(value)} people.`;
  if (year === FIRST_YEAR) return first;
  const previous = population("VEN", year - 1, variant);
  const delta = value - previous;
  return `${first} ${number.format(Math.abs(delta))} ${delta >= 0 ? "more" : "fewer"} than in ${year - 1} (${delta >= 0 ? "+" : "−"}${Math.abs(delta / previous * 100).toFixed(2)}%).`;
}
export function Source() {
  return <a className="text-sm text-primary underline underline-offset-4" href={WPP_URL}>UN World Population Prospects 2024</a>;
}

export function WorldAnswer() {
  return <section className="max-w-3xl">
    <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">What is the world population in {EDITION_YEAR}?</h1>
    <p className="my-4 font-display text-5xl font-bold leading-none text-primary sm:text-7xl">{worldBillions} billion</p>
    <p className="mb-2 text-muted-foreground">Projected population on 1 July {EDITION_YEAR}, UN medium scenario.</p>
    <Source />
  </section>;
}

export function BirthYearForm() {
  return <form action="/story" method="get" className="flex flex-wrap items-end gap-3" onSubmit={event => {
    event.preventDefault();
    window.location.assign(`/story/${new FormData(event.currentTarget).get("year")}`);
  }}>
    <div>
      <label htmlFor="birth-year" className="mb-2 block font-medium">Enter your birth year to see how the world has changed</label>
      <input id="birth-year" name="year" type="number" min="1920" max="2025" required defaultValue="1995"
        className="w-32 rounded-lg border border-white/25 bg-background px-4 py-3 text-xl tabular-nums"/>
    </div>
    <button type="submit" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">See my birth year</button>
  </form>;
}

export function VenezuelaAnswer({ year, variant = "medium" }: { year: number; variant?: PopulationVariant }) {
  return <div className="mt-4 space-y-2">
    <p className="max-w-xl text-lg tabular-nums">{venezuelaAnswer(year, variant)}</p>
    <Source />
  </div>;
}

export function IndiaEuropeHistory() {
  const [year, setYear] = useState(EDITION_YEAR);
  const width = 640, height = 230;
  const x = (y: number) => 51 + (y - FIRST_YEAR) / (EDITION_YEAR - FIRST_YEAR) * 565;
  const y = (people: number) => 197 - people / 1_500_000_000 * 165;
  const points = (region: "IND" | "Europe", years: number[]) => years.map(t => `${x(t).toFixed(1)},${y(population(region, t)).toFixed(1)}`).join(" ");
  return <section className="my-5 max-w-3xl space-y-4">
    <p className="max-w-2xl text-lg leading-relaxed">{comparisonAnswer(year)}</p>
    <figure className="rounded-xl border border-white/15 bg-background/70 p-3 sm:p-5">
      <figcaption className="font-semibold">India overtook Europe in {crossoverYear}</figcaption>
      <p className="mt-1 text-sm text-muted-foreground">Mid-year population in millions. Solid lines show estimates through 2023. Dashed lines show medium projections from 2024.</p>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`India first exceeded Europe’s population in ${crossoverYear}. Annual figures are available in the table below.`} className="mt-2 w-full">
        {[0, 500, 1000, 1500].map(tick => <g key={tick}>
          <line x1="51" x2="616" y1={y(tick * 1e6)} y2={y(tick * 1e6)} stroke="#475569" strokeWidth=".7"/>
          <text x="43" y={y(tick * 1e6) + 4} textAnchor="end" fill="#cbd5e1" fontSize="12">{tick}</text>
        </g>)}
        {[FIRST_YEAR, crossoverYear, EDITION_YEAR].map(t => <text key={t} x={x(t)} y="219" textAnchor="middle" fill="#cbd5e1" fontSize="13">{t}</text>)}
        <line x1={x(crossoverYear)} x2={x(crossoverYear)} y1="29" y2="197" stroke="#94a3b8" strokeDasharray="3 5"/>
        {(["IND", "Europe"] as const).map(region => <g key={region} fill="none" stroke={region === "IND" ? "#22d3ee" : "#fbbf24"} strokeWidth="3">
          <polyline points={points(region, comparisonYears.filter(t => t < PROJECTION_START))}/>
          <polyline strokeDasharray="4 3" points={points(region, comparisonYears.filter(t => t >= PROJECTION_START - 1))}/>
          <circle cx={x(year)} cy={y(population(region, year))} r="4" fill="currentColor"/>
        </g>)}
      </svg>
      <div className="flex gap-6 text-sm"><span className="text-cyan-300">India</span><span className="text-amber-300">Europe</span></div>
      <label htmlFor="comparison-year" className="mt-4 block text-sm">Comparison year <strong>{year}</strong></label>
      <input id="comparison-year" type="range" min={FIRST_YEAR} max={EDITION_YEAR} value={year}
        onChange={event => setYear(Number(event.target.value))} className="w-full accent-cyan-400"/>
    </figure>
    <p className="text-sm text-muted-foreground">Europe covers the UN geographic region, including Russia. Türkiye is in Western Asia. <a className="underline" href="https://unstats.un.org/unsd/methodology/m49/">UN regional definitions</a></p>
    <Source />
    <details><summary className="cursor-pointer text-sm">View annual figures</summary>
      <div className="mt-3 max-h-72 overflow-auto" role="region" tabIndex={0} aria-labelledby="annual-population-caption"><table className="w-full text-left text-sm tabular-nums">
        <caption id="annual-population-caption" className="py-2 text-left">Population on 1 July, in millions</caption>
        <thead><tr>{["Year","India","Europe"].map(name => <th key={name} scope="col" className="py-1">{name}</th>)}</tr></thead>
        <tbody>{comparisonYears.map(t => <tr key={t}><th scope="row">{t}</th><td>{millions(population("IND",t))}</td><td>{millions(population("Europe",t))}</td></tr>)}</tbody>
      </table></div>
    </details>
  </section>;
}

export function PilotLinks() {
  return <nav aria-label="Explore population" className="flex flex-wrap gap-5 text-sm text-primary underline">
    <a href={COMPARISON_PATH}>India vs Europe population</a><a href="/country/ven">Venezuela population</a><a href="/quiz">Population quiz</a>
  </nav>;
}
