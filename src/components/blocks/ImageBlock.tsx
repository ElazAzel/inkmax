import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import type { ImageBlock as ImageBlockType } from '@/types/page';

interface ImageBlockProps {
  block: ImageBlockType;
}

export const ImageBlock = memo(function ImageBlockComponent({ block }: ImageBlockProps) {
  const { i18n } = useTranslation();
  const alt = getTranslatedString(block.alt, i18n.language as SupportedLanguage);
  const caption = getTranslatedString(block.caption, i18n.language as SupportedLanguage);

  const getImageClass = () => {
    switch (block.style) {
      case 'polaroid':
        return 'p-4 bg-card border border-border shadow-md rotate-[-2deg] hover:rotate-0 transition-transform duration-300';
      case 'vignette':
        return 'relative rounded-2xl shadow-sm after:absolute after:inset-0 after:shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] after:pointer-events-none after:rounded-2xl';
      case 'circle':
        return 'rounded-full aspect-square object-cover shadow-sm';
      default:
        return 'rounded-2xl shadow-sm';
    }
  };

  const alignmentClass = block.alignment === 'left' ? 'items-start' 
    : block.alignment === 'right' ? 'items-end' 
    : 'items-center';

  return (
    <div className={`w-full flex flex-col ${alignmentClass}`}>
      <div className={`overflow-hidden max-w-md ${getImageClass()}`}>
        <img
          src={block.url}
          alt={alt}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <p className={`text-sm text-muted-foreground mt-4 ${block.alignment === 'center' ? 'text-center' : block.alignment === 'right' ? 'text-right' : 'text-left'}`}>
          {caption}
        </p>
      )}
    </div>
  );
});
