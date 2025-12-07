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
  const [isTouched, setIsTouched] = useState(false);
  const isProfileBlock = block.type === 'profile';

  const handleTouchStart = () => {
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    // Keep visible for a moment after touch ends
    setTimeout(() => setIsTouched(false), 3000);
  };

  const showControls = isHovered || isTouched;

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "opacity-50 scale-95"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-onboarding={isProfileBlock ? 'profile-block' : 'block-edit'}
    >
      {/* Hover/Touch overlay with controls */}
      {showControls && !isDragging && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-primary/30 rounded-xl pointer-events-none z-10" />
      )}

      {/* Control buttons - Optimized for both mobile and desktop */}
      {showControls && !isDragging && (
        <div className="absolute -top-2 right-1 flex gap-1 z-20">
          {/* Arrow controls for reordering - only for non-profile blocks */}
          {!isProfileBlock && onMoveUp && onMoveDown && (
            <div className="flex gap-0.5 bg-background rounded-lg shadow-lg p-0.5">
              <Button
                variant="secondary"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onMoveUp(block.id)}
                disabled={isFirst}
                title="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onMoveDown(block.id)}
                disabled={isLast}
                title="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Drag handle - desktop only */}
          {!isProfileBlock && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 w-7 p-0 shadow-lg hidden md:inline-flex"
              {...dragHandleProps}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          )}
          
          {/* Edit button */}
          <Button
            variant="secondary"
            size="sm"
            className="h-7 w-7 p-0 shadow-lg"
            onClick={() => onEdit(block)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          
          {/* Delete button - only for non-profile blocks */}
          {!isProfileBlock && (
            <Button
              variant="destructive"
              size="sm"
              className="h-7 w-7 p-0 shadow-lg"
              onClick={() => onDelete(block.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* The actual block */}
      <BlockRenderer block={block} isPreview={false} />
    </div>
  );
});
