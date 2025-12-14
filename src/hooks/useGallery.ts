import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  getGalleryPages, 
  toggleGalleryStatus, 
  likeGalleryPage,
  getMyGalleryStatus,
  type GalleryPage 
} from '@/services/gallery';

export function useGallery() {
  const [pages, setPages] = useState<GalleryPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGalleryPages();
      setPages(data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const likePage = useCallback(async (pageId: string) => {
    try {
      await likeGalleryPage(pageId);
      setPages(prev => 
        prev.map(p => 
          p.id === pageId ? { ...p, gallery_likes: p.gallery_likes + 1 } : p
        )
      );
    } catch {
      toast.error('Failed to like page');
    }
  }, []);

  return { pages, loading, likePage, refetch: fetchPages };
}

export function useGalleryStatus(userId: string | undefined) {
  const [isInGallery, setIsInGallery] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getMyGalleryStatus(userId).then(setIsInGallery);
  }, [userId]);

  const toggle = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const newStatus = await toggleGalleryStatus(userId);
      setIsInGallery(newStatus);
      toast.success(
        newStatus 
          ? 'Your page is now in the community gallery!' 
          : 'Your page has been removed from the gallery'
      );
    } catch {
      toast.error('Failed to update gallery status');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { isInGallery, loading, toggle };
}
