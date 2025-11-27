import { createBlockClickHandler, getBackgroundStyle, getHoverClass } from '@/lib/block-utils';
import type { ButtonBlock } from '@/types/page';

interface ButtonBlockProps {
  block: ButtonBlock;
}

export function ButtonBlock({ block }: ButtonBlockProps) {
  const handleClick = createBlockClickHandler(block.url);

  return (
    <button
      onClick={handleClick}
      className={`w-full relative overflow-hidden rounded-2xl px-8 py-6 text-lg font-semibold text-white backdrop-blur-xl ${getHoverClass(block.hoverEffect)}`}
      style={getBackgroundStyle(block.background)}
    >
      <span className="relative z-10">{block.title}</span>
    </button>
  );
}
