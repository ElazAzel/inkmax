/**
 * Cloudflare Worker for SEO/AEO/GEO Bot Routing
 * 
 * Routes search engine bots and AI crawlers to SSR Edge Function
 * while serving the normal SPA to human users.
 * 
 * Architecture:
 * - WHITELIST: Marketing pages (not slugs)
 * - BLACKLIST: Private pages (never SSR, never index)
 * - SLUG: Single-segment paths not in whitelist/blacklist -> SSR for bots
 * - SITEMAP: /sitemap.xml -> proxy to generate-sitemap
 */

// Supabase Edge Function URL (combined sitemap + SSR)
const SUPABASE_PROJECT = 'pphdcfxucfndmwulpfwv';
const FUNCTION_URL = `https://${SUPABASE_PROJECT}.supabase.co/functions/v1/generate-sitemap`;
// Both SSR and Sitemap use the same function now (slug param triggers SSR mode)
const SSR_FUNCTION_URL = FUNCTION_URL;
const SITEMAP_FUNCTION_URL = FUNCTION_URL;

// WHITELIST: Marketing/static pages - NOT treated as slugs
// These pages have their own SPA routes and don't need SSR from render-page
const WHITELIST_PAGES = new Set([
  '',           // root /
  'pricing',
  'gallery',
  'experts',
  'alternatives',
  'terms',
  'privacy',
  'payment-terms',
  'contact',
  'bento',
  'legacy',
]);

// BLACKLIST: Private pages - never SSR, never index
// These should return SPA as-is, worker doesn't touch them
const BLACKLIST_PREFIXES = [
  'auth',
  'dashboard',
  'dashboard-v2',
  'editor',
  'crm',
  'admin',
  'api',
  'settings',
  'install',
  'team',
  'join',
  'p',
  'collab',
  'event-scanner',
];

// Bot User-Agent patterns for SSR routing
const BOT_PATTERNS = [
  // Search Engine Crawlers
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'baiduspider',
  'slurp',           // Yahoo
  'sogou',
  'exabot',
  
  // AI & Answer Engines (AEO/GEO)
  'gptbot',
  'chatgpt-user',
  'claude-web',
  'anthropic-ai',
  'perplexitybot',
  'you.com',
  'cohere-ai',
  'meta-externalagent',
  'google-extended',
  'applebot',
  
  // Social Media Crawlers
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'pinterest',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'discordbot',
];

// Static file extensions - never process
const STATIC_EXTENSIONS = new Set([
  '.js', '.css', '.xml', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif',
  '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.map', '.json',
  '.pdf', '.zip', '.mp3', '.mp4', '.webm', '.wasm',
]);

/**
 * Check if User-Agent is a bot
 */
function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(pattern => ua.includes(pattern));
}

/**
 * Parse pathname into segments
 */
function parsePathname(pathname) {
  // Remove leading/trailing slashes and split
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) return { segments: [], first: '' };
  const segments = clean.split('/');
  return { segments, first: segments[0].toLowerCase() };
}

/**
 * Check if path is a static file
 */
function isStaticFile(pathname) {
  const lastDot = pathname.lastIndexOf('.');
  if (lastDot === -1) return false;
  const ext = pathname.substring(lastDot).toLowerCase();
  return STATIC_EXTENSIONS.has(ext);
}

/**
 * Check if path is blacklisted (private)
 */
function isBlacklisted(firstSegment) {
  return BLACKLIST_PREFIXES.includes(firstSegment);
}

/**
 * Check if path is whitelisted (marketing page)
 */
function isWhitelisted(firstSegment) {
  return WHITELIST_PAGES.has(firstSegment);
}

/**
 * Check if path is a valid slug (single segment, not whitelist/blacklist)
 */
function isSlug(segments, firstSegment) {
  // Must be exactly one segment
  if (segments.length !== 1) return false;
  // Must not be empty
  if (!firstSegment) return false;
  // Must not be whitelist or blacklist
  if (isWhitelisted(firstSegment)) return false;
  if (isBlacklisted(firstSegment)) return false;
  // Must not look like a file
  if (firstSegment.includes('.')) return false;
  return true;
}

/**
 * Main request handler
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get('User-Agent') || '';
  
  // 1. Skip static files - always origin
  if (isStaticFile(pathname)) {
    return fetch(request);
  }
  
  // 2. Handle /sitemap.xml specially - proxy to generate-sitemap
  if (pathname === '/sitemap.xml') {
    try {
      const sitemapResponse = await fetch(SITEMAP_FUNCTION_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml',
          'User-Agent': userAgent,
        },
      });
      
      if (sitemapResponse.ok) {
        const headers = new Headers(sitemapResponse.headers);
        headers.set('Content-Type', 'application/xml; charset=utf-8');
        headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        headers.delete('set-cookie'); // Remove Supabase cookies
        
        return new Response(sitemapResponse.body, {
          status: 200,
          headers,
        });
      }
    } catch (error) {
      console.error('[Worker] Sitemap proxy error:', error);
    }
    // Fallback to origin static sitemap
    return fetch(request);
  }
  
  // 3. Handle /robots.txt - origin
  if (pathname === '/robots.txt') {
    return fetch(request);
  }
  
  // 4. Parse path
  const { segments, first } = parsePathname(pathname);
  
  // 5. Blacklisted paths - always origin (never SSR)
  if (isBlacklisted(first)) {
    return fetch(request);
  }
  
  // 6. Whitelisted marketing pages - always origin
  if (isWhitelisted(first)) {
    return fetch(request);
  }
  
  // 7. Multi-segment paths (e.g., /experts/beauty) - origin
  if (segments.length > 1) {
    return fetch(request);
  }
  
  // 8. Check if this is a slug
  if (!isSlug(segments, first)) {
    return fetch(request);
  }
  
  // 9. It's a slug! Check if bot
  const isBotRequest = isBot(userAgent);
  const hasEscapedFragment = url.searchParams.has('_escaped_fragment_');
  
  // For humans, serve SPA
  if (!isBotRequest && !hasEscapedFragment) {
    return fetch(request);
  }
  
  // 10. Bot + Slug = SSR
  const slug = first;
  const lang = url.searchParams.get('lang') || 'ru';
  
  console.log(`[Worker] SSR for bot: slug=${slug}, ua=${userAgent.substring(0, 50)}`);
  
  const ssrUrl = `${SSR_FUNCTION_URL}?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}`;
  
  try {
    const ssrResponse = await fetch(ssrUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': userAgent,
      },
    });
    
    // Return SSR response with proper status (including 404)
    const responseHeaders = new Headers(ssrResponse.headers);
    responseHeaders.set('X-SSR-Rendered', 'true');
    responseHeaders.set('X-SSR-Slug', slug);
    responseHeaders.delete('set-cookie'); // Remove Supabase cookies
    
    return new Response(ssrResponse.body, {
      status: ssrResponse.status,
      statusText: ssrResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Worker] SSR error:', error);
    // On error, fallback to origin SPA
    return fetch(request);
  }
}

// Legacy event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// ES modules export
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
