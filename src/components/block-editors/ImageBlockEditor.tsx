import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaUpload } from '@/components/form-fields/MediaUpload';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { migrateToMultilingual, LANGUAGE_DEFINITIONS  } from '@/lib/i18n-helpers';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateImageBlock } from '@/lib/block-validators';
import { useTranslation } from 'react-i18next';

function ImageBlockEditorComponent({ formData, onChange, pageI18n }: BaseBlockEditorProps) {
  const { t } = useTranslation();
  
  // Derive available languages from pageI18n if available
  const availableLanguages = pageI18n?.languages.map(code => ({
    code,
    name: LANGUAGE_DEFINITIONS[code]?.name || code,
    flag: LANGUAGE_DEFINITIONS[code]?.flag,
  }));
  
  return (
    <div className="space-y-4">
      <MediaUpload
        label={t('fields.imageUrl', 'Image')}
        value={formData.url || ''}
        onChange={(url) => onChange({ ...formData, url })}
        accept="image/*"
      />

      <div>
        <Label>{t('fields.link', 'Link URL')} ({t('fields.optional', 'optional')})</Label>
        <Input
          type="url"
          value={formData.link || ''}
          onChange={(e) => onChange({ ...formData, link: e.target.value })}
          placeholder="https://example.com"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t('fields.linkHint', 'Add a link to make the image clickable')}
        </p>
      </div>

      <MultilingualInput
        label={t('fields.altText', 'Alt Text')}
        value={migrateToMultilingual(formData.alt)}
        onChange={(value) => onChange({ ...formData, alt: value })}
        placeholder={t('fields.altPlaceholder', 'Image description for accessibility')}
      />

      <MultilingualInput
        label={`${t('fields.caption', 'Caption')} (${t('fields.optional', 'optional')})`}
        value={migrateToMultilingual(formData.caption)}
        onChange={(value) => onChange({ ...formData, caption: value })}
        type="textarea"
        placeholder={t('fields.captionPlaceholder', 'Add a caption for your image...')}
      />

      <div>
        <Label>{t('fields.imageStyle', 'Image Style')}</Label>
        <Select
          value={formData.style || 'default'}
          onValueChange={(value) => onChange({ ...formData, style: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{t('imageStyles.default', 'Default - Rounded Corners')}</SelectItem>
            <SelectItem value="banner">{t('imageStyles.banner', 'Banner - Full Width')}</SelectItem>
            <SelectItem value="polaroid">{t('imageStyles.polaroid', 'Polaroid - Vintage Frame')}</SelectItem>
            <SelectItem value="vignette">{t('imageStyles.vignette', 'Vignette - Soft Edges')}</SelectItem>
            <SelectItem value="circle">{t('imageStyles.circle', 'Circle - Round Crop')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>{t('fields.alignment', 'Alignment')}</Label>
        <Select
          value={formData.alignment || 'center'}
          onValueChange={(value) => onChange({ ...formData, alignment: value })}
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
    </div>
  );
}

export const ImageBlockEditor = withBlockEditor(ImageBlockEditorComponent, {
  hint: 'Add images with different styles: Banner (full width), Polaroid, Vignette, Circle, or Default. Add a link to make the image clickable.',
  validate: validateImageBlock,
});