import { Button } from '@/components/ui/button';
import { Languages, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toI18nText, type I18nText } from '@/lib/i18n-helpers';
import { type PageI18nConfig } from '@/domain/entities/Page';
import { toast } from 'sonner';

interface StringToMultilingualButtonProps {
  value: string;
  onChange: (value: Record<string, string | undefined>) => void;
  pageI18n?: PageI18nConfig;
  className?: string;
}

/**
 * Button that converts a plain string field into multilingual I18nText
 * The string value is copied to all language variants
 * Used when a field transitions from single-language to multilingual
 */
export function StringToMultilingualButton({
  value,
  onChange,
  pageI18n,
  className,
}: StringToMultilingualButtonProps) {
  const { t } = useTranslation();

  const handleConvert = () => {
    if (!value || !value.trim()) {
      toast.error(t('errors.emptyField', 'Поле не должно быть пустым'));
      return;
    }

    // Convert string to I18nText - copies the string to all page languages
    const defaultLang = pageI18n?.defaultLanguage || 'ru';
    const i18nValue = toI18nText(value, defaultLang);

    // Copy the string to all configured languages (not just the default)
    if (pageI18n?.languages) {
      for (const lang of pageI18n.languages) {
        if (!i18nValue[lang]) {
          i18nValue[lang] = value;
        }
      }
    }

    onChange(i18nValue);
    toast.success(t('messages.fieldConverted', 'Поле преобразовано в многоязычное'));
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleConvert}
      className={className}
      title={t('fields.makeMultilingual', 'Сделать многоязычным')}
    >
      <Languages className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">{t('fields.makeMultilingual', 'Многоязычным')}</span>
      <Wand2 className="h-4 w-4 sm:hidden" />
    </Button>
  );
}
