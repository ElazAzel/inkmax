import { memo, useState } from 'react';
import { Plus, Search, Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FREE_LIMITS, getBlockTier, type FreeTier } from '@/hooks/useFreemiumLimits';
import { openPremiumPurchase } from '@/lib/upgrade-utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BlockInsertButtonProps {
  onInsert: (blockType: string) => void;
  isPremium?: boolean;
  currentBlockCount?: number;
  className?: string;
  currentTier?: FreeTier;
}

type BlockTier = 'free' | 'pro' | 'business';

interface BlockConfig {
  type: string;
  label: string;
  icon: string;
  category: string;
  tier: BlockTier;
}

const ALL_BLOCKS: BlockConfig[] = [
  // Links & Navigation
  { type: 'link', label: 'Link', icon: '🔗', category: 'Links', tier: 'free' },
  { type: 'button', label: 'Button', icon: '🔘', category: 'Links', tier: 'free' },
  { type: 'socials', label: 'Social Links', icon: '👥', category: 'Links', tier: 'free' },
  
  // Content
  { type: 'text', label: 'Text', icon: '📝', category: 'Content', tier: 'free' },
  { type: 'image', label: 'Image', icon: '🖼️', category: 'Content', tier: 'free' },
  { type: 'video', label: 'Video', icon: '🎬', category: 'Content', tier: 'pro' },
  { type: 'carousel', label: 'Carousel', icon: '📸', category: 'Content', tier: 'pro' },
  { type: 'avatar', label: 'Avatar', icon: '👤', category: 'Content', tier: 'free' },
  { type: 'separator', label: 'Separator', icon: '➖', category: 'Content', tier: 'free' },
  { type: 'map', label: 'Map', icon: '🗺️', category: 'Content', tier: 'free' },
  { type: 'before_after', label: 'Before/After', icon: '🔄', category: 'Content', tier: 'pro' },
  { type: 'faq', label: 'FAQ', icon: '❓', category: 'Content', tier: 'pro' },
  
  // Shop & Products
  { type: 'product', label: 'Product', icon: '🛍️', category: 'Shop', tier: 'pro' },
  { type: 'catalog', label: 'Catalog', icon: '📋', category: 'Shop', tier: 'pro' },
  { type: 'pricing', label: 'Pricing', icon: '💰', category: 'Shop', tier: 'pro' },
  { type: 'download', label: 'Download', icon: '📥', category: 'Shop', tier: 'business' },
  
  // Forms & Communication (Business tier)
  { type: 'form', label: 'Form', icon: '📝', category: 'Forms', tier: 'business' },
  { type: 'newsletter', label: 'Newsletter', icon: '✉️', category: 'Forms', tier: 'pro' },
  { type: 'messenger', label: 'Messengers', icon: '💬', category: 'Forms', tier: 'free' },
  { type: 'booking', label: 'Booking', icon: '📅', category: 'Forms', tier: 'business' },
  
  // Interactive
  { type: 'testimonial', label: 'Testimonials', icon: '⭐', category: 'Interactive', tier: 'pro' },
  { type: 'scratch', label: 'Scratch Card', icon: '🎁', category: 'Interactive', tier: 'pro' },
  { type: 'search', label: 'AI Search', icon: '🔍', category: 'Interactive', tier: 'pro' },
  { type: 'countdown', label: 'Countdown', icon: '⏰', category: 'Interactive', tier: 'business' },
  
  // Social
  { type: 'shoutout', label: 'Shoutout', icon: '📣', category: 'Social', tier: 'pro' },
  
  // Advanced
  { type: 'custom_code', label: 'Custom Code', icon: '💻', category: 'Advanced', tier: 'pro' },
];

export const BlockInsertButton = memo(function BlockInsertButton({ 
  onInsert, 
  isPremium = false,
  currentBlockCount = 0,
  className,
  currentTier = 'free'
}: BlockInsertButtonProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAtBlockLimit = !isPremium && currentBlockCount >= FREE_LIMITS.maxBlocks;
  const remainingBlocks = isPremium ? Infinity : FREE_LIMITS.maxBlocks - currentBlockCount;

  // Get tier level for comparison
  const tierLevel = (tier: FreeTier): number => {
    switch (tier) {
      case 'business': return 3;
      case 'pro': return 2;
      default: return 1;
    }
  };

  // Check if user can use this block based on their tier
  const canUseBlock = (blockTier: BlockTier): boolean => {
    return tierLevel(currentTier) >= tierLevel(blockTier);
  };

  // Filter blocks based on search
  const filteredBlocks = ALL_BLOCKS.filter(block => 
    block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group blocks by category
  const blocksByCategory = filteredBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, typeof ALL_BLOCKS>);

  const handleInsert = (blockType: string, blockTier: BlockTier) => {
    if (!canUseBlock(blockTier)) {
      const tierName = blockTier === 'business' ? 'BUSINESS' : 'PRO';
      toast.error(`Этот блок доступен только в ${tierName}`, {
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

  // Get tier badge for block
  const getTierBadge = (blockTier: BlockTier) => {
    if (blockTier === 'free') return null;
    if (blockTier === 'business') {
      return (
        <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-600 border-amber-500/30">
          BIZ
        </Badge>
      );
    }
    return <Crown className="h-3 w-3 text-primary" />;
  };

  // Mobile Sheet Interface - BOLD Design
  const MobileSheet = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="default"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="h-16 w-16 rounded-3xl shadow-glass-xl backdrop-blur-xl hover:shadow-glass-xl transition-all active:scale-95 hover:-translate-y-1"
        data-onboarding="add-block"
      >
        <Plus className="h-8 w-8" />
      </Button>
      <SheetContent side="bottom" className="h-[85vh] p-0 bg-card/90 backdrop-blur-2xl border-t border-border/30 rounded-t-[2.5rem]">
        <SheetHeader className="p-5 pb-3 border-b border-border/30 sticky top-0 bg-card/80 backdrop-blur-xl z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black">Add Block</SheetTitle>
            {!isPremium && (
              <Badge variant={isAtBlockLimit ? 'destructive' : 'secondary'} className="text-sm px-3 py-1 backdrop-blur-sm font-bold">
                {remainingBlocks > 0 ? `${remainingBlocks} left` : 'Limit'}
              </Badge>
            )}
          </div>
          <SheetDescription className="sr-only">Choose a block to add to your page</SheetDescription>
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl bg-background/50 backdrop-blur-sm border-border/30 font-medium"
            />
          </div>
          {isAtBlockLimit && (
            <button
              onClick={openPremiumPurchase}
              className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl w-full text-left hover:bg-amber-500/20 transition-colors backdrop-blur-sm"
            >
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2 font-bold">
                <Crown className="h-5 w-5" />
                Upgrade to Premium for unlimited blocks
              </p>
            </button>
          )}
        </SheetHeader>
        
        <div className="overflow-y-auto p-5 space-y-6 pb-safe" style={{ height: 'calc(100% - 140px)' }}>
          {Object.entries(blocksByCategory).map(([category, blocks]) => (
            <div key={category}>
              <h3 className="text-base font-bold text-muted-foreground mb-4 px-1 uppercase tracking-wider">
                {category}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {blocks.map((block) => {
                  const isLocked = !canUseBlock(block.tier);
                  return (
                    <button
                      key={block.type}
                      onClick={() => handleInsert(block.type, block.tier)}
                      disabled={isLocked}
                      className={cn(
                        "relative flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all active:scale-95",
                        isLocked
                          ? "bg-muted/30 border-border/30 cursor-not-allowed opacity-60 backdrop-blur-sm"
                          : "bg-card/60 backdrop-blur-xl border-border/30 hover:border-primary/50 hover:bg-card/80 hover:shadow-glass cursor-pointer"
                      )}
                    >
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        {getTierBadge(block.tier)}
                      </div>
                      <span className="text-3xl">{block.icon}</span>
                      <span className="text-sm font-bold text-center leading-tight">
                        {block.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {filteredBlocks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-base text-muted-foreground font-medium">No blocks found</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop Dropdown Interface
  const DesktopDropdown = () => (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="glass"
          size="sm"
          className="h-9 w-9 p-0 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/10 transition-all shadow-glass"
          data-onboarding="add-block"
        >
          <Plus className="h-4 w-4 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center" 
        className="w-72 bg-card/80 backdrop-blur-2xl border border-border/30 z-50 max-h-[75vh] overflow-hidden p-3 rounded-2xl shadow-glass-xl"
        sideOffset={8}
      >
        <div className="sticky top-0 bg-transparent z-10 pb-2">
          <DropdownMenuLabel className="text-xs text-muted-foreground px-2 font-semibold">
            Add Block
          </DropdownMenuLabel>
          <div className="relative px-1 pt-2">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm rounded-xl bg-background/50 backdrop-blur-sm border-border/30"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] mt-2">
          {Object.entries(blocksByCategory).map(([category, blocks], idx) => (
            <div key={category}>
              {idx > 0 && <DropdownMenuSeparator className="my-2 bg-border/30" />}
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 font-medium">
                {category}
              </DropdownMenuLabel>
              {blocks.map((block) => {
                const isLocked = !canUseBlock(block.tier);
                return (
                  <DropdownMenuItem
                    key={block.type}
                    onClick={() => handleInsert(block.type, block.tier)}
                    disabled={isLocked}
                    className={cn(
                      "cursor-pointer transition-all rounded-xl mx-1 my-0.5 hover:bg-card/80 hover:backdrop-blur-xl",
                      isLocked && "opacity-60"
                    )}
                  >
                    <span className="mr-3 text-lg">{block.icon}</span>
                    <span className="flex-1 font-medium">{block.label}</span>
                    <div className="flex items-center gap-1 ml-2">
                      {getTierBadge(block.tier)}
                      {isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          ))}
          
          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-xs text-muted-foreground">No blocks found</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className={cn(
      "flex items-center justify-center transition-opacity duration-200",
      className
    )}>
      {isMobile ? <MobileSheet /> : <DesktopDropdown />}
    </div>
  );
});
