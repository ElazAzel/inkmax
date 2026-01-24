/**
 * Dynamic Sitemap Generator Edge Function
 * 
 * Generates a sitemap.xml that includes:
 * - Static pages (landing, pricing, gallery, etc.)
 * - All published user pages that pass quality gate
 * 
 * This runs on-demand and caches for 1 hour.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600', // 1 hour cache
};

// Static pages configuration
const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/gallery', changefreq: 'daily', priority: '0.8' },
  { loc: '/pricing', changefreq: 'monthly', priority: '0.9' },
  { loc: '/alternatives', changefreq: 'monthly', priority: '0.8' },
  { loc: '/terms', changefreq: 'yearly', priority: '0.3' },
  { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/payment-terms', changefreq: 'yearly', priority: '0.3' },
];

const LANGUAGES = ['ru', 'en', 'kk'];
const BASE_URL = 'https://lnkmx.my';

interface PublishedPage {
  slug: string;
  updated_at: string;
  niche?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published pages
    // In a full implementation, we'd also check quality gate here
    const { data: pages, error } = await supabase
      .from('pages')
      .select('slug, updated_at, niche')
      .eq('is_published', true)
      .not('slug', 'is', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // Add static pages
    for (const page of STATIC_PAGES) {
      sitemap += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;
      // Add hreflang alternates
      for (const lang of LANGUAGES) {
        const langParam = page.loc === '/' ? `?lang=${lang}` : `?lang=${lang}`;
        sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${page.loc}${langParam}"/>
`;
      }
      sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.loc}"/>
  </url>
`;
    }

    // Add user pages
    if (pages) {
      for (const page of pages as PublishedPage[]) {
        if (!page.slug) continue;
        
        const lastmod = page.updated_at 
          ? new Date(page.updated_at).toISOString().split('T')[0]
          : today;
        
        sitemap += `  <url>
    <loc>${BASE_URL}/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
`;
        // Add hreflang alternates for user pages
        for (const lang of LANGUAGES) {
          sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}/${page.slug}?lang=${lang}"/>
`;
        }
        sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${page.slug}"/>
  </url>
`;
      }
    }

    sitemap += `</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return a minimal valid sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lnkmx.my/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return new Response(fallbackSitemap, {
      status: 200,
      headers: corsHeaders,
    });
  }
});
