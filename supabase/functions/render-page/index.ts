/**
 * Server-Side Render Edge Function for Public Pages
 * 
 * Renders full HTML with meta tags, JSON-LD, and visible content for:
 * - Search engine crawlers (Googlebot, Bingbot, etc.)
 * - AI crawlers (GPTBot, Claude, Perplexity)
 * - Social media bots (Facebook, Twitter, Telegram)
 * 
 * This ensures proper SEO/AEO/GEO without client-side JavaScript.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bot detection patterns
const BOT_AGENTS = [
  'googlebot', 'bingbot', 'yandex', 'baiduspider', 'duckduckbot', 'slurp',
  'chatgpt-user', 'gptbot', 'claude-web', 'anthropic-ai', 'perplexitybot',
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'telegrambot',
  'whatsapp', 'discordbot', 'applebot', 'google-extended',
];

interface PageData {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  is_published: boolean;
  theme_settings: any;
  seo_meta: any;
  updated_at: string;
}

interface Block {
  id: string;
  type: string;
  title: string | null;
  content: any;
}

interface Profile {
  name: string;
  bio: string;
  avatar: string | null;
  role: string;
  location: string | null;
  services: string[];
  socialLinks: string[];
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
    const lang = url.searchParams.get('lang') || 'ru';
    
    // Check if request is from a bot
    const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch page data
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id, slug, title, description, avatar_url, is_published, theme_settings, seo_meta, updated_at')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (pageError || !page) {
      console.error('Page not found:', slug, pageError);
      return new Response(JSON.stringify({ error: 'Page not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch blocks
    const { data: blocks } = await supabase
      .from('blocks')
      .select('id, type, title, content')
      .eq('page_id', page.id)
      .order('position', { ascending: true });

    // Extract profile information
    const profile = extractProfile(blocks || [], lang);
    
    // Generate meta tags
    const meta = generateMetaTags(page, profile, slug, lang);
    
    // Generate JSON-LD schemas
    const jsonLd = generateJsonLd(page, profile, blocks || [], slug, lang);
    
    // Generate HTML content
    const html = generateHtml(page, profile, blocks || [], meta, jsonLd, slug, lang);

    // Return rendered HTML
    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
      },
    });
  } catch (error) {
    console.error('Render error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractProfile(blocks: Block[], lang: string): Profile {
  let name = '';
  let bio = '';
  let avatar: string | null = null;
  let role = '';
  let location: string | null = null;
  const services: string[] = [];
  const socialLinks: string[] = [];

  for (const block of blocks) {
    const content = block.content || {};
    
    if (block.type === 'profile' || block.type === 'avatar') {
      name = getTranslated(content.name, lang) || getTranslated(block.title, lang) || name;
      bio = getTranslated(content.bio, lang) || getTranslated(content.description, lang) || bio;
      avatar = content.avatarUrl || content.imageUrl || avatar;
      role = getTranslated(content.role, lang) || getTranslated(content.subtitle, lang) || role;
      location = content.location || location;
    }
    
    if (block.type === 'text' && !bio) {
      bio = getTranslated(content, lang) || getTranslated(block.title, lang) || bio;
    }
    
    if (block.type === 'pricing' && content.items) {
      for (const item of content.items) {
        const serviceName = getTranslated(item.name, lang);
        if (serviceName) services.push(serviceName);
      }
    }
    
    if (block.type === 'socials' && content.platforms) {
      for (const platform of content.platforms) {
        if (platform.url) socialLinks.push(platform.url);
      }
    }
    
    if ((block.type === 'link' || block.type === 'button') && content.url) {
      const url = content.url;
      if (url.includes('instagram.com') || url.includes('t.me') || 
          url.includes('youtube.com') || url.includes('tiktok.com')) {
        socialLinks.push(url);
      }
    }
  }

  return { name, bio, avatar, role, location, services, socialLinks };
}

function getTranslated(value: any, lang: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[lang] || value.ru || value.en || value.kk || '';
  }
  return '';
}

function generateMetaTags(page: PageData, profile: Profile, slug: string, lang: string) {
  const name = profile.name || page.title || `@${slug}`;
  const description = profile.bio || page.description || '';
  const role = profile.role;
  
  // Build title
  let title = name;
  if (role) title += ` - ${role}`;
  title += ' | lnkmx';
  
  // Build description (max 160 chars)
  let metaDescription = description;
  if (role && !metaDescription.includes(role)) {
    metaDescription = `${role}. ${metaDescription}`;
  }
  metaDescription = metaDescription.slice(0, 157) + (metaDescription.length > 157 ? '...' : '');
  
  const canonical = `https://lnkmx.my/${slug}`;
  const ogImage = profile.avatar || page.avatar_url || 'https://lnkmx.my/og-image.png';

  return {
    title,
    description: metaDescription,
    canonical,
    ogImage,
    robots: 'index, follow',
  };
}

function generateJsonLd(page: PageData, profile: Profile, blocks: Block[], slug: string, lang: string): string {
  const canonical = `https://lnkmx.my/${slug}`;
  const schemas: any[] = [];
  
  // Person/Organization schema
  const entityType = profile.services.length > 0 ? 'LocalBusiness' : 'Person';
  const mainEntity: any = {
    '@type': entityType,
    '@id': `${canonical}#${entityType.toLowerCase()}`,
    name: profile.name || page.title || slug,
    url: canonical,
    description: profile.bio || page.description,
  };
  
  if (profile.avatar) {
    mainEntity.image = profile.avatar;
  }
  
  if (profile.role) {
    mainEntity.jobTitle = profile.role;
  }
  
  if (profile.location) {
    mainEntity.address = {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    };
  }
  
  if (profile.socialLinks.length > 0) {
    mainEntity.sameAs = profile.socialLinks;
  }
  
  if (profile.services.length > 0 && entityType === 'LocalBusiness') {
    mainEntity.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: lang === 'ru' ? 'Услуги' : lang === 'kk' ? 'Қызметтер' : 'Services',
      itemListElement: profile.services.map((service, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    };
  }
  
  schemas.push(mainEntity);
  
  // WebPage schema
  schemas.push({
    '@type': 'WebPage',
    '@id': canonical,
    url: canonical,
    name: profile.name || slug,
    description: profile.bio,
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://lnkmx.my/#website',
      name: 'lnkmx',
      url: 'https://lnkmx.my/',
    },
    about: { '@id': `${canonical}#${entityType.toLowerCase()}` },
    dateModified: page.updated_at,
    inLanguage: lang,
  });
  
  // BreadcrumbList
  schemas.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'lnkmx',
        item: 'https://lnkmx.my/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: profile.name || slug,
        item: canonical,
      },
    ],
  });
  
  // FAQ schema if available
  const faqBlock = blocks.find(b => b.type === 'faq');
  const faqItems = faqBlock?.content?.items;
  if (faqItems && Array.isArray(faqItems) && faqItems.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item: any) => ({
        '@type': 'Question',
        name: getTranslated(item.question, lang),
        acceptedAnswer: {
          '@type': 'Answer',
          text: getTranslated(item.answer, lang),
        },
      })),
    });
  }
  
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  });
}

function generateHtml(
  page: PageData, 
  profile: Profile, 
  blocks: Block[], 
  meta: any, 
  jsonLd: string, 
  slug: string,
  lang: string
): string {
  const labels = {
    about: { ru: 'О специалисте', en: 'About', kk: 'Маман туралы' },
    services: { ru: 'Услуги', en: 'Services', kk: 'Қызметтер' },
    contacts: { ru: 'Контакты', en: 'Contacts', kk: 'Байланыс' },
    faq: { ru: 'Вопросы и ответы', en: 'FAQ', kk: 'Сұрақтар мен жауаптар' },
  };
  
  // Extract services from pricing blocks
  const pricingBlock = blocks.find(b => b.type === 'pricing');
  const services = pricingBlock?.content?.items || [];
  
  // Extract FAQ
  const faqBlock = blocks.find(b => b.type === 'faq');
  const faqItems = faqBlock?.content?.items || [];
  
  // Extract links
  const linkBlocks = blocks.filter(b => b.type === 'link' || b.type === 'button');
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  <meta name="robots" content="${meta.robots}">
  <meta name="googlebot" content="${meta.robots}">
  
  <link rel="canonical" href="${meta.canonical}">
  <link rel="alternate" hreflang="ru" href="${meta.canonical}?lang=ru">
  <link rel="alternate" hreflang="en" href="${meta.canonical}?lang=en">
  <link rel="alternate" hreflang="kk" href="${meta.canonical}?lang=kk">
  <link rel="alternate" hreflang="x-default" href="${meta.canonical}">
  
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:url" content="${meta.canonical}">
  <meta property="og:image" content="${meta.ogImage}">
  <meta property="og:site_name" content="lnkmx">
  <meta property="og:locale" content="${lang === 'kk' ? 'kk_KZ' : lang === 'en' ? 'en_US' : 'ru_RU'}">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${meta.ogImage}">
  <meta name="twitter:site" content="@lnkmx_app">
  
  <script type="application/ld+json">${jsonLd}</script>
  
  <style>
    body { font-family: Inter, -apple-system, sans-serif; margin: 0; padding: 20px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.25rem; margin-top: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    .role { color: #666; font-size: 1rem; margin-bottom: 1rem; }
    .bio { margin-bottom: 1.5rem; }
    .avatar { width: 96px; height: 96px; border-radius: 50%; margin-bottom: 1rem; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .service { padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; }
    .service-name { font-weight: 500; }
    .service-price { color: #666; }
    .faq-q { font-weight: 500; margin-top: 1rem; }
    .faq-a { color: #444; margin-left: 1rem; }
    footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.875rem; color: #666; }
  </style>
</head>
<body>
  <article itemscope itemtype="https://schema.org/${profile.services.length > 0 ? 'LocalBusiness' : 'Person'}">
    <header id="about">
      ${profile.avatar ? `<img src="${profile.avatar}" alt="${escapeHtml(profile.name)}" class="avatar" itemprop="image">` : ''}
      <h1 itemprop="name">${escapeHtml(profile.name || `@${slug}`)}</h1>
      ${profile.role ? `<p class="role" itemprop="jobTitle">${escapeHtml(profile.role)}</p>` : ''}
      ${profile.bio ? `<p class="bio" itemprop="description">${escapeHtml(profile.bio)}</p>` : ''}
      <link itemprop="url" href="${meta.canonical}">
      ${profile.socialLinks.map(url => `<link itemprop="sameAs" href="${url}">`).join('\n      ')}
    </header>
    
    ${services.length > 0 ? `
    <section id="services">
      <h2>${labels.services[lang as keyof typeof labels.services] || labels.services.en}</h2>
      <div itemprop="hasOfferCatalog" itemscope itemtype="https://schema.org/OfferCatalog">
        ${services.map((s: any) => `
        <div class="service" itemprop="itemListElement" itemscope itemtype="https://schema.org/Offer">
          <span class="service-name" itemprop="name">${escapeHtml(getTranslated(s.name, lang))}</span>
          ${s.price ? `<span class="service-price"> - <span itemprop="price">${s.price}</span> <meta itemprop="priceCurrency" content="${s.currency || 'KZT'}"></span>` : ''}
          ${s.description ? `<p itemprop="description">${escapeHtml(getTranslated(s.description, lang))}</p>` : ''}
        </div>`).join('')}
      </div>
    </section>` : ''}
    
    ${linkBlocks.length > 0 ? `
    <section id="contacts">
      <h2>${labels.contacts[lang as keyof typeof labels.contacts] || labels.contacts.en}</h2>
      <ul>
        ${linkBlocks.map((b: any) => `
        <li><a href="${b.content?.url || '#'}" rel="noopener">${escapeHtml(getTranslated(b.content?.title || b.title, lang))}</a></li>`).join('')}
      </ul>
    </section>` : ''}
    
    ${faqItems.length > 0 ? `
    <section id="faq" itemscope itemtype="https://schema.org/FAQPage">
      <h2>${labels.faq[lang as keyof typeof labels.faq] || labels.faq.en}</h2>
      ${faqItems.map((item: any) => `
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <p class="faq-q" itemprop="name">${escapeHtml(getTranslated(item.question, lang))}</p>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p class="faq-a" itemprop="text">${escapeHtml(getTranslated(item.answer, lang))}</p>
        </div>
      </div>`).join('')}
    </section>` : ''}
    
    <footer>
      <p>${lang === 'ru' ? 'Страница создана на' : lang === 'kk' ? 'Бет жасалған' : 'Page created on'} <a href="https://lnkmx.my/">lnkmx.my</a></p>
      <p><a href="${meta.canonical}">${meta.canonical}</a></p>
    </footer>
  </article>
  
  <!-- Redirect to SPA for humans -->
  <script>
    if (!navigator.userAgent.match(/(bot|crawl|spider|slurp|google|bing|yandex|baidu|facebook|twitter|linkedin|telegram|whatsapp|discord)/i)) {
      window.location.href = '${meta.canonical}';
    }
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
