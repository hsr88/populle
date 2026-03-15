# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── populle/            # Populle - World Population Visualization (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Populle App (artifacts/populle)

A full-stack world population visualization app at populle.com domain.

### Features
- **3D Globe** (Home): Interactive react-globe.gl globe with country population as colored points + city amber markers, auto-rotation, tooltips. Falls back gracefully if WebGL unavailable. Shows Ancient Era panel for years < 1800.
- **World Map** (Map): react-simple-maps choropleth with d3-scale color coding by population, zoomable, tooltips. Shows Ancient Era panel for years < 1800.
- **Top Cities** (Cities): Animated ranked list of top 20 cities by population with framer-motion transitions. Shows Ancient Era panel for years < 1800.
- **Compare** (Compare): recharts line chart comparing up to 5 countries/cities 1800–2100. Search powered by API (not hardcoded list). Supports both countries and cities via `type=auto`.
- **Dashboard** (Stats): Global stats (world pop, urbanization, largest country/city) + pie chart and progress bars by continent. Shows ancient estimates for years < 1800.
- **Year Slider**: Non-linear piecewise timeline slider: 10,000 BCE to 2100 CE. Ancient era (30% of slider width) → 10000 BCE–1800 CE; modern era (70%) → 1800–2100. BCE/CE year formatting. Play speed varies by era. Era label: Prehistoric/Ancient World/Classical/Medieval/Early Modern/Historical/UN Data/Projection.
- **Ancient Era**: Full world population data from 10,000 BCE based on HYDE 3.3 / McEvedy & Jones / Maddison Project. Continent breakdown, urbanization, dominant region, largest city for each era.

### Data
- ~50 countries with historically-grounded population data from **1800–2100** (medium/high/low UN-style variants)
- ~30 major world cities with population timeseries
- **Ancient world population**: 10,000 BCE to 1800 CE from HYDE 3.3, McEvedy & Jones, Maddison Project
- All served from `artifacts/api-server` Express backend
- Data file: `artifacts/api-server/src/data/populationData.ts`
- Year utilities: `artifacts/populle/src/lib/timeUtils.ts` (sliderToYear, yearToSlider, formatYear, getEraLabel, getPlaybackStep)

### API Endpoints
- `GET /api/population/countries?year=&continent=&variant=`
- `GET /api/population/cities?year=&limit=&continent=`
- `GET /api/population/timeseries?locations=&type=&variant=`
- `GET /api/population/summary?year=`
- `GET /api/population/search?q=&type=`

### Frontend Views / Pages
- `/` — 3D Globe (react-globe.gl)
- `/map` — Choropleth Map with Population/Density toggle (log scale heatmap) + flags in country panel
- `/cities` — Top 20 Cities
- `/compare` — Country Comparison
- `/stats` — Global Stats Dashboard
- `/quiz` — Population Quiz (10 rounds, 4 choices, streak bonuses, letter grade)

### Frontend Packages
- react-globe.gl (3D globe)
- react-simple-maps (2D choropleth map)
- d3-scale (color scales; log scale for density heatmap)
- recharts (charts)
- framer-motion (animations)
- lucide-react (icons)
- @tanstack/react-query (data fetching via Orval-generated hooks)
- flagcdn.com (country flag images via ISO2 codes)

### Shared Utilities
- `countryUtils.ts` — ISO3→ISO2 map, `getFlagUrl`, `shuffle`
- `timeUtils.ts` — piecewise slider mapping (10k BCE–2100 CE), era labels, `formatYear`
- YearSlider — 9 historical event dots with hover tooltips; clicking jumps to that year

### Data Attribution
- UN World Population Prospects 2024
- UN World Urbanization Prospects 2025
- Projections are estimates

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
