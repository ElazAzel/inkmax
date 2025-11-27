import { memo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockInsertButton } from './BlockInsertButton';
import { InlineEditableBlock } from './InlineEditableBlock';
import type { Block } from '@/types/page';

interface PreviewEditorProps {
  blocks: Block[];
  isPremium: boolean;
  onInsertBlock: (blockType: string, position: number) => void;
  onEditBlock: (block: Block) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks: (blocks: Block[]) => void;
}

interface SortableBlockWrapperProps {
  block: Block;
  index: number;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
  onInsertAfter: (blockType: string) => void;
  isPremium: boolean;
}

function SortableBlockWrapper({
  block,
  index,
  onEdit,
  onDelete,
  onInsertAfter,
  isPremium,
}: SortableBlockWrapperProps) {
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
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <InlineEditableBlock
        block={block}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
      
      {/* Insert button after each block */}
      <BlockInsertButton
        onInsert={onInsertAfter}
        isPremium={isPremium}
        className="my-4"
      />
    </div>
  );
}

export const PreviewEditor = memo(function PreviewEditor({
  blocks,
  isPremium,
  onInsertBlock,
  onEditBlock,
  onDeleteBlock,
  onReorderBlocks,
}: PreviewEditorProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const reorderedBlocks = [...blocks];
      const [removed] = reorderedBlocks.splice(oldIndex, 1);
      reorderedBlocks.splice(newIndex, 0, removed);
      
      onReorderBlocks(reorderedBlocks);
    }
  };

  const profileBlock = blocks.find(b => b.type === 'profile');
  const contentBlocks = blocks.filter(b => b.type !== 'profile');

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-4 py-2 space-y-3 sm:space-y-4">
      {/* Profile block (not draggable) */}
      {profileBlock && (
        <>
          <InlineEditableBlock
            block={profileBlock}
            onEdit={onEditBlock}
            onDelete={onDeleteBlock}
          />
          <BlockInsertButton
            onInsert={(type) => onInsertBlock(type, 0)}
            isPremium={isPremium}
            className="my-4"
          />
        </>
      )}

      {/* Draggable content blocks */}
      {contentBlocks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={contentBlocks.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {contentBlocks.map((block, index) => (
              <SortableBlockWrapper
                key={block.id}
                block={block}
                index={index}
                onEdit={onEditBlock}
                onDelete={onDeleteBlock}
                onInsertAfter={(type) => onInsertBlock(type, index + 1)}
                isPremium={isPremium}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 sm:py-12 border-2 border-dashed border-border rounded-xl sm:rounded-2xl mx-2">
          <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
            Click the + button above to add your first block
          </p>
        </div>
      )}
    </div>
  );
});
