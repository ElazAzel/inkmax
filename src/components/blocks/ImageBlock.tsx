import { memo } from 'react';
import type { ImageBlock as ImageBlockType, PageTheme } from '@/types/page';
import { getShadowClass } from '@/lib/block-utils';

interface ImageBlockProps {
  block: ImageBlockType;
  theme?: PageTheme;
}

export const ImageBlock = memo(function ImageBlockComponent({ block, theme }: ImageBlockProps) {
  const getImageClass = () => {
    switch (block.style) {
      case 'polaroid':
        return 'p-4 bg-white shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300';
      case 'vignette':
        return 'relative after:absolute after:inset-0 after:shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] after:pointer-events-none';
      case 'circle':
        return 'rounded-full aspect-square object-cover';
      default:
        return 'rounded-2xl';
    }
  };

  return (
    <div className="w-full">
      <div className={`overflow-hidden ${getImageClass()}`}>
        <img
          src={block.url}
          alt={block.alt}
          className="w-full h-auto object-cover"
        />
      </div>
      {block.caption && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          {block.caption}
        </p>
      )}
    </div>
  );
});
