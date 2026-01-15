import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Lock, Crown, Type, Video, Link2, File, ListOrdered, Image, ShoppingBag, Code, MessageCircle, Calendar, Star, Gift, Compass, MapPin, Clock, DollarSign, Megaphone, FormInput, Mail, HelpCircle, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FREE_LIMITS, type FreeTier } from '@/hooks/useFreemiumLimits';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BlockInsertButtonProps {
  onInsert: (blockType: string) => void;
  isPremium?: boolean;
  currentBlockCount?: number;
  className?: string;
  currentTier?: FreeTier;
  /** Control sheet externally (for inline mode) */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide FAB button (for inline mode) */
  hideTrigger?: boolean;
}

type BlockTier = 'free' | 'pro';

interface BlockConfig {
  type: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
  tier: BlockTier;
}

// Blocks with colorful icons like competitors
const ALL_BLOCKS: BlockConfig[] = [
  // Basic
  { type: 'text', label: 'Текст', Icon: Type, color: 'bg-slate-500', tier: 'free' },
  { type: 'link', label: 'Ссылка', Icon: Link2, color: 'bg-blue-500', tier: 'free' },
  { type: 'button', label: 'Кнопка', Icon: () => <span className="text-xl font-black">▶</span>, color: 'bg-red-500', tier: 'free' },
  { type: 'image', label: 'Фото', Icon: Image, color: 'bg-emerald-500', tier: 'free' },
  
  // Media
  { type: 'video', label: 'Видео', Icon: Video, color: 'bg-rose-500', tier: 'pro' },
  { type: 'carousel', label: 'Галерея', Icon: Layers, color: 'bg-violet-500', tier: 'pro' },
  { type: 'avatar', label: 'Аватар', Icon: () => <span className="text-xl">👤</span>, color: 'bg-cyan-500', tier: 'free' },
  { type: 'separator', label: 'Разделитель', Icon: () => <span className="text-xl">—</span>, color: 'bg-gray-400', tier: 'free' },
  
  // Social
  { type: 'socials', label: 'Соцсети', Icon: () => <span className="text-xl">@</span>, color: 'bg-pink-500', tier: 'free' },
  { type: 'messenger', label: 'Мессенджеры', Icon: MessageCircle, color: 'bg-green-500', tier: 'free' },
  { type: 'shoutout', label: 'Упоминание', Icon: Megaphone, color: 'bg-orange-500', tier: 'pro' },
  
  // Business (now pro tier)
  { type: 'product', label: 'Товар', Icon: ShoppingBag, color: 'bg-amber-500', tier: 'pro' },
  { type: 'catalog', label: 'Каталог', Icon: ListOrdered, color: 'bg-teal-500', tier: 'pro' },
  { type: 'pricing', label: 'Цены', Icon: DollarSign, color: 'bg-lime-500', tier: 'pro' },
  { type: 'download', label: 'Файл', Icon: File, color: 'bg-indigo-500', tier: 'pro' },
  
  // Forms (now pro tier)
  { type: 'form', label: 'Форма', Icon: FormInput, color: 'bg-purple-500', tier: 'pro' },
  { type: 'newsletter', label: 'Рассылка', Icon: Mail, color: 'bg-sky-500', tier: 'pro' },
  { type: 'booking', label: 'Запись', Icon: Calendar, color: 'bg-fuchsia-500', tier: 'pro' },
  
  // Interactive (now pro tier)
  { type: 'testimonial', label: 'Отзывы', Icon: Star, color: 'bg-yellow-500', tier: 'pro' },
  { type: 'scratch', label: 'Скретч', Icon: Gift, color: 'bg-red-400', tier: 'pro' },
  { type: 'faq', label: 'FAQ', Icon: HelpCircle, color: 'bg-blue-400', tier: 'pro' },
  { type: 'countdown', label: 'Таймер', Icon: Clock, color: 'bg-orange-400', tier: 'pro' },
  
  // Other
  { type: 'map', label: 'Карта', Icon: MapPin, color: 'bg-green-600', tier: 'free' },
  { type: 'before_after', label: 'До/После', Icon: Compass, color: 'bg-cyan-600', tier: 'pro' },
  { type: 'search', label: 'AI Поиск', Icon: Search, color: 'bg-violet-600', tier: 'pro' },
  { type: 'custom_code', label: 'Код', Icon: Code, color: 'bg-slate-600', tier: 'pro' },
  
  // Social - Community
  { type: 'community', label: 'Сообщество', Icon: () => <span className="text-xl">👥</span>, color: 'bg-indigo-400', tier: 'pro' },
];

export const BlockInsertButton = memo(function BlockInsertButton({ 
  onInsert, 
  isPremium = false,
  currentBlockCount = 0,
  className,
  currentTier = 'free',
  isOpen: externalIsOpen,
  onOpenChange,
  hideTrigger = false
}: BlockInsertButtonProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Support both controlled and uncontrolled modes
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  const isAtBlockLimit = !isPremium && currentBlockCount >= FREE_LIMITS.maxBlocks;
  const remainingBlocks = isPremium ? Infinity : FREE_LIMITS.maxBlocks - currentBlockCount;

  const tierLevel = (tier: FreeTier | BlockTier): number => {
    switch (tier) {
      case 'pro': return 2;
      default: return 1;
    }
  };

  const canUseBlock = (blockTier: BlockTier): boolean => {
    return tierLevel(currentTier) >= tierLevel(blockTier);
  };

  const filteredBlocks = ALL_BLOCKS.filter(block => 
    block.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInsert = (blockType: string, blockTier: BlockTier) => {
    if (!canUseBlock(blockTier)) {
      toast.error('Этот блок доступен только в PRO', {
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/pricing'),
        },
      });
      return;
    }
    
    if (isAtBlockLimit) {
      toast.error(`Достигнут лимит ${FREE_LIMITS.maxBlocks} блоков. Перейдите на Premium.`);
      return;
    }
    
    onInsert(blockType);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Mobile & Desktop - Premium app-like sheet
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {/* FAB Button - hidden when using external control */}
      {!hideTrigger && (
        <Button
          variant="default"
          size="lg"
          onClick={() => setIsOpen(true)}
          className={cn(
            "shadow-xl shadow-primary/30 transition-all active:scale-95",
            isMobile 
              ? "h-18 w-18 rounded-full" 
              : "h-14 w-14 rounded-2xl"
          )}
          data-onboarding="add-block"
        >
          <Plus className={isMobile ? "h-9 w-9" : "h-7 w-7"} strokeWidth={2.5} />
        </Button>
      )}

      {/* Premium App-Like Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[85vh] p-0 bg-background border-t-0 rounded-t-[32px]"
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-14 h-1.5 rounded-full bg-muted-foreground/25" />
          </div>
          
          {/* Header */}
          <SheetHeader className="px-6 pt-2 pb-5 border-b border-border/10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-black">{t('editor.addBlock', 'Добавить')}</SheetTitle>
              {!isPremium && (
                <Badge 
                  variant={isAtBlockLimit ? 'destructive' : 'secondary'} 
                  className="text-sm px-4 py-1.5 rounded-full font-bold"
                >
                  {remainingBlocks > 0 ? `${remainingBlocks} ${t('freemium.left', 'осталось')}` : t('freemium.limit', 'Лимит')}
                </Badge>
              )}
            </div>
            <SheetDescription className="sr-only">{t('editor.selectBlock', 'Выберите блок для добавления')}</SheetDescription>
          </SheetHeader>
          
          {/* Search - Larger for mobile */}
          <div className="px-6 py-5 border-b border-border/10 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input
                placeholder={t('editor.searchBlocks', 'Поиск блоков...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 text-lg rounded-2xl bg-background border-border/30 font-medium"
              />
            </div>
          </div>
          
          {/* Grid of blocks - 3 columns on mobile for bigger touch targets */}
          <div className="overflow-y-auto px-5 py-5" style={{ height: 'calc(100% - 180px)' }}>
            <div className="grid grid-cols-3 gap-4">
              {filteredBlocks.map((block) => {
                const isLocked = !canUseBlock(block.tier);
                const IconComponent = block.Icon;
                
                return (
                  <button
                    key={block.type}
                    onClick={() => handleInsert(block.type, block.tier)}
                    disabled={isLocked}
                    className={cn(
                      "relative flex flex-col items-center gap-3 p-4 rounded-3xl transition-all",
                      isLocked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-muted/50 active:scale-95"
                    )}
                  >
                    {/* Colorful icon square - LARGER */}
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg",
                      block.color
                    )}>
                      <IconComponent className="h-7 w-7" />
                    </div>
                    
                    {/* Label */}
                    <span className="text-sm font-bold text-center leading-tight">
                      {block.label}
                    </span>
                    
                    {/* Lock/Crown badge */}
                    {isLocked && (
                      <div className="absolute top-2 right-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    {block.tier === 'pro' && !isLocked && (
                      <div className="absolute top-2 right-2">
                        <Crown className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {filteredBlocks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">{t('common.noResults', 'Ничего не найдено')}</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
});
