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
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlockInsertButton } from './BlockInsertButton';
import { InlineEditableBlock } from './InlineEditableBlock';
import { BlockHint } from '../onboarding/BlockHint';
import { useIsMobile } from '@/hooks/use-mobile';
import { BlockRenderer } from '@/components/BlockRenderer';
import type { Block, PageTheme } from '@/types/page';

interface PreviewEditorProps {
  blocks: Block[];
  theme: PageTheme;
  isPremium: boolean;
  onInsertBlock: (blockType: string, position: number) => void;
  onEditBlock: (block: Block) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks: (blocks: Block[]) => void;
  activeBlockHint?: { blockType: string; blockId: string } | null;
  onDismissHint?: () => void;
}

interface SortableBlockWrapperProps {
  block: Block;
  index: number;
  totalCount: number;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onInsertAfter: (blockType: string) => void;
  isPremium: boolean;
  theme: PageTheme;
}

interface PreviewEditorContext {
  activeBlockHint?: { blockType: string; blockId: string } | null;
  onDismissHint?: () => void;
}

interface ExtendedSortableBlockWrapperProps extends SortableBlockWrapperProps {
  context?: PreviewEditorContext;
}

function SortableBlockWrapper({
  block,
  index,
  totalCount,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertAfter,
  isPremium,
  theme,
  context,
}: ExtendedSortableBlockWrapperProps) {
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

  const showHint = context?.activeBlockHint?.blockId === block.id;
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {/* Preview wrapper with edit controls overlay */}
      <div className="relative">
        <div className="opacity-80">
          <BlockRenderer block={block} isPreview={true} theme={theme} />
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          <InlineEditableBlock
            block={block}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            isFirst={isFirst}
            isLast={isLast}
            isDragging={isDragging}
            dragHandleProps={{ ...attributes, ...listeners }}
          />
        </div>
      </div>
      
      {/* Block hint */}
      {showHint && context?.onDismissHint && (
        <BlockHint
          blockType={context.activeBlockHint!.blockType}
          blockId={block.id}
          onDismiss={context.onDismissHint}
        />
      )}
      
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
  theme,
  isPremium,
  onInsertBlock,
  onEditBlock,
  onDeleteBlock,
  onReorderBlocks,
  activeBlockHint,
  onDismissHint,
}: PreviewEditorProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const isMobile = useIsMobile();

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

  const handleMoveUp = (id: string) => {
    const allBlocks = [...blocks];
    const index = allBlocks.findIndex((block) => block.id === id);
    if (index > 0 && allBlocks[index - 1].type !== 'profile') {
      const reorderedBlocks = arrayMove(allBlocks, index, index - 1);
      onReorderBlocks(reorderedBlocks);
    }
  };

  const handleMoveDown = (id: string) => {
    const allBlocks = [...blocks];
    const index = allBlocks.findIndex((block) => block.id === id);
    if (index < allBlocks.length - 1) {
      const reorderedBlocks = arrayMove(allBlocks, index, index + 1);
      onReorderBlocks(reorderedBlocks);
    }
  };

  const profileBlock = blocks.find(b => b.type === 'profile');
  const contentBlocks = blocks.filter(b => b.type !== 'profile');

  // Get font family class
  const fontClass = theme.fontFamily === 'serif' 
    ? 'font-serif' 
    : theme.fontFamily === 'mono' 
    ? 'font-mono' 
    : 'font-sans';

  // Get background style with smooth transitions
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    backgroundImage: theme.backgroundGradient || 'none',
    color: theme.textColor,
    transition: 'background-color 0.5s ease, color 0.5s ease, background-image 0.5s ease',
    // Set CSS variables for theme colors
    ['--theme-bg' as string]: theme.backgroundColor,
    ['--theme-text' as string]: theme.textColor,
    ['--theme-accent' as string]: theme.accentColor || theme.textColor,
  };

  return (
    <>
      <style>{`
        /* Override component colors with theme colors in preview */
        .text-foreground { color: var(--theme-text) !important; }
        .text-muted-foreground { color: var(--theme-text) !important; opacity: 0.7; }
        .text-primary { color: var(--theme-accent) !important; }
        .border-primary { border-color: var(--theme-accent) !important; }
        .bg-card { background-color: rgba(255, 255, 255, 0.1) !important; backdrop-filter: blur(10px); }
        .bg-background { background-color: transparent !important; }
        .border-border { border-color: var(--theme-text) !important; opacity: 0.2; }
      `}</style>
      <div 
        className={`max-w-lg mx-auto px-3 sm:px-4 py-2 space-y-3 sm:space-y-4 pb-24 min-h-screen ${fontClass}`}
        style={backgroundStyle}
      >
        {/* Profile block (not draggable) */}
        {profileBlock && (
          <>
            <div className="opacity-80">
              <BlockRenderer block={profileBlock} isPreview={true} theme={theme} />
            </div>
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
                  totalCount={contentBlocks.length}
                  onEdit={onEditBlock}
                  onDelete={onDeleteBlock}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onInsertAfter={(type) => onInsertBlock(type, index + 1)}
                  isPremium={isPremium}
                  theme={theme}
                  context={{ activeBlockHint, onDismissHint }}
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

      {/* Mobile FAB for quick block insertion */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40">
          <BlockInsertButton
            onInsert={(type) => onInsertBlock(type, contentBlocks.length)}
            isPremium={isPremium}
          />
        </div>
      )}
    </>
  );
});
