import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Populle?",
    answer: "Populle is an interactive platform for visualizing world population data. We combine historical records, current statistics, and future projections to help you understand demographic trends across countries and time periods—from 10,000 BCE to 2100 CE."
  },
  {
    question: "Where does the data come from?",
    answer: "Our primary data source is the United Nations World Population Prospects 2024. Historical data (pre-1950) incorporates research from Our World in Data and academic demographic studies. All projections follow UN medium-variant fertility scenarios."
  },
  {
    question: "How accurate are the population projections?",
    answer: "Projections to 2100 are based on UN demographic models that consider fertility rates, mortality, and migration patterns. While these are scientifically sound estimates, actual future populations may vary based on policy changes, economic shifts, and unforeseen global events. We update our data as new UN reports are released."
  },
  {
    question: "Can I use Populle data for my research or project?",
    answer: "Yes! The underlying data is public domain (UN data). We ask that you cite both the UN World Population Prospects and Populle.com as your visualization source. For commercial use, please check our Terms of Service."
  },
  {
    question: "Why do some historical population numbers seem uncertain?",
    answer: "Population records before the 20th century are estimates based on archaeological evidence, census fragments, and demographic modeling. Ancient and medieval populations are inherently harder to quantify precisely. We use the most widely accepted estimates from academic sources."
  },
  {
    question: "How often is the data updated?",
    answer: "We update our database whenever the UN releases new World Population Prospects reports (typically every 2-3 years). Between major updates, we may apply corrections or refinements based on user feedback."
  },
  {
    question: "What does 'medium-variant projection' mean?",
    answer: "The UN creates multiple scenarios based on different fertility assumptions. The medium-variant assumes fertility rates will converge to replacement level (about 2.1 children per woman) in the long term. This is the most commonly cited projection."
  },
  {
    question: "Why doesn't my city appear in the database?",
    answer: "We focus on major metropolitan areas with reliable population data. City boundaries can be defined differently across sources (city proper vs. urban agglomeration), which affects rankings. We're continuously expanding our city database."
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, Populle is a web application optimized for all devices. A native mobile app is on our roadmap. You can add Populle to your home screen as a Progressive Web App (PWA) for quick access."
  },
  {
    question: "How can I report a data error or suggest a feature?",
    answer: "We appreciate your feedback! Please email us at contact@populle.com with details about the issue or suggestion. For data corrections, please include your source so we can verify the information."
  },
  {
    question: "What technologies power Populle?",
    answer: "Populle is built with React, TypeScript, Three.js (for 3D globe), Tailwind CSS, and Vite. Our backend runs on Node.js with data stored in PostgreSQL. We're hosted on Railway for fast, reliable performance."
  },
  {
    question: "Is Populle free to use?",
    answer: "Yes! Populle is completely free for personal use. We may introduce premium features in the future, but core functionality will always remain free. Support us by sharing the site with others!"
  }
];

export default function FAQ() {
  return (
    <Layout hideYearSlider>
      <SEO
        title="FAQ | Populle - Frequently Asked Questions"
        description="Find answers to common questions about Populle's population data, sources, accuracy, and features. Learn how we visualize world demographics."
        keywords="FAQ, population data questions, UN data, demographic projections, world population FAQ"
      />
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Populle
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10 last:border-0">
                <AccordionTrigger className="text-left font-medium text-white hover:text-primary transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a 
            href="mailto:hi@hsr.gg"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-medium hover:bg-primary/20 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </Layout>
  );
}
