import { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram, Twitter, Youtube, Facebook, Linkedin, Globe, Link2 } from 'lucide-react';
import { getButtonClass, createBlockClickHandler } from '@/lib/block-utils';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import { extractDomain, getGoogleFaviconUrl, getDirectFaviconUrl } from '@/lib/favicon-utils';
import type { LinkBlock as LinkBlockType } from '@/types/page';

interface LinkBlockProps {
  block: LinkBlockType;
  onClick?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  globe: Globe,
};

export const LinkBlock = memo(function LinkBlockComponent({ block, onClick }: LinkBlockProps) {
  const { i18n } = useTranslation();
  const [faviconError, setFaviconError] = useState(false);
  const [faviconLoaded, setFaviconLoaded] = useState(false);
  
  // Determine which icon to show
  const iconMode = block.iconMode || 'auto';
  const isManualMode = iconMode === 'manual';
  
  // For manual mode, use customIconUrl or fallback to lucide icon
  // For auto mode, try to load favicon
  const domain = extractDomain(block.url || '');
  
  // Get the favicon URL to use
  const getFaviconSrc = (): string | null => {
    if (isManualMode) {
      return block.customIconUrl || null;
    }
    
    // Auto mode: use cached faviconUrl or generate from domain
    if (block.faviconUrl) return block.faviconUrl;
    if (domain) return getGoogleFaviconUrl(domain);
    return null;
  };

  const faviconSrc = getFaviconSrc();
  
  // Reset error state when URL changes
  useEffect(() => {
    setFaviconError(false);
    setFaviconLoaded(false);
  }, [block.url, block.faviconUrl, block.customIconUrl]);
  
  // Fallback lucide icon
  const FallbackIcon = block.icon && iconMap[block.icon.toLowerCase()] 
    ? iconMap[block.icon.toLowerCase()] 
    : Link2;

  const handleClick = createBlockClickHandler(block.url, onClick);

  const title = getTranslatedString(block.title, i18n.language as SupportedLanguage);

  // Determine if we should show favicon image or lucide icon
  const shouldShowFavicon = faviconSrc && !faviconError;
  
  // Handle image load error - try direct favicon.ico as fallback
  const handleFaviconError = () => {
    if (!faviconError && domain && faviconSrc === getGoogleFaviconUrl(domain)) {
      // Try direct favicon.ico as fallback
      const directUrl = getDirectFaviconUrl(domain);
      const img = new Image();
      img.onload = () => {
        setFaviconLoaded(true);
      };
      img.onerror = () => {
        setFaviconError(true);
      };
      img.src = directUrl;
    } else {
      setFaviconError(true);
    }
  };

  return (
    <div className={`flex ${block.alignment === 'left' ? 'justify-start' : block.alignment === 'right' ? 'justify-end' : 'justify-center'}`}>
      <Button
        variant="outline"
        className={`max-w-full sm:max-w-md w-full justify-between h-auto py-4 px-6 hover:scale-[1.02] transition-all bg-card border-border shadow-sm hover:shadow-md hover:bg-accent ${getButtonClass(block.style)}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 min-w-0">
          {shouldShowFavicon ? (
            <img 
              src={faviconSrc}
              alt=""
              className="h-5 w-5 flex-shrink-0 rounded-sm object-contain"
              onError={handleFaviconError}
              onLoad={() => setFaviconLoaded(true)}
            />
          ) : (
            <FallbackIcon className="h-5 w-5 text-primary flex-shrink-0" />
          )}
          <span className="font-medium text-foreground truncate">{title}</span>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
      </Button>
    </div>
  );
});
