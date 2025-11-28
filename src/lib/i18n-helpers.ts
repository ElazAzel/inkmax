export type SupportedLanguage = 'ru' | 'en' | 'kk';

export type MultilingualString = {
  [key in SupportedLanguage]?: string;
};

export const LANGUAGES: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
];

/**
 * Get translated string for current language with fallback
 */
export function getTranslatedString(
  value: string | MultilingualString | undefined,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'ru'
): string {
  if (!value) return '';
  
  // If it's a plain string, return it
  if (typeof value === 'string') return value;
  
  // If it's a multilingual object, get the translation
  return value[language] || value[fallbackLanguage] || value.ru || Object.values(value)[0] || '';
}

/**
 * Create empty multilingual string
 */
export function createMultilingualString(initialValue = ''): MultilingualString {
  return {
    ru: initialValue,
    en: '',
    kk: '',
  };
}

/**
 * Check if value is multilingual
 */
export function isMultilingualString(value: any): value is MultilingualString {
  return value && typeof value === 'object' && ('ru' in value || 'en' in value || 'kk' in value);
}

/**
 * Convert old string to multilingual format
 */
export function migrateToMultilingual(value: string | MultilingualString | undefined): MultilingualString {
  if (!value) return createMultilingualString();
  if (isMultilingualString(value)) return value;
  return { ru: value, en: '', kk: '' };
}
