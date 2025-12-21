import { memo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save, Share2, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import type { Block } from '@/types/page';

const CATEGORIES = [
  'Креаторы',
  'Бизнес',
  'Сервис',
  'Недвижимость',
  'Свадьба',
  'Личное',
  'Другое',
];

interface SaveTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  blocks: Block[];
}

export const SaveTemplateDialog = memo(function SaveTemplateDialog({
  open,
  onClose,
  blocks,
}: SaveTemplateDialogProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Другое');
  const [isPublic, setIsPublic] = useState(false);
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error(t('auth.loginRequired', 'Войдите в аккаунт'));
      return;
    }

    if (!name.trim()) {
      toast.error(t('templates.enterName', 'Введите название шаблона'));
      return;
    }

    if (blocks.length === 0) {
      toast.error(t('templates.noBlocks', 'Добавьте хотя бы один блок'));
      return;
    }

    setIsSaving(true);
    try {
      // Prepare blocks for saving (remove unnecessary data)
      const templateBlocks = blocks.map(block => ({
        type: block.type,
        ...block,
        id: undefined, // Will be regenerated when applied
      }));

      const { error } = await supabase.from('user_templates').insert([{
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        category,
        blocks: templateBlocks as unknown as import('@/integrations/supabase/types').Json,
        is_public: isPublic,
        is_for_sale: isForSale && isPublic,
        price: isForSale ? parseInt(price) || 0 : 0,
        currency: 'KZT',
      }]);

      if (error) throw error;

      toast.success(t('templates.saved', 'Шаблон сохранён!'));
      onClose();
      
      // Reset form
      setName('');
      setDescription('');
      setCategory('Другое');
      setIsPublic(false);
      setIsForSale(false);
      setPrice('');
    } catch (error) {
      console.error('Save template error:', error);
      toast.error(t('templates.saveError', 'Ошибка сохранения'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {t('templates.saveTemplate', 'Сохранить как шаблон')}
          </DialogTitle>
          <DialogDescription>
            {t('templates.saveDesc', 'Сохраните страницу как шаблон для повторного использования')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">
              {t('templates.name', 'Название')} *
            </Label>
            <Input
              id="templateName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('templates.namePlaceholder', 'Мой крутой шаблон')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateDesc">
              {t('templates.description', 'Описание')}
            </Label>
            <Textarea
              id="templateDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('templates.descPlaceholder', 'Опишите для чего подходит этот шаблон...')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('templates.category', 'Категория')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {t('templates.makePublic', 'Сделать публичным')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('templates.publicDesc', 'Шаблон будет виден в маркетплейсе')}
                </p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {isPublic && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t('templates.sellTemplate', 'Продавать шаблон')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('templates.sellDesc', 'Установите цену для покупки')}
                  </p>
                </div>
              </div>
              <Switch checked={isForSale} onCheckedChange={setIsForSale} />
            </div>
          )}

          {isPublic && isForSale && (
            <div className="space-y-2">
              <Label htmlFor="templatePrice">
                {t('templates.price', 'Цена (KZT)')}
              </Label>
              <Input
                id="templatePrice"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5000"
                min="0"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('common.cancel', 'Отмена')}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !name.trim()}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving', 'Сохранение...')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('templates.save', 'Сохранить')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
