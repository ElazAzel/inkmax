import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';

function TextBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
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

export const TextBlockEditor = withBlockEditor(TextBlockEditorComponent, {
  hint: 'Add text content with different styles: Heading, Paragraph, or Quote',
});
