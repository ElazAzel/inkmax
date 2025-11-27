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

      {/* Control buttons - Touch-friendly sizes */}
      {isHovered && !isDragging && block.type !== 'profile' && (
        <div className="absolute -top-3 right-2 flex gap-1.5 z-20">
          {/* Arrow controls for reordering */}
          {onMoveUp && onMoveDown && (
            <div className="flex flex-col gap-0.5 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-8 p-0 rounded-b-none hover:bg-primary/10"
                onClick={() => onMoveUp(block.id)}
                disabled={isFirst}
                title="Переместить вверх"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-8 p-0 rounded-t-none hover:bg-primary/10"
                onClick={() => onMoveDown(block.id)}
                disabled={isLast}
                title="Переместить вниз"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-card/95 backdrop-blur-sm shadow-lg border border-border hover:bg-primary/10 hidden sm:inline-flex"
            {...dragHandleProps}
            title="Перетащить"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-card/95 backdrop-blur-sm shadow-lg border border-border hover:bg-primary/10"
            onClick={() => onEdit(block)}
            title="Редактировать"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-card/95 backdrop-blur-sm shadow-lg border border-border hover:bg-destructive/10 text-destructive"
            onClick={() => onDelete(block.id)}
            title="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* The actual block */}
      <BlockRenderer block={block} isPreview={false} />
    </div>
  );
});
