import { memo, useState } from 'react';
import { Pencil, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlockRenderer } from '@/components/BlockRenderer';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/page';

interface InlineEditableBlockProps {
  block: Block;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
  isFirst?: boolean;
  isLast?: boolean;
}

export const InlineEditableBlock = memo(function InlineEditableBlock({
  block,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isDragging,
  dragHandleProps,
  isFirst = false,
  isLast = false,
}: InlineEditableBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isProfileBlock = block.type === 'profile';

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "opacity-50 scale-95"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-onboarding={isProfileBlock ? 'profile-block' : 'block-edit'}
    >
      {/* Hover overlay with controls */}
      {isHovered && !isDragging && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-primary/30 rounded-2xl pointer-events-none z-10" />
      )}

      {/* Control buttons - Mobile Optimized with Arrow buttons */}
      {isHovered && !isDragging && (
        <div className="absolute -top-2 sm:-top-3 right-1 sm:right-2 flex gap-1 z-20">
          {/* Arrow controls for reordering - only for non-profile blocks */}
          {!isProfileBlock && onMoveUp && onMoveDown && (
            <div className="flex flex-col gap-0.5 bg-background rounded shadow-lg">
              <Button
                variant="secondary"
                size="sm"
                className="h-4 sm:h-5 w-6 sm:w-7 p-0 rounded-b-none"
                onClick={() => onMoveUp(block.id)}
                disabled={isFirst}
                title="Переместить вверх"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-4 sm:h-5 w-6 sm:w-7 p-0 rounded-t-none"
                onClick={() => onMoveDown(block.id)}
                disabled={isLast}
                title="Переместить вниз"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* Drag handle - only for non-profile blocks */}
          {!isProfileBlock && (
            <Button
              variant="secondary"
              size="sm"
              className="h-6 sm:h-7 shadow-lg hidden sm:inline-flex"
              {...dragHandleProps}
            >
              <GripVertical className="h-3 w-3" />
            </Button>
          )}
          
          {/* Edit button - for all blocks including profile */}
          <Button
            variant="secondary"
            size="sm"
            className="h-6 sm:h-7 w-6 sm:w-auto shadow-lg p-0 sm:px-3"
            onClick={() => onEdit(block)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          
          {/* Delete button - only for non-profile blocks */}
          {!isProfileBlock && (
            <Button
              variant="destructive"
              size="sm"
              className="h-6 sm:h-7 w-6 sm:w-auto shadow-lg p-0 sm:px-3"
              onClick={() => onDelete(block.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* The actual block */}
      <BlockRenderer block={block} isPreview={false} />
    </div>
  );
});
