import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageBlockEditorProps {
  formData: any;
  onChange: (updates: any) => void;
}

export function ImageBlockEditor({ formData, onChange }: ImageBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Image URL</Label>
        <Input
          type="url"
          value={formData.url || ''}
          onChange={(e) => onChange({ ...formData, url: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label>Alt Text</Label>
        <Input
          value={formData.alt || ''}
          onChange={(e) => onChange({ ...formData, alt: e.target.value })}
          placeholder="Image description for accessibility"
        />
      </div>

      <div>
        <Label>Caption (optional)</Label>
        <Textarea
          value={formData.caption || ''}
          onChange={(e) => onChange({ ...formData, caption: e.target.value })}
          placeholder="Add a caption for your image..."
          rows={2}
        />
      </div>

      <div>
        <Label>Image Style</Label>
        <Select
          value={formData.style || 'default'}
          onValueChange={(value) => onChange({ ...formData, style: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default - Rounded Corners</SelectItem>
            <SelectItem value="polaroid">Polaroid - Vintage Frame</SelectItem>
            <SelectItem value="vignette">Vignette - Soft Edges</SelectItem>
            <SelectItem value="circle">Circle - Round Crop</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
