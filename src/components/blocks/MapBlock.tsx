import type { MapBlock as MapBlockType } from '@/types/page';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface MapBlockProps {
  block: MapBlockType;
}

export function MapBlock({ block }: MapBlockProps) {
  const heightClasses = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-96',
  };

  const height = heightClasses[block.height || 'medium'];

  return (
    <div className={cn("w-full space-y-3", getBlockSpacing(block.blockStyle))}>
      {block.title && (
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{block.title}</h3>
        </div>
      )}
      
      {block.address && (
        <p className="text-sm text-muted-foreground">{block.address}</p>
      )}

      <div 
        className={cn(
          "w-full rounded-lg overflow-hidden border",
          height,
          getBlockStyles(block.blockStyle)
        )}
      >
        <iframe
          src={block.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={block.title || 'Map'}
        />
      </div>
    </div>
  );
}

// Helper functions for block styling
function getBlockSpacing(blockStyle?: MapBlockType['blockStyle']) {
  if (!blockStyle) return '';
  
  const classes = [];
  
  if (blockStyle.margin) {
    const marginMap = { none: '', sm: 'my-2', md: 'my-4', lg: 'my-6', xl: 'my-8' };
    classes.push(marginMap[blockStyle.margin]);
  }
  
  return classes.join(' ');
}

function getBlockStyles(blockStyle?: MapBlockType['blockStyle']) {
  if (!blockStyle) return '';
  
  const classes = [];
  
  if (blockStyle.borderRadius) {
    const radiusMap = { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' };
    classes.push(radiusMap[blockStyle.borderRadius]);
  }
  
  if (blockStyle.shadow) {
    const shadowMap = { 
      none: '', 
      sm: 'shadow-sm', 
      md: 'shadow-md', 
      lg: 'shadow-lg', 
      xl: 'shadow-xl',
      glow: 'shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]'
    };
    classes.push(shadowMap[blockStyle.shadow]);
  }
  
  if (blockStyle.animation) {
    const animationMap = { 
      none: '', 
      'fade-in': 'animate-fade-in', 
      'slide-up': 'animate-slide-up', 
      'scale-in': 'animate-scale-in' 
    };
    classes.push(animationMap[blockStyle.animation]);
  }
  
  return classes.join(' ');
}
