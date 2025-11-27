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

  const handleInsert = (blockType: string) => {
    onInsert(blockType);
    setIsOpen(false);
  };

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
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-52 sm:w-56 bg-card z-50">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Add Block</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {BASIC_BLOCKS.map((block) => (
            <DropdownMenuItem
              key={block.type}
              onClick={() => handleInsert(block.type)}
              className="cursor-pointer"
            >
              <span className="mr-2">{block.icon}</span>
              {block.label}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-1">
            Premium Blocks
            {!isPremium && <span className="text-primary">🔒</span>}
          </DropdownMenuLabel>
          
          {PREMIUM_BLOCKS.map((block) => (
            <DropdownMenuItem
              key={block.type}
              onClick={() => handleInsert(block.type)}
              disabled={!isPremium}
              className="cursor-pointer"
            >
              <span className="mr-2">{block.icon}</span>
              {block.label}
              {!isPremium && <span className="ml-auto text-xs text-muted-foreground">Premium</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
