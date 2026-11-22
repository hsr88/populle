import React, { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { COMPARISON_PATH, EDITION_YEAR } from "@workspace/population";
import { BirthYearForm, WorldAnswer, IndiaEuropeHistory, PilotLinks, worldTitle, worldDescription, comparisonAnswer, contrastTitle, countryAnswer, quizIntro } from "./src/components/PopulationAnswers";
import { CountryDirectory, CountryOverview, countryDataset, countryTitle, profileYears, type CountrySnapshot } from "./src/components/CountryProfile";
import { COUNTRIES, getCityPopulation, getCountryTimeseries } from "../api-server/src/data/populationData";

const output = fileURLToPath(new URL("./dist/public/", import.meta.url));
const template = await readFile(path.join(output, "index.html"), "utf8");
const pagesDir = path.join(output, ".pages");
await mkdir(pagesDir, { recursive: true });
const site = "https://populle.com";

async function writePage(file: string, pathname: string, title: string, description: string, content: ReactNode, country?: CountrySnapshot) {
  const url = site + pathname;
  const metadata = renderToStaticMarkup(<>
    <title>{title}</title><meta name="description" content={description}/><link rel="canonical" href={url}/>
    <meta property="og:title" content={title}/><meta property="og:description" content={description}/>
    <meta property="og:url" content={url}/><meta name="twitter:title" content={title}/>
    <meta name="twitter:description" content={description}/>
  </>);
  const body = renderToStaticMarkup(<main className="mx-auto max-w-5xl space-y-8 p-6 sm:p-12">{content}<PilotLinks /></main>);
  const snapshot = country ? `<script type="application/json" id="country-snapshot">${JSON.stringify(country).replace(/</g, "\\u003c")}</script>` : "";
  const html = template.replace(/<!-- page metadata -->[\s\S]*?<!-- end page metadata -->/, () => metadata)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, original => country
      ? `<script type="application/ld+json">${JSON.stringify(countryDataset(country.iso3, country.name)).replace(/</g, "\\u003c")}</script>` : original)
    .replace('<div id="root"></div>', () => `${snapshot}<div id="root">${body}</div>`);
  if (!html.includes(metadata) || !html.includes(body)) throw new Error("Missing page template insertion point");
  await writeFile(path.join(pagesDir, file + ".html"), html);
}

await writePage("home", "/", worldTitle, worldDescription, <><WorldAnswer/><BirthYearForm/></>);
await writePage("contrast", COMPARISON_PATH, contrastTitle, comparisonAnswer(EDITION_YEAR),
  <><h1>India vs Europe population</h1><IndiaEuropeHistory/></>);
for (const { iso3, name } of COUNTRIES) {
  const series = getCountryTimeseries(iso3)!.data;
  const atYear = (year: number) => Math.round(series.find(point => point.year === year)!.population * 1000);
  const previous = atYear(EDITION_YEAR - 1);
  const people = atYear(EDITION_YEAR);
  const description = countryAnswer(EDITION_YEAR, people, previous);
  const snapshot = { iso3, name, previous, description, history: profileYears.map(year => ({ year, population: atYear(year) })) };
  const id = iso3.toLowerCase();
  await writePage(`country-${id}`, `/country/${id}`, countryTitle(name, EDITION_YEAR), description, <CountryOverview snapshot={snapshot}/>, snapshot);
}
await writePage("map", "/map", `World Population Map ${EDITION_YEAR} | Choropleth Visualization | Populle`,
  "Explore populations by country and open a profile for annual estimates and projections.",
  <><h1>World population map</h1><CountryDirectory countries={COUNTRIES}/></>);
const cities = getCityPopulation(EDITION_YEAR).slice(0, 20);
await writePage("cities", "/cities", `Top 20 Largest Cities in ${EDITION_YEAR} | World's Biggest Cities | Populle`,
  "Browse the city population ranking and open a city profile.",
  <><h1>Top 20 largest cities</h1><ol>{cities.map(c => <li key={c.id}><a href={`/city/${c.id}`}>{c.name}</a> · {c.country}</li>)}</ol></>);
await writePage("quiz", "/quiz", "Population Quiz | Populle", quizIntro,
  <><h1>Population Quiz</h1><p>{quizIntro}</p><noscript>Enable JavaScript to play the quiz.</noscript></>);
