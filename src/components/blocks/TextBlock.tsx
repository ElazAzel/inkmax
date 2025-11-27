import { memo } from 'react';
import type { TextBlock as TextBlockType, PageTheme } from '@/types/page';

interface TextBlockProps {
  block: TextBlockType;
  theme?: PageTheme;
}

export const TextBlock = memo(function TextBlockComponent({ block, theme }: TextBlockProps) {
  const textColor = theme?.textColor || 'inherit';
  const accentColor = theme?.accentColor || theme?.textColor || 'inherit';
  
  switch (block.style) {
    case 'heading':
      return <h2 className="text-2xl font-bold" style={{ color: textColor }}>{block.content}</h2>;
    case 'quote':
      return (
        <blockquote 
          className="border-l-4 pl-4 italic opacity-80"
          style={{ 
            borderColor: accentColor,
            color: textColor
          }}
        >
          {block.content}
        </blockquote>
      );
    default:
      return <p style={{ color: textColor }}>{block.content}</p>;
  }
});
