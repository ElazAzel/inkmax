import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface SocialsBlockEditorProps {
  formData: any;
  onChange: (updates: any) => void;
}

export function SocialsBlockEditor({ formData, onChange }: SocialsBlockEditorProps) {
  const platforms = formData.platforms || [];

  const addPlatform = () => {
    onChange({
      ...formData,
      platforms: [...platforms, { name: '', url: '', icon: 'globe' }],
    });
  };

  const removePlatform = (index: number) => {
    onChange({
      ...formData,
      platforms: platforms.filter((_: any, i: number) => i !== index),
    });
  };

  const updatePlatform = (index: number, field: string, value: string) => {
    const updated = [...platforms];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, platforms: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="Follow me on"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Social Platforms</Label>
          <Button type="button" size="sm" onClick={addPlatform}>
            <Plus className="h-4 w-4 mr-1" />
            Add Platform
          </Button>
        </div>

        {platforms.map((platform: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Platform {index + 1}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePlatform(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label className="text-xs">Icon</Label>
              <Select
                value={platform.icon}
                onValueChange={(value) => updatePlatform(index, 'icon', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="threads">Threads</SelectItem>
                  <SelectItem value="globe">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Platform Name</Label>
              <Input
                value={platform.name}
                onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                placeholder="Instagram"
              />
            </div>

            <div>
              <Label className="text-xs">URL</Label>
              <Input
                type="url"
                value={platform.url}
                onChange={(e) => updatePlatform(index, 'url', e.target.value)}
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
