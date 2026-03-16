import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { MapPin, Info } from "lucide-react";

export default function Density() {
  return (
    <Layout>
      <SEO
        title="Population Density | Populle - People per Square Kilometer"
        description="Explore population density across the globe. See where people concentrate and analyze land use efficiency across countries."
        keywords="population density, people per km2, land use, crowded countries, density map, population concentration"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Population Density</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            People per square kilometer across the globe
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're creating interactive density heatmaps. Discover where people concentrate 
            and explore population distribution relative to land area.
          </p>
          
          <div className="glass-panel rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm text-muted-foreground">
                <strong className="text-white block mb-1">Features in development:</strong>
                <ul className="space-y-1">
                  <li>• Density heatmap by country</li>
                  <li>• Most and least crowded nations</li>
                  <li>• Urban density vs rural areas</li>
                  <li>• Historical density changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Density stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { country: "Singapore", density: "8,480", people: "per km²" },
            { country: "Bangladesh", density: "1,330", people: "per km²" },
            { country: "Netherlands", density: "520", people: "per km²" },
            { country: "Global Avg", density: "60", people: "per km²" },
          ].map((item) => (
            <div key={item.country} className="glass-panel rounded-xl p-4 text-center">
              <h3 className="font-semibold text-white mb-2">{item.country}</h3>
              <div className="text-2xl font-bold text-primary">{item.density}</div>
              <p className="text-xs text-muted-foreground">{item.people}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
