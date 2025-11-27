import { memo, useState } from 'react';
import { Plus, Search, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { BlockPreview } from './BlockPreview';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface BlockInsertButtonProps {
  onInsert: (blockType: string) => void;
  isPremium?: boolean;
  className?: string;
}

const ALL_BLOCKS = [
  // Links & Navigation
  { type: 'link', label: 'Link', icon: '🔗', category: 'Links', premium: false },
  { type: 'button', label: 'Button', icon: '🔘', category: 'Links', premium: false },
  { type: 'socials', label: 'Social Links', icon: '👥', category: 'Links', premium: false },
  
  // Content
  { type: 'text', label: 'Text', icon: '📝', category: 'Content', premium: false },
  { type: 'image', label: 'Image', icon: '🖼️', category: 'Content', premium: false },
  { type: 'video', label: 'Video', icon: '🎬', category: 'Content', premium: true },
  { type: 'carousel', label: 'Carousel', icon: '📸', category: 'Content', premium: true },
  
  // Shop & Products
  { type: 'product', label: 'Product', icon: '🛍️', category: 'Shop', premium: false },
  { type: 'download', label: 'Download', icon: '📥', category: 'Shop', premium: true },
  
  // Forms & Communication
  { type: 'form', label: 'Form', icon: '📋', category: 'Forms', premium: true },
  { type: 'newsletter', label: 'Newsletter', icon: '✉️', category: 'Forms', premium: true },
  { type: 'messenger', label: 'Messengers', icon: '💬', category: 'Forms', premium: true },
  
  // Interactive
  { type: 'testimonial', label: 'Testimonials', icon: '⭐', category: 'Interactive', premium: true },
  { type: 'scratch', label: 'Scratch Card', icon: '🎁', category: 'Interactive', premium: true },
  { type: 'search', label: 'AI Search', icon: '🔍', category: 'Interactive', premium: true },
  
  // Advanced
  { type: 'custom_code', label: 'Custom Code', icon: '💻', category: 'Advanced', premium: true },
];

export const BlockInsertButton = memo(function BlockInsertButton({ 
  onInsert, 
  isPremium = false,
  className 
}: BlockInsertButtonProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [longPressBlock, setLongPressBlock] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

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

  const handleInsert = (blockType: string, premium: boolean) => {
    if (premium && !isPremium) return;
    
    onInsert(blockType);
    setIsOpen(false);
    setSearchQuery('');
    setHoveredBlock(null);
    setLongPressBlock(null);
  };

  const handleMouseEnter = (blockType: string) => {
    // Only on desktop
    if (window.innerWidth >= 768) {
      setHoveredBlock(blockType);
    }
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  const handleTouchStart = (blockType: string) => {
    const timer = setTimeout(() => {
      setLongPressBlock(blockType);
    }, 500); // 500ms for long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    // Keep preview visible for a moment
    setTimeout(() => {
      setLongPressBlock(null);
    }, 300);
  };

  const activePreview = hoveredBlock || longPressBlock;

  // Mobile Sheet Interface
  const MobileSheet = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="default"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        data-onboarding="add-block"
      >
        <Plus className="h-6 w-6" />
      </Button>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <SheetHeader className="p-4 pb-2 border-b sticky top-0 bg-background z-10">
          <SheetTitle>Add Block</SheetTitle>
          <SheetDescription className="sr-only">Choose a block to add to your page</SheetDescription>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </SheetHeader>
        
        <div className="overflow-y-auto p-4 space-y-6 pb-safe" style={{ height: 'calc(100% - 130px)' }}>
          {Object.entries(blocksByCategory).map(([category, blocks]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                {category}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {blocks.map((block) => (
                  <button
                    key={block.type}
                    onClick={() => handleInsert(block.type, block.premium)}
                    onTouchStart={() => handleTouchStart(block.type)}
                    onTouchEnd={handleTouchEnd}
                    disabled={block.premium && !isPremium}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95",
                      block.premium && !isPremium
                        ? "bg-muted/50 border-border cursor-not-allowed opacity-60"
                        : "bg-card border-border hover:border-primary hover:bg-accent cursor-pointer",
                      activePreview === block.type && "border-primary bg-accent scale-[0.98]"
                    )}
                  >
                    {block.premium && !isPremium && (
                      <Lock className="absolute top-1.5 right-1.5 h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-2xl">{block.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {block.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          {filteredBlocks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No blocks found</p>
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
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
          data-onboarding="add-block"
        >
          <Plus className="h-4 w-4 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center" 
        className="w-64 bg-card z-50 max-h-[75vh] overflow-hidden p-2"
        sideOffset={5}
      >
        <div className="sticky top-0 bg-card z-10 pb-2">
          <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
            Add Block
          </DropdownMenuLabel>
          <div className="relative px-2 pt-2">
            <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] mt-2">
          {Object.entries(blocksByCategory).map(([category, blocks], idx) => (
            <div key={category}>
              {idx > 0 && <DropdownMenuSeparator className="my-2" />}
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                {category}
              </DropdownMenuLabel>
              {blocks.map((block) => (
                <DropdownMenuItem
                  key={block.type}
                  onClick={() => handleInsert(block.type, block.premium)}
                  onMouseEnter={() => handleMouseEnter(block.type)}
                  onMouseLeave={handleMouseLeave}
                  disabled={block.premium && !isPremium}
                  className={cn(
                    "cursor-pointer transition-colors rounded-lg mx-1 my-0.5",
                    activePreview === block.type && "bg-accent",
                    block.premium && !isPremium && "opacity-60"
                  )}
                >
                  <span className="mr-2 text-base">{block.icon}</span>
                  <span className="flex-1">{block.label}</span>
                  {block.premium && !isPremium && (
                    <Lock className="h-3 w-3 text-muted-foreground ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
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

      {/* Preview Tooltip - Desktop only */}
      {!isMobile && activePreview && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] animate-in fade-in zoom-in-95 duration-200 max-w-md">
          <BlockPreview blockType={activePreview} />
        </div>
      )}

      {/* Preview Overlay - Mobile long press */}
      {isMobile && longPressBlock && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99]"
            onClick={() => setLongPressBlock(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] animate-in fade-in zoom-in-95 duration-200 max-w-[90vw]">
            <BlockPreview blockType={longPressBlock} />
          </div>
        </>
      )}
    </div>
  );
});
