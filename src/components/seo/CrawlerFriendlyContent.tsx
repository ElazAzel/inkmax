/**
 * CrawlerFriendlyContent - Server-Side Readable Content for Crawlers
 * 
 * This component renders a hidden (visually) but accessible version of
 * the page content that crawlers can read without JavaScript execution.
 * 
 * The content is:
 * - Semantically structured with proper HTML5 elements
 * - Contains H1, about section, and key content
 * - Hidden from visual users but readable by screen readers and crawlers
 * - Includes structured data attributes
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Block, FAQBlock, EventBlock, ProfileBlock, AvatarBlock, PricingBlock } from '@/types/page';
import { getTranslatedString } from '@/lib/i18n-helpers';
import { extractProfileFromBlocks, generateAutoAbout, generateSourceContext } from '@/lib/seo-utils';

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

  // Extract FAQ content
  const faqBlock = blocks.find(b => b.type === 'faq') as FAQBlock | undefined;
  
  // Extract Events
  const eventBlocks = blocks.filter(b => b.type === 'event') as EventBlock[];
  
  // Extract Pricing/Services
  const pricingBlock = blocks.find(b => b.type === 'pricing') as PricingBlock | undefined;

  // Extract links
  const linkBlocks = blocks.filter(b => b.type === 'link' || b.type === 'button') as any[];

  return (
    <noscript>
      {/* 
        This content is only visible to crawlers and users with JS disabled.
        It provides a semantic HTML fallback for the SPA content.
      */}
      <article 
        className="crawler-content" 
        itemScope 
        itemType={`https://schema.org/${profile.type}`}
      >
        {/* Main heading - H1 */}
        <header>
          <h1 itemProp="name">{profile.name || `Page @${slug}`}</h1>
          {profile.avatar && (
            <img 
              src={profile.avatar} 
              alt={profile.name || 'Profile'} 
              itemProp="image"
              width="96"
              height="96"
            />
          )}
        </header>

        {/* About section */}
        <section aria-label="About">
          <h2>{language === 'ru' ? 'О себе' : language === 'kk' ? 'Өзім туралы' : 'About'}</h2>
          <p itemProp="description">{autoAbout}</p>
        </section>

        {/* Links section */}
        {linkBlocks.length > 0 && (
          <section aria-label="Links">
            <h2>{language === 'ru' ? 'Ссылки' : language === 'kk' ? 'Сілтемелер' : 'Links'}</h2>
            <ul>
              {linkBlocks.map(block => (
                <li key={block.id}>
                  <a href={block.url} rel="noopener">
                    {getTranslatedString(block.title, language)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ section */}
        {faqBlock && faqBlock.items.length > 0 && (
          <section 
            aria-label="FAQ"
            itemScope 
            itemType="https://schema.org/FAQPage"
          >
            <h2>{language === 'ru' ? 'Вопросы и ответы' : language === 'kk' ? 'Сұрақтар мен жауаптар' : 'FAQ'}</h2>
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

        {/* Events section */}
        {eventBlocks.length > 0 && (
          <section aria-label="Events">
            <h2>{language === 'ru' ? 'Мероприятия' : language === 'kk' ? 'Іс-шаралар' : 'Events'}</h2>
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

        {/* Services/Pricing section */}
        {pricingBlock && pricingBlock.items.length > 0 && (
          <section aria-label="Services">
            <h2>{language === 'ru' ? 'Услуги и цены' : language === 'kk' ? 'Қызметтер мен бағалар' : 'Services'}</h2>
            <ul>
              {pricingBlock.items.map(item => (
                <li 
                  key={item.id}
                  itemScope 
                  itemType="https://schema.org/Service"
                >
                  <span itemProp="name">{getTranslatedString(item.name, language)}</span>
                  {item.description && (
                    <span itemProp="description"> - {getTranslatedString(item.description, language)}</span>
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

        {/* Source context footer */}
        <footer>
          <small>{sourceContext}</small>
          <p>
            <a href={`https://lnkmx.my/${slug}`} itemProp="url">
              lnkmx.my/{slug}
            </a>
          </p>
        </footer>
      </article>
    </noscript>
  );
}

export default CrawlerFriendlyContent;
