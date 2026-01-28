import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req: Request) => {
  console.log('seo: request received', req.url);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const lang = url.searchParams.get('lang') || 'ru';

    console.log('seo: slug=', slug, 'lang=', lang);

    if (!slug) {
      return new Response('Slug required', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('seo: Missing env vars');
      return new Response('Server error', { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id, slug, title, description, avatar_url, updated_at, niche')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    console.log('seo: page result', page ? 'found' : 'not found');

    if (!page || pageError) {
      const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>Not Found | lnkmx</title>
  <meta name="robots" content="noindex, nofollow">
</head>
<body><h1>Page not found</h1></body>
</html>`;
      return new Response(html, { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' } 
      });
    }

    const { data: blocks } = await supabase
      .from('blocks')
      .select('type, title, content')
      .eq('page_id', page.id)
      .order('position');

    const name = escapeHtml(page.title || '@' + slug);
    const desc = escapeHtml(page.description || '');
    const canonical = 'https://lnkmx.my/' + slug;
    const avatar = page.avatar_url || 'https://lnkmx.my/og-image.png';

    let content = '';
    if (blocks && blocks.length > 0) {
      for (const b of blocks.slice(0, 10)) {
        const t = b.title ? escapeHtml(b.title) : '';
        if (b.type === 'text' && b.content?.text) {
          content += '<p>' + escapeHtml(b.content.text) + '</p>';
        } else if (b.type === 'link' && b.content?.url) {
          content += '<p><a href="' + escapeHtml(b.content.url) + '">' + (t || escapeHtml(b.content.url)) + '</a></p>';
        } else if (t) {
          content += '<h2>' + t + '</h2>';
        }
      }
    }

    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": page.title || '@' + slug,
      "url": canonical,
      "image": avatar,
      "description": desc
    });

    const html = '<!DOCTYPE html>\n<html lang="' + lang + '">\n<head>\n  <meta charset="UTF-8">\n  <title>' + name + ' | lnkmx</title>\n  <meta name="description" content="' + desc.slice(0, 160) + '">\n  <meta name="robots" content="index, follow">\n  <link rel="canonical" href="' + canonical + '">\n  <meta property="og:type" content="profile">\n  <meta property="og:title" content="' + name + '">\n  <meta property="og:description" content="' + desc.slice(0, 160) + '">\n  <meta property="og:url" content="' + canonical + '">\n  <meta property="og:image" content="' + avatar + '">\n  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="' + name + '">\n  <meta name="twitter:description" content="' + desc.slice(0, 160) + '">\n  <meta name="twitter:image" content="' + avatar + '">\n  <script type="application/ld+json">' + jsonLd + '</script>\n</head>\n<body>\n  <h1>' + name + '</h1>\n  ' + (desc ? '<p>' + desc + '</p>' : '') + '\n  ' + content + '\n  <footer><a href="https://lnkmx.my/">lnkmx.my</a></footer>\n</body>\n</html>';

    console.log('seo: returning HTML');

    return new Response(html, {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'index, follow',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('seo: error', error);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});
