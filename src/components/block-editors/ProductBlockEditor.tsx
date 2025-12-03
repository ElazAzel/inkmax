import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIButton } from '@/components/form-fields/AIButton';
import { CurrencySelect } from '@/components/form-fields/CurrencySelect';
import { generateSalesCopy } from '@/lib/ai-helpers';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateProductBlock } from '@/lib/block-validators';
import { MultilingualInput } from '@/components/form-fields/MultilingualInput';
import { migrateToMultilingual, getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';

function ProductBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const { t, i18n } = useTranslation();
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateCopy = async () => {
    const name = getTranslatedString(formData.name, i18n.language as SupportedLanguage);
    if (!name || !formData.price) return;
    
    setAiLoading(true);
    try {
      const description = await generateSalesCopy({
        productName: name,
        price: formData.price,
        currency: formData.currency || 'KZT',
      });
      // Set generated description for current language
      const currentDesc = migrateToMultilingual(formData.description);
      onChange({ 
        ...formData, 
        description: { 
          ...currentDesc, 
          [i18n.language]: description 
        } 
      });
    } finally {
      setAiLoading(false);
    }
  };

  const productName = getTranslatedString(formData.name, i18n.language as SupportedLanguage);

  return (
    <div className="space-y-4">
      <MultilingualInput
        label={t('fields.productName')}
        value={migrateToMultilingual(formData.name)}
        onChange={(value) => onChange({ ...formData, name: value })}
        placeholder="Product Name"
        required
      />
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>{t('fields.price')}</Label>
          <Input
            type="number"
            value={formData.price || ''}
            onChange={(e) => onChange({ ...formData, price: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <Label>{t('fields.currency')}</Label>
          <CurrencySelect
            value={formData.currency || 'KZT'}
            onValueChange={(value) => onChange({ ...formData, currency: value })}
          />
        </div>
      </div>
      
      <div>
        <MultilingualInput
          label={t('fields.description')}
          value={migrateToMultilingual(formData.description)}
          onChange={(value) => onChange({ ...formData, description: value })}
          type="textarea"
          placeholder="Product description..."
        />
        <div className="mt-2">
          <AIButton
            onClick={handleGenerateCopy}
            loading={aiLoading}
            disabled={!productName || !formData.price}
            variant="full"
            title={t('ai.generateDescription', 'Generate with AI')}
          />
        </div>
      </div>
      
      <div>
        <Label>{t('fields.imageUrl')} {t('fields.optional')}</Label>
        <Input
          type="url"
          value={formData.image || ''}
          onChange={(e) => onChange({ ...formData, image: e.target.value })}
        />
      </div>
      
      <div>
        <Label>{t('fields.buyLink')} {t('fields.optional')}</Label>
        <Input
          type="url"
          value={formData.buyLink || ''}
          onChange={(e) => onChange({ ...formData, buyLink: e.target.value })}
        />
      </div>

      <div>
        <Label>{t('fields.alignment')}</Label>
        <Select
          value={formData.alignment || 'center'}
          onValueChange={(value) => onChange({ ...formData, alignment: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">{t('fields.left')}</SelectItem>
            <SelectItem value="center">{t('fields.center')}</SelectItem>
            <SelectItem value="right">{t('fields.right')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export const ProductBlockEditor = withBlockEditor(ProductBlockEditorComponent, {
  hint: 'Create a product showcase with pricing and buy link',
  validate: validateProductBlock,
});
