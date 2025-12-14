import { supabase } from '@/integrations/supabase/client';
import type { Niche } from '@/lib/niches';

export interface GalleryPage {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  gallery_likes: number;
  gallery_featured_at: string | null;
  view_count: number | null;
  niche: string | null;
}

export type LeaderboardPeriod = 'week' | 'month' | 'all';

export async function getGalleryPages(niche?: Niche | null): Promise<GalleryPage[]> {
  let query = supabase
    .from('pages')
    .select('id, slug, title, description, avatar_url, gallery_likes, gallery_featured_at, view_count, niche')
    .eq('is_in_gallery', true)
    .eq('is_published', true);

  if (niche) {
    query = query.eq('niche', niche);
  }

  const { data, error } = await query
    .order('gallery_featured_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching gallery pages:', error);
    return [];
  }

  return (data || []) as GalleryPage[];
}

export async function getNicheCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('pages')
    .select('niche')
    .eq('is_in_gallery', true)
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching niche counts:', error);
    return {};
  }

  const counts: Record<string, number> = {};
  (data || []).forEach((page) => {
    const niche = page.niche || 'other';
    counts[niche] = (counts[niche] || 0) + 1;
  });

  return counts;
}

export async function getLeaderboardPages(period: LeaderboardPeriod = 'week'): Promise<GalleryPage[]> {
  let query = supabase
    .from('pages')
    .select('id, slug, title, description, avatar_url, gallery_likes, gallery_featured_at, view_count, niche')
    .eq('is_in_gallery', true)
    .eq('is_published', true);

  // Filter by period
  if (period === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query = query.gte('gallery_featured_at', weekAgo.toISOString());
  } else if (period === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    query = query.gte('gallery_featured_at', monthAgo.toISOString());
  }

  const { data, error } = await query
    .order('gallery_likes', { ascending: false })
    .order('view_count', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard:', error);
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
