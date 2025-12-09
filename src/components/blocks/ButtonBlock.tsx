import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import { createBlockClickHandler, getBackgroundStyle, getHoverClass } from '@/lib/block-utils';
import type { ButtonBlock as ButtonBlockType } from '@/types/page';

interface ButtonBlockProps {
  block: ButtonBlockType;
}

export const ButtonBlock = memo(function ButtonBlockComponent({ block }: ButtonBlockProps) {
  const { i18n } = useTranslation();
  const handleClick = createBlockClickHandler(block.url);
  const title = getTranslatedString(block.title, i18n.language as SupportedLanguage);

  const alignmentClass = block.alignment === 'left' ? 'mr-auto' 
    : block.alignment === 'right' ? 'ml-auto' 
    : 'mx-auto';

  // Default background if none specified
  const hasCustomBackground = block.background && block.background.value;
  const defaultStyle: React.CSSProperties = hasCustomBackground 
    ? getBackgroundStyle(block.background)
    : { backgroundColor: 'hsl(var(--primary))' };

  return (
    <div className={`flex ${block.alignment === 'left' ? 'justify-start' : block.alignment === 'right' ? 'justify-end' : 'justify-center'}`}>
      <button
        onClick={handleClick}
        className={`${alignmentClass} max-w-full sm:max-w-md relative overflow-hidden rounded-2xl px-8 py-4 text-base font-semibold text-primary-foreground shadow-md ${getHoverClass(block.hoverEffect)} transition-all duration-200 hover:shadow-lg`}
        style={defaultStyle}
      >
        <span className="relative z-10">{title}</span>
      </button>
    </div>
  );
});
