import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Building2, Info } from "lucide-react";

export default function Urbanization() {
  return (
    <Layout>
      <SEO
        title="Urbanization | Populle - Urban Population Trends"
        description="Track global urbanization trends. See how cities grow and the percentage of population living in urban areas across countries and time."
        keywords="urbanization, urban population, city growth, urban trends, urban vs rural, urban demographics"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Urbanization</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Urban population growth and city development trends
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're preparing comprehensive urbanization data. Track how humanity 
            is moving to cities and explore urban growth patterns worldwide.
          </p>
          
          <div className="glass-panel rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm text-muted-foreground">
                <strong className="text-white block mb-1">What you'll see:</strong>
                <ul className="space-y-1">
                  <li>• Urban vs rural population by country</li>
                  <li>• Historical urbanization trends</li>
                  <li>• Fastest growing cities</li>
                  <li>• Megacities and urban agglomerations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Urban stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="glass-panel rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">57%</div>
            <p className="text-sm text-muted-foreground">Global urban population (2024)</p>
          </div>
          <div className="glass-panel rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">68%</div>
            <p className="text-sm text-muted-foreground">Projected urban population (2050)</p>
          </div>
          <div className="glass-panel rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">30+</div>
            <p className="text-sm text-muted-foreground">Megacities with 10M+ people</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
