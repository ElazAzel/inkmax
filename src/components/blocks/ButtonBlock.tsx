import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';
import { createBlockClickHandler, getHoverClass } from '@/lib/block-utils';
import type { ButtonBlock as ButtonBlockType } from '@/types/page';

interface ButtonBlockProps {
  block: ButtonBlockType;
}

export const ButtonBlock = memo(function ButtonBlockComponent({ block }: ButtonBlockProps) {
  const { i18n } = useTranslation();
  const handleClick = createBlockClickHandler(block.url);
  const title = getTranslatedString(block.title, i18n.language as SupportedLanguage);

  const alignmentClass = block.alignment === 'left' ? 'justify-start' 
    : block.alignment === 'right' ? 'justify-end' 
    : 'justify-center';

  // Get background styles
  const getButtonStyle = (): React.CSSProperties => {
    if (!block.background || !block.background.value) {
      return {};
    }
    
    switch (block.background.type) {
      case 'gradient':
        return {
          background: `linear-gradient(${block.background.gradientAngle || 135}deg, ${block.background.value})`,
        };
      case 'image':
        return {
          backgroundImage: `url(${block.background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'solid':
        return {
          backgroundColor: block.background.value,
        };
      default:
        return {};
    }
  };

  const hasCustomBackground = block.background && block.background.value;
  const buttonStyle = getButtonStyle();

  return (
    <div className={`flex ${alignmentClass}`}>
      <button
        onClick={handleClick}
        className={`max-w-full sm:max-w-md relative overflow-hidden rounded-2xl px-8 py-4 text-base font-semibold shadow-md ${getHoverClass(block.hoverEffect)} transition-all duration-200 hover:shadow-lg ${hasCustomBackground ? '' : 'bg-primary text-primary-foreground'}`}
        style={buttonStyle}
      >
        <span className="relative z-10">{title}</span>
      </button>
    </div>
  );
});
