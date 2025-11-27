import { supabase } from '@/integrations/supabase/client';
import type { PageData, Block } from '@/types/page';

export interface DbPage {
  id: string;
  user_id: string;
  slug: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  avatar_style: any;
  theme_settings: any;
  seo_meta: any;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbBlock {
  id: string;
  page_id: string;
  type: string;
  position: number;
  title: string | null;
  content: any;
  style: any;
  is_premium: boolean;
  click_count: number;
  created_at: string;
}

// Save page to database
export async function savePage(pageData: PageData, userId: string): Promise<{ data: DbPage | null; error: any }> {
  try {
    // Проверяем, есть ли уже страница у пользователя
    const { data: existingPage } = await supabase
      .from('pages')
      .select('id, slug')
      .eq('user_id', userId)
      .single();

    let slug = existingPage?.slug;
    
    // Если нет slug, генерируем новый
    if (!slug) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('id', userId)
        .single();
      
      const baseSlug = profile?.username || `user-${userId.slice(0, 8)}`;
      const { data: generatedSlug } = await supabase.rpc('generate_unique_slug', { 
        base_slug: baseSlug.toLowerCase().replace(/[^a-z0-9]/g, '') 
      });
      slug = generatedSlug;
    }

    // Сохраняем или обновляем страницу
    const pageUpdate: any = {
      user_id: userId,
      slug: slug!,
      title: pageData.blocks.find(b => b.type === 'profile')?.name || 'My Page',
      description: pageData.blocks.find(b => b.type === 'profile')?.bio,
      avatar_url: pageData.blocks.find(b => b.type === 'profile')?.avatar,
      theme_settings: pageData.theme as any,
      seo_meta: pageData.seo as any,
      is_published: false,
      updated_at: new Date().toISOString(),
    };

    if (existingPage?.id) {
      pageUpdate.id = existingPage.id;
    }

    const { data: page, error: pageError } = await supabase
      .from('pages')
      .upsert(pageUpdate)
      .select()
      .single();

    if (pageError) return { data: null, error: pageError };

    // Удаляем старые блоки
    await supabase
      .from('blocks')
      .delete()
      .eq('page_id', page.id);

    // Сохраняем блоки
    const blocksToInsert: any[] = pageData.blocks.map((block, index) => ({
      page_id: page.id,
      type: block.type,
      position: index,
      title: 'title' in block ? block.title : null,
      content: block as any,
      style: {} as any,
      is_premium: pageData.isPremium || false,
    }));

    if (blocksToInsert.length > 0) {
      const { error: blocksError } = await supabase
        .from('blocks')
        .insert(blocksToInsert);

      if (blocksError) return { data: null, error: blocksError };
    }

    return { data: page, error: null };
  } catch (error) {
    console.error('Error saving page:', error);
    return { data: null, error };
  }
}

// Load page by slug
export async function loadPageBySlug(slug: string): Promise<{ data: PageData | null; error: any }> {
  try {
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select(`
        *,
        blocks (*)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (pageError || !page) return { data: null, error: pageError };

    // Increment view count
    await supabase.rpc('increment_view_count', { page_slug: slug });

    // Convert to PageData format
    const pageData: PageData = {
      id: page.id,
      blocks: (page.blocks as DbBlock[])
        .sort((a, b) => a.position - b.position)
        .map(block => block.content as Block),
      theme: page.theme_settings as any,
      seo: page.seo_meta as any,
      isPremium: (page.blocks as DbBlock[]).some(b => b.is_premium),
    };

    return { data: pageData, error: null };
  } catch (error) {
    console.error('Error loading page:', error);
    return { data: null, error };
  }
}

// Load user's page
export async function loadUserPage(userId: string): Promise<{ data: PageData | null; error: any }> {
  try {
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select(`
        *,
        blocks (*)
      `)
      .eq('user_id', userId)
      .single();

    if (pageError) {
      // If no page exists, return empty page data
      if (pageError.code === 'PGRST116') {
        return { 
          data: {
            id: userId,
            blocks: [
              {
                id: 'profile-1',
                type: 'profile',
                name: 'Your Name',
                bio: 'Your bio goes here',
              },
            ],
            theme: {
              backgroundColor: 'hsl(var(--background))',
              textColor: 'hsl(var(--foreground))',
              buttonStyle: 'rounded',
              fontFamily: 'sans',
            },
            seo: {
              title: 'My LinkMAX Page',
              description: 'Check out my links',
              keywords: [],
            },
          }, 
          error: null 
        };
      }
      return { data: null, error: pageError };
    }

    // Convert to PageData format
    const pageData: PageData = {
      id: page.id,
      blocks: (page.blocks as DbBlock[])
        .sort((a, b) => a.position - b.position)
        .map(block => block.content as Block),
      theme: page.theme_settings as any,
      seo: page.seo_meta as any,
      isPremium: (page.blocks as DbBlock[]).some(b => b.is_premium),
    };

    return { data: pageData, error: null };
  } catch (error) {
    console.error('Error loading user page:', error);
    return { data: null, error };
  }
}

// Publish page
export async function publishPage(userId: string): Promise<{ slug: string | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .update({ is_published: true })
      .eq('user_id', userId)
      .select('slug')
      .single();

    if (error) return { slug: null, error };

    return { slug: data.slug, error: null };
  } catch (error) {
    console.error('Error publishing page:', error);
    return { slug: null, error };
  }
}

// Track analytics
export async function trackEvent(
  pageId: string, 
  eventType: 'view' | 'click' | 'share', 
  blockId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from('analytics')
      .insert({
        page_id: pageId,
        block_id: blockId || null,
        event_type: eventType,
        metadata: metadata || {},
      });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}
