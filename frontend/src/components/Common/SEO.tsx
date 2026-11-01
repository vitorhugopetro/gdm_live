import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
}

const DEFAULT_TITLE = 'GDM Live Radio — A rádio cristã que toca sua fé o tempo todo | Graça Digital';
const DEFAULT_DESC =
  'Ouça a GDM Live Radio ao vivo 24 horas por dia. Músicas cristãs e louvores autorais da Graça Digital (GDM), mensagens de esperança, fé, adoração e renovação espiritual.';
const DEFAULT_IMAGE = 'https://gdmlr.web.app/images/hero-art-hyperrealistic.jpg';
const BASE_URL = 'https://gdmlr.web.app';

export function SEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Title
    const finalTitle = title ? `${title} | GDM Live Radio` : DEFAULT_TITLE;
    document.title = finalTitle;

    // 2. Helper to set meta tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);

    const pageUrl = canonical || `${BASE_URL}${location.pathname}`;
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // 3. Update Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = pageUrl;
  }, [title, description, canonical, image, type, location.pathname]);

  return null;
}

