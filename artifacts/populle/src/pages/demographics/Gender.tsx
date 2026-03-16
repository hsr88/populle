import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Venn, Info } from "lucide-react";

export default function Gender() {
  return (
    <Layout>
      <SEO
        title="Gender Structure | Populle - Male to Female Ratio"
        description="Explore gender ratios across countries and time. Visualize male to female population distribution and demographic imbalances."
        keywords="gender ratio, male to female, sex ratio, demographics, population by gender, gender demographics"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Venn className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Gender Structure</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Male to female population ratios across countries and time
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Venn className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're preparing detailed gender structure visualizations. 
            Explore how male-to-female ratios vary across regions and evolve over time.
          </p>
          
          <div className="glass-panel rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm text-muted-foreground">
                <strong className="text-white block mb-1">Features coming:</strong>
                <ul className="space-y-1">
                  <li>• Country-by-country gender ratios</li>
                  <li>• Historical trends in gender balance</li>
                  <li>• Age-specific gender breakdowns</li>
                  <li>• Global and regional comparisons</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="glass-panel rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">101:100</div>
            <p className="text-sm text-muted-foreground">Global male to female ratio</p>
          </div>
          <div className="glass-panel rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">122:100</div>
            <p className="text-sm text-muted-foreground">Highest ratio (Qatar, UAE)</p>
          </div>
          <div className="glass-panel rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">84:100</div>
            <p className="text-sm text-muted-foreground">Lowest ratio (Latvia, Ukraine)</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
