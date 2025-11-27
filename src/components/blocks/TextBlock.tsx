import { memo } from 'react';
import type { TextBlock as TextBlockType } from '@/types/page';

interface TextBlockProps {
  block: TextBlockType;
}

export const TextBlock = memo(function TextBlockComponent({ block }: TextBlockProps) {
  const alignmentClass = block.alignment === 'center' ? 'text-center' 
    : block.alignment === 'right' ? 'text-right' 
    : 'text-left';

  switch (block.style) {
    case 'heading':
      return <h2 className={`text-2xl font-bold ${alignmentClass}`}>{block.content}</h2>;
    case 'quote':
      return (
        <blockquote className={`border-l-4 border-primary pl-4 italic text-muted-foreground ${alignmentClass}`}>
          {block.content}
        </blockquote>
      );
    default:
      return <p className={`text-foreground ${alignmentClass}`}>{block.content}</p>;
  }
});
