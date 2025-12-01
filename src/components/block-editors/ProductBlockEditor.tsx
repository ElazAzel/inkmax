import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIButton } from '@/components/form-fields/AIButton';
import { CurrencySelect } from '@/components/form-fields/CurrencySelect';
import { generateSalesCopy } from '@/lib/ai-helpers';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateProductBlock } from '@/lib/block-validators';

function ProductBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const { t } = useTranslation();
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateCopy = async () => {
    if (!formData.name || !formData.price) return;
    
    setAiLoading(true);
    try {
      const description = await generateSalesCopy({
        productName: formData.name,
        price: formData.price,
        currency: formData.currency || 'KZT',
      });
      onChange({ ...formData, description });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{t('fields.productName')}</Label>
        <Input
          value={formData.name || ''}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
        />
      </div>
      
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
        <Label>{t('fields.description')}</Label>
        <div className="space-y-2">
          <Textarea
            value={formData.description || ''}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            rows={3}
          />
          <AIButton
            onClick={handleGenerateCopy}
            loading={aiLoading}
            disabled={!formData.name || !formData.price}
            variant="full"
            title="Generate with AI"
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
