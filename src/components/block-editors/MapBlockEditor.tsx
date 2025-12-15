import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MapBlock } from '@/types/page';
import { withBlockEditor } from './BlockEditorWrapper';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { type MultilingualString } from '@/lib/i18n-helpers';
import { MapPin } from 'lucide-react';

interface MapBlockEditorProps {
  formData: MapBlock;
  onChange: (data: Partial<MapBlock>) => void;
}

function MapBlockEditorComponent({ formData, onChange }: MapBlockEditorProps) {
  const zoom = formData.zoom || 15;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <MultilingualInput
          label="Заголовок (опционально)"
          value={formData.title as MultilingualString || { ru: '', en: '', kk: '' }}
          onChange={(value) => onChange({ title: value })}
          placeholder="Наш офис"
        />
      </div>

      <div className="space-y-2">
        <MultilingualInput
          label="Адрес *"
          value={formData.address as MultilingualString || { ru: '', en: '', kk: '' }}
          onChange={(value) => onChange({ address: value })}
          placeholder="Алматы, ул. Абая 150"
        />
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Введите адрес - карта найдёт место автоматически
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Масштаб</Label>
          <span className="text-sm text-muted-foreground">{zoom}x</span>
        </div>
        <Slider
          value={[zoom]}
          onValueChange={([value]) => onChange({ zoom: value })}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Весь мир</span>
          <span>Район</span>
          <span>Улица</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Высота карты</Label>
        <Select
          value={formData.height || 'medium'}
          onValueChange={(value: 'small' | 'medium' | 'large') => onChange({ height: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Маленькая</SelectItem>
            <SelectItem value="medium">Средняя</SelectItem>
            <SelectItem value="large">Большая</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export const MapBlockEditor = withBlockEditor(
  MapBlockEditorComponent,
  {
    validate: (data) => {
      const address = data.address;
      if (!address) return 'Адрес обязателен';
      
      // Check if it's multilingual or simple string
      if (typeof address === 'object') {
        const hasValue = address.ru || address.en || address.kk;
        if (!hasValue) return 'Введите адрес';
      } else if (!address.trim()) {
        return 'Введите адрес';
      }
      
      return null;
    }
  }
);
