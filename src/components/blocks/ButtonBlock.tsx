import { memo } from 'react';
import { createBlockClickHandler, getBackgroundStyle, getHoverClass, getButtonClass, getShadowClass } from '@/lib/block-utils';
import type { ButtonBlock as ButtonBlockType, PageTheme } from '@/types/page';

interface ButtonBlockProps {
  block: ButtonBlockType;
  buttonStyle?: 'default' | 'rounded' | 'pill' | 'gradient';
  theme?: PageTheme;
}

export const ButtonBlock = memo(function ButtonBlockComponent({ block, buttonStyle, theme }: ButtonBlockProps) {
  const handleClick = createBlockClickHandler(block.url);

  // Use theme buttonStyle if provided for border radius
  const radiusClass = buttonStyle ? getButtonClass(buttonStyle) : 'rounded-2xl';

  return (
    <button
      onClick={handleClick}
      className={`w-full relative overflow-hidden ${radiusClass} px-8 py-6 text-lg font-semibold text-white backdrop-blur-xl ${getHoverClass(block.hoverEffect)} ${getShadowClass(theme?.shadowIntensity)} transition-all duration-300`}
      style={getBackgroundStyle(block.background)}
    >
      <span className="relative z-10">{block.title}</span>
    </button>
  );
});
