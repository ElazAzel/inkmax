/**
 * EnhancedSEOHead - Comprehensive Auto-SEO for User Pages
 * 
 * Features:
 * - Auto meta tags generation
 * - Schema.org JSON-LD (Person/Organization, FAQ, Event, Service)
 * - Quality gate for indexation
 * - Source context for AI citability
 * - Version tracking for stable URLs
 */

import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PageData } from '@/types/page';
import {
  evaluateQualityGate,
  extractProfileFromBlocks,
  generatePageMeta,
  generateSchemas,
  generateAutoAbout,
  generateSourceContext,
  generateContentHash,
} from '@/lib/seo-utils';
import { extractEntityLinks } from '@/lib/seo/entity-linking';
import { generateSectionAnchors, generateKeyFacts } from '@/lib/seo/anchors';

interface EnhancedSEOHeadProps {
  pageData: PageData;
  pageUrl: string;
  updatedAt?: string;
  isNewAccount?: boolean;
}

// Helper to set/update meta tag
const setMetaTag = (name: string, content: string, property = false) => {
  const attr = property ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

// Helper to set/update link tag
const setLinkTag = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let link = document.querySelector(selector) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
};

// Helper to add JSON-LD schema
const addJsonLd = (id: string, data: object) => {
  let script = document.querySelector(`script#${id}`) as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export function EnhancedSEOHead({ 
  pageData, 
  pageUrl,
  updatedAt,
  isNewAccount = false,
}: EnhancedSEOHeadProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as 'ru' | 'en' | 'kk';
  const slug = pageData.slug || '';

  // Memoize all SEO computations
  const seoData = useMemo(() => {
    const profile = extractProfileFromBlocks(pageData.blocks, language);
    const qualityGate = evaluateQualityGate(
      pageData.blocks,
      profile.name,
      profile.bio,
      isNewAccount
    );
    const meta = generatePageMeta(profile, pageData.blocks, slug, qualityGate, language);
    const schemas = generateSchemas(profile, pageData.blocks, slug, meta, language);
    const contentHash = generateContentHash(pageData.blocks);
    const sourceContext = generateSourceContext(
      slug,
      updatedAt || new Date().toISOString(),
      contentHash
    );
    const autoAbout = !profile.bio 
      ? generateAutoAbout(profile, pageData.blocks, language)
      : null;
    
    // Enhanced entity linking for richer schema
    const entityLinks = extractEntityLinks(pageData.blocks, language);
    const sections = generateSectionAnchors(pageData.blocks);
    const keyFacts = generateKeyFacts(profile, pageData.blocks, language);

    return {
      profile,
      qualityGate,
      meta,
      schemas,
      contentHash,
      sourceContext,
      autoAbout,
      entityLinks,
      sections,
      keyFacts,
    };
  }, [pageData.blocks, slug, language, updatedAt, isNewAccount]);

  useEffect(() => {
    const { meta, schemas, sourceContext, qualityGate } = seoData;

    // Set document title
    document.title = meta.title;

    // Set lang attribute
    document.documentElement.lang = language;

    // Basic meta tags
    setMetaTag('description', meta.description);
    setMetaTag('robots', meta.robots);
    setMetaTag('googlebot', meta.robots);

    // Open Graph tags
    setMetaTag('og:type', 'profile', true);
    setMetaTag('og:title', meta.title, true);
    setMetaTag('og:description', meta.description, true);
    setMetaTag('og:url', meta.canonical, true);
    setMetaTag('og:site_name', 'lnkmx', true);
    
    if (meta.ogImage) {
      setMetaTag('og:image', meta.ogImage, true);
      setMetaTag('og:image:alt', `${seoData.profile.name || 'User'} profile`, true);
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', meta.title);
    setMetaTag('twitter:description', meta.description);
    if (meta.ogImage) {
      setMetaTag('twitter:image', meta.ogImage);
    }
    setMetaTag('twitter:site', '@lnkmx_app');

    // Canonical URL
    setLinkTag('canonical', meta.canonical);

    // Hreflang tags
    setLinkTag('alternate', `${meta.canonical}?lang=ru`, 'ru');
    setLinkTag('alternate', `${meta.canonical}?lang=en`, 'en');
    setLinkTag('alternate', `${meta.canonical}?lang=kk`, 'kk');
    setLinkTag('alternate', meta.canonical, 'x-default');

    // JSON-LD Schemas
    addJsonLd('schema-webpage', schemas.webPage);
    addJsonLd('schema-main-entity', schemas.mainEntity);
    addJsonLd('schema-breadcrumb', schemas.breadcrumb);

    if (schemas.faq) {
      addJsonLd('schema-faq', schemas.faq);
    }

    if (schemas.events && schemas.events.length > 0) {
      schemas.events.forEach((event, index) => {
        addJsonLd(`schema-event-${index}`, event);
      });
    }

    if (schemas.services && schemas.services.length > 0) {
      // Combine services into a single schema
      addJsonLd('schema-services', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: schemas.services.map((service, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: service,
        })),
      });
    }

    // Source context comment for AI crawlers
    let sourceComment = document.querySelector('meta[name="source-context"]');
    if (!sourceComment) {
      sourceComment = document.createElement('meta');
      sourceComment.setAttribute('name', 'source-context');
      document.head.appendChild(sourceComment);
    }
    (sourceComment as HTMLMetaElement).content = sourceContext;

    // Page quality indicator (for internal use)
    setMetaTag('page-quality-score', String(qualityGate.score));

    // Cleanup on unmount
    return () => {
      document.title = 'lnkmx - AI Bio Page Builder';
      
      // Remove page-specific tags
      const tagsToRemove = [
        'meta[property="og:type"]',
        'meta[property="og:url"]',
        'meta[property="og:site_name"]',
        'meta[property="og:image:alt"]',
        'meta[name="source-context"]',
        'meta[name="page-quality-score"]',
        'link[rel="canonical"]',
        'link[rel="alternate"]',
        'script#schema-webpage',
        'script#schema-main-entity',
        'script#schema-breadcrumb',
        'script#schema-faq',
        'script#schema-services',
      ];

      // Also remove event schemas
      for (let i = 0; i < 10; i++) {
        tagsToRemove.push(`script#schema-event-${i}`);
      }

      tagsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
    };
  }, [seoData, language]);

  return null;
}

export default EnhancedSEOHead;
