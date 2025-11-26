import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogImage
}: SEOHeadProps) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update document title
    const pageTitle = title || t('seo.title');
    document.title = pageTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Update basic meta tags
    const pageDescription = description || t('seo.description');
    const pageKeywords = keywords || t('seo.keywords');

    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', pageKeywords);
    updateMetaTag('title', pageTitle);

    // Update Open Graph tags
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:locale', i18n.language === 'zh-CN' ? 'zh_CN' : 'en_US', true);

    if (ogImage) {
      updateMetaTag('og:image', ogImage, true);
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);

    // Update HTML lang attribute
    document.documentElement.lang = i18n.language;

  }, [title, description, keywords, ogImage, t, i18n.language]);

  return null; // This component doesn't render anything
}
