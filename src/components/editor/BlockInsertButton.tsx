import { memo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BlockPreview } from './BlockPreview';
import { cn } from '@/lib/utils';

interface BlockInsertButtonProps {
  onInsert: (blockType: string) => void;
  isPremium?: boolean;
  className?: string;
}

const BASIC_BLOCKS = [
  { type: 'link', label: 'Link', icon: '🔗' },
  { type: 'button', label: 'Button', icon: '🔘' },
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'socials', label: 'Social Links', icon: '👥' },
  { type: 'product', label: 'Product', icon: '🛍️' },
];

const PREMIUM_BLOCKS = [
  { type: 'video', label: 'Video', icon: '🎬' },
  { type: 'carousel', label: 'Carousel', icon: '📸' },
  { type: 'custom_code', label: 'Custom Code', icon: '💻' },
  { type: 'form', label: 'Form', icon: '📋' },
  { type: 'newsletter', label: 'Newsletter', icon: '✉️' },
  { type: 'testimonial', label: 'Testimonials', icon: '⭐' },
  { type: 'messenger', label: 'Messengers', icon: '💬' },
  { type: 'download', label: 'Download', icon: '📥' },
  { type: 'scratch', label: 'Scratch Card', icon: '🎁' },
  { type: 'search', label: 'AI Search', icon: '🔍' },
];

export const BlockInsertButton = memo(function BlockInsertButton({ 
  onInsert, 
  isPremium = false,
  className 
}: BlockInsertButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [longPressBlock, setLongPressBlock] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleInsert = (blockType: string) => {
    onInsert(blockType);
    setIsOpen(false);
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

  return (
    <div className={cn(
      "flex items-center justify-center transition-opacity duration-200",
      className
    )}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
            data-onboarding="add-block"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          className="w-52 sm:w-56 bg-card z-50 max-h-[70vh] overflow-y-auto"
          sideOffset={5}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground sticky top-0 bg-card z-10">
            Add Block
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {BASIC_BLOCKS.map((block) => (
            <DropdownMenuItem
              key={block.type}
              onClick={() => handleInsert(block.type)}
              onMouseEnter={() => handleMouseEnter(block.type)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(block.type)}
              onTouchEnd={handleTouchEnd}
              className={cn(
                "cursor-pointer transition-colors",
                activePreview === block.type && "bg-accent"
              )}
            >
              <span className="mr-2">{block.icon}</span>
              {block.label}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1 sticky top-0 bg-card z-10">
            Premium Blocks
            {!isPremium && <span className="text-primary">🔒</span>}
          </DropdownMenuLabel>
          
          {PREMIUM_BLOCKS.map((block) => (
            <DropdownMenuItem
              key={block.type}
              onClick={() => handleInsert(block.type)}
              onMouseEnter={() => handleMouseEnter(block.type)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(block.type)}
              onTouchEnd={handleTouchEnd}
              disabled={!isPremium}
              className={cn(
                "cursor-pointer transition-colors",
                activePreview === block.type && "bg-accent"
              )}
            >
              <span className="mr-2">{block.icon}</span>
              {block.label}
              {!isPremium && <span className="ml-auto text-xs text-muted-foreground">Premium</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Tooltip */}
      {activePreview && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] animate-in fade-in zoom-in-95 duration-200 max-w-[90vw] sm:max-w-md">
          <BlockPreview blockType={activePreview} />
        </div>
      )}

      {/* Overlay for mobile preview */}
      {longPressBlock && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99]"
          onClick={() => setLongPressBlock(null)}
        />
      )}
    </div>
  );
});
