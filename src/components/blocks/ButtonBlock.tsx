import { memo } from 'react';
import { createBlockClickHandler, getBackgroundStyle, getHoverClass, getButtonClass } from '@/lib/block-utils';
import type { ButtonBlock as ButtonBlockType } from '@/types/page';

interface ButtonBlockProps {
  block: ButtonBlockType;
  buttonStyle?: 'default' | 'rounded' | 'pill' | 'gradient';
}

export const ButtonBlock = memo(function ButtonBlockComponent({ block, buttonStyle }: ButtonBlockProps) {
  const handleClick = createBlockClickHandler(block.url);

  // Use theme buttonStyle if provided for border radius
  const radiusClass = buttonStyle ? getButtonClass(buttonStyle) : 'rounded-2xl';

  return (
    <button
      onClick={handleClick}
      className={`w-full relative overflow-hidden ${radiusClass} px-8 py-6 text-lg font-semibold text-white backdrop-blur-xl ${getHoverClass(block.hoverEffect)}`}
      style={getBackgroundStyle(block.background)}
    >
      <span className="relative z-10">{block.title}</span>
    </button>
  );
});
