import { Router, type IRouter } from "express";
import {
  GetCountryPopulationResponse,
  GetCityPopulationResponse,
  GetPopulationTimeseriesResponse,
  GetPopulationSummaryResponse,
} from "@workspace/api-zod";
import {
  getCountryPopulation,
  getCityPopulation,
  getCountryTimeseries,
  getCityTimeseries,
  getWorldSummary,
  COUNTRIES,
  CITIES,
} from "../data/populationData.js";

const router: IRouter = Router();

const COLORS = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#14B8A6",
];

router.get("/countries", (req, res) => {
  const year = parseInt(req.query.year as string) || 2025;
  const continent = (req.query.continent as string) || "";
  const variant = (req.query.variant as string) || "medium";

  let data = getCountryPopulation(
    Math.min(2100, Math.max(1800, year)),
    variant as "medium" | "high" | "low"
  );

  if (continent && continent !== "all") {
    data = data.filter(c => c.continent.toLowerCase() === continent.toLowerCase());
  }

  const response = GetCountryPopulationResponse.parse({
    data,
    year,
    totalCountries: data.length,
  });

  res.json(response);
});

router.get("/cities", (req, res) => {
  const year = parseInt(req.query.year as string) || 2025;
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const continent = (req.query.continent as string) || "";

  let data = getCityPopulation(Math.min(2100, Math.max(1800, year)));

  if (continent && continent !== "all") {
    data = data.filter(c => c.continent.toLowerCase() === continent.toLowerCase());
  }

  data = data.slice(0, limit);

  const response = GetCityPopulationResponse.parse({
    data,
    year,
    totalCities: data.length,
  });

  res.json(response);
});

router.get("/timeseries", (req, res) => {
  const locationsParam = (req.query.locations as string) || "";
  const type = (req.query.type as string) || "country";
  const variant = (req.query.variant as string) || "medium";

  const locationNames = locationsParam.split(",").map(l => l.trim()).filter(Boolean);

  const locations = locationNames.map((name, idx) => {
    let series;
    if (type === "city") {
      series = getCityTimeseries(name);
    } else if (type === "auto" || type === "both") {
      series = getCountryTimeseries(name, variant as "medium" | "high" | "low");
      if (!series) series = getCityTimeseries(name);
    } else {
      series = getCountryTimeseries(name, variant as "medium" | "high" | "low");
    }
    if (!series) return null;
    return { ...series, color: COLORS[idx % COLORS.length] };
  }).filter(Boolean);

  const response = GetPopulationTimeseriesResponse.parse({
    locations,
    variant,
  });

  res.json(response);
});

router.get("/summary", (req, res) => {
  const year = parseInt(req.query.year as string) || 2026;
  const summary = getWorldSummary(Math.min(2100, Math.max(-10000, year)));

  const response = GetPopulationSummaryResponse.parse(summary);
  res.json(response);
});

router.get("/search", (req, res) => {
  const q = ((req.query.q as string) || "").toLowerCase();
  const type = (req.query.type as string) || "both";

  const results: Array<{ name: string; type: string; continent: string }> = [];

  if (type === "both" || type === "country") {
    COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.iso3.toLowerCase().includes(q))
      .slice(0, 10)
      .forEach(c => results.push({ name: c.name, type: "country", continent: c.continent }));
  }

  if (type === "both" || type === "city") {
    CITIES.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
      .slice(0, 10)
      .forEach(c => results.push({ name: c.name, type: "city", continent: c.continent }));
  }

  res.json({ results });
});

export default router;
