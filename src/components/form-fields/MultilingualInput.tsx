import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LANGUAGES, type MultilingualString, type SupportedLanguage } from '@/lib/i18n-helpers';

interface MultilingualInputProps {
  label: string;
  value: MultilingualString;
  onChange: (value: MultilingualString) => void;
  type?: 'input' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export function MultilingualInput({
  label,
  value,
  onChange,
  type = 'input',
  placeholder,
  required = false,
}: MultilingualInputProps) {
  const [activeTab, setActiveTab] = useState<SupportedLanguage>('ru');

  const handleChange = (lang: SupportedLanguage, text: string) => {
    onChange({
      ...value,
      [lang]: text,
    });
  };

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
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
            <InputComponent
              value={value[lang.code] || ''}
              onChange={(e) => handleChange(lang.code, e.target.value)}
              placeholder={placeholder ? `${placeholder} (${lang.name})` : undefined}
              className={type === 'textarea' ? 'min-h-[100px]' : ''}
            />
            {lang.code === 'ru' && required && (
              <p className="text-xs text-muted-foreground mt-1">
                Обязательное поле для русского языка
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
