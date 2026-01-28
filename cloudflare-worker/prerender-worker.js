/**
 * Cloudflare Worker for SEO/AEO/GEO Bot Routing
 * 
 * Routes search engine bots and AI crawlers to our SSR Edge Function
 * while serving the normal SPA to human users.
 * 
 * Deploy: wrangler deploy
 * Test: curl -A "Googlebot" https://lnkmx.my/your-slug
 */

// Edge Function URL for server-side rendering
const SSR_FUNCTION_URL = 'https://pphdcfxucfndmwulpfwv.supabase.co/functions/v1/seo';

// Bot User-Agent patterns for detection
const BOT_AGENTS = [
  // Search Engine Crawlers
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'duckduckbot',
  'slurp',           // Yahoo
  'sogou',
  'exabot',
  'facebot',         // Facebook
  'ia_archiver',     // Alexa
  
  // AI & Answer Engines (AEO/GEO)
  'chatgpt-user',
  'gptbot',
  'claude-web',
  'anthropic-ai',
  'perplexity',
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
  'vkshare',
];

// File extensions to ignore (static assets)
const IGNORED_EXTENSIONS = [
  '.js', '.css', '.xml', '.less', '.png', '.jpg', '.jpeg', '.gif', '.pdf',
  '.doc', '.txt', '.ico', '.rss', '.zip', '.mp3', '.rar', '.exe', '.wmv',
  '.avi', '.ppt', '.mpg', '.mpeg', '.tif', '.wav', '.mov', '.psd', '.ai',
  '.xls', '.mp4', '.m4a', '.swf', '.dat', '.dmg', '.iso', '.flv', '.m4v',
  '.torrent', '.woff', '.woff2', '.ttf', '.eot', '.svg', '.webp', '.webm',
  '.avif', '.map', '.json', '.wasm'
];

// Paths to exclude from SSR
const EXCLUDED_PATHS = [
  '/api/',
  '/dashboard',
  '/crm',
  '/auth',
  '/login',
  '/signup',
  '/editor',
  '/_',
  '/admin',
  '/.well-known',
  '/install',
  '/join/',
  '/team/',
  '/p/',
  '/event-scanner',
  '/legacy',
];

// Static pages that don't need SSR (already have good static HTML)
const STATIC_PAGES = [
  '/',
  '/gallery',
  '/pricing',
  '/alternatives',
  '/experts',
  '/terms',
  '/privacy',
  '/payment-terms',
  '/bento',
];

/**
 * Check if the request is from a bot
 */
function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

/**
 * Check if the path should be excluded from SSR
 */
function shouldExclude(pathname) {
  // Check excluded paths
  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return true;
  }
  
  // Check file extensions
  const ext = pathname.substring(pathname.lastIndexOf('.'));
  if (IGNORED_EXTENSIONS.includes(ext.toLowerCase())) {
    return true;
  }
  
  return false;
}

/**
 * Check if the path is a static page
 */
function isStaticPage(pathname) {
  return STATIC_PAGES.includes(pathname) || 
         pathname.startsWith('/experts/');
}

/**
 * Extract slug from pathname
 */
function extractSlug(pathname) {
  // Remove leading slash and any trailing slashes
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  return slug || null;
}

/**
 * Main request handler
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('User-Agent') || '';
  const pathname = url.pathname;
  
  // Skip excluded paths and static assets
  if (shouldExclude(pathname)) {
    return fetch(request);
  }
  
  // Check for _escaped_fragment_ (legacy but still used)
  const hasEscapedFragment = url.searchParams.has('_escaped_fragment_');
  
  // Only SSR for bots or escaped fragment requests
  if (!isBot(userAgent) && !hasEscapedFragment) {
    return fetch(request);
  }
  
  // Static pages don't need SSR - they have good HTML already
  if (isStaticPage(pathname)) {
    return fetch(request);
  }
  
  // Extract slug for user pages
  const slug = extractSlug(pathname);
  if (!slug) {
    return fetch(request);
  }
  
  // Get language from query params
  const lang = url.searchParams.get('lang') || 'ru';
  
  // Build SSR URL
  const ssrUrl = `${SSR_FUNCTION_URL}?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}`;
  
  try {
    // Fetch SSR content from Edge Function
    const ssrResponse = await fetch(ssrUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': userAgent,
      },
    });
    
    // Check if SSR returned a valid response
    if (ssrResponse.ok) {
      // Clone response and add custom headers
      const responseHeaders = new Headers(ssrResponse.headers);
      responseHeaders.set('X-SSR-Rendered', 'true');
      responseHeaders.set('X-SSR-Slug', slug);
      
      // Ensure proper content type
      responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
      
      return new Response(ssrResponse.body, {
        status: ssrResponse.status,
        statusText: ssrResponse.statusText,
        headers: responseHeaders,
      });
    }
    
    // If SSR fails (404 for unpublished pages, etc.), fall back to origin
    console.log(`SSR returned status ${ssrResponse.status} for slug: ${slug}`);
    return fetch(request);
    
  } catch (error) {
    // On any error, fall back to origin
    console.error('SSR error:', error.message);
    return fetch(request);
  }
}

// Event listener for Cloudflare Worker (legacy)
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// For Cloudflare Workers with modules syntax (wrangler 2.x+)
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
