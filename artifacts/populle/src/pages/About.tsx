import { Layout } from "@/components/layout/Layout";
import { Globe2, Users, TrendingUp, Database, Heart, ExternalLink } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function About() {
  return (
    <Layout hideYearSlider>
      <SEO
        title="About Populle | World Population Visualization & Demographics"
        description="Discover Populle - an interactive platform visualizing world population data from 10,000 BCE to 2100. Explore demographics, compare countries, and understand humanity's growth."
        keywords="world population, demographics, population visualization, UN data, population growth, demographic data"
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About Populle
          </h1>
          <p className="text-lg text-muted-foreground">
            Visualizing humanity's story through numbers
          </p>
        </div>

        {/* Mission */}
        <section className="glass-panel rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Populle was created to make demographic data accessible, engaging, and visually compelling. 
            We believe that understanding population trends is crucial for addressing global challenges—from 
            climate change and urbanization to healthcare and economic development.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our platform transforms complex United Nations data into interactive visualizations that anyone 
            can explore, whether you're a student, researcher, policymaker, or simply curious about the 
            world we live in.
          </p>
        </section>

        {/* What We Offer */}
        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel rounded-2xl p-6">
            <Globe2 className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive 3D Globe</h3>
            <p className="text-muted-foreground text-sm">
              Explore population data on an immersive 3D globe. See how countries compare 
              in real-time with dynamic visualizations.
            </p>
          </div>
          
          <div className="glass-panel rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Historical & Future Data</h3>
            <p className="text-muted-foreground text-sm">
              Travel from 10,000 BCE to 2100 CE. Understand past population dynamics 
              and explore future projections based on scientific models.
            </p>
          </div>
          
          <div className="glass-panel rounded-2xl p-6">
            <Users className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">City Comparisons</h3>
            <p className="text-muted-foreground text-sm">
              Compare major cities worldwide. See how urban centers have grown and 
              which metropolises lead the world in population.
            </p>
          </div>
          
          <div className="glass-panel rounded-2xl p-6">
            <Database className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reliable Sources</h3>
            <p className="text-muted-foreground text-sm">
              All data comes from the UN World Population Prospects 2024, 
              ensuring accuracy and credibility for your research.
            </p>
          </div>
        </section>

        {/* Data Sources */}
        <section className="glass-panel rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Sources</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Populle relies on authoritative sources to ensure data accuracy:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-white">United Nations</strong>
                <p className="text-sm text-muted-foreground">
                  World Population Prospects 2024 - Comprehensive demographic data for all countries.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-white">Our World in Data</strong>
                <p className="text-sm text-muted-foreground">
                  Historical population estimates extending back to 10,000 BCE.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-white">UN DESA</strong>
                <p className="text-sm text-muted-foreground">
                  Population Division projections and urbanization forecasts.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="glass-panel rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-4">
            Have questions, suggestions, or found an error in our data? We'd love to hear from you.
          </p>
          <a 
            href="mailto:contact@populle.com" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </section>
      </div>
    </Layout>
  );
}
