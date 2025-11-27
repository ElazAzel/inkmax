import type { TextBlock } from '@/types/page';

interface TextBlockProps {
  block: TextBlock;
}

export function TextBlock({ block }: TextBlockProps) {
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
}
