import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, QrCode } from 'lucide-react';
import { BlockRenderer } from '@/components/BlockRenderer';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { decompressPageData } from '@/lib/compression';
import { usePublicPage } from '@/hooks/usePageCache';
import { toast } from 'sonner';
import type { PageData, PageTheme } from '@/types/page';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

export default function PublicPage() {
  const { compressed, slug } = useParams<{ compressed?: string; slug?: string }>();
  const [compressedPageData, setCompressedPageData] = useState<PageData | null>(null);
  const [showQR, setShowQR] = useState(false);
  const currentUrl = window.location.href;

  // Use React Query for slug-based pages (with caching)
  const { data: cachedPageData, isLoading: isLoadingCached, error } = usePublicPage(slug);

  // Handle compressed format (old format, no caching)
  useEffect(() => {
    if (compressed) {
      const data = decompressPageData(compressed);
      setCompressedPageData(data);
    }
  }, [compressed]);

  // Determine which data source to use
  const pageData = slug ? cachedPageData : compressedPageData;
  const loading = slug ? isLoadingCached : false;

  // Update document metadata when page data loads
  useEffect(() => {
    if (pageData) {
      document.title = pageData.seo.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', pageData.seo.description);
      }
    }
  }, [pageData]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pageData?.seo.title || 'Check out my LinkMAX',
        url: currentUrl,
      }).catch(() => {
        navigator.clipboard.writeText(currentUrl);
        toast.success('Link copied to clipboard');
      });
    } else {
      navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page not found</h1>
          <p className="text-muted-foreground">Invalid or corrupted link</p>
        </div>
      </div>
    );
  }

  // Get font family class
  const fontClass = pageData.theme.fontFamily === 'serif' 
    ? 'font-serif' 
    : pageData.theme.fontFamily === 'mono' 
    ? 'font-mono' 
    : 'font-sans';

  // Get background style with smooth transitions
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: pageData.theme.backgroundColor,
    backgroundImage: pageData.theme.backgroundGradient || 'none',
    color: pageData.theme.textColor,
    transition: 'background-color 0.5s ease, color 0.5s ease, background-image 0.5s ease',
    // Set CSS variables for theme colors so all components can use them
    ['--theme-bg' as string]: pageData.theme.backgroundColor,
    ['--theme-text' as string]: pageData.theme.textColor,
    ['--theme-accent' as string]: pageData.theme.accentColor || pageData.theme.textColor,
  };

  return (
    <div className={`min-h-screen ${fontClass}`} style={backgroundStyle}>
      <style>{`
        /* Override component colors with theme colors */
        .text-foreground { color: var(--theme-text) !important; }
        .text-muted-foreground { color: var(--theme-text) !important; opacity: 0.7; }
        .text-primary { color: var(--theme-accent) !important; }
        .border-primary { border-color: var(--theme-accent) !important; }
        .bg-card { background-color: rgba(255, 255, 255, 0.1) !important; backdrop-filter: blur(10px); }
        .bg-background { background-color: transparent !important; }
        .border-border { border-color: var(--theme-text) !important; opacity: 0.2; }
      `}</style>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Content - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-4">
          {pageData.blocks.map(block => (
            <BlockRenderer key={block.id} block={block} theme={pageData.theme} isPreview={false} />
          ))}
        </div>

        {/* Share Section - Mobile Optimized with theme-aware styling */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            variant="outline" 
            onClick={handleShare} 
            className="w-full sm:w-auto border-current/20 hover:bg-current/10"
            style={{ color: pageData.theme.textColor }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowQR(true)} 
            className="w-full sm:w-auto border-current/20 hover:bg-current/10"
            style={{ color: pageData.theme.textColor }}
          >
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </Button>
        </div>

        {/* Branding */}
        <div className="mt-8 sm:mt-12 text-center pb-4">
          <a
            href="/"
            className="text-xs sm:text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: pageData.theme.textColor }}
          >
            Create your own LinkMAX
          </a>
        </div>
      </div>

      {/* QR Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scan this code to share your page
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-6">
            <QRCodeSVG value={currentUrl} size={256} level="H" />
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Chatbot Widget */}
      {slug && <ChatbotWidget pageSlug={slug} />}
    </div>
  );
}
