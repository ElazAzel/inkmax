import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextBlockEditorProps {
  formData: any;
  onChange: (updates: any) => void;
}

export function TextBlockEditor({ formData, onChange }: TextBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Content</Label>
        <Textarea
          value={formData.content || ''}
          onChange={(e) => onChange({ ...formData, content: e.target.value })}
          placeholder="Enter your text..."
          rows={4}
        />
      </div>
      
      <div>
        <Label>Style</Label>
        <Select
          value={formData.style || 'paragraph'}
          onValueChange={(value) => onChange({ ...formData, style: value })}
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
}
