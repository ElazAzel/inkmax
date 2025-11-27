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
      
      <div className="border-t pt-4 space-y-4">
        <div>
          <Label>Cover Image URL</Label>
          <Input
            type="url"
            value={formData.coverImage || ''}
            onChange={(e) => onChange({ ...formData, coverImage: e.target.value })}
            placeholder="https://example.com/cover.jpg"
          />
        </div>

        <div>
          <Label>Cover Gradient Overlay</Label>
          <Select
            value={formData.coverGradient || 'none'}
            onValueChange={(value) => onChange({ ...formData, coverGradient: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Gradient</SelectItem>
              <SelectItem value="dark">Dark Overlay</SelectItem>
              <SelectItem value="light">Light Overlay</SelectItem>
              <SelectItem value="primary">Primary Color</SelectItem>
              <SelectItem value="sunset">Sunset Gradient</SelectItem>
              <SelectItem value="ocean">Ocean Gradient</SelectItem>
              <SelectItem value="purple">Purple Dream</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Avatar Size</Label>
          <Select
            value={formData.avatarSize || 'large'}
            onValueChange={(value) => onChange({ ...formData, avatarSize: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small - 64px</SelectItem>
              <SelectItem value="medium">Medium - 96px</SelectItem>
              <SelectItem value="large">Large - 128px</SelectItem>
              <SelectItem value="xlarge">Extra Large - 160px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Avatar Position</Label>
          <Select
            value={formData.avatarPosition || 'center'}
            onValueChange={(value) => onChange({ ...formData, avatarPosition: value })}
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

        <div>
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
              <SelectItem value="spinning">Spinning Border</SelectItem>
              <SelectItem value="dash">Dashed Animation</SelectItem>
              <SelectItem value="wave">Wave Border</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Shadow Style</Label>
          <Select
            value={formData.shadowStyle || 'soft'}
            onValueChange={(value) => onChange({ ...formData, shadowStyle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Shadow</SelectItem>
              <SelectItem value="soft">Soft Shadow</SelectItem>
              <SelectItem value="medium">Medium Shadow</SelectItem>
              <SelectItem value="strong">Strong Shadow</SelectItem>
              <SelectItem value="glow">Colored Glow</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
  hint: 'Customize your profile with avatar, name, bio, cover image, animated frames, and shadow effects',
});
