import { memo, useCallback, useState, useEffect } from 'react';
import { Plus, Move, Edit2, Trash2 } from 'lucide-react';
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
}

// Get aspect ratio from block size
function getBlockAspectRatio(blockSize?: BlockSizePreset): number {
  const size = blockSize || 'full-medium';
  const dims = BLOCK_SIZE_DIMENSIONS[size];
  return dims.height / dims.width;
}

// Check if block is full width
function isFullWidthBlock(blockSize?: BlockSizePreset): boolean {
  const size = blockSize || 'full-medium';
  const dims = BLOCK_SIZE_DIMENSIONS[size];
  return dims.gridCols === 1;
}

interface GridBlockItemProps {
  block: Block;
  isFullWidth: boolean;
  aspectRatio: number;
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
  isPremium?: boolean;
}

function GridBlockItem({
  block,
  isFullWidth,
  aspectRatio,
  onEdit,
  onDelete,
  isPremium,
}: GridBlockItemProps) {
  const sizeInfo = BLOCK_SIZE_DIMENSIONS[block.blockSize || 'full-medium'];
  
  return (
    <div
      className={cn(
        'relative group bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all hover:shadow-md',
        isFullWidth ? 'col-span-2' : 'col-span-1'
      )}
      style={{
        aspectRatio: `${sizeInfo.width} / ${sizeInfo.height}`,
      }}
    >
      {/* Block content */}
      <div 
        className="w-full h-full overflow-hidden p-3 cursor-pointer"
        onClick={() => onEdit(block)}
      >
        <BlockRenderer block={block} isPreview isOwnerPremium={isPremium} />
      </div>

      {/* Size indicator badge */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm border border-border text-[10px] text-muted-foreground">
          {sizeInfo.width}×{sizeInfo.height}
        </div>
      </div>

      {/* Edit/Delete actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
        <Button
          size="icon"
          variant="secondary"
          className="h-7 w-7"
          onClick={() => onEdit(block)}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// Component to show add button in empty half-slot
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
    <div className="col-span-1 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors min-h-[150px]">
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
          hasEmptySlot: currentRowCols === 1, // Has empty slot if only 1 col used
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
}: GridEditorProps) {
  const isMobile = useIsMobile();

  const profileBlock = blocks.find(b => b.type === 'profile') as ProfileBlock | undefined;
  const contentBlocks = blocks.filter(b => b.type !== 'profile');

  // Organize blocks into rows
  const rows = organizeBlocksIntoRows(contentBlocks);

  // Handle adding block
  const handleInsertBlock = useCallback((blockType: string, afterIndex?: number) => {
    const position = afterIndex !== undefined ? afterIndex + 1 : contentBlocks.length;
    onInsertBlock(blockType, position);
  }, [onInsertBlock, contentBlocks.length]);

  return (
    <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-32 md:pb-24">
      {/* Profile block (full width, not in grid) */}
      {profileBlock && (
        <div className="relative group" data-onboarding="profile-block">
          <InlineProfileEditor
            block={profileBlock}
            onUpdate={(updates) => onUpdateBlock(profileBlock.id, updates)}
          />
        </div>
      )}

      {/* Grid container - 2 columns */}
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-2 gap-3"
          >
            {row.blocks.map((block) => (
              <GridBlockItem
                key={block.id}
                block={block}
                isFullWidth={isFullWidthBlock(block.blockSize)}
                aspectRatio={getBlockAspectRatio(block.blockSize)}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors py-8">
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

      {/* Empty state */}
      {contentBlocks.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-2xl mx-2 bg-card/30 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-4 px-4">
            Нажмите + чтобы добавить первый блок
          </p>
          <BlockInsertButton
            onInsert={(type) => handleInsertBlock(type)}
            isPremium={isPremium}
            currentTier={currentTier}
            currentBlockCount={blocks.length}
          />
        </div>
      )}

      {/* Fixed FAB for adding blocks on mobile */}
      {isMobile && contentBlocks.length > 0 && (
        <div className="fixed bottom-20 right-4 z-40">
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
