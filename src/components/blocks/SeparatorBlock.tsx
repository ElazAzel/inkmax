import type { SeparatorBlock as SeparatorBlockType } from '@/types/page';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface SeparatorBlockProps {
  block: SeparatorBlockType;
}

export function SeparatorBlock({ block }: SeparatorBlockProps) {
  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    gradient: 'border-none bg-gradient-to-r from-transparent via-primary to-transparent',
  };

  const thicknessClasses = {
    thin: 'h-px',
    medium: 'h-0.5',
    thick: 'h-1',
  };

  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    third: 'w-1/3',
  };

  const spacingClasses = {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
  };

  const variant = block.variant || 'solid';
  const isGradient = variant === 'gradient';

  if (isGradient) {
    return (
      <div 
        className={cn(
          "mx-auto",
          widthClasses[block.width || 'full'],
          spacingClasses[block.spacing || 'md'],
          getBlockSpacing(block.blockStyle)
        )}
      >
        <div 
          className={cn(
            thicknessClasses[block.thickness || 'thin'],
            'bg-gradient-to-r from-transparent via-primary to-transparent rounded-full',
            getBlockStyles(block.blockStyle)
          )}
        />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        spacingClasses[block.spacing || 'md'],
        getBlockSpacing(block.blockStyle)
      )}
    >
      <Separator 
        className={cn(
          variantClasses[variant],
          thicknessClasses[block.thickness || 'thin'],
          widthClasses[block.width || 'full'],
          block.color && `bg-[${block.color}]`,
          getBlockStyles(block.blockStyle)
        )}
      />
    </div>
  );
}

// Helper functions
function getBlockSpacing(blockStyle?: SeparatorBlockType['blockStyle']) {
  if (!blockStyle) return '';
  
  const classes = [];
  
  if (blockStyle.margin) {
    const marginMap = { none: '', sm: 'my-2', md: 'my-4', lg: 'my-6', xl: 'my-8' };
    classes.push(marginMap[blockStyle.margin]);
  }
  
  return classes.join(' ');
}

function getBlockStyles(blockStyle?: SeparatorBlockType['blockStyle']) {
  if (!blockStyle) return '';
  
  const classes = [];
  
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
