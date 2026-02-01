import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateNewsletterBlock } from '@/lib/block-validators';
import { useTranslation } from 'react-i18next';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { migrateToMultilingual, LANGUAGE_DEFINITIONS  } from '@/lib/i18n-helpers';

function NewsletterBlockEditorComponent({ formData, onChange, pageI18n }: BaseBlockEditorProps) {
  const { t } = useTranslation();
  
  // Derive available languages from pageI18n if available
  const availableLanguages = pageI18n?.languages.map(code => ({
    code,
    name: LANGUAGE_DEFINITIONS[code]?.name || code,
    flag: LANGUAGE_DEFINITIONS[code]?.flag,
  }));

  return (
    <div className="space-y-4">
      <MultilingualInput
        label={t('fields.title', 'Title')}
        value={migrateToMultilingual(formData.title)}
        onChange={(value) => onChange({ ...formData, title: value })}
        placeholder="Subscribe to Newsletter"
      />

      <MultilingualInput
        label={`${t('fields.description', 'Description')} (${t('fields.optional', 'optional')})`}
        value={migrateToMultilingual(formData.description)}
        onChange={(value) => onChange({ ...formData, description: value })}
        type="textarea"
        placeholder="Get the latest updates delivered to your inbox"
      />

      <MultilingualInput
        label={t('fields.buttonText', 'Button Text')}
        value={migrateToMultilingual(formData.buttonText)}
        onChange={(value) => onChange({ ...formData, buttonText: value })}
        placeholder="Subscribe"
      />
    </div>
  );
}

export const NewsletterBlockEditor = withBlockEditor(NewsletterBlockEditorComponent, {
  hint: 'Add email newsletter subscription form',
  validate: validateNewsletterBlock,
  isPremium: true,
  description: 'Build your mailing list with newsletter subscription',
});
