import React, { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { COMPARISON_PATH, EDITION_YEAR } from "@workspace/population";
import { BirthYearForm, WorldAnswer, IndiaEuropeHistory, VenezuelaAnswer, PilotLinks, worldTitle, worldDescription, comparisonAnswer, contrastTitle, venezuelaAnswer, quizIntro } from "./src/components/PopulationAnswers";

const output = fileURLToPath(new URL("./dist/public/", import.meta.url));
const template = await readFile(path.join(output, "index.html"), "utf8");
const pagesDir = path.join(output, ".pages");
await mkdir(pagesDir, { recursive: true });
const site = "https://populle.com";

async function writePage(file: string, pathname: string, title: string, description: string, content: ReactNode) {
  const url = site + pathname;
  const metadata = renderToStaticMarkup(<>
    <title>{title}</title><meta name="description" content={description}/><link rel="canonical" href={url}/>
    <meta property="og:title" content={title}/><meta property="og:description" content={description}/>
    <meta property="og:url" content={url}/><meta name="twitter:title" content={title}/>
    <meta name="twitter:description" content={description}/>
  </>);
  const body = renderToStaticMarkup(<main className="mx-auto max-w-5xl space-y-8 p-6 sm:p-12">{content}<PilotLinks /></main>);
  const html = template.replace(/<!-- page metadata -->[\s\S]*?<!-- end page metadata -->/, () => metadata)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  if (!html.includes(metadata) || !html.includes(body)) throw new Error("Missing page template insertion point");
  await writeFile(path.join(pagesDir, file + ".html"), html);
}

await writePage("home", "/", worldTitle, worldDescription, <><WorldAnswer/><BirthYearForm/></>);
await writePage("contrast", COMPARISON_PATH, contrastTitle, comparisonAnswer(EDITION_YEAR),
  <><h1>India vs Europe population</h1><IndiaEuropeHistory/></>);
await writePage("venezuela", "/country/ven", `Venezuela Population ${EDITION_YEAR} | Populle`, venezuelaAnswer(EDITION_YEAR),
  <><h1>Venezuela population in {EDITION_YEAR}</h1><VenezuelaAnswer year={EDITION_YEAR}/></>);
await writePage("quiz", "/quiz", "Population Quiz | Populle", quizIntro,
  <><h1>Population Quiz</h1><p>{quizIntro}</p><noscript>Enable JavaScript to play the quiz.</noscript></>);
