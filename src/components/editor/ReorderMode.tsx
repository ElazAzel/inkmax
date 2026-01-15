/**
 * ReorderMode - Full-screen reorder mode for non-gesture users
 * Simple up/down controls without drag gestures
 */
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLucideIcon } from '@/lib/icon-utils';
import type { Block } from '@/types/page';

interface ReorderModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blocks: Block[];
  onReorder: (blocks: Block[]) => void;
}

// Block type to icon mapping
const BLOCK_ICONS: Record<string, string> = {
  profile: 'User',
  link: 'Link',
  button: 'MousePointer2',
  text: 'Type',
  image: 'Image',
  video: 'Video',
  carousel: 'Images',
  product: 'ShoppingBag',
  form: 'FileText',
  messenger: 'MessageCircle',
  socials: 'Share2',
  separator: 'Minus',
  avatar: 'UserCircle',
  catalog: 'Grid3X3',
  booking: 'Calendar',
  faq: 'HelpCircle',
  pricing: 'CreditCard',
  testimonial: 'Quote',
  countdown: 'Clock',
  map: 'MapPin',
  download: 'Download',
  newsletter: 'Mail',
  custom_code: 'Code',
  search: 'Search',
  before_after: 'ArrowLeftRight',
  community: 'Users',
  shoutout: 'Megaphone',
  scratch: 'Gift',
};

export const ReorderMode = memo(function ReorderMode({
  open,
  onOpenChange,
  blocks,
  onReorder,
}: ReorderModeProps) {
  const { t } = useTranslation();
  
  // Local state for reordering
  const [localBlocks, setLocalBlocks] = useState<Block[]>(blocks);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalBlocks(blocks);
      setHasChanges(false);
    }
    onOpenChange(isOpen);
  };

  // Get content blocks (excluding profile)
  const profileBlock = localBlocks.find(b => b.type === 'profile');
  const contentBlocks = localBlocks.filter(b => b.type !== 'profile');

  const getBlockTitle = (block: Block): string => {
    const content = block as any;
    return content.title || content.name || content.text?.substring(0, 30) || t(`blocks.${block.type}`, block.type);
  };

  const getBlockIcon = (type: string) => {
    const iconName = BLOCK_ICONS[type] || 'Box';
    return getLucideIcon(iconName);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= contentBlocks.length) return;

    const newContentBlocks = [...contentBlocks];
    [newContentBlocks[index], newContentBlocks[newIndex]] = [newContentBlocks[newIndex], newContentBlocks[index]];
    
    // Reconstruct full array
    const newBlocks = profileBlock ? [profileBlock, ...newContentBlocks] : newContentBlocks;
    setLocalBlocks(newBlocks);
    setHasChanges(true);
  };

  const handleSave = () => {
    onReorder(localBlocks);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalBlocks(blocks);
    setHasChanges(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-[32px] p-0 bg-card/98 backdrop-blur-3xl [&>button]:hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/25" />
        </div>

        <SheetHeader className="px-6 pb-4 border-b border-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl font-black">
                  {t('reorder.title', 'Упорядочить')}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {t('reorder.description', 'Используйте стрелки для перемещения')}
                </SheetDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="h-12 w-12 rounded-2xl"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(85vh-200px)]">
          <div className="p-4 space-y-2">
            {/* Profile block (fixed at top) */}
            {profileBlock && (
              <div className="mb-4 opacity-60">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  {t('reorder.profileFixed', 'Профиль (фиксирован)')}
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/10">
                  <GripVertical className="h-5 w-5 text-muted-foreground/30" />
                  <div className="h-11 w-11 rounded-xl bg-background/80 flex items-center justify-center">
                    {(() => {
                      const Icon = getBlockIcon('profile');
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{getBlockTitle(profileBlock)}</div>
                    <div className="text-xs text-muted-foreground">{t('blocks.profile', 'Профиль')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Content blocks */}
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              {t('reorder.contentBlocks', 'Контент')}
            </div>
            
            {contentBlocks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {t('reorder.noBlocks', 'Нет блоков для перемещения')}
              </div>
            ) : (
              contentBlocks.map((block, index) => {
                const Icon = getBlockIcon(block.type);
                const canMoveUp = index > 0;
                const canMoveDown = index < contentBlocks.length - 1;

                return (
                  <div 
                    key={block.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/10 transition-all",
                      "hover:bg-muted/50"
                    )}
                  >
                    {/* Position number */}
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="h-11 w-11 rounded-xl bg-background/80 border border-border/20 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{getBlockTitle(block)}</div>
                      <div className="text-xs text-muted-foreground">
                        {t(`blocks.${block.type}`, block.type)}
                      </div>
                    </div>

                    {/* Move controls */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl"
                        disabled={!canMoveUp}
                        onClick={() => moveBlock(index, 'up')}
                      >
                        <ChevronUp className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl"
                        disabled={!canMoveDown}
                        onClick={() => moveBlock(index, 'down')}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer with save/cancel */}
        <SheetFooter className="p-5 pb-safe border-t border-border/10 bg-background/98">
          <div className="flex gap-4 w-full">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 h-14 rounded-2xl text-base font-bold"
            >
              <X className="h-5 w-5 mr-2" />
              {t('common.cancel', 'Отмена')}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-[2] h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/30"
            >
              <Check className="h-5 w-5 mr-2" />
              {t('common.save', 'Сохранить')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});
