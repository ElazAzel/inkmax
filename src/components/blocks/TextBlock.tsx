import { memo } from 'react';
import type { TextBlock as TextBlockType, PageTheme } from '@/types/page';

interface TextBlockProps {
  block: TextBlockType;
  theme?: PageTheme;
}

export const TextBlock = memo(function TextBlockComponent({ block, theme }: TextBlockProps) {
  switch (block.style) {
    case 'heading':
      return <h2 className="text-2xl font-bold">{block.content}</h2>;
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
          {block.content}
        </blockquote>
      );
    default:
      return <p className="text-foreground">{block.content}</p>;
  }
});
