import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";
import { COMPARISON_PATH, comparisonPath } from "@workspace/population";
import { CITIES, COUNTRIES } from "./data/populationData";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(process.cwd(), "artifacts/populle/dist/public");
  const countries = new Set(COUNTRIES.map(c => c.iso3.toLowerCase()));
  const cities = new Set(CITIES.flatMap(c => [c.id, c.name.toLowerCase().replace(/\s+/g, "-")]));
  const pages = new Set(["/story", "/globe", "/map", "/cities", "/compare", "/stats", "/about", "/faq", "/privacy",
    "/demographics/age-pyramid", "/demographics/gender", "/demographics/languages",
    "/economy/gdp", "/economy/urbanization", "/economy/density", "/economy/migration"]);
  const validStoryYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 1920 && Number(value) <= 2025;
  app.get("/index.html", (_req, res) => res.redirect(301, "/"));
  app.use(express.static(frontendDist, { index: false, redirect: false }));
  app.get("/{*splat}", (req, res) => {
    const url = new URL(req.originalUrl, "https://populle.com");
    let pathname: string;
    try {
      pathname = decodeURIComponent(url.pathname).replace(/\/+$/, "").toLowerCase() || "/";
    } catch {
      res.sendStatus(400);
      return;
    }
    const country = /^\/country\/([^/]+)$/.exec(pathname)?.[1];
    const city = /^\/city\/([^/]+)$/.exec(pathname)?.[1];
    const story = /^\/story\/(\d+)$/.exec(pathname)?.[1];
    const storyYear = url.searchParams.get("year");
    if (pathname === "/story" && storyYear && validStoryYear(storyYear)) {
      res.redirect(302, "/story/" + storyYear);
      return;
    }
    let document: string | undefined;
    if (pathname === "/") document = "home";
    if (pathname === "/quiz") document = "quiz";
    if (pathname === "/country/ven") document = "venezuela";
    if (pathname === COMPARISON_PATH && comparisonPath(url.searchParams) === COMPARISON_PATH) {
      if (url.searchParams.has("pair") || url.searchParams.has("mode")) {
        res.redirect(301, COMPARISON_PATH);
        return;
      }
      document = "contrast";
    }
    const known = document || pages.has(pathname) || pathname === COMPARISON_PATH ||
      (country && countries.has(country)) || (city && cities.has(city)) || (story && validStoryYear(story));
    if (!known) {
      res.set("X-Robots-Tag", "noindex").status(404).type("html").send(
        '<!doctype html><html lang="en"><meta charset="utf-8"><title>Page not found | Populle</title><main><h1>Page not found</h1><a href="/">Explore world population</a></main></html>'
      );
      return;
    }
    if (url.pathname !== encodeURI(pathname)) {
      res.redirect(301, encodeURI(pathname) + url.search);
      return;
    }
    res.sendFile(document ? path.join(frontendDist, ".pages", document + ".html") : path.join(frontendDist, "index.html"), { dotfiles: "allow" });
  });
}

export default app;
