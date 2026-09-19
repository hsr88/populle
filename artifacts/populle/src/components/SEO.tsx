import { useEffect } from 'react';

const DEFAULT_TITLE = "Populle - World Population Visualization";
const DEFAULT_DESCRIPTION = "Interactive 3D visualization of world population data from 10,000 BCE to 2100. Explore historical trends, compare countries, and see demographic projections.";
const SITE_URL = "https://populle.com";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  path?: string;
  jsonLd?: Record<string, unknown>;
}

export function SEO({ 
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = "world population, demographics, population visualization, UN data, population growth, demographic data, population statistics, country population, city population, demographic trends",
  ogImage = "/images/opengraph.png",
  ogType = "website",
  path = "",
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    document.title = title;
    
    const canonicalUrl = `${SITE_URL}${path}`;
    
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: `${SITE_URL}${ogImage}` },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: 'Populle' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${SITE_URL}${ogImage}` },
      { name: 'twitter:site', content: '@populle' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Populle' },
    ];
    
    metaTags.forEach(({ name, property, content }) => {
      let meta = name 
        ? document.querySelector(`meta[name="${name}"]`)
        : document.querySelector(`meta[property="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    
    const defaultJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          "url": SITE_URL,
          "name": "Populle",
          "description": "Interactive world population visualization from 10,000 BCE to 2100",
          "publisher": {
            "@id": `${SITE_URL}/#organization`
          }
        },
        {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          "name": "Populle",
          "url": SITE_URL,
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/images/logo.png`
          }
        },
        {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          "url": canonicalUrl,
          "name": title,
          "description": description,
          "isPartOf": {
            "@id": `${SITE_URL}/#website`
          }
        }
      ]
    };
    
    const finalJsonLd = jsonLd || defaultJsonLd;
    
    let ldScript = document.querySelector('script[type="application/ld+json"]');
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(finalJsonLd);
    
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, ogImage, ogType, path, jsonLd]);
  
  return null;
}

export function generateDatasetJsonLd(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": name,
    "description": description,
    "url": SITE_URL,
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "creator": {
      "@type": "Organization",
      "name": "Populle"
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "application/json",
      "contentUrl": `${SITE_URL}/api/population/countries`
    },
    "temporalCoverage": "10000BCE/2100",
    "spatialCoverage": {
      "@type": "Place",
      "name": "World"
    },
    "variableMeasured": [
      {
        "@type": "PropertyValue",
        "name": "Population",
        "unitText": "thousands"
      }
    ],
    "includedInDataCatalog": {
      "@type": "DataCatalog",
      "name": "Populle World Population Data"
    }
  };
}
