import { memo, useState } from 'react';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlockRenderer } from '@/components/BlockRenderer';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/page';

interface InlineEditableBlockProps {
  block: Block;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const InlineEditableBlock = memo(function InlineEditableBlock({
  block,
  onEdit,
  onDelete,
  isDragging,
  dragHandleProps,
}: InlineEditableBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "opacity-50 scale-95"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover overlay with controls */}
      {isHovered && !isDragging && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-primary/30 rounded-2xl pointer-events-none z-10" />
      )}

      {/* Control buttons - Mobile Optimized */}
      {isHovered && !isDragging && block.type !== 'profile' && (
        <div className="absolute -top-2 sm:-top-3 right-1 sm:right-2 flex gap-1 z-20">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 sm:h-7 shadow-lg hidden sm:inline-flex"
            {...dragHandleProps}
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-6 sm:h-7 w-6 sm:w-auto shadow-lg p-0 sm:px-3"
            onClick={() => onEdit(block)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-6 sm:h-7 w-6 sm:w-auto shadow-lg p-0 sm:px-3"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* The actual block */}
      <BlockRenderer block={block} isPreview={false} />
    </div>
  );
});
