import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';

function ProfileBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Avatar URL</Label>
        <Input
          type="url"
          value={formData.avatar || ''}
          onChange={(e) => onChange({ ...formData, avatar: e.target.value })}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name || ''}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          placeholder="Your Name"
        />
      </div>
      
      <div>
        <Label>Bio</Label>
        <Textarea
          value={formData.bio || ''}
          onChange={(e) => onChange({ ...formData, bio: e.target.value })}
          placeholder="Tell people about yourself..."
          rows={3}
        />
      </div>
      
      <div className="border-t pt-4">
        <Label>Avatar Frame Style</Label>
        <Select
          value={formData.avatarFrame || 'default'}
          onValueChange={(value) => onChange({ ...formData, avatarFrame: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default - Simple Ring</SelectItem>
            <SelectItem value="neon">Neon - Glowing Effect</SelectItem>
            <SelectItem value="glitch">Glitch - Digital Effect</SelectItem>
            <SelectItem value="aura">Aura - Soft Glow</SelectItem>
            <SelectItem value="gradient">Gradient - Color Shift</SelectItem>
            <SelectItem value="pulse">Pulse - Animated Beat</SelectItem>
            <SelectItem value="rainbow">Rainbow - Color Wave</SelectItem>
            <SelectItem value="double">Double - Two Rings</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">
          Choose a frame style to make your avatar stand out
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="verified"
          checked={formData.verified || false}
          onChange={(e) => onChange({ ...formData, verified: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="verified" className="cursor-pointer">Verified badge</Label>
      </div>
    </div>
  );
}

export const ProfileBlockEditor = withBlockEditor(ProfileBlockEditorComponent, {
  hint: 'Customize your profile with avatar, name, bio, and special frame effects',
});
