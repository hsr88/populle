import React from "react";
import { EDITION_YEAR, PROJECTION_START, WPP_URL, type PopulationVariant } from "@workspace/population";
import { CountryAnswer } from "./PopulationAnswers";

export interface CountrySnapshot {
  iso3: string;
  name: string;
  previous: number;
  description: string;
  history: { year: number; population: number }[];
}

export const countryTitle = (name: string, year: number) => `${name} Population ${year} | Populle`;
export const profileYears = [1950, 1980, 2000, 2023, EDITION_YEAR - 1, EDITION_YEAR, 2050, 2100];

export function countryDataset(iso3: string, name: string, variant: PopulationVariant = "medium") {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${name} population history and projections`,
    description: `Historical approximations before 1950, UN estimates for 1950–2023 and ${variant} projections for 2024–2100.`,
    url: `https://populle.com/country/${iso3.toLowerCase()}`,
    spatialCoverage: { "@type": "Place", name },
    temporalCoverage: "1800/2100",
    citation: WPP_URL,
    distribution: { "@type": "DataDownload", encodingFormat: "application/json",
      contentUrl: `https://populle.com/api/population/timeseries?type=country&locations=${iso3}&variant=${variant}` },
  };
}

export function CountryHistory({ history }: Pick<CountrySnapshot, "history">) {
  return <details className="mt-4"><summary className="cursor-pointer text-sm">Population by year</summary>
    <table className="mt-3 w-full max-w-lg text-left text-sm tabular-nums">
      <caption className="py-2 text-left">Population on 1 July in selected years</caption>
      <thead><tr><th scope="col">Year</th><th scope="col">People</th><th scope="col">UN series</th></tr></thead>
      <tbody>{history.map(point => <tr key={point.year}><th scope="row">{point.year}</th><td>{point.population.toLocaleString("en-US")}</td><td>{point.year < PROJECTION_START ? "Estimate" : "Projection"}</td></tr>)}</tbody>
    </table></details>;
}

export function CountryOverview({ snapshot }: { snapshot: CountrySnapshot }) {
  return <><h1 className="text-3xl font-bold">{snapshot.name} population in {EDITION_YEAR}</h1>
    <CountryAnswer text={snapshot.description}/><CountryHistory history={snapshot.history}/></>;
}

export function CountryDirectory({ countries }: { countries: { iso3: string; name: string }[] }) {
  return <details className="rounded-xl border border-white/15 p-4"><summary className="cursor-pointer font-medium">Browse country populations</summary>
    <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
      {[...countries].sort((a, b) => a.name.localeCompare(b.name, "en")).map(c =>
        <li key={c.iso3}><a className="text-primary underline" href={`/country/${c.iso3.toLowerCase()}`}>{c.name}</a></li>)}
    </ul></details>;
}
