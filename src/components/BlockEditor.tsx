import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ProfileBlockEditor } from './block-editors/ProfileBlockEditor';
import { TextBlockEditor } from './block-editors/TextBlockEditor';
import { LinkBlockEditor } from './block-editors/LinkBlockEditor';
import { ProductBlockEditor } from './block-editors/ProductBlockEditor';
import { VideoBlockEditor } from './block-editors/VideoBlockEditor';
import { CarouselBlockEditor } from './block-editors/CarouselBlockEditor';
import { ButtonBlockEditor } from './block-editors/ButtonBlockEditor';
import { SocialsBlockEditor } from './block-editors/SocialsBlockEditor';
import { ImageBlockEditor } from './block-editors/ImageBlockEditor';
import { CustomCodeBlockEditor } from './block-editors/CustomCodeBlockEditor';
import type { Block } from '@/types/page';

interface BlockEditorProps {
  block: Block | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Block>) => void;
}

const BLOCK_TITLES: Record<string, string> = {
  profile: 'Редактировать Профиль',
  text: 'Редактировать Текст',
  link: 'Редактировать Ссылку',
  button: 'Редактировать Кнопку',
  image: 'Редактировать Фото',
  video: 'Редактировать Видео',
  carousel: 'Редактировать Галерею',
  product: 'Редактировать Магазин',
  search: 'Редактировать Поиск',
  socials: 'Редактировать Соцсети',
  custom_code: 'Редактировать Код',
  messenger: 'Редактировать Мессенджеры',
  form: 'Редактировать Форму',
  download: 'Редактировать Загрузку',
  newsletter: 'Редактировать Рассылку',
  testimonial: 'Редактировать Отзывы',
  scratch: 'Редактировать Скретч-карту',
};

export function BlockEditor({ block, isOpen, onClose, onSave }: BlockEditorProps) {
  const [formData, setFormData] = useState<any>(() => block ? { ...block } : {});

  // Update formData when block changes
  useEffect(() => {
    if (block) {
      setFormData({ ...block });
    }
  }, [block]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!block) return null;

  const renderEditor = () => {
    const commonProps = {
      formData,
      onChange: setFormData,
    };

    switch (block.type) {
      case 'profile':
        return <ProfileBlockEditor {...commonProps} />;
      
      case 'text':
        return <TextBlockEditor {...commonProps} />;
      
      case 'link':
        return <LinkBlockEditor {...commonProps} />;
      
      case 'product':
        return <ProductBlockEditor {...commonProps} />;
      
      case 'video':
        return <VideoBlockEditor {...commonProps} />;
      
      case 'carousel':
        return <CarouselBlockEditor {...commonProps} />;
      
      case 'button':
        return <ButtonBlockEditor {...commonProps} />;
      
      case 'socials':
        return <SocialsBlockEditor {...commonProps} />;
      
      case 'image':
        return <ImageBlockEditor {...commonProps} />;
      
      case 'custom_code':
        return <CustomCodeBlockEditor {...commonProps} />;
      
      // For blocks not yet extracted, show message
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Editor for {block.type} block is being refactored. Please use the old editor temporarily.
          </p>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {BLOCK_TITLES[block.type] || 'Редактировать Блок'}
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
