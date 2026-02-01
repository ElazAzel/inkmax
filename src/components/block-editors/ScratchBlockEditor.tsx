import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateScratchBlock } from '@/lib/block-validators';
import { useTranslation } from 'react-i18next';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { migrateToMultilingual, LANGUAGE_DEFINITIONS  } from '@/lib/i18n-helpers';

function ScratchBlockEditorComponent({ formData, onChange, pageI18n }: BaseBlockEditorProps) {
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
        label={`${t('fields.title', 'Title')} (${t('fields.optional', 'optional')})`}
        value={migrateToMultilingual(formData.title)}
        onChange={(value) => onChange({ ...formData, title: value })}
        placeholder="Scratch to Reveal"
      />

      <MultilingualInput
        label={t('fields.hiddenText', 'Hidden Text/Prize')}
        value={migrateToMultilingual(formData.revealText)}
        onChange={(value) => onChange({ ...formData, revealText: value })}
        type="textarea"
        placeholder="🎉 You won 20% discount!"
      />

      <div>
        <Label>{t('fields.backgroundColor', 'Background Color')} ({t('fields.optional', 'optional')})</Label>
        <Input
          type="color"
          value={formData.backgroundColor || '#C0C0C0'}
          onChange={(e) => onChange({ ...formData, backgroundColor: e.target.value })}
        />
      </div>
    </div>
  );
}

export const ScratchBlockEditor = withBlockEditor(ScratchBlockEditorComponent, {
  hint: 'Create an interactive scratch card with hidden text/prizes',
  validate: validateScratchBlock,
  isPremium: true,
  description: 'Engage visitors with a gamified scratch-to-reveal experience',
});
