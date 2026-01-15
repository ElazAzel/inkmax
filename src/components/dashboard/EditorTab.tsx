/**
 * EditorTab - Main editor view with block canvas
 * Features: undo/redo, structure view, reorder mode, floating toolbar
 */
import { memo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Undo2,
  Redo2,
  Plus,
  Layers,
  ArrowUpDown,
  Eye,
  Upload,
  Wand2,
  Save,
  LayoutTemplate,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PreviewEditor } from '@/components/editor/PreviewEditor';
import { StructureView } from '@/components/editor/StructureView';
import { ReorderMode } from '@/components/editor/ReorderMode';
import { BlockInsertButton } from '@/components/editor/BlockInsertButton';
import { AutoSaveIndicator, type SaveStatus } from '@/components/editor/AutoSaveIndicator';
import { cn } from '@/lib/utils';
import type { Block, GridConfig } from '@/types/page';
import type { FreeTier } from '@/hooks/useFreemiumLimits';
import type { PremiumTier } from '@/hooks/usePremiumStatus';

// Editor history type
interface EditorHistoryType {
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentIndex: number;
  undo: () => void;
  redo: () => void;
  pushAction: (action: any) => void;
}
import type { EditorHistory } from '@/hooks/useEditorHistory';

interface EditorTabProps {
  blocks: Block[];
  isPremium: boolean;
  currentTier?: FreeTier;
  premiumTier?: PremiumTier;
  gridConfig?: GridConfig;
  saving: boolean;
  saveStatus: SaveStatus;
  editorHistory: EditorHistoryType;
  onInsertBlock: (blockType: string, position: number) => void;
  onEditBlock: (block: Block) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks: (blocks: Block[]) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onSave: () => void;
  onPreview: () => void;
  onShare: () => void;
  onOpenAI: () => void;
  onOpenTemplates: () => void;
}

export const EditorTab = memo(function EditorTab({
  blocks,
  isPremium,
  currentTier = 'free',
  premiumTier,
  gridConfig,
  saving,
  saveStatus,
  editorHistory,
  onInsertBlock,
  onEditBlock,
  onDeleteBlock,
  onReorderBlocks,
  onUpdateBlock,
  onSave,
  onPreview,
  onShare,
  onOpenAI,
  onOpenTemplates,
}: EditorTabProps) {
  const { t } = useTranslation();
  
  // UI State
  const [showStructure, setShowStructure] = useState(false);
  const [showReorder, setShowReorder] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);

  // Handle undo with toast
  const handleUndo = useCallback(() => {
    if (editorHistory.canUndo) {
      editorHistory.undo();
      toast.success(t('editor.undone', 'Отменено'), {
        action: {
          label: t('editor.redo', 'Повторить'),
          onClick: () => editorHistory.redo(),
        },
      });
    }
  }, [editorHistory, t]);

  // Handle redo with toast
  const handleRedo = useCallback(() => {
    if (editorHistory.canRedo) {
      editorHistory.redo();
      toast.success(t('editor.redone', 'Повторено'), {
        action: {
          label: t('editor.undo', 'Отменить'),
          onClick: () => editorHistory.undo(),
        },
      });
    }
  }, [editorHistory, t]);

  // Handle insert block
  const handleInsertBlock = useCallback((blockType: string) => {
    onInsertBlock(blockType, blocks.length);
    editorHistory.pushAction({
      type: 'add',
      blockId: `${blockType}-${Date.now()}`,
      description: t('editor.blockAdded', 'Блок добавлен'),
    });
    setShowAddBlock(false);
  }, [onInsertBlock, blocks.length, editorHistory, t]);

  // Handle delete with history
  const handleDeleteBlock = useCallback((id: string) => {
    const block = blocks.find(b => b.id === id);
    if (block) {
      editorHistory.pushAction({
        type: 'remove',
        blockId: id,
        previousState: block,
        description: t('editor.blockDeleted', 'Блок удалён'),
      });
    }
    onDeleteBlock(id);
    toast.success(t('editor.blockDeleted', 'Блок удалён'), {
      action: {
        label: t('editor.undo', 'Отменить'),
        onClick: handleUndo,
      },
    });
  }, [blocks, onDeleteBlock, editorHistory, t, handleUndo]);

  // Handle reorder with history
  const handleReorderBlocks = useCallback((newBlocks: Block[]) => {
    editorHistory.pushAction({
      type: 'move',
      description: t('editor.blocksReordered', 'Блоки переставлены'),
    });
    onReorderBlocks(newBlocks);
  }, [onReorderBlocks, editorHistory, t]);

  return (
    <div className="min-h-screen safe-area-top relative">
      {/* Top Toolbar - Fixed */}
      <header className="sticky top-0 z-40 glass-nav">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-2xl transition-all",
                editorHistory.canUndo && "bg-muted/50"
              )}
              onClick={handleUndo}
              disabled={!editorHistory.canUndo}
            >
              <Undo2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11 rounded-2xl transition-all",
                editorHistory.canRedo && "bg-muted/50"
              )}
              onClick={handleRedo}
              disabled={!editorHistory.canRedo}
            >
              <Redo2 className="h-5 w-5" />
            </Button>
            
            {/* History indicator */}
            {editorHistory.historyLength > 0 && (
              <Badge variant="secondary" className="ml-1 h-6 px-2 text-xs">
                {editorHistory.currentIndex + 1}/{editorHistory.historyLength}
              </Badge>
            )}
          </div>

          {/* Center: Save status */}
          <AutoSaveIndicator status={saveStatus} />

          {/* Right: Quick actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-2xl"
              onClick={() => setShowStructure(true)}
            >
              <Layers className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-2xl"
              onClick={() => setShowReorder(true)}
            >
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="pb-32">
        <PreviewEditor
          blocks={blocks}
          isPremium={isPremium}
          currentTier={currentTier}
          premiumTier={premiumTier}
          gridConfig={gridConfig}
          onInsertBlock={onInsertBlock}
          onEditBlock={onEditBlock}
          onDeleteBlock={handleDeleteBlock}
          onReorderBlocks={handleReorderBlocks}
          onUpdateBlock={onUpdateBlock}
        />
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between gap-2 p-2 rounded-[24px] bg-card/90 backdrop-blur-2xl border border-border/20 shadow-2xl">
            {/* Add Block - Primary */}
            <Button
              size="lg"
              className="flex-1 h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/25"
              onClick={() => setShowAddBlock(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              {t('editor.addBlock', 'Добавить')}
            </Button>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-14 w-14 rounded-2xl"
                onClick={onOpenAI}
              >
                <Wand2 className="h-5 w-5 text-violet-500" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-14 w-14 rounded-2xl"
                onClick={onPreview}
              >
                <Eye className="h-5 w-5 text-blue-500" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-14 w-14 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25"
                onClick={onShare}
              >
                <Upload className="h-5 w-5 text-emerald-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Structure View Sheet */}
      <StructureView
        open={showStructure}
        onOpenChange={setShowStructure}
        blocks={blocks}
        onNavigate={(blockId) => {
          setShowStructure(false);
          // Scroll to block
          const element = document.querySelector(`[data-block-id="${blockId}"]`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        onToggleVisibility={(blockId) => {
          const block = blocks.find(b => b.id === blockId);
          if (block) {
            onUpdateBlock(blockId, { isHidden: !block.isHidden });
            toast.success(block.isHidden ? t('editor.blockShown', 'Блок показан') : t('editor.blockHidden', 'Блок скрыт'));
          }
        }}
        onDuplicate={(blockId) => {
          const block = blocks.find(b => b.id === blockId);
          if (block) {
            const index = blocks.indexOf(block);
            onInsertBlock(block.type, index + 1);
            toast.success(t('editor.blockDuplicated', 'Блок дублирован'));
          }
        }}
        onDelete={(blockId) => {
          handleDeleteBlock(blockId);
          setShowStructure(false);
        }}
      />

      {/* Reorder Mode Sheet */}
      <ReorderMode
        open={showReorder}
        onOpenChange={setShowReorder}
        blocks={blocks}
        onReorder={handleReorderBlocks}
      />

      {/* Add Block Sheet */}
      <BlockInsertButton
        onInsert={handleInsertBlock}
        isPremium={isPremium}
        currentTier={currentTier}
        currentBlockCount={blocks.length}
        isOpen={showAddBlock}
        onOpenChange={setShowAddBlock}
        hideTrigger
      />
    </div>
  );
});
