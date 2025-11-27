import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateCarouselBlock } from '@/lib/block-validators';
import { ArrayFieldList } from '@/components/form-fields/ArrayFieldList';
import { ArrayFieldItem } from '@/components/form-fields/ArrayFieldItem';

function CarouselBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const images = formData.images || [];

  const addImage = () => {
    onChange({
      ...formData,
      images: [...images, { url: '', alt: '', link: '' }],
    });
  };

  const removeImage = (index: number) => {
    onChange({
      ...formData,
      images: images.filter((_: any, i: number) => i !== index),
    });
  };

  const updateImage = (index: number, field: string, value: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, images: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
        />
      </div>

      <ArrayFieldList label="Images" items={images} onAdd={addImage}>
        {images.map((image: any, index: number) => (
          <ArrayFieldItem
            key={index}
            index={index}
            label="Image"
            onRemove={() => removeImage(index)}
          >
            <div>
              <Label className="text-xs">Image URL</Label>
              <Input
                type="url"
                value={image.url}
                onChange={(e) => updateImage(index, 'url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label className="text-xs">Alt Text</Label>
              <Input
                value={image.alt}
                onChange={(e) => updateImage(index, 'alt', e.target.value)}
                placeholder="Image description"
              />
            </div>

            <div>
              <Label className="text-xs">Link (optional)</Label>
              <Input
                type="url"
                value={image.link || ''}
                onChange={(e) => updateImage(index, 'link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </ArrayFieldItem>
        ))}
      </ArrayFieldList>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoPlay"
          checked={formData.autoPlay || false}
          onChange={(e) => onChange({ ...formData, autoPlay: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="autoPlay" className="cursor-pointer">Auto-play</Label>
      </div>

      {formData.autoPlay && (
        <div>
          <Label>Interval (ms)</Label>
          <Input
            type="number"
            value={formData.interval || 3000}
            onChange={(e) => onChange({ ...formData, interval: parseInt(e.target.value) })}
            min="1000"
            step="500"
          />
        </div>
      )}
    </div>
  );
}

export const CarouselBlockEditor = withBlockEditor(CarouselBlockEditorComponent, {
  hint: 'Create an image gallery carousel with auto-play option',
  validate: validateCarouselBlock,
});
