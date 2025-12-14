import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityGallery } from '@/components/gallery/CommunityGallery';

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

        <CommunityGallery />
      </div>
    </div>
  );
}
