import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Globe, Info } from "lucide-react";

export default function LanguagesPage() {
  return (
    <Layout>
      <SEO
        title="World Languages | Populle - Language Distribution Map"
        description="Explore global language distribution. Visualize where languages are spoken and how linguistic diversity varies across regions."
        keywords="world languages, language map, linguistic diversity, language distribution, most spoken languages, language demographics"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Languages</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Global language distribution and linguistic diversity
          </p>
        </div>

        {/* Coming Soon */}
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Languages className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're mapping global language distribution. Discover where languages are spoken 
            and explore linguistic diversity across countries and regions.
          </p>
          
          <div className="glass-panel rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left text-sm text-muted-foreground">
                <strong className="text-white block mb-1">Coming features:</strong>
                <ul className="space-y-1">
                  <li>• Map of official languages by country</li>
                  <li>• Most spoken languages globally</li>
                  <li>• Language family trees</li>
                  <li>• Endangered languages data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Top languages preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { lang: "English", speakers: "1.45B", native: "380M" },
            { lang: "Mandarin", speakers: "1.12B", native: "940M" },
            { lang: "Hindi", speakers: "610M", native: "345M" },
            { lang: "Spanish", speakers: "560M", native: "485M" },
          ].map((item) => (
            <div key={item.lang} className="glass-panel rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">{item.lang}</h3>
              <div className="text-2xl font-bold text-primary">{item.speakers}</div>
              <p className="text-xs text-muted-foreground">Total speakers</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Native: {item.native}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
