import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import type { PageData, FAQBlock, EventBlock, ProductBlock } from '@/types/page';
import { evaluateUgsQuality, getProfileInfoFromBlocks } from '@/lib/ugs-quality';

interface SEOHeadProps {
  pageData: PageData;
  pageUrl: string;
}

export function SEOHead({ pageData, pageUrl }: SEOHeadProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const language = i18n.language as SupportedLanguage;
    const profileInfo = getProfileInfoFromBlocks(pageData.blocks, language);
    const quality = evaluateUgsQuality(pageData, language);
    const pageTitle = pageData.seo.title || profileInfo.name || 'lnkmx Page';

    // Update document title - include name + role for clear OG
    const fullTitle = profileInfo.name
      ? `${profileInfo.name}${profileInfo.bio ? ` - ${profileInfo.bio.slice(0, 50)}` : ''}`
      : pageTitle;
    document.title = fullTitle;

    // Helper to update or create meta tag
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

    // Basic meta tags
    const description = pageData.seo.description || profileInfo.bio || `${profileInfo.name || 'This page'} on lnkmx`;
    const robotsValue = quality.indexable
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : quality.nofollow
        ? 'noindex, nofollow'
        : 'noindex, follow';
    setMetaTag('description', description);
    setMetaTag('robots', robotsValue);
    setMetaTag('googlebot', robotsValue);

    if (pageData.seo.keywords?.length) {
      setMetaTag('keywords', pageData.seo.keywords.join(', '));
    }

    // Open Graph tags - optimized for social sharing
    setMetaTag('og:type', 'profile', true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', pageUrl, true);
    setMetaTag('og:site_name', 'lnkmx', true);

    // Use avatar or a default image for OG
    const imageUrl = profileInfo.avatar || pageData.previewUrl || 'https://lnkmx.my/favicon.jpg';
    setMetaTag('og:image', imageUrl, true);
    setMetaTag('og:image:alt', `${profileInfo.name || 'User'} profile`, true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', imageUrl);
    setMetaTag('twitter:site', '@lnkmx_app');

    // Canonical URL
    setLinkTag('canonical', pageUrl);

    // Hreflang for translated versions
    setLinkTag('alternate', `${pageUrl}?lang=ru`, 'ru');
    setLinkTag('alternate', `${pageUrl}?lang=en`, 'en');
    setLinkTag('alternate', `${pageUrl}?lang=kk`, 'kk');
    setLinkTag('alternate', pageUrl, 'x-default');

    // JSON-LD structured data
    let jsonLd = document.querySelector('script[type="application/ld+json"]#page-schema');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      jsonLd.id = 'page-schema';
      document.head.appendChild(jsonLd);
    }

    const faqBlocks = pageData.blocks.filter((block) => block.type === 'faq') as FAQBlock[];
    const eventBlocks = pageData.blocks.filter((block) => block.type === 'event') as EventBlock[];
    const productBlocks = pageData.blocks.filter((block) => block.type === 'product') as ProductBlock[];

    const schemaGraph: Record<string, unknown>[] = [
      {
        '@type': 'WebPage',
        name: fullTitle,
        description,
        url: pageUrl,
        inLanguage: language,
        dateModified: new Date().toISOString(),
      },
      {
        '@type': 'ProfilePage',
        name: fullTitle,
        description,
        url: pageUrl,
        mainEntity: {
          '@type': 'Person',
          name: profileInfo.name || pageTitle,
          description: profileInfo.bio || description,
          image: profileInfo.avatar || undefined,
          url: pageUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'lnkmx',
            item: 'https://lnkmx.my',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: pageTitle,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'WebSite',
        name: 'lnkmx',
        url: 'https://lnkmx.my',
      },
    ];

    if (faqBlocks.length > 0) {
      schemaGraph.push({
        '@type': 'FAQPage',
        mainEntity: faqBlocks.flatMap((block) =>
          block.items.map((item) => ({
            '@type': 'Question',
            name: typeof item.question === 'string' ? item.question : getTranslatedString(item.question, language),
            acceptedAnswer: {
              '@type': 'Answer',
              text: typeof item.answer === 'string' ? item.answer : getTranslatedString(item.answer, language),
            },
          }))
        ),
      });
    }

    if (eventBlocks.length > 0) {
      eventBlocks.forEach((eventBlock) => {
        schemaGraph.push({
          '@type': 'Event',
          name: getTranslatedString(eventBlock.title, language),
          description: eventBlock.description ? getTranslatedString(eventBlock.description, language) : undefined,
          startDate: eventBlock.startAt,
          endDate: eventBlock.endAt,
          eventAttendanceMode: eventBlock.locationType === 'online'
            ? 'https://schema.org/OnlineEventAttendanceMode'
            : 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: eventBlock.locationType === 'online'
            ? {
                '@type': 'VirtualLocation',
                url: eventBlock.locationValue || pageUrl,
              }
            : {
                '@type': 'Place',
                name: eventBlock.locationValue || pageTitle,
              },
          image: eventBlock.coverUrl ? [eventBlock.coverUrl] : undefined,
          offers: eventBlock.isPaid && eventBlock.price
            ? {
                '@type': 'Offer',
                price: eventBlock.price,
                priceCurrency: eventBlock.currency || 'USD',
                url: pageUrl,
              }
            : undefined,
        });
      });
    }

    if (productBlocks.length > 0) {
      productBlocks.forEach((product) => {
        schemaGraph.push({
          '@type': 'Product',
          name: typeof product.name === 'string' ? product.name : getTranslatedString(product.name, language),
          description: typeof product.description === 'string'
            ? product.description
            : getTranslatedString(product.description, language),
          image: product.image ? [product.image] : undefined,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency,
            url: product.buyLink || pageUrl,
          },
        });
      });
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': schemaGraph,
    };

    jsonLd.textContent = JSON.stringify(structuredData);

    // Cleanup on unmount - restore original meta tags
    return () => {
      // Reset to defaults
      document.title = 'lnkmx - AI Bio Page Builder';
      setMetaTag('description', 'Create your bio page in 2 minutes with AI. For experts, freelancers and small business.');

      // Remove page-specific tags
      const tagsToRemove = [
        'meta[property="og:type"]',
        'meta[property="og:url"]',
        'meta[property="og:site_name"]',
        'meta[property="og:image:alt"]',
        'link[rel="canonical"]',
        'link[rel="alternate"]',
        'script#page-schema'
      ];

      tagsToRemove.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.remove();
      });
    };
  }, [pageData, pageUrl, i18n.language]);

  return null; // This component only manages document head
}
