import type { AvatarBlock as AvatarBlockType } from '@/types/page';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAnimationClass, getAnimationStyle } from '@/lib/animation-utils';

interface AvatarBlockProps {
  block: AvatarBlockType;
}

export function AvatarBlock({ block }: AvatarBlockProps) {
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

  const shadowClasses = {
    none: '',
    soft: 'shadow-sm',
    medium: 'shadow-md',
    strong: 'shadow-lg',
    glow: 'shadow-lg shadow-primary/50',
  };

  const initials = block.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const paddingMap = { none: '', sm: 'p-2', md: 'p-4', lg: 'p-6', xl: 'p-8' };
  const marginMap = { none: '', sm: 'my-2', md: 'my-4', lg: 'my-6', xl: 'my-8' };

  return (
    <div 
      className={cn(
        "flex flex-col items-center gap-3 text-center",
        block.blockStyle?.padding && paddingMap[block.blockStyle.padding],
        block.blockStyle?.margin && marginMap[block.blockStyle.margin],
        getAnimationClass(block.blockStyle)
      )}
      style={getAnimationStyle(block.blockStyle)}
    >
      <div className={cn(
        "relative",
        block.border && "p-1 bg-gradient-to-br from-primary to-primary/50",
        shapeClasses[block.shape || 'circle']
      )}>
        <Avatar 
          className={cn(
            sizeClasses[block.size || 'medium'],
            shapeClasses[block.shape || 'circle'],
            shadowClasses[block.shadow || 'soft']
          )}
        >
          <AvatarImage src={block.imageUrl} alt={block.name} />
          <AvatarFallback className="text-lg font-semibold bg-primary/10">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{block.name}</h3>
        {block.subtitle && (
          <p className="text-sm text-muted-foreground">{block.subtitle}</p>
        )}
      </div>
    </div>
  );
}
