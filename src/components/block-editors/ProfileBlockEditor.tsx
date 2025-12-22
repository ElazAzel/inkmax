import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaUpload } from '@/components/form-fields/MediaUpload';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { useTranslation } from 'react-i18next';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { migrateToMultilingual } from '@/lib/i18n-helpers';

function ProfileBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <MediaUpload
        label={t('fields.avatarUrl', 'Avatar')}
        value={formData.avatar || ''}
        onChange={(avatar) => onChange({ ...formData, avatar })}
        accept="image/*"
        allowGif={true}
      />
      
      <MultilingualInput
        label={t('fields.name', 'Name')}
        value={migrateToMultilingual(formData.name)}
        onChange={(value) => onChange({ ...formData, name: value })}
        placeholder="Your Name"
      />
      
      <MultilingualInput
        label={t('fields.bio', 'Bio')}
        value={migrateToMultilingual(formData.bio)}
        onChange={(value) => onChange({ ...formData, bio: value })}
        type="textarea"
        placeholder="Tell people about yourself..."
        enableRichText={true}
      />
      
      <div className="border-t pt-4 space-y-4">
        <MediaUpload
          label={t('fields.coverImage', 'Cover Image')}
          value={formData.coverImage || ''}
          onChange={(coverImage) => onChange({ ...formData, coverImage })}
          accept="image/*"
          allowGif={true}
        />

        <div>
          <Label>{t('fields.coverGradient', 'Cover Gradient Overlay')}</Label>
          <Select
            value={formData.coverGradient || 'none'}
            onValueChange={(value) => onChange({ ...formData, coverGradient: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('gradients.none', 'No Gradient')}</SelectItem>
              <SelectItem value="dark">{t('gradients.dark', 'Dark Overlay')}</SelectItem>
              <SelectItem value="light">{t('gradients.light', 'Light Overlay')}</SelectItem>
              <SelectItem value="primary">{t('gradients.primary', 'Primary Color')}</SelectItem>
              <SelectItem value="sunset">{t('gradients.sunset', 'Sunset Gradient')}</SelectItem>
              <SelectItem value="ocean">{t('gradients.ocean', 'Ocean Gradient')}</SelectItem>
              <SelectItem value="purple">{t('gradients.purple', 'Purple Dream')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('fields.coverHeight', 'Cover Height')}</Label>
          <Select
            value={formData.coverHeight || 'medium'}
            onValueChange={(value) => onChange({ ...formData, coverHeight: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">{t('heights.small', 'Small - 120px')}</SelectItem>
              <SelectItem value="medium">{t('heights.medium', 'Medium - 200px')}</SelectItem>
              <SelectItem value="large">{t('heights.large', 'Large - 320px')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('fields.avatarSize', 'Avatar Size')}</Label>
          <Select
            value={formData.avatarSize || 'large'}
            onValueChange={(value) => onChange({ ...formData, avatarSize: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">{t('avatarSizes.small', 'Small - 64px')}</SelectItem>
              <SelectItem value="medium">{t('avatarSizes.medium', 'Medium - 96px')}</SelectItem>
              <SelectItem value="large">{t('avatarSizes.large', 'Large - 128px')}</SelectItem>
              <SelectItem value="xlarge">{t('avatarSizes.xlarge', 'Extra Large - 160px')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('fields.avatarPosition', 'Avatar Position')}</Label>
          <Select
            value={formData.avatarPosition || 'center'}
            onValueChange={(value) => onChange({ ...formData, avatarPosition: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">{t('fields.left', 'Left')}</SelectItem>
              <SelectItem value="center">{t('fields.center', 'Center')}</SelectItem>
              <SelectItem value="right">{t('fields.right', 'Right')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('fields.avatarFrame', 'Avatar Frame Style')}</Label>
          <Select
            value={formData.avatarFrame || 'default'}
            onValueChange={(value) => onChange({ ...formData, avatarFrame: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t('frames.default', 'Default')}</SelectItem>
              <SelectItem value="none">{t('frames.none', 'No Frame')}</SelectItem>
              <SelectItem value="solid">{t('frames.solid', 'Solid')}</SelectItem>
              <SelectItem value="gradient">{t('frames.gradient', 'Gradient')}</SelectItem>
              <SelectItem value="gradient-sunset">{t('frames.gradientSunset', 'Sunset')}</SelectItem>
              <SelectItem value="gradient-ocean">{t('frames.gradientOcean', 'Ocean')}</SelectItem>
              <SelectItem value="gradient-purple">{t('frames.gradientPurple', 'Purple')}</SelectItem>
              <SelectItem value="neon-blue">{t('frames.neonBlue', 'Neon Blue')}</SelectItem>
              <SelectItem value="neon-pink">{t('frames.neonPink', 'Neon Pink')}</SelectItem>
              <SelectItem value="neon-green">{t('frames.neonGreen', 'Neon Green')}</SelectItem>
              <SelectItem value="rainbow">{t('frames.rainbow', 'Rainbow')}</SelectItem>
              <SelectItem value="rainbow-spin">{t('frames.rainbowSpin', 'Rainbow Spin')}</SelectItem>
              <SelectItem value="double">{t('frames.double', 'Double')}</SelectItem>
              <SelectItem value="dashed">{t('frames.dashed', 'Dashed')}</SelectItem>
              <SelectItem value="dotted">{t('frames.dotted', 'Dotted')}</SelectItem>
              <SelectItem value="glow-pulse">{t('frames.glowPulse', 'Glow Pulse')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('fields.avatarIcon', 'Avatar Icon')}</Label>
          <Select
            value={formData.avatarIcon || ''}
            onValueChange={(value) => onChange({ ...formData, avatarIcon: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('fields.selectIcon', 'Select icon')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('icons.none', 'No Icon')}</SelectItem>
              <SelectItem value="crown">{t('icons.crown', 'Crown')}</SelectItem>
              <SelectItem value="star">{t('icons.star', 'Star')}</SelectItem>
              <SelectItem value="heart">{t('icons.heart', 'Heart')}</SelectItem>
              <SelectItem value="sparkles">{t('icons.sparkles', 'Sparkles')}</SelectItem>
              <SelectItem value="zap">{t('icons.zap', 'Zap')}</SelectItem>
              <SelectItem value="flame">{t('icons.flame', 'Flame')}</SelectItem>
              <SelectItem value="diamond">{t('icons.diamond', 'Diamond')}</SelectItem>
              <SelectItem value="gem">{t('icons.gem', 'Gem')}</SelectItem>
              <SelectItem value="trophy">{t('icons.trophy', 'Trophy')}</SelectItem>
              <SelectItem value="medal">{t('icons.medal', 'Medal')}</SelectItem>
              <SelectItem value="award">{t('icons.award', 'Award')}</SelectItem>
              <SelectItem value="badge-check">{t('icons.verified', 'Verified')}</SelectItem>
              <SelectItem value="shield-check">{t('icons.shield', 'Shield')}</SelectItem>
              <SelectItem value="rocket">{t('icons.rocket', 'Rocket')}</SelectItem>
              <SelectItem value="music">{t('icons.music', 'Music')}</SelectItem>
              <SelectItem value="camera">{t('icons.camera', 'Camera')}</SelectItem>
              <SelectItem value="palette">{t('icons.palette', 'Palette')}</SelectItem>
              <SelectItem value="code">{t('icons.code', 'Code')}</SelectItem>
              <SelectItem value="gamepad-2">{t('icons.gaming', 'Gaming')}</SelectItem>
              <SelectItem value="dumbbell">{t('icons.fitness', 'Fitness')}</SelectItem>
              <SelectItem value="utensils">{t('icons.food', 'Food')}</SelectItem>
              <SelectItem value="plane">{t('icons.travel', 'Travel')}</SelectItem>
              <SelectItem value="briefcase">{t('icons.business', 'Business')}</SelectItem>
              <SelectItem value="graduation-cap">{t('icons.education', 'Education')}</SelectItem>
              <SelectItem value="mic">{t('icons.podcast', 'Podcast')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('fields.shadowStyle', 'Shadow Style')}</Label>
          <Select
            value={formData.shadowStyle || 'soft'}
            onValueChange={(value) => onChange({ ...formData, shadowStyle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('shadows.none', 'No Shadow')}</SelectItem>
              <SelectItem value="soft">{t('shadows.soft', 'Soft Shadow')}</SelectItem>
              <SelectItem value="medium">{t('shadows.medium', 'Medium Shadow')}</SelectItem>
              <SelectItem value="strong">{t('shadows.strong', 'Strong Shadow')}</SelectItem>
              <SelectItem value="glow">{t('shadows.glow', 'Colored Glow')}</SelectItem>
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
        <Label htmlFor="verified" className="cursor-pointer">{t('fields.verified', 'Verified badge')}</Label>
      </div>
    </div>
  );
}

export const ProfileBlockEditor = withBlockEditor(ProfileBlockEditorComponent, {
  hint: 'Customize your profile with avatar, name, bio, cover image, animated frames, and shadow effects',
});
