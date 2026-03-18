# Populle 🌍

**Interactive world population visualization from 10,000 BCE to 2100 CE**

[![Website](https://img.shields.io/badge/Website-populle.com-cyan)](https://populle.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Live Demo →](https://populle.com)

<img width="800" height="496" alt="POPULLE" src="https://github.com/user-attachments/assets/a3d82fff-4cd3-4872-be07-df90cbb48a27" />


## Features

- 🌐 **3D Globe** – Interactive globe with country population visualization
- 🗺️ **World Map** – Choropleth map with d3-scale color coding
- 🏙️ **Cities** – Top cities ranking with animated charts
- 📊 **Compare** – Compare up to 5 countries/cities (1800-2100)
- 📈 **Dashboard** – Global statistics with continent breakdowns
- 🧠 **Quiz** – 100+ questions about population, capitals, flags, and history
- ⏱️ **Time Slider** – Non-linear timeline from 10,000 BCE to 2100

## Data Sources

- [UN World Population Prospects 2024](https://population.un.org/wpp/)
- HYDE 3.3 database (ancient population: 10,000 BCE to 1800 CE)
- McEvedy & Jones historical estimates
- Maddison Project data

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 | Express 5 |
| TypeScript | PostgreSQL |
| Tailwind CSS 4 | Drizzle ORM |
| Three.js / React Globe | REST API |
| Framer Motion | |

## Getting Started

```bash
# Clone repository
git clone https://github.com/hsr88/populle.git
cd populle

# Install dependencies (requires pnpm)
pnpm install

# Build packages
pnpm run build

# Start development
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/populle run dev
```

## Project Structure

```
populle/
├── artifacts/
│   ├── populle/           # React frontend
│   ├── api-server/        # Express backend
│   └── mockup-sandbox/    # Component sandbox
├── lib/
│   ├── api-spec/          # OpenAPI specification
│   ├── api-client-react/  # Generated React Query hooks
│   ├── api-zod/           # Generated Zod schemas
│   └── db/                # Database schema
└── scripts/               # Utility scripts
```

## API

Public REST API endpoints:

```
GET /api/population/countries?year=2024&continent=Asia
GET /api/population/cities?year=2024&limit=10
GET /api/population/timeseries?locations=USA,CHN&type=country
GET /api/population/summary?year=2024
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

If you find Populle useful, consider supporting the project:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-orange)](https://ko-fi.com/hsr)

---

Built with ❤️ by [hsr](https://github.com/hsr88)
