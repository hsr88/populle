import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { TrendingUp, Info } from "lucide-react";

export default function GDP() {
  return (
    <Layout>
      <SEO
        title="GDP per Capita | Populle - Economy & Population"
        description="Explore the relationship between economic prosperity and population. Compare GDP per capita across countries and analyze economic-demographic correlations."
        keywords="GDP per capita, economy, economic data, prosperity, wealth distribution, economic demographics, country GDP"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">GDP per Capita</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Economic prosperity and population correlation
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're integrating economic data with population statistics. 
            Explore how GDP per capita relates to population size, growth, and demographics.
          </p>
          
          <div className="glass-panel rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm text-muted-foreground">
                <strong className="text-white block mb-1">Planned features:</strong>
                <ul className="space-y-1">
                  <li>• GDP per capita by country</li>
                  <li>• Economic growth vs population trends</li>
                  <li>• Purchasing power parity comparisons</li>
                  <li>• Historical economic development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { country: "Luxembourg", gdp: "$135,610", flag: "🇱🇺" },
            { country: "Singapore", gdp: "$91,730", flag: "🇸🇬" },
            { country: "Ireland", gdp: "$99,240", flag: "🇮🇪" },
            { country: "USA", gdp: "$85,370", flag: "🇺🇸" },
          ].map((item) => (
            <div key={item.country} className="glass-panel rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{item.flag}</div>
              <h3 className="font-semibold text-white mb-1">{item.country}</h3>
              <div className="text-xl font-bold text-primary">{item.gdp}</div>
              <p className="text-xs text-muted-foreground">GDP per capita</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
