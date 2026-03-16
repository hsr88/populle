import { useEffect } from 'react';

const DEFAULT_TITLE = "Populle - World Population Visualization";
const DEFAULT_DESCRIPTION = "Interactive 3D visualization of world population data from 10,000 BCE to 2100. Explore historical trends, compare countries, and see demographic projections.";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export function SEO({ 
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = "world population, demographics, population visualization, UN data, population growth, demographic data",
  ogImage = "/opengraph.jpg",
  ogType = "website"
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
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
    
    // Reset title on unmount
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, ogImage, ogType]);
  
  return null;
}
