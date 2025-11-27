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
import type { Block, VideoBlock, CarouselBlock, CustomCodeBlock, LinkBlock, ProductBlock, ButtonBlock, SocialsBlock, ImageBlock, SearchBlock, ProfileBlock, TextBlock } from '@/types/page';

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
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <Label>Avatar URL</Label>
              <Input
                type="url"
                value={formData.avatar || ''}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell people about yourself..."
                rows={3}
              />
            </div>
            
            <div className="border-t pt-4">
              <Label>Avatar Frame Style</Label>
              <Select
                value={formData.avatarFrame || 'default'}
                onValueChange={(value) => setFormData({ ...formData, avatarFrame: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default - Simple Ring</SelectItem>
                  <SelectItem value="neon">Neon - Glowing Effect</SelectItem>
                  <SelectItem value="glitch">Glitch - Digital Effect</SelectItem>
                  <SelectItem value="aura">Aura - Soft Glow</SelectItem>
                  <SelectItem value="gradient">Gradient - Color Shift</SelectItem>
                  <SelectItem value="pulse">Pulse - Animated Beat</SelectItem>
                  <SelectItem value="rainbow">Rainbow - Color Wave</SelectItem>
                  <SelectItem value="double">Double - Two Rings</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Choose a frame style to make your avatar stand out
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified || false}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="verified" className="cursor-pointer">Verified badge</Label>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Content</Label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your text..."
                rows={4}
              />
            </div>
            <div>
              <Label>Style</Label>
              <Select
                value={formData.style || 'paragraph'}
                onValueChange={(value) => setFormData({ ...formData, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heading">Heading</SelectItem>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="quote">Quote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

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
            <div>
              <Label>Button Style</Label>
              <Select
                value={formData.style || 'default'}
                onValueChange={(value) => setFormData({ ...formData, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="pill">Pill (Fully Rounded)</SelectItem>
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

      case 'button':
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
              <Label>URL</Label>
              <Input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <Label className="text-base font-semibold">Background</Label>
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.background?.type || 'solid'}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    background: { ...formData.background, type: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.background?.type === 'solid' && (
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={formData.background?.value || '#3b82f6'}
                    onChange={(e) => setFormData({
                      ...formData,
                      background: { ...formData.background, value: e.target.value }
                    })}
                  />
                </div>
              )}

              {formData.background?.type === 'gradient' && (
                <>
                  <div>
                    <Label>Gradient Colors (comma-separated)</Label>
                    <Input
                      placeholder="#3b82f6, #8b5cf6"
                      value={formData.background?.value || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        background: { ...formData.background, value: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Angle (degrees)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="360"
                      value={formData.background?.gradientAngle || 135}
                      onChange={(e) => setFormData({
                        ...formData,
                        background: { ...formData.background, gradientAngle: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </>
              )}

              {formData.background?.type === 'image' && (
                <div>
                  <Label>Image URL</Label>
                  <Input
                    type="url"
                    value={formData.background?.value || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      background: { ...formData.background, value: e.target.value }
                    })}
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Label>Hover Effect</Label>
              <Select
                value={formData.hoverEffect || 'none'}
                onValueChange={(value) => setFormData({ ...formData, hoverEffect: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="glow">Glow</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                  <SelectItem value="shadow">Shadow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'socials':
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
              <Label>Social Platforms</Label>
              <div className="space-y-2">
                {(formData.platforms || []).map((platform: any, index: number) => (
                  <div key={index} className="flex gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Platform name"
                        value={platform.name}
                        onChange={(e) => {
                          const newPlatforms = [...formData.platforms];
                          newPlatforms[index].name = e.target.value;
                          setFormData({ ...formData, platforms: newPlatforms });
                        }}
                      />
                      <Input
                        placeholder="URL"
                        value={platform.url}
                        onChange={(e) => {
                          const newPlatforms = [...formData.platforms];
                          newPlatforms[index].url = e.target.value;
                          setFormData({ ...formData, platforms: newPlatforms });
                        }}
                      />
                      <Select
                        value={platform.icon || 'globe'}
                        onValueChange={(value) => {
                          const newPlatforms = [...formData.platforms];
                          newPlatforms[index].icon = value;
                          setFormData({ ...formData, platforms: newPlatforms });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="threads">Threads</SelectItem>
                          <SelectItem value="globe">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPlatforms = formData.platforms.filter((_: any, i: number) => i !== index);
                        setFormData({ ...formData, platforms: newPlatforms });
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
                      platforms: [...(formData.platforms || []), { name: '', url: '', icon: 'globe' }],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Platform
                </Button>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={formData.alt || ''}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
            <div>
              <Label>Caption (optional)</Label>
              <Input
                value={formData.caption || ''}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>
            <div>
              <Label>Style</Label>
              <Select
                value={formData.style || 'default'}
                onValueChange={(value) => setFormData({ ...formData, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="polaroid">Polaroid</SelectItem>
                  <SelectItem value="vignette">Vignette</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'search':
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
              <Label>Placeholder</Label>
              <Input
                value={formData.placeholder || ''}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                placeholder="Задайте вопрос..."
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                ⚡ This is a Premium feature. Search uses AI to find answers in real-time.
              </p>
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
          <DialogTitle>
            {block.type === 'profile' && 'Редактировать Профиль'}
            {block.type === 'text' && 'Редактировать Текст'}
            {block.type === 'link' && 'Редактировать Ссылку'}
            {block.type === 'button' && 'Редактировать Кнопку'}
            {block.type === 'image' && 'Редактировать Фото'}
            {block.type === 'video' && 'Редактировать Видео'}
            {block.type === 'carousel' && 'Редактировать Галерею'}
            {block.type === 'product' && 'Редактировать Магазин'}
            {block.type === 'search' && 'Редактировать Поиск'}
            {block.type === 'socials' && 'Редактировать Соцсети'}
            {block.type === 'custom_code' && 'Редактировать Код'}
          </DialogTitle>
          <DialogDescription>
            Настройте все параметры блока. Изменения сохраняются автоматически.
          </DialogDescription>
        </DialogHeader>
        
        {renderEditor()}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
