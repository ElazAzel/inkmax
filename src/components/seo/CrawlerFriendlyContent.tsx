/**
 * CrawlerFriendlyContent - Server-Side Readable Content for Crawlers
 * 
 * Enhanced for SEO/GEO with:
 * - Semantic HTML5 sections with stable anchors
 * - Key facts block for AI citability
 * - Complete content extraction
 * - Schema.org microdata attributes
 * - Proper heading hierarchy (H1 → H2 → H3)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Block, FAQBlock, EventBlock, ProfileBlock, AvatarBlock, PricingBlock, SocialsBlock, LinkBlock, TextBlock } from '@/types/page';
import { getTranslatedString } from '@/lib/i18n-helpers';
import { extractProfileFromBlocks, generateAutoAbout, generateSourceContext } from '@/lib/seo-utils';
import { generateSectionAnchors, generateKeyFacts, SECTION_LABELS } from '@/lib/seo/anchors';
import { extractEntityLinks } from '@/lib/seo/entity-linking';

interface CrawlerFriendlyContentProps {
  blocks: Block[];
  slug: string;
  updatedAt?: string;
}

export function CrawlerFriendlyContent({ blocks, slug, updatedAt }: CrawlerFriendlyContentProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as 'ru' | 'en' | 'kk';

  const profile = extractProfileFromBlocks(blocks, language);
  const autoAbout = profile.bio || generateAutoAbout(profile, blocks, language);
  const sourceContext = generateSourceContext(slug, updatedAt || new Date().toISOString());
  const sections = generateSectionAnchors(blocks);
  const keyFacts = generateKeyFacts(profile, blocks, language);
  const entityLinks = extractEntityLinks(blocks, language);

  // Extract FAQ content
  const faqBlock = blocks.find(b => b.type === 'faq') as FAQBlock | undefined;
  
  // Extract Events
  const eventBlocks = blocks.filter(b => b.type === 'event') as EventBlock[];
  
  // Extract Pricing/Services
  const pricingBlock = blocks.find(b => b.type === 'pricing') as PricingBlock | undefined;

  // Extract links
  const linkBlocks = blocks.filter(b => b.type === 'link' || b.type === 'button') as any[];

  // Extract text blocks for content
  const textBlocks = blocks.filter(b => b.type === 'text') as TextBlock[];

  // Extract socials
  const socialsBlock = blocks.find(b => b.type === 'socials') as SocialsBlock | undefined;

  return (
    <noscript>
      {/* 
        This content is only visible to crawlers and users with JS disabled.
        It provides a semantic HTML fallback for the SPA content with:
        - Stable anchors (#about, #services, #faq, etc.)
        - Key facts for AI extraction
        - Proper schema.org microdata
      */}
      <article 
        className="crawler-content" 
        itemScope 
        itemType={`https://schema.org/${profile.type}`}
      >
        {/* Main heading - H1 */}
        <header id="about">
          <h1 itemProp="name">{profile.name || `Page @${slug}`}</h1>
          {profile.avatar && (
            <img 
              src={profile.avatar} 
              alt={profile.name || 'Profile'} 
              itemProp="image"
              width="96"
              height="96"
              loading="eager"
            />
          )}
          {/* Canonical URL */}
          <link itemProp="url" href={`https://lnkmx.my/${slug}`} />
          
          {/* sameAs links for entity linking */}
          {entityLinks.sameAs.map((url, i) => (
            <link key={i} itemProp="sameAs" href={url} />
          ))}
        </header>

        {/* Key Facts - Important for AI extraction */}
        {keyFacts.length > 0 && (
          <section id="key-facts" aria-label="Key Facts">
            <h2>{language === 'ru' ? 'Ключевые факты' : language === 'kk' ? 'Негізгі фактілер' : 'Key Facts'}</h2>
            <ul>
              {keyFacts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </section>
        )}

        {/* About section */}
        <section aria-label="About">
          <h2>{SECTION_LABELS.about[language]}</h2>
          <p itemProp="description">{autoAbout}</p>
          
          {/* Additional text content */}
          {textBlocks.map(block => (
            <p key={block.id}>{getTranslatedString(block.content, language)}</p>
          ))}
        </section>

        {/* Expertise/Skills (knowsAbout) */}
        {entityLinks.knowsAbout.length > 0 && (
          <section id="expertise" aria-label="Expertise">
            <h2>{SECTION_LABELS.expertise[language]}</h2>
            <ul>
              {entityLinks.knowsAbout.map((skill, i) => (
                <li key={i} itemProp="knowsAbout">{skill}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Services/Pricing section */}
        {pricingBlock && pricingBlock.items.length > 0 && (
          <section id="services" aria-label="Services">
            <h2>{SECTION_LABELS.services[language]}</h2>
            <ul>
              {pricingBlock.items.map(item => (
                <li 
                  key={item.id}
                  itemScope 
                  itemType="https://schema.org/Service"
                >
                  <h3 itemProp="name">{getTranslatedString(item.name, language)}</h3>
                  {item.description && (
                    <p itemProp="description">{getTranslatedString(item.description, language)}</p>
                  )}
                  <span 
                    itemProp="offers" 
                    itemScope 
                    itemType="https://schema.org/Offer"
                  >
                    <span itemProp="price">{item.price}</span>
                    <meta itemProp="priceCurrency" content={item.currency || pricingBlock.currency || 'KZT'} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Events section */}
        {eventBlocks.length > 0 && (
          <section id="events" aria-label="Events">
            <h2>{SECTION_LABELS.events[language]}</h2>
            {eventBlocks.map(event => (
              <article 
                key={event.id}
                itemScope 
                itemType="https://schema.org/Event"
              >
                <h3 itemProp="name">{getTranslatedString(event.title, language)}</h3>
                {event.description && (
                  <p itemProp="description">{getTranslatedString(event.description, language)}</p>
                )}
                {event.startAt && (
                  <time itemProp="startDate" dateTime={event.startAt}>
                    {new Date(event.startAt).toLocaleDateString(language)}
                  </time>
                )}
                {event.locationValue && (
                  <address itemProp="location">{event.locationValue}</address>
                )}
              </article>
            ))}
          </section>
        )}

        {/* FAQ section */}
        {faqBlock && faqBlock.items.length > 0 && (
          <section 
            id="faq"
            aria-label="FAQ"
            itemScope 
            itemType="https://schema.org/FAQPage"
          >
            <h2>{SECTION_LABELS.faq[language]}</h2>
            <dl>
              {faqBlock.items.map(item => (
                <div 
                  key={item.id}
                  itemScope 
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  <dt itemProp="name">{getTranslatedString(item.question, language)}</dt>
                  <dd 
                    itemScope 
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <span itemProp="text">{getTranslatedString(item.answer, language)}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Links section */}
        {linkBlocks.length > 0 && (
          <section id="contacts" aria-label="Links">
            <h2>{SECTION_LABELS.contacts[language]}</h2>
            <ul>
              {linkBlocks.map(block => (
                <li key={block.id}>
                  <a href={block.url} rel="noopener noreferrer">
                    {getTranslatedString(block.title, language)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Social Links section */}
        {socialsBlock?.platforms && socialsBlock.platforms.length > 0 && (
          <section aria-label="Social Media">
            <h2>{language === 'ru' ? 'Соцсети' : language === 'kk' ? 'Әлеуметтік желілер' : 'Social Media'}</h2>
            <ul>
              {socialsBlock.platforms.map((platform, i) => (
                <li key={i}>
                  <a href={platform.url} rel="noopener noreferrer me" itemProp="sameAs">
                    {platform.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Source context footer */}
        <footer>
          <small>{sourceContext}</small>
          <p>
            <a href={`https://lnkmx.my/${slug}`} itemProp="url">
              lnkmx.my/{slug}
            </a>
          </p>
          <p>
            <small>
              {language === 'ru' 
                ? 'Эта страница создана на платформе lnkmx.my'
                : language === 'kk'
                ? 'Бұл бет lnkmx.my платформасында жасалған'
                : 'This page is created on lnkmx.my platform'}
            </small>
          </p>
        </footer>
      </article>
    </noscript>
  );
}

export default CrawlerFriendlyContent;
