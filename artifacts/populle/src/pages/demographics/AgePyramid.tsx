import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Users, Info } from "lucide-react";

export default function AgePyramid() {
  return (
    <Layout>
      <SEO
        title="Age Pyramid | Populle - Population Demographics"
        description="Explore interactive age pyramids for countries worldwide. Visualize population structure by age and gender across different time periods."
        keywords="age pyramid, population pyramid, demographics, age structure, population by age, demographic visualization"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Age Pyramid</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Visualize population structure by age and gender
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're building interactive age pyramid visualizations for countries worldwide. 
            Soon you'll be able to explore how population structures have evolved over time.
          </p>
          
          <div className="glass-panel rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm text-muted-foreground">
                <strong className="text-white block mb-1">What to expect:</strong>
                <ul className="space-y-1">
                  <li>• Compare age structures across countries</li>
                  <li>• See how pyramids change over decades</li>
                  <li>• Identify demographic trends and transitions</li>
                  <li>• Export pyramid charts for reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preview info */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">Expansive</h3>
            <p className="text-sm text-muted-foreground">
              Wide base indicates high birth rates and youthful populations, typical of developing nations.
            </p>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">Stationary</h3>
            <p className="text-sm text-muted-foreground">
              Uniform shape shows stable population with balanced birth and death rates.
            </p>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">Constrictive</h3>
            <p className="text-sm text-muted-foreground">
              Narrow base reflects declining birth rates and aging populations in developed countries.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
