import { supabase } from '@/integrations/supabase/client';

export interface GalleryPage {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  gallery_likes: number;
  gallery_featured_at: string | null;
  view_count: number | null;
}

export async function getGalleryPages(): Promise<GalleryPage[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('id, slug, title, description, avatar_url, gallery_likes, gallery_featured_at, view_count')
    .eq('is_in_gallery', true)
    .eq('is_published', true)
    .order('gallery_featured_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching gallery pages:', error);
    return [];
  }

  return (data || []) as GalleryPage[];
}

export async function toggleGalleryStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_gallery_status', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error toggling gallery status:', error);
    throw error;
  }

  return data as boolean;
}

export async function likeGalleryPage(pageId: string): Promise<void> {
  const { error } = await supabase.rpc('like_gallery_page', {
    p_page_id: pageId,
  });

  if (error) {
    console.error('Error liking page:', error);
    throw error;
  }
}

export async function getMyGalleryStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('pages')
    .select('is_in_gallery')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error getting gallery status:', error);
    return false;
  }

  return data?.is_in_gallery ?? false;
}
