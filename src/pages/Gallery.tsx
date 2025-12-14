import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityGallery } from '@/components/gallery/CommunityGallery';
import { Leaderboard } from '@/components/gallery/Leaderboard';

export default function Gallery() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {t('gallery.title', 'Community Gallery')}
            </h1>
            <p className="text-muted-foreground">
              {t('gallery.subtitle', 'Discover pages created by our community')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <Leaderboard />
            </div>
          </div>

          {/* Gallery */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="text-lg font-semibold mb-4">
              {t('gallery.recent', 'Recent Pages')}
            </h2>
            <CommunityGallery />
          </div>
        </div>
      </div>
    </div>
  );
}
