import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "http://127.0.0.1:3000");
const get = path => fetch(new URL(path, base), { redirect: "manual" });
async function read(path) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  return response;
}

const countriesAt = async year => (await (await read("/api/population/countries?year=" + year)).json()).data;
const countries = await countriesAt(2026);
const previous = new Map((await countriesAt(2025)).map(c => [c.iso3, Math.round(c.population * 1000)]));
const urls = [...(await (await read("/sitemap.xml")).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
assert.equal(urls.length, new Set(urls).size, "Duplicate sitemap URL");
const directory = await (await read("/map")).text();
const htmlNumber = n => n.toLocaleString("en-US");
for (const c of countries) {
  const path = "/country/" + c.iso3.toLowerCase();
  assert(urls.includes(path) && directory.includes(`href="${path}"`), path);
  const html = await (await read(path)).text();
  const people = Math.round(c.population * 1000);
  const body = html.split('<div id="root">')[1].replaceAll("&#x27;", "'").replaceAll("&amp;", "&");
  assert(body.includes(`${c.name} population in 2026</h1>`), path);
  assert(body.includes(htmlNumber(people) + " people."), path);
  assert(body.includes(htmlNumber(previous.get(c.iso3))) && body.includes('href="https://population.un.org/wpp/"'), path);
  assert(html.includes(`rel="canonical" href="https://populle.com${path}"`), path);
  const dataset = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(dataset.spatialCoverage.name, c.name);
}
assert.equal(previous.get("BRA"), 212812405);
assert.equal(Math.round(countries.find(c => c.iso3 === "BRA").population * 1000), 213562666);
for (const variant of ["medium", "high", "low"]) {
  const { locations } = await (await read("/api/population/timeseries?locations=BRA,IND,VEN&variant=" + variant)).json();
  assert.equal(locations.length, 3);
  const at2026 = (await (await read("/api/population/countries?year=2026&variant=" + variant)).json()).data;
  for (const loc of locations) {
    const annual = loc.data.filter(p => p.year >= 1950);
    assert.equal(annual.length, 151);
    assert(annual.every((p, i) => p.year === 1950 + i && p.isProjection === (p.year >= 2024)));
    assert.equal(annual.find(p => p.year === 2026).population, at2026.find(c => c.name === loc.name).population);
  }
}
for (const path of ["/demographics/age-pyramid", "/demographics/gender", "/demographics/languages", "/economy/gdp", "/economy/density", "/economy/urbanization", "/economy/migration"]) {
  assert(!urls.includes(path), path);
  assert.match((await read(path)).headers.get("x-robots-tag"), /noindex/);
}
for (const alias of ["/city/s%C3%A3o-paulo", "/city/s-o-paulo", "/city/ho-chi-minh-city"]) {
  const response = await get(alias + "?from=share");
  assert.equal(response.status, 301);
  const target = alias.includes("minh") ? "/city/ho-chi-minh" : "/city/sao-paulo";
  assert.equal(response.headers.get("location"), target + "?from=share");
  assert((await read(target)).headers.get("link").includes(target + ">"));
}
assert((await (await read("/cities")).text()).includes('href="/city/sao-paulo"'));
assert((await (await read("/api/population/search?type=city&q=paulo")).json()).results.some(c => c.id === "sao-paulo"));
assert.equal((await get("/country/unknown")).status, 404);
const logo = await (await read("/images/logo-120.png")).arrayBuffer();
const background = await (await read("/images/space-bg.jpg")).arrayBuffer();
assert(logo.byteLength + background.byteLength < 100000);
console.log(`Checked ${countries.length} country pages, ${urls.length} sitemap URLs, population scenarios, city links, robots and ${logo.byteLength + background.byteLength} image bytes on ${base.origin}`);
