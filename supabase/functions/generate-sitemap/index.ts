/**
 * Combined Sitemap + SSR Edge Function
 * 
 * Modes:
 * 1. SITEMAP (default): GET /generate-sitemap -> sitemap.xml
 * 2. SSR: GET /generate-sitemap/ssr/{slug} -> HTML page for bots
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

const BASE_URL = 'https://lnkmx.my';
const LANGUAGES = ['ru', 'en', 'kk'] as const;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Static pages for sitemap
const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/gallery', changefreq: 'daily', priority: '0.8' },
  { loc: '/pricing', changefreq: 'monthly', priority: '0.9' },
  { loc: '/alternatives', changefreq: 'monthly', priority: '0.8' },
  { loc: '/experts', changefreq: 'daily', priority: '0.9' },
  { loc: '/terms', changefreq: 'yearly', priority: '0.3' },
  { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/payment-terms', changefreq: 'yearly', priority: '0.3' },
];

const NICHE_TAGS = [
  'beauty', 'fitness', 'health', 'education', 'consulting',
  'coaching', 'design', 'marketing', 'music', 'photo', 'tech',
  'food', 'travel', 'fashion', 'art', 'realty', 'services', 'events', 'business', 'other'
];

// Types
interface PageData {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  niche: string | null;
}

interface BlockData {
  type: string;
  title: string | null;
  content: Record<string, unknown> | null;
  position: number;
}

interface SitemapPage {
  slug: string;
  updated_at: string | null;
  niche: string | null;
  title: string | null;
  avatar_url: string | null;
}

// ============ UTILITY FUNCTIONS ============

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function truncate(text: string, maxLength: number): string {
  if (!text) return '';
  const clean = stripMarkdownLinks(text);
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength - 3) + '...';
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function findFirstText(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const cleaned = normalizeText(value);
    return cleaned ? cleaned : null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstText(item);
      if (found) return found;
    }
  } else if (typeof value === 'object') {
    for (const item of Object.values(value)) {
      const found = findFirstText(item);
      if (found) return found;
    }
  }
  return null;
}

function collectTextSnippets(page: PageData, blocks: BlockData[]): string[] {
  const snippets: string[] = [];
  if (page.description) {
    const cleaned = normalizeText(page.description);
    if (cleaned) snippets.push(cleaned);
  }
  for (const block of blocks) {
    const blockText = findFirstText(block.content);
    if (blockText) snippets.push(blockText);
    if (block.title) {
      const titleText = normalizeText(block.title);
      if (titleText) snippets.push(titleText);
    }
  }
  return snippets;
}

function buildMetaDescription(snippets: string[]): string {
  const combined = snippets.find(Boolean) || '';
  return truncate(normalizeText(combined), 160);
}

async function generateETag(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `"${hashHex.substring(0, 16)}"`;
}

// ============ SSR HANDLER ============

// deno-lint-ignore no-explicit-any
async function handleSSR(supabase: SupabaseClient<any>, slug: string, lang: string): Promise<Response> {
  console.log('[SSR] Rendering slug:', slug, 'lang:', lang);

  const { data: pageData, error: pageError } = await supabase
    .from('pages')
    .select('id, slug, title, description, avatar_url, updated_at, niche')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  const page = pageData as PageData | null;

  if (!page || pageError) {
    console.log('[SSR] Page not found:', slug);
    const html404 = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>Not Found - LinkMAX</title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="Page not found">
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>The page you are looking for does not exist or has been removed.</p>
  <a href="${BASE_URL}/">Go to homepage</a>
</body>
</html>`;
    return new Response(html404, { 
      status: 404, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html; charset=utf-8', 
        'X-Robots-Tag': 'noindex, nofollow' 
      } 
    });
  }

  const { data: blocksData } = await supabase
    .from('blocks')
    .select('type, title, content, position')
    .eq('page_id', page.id)
    .order('position');

  const blocks = (blocksData || []) as BlockData[];

  const displayName = escapeHtml(page.title || '@' + slug);
  const snippets = collectTextSnippets(page, blocks);
  const primaryOfferOrBio = snippets[0] || 'Profile';
  const cleanDesc = stripMarkdownLinks(primaryOfferOrBio);
  const metaDesc = escapeHtml(buildMetaDescription(snippets));
  const canonical = `${BASE_URL}/${slug}`;
  const avatar = page.avatar_url || `${BASE_URL}/og-image.png`;
  const niche = page.niche || 'business';

  let bodyContent = '';
  const links: { url: string; title: string }[] = [];
  
  let textSectionsCount = 0;
  for (const b of blocks.slice(0, 15)) {
    const blockTitle = b.title ? escapeHtml(b.title) : '';
    const content = b.content;
    
    if (b.type === 'text' && content?.text) {
      if (textSectionsCount < 2) {
        bodyContent += `<section><p>${escapeHtml(String(content.text))}</p></section>\n`;
        textSectionsCount += 1;
      }
    } else if (b.type === 'link' && content?.url) {
      const linkUrl = escapeHtml(String(content.url));
      const linkTitle = blockTitle || linkUrl;
      links.push({ url: linkUrl, title: linkTitle });
    } else if (b.type === 'header' && blockTitle) {
      bodyContent += `<h2>${blockTitle}</h2>\n`;
    } else if (b.type === 'faq' && content?.items && Array.isArray(content.items)) {
      bodyContent += '<section itemscope itemtype="https://schema.org/FAQPage">\n';
      for (const item of (content.items as Array<{question?: string; answer?: string}>).slice(0, 5)) {
        const q = escapeHtml(String(item.question || ''));
        const a = escapeHtml(String(item.answer || ''));
        if (q && a) {
          bodyContent += `<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
  <h3 itemprop="name">${q}</h3>
  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
    <p itemprop="text">${a}</p>
  </div>
</div>\n`;
        }
      }
      bodyContent += '</section>\n';
    } else if (blockTitle) {
      bodyContent += `<h2>${blockTitle}</h2>\n`;
    }
  }

  let linksHtml = '';
  if (links.length > 0) {
    linksHtml = '<nav aria-label="Links"><ul>\n';
    for (const link of links.slice(0, 10)) {
      linksHtml += `  <li><a href="${link.url}" rel="noopener">${link.title}</a></li>\n`;
    }
    linksHtml += '</ul></nav>\n';
  }

  const schemaType = niche === 'business' || niche === 'consulting' ? 'Organization' : 'Person';
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonical,
        "url": canonical,
        "name": `${page.title || '@' + slug} - ${primaryOfferOrBio} | LinkMAX`,
        "description": metaDesc,
        "inLanguage": lang,
        "isPartOf": { "@type": "WebSite", "name": "LinkMAX", "url": BASE_URL }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": page.title || slug, "item": canonical }
        ]
      },
      {
        "@type": schemaType,
        "name": page.title || '@' + slug,
        "url": canonical,
        "image": avatar,
        "description": truncate(cleanDesc, 300)
      }
    ]
  };

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} - ${escapeHtml(primaryOfferOrBio)} | LinkMAX</title>
  <meta name="description" content="${metaDesc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="${displayName} - ${escapeHtml(primaryOfferOrBio)}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${avatar}">
  <meta property="og:site_name" content="LinkMAX">
  <meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : lang === 'kk' ? 'kk_KZ' : 'en_US'}">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${displayName} - ${escapeHtml(primaryOfferOrBio)}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="${avatar}">
  
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 2em; margin-bottom: 0.5em; }
    nav ul { list-style: none; padding: 0; }
    nav li { margin: 0.5em 0; }
    a { color: #0066cc; }
    footer { margin-top: 2em; padding-top: 1em; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${displayName}</h1>
      ${cleanDesc ? `<p>${escapeHtml(cleanDesc)}</p>` : ''}
    </header>
    <article>${bodyContent}</article>
    ${linksHtml}
  </main>
  <footer><p>Created with <a href="${BASE_URL}/">LinkMAX</a></p></footer>
</body>
</html>`;

  console.log('[SSR] Returning HTML for:', slug);
  return new Response(html, {
    status: 200,
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'index, follow',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

// ============ SITEMAP HANDLER ============

// deno-lint-ignore no-explicit-any
async function handleSitemap(supabase: SupabaseClient<any>, req: Request): Promise<Response> {
  console.log('[Sitemap] Generating...');

  const { data: pagesData, error } = await supabase
    .from('pages')
    .select('slug, updated_at, niche, title, avatar_url')
    .eq('is_published', true)
    .not('slug', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(10000);

  if (error) {
    console.error('[Sitemap] Error:', error);
    throw error;
  }

  const pages = (pagesData || []) as SitemapPage[];
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<!--
  lnkmx.my Dynamic Sitemap
  Generated: ${new Date().toISOString()}
  Total URLs: ${STATIC_PAGES.length + NICHE_TAGS.length + pages.length}
  Canonical Domain: ${BASE_URL}
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  for (const page of STATIC_PAGES) {
    const url = page.loc === '/' ? BASE_URL + '/' : BASE_URL + page.loc;
    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;
    for (const lang of LANGUAGES) {
      const langUrl = page.loc === '/' ? `${BASE_URL}/?lang=${lang}` : `${BASE_URL}${page.loc}?lang=${lang}`;
      sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${langUrl}"/>
`;
    }
    sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${url}"/>
  </url>
`;
  }

  for (const tag of NICHE_TAGS) {
    sitemap += `  <url>
    <loc>${BASE_URL}/experts/${tag}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
`;
    for (const lang of LANGUAGES) {
      sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}/experts/${tag}?lang=${lang}"/>
`;
    }
    sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/experts/${tag}"/>
  </url>
`;
  }

  const reservedSlugs = new Set(['admin', 'dashboard', 'auth', 'api', 'install', 'join', 'team', 'p', 'crm']);
  for (const page of pages) {
    if (!page.slug || reservedSlugs.has(page.slug.toLowerCase())) continue;
    
    const lastmod = page.updated_at 
      ? new Date(page.updated_at).toISOString().split('T')[0]
      : today;
    
    const escapedSlug = escapeXml(page.slug);
    
    sitemap += `  <url>
    <loc>${BASE_URL}/${escapedSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
`;
    for (const lang of LANGUAGES) {
      sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}/${escapedSlug}?lang=${lang}"/>
`;
    }
    sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${escapedSlug}"/>
`;
    if (page.avatar_url) {
      const escapedTitle = page.title ? escapeXml(page.title) : escapedSlug;
      sitemap += `    <image:image>
      <image:loc>${escapeXml(page.avatar_url)}</image:loc>
      <image:title>${escapedTitle}</image:title>
    </image:image>
`;
    }
    sitemap += `  </url>
`;
  }

  sitemap += `</urlset>`;

  const etag = await generateETag(sitemap);
  const ifNoneMatch = req.headers.get('If-None-Match');
  if (ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: { 'ETag': etag, 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  }

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'ETag': etag,
      ...corsHeaders,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

// ============ MAIN HANDLER ============

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lang = url.searchParams.get('lang') || 'ru';
    const ssrPrefix = '/functions/v1/generate-sitemap/ssr/';
    const pathname = url.pathname;
    const slug = pathname.startsWith(ssrPrefix)
      ? decodeURIComponent(pathname.slice(ssrPrefix.length)).replace(/^\/+|\/+$/g, '')
      : null;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (slug) {
      return await handleSSR(supabase, slug, lang);
    }

    return await handleSitemap(supabase, req);

  } catch (error) {
    console.error('[Error]', error);
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        ...corsHeaders,
      },
    });
  }
});
