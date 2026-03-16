import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Plane, Info } from "lucide-react";

export default function Migration() {
  return (
    <Layout>
      <SEO
        title="Net Migration | Populle - Global Migration Flows"
        description="Explore international migration patterns. See where people are moving to and from, and understand global migration trends."
        keywords="migration, immigration, emigration, net migration, migration flows, people moving, migration trends"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Plane className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Net Migration</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Global migration patterns and population movements
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Plane className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're mapping global migration flows. Discover where people are moving 
            and understand the patterns behind international population shifts.
          </p>
          
          <div className="glass-panel rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm text-muted-foreground">
                <strong className="text-white block mb-1">Coming features:</strong>
                <ul className="space-y-1">
                  <li>• Migration flow visualization</li>
                  <li>• Top immigration countries</li>
                  <li>• Brain drain and gain patterns</li>
                  <li>• Refugee and asylum statistics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Migration stats */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">+</span> Top Immigration
            </h3>
            <div className="space-y-3">
              {[
                { country: "USA", migrants: "50M" },
                { country: "Germany", migrants: "16M" },
                { country: "UK", migrants: "9M" },
              ].map((item) => (
                <div key={item.country} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{item.country}</span>
                  <span className="font-semibold text-white">{item.migrants}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">-</span> Top Emigration
            </h3>
            <div className="space-y-3">
              {[
                { country: "India", migrants: "18M" },
                { country: "Mexico", migrants: "11M" },
                { country: "Russia", migrants: "11M" },
              ].map((item) => (
                <div key={item.country} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{item.country}</span>
                  <span className="font-semibold text-white">{item.migrants}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
