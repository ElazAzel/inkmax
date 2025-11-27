import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram, Twitter, Youtube, Facebook, Linkedin, Globe } from 'lucide-react';
import { getButtonClass, createBlockClickHandler, getShadowClass } from '@/lib/block-utils';
import type { LinkBlock as LinkBlockType, PageTheme } from '@/types/page';

interface LinkBlockProps {
  block: LinkBlockType;
  onClick?: () => void;
  buttonStyle?: 'default' | 'rounded' | 'pill' | 'gradient';
  theme?: PageTheme;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  globe: Globe,
};

export const LinkBlock = memo(function LinkBlockComponent({ block, onClick, buttonStyle, theme }: LinkBlockProps) {
  const Icon = block.icon && iconMap[block.icon.toLowerCase()] 
    ? iconMap[block.icon.toLowerCase()] 
    : ExternalLink;

  const handleClick = createBlockClickHandler(block.url, onClick);

  // Use theme buttonStyle if provided, otherwise fallback to block.style
  const effectiveStyle = buttonStyle || block.style;

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={`w-full justify-start gap-3 px-4 h-auto py-3 ${getButtonClass(effectiveStyle)} ${getShadowClass(theme?.shadowIntensity)} transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <span className="font-medium">{block.title}</span>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
});
