import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIButton } from '@/components/form-fields/AIButton';
import { generateMagicTitle } from '@/lib/ai-helpers';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateLinkBlock } from '@/lib/block-validators';

function LinkBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateTitle = async () => {
    if (!formData.url) return;
    
    setAiLoading(true);
    try {
      const title = await generateMagicTitle(formData.url);
      onChange({ ...formData, title });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>URL</Label>
        <Input
          type="url"
          value={formData.url || ''}
          onChange={(e) => onChange({ ...formData, url: e.target.value })}
        />
      </div>
      
      <div>
        <Label>Title</Label>
        <div className="flex gap-2">
          <Input
            value={formData.title || ''}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            className="flex-1"
          />
          <AIButton
            onClick={handleGenerateTitle}
            loading={aiLoading}
            disabled={!formData.url}
            title="Generate with AI"
          />
        </div>
      </div>
      
      <div>
        <Label>Icon</Label>
        <Select
          value={formData.icon || 'globe'}
          onValueChange={(value) => onChange({ ...formData, icon: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="globe">Globe</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Button Style</Label>
        <Select
          value={formData.style || 'default'}
          onValueChange={(value) => onChange({ ...formData, style: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="rounded">Rounded</SelectItem>
            <SelectItem value="pill">Pill (Fully Rounded)</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

export const LinkBlockEditor = withBlockEditor(LinkBlockEditorComponent, {
  hint: 'Add clickable links to any external page or resource',
  validate: validateLinkBlock,
});
