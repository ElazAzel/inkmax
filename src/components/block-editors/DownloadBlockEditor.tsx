import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateDownloadBlock } from '@/lib/block-validators';

function DownloadBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="Download My File"
        />
      </div>

      <div>
        <Label>Description (optional)</Label>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          placeholder="Brief description of the file"
          rows={2}
        />
      </div>

      <div>
        <Label>File URL</Label>
        <Input
          type="url"
          value={formData.fileUrl || ''}
          onChange={(e) => onChange({ ...formData, fileUrl: e.target.value })}
          placeholder="https://example.com/file.pdf"
        />
      </div>

      <div>
        <Label>File Name</Label>
        <Input
          value={formData.fileName || ''}
          onChange={(e) => onChange({ ...formData, fileName: e.target.value })}
          placeholder="document.pdf"
        />
      </div>

      <div>
        <Label>File Size (optional)</Label>
        <Input
          value={formData.fileSize || ''}
          onChange={(e) => onChange({ ...formData, fileSize: e.target.value })}
          placeholder="2.5 MB"
        />
      </div>
    </div>
  );
}

export const DownloadBlockEditor = withBlockEditor(DownloadBlockEditorComponent, {
  hint: 'Add downloadable files like PDFs, documents, or media',
  validate: validateDownloadBlock,
});
