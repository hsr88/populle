import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Shield, Lock, Eye, Database, Cookie, Mail } from "lucide-react";

export default function Privacy() {
  const lastUpdated = "March 15, 2026";

  return (
    <Layout hideYearSlider>
      <SEO
        title="Privacy Policy | Populle"
        description="Populle's privacy policy. Learn how we collect, use, and protect your data when using our world population visualization platform."
        keywords="privacy policy, data protection, GDPR, cookies, analytics"
      />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <p className="text-muted-foreground leading-relaxed mb-4">
            At Populle, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, and protect your information when you visit our website. By using Populle, you agree 
            to the practices described in this policy.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe in transparency and minimal data collection. Our goal is to provide valuable 
            demographic insights while respecting your privacy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">Automatically Collected Data</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                When you visit Populle, we automatically collect certain information about your device 
                and usage patterns. This includes your IP address, browser type, operating system, 
                referring URLs, pages viewed, and timestamps. This data helps us understand how visitors 
                interact with our platform and improve user experience.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Google Analytics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We use Google Analytics to analyze website traffic. Google Analytics collects information 
                such as how often users visit the site, what pages they visit, and what other sites they 
                used prior to coming to Populle. We use this information to improve our website and services. 
                Google Analytics collects only the IP address assigned to you on the date you visit our site, 
                not your name or other identifying information.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Contact Information</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you contact us via email, we will collect your email address and any information you 
                choose to provide. We use this information solely to respond to your inquiry and will 
                not share it with third parties.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          </div>
          
          <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
          
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Provide, maintain, and improve Populle's functionality and user experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Analyze usage patterns and trends to optimize our platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Respond to your comments, questions, and support requests</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Detect, prevent, and address technical issues and security threats</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Comply with legal obligations and protect our rights</span>
            </li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Cookies & Tracking</h2>
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-4">
            Populle uses cookies and similar tracking technologies to enhance your browsing experience. 
            Cookies are small text files stored on your device that help us remember your preferences 
            and understand how you use our platform.
          </p>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-white mb-1">Essential Cookies</h3>
              <p className="text-muted-foreground text-sm">
                Necessary for the website to function properly. These cannot be disabled.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">Analytics Cookies</h3>
              <p className="text-muted-foreground text-sm">
                Help us understand how visitors interact with our website. You can opt out of Google 
                Analytics tracking by visiting Google's opt-out page or using browser extensions.
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm mt-4">
            Most web browsers allow you to control cookies through their settings. However, disabling 
            cookies may affect your experience on our website.
          </p>
        </section>

        {/* Data Security */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Data Security</h2>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. However, 
            no method of transmission over the Internet or electronic storage is 100% secure, and we 
            cannot guarantee absolute security.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          
          <p className="text-muted-foreground leading-relaxed mb-4">
            We may use third-party service providers to help us operate our website and analyze usage. 
            These third parties have access to your information only to perform specific tasks on our 
            behalf and are obligated not to disclose or use it for other purposes.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the 
            privacy practices or content of these external sites. We encourage you to review the 
            privacy policies of any third-party sites you visit.
          </p>
        </section>

        {/* Your Rights */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          
          <p className="text-muted-foreground mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong className="text-white">Access:</strong> Request a copy of your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong className="text-white">Correction:</strong> Request correction of inaccurate data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong className="text-white">Deletion:</strong> Request deletion of your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span><strong className="text-white">Objection:</strong> Object to certain data processing</span>
            </li>
          </ul>
        </section>

        {/* Changes to Policy */}
        <section className="glass-panel rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this 
            page with an updated revision date. We encourage you to review this policy periodically 
            to stay informed about how we protect your information.
          </p>
        </section>

        {/* Contact */}
        <section className="glass-panel rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Contact Us</h2>
          </div>
          
          <p className="text-muted-foreground mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          
          <a 
            href="mailto:privacy@populle.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            privacy@populle.com
          </a>
        </section>
      </div>
    </Layout>
  );
}
