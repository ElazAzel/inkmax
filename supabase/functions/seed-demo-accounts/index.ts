import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'
import { DEMO_PAGES } from './demo-data.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const results: { email: string; status: string; error?: string }[] = []

    for (let i = 0; i < DEMO_PAGES.length; i++) {
      const demoPage = DEMO_PAGES[i]
      const accountNum = i + 1
      const email = `demoaccount${accountNum}@gmail.com`
      const password = `Account@123${accountNum}`

      try {
        // Create user via Admin API
        const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            display_name: demoPage.title,
            username: demoPage.slug
          }
        })

        if (createError) {
          // User might already exist
          if (createError.message.includes('already been registered')) {
            results.push({ email, status: 'already_exists' })
            continue
          }
          throw createError
        }

        const userId = userData.user.id

        // Create user profile
        await supabaseAdmin.from('user_profiles').upsert({
          id: userId,
          username: demoPage.slug,
          display_name: demoPage.title,
          bio: demoPage.description,
          avatar_url: demoPage.avatarUrl,
          is_premium: true,
          premium_tier: 'business',
          trial_ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })

        // Create page
        const { data: pageData, error: pageError } = await supabaseAdmin.from('pages').insert({
          user_id: userId,
          slug: demoPage.slug,
          title: demoPage.title,
          description: demoPage.description,
          avatar_url: demoPage.avatarUrl,
          avatar_style: demoPage.avatarStyle,
          theme_settings: demoPage.themeSettings,
          seo_meta: { title: demoPage.title, description: demoPage.description },
          is_published: true,
          is_in_gallery: true,
          gallery_featured_at: new Date().toISOString(),
          niche: demoPage.niche,
          editor_mode: 'linear'
        }).select('id').single()

        if (pageError) throw pageError

        // Create blocks
        const blocksToInsert = demoPage.blocks.map((block: Record<string, unknown>, position: number) => ({
          page_id: pageData.id,
          type: block.type as string,
          position,
          title: (block.content as Record<string, unknown>)?.title?.ru || (block.content as Record<string, unknown>)?.name?.ru || null,
          content: block.content,
          style: (block.style as Record<string, unknown>) || {},
          is_premium: true
        }))

        await supabaseAdmin.from('blocks').insert(blocksToInsert)

        results.push({ email, status: 'created' })
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error'
        results.push({ email, status: 'error', error: errMsg })
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
