import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  const lang = url.searchParams.get('lang') || 'ru';

  if (!slug) {
    return new Response('Slug required', { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: page } = await supabase
    .from('pages')
    .select('id, slug, title, description, avatar_url, updated_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!page) {
    return new Response('Not found', { status: 404, headers: { ...corsHeaders, 'X-Robots-Tag': 'noindex' } });
  }

  const { data: blocks } = await supabase
    .from('blocks')
    .select('type, title, content')
    .eq('page_id', page.id)
    .order('position');

  const name = page.title || `@${slug}`;
  const desc = page.description || '';
  const canonical = `https://lnkmx.my/${slug}`;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${name} | lnkmx</title>
  <meta name="description" content="${desc.slice(0, 160)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${name}">
  <meta property="og:description" content="${desc.slice(0, 160)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${page.avatar_url || 'https://lnkmx.my/og-image.png'}">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Person","name":"${name}","url":"${canonical}"}
  </script>
</head>
<body>
  <h1>${name}</h1>
  <p>${desc}</p>
  <footer>Created on <a href="https://lnkmx.my/">lnkmx.my</a></footer>
</body>
</html>`;

  return new Response(html, {
    headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'index, follow' }
  });
});
