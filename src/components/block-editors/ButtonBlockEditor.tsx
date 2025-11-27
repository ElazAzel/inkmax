import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateButtonBlock } from '@/lib/block-validators';

function ButtonBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="Button text"
        />
      </div>

      <div>
        <Label>URL</Label>
        <Input
          type="url"
          value={formData.url || ''}
          onChange={(e) => onChange({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label>Hover Effect</Label>
        <Select
          value={formData.hoverEffect || 'none'}
          onValueChange={(value) => onChange({ ...formData, hoverEffect: value })}
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

      <div className="border-t pt-4">
        <Label>Background Type</Label>
        <Select
          value={formData.background?.type || 'solid'}
          onValueChange={(value) =>
            onChange({
              ...formData,
              background: { ...formData.background, type: value },
            })
          }
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
          <Label>Background Color</Label>
          <Input
            type="color"
            value={formData.background?.value || '#000000'}
            onChange={(e) =>
              onChange({
                ...formData,
                background: { ...formData.background, value: e.target.value },
              })
            }
          />
        </div>
      )}

      {formData.background?.type === 'gradient' && (
        <>
          <div>
            <Label>Gradient Colors</Label>
            <Input
              value={formData.background?.value || ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  background: { ...formData.background, value: e.target.value },
                })
              }
              placeholder="#ff0000, #0000ff"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter comma-separated colors
            </p>
          </div>
          <div>
            <Label>Gradient Angle (degrees)</Label>
            <Input
              type="number"
              value={formData.background?.gradientAngle || 135}
              onChange={(e) =>
                onChange({
                  ...formData,
                  background: {
                    ...formData.background,
                    gradientAngle: parseInt(e.target.value),
                  },
                })
              }
              min="0"
              max="360"
            />
          </div>
        </>
      )}

      {formData.background?.type === 'image' && (
        <div>
          <Label>Background Image URL</Label>
          <Input
            type="url"
            value={formData.background?.value || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                background: { ...formData.background, value: e.target.value },
              })
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      <div>
        <Label>Alignment</Label>
        <Select
          value={formData.alignment || 'center'}
          onValueChange={(value) => onChange({ ...formData, alignment: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export const ButtonBlockEditor = withBlockEditor(ButtonBlockEditorComponent, {
  hint: 'Create custom buttons with gradients, images, and hover effects',
  validate: validateButtonBlock,
});
