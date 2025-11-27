import type { ButtonBlock } from '@/types/page';

interface ButtonBlockProps {
  block: ButtonBlock;
}

export function ButtonBlock({ block }: ButtonBlockProps) {
  const handleClick = () => {
    if (block.url) {
      window.open(block.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getBackgroundStyle = () => {
    if (!block.background) return {};
    
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
      default:
        return {
          backgroundColor: block.background.value,
        };
    }
  };

  const getHoverClass = () => {
    switch (block.hoverEffect) {
      case 'glow':
        return 'hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] transition-shadow duration-300';
      case 'scale':
        return 'hover:scale-105 transition-transform duration-300';
      case 'shadow':
        return 'hover:shadow-2xl transition-shadow duration-300';
      default:
        return 'hover:opacity-90 transition-opacity duration-300';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full relative overflow-hidden rounded-2xl px-8 py-6 text-lg font-semibold text-white backdrop-blur-xl ${getHoverClass()}`}
      style={getBackgroundStyle()}
    >
      <span className="relative z-10">{block.title}</span>
    </button>
  );
}
