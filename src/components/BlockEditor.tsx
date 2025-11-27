import { useState, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Block } from '@/types/page';

// Lazy load all block editors for code splitting
const ProfileBlockEditor = lazy(() => import('./block-editors/ProfileBlockEditor').then(m => ({ default: m.ProfileBlockEditor })));
const TextBlockEditor = lazy(() => import('./block-editors/TextBlockEditor').then(m => ({ default: m.TextBlockEditor })));
const LinkBlockEditor = lazy(() => import('./block-editors/LinkBlockEditor').then(m => ({ default: m.LinkBlockEditor })));
const ProductBlockEditor = lazy(() => import('./block-editors/ProductBlockEditor').then(m => ({ default: m.ProductBlockEditor })));
const VideoBlockEditor = lazy(() => import('./block-editors/VideoBlockEditor').then(m => ({ default: m.VideoBlockEditor })));
const CarouselBlockEditor = lazy(() => import('./block-editors/CarouselBlockEditor').then(m => ({ default: m.CarouselBlockEditor })));
const ButtonBlockEditor = lazy(() => import('./block-editors/ButtonBlockEditor').then(m => ({ default: m.ButtonBlockEditor })));
const SocialsBlockEditor = lazy(() => import('./block-editors/SocialsBlockEditor').then(m => ({ default: m.SocialsBlockEditor })));
const ImageBlockEditor = lazy(() => import('./block-editors/ImageBlockEditor').then(m => ({ default: m.ImageBlockEditor })));
const CustomCodeBlockEditor = lazy(() => import('./block-editors/CustomCodeBlockEditor').then(m => ({ default: m.CustomCodeBlockEditor })));
const MessengerBlockEditor = lazy(() => import('./block-editors/MessengerBlockEditor').then(m => ({ default: m.MessengerBlockEditor })));
const FormBlockEditor = lazy(() => import('./block-editors/FormBlockEditor').then(m => ({ default: m.FormBlockEditor })));
const DownloadBlockEditor = lazy(() => import('./block-editors/DownloadBlockEditor').then(m => ({ default: m.DownloadBlockEditor })));
const NewsletterBlockEditor = lazy(() => import('./block-editors/NewsletterBlockEditor').then(m => ({ default: m.NewsletterBlockEditor })));
const TestimonialBlockEditor = lazy(() => import('./block-editors/TestimonialBlockEditor').then(m => ({ default: m.TestimonialBlockEditor })));
const ScratchBlockEditor = lazy(() => import('./block-editors/ScratchBlockEditor').then(m => ({ default: m.ScratchBlockEditor })));
const SearchBlockEditor = lazy(() => import('./block-editors/SearchBlockEditor').then(m => ({ default: m.SearchBlockEditor })));

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

    // Loading fallback for lazy-loaded editors
    const EditorFallback = () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );

    switch (block.type) {
      case 'profile':
        return (
          <Suspense fallback={<EditorFallback />}>
            <ProfileBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'text':
        return (
          <Suspense fallback={<EditorFallback />}>
            <TextBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'link':
        return (
          <Suspense fallback={<EditorFallback />}>
            <LinkBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'product':
        return (
          <Suspense fallback={<EditorFallback />}>
            <ProductBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'video':
        return (
          <Suspense fallback={<EditorFallback />}>
            <VideoBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'carousel':
        return (
          <Suspense fallback={<EditorFallback />}>
            <CarouselBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'button':
        return (
          <Suspense fallback={<EditorFallback />}>
            <ButtonBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'socials':
        return (
          <Suspense fallback={<EditorFallback />}>
            <SocialsBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'image':
        return (
          <Suspense fallback={<EditorFallback />}>
            <ImageBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'custom_code':
        return (
          <Suspense fallback={<EditorFallback />}>
            <CustomCodeBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'messenger':
        return (
          <Suspense fallback={<EditorFallback />}>
            <MessengerBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'form':
        return (
          <Suspense fallback={<EditorFallback />}>
            <FormBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'download':
        return (
          <Suspense fallback={<EditorFallback />}>
            <DownloadBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'newsletter':
        return (
          <Suspense fallback={<EditorFallback />}>
            <NewsletterBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'testimonial':
        return (
          <Suspense fallback={<EditorFallback />}>
            <TestimonialBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'scratch':
        return (
          <Suspense fallback={<EditorFallback />}>
            <ScratchBlockEditor {...commonProps} />
          </Suspense>
        );
      
      case 'search':
        return (
          <Suspense fallback={<EditorFallback />}>
            <SearchBlockEditor {...commonProps} />
          </Suspense>
        );
      
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Editor for this block type is not available.
          </p>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">
            {BLOCK_TITLES[block.type] || 'Редактировать Блок'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Настройте все параметры блока. Изменения сохраняются автоматически.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderEditor()}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Отмена
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
