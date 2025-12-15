import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, ArrowRight, Crown, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGallery } from '@/hooks/useGallery';
import { PagePreview } from '@/components/gallery/PagePreview';

export function LandingGallerySection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pages, loading } = useGallery();

  // Get top 6 pages for display
  const displayPages = pages.slice(0, 6);

  if (loading || displayPages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-primary">{t('landing.gallery.badge', 'Community')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {t('landing.gallery.title', 'Explore Community Pages')}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('landing.gallery.subtitle', 'Get inspired by amazing pages created by our community')}
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {displayPages.map((page) => (
            <Card 
              key={page.id} 
              className="group cursor-pointer bg-card/50 backdrop-blur-xl border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-glass-lg overflow-hidden"
              onClick={() => navigate(`/${page.slug}`)}
            >
              {/* Page Preview Screenshot */}
              <PagePreview
                slug={page.slug}
                title={page.title}
                avatarUrl={page.avatar_url}
                previewUrl={page.preview_url}
                className="aspect-[4/3] w-full"
              />
              
              {/* Page Info */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-semibold text-sm sm:text-base truncate flex-1">
                    {page.title || page.slug}
                  </h3>
                  {page.is_premium && (
                    <Crown className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  {page.niche && (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">
                      {t(`niches.${page.niche}`, page.niche)}
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {page.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {page.gallery_likes || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/gallery')}
            className="rounded-2xl px-8 py-6 text-base font-semibold bg-background/60 backdrop-blur-xl hover:bg-accent border-border/50 hover:border-primary/30 transition-all group"
          >
            {t('landing.gallery.viewAll', 'Explore All Pages')}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
