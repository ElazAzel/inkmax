import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PagePreviewProps {
  slug: string;
  title: string | null;
  avatarUrl: string | null;
  previewUrl?: string | null;
  className?: string;
}

export function PagePreview({ slug, title, avatarUrl, previewUrl, className = '' }: PagePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Priority: custom preview > mshots screenshot
  const pageUrl = `${window.location.origin}/${slug}`;
  const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(pageUrl)}?w=400&h=300`;
  const imageUrl = previewUrl || screenshotUrl;

  if (imageError && !previewUrl) {
    // Fallback to avatar with decorative preview
    return (
      <div className={`relative bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <Avatar className="h-16 w-16 ring-2 ring-border/50 mb-2">
            <AvatarImage src={avatarUrl || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {title?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground/80 text-center truncate max-w-full">
            {title || slug}
          </span>
        </div>
        {/* Decorative browser dots */}
        <div className="absolute top-2 left-2 right-2 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-destructive/40" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
          <div className="w-2 h-2 rounded-full bg-green-500/40" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-muted/30 rounded-lg overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={`Preview of ${title || slug}`}
        className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          // If custom preview fails, try screenshot
          if (previewUrl && imageUrl === previewUrl) {
            setImageLoading(true);
            setImageError(false);
            // Try to load screenshot instead
            const img = new Image();
            img.onload = () => setImageLoading(false);
            img.onerror = () => {
              setImageError(true);
              setImageLoading(false);
            };
            img.src = screenshotUrl;
          } else {
            setImageError(true);
            setImageLoading(false);
          }
        }}
      />
    </div>
  );
}
