import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Block, VideoBlock, CarouselBlock, CustomCodeBlock, LinkBlock, ProductBlock } from '@/types/page';

interface BlockEditorProps {
  block: Block | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Block>) => void;
}

export function BlockEditor({ block, isOpen, onClose, onSave }: BlockEditorProps) {
  const [formData, setFormData] = useState<any>(() => {
    if (!block) return {};
    return { ...block };
  });
  const [aiLoading, setAiLoading] = useState(false);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const generateMagicTitle = async () => {
    if (!formData.url) {
      toast.error('Please enter a URL first');
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: {
          type: 'magic-title',
          input: { url: formData.url },
        },
      });

      if (error) throw error;
      
      setFormData({ ...formData, title: data.result });
      toast.success('Title generated!');
    } catch (error) {
      console.error('Magic title error:', error);
      toast.error('Failed to generate title');
    } finally {
      setAiLoading(false);
    }
  };

  const generateSalesCopy = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Please enter product name and price first');
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: {
          type: 'sales-copy',
          input: {
            productName: formData.name,
            price: formData.price,
            currency: formData.currency || '$',
          },
        },
      });

      if (error) throw error;
      
      setFormData({ ...formData, description: data.result });
      toast.success('Description generated!');
    } catch (error) {
      console.error('Sales copy error:', error);
      toast.error('Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  if (!block) return null;

  const renderEditor = () => {
    switch (block.type) {
      case 'link':
        return (
          <div className="space-y-4">
            <div>
              <Label>URL</Label>
              <Input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <Label>Title</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateMagicTitle}
                  disabled={aiLoading || !formData.url}
                  title="Generate with AI"
                >
                  {aiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label>Icon</Label>
              <Select
                value={formData.icon || 'globe'}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="globe">Globe</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'product':
        return (
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input
                  value={formData.currency || '$'}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <div className="space-y-2">
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSalesCopy}
                  disabled={aiLoading || !formData.name || !formData.price}
                  className="w-full"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label>Image URL (optional)</Label>
              <Input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            <div>
              <Label>Buy Link (optional)</Label>
              <Input
                type="url"
                value={formData.buyLink || ''}
                onChange={(e) => setFormData({ ...formData, buyLink: e.target.value })}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input
                type="url"
                placeholder="YouTube or Vimeo URL"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <Label>Platform</Label>
              <Select
                value={formData.platform || 'youtube'}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Aspect Ratio</Label>
              <Select
                value={formData.aspectRatio || '16:9'}
                onValueChange={(value) => setFormData({ ...formData, aspectRatio: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title (optional)</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Images</Label>
              <div className="space-y-2">
                {(formData.images || []).map((img: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      value={img.url}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index].url = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newImages = formData.images.filter((_: any, i: number) => i !== index);
                        setFormData({ ...formData, images: newImages });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      images: [...(formData.images || []), { url: '', alt: '' }],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.autoPlay || false}
                  onChange={(e) => setFormData({ ...formData, autoPlay: e.target.checked })}
                />
                <span className="text-sm">Auto-play</span>
              </label>
              {formData.autoPlay && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Interval (ms)</Label>
                  <Input
                    type="number"
                    value={formData.interval || 3000}
                    onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                    className="w-24"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'custom_code':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title (optional)</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>HTML</Label>
              <Textarea
                value={formData.html || ''}
                onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                rows={8}
                className="font-mono text-sm"
                placeholder="<div>Your HTML here...</div>"
              />
            </div>
            <div>
              <Label>CSS (optional)</Label>
              <Textarea
                value={formData.css || ''}
                onChange={(e) => setFormData({ ...formData, css: e.target.value })}
                rows={6}
                className="font-mono text-sm"
                placeholder=".your-class { color: red; }"
              />
            </div>
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">This block type cannot be edited.</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.type} Block</DialogTitle>
          <DialogDescription>
            Make changes to your block. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        
        {renderEditor()}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
