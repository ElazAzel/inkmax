import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { AvatarBlock } from '@/types/page';
import { withBlockEditor } from './BlockEditorWrapper';

interface AvatarBlockEditorProps {
  formData: AvatarBlock;
  onChange: (data: Partial<AvatarBlock>) => void;
}

function AvatarBlockEditorComponent({ formData, onChange }: AvatarBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>URL изображения *</Label>
        <Input
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={formData.imageUrl}
          onChange={(e) => onChange({ imageUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Имя *</Label>
        <Input
          placeholder="Иван Иванов"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Подзаголовок (опционально)</Label>
        <Input
          placeholder="Дизайнер / Разработчик"
          value={formData.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Размер</Label>
          <Select
            value={formData.size || 'medium'}
            onValueChange={(value: 'small' | 'medium' | 'large' | 'xlarge') => onChange({ size: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Маленький</SelectItem>
              <SelectItem value="medium">Средний</SelectItem>
              <SelectItem value="large">Большой</SelectItem>
              <SelectItem value="xlarge">Очень большой</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Форма</Label>
          <Select
            value={formData.shape || 'circle'}
            onValueChange={(value: 'circle' | 'rounded' | 'square') => onChange({ shape: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="circle">Круг</SelectItem>
              <SelectItem value="rounded">Скруглённый</SelectItem>
              <SelectItem value="square">Квадрат</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Тень</Label>
        <Select
          value={formData.shadow || 'soft'}
          onValueChange={(value: 'none' | 'soft' | 'medium' | 'strong' | 'glow') => onChange({ shadow: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Без тени</SelectItem>
            <SelectItem value="soft">Мягкая</SelectItem>
            <SelectItem value="medium">Средняя</SelectItem>
            <SelectItem value="strong">Сильная</SelectItem>
            <SelectItem value="glow">Свечение</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Рамка</Label>
        <Switch
          checked={formData.border || false}
          onCheckedChange={(checked) => onChange({ border: checked })}
        />
      </div>
    </div>
  );
}

export const AvatarBlockEditor = withBlockEditor(
  AvatarBlockEditorComponent,
  {
    validate: (data) => {
      if (!data.imageUrl || data.imageUrl.trim() === '') {
        return 'URL изображения обязателен';
      }
      if (!data.name || data.name.trim() === '') {
        return 'Имя обязательно';
      }
      return null;
    }
  }
);
