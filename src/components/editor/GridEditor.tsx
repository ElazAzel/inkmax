import { memo, useCallback, useState, useMemo } from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { BlockRenderer } from '@/components/BlockRenderer';
import { BlockInsertButton } from './BlockInsertButton';
import { InlineProfileEditor } from '../blocks/InlineProfileEditor';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Block, ProfileBlock, GridConfig, BlockSizePreset } from '@/types/page';
import { BLOCK_SIZE_DIMENSIONS } from '@/types/page';
import type { FreeTier } from '@/hooks/useFreemiumLimits';

interface GridEditorProps {
  blocks: Block[];
  isPremium: boolean;
  currentTier?: FreeTier;
  gridConfig?: GridConfig;
  onInsertBlock: (blockType: string, position: number) => void;
  onEditBlock: (block: Block) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onReorderBlocks?: (blocks: Block[]) => void;
}

// Check if block is full width (with fallback for legacy sizes)
function isFullWidthBlock(blockSize?: BlockSizePreset): boolean {
  if (!blockSize) return true; // Default to full width
  
  // Handle legacy sizes - convert to new format
  if (blockSize.startsWith('full')) return true;
  if (blockSize.startsWith('half')) return false;
  
  const dims = BLOCK_SIZE_DIMENSIONS[blockSize];
  return dims?.gridCols === 1;
}

interface SortableGridBlockItemProps {
  block: Block;
  isFullWidth: boolean;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
  isPremium?: boolean;
  isDragging?: boolean;
}

function SortableGridBlockItem({
  block,
  isFullWidth,
  onEdit,
  onDelete,
  isPremium,
}: SortableGridBlockItemProps) {
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
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group bg-card/70 backdrop-blur-xl rounded-3xl border border-border/30 shadow-glass overflow-hidden transition-all hover:shadow-glass-lg',
        isFullWidth ? 'col-span-2' : 'col-span-1',
        isDragging && 'opacity-50 ring-2 ring-primary z-50'
      )}
    >
      {/* Drag handle - BOLD */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-grab active:cursor-grabbing"
      >
        <div className="bg-background/90 backdrop-blur-xl rounded-2xl p-2 shadow-glass border border-border/30">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Block content - fills entire space */}
      <div 
        className="w-full h-full overflow-hidden cursor-pointer flex"
        onClick={() => onEdit(block)}
      >
        <div className="w-full h-full flex-1">
          <BlockRenderer block={block} isPreview isOwnerPremium={isPremium} />
        </div>
      </div>

      {/* Edit/Delete actions - BOLD */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
        <Button
          size="lg"
          variant="secondary"
          className="h-10 w-10 rounded-2xl shadow-glass"
          onClick={() => onEdit(block)}
        >
          <Edit2 className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          variant="destructive"
          className="h-10 w-10 rounded-2xl shadow-glass"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// Drag overlay component (ghost element while dragging) - BOLD
function DragOverlayBlockItem({ block, isPremium }: { block: Block; isPremium?: boolean }) {
  const isFullWidth = isFullWidthBlock(block.blockSize);
  
  return (
    <div
      className={cn(
        'relative bg-card/90 backdrop-blur-xl rounded-3xl border-2 border-primary shadow-glass-xl overflow-hidden',
        isFullWidth ? 'w-full' : 'w-1/2'
      )}
      style={{
        maxWidth: isFullWidth ? '640px' : '320px',
      }}
    >
      <div className="w-full h-full overflow-hidden opacity-80">
        <BlockRenderer block={block} isPreview isOwnerPremium={isPremium} />
      </div>
    </div>
  );
}

// Component to show add button in empty half-slot - BOLD
function AddBlockSlot({
  onInsert,
  isPremium,
  currentTier,
  blockCount,
}: {
  onInsert: (blockType: string) => void;
  isPremium: boolean;
  currentTier?: FreeTier;
  blockCount: number;
}) {
  return (
    <div className="col-span-1 border-2 border-dashed border-border/40 rounded-3xl flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors min-h-[180px] backdrop-blur-sm">
      <BlockInsertButton
        onInsert={onInsert}
        isPremium={isPremium}
        currentTier={currentTier}
        currentBlockCount={blockCount}
      />
    </div>
  );
}

// Organize blocks into rows based on their size
interface BlockRow {
  blocks: Block[];
  hasEmptySlot: boolean;
}

function organizeBlocksIntoRows(blocks: Block[]): BlockRow[] {
  const rows: BlockRow[] = [];
  let currentRow: Block[] = [];
  let currentRowCols = 0;

  for (const block of blocks) {
    const isFullWidth = isFullWidthBlock(block.blockSize);
    const blockCols = isFullWidth ? 2 : 1;

    // If this block would overflow, start a new row
    if (currentRowCols + blockCols > 2) {
      if (currentRow.length > 0) {
        rows.push({
          blocks: currentRow,
          hasEmptySlot: currentRowCols === 1,
        });
      }
      currentRow = [block];
      currentRowCols = blockCols;
    } else {
      currentRow.push(block);
      currentRowCols += blockCols;
    }

    // If row is full, push it
    if (currentRowCols === 2) {
      rows.push({
        blocks: currentRow,
        hasEmptySlot: false,
      });
      currentRow = [];
      currentRowCols = 0;
    }
  }

  // Push remaining blocks
  if (currentRow.length > 0) {
    rows.push({
      blocks: currentRow,
      hasEmptySlot: currentRowCols === 1,
    });
  }

  return rows;
}

export const GridEditor = memo(function GridEditor({
  blocks,
  isPremium,
  currentTier = 'free',
  gridConfig,
  onInsertBlock,
  onEditBlock,
  onDeleteBlock,
  onUpdateBlock,
  onReorderBlocks,
}: GridEditorProps) {
  const isMobile = useIsMobile();
  const [activeId, setActiveId] = useState<string | null>(null);

  const profileBlock = blocks.find(b => b.type === 'profile') as ProfileBlock | undefined;
  const contentBlocks = blocks.filter(b => b.type !== 'profile');

  // DnD sensors - optimized for both desktop and mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Memoize organized rows for better performance
  const rows = useMemo(() => organizeBlocksIntoRows(contentBlocks), [contentBlocks]);

  // Find active block for overlay
  const activeBlock = activeId ? contentBlocks.find(b => b.id === activeId) : null;

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = contentBlocks.findIndex(b => b.id === active.id);
      const newIndex = contentBlocks.findIndex(b => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedContent = arrayMove(contentBlocks, oldIndex, newIndex);
        
        // Reconstruct full blocks array with profile first
        const newBlocks = profileBlock 
          ? [profileBlock, ...reorderedContent]
          : reorderedContent;
        
        onReorderBlocks?.(newBlocks);
      }
    }
  }, [contentBlocks, profileBlock, onReorderBlocks]);

  // Handle adding block
  const handleInsertBlock = useCallback((blockType: string, afterIndex?: number) => {
    const position = afterIndex !== undefined ? afterIndex + 1 : contentBlocks.length;
    onInsertBlock(blockType, position);
  }, [onInsertBlock, contentBlocks.length]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5 pb-36 md:pb-28">
      {/* Profile block (full width, not in grid) */}
      {profileBlock && (
        <div className="relative group" data-onboarding="profile-block">
          <InlineProfileEditor
            block={profileBlock}
            onUpdate={(updates) => onUpdateBlock(profileBlock.id, updates)}
          />
        </div>
      )}

      {/* Grid container with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={contentBlocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-2 gap-4"
              >
                {row.blocks.map((block) => (
                  <SortableGridBlockItem
                    key={block.id}
                    block={block}
                    isFullWidth={isFullWidthBlock(block.blockSize)}
                    onEdit={onEditBlock}
                    onDelete={onDeleteBlock}
                    isPremium={isPremium}
                  />
                ))}
                
                {/* Show add button in empty slot */}
                {row.hasEmptySlot && (
                  <AddBlockSlot
                    onInsert={(type) => handleInsertBlock(type, rowIndex)}
                    isPremium={isPremium}
                    currentTier={currentTier}
                    blockCount={blocks.length}
                  />
                )}
              </div>
            ))}

            {/* Add row for new blocks */}
            {rows.length === 0 || !rows[rows.length - 1]?.hasEmptySlot ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 border-2 border-dashed border-border/40 rounded-3xl flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors py-10 backdrop-blur-sm">
                  <BlockInsertButton
                    onInsert={(type) => handleInsertBlock(type)}
                    isPremium={isPremium}
                    currentTier={currentTier}
                    currentBlockCount={blocks.length}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </SortableContext>

        {/* Drag overlay */}
        <DragOverlay>
          {activeBlock && (
            <DragOverlayBlockItem block={activeBlock} isPremium={isPremium} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Empty state - BOLD */}
      {contentBlocks.length === 0 && (
        <div className="text-center py-14 border-2 border-dashed border-border/40 rounded-3xl mx-2 bg-card/40 backdrop-blur-xl">
          <p className="text-base text-muted-foreground mb-5 px-6 font-medium">
            Tap + to add your first block
          </p>
          <BlockInsertButton
            onInsert={(type) => handleInsertBlock(type)}
            isPremium={isPremium}
            currentTier={currentTier}
            currentBlockCount={blocks.length}
          />
        </div>
      )}

      {/* Fixed FAB for adding blocks on mobile - BOLD */}
      {isMobile && contentBlocks.length > 0 && (
        <div className="fixed bottom-24 right-5 z-40">
          <BlockInsertButton
            onInsert={(type) => handleInsertBlock(type)}
            isPremium={isPremium}
            currentTier={currentTier}
            currentBlockCount={blocks.length}
          />
        </div>
      )}
    </div>
  );
});
