import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Crown } from 'lucide-react';
import type { Block } from '@/types/page';

interface DraggableBlockListProps {
  blocks: Block[];
  onReorder: (blocks: Block[]) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

interface SortableBlockItemProps {
  block: Block;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

function SortableBlockItem({ block, onDelete, onEdit }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getBlockTitle = (block: Block): string => {
    switch (block.type) {
      case 'profile':
        return `Profile: ${block.name}`;
      case 'link':
        return `Link: ${block.title}`;
      case 'product':
        return `Product: ${block.name}`;
      case 'text':
        return `Text: ${block.content.slice(0, 30)}...`;
      case 'video':
        return `Video: ${block.title || 'Untitled'}`;
      case 'carousel':
        return `Carousel: ${block.title || `${block.images?.length || 0} images`}`;
      case 'custom_code':
        return `Custom Code: ${block.title || 'Untitled'}`;
      default:
        return 'Unknown block';
    }
  };

  const isPremiumBlock = block.type === 'video' || block.type === 'carousel' || block.type === 'custom_code';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium capitalize text-sm truncate">
              {getBlockTitle(block)}
            </span>
            {isPremiumBlock && (
              <Crown className="h-3 w-3 text-primary flex-shrink-0" />
            )}
          </div>
          <span className="text-xs text-muted-foreground capitalize">
            {block.type.replace('_', ' ')}
          </span>
        </div>

        <div className="flex gap-1">
          {onEdit && block.type !== 'profile' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(block.id)}
            >
              Edit
            </Button>
          )}
          {block.type !== 'profile' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(block.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function DraggableBlockList({
  blocks,
  onReorder,
  onDelete,
  onEdit,
}: DraggableBlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
      onReorder(reorderedBlocks);
    }
  };

  const sortableBlocks = blocks.filter(b => b.type !== 'profile');

  if (sortableBlocks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No blocks yet. Add some to get started!</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortableBlocks.map(b => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sortableBlocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
