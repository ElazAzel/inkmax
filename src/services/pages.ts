/**
 * Page service - handles all page-related API operations
 */
import { supabase } from '@/integrations/supabase/client';
import type { PageData, Block } from '@/types/page';
import { createDefaultPageData } from '@/lib/constants';

// ============= Types =============
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
  schedule?: any;
}

export interface SavePageResult {
  data: DbPage | null;
  error: any;
}

export interface LoadPageResult {
  data: PageData | null;
  error: any;
}

export interface LoadUserPageResult {
  data: PageData | null;
  chatbotContext: string | null;
  error: any;
}

// ============= Helpers =============

/**
 * Get user's slug from their profile or generate one
 */
async function getUserSlug(userId: string): Promise<string> {
  // Try to get username from profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('username')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.username) {
    return profile.username;
  }

  // Check for existing page slug
  const { data: existingPage } = await supabase
    .from('pages')
    .select('slug')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingPage?.slug) {
    return existingPage.slug;
  }

  // Generate new unique slug
  const baseSlug = `user-${userId.slice(0, 8)}`;
  const { data: generatedSlug } = await supabase.rpc('generate_unique_slug', {
    base_slug: baseSlug.toLowerCase().replace(/[^a-z0-9]/g, ''),
  });

  return generatedSlug || baseSlug;
}

/**
 * Deduplicate blocks by id (keep first occurrence)
 */
function deduplicateBlocks(blocks: DbBlock[]): DbBlock[] {
  const seenIds = new Set<string>();
  return blocks.filter((block) => {
    const blockId = (block.content as any)?.id;
    if (blockId && seenIds.has(blockId)) {
      return false;
    }
    if (blockId) seenIds.add(blockId);
    return true;
  });
}

/**
 * Convert DB blocks to PageData blocks
 */
function convertDbBlocksToBlocks(dbBlocks: DbBlock[]): Block[] {
  const sorted = [...dbBlocks].sort((a, b) => a.position - b.position);
  const unique = deduplicateBlocks(sorted);
  return unique.map((block) => block.content as Block);
}

// ============= API Functions =============

/**
 * Save page to database with atomic operations
 */
export async function savePage(
  pageData: PageData,
  userId: string,
  chatbotContext?: string
): Promise<SavePageResult> {
  try {
    const slug = await getUserSlug(userId);

    // Extract profile block data
    const profileBlock = pageData.blocks.find((b) => b.type === 'profile') as any;

    // Upsert page atomically
    const { data: pageId, error: upsertError } = await supabase.rpc('upsert_user_page', {
      p_user_id: userId,
      p_slug: slug,
      p_title: profileBlock?.name || 'My Page',
      p_description: profileBlock?.bio || null,
      p_avatar_url: profileBlock?.avatar || null,
      p_avatar_style: profileBlock?.avatarStyle || { type: 'default', color: '#000000' },
      p_theme_settings: pageData.theme as any,
      p_seo_meta: pageData.seo as any,
    });

    if (upsertError) {
      console.error('Error upserting page:', upsertError);
      return { data: null, error: upsertError };
    }

    // Prepare blocks for atomic save
    const blocksData = pageData.blocks.map((block, index) => ({
      type: block.type,
      position: index,
      title: 'title' in block ? block.title : null,
      content: JSON.parse(JSON.stringify(block)),
      style: {},
      schedule: 'schedule' in block ? block.schedule : null,
    }));

    // Save blocks atomically
    const { error: blocksError } = await supabase.rpc('save_page_blocks', {
      p_page_id: pageId,
      p_blocks: JSON.parse(JSON.stringify(blocksData)),
      p_is_premium: pageData.isPremium || false,
    });

    if (blocksError) {
      console.error('Error saving blocks:', blocksError);
      return { data: null, error: blocksError };
    }

    // Save chatbot context if provided
    if (chatbotContext !== undefined) {
      const { error: contextError } = await supabase.from('private_page_data').upsert(
        {
          page_id: pageId,
          chatbot_context: chatbotContext || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page_id' }
      );

      if (contextError) {
        console.error('Error saving chatbot context:', contextError);
      }
    }

    // Fetch and return the saved page
    const { data: page, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (fetchError) {
      console.error('Error fetching page after save:', fetchError);
      return { data: null, error: fetchError };
    }

    return { data: page, error: null };
  } catch (error) {
    console.error('Error saving page:', error);
    return { data: null, error };
  }
}

/**
 * Load public page by slug
 */
export async function loadPageBySlug(slug: string): Promise<LoadPageResult> {
  try {
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*, blocks(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (pageError) {
      console.error('Error loading page by slug:', pageError);
      return { data: null, error: pageError };
    }

    if (!page) {
      return { data: null, error: new Error('Page not found') };
    }

    // Increment view count
    await supabase.rpc('increment_view_count', { page_slug: slug });

    const pageData: PageData = {
      id: page.id,
      userId: page.user_id,
      blocks: convertDbBlocksToBlocks(page.blocks as DbBlock[]),
      theme: page.theme_settings as any,
      seo: page.seo_meta as any,
      isPremium: (page.blocks as DbBlock[]).some((b) => b.is_premium),
    };

    return { data: pageData, error: null };
  } catch (error) {
    console.error('Error loading page:', error);
    return { data: null, error };
  }
}

/**
 * Load user's own page
 */
export async function loadUserPage(userId: string): Promise<LoadUserPageResult> {
  try {
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*, blocks(*), private_page_data(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (pageError) {
      if (pageError.code === 'PGRST116') {
        return {
          data: createDefaultPageData(userId),
          chatbotContext: null,
          error: null,
        };
      }
      return { data: null, chatbotContext: null, error: pageError };
    }

    if (!page) {
      return {
        data: createDefaultPageData(userId),
        chatbotContext: null,
        error: null,
      };
    }

    const pageData: PageData = {
      id: page.id,
      blocks: convertDbBlocksToBlocks(page.blocks as DbBlock[]),
      theme: page.theme_settings as any,
      seo: page.seo_meta as any,
      isPremium: (page.blocks as DbBlock[]).some((b) => b.is_premium),
    };

    // Extract chatbot context
    const privateData = page.private_page_data as any;
    const chatbotContext = Array.isArray(privateData)
      ? privateData[0]?.chatbot_context
      : privateData?.chatbot_context;

    return { data: pageData, chatbotContext: chatbotContext || null, error: null };
  } catch (error) {
    console.error('Error loading user page:', error);
    return { data: null, chatbotContext: null, error };
  }
}

/**
 * Publish user's page
 */
export async function publishPage(userId: string): Promise<{ slug: string | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .update({ is_published: true })
      .eq('user_id', userId)
      .select('slug')
      .maybeSingle();

    if (error) return { slug: null, error };
    if (!data) return { slug: null, error: new Error('Page not found') };

    return { slug: data.slug, error: null };
  } catch (error) {
    console.error('Error publishing page:', error);
    return { slug: null, error };
  }
}

/**
 * Track analytics event
 */
export async function trackEvent(
  pageId: string,
  eventType: 'view' | 'click' | 'share',
  blockId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('analytics').insert({
      page_id: pageId,
      block_id: blockId || null,
      event_type: eventType,
      metadata: metadata || {},
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}
