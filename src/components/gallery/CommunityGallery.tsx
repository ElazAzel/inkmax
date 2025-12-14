import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, ExternalLink, Users, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGallery } from '@/hooks/useGallery';

interface CommunityGalleryProps {
  compact?: boolean;
  maxItems?: number;
}

export function CommunityGallery({ compact = false, maxItems }: CommunityGalleryProps) {
  const { t } = useTranslation();
  const { pages, loading, likePage } = useGallery();
  const [likedPages, setLikedPages] = useState<Set<string>>(new Set());

  const displayPages = maxItems ? pages.slice(0, maxItems) : pages;

  const handleLike = async (pageId: string) => {
    if (likedPages.has(pageId)) return;
    setLikedPages(prev => new Set(prev).add(pageId));
    await likePage(pageId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{t('gallery.empty', 'No pages yet')}</h3>
        <p className="text-muted-foreground">
          {t('gallery.emptyDescription', 'Be the first to share your page!')}
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
      {displayPages.map((page) => (
        <Card 
          key={page.id} 
          className="group overflow-hidden bg-card/50 backdrop-blur-lg border-border/30 hover:shadow-lg transition-all duration-300"
        >
          <CardContent className={compact ? 'p-3' : 'p-4'}>
            <div className="flex items-start gap-3">
              <Avatar className={compact ? 'h-10 w-10' : 'h-12 w-12'}>
                <AvatarImage src={page.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(page.title || page.slug)?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">
                  {page.title || page.slug}
                </h3>
                {!compact && page.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {page.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {page.view_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className={`h-3 w-3 ${likedPages.has(page.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {page.gallery_likes || 0}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleLike(page.id)}
                  disabled={likedPages.has(page.id)}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${
                      likedPages.has(page.id) ? 'fill-red-500 text-red-500' : ''
                    }`} 
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
