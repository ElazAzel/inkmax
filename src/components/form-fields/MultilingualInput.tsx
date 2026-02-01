import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';
import { LANGUAGE_DEFINITIONS, isI18nText, toI18nText, type MultilingualString, type I18nText } from '@/lib/i18n-helpers';
import { supabase } from '@/platform/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { RichTextEditor } from './RichTextEditor';

interface LanguageDef { code: string; name: string; flag?: string }

interface MultilingualInputProps {
  label: string;
  // Accept legacy MultilingualString or arbitrary I18nText
  value: MultilingualString | I18nText | Record<string, string | undefined>;
  onChange: (value: Record<string, string | undefined>) => void;
  type?: 'input' | 'textarea';
  placeholder?: string;
  required?: boolean;
  enableRichText?: boolean;
  // Optional override of available languages for tabs (page-level languages)
  availableLanguages?: LanguageDef[];
}

export function MultilingualInput({
  label,
  value,
  onChange,
  type = 'input',
  placeholder,
  required = false,
  enableRichText = false,
  availableLanguages,
}: MultilingualInputProps) {
  const { t } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  // Normalize incoming value to I18n-like object
  const normalized = useMemo(() => toI18nText(value, 'ru'), [value]);

  const langs: LanguageDef[] = useMemo(() => {
    if (availableLanguages && availableLanguages.length) return availableLanguages;
    // Use keys from value first (preserve order), otherwise fall back to known definitions
    const keys = Object.keys(normalized);
    if (keys.length) return keys.map(k => ({ code: k, name: LANGUAGE_DEFINITIONS[k]?.name || k, flag: LANGUAGE_DEFINITIONS[k]?.flag }));
    // Default to common RU/EN/KK
    return [
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
    ];
  }, [availableLanguages, normalized]);

  const [activeTab, setActiveTab] = useState<string>(() => langs[0]?.code || 'ru');

  const handleChange = (lang: string, text: string) => {
    onChange({
      ...normalized,
      [lang]: text,
    });
  };

  const handleTranslate = async () => {
    const sourceText = normalized[activeTab];
    if (!sourceText?.trim()) {
      toast.error(t('ai.noTextToTranslate', 'Введите текст для перевода'));
      return;
    }

    setIsTranslating(true);
    try {
      const targetCodes = langs.filter(l => l.code !== activeTab).map(l => l.code);

      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: {
          text: sourceText,
          sourceLanguage: activeTab,
          targetLanguages: targetCodes,
        },
      });

      if (error) throw error;

      onChange({
        ...normalized,
        ...data.translations,
      });

      toast.success(t('ai.translationSuccess', 'Перевод выполнен'));
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(t('ai.translationError', 'Ошибка перевода'));
    } finally {
      setIsTranslating(false);
    }
  };

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleTranslate}
          disabled={isTranslating || !value[activeTab]?.trim()}
          className="h-7 px-2 text-xs gap-1.5"
          title={t('ai.translateToOthers', 'Перевести на другие языки')}
        >
          {isTranslating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Languages className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{t('ai.translate', 'Перевести')}</span>
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as SupportedLanguage)}>
        <TabsList className="grid w-full grid-cols-3">
          {LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code} className="gap-1.5">
              <span>{lang.flag}</span>
              <span className="hidden sm:inline">{lang.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="mt-2">
            {enableRichText ? (
              <RichTextEditor
                value={value[lang.code] || ''}
                onChange={(text) => handleChange(lang.code, text)}
                placeholder={placeholder ? `${placeholder} (${lang.name})` : undefined}
                type={type}
              />
            ) : (
              <InputComponent
                value={value[lang.code] || ''}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                placeholder={placeholder ? `${placeholder} (${lang.name})` : undefined}
                className={type === 'textarea' ? 'min-h-[100px]' : ''}
              />
            )}
            {lang.code === 'ru' && required && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('fields.requiredRussian', 'Обязательное поле для русского языка')}
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
      {enableRichText && (
        <p className="text-xs text-muted-foreground">
          {t('hints.richTextVisual', 'Используйте кнопку 🔗 для добавления ссылок. Переносы строк сохраняются.')}
        </p>
      )}
    </div>
  );
}
