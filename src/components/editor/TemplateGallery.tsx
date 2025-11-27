import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Block } from '@/types/page';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  blocks: Block[];
}

const TEMPLATES: Template[] = [
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Perfect for content creators and influencers',
    category: 'Creator',
    preview: '👤',
    blocks: [
      { id: 'link-1', type: 'link', title: 'YouTube Channel', url: 'https://youtube.com', icon: 'youtube', style: 'rounded' },
      { id: 'link-2', type: 'link', title: 'Instagram', url: 'https://instagram.com', icon: 'instagram', style: 'rounded' },
      { id: 'socials-1', type: 'socials', title: 'Follow Me', platforms: [] },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Professional setup for businesses',
    category: 'Business',
    preview: '💼',
    blocks: [
      { id: 'text-1', type: 'text', content: 'About Our Company', style: 'heading' },
      { id: 'link-1', type: 'link', title: 'Our Services', url: 'https://example.com/services', icon: 'globe', style: 'rounded' },
      { id: 'link-2', type: 'link', title: 'Contact Us', url: 'https://example.com/contact', icon: 'globe', style: 'rounded' },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Showcase and sell your products',
    category: 'Shop',
    preview: '🛍️',
    blocks: [
      { id: 'product-1', type: 'product', name: 'Product 1', description: 'Amazing product', price: 1000, currency: 'KZT' },
      { id: 'product-2', type: 'product', name: 'Product 2', description: 'Another great item', price: 2000, currency: 'KZT' },
    ],
  },
  {
    id: 'musician',
    name: 'Musician',
    description: 'For artists and musicians',
    category: 'Creator',
    preview: '🎵',
    blocks: [
      { id: 'link-1', type: 'link', title: 'Spotify', url: 'https://spotify.com', icon: 'globe', style: 'rounded' },
      { id: 'link-2', type: 'link', title: 'Apple Music', url: 'https://music.apple.com', icon: 'globe', style: 'rounded' },
      { id: 'link-3', type: 'link', title: 'YouTube Music', url: 'https://youtube.com', icon: 'youtube', style: 'rounded' },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work and projects',
    category: 'Professional',
    preview: '📁',
    blocks: [
      { id: 'text-1', type: 'text', content: 'My Work', style: 'heading' },
      { id: 'link-1', type: 'link', title: 'Portfolio Website', url: 'https://example.com', icon: 'globe', style: 'rounded' },
      { id: 'link-2', type: 'link', title: 'GitHub', url: 'https://github.com', icon: 'github', style: 'rounded' },
    ],
  },
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from scratch',
    category: 'Other',
    preview: '📄',
    blocks: [],
  },
];

interface TemplateGalleryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (blocks: Block[]) => void;
}

export const TemplateGallery = memo(function TemplateGallery({
  open,
  onClose,
  onSelect,
}: TemplateGalleryProps) {
  const handleSelect = (template: Template) => {
    onSelect(template.blocks);
    onClose();
  };

  const categories = Array.from(new Set(TEMPLATES.map(t => t.category)));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-designed template or create from scratch
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TEMPLATES.filter(t => t.category === category).map((template) => (
                  <Card
                    key={template.id}
                    className="p-4 hover:border-primary cursor-pointer transition-all hover:shadow-lg group"
                    onClick={() => handleSelect(template)}
                  >
                    <div className="text-4xl mb-2 text-center group-hover:scale-110 transition-transform">
                      {template.preview}
                    </div>
                    <h4 className="font-semibold text-center mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground text-center">
                      {template.description}
                    </p>
                    <div className="mt-3 text-center">
                      <Badge variant="secondary" className="text-xs">
                        {template.blocks.length} blocks
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
