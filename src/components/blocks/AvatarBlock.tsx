import { useTranslation } from 'react-i18next';
import type { AvatarBlock as AvatarBlockType } from '@/types/page';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAnimationClass, getAnimationStyle } from '@/lib/animation-utils';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';

interface AvatarBlockProps {
  block: AvatarBlockType;
}

export function AvatarBlock({ block }: AvatarBlockProps) {
  const { i18n } = useTranslation();
  const name = getTranslatedString(block.name, i18n.language as SupportedLanguage);
  const subtitle = getTranslatedString(block.subtitle, i18n.language as SupportedLanguage);
  
  const sizeClasses = {
    small: 'h-16 w-16',
    medium: 'h-24 w-24',
    large: 'h-32 w-32',
    xlarge: 'h-48 w-48',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none',
  };

  const getShadowStyle = () => {
    const shadowStyles: Record<string, React.CSSProperties> = {
      none: {},
      soft: { boxShadow: '0 4px 14px -3px hsl(var(--primary) / 0.25)' },
      medium: { boxShadow: '0 8px 24px -4px hsl(var(--primary) / 0.35)' },
      strong: { boxShadow: '0 12px 32px -4px hsl(var(--primary) / 0.45)' },
      glow: { boxShadow: '0 0 30px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--primary) / 0.3)' },
    };
    return shadowStyles[block.shadow || 'soft'];
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const paddingMap = { none: '', sm: 'p-2', md: 'p-4', lg: 'p-6', xl: 'p-8' };
  const marginMap = { none: '', sm: 'my-2', md: 'my-4', lg: 'my-6', xl: 'my-8' };

  const alignmentClass = block.alignment === 'left' ? 'items-start text-left' 
    : block.alignment === 'right' ? 'items-end text-right' 
    : 'items-center text-center';

  return (
    <div 
      className={cn(
        "flex flex-col gap-3",
        alignmentClass,
        block.blockStyle?.padding && paddingMap[block.blockStyle.padding],
        block.blockStyle?.margin && marginMap[block.blockStyle.margin],
      )}
    >
      {/* Frame wrapper - animation and shadow apply only here */}
      <div 
        className={cn(
          "relative",
          block.border && "p-1 bg-gradient-to-br from-primary to-primary/50",
          shapeClasses[block.shape || 'circle'],
          getAnimationClass(block.blockStyle)
        )}
        style={{
          ...getShadowStyle(),
          ...getAnimationStyle(block.blockStyle)
        }}
      >
        {/* Avatar - NO animation, NO shadow */}
        <Avatar 
          className={cn(
            sizeClasses[block.size || 'medium'],
            shapeClasses[block.shape || 'circle'],
          )}
        >
          <AvatarImage src={block.imageUrl} alt={name} className="object-cover" />
          <AvatarFallback className="text-lg font-semibold bg-primary/10">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
