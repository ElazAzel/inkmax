// ============= LEGACY: Backward Compatibility =============
export type SupportedLanguage = 'ru' | 'en' | 'kk';

export type MultilingualString = {
  [key in SupportedLanguage]?: string;
};

export const LANGUAGES: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
];

// ============= NEW: Flexible i18n System =============
/**
 * Universal locale code - any ISO 639-1 or custom code
 * Examples: 'ru', 'en', 'kk', 'tr', 'de', 'fr', 'zh', 'ar', 'uz', etc.
 */
export type LocaleCode = string;

/**
 * Universal i18n text type - maps any locale to its translation
 * Replaces the rigid MultilingualString { ru?, en?, kk? } pattern
 * Example: { ru: 'Привет', en: 'Hello', tr: 'Merhaba', de: 'Hallo' }
 */
export type I18nText = Record<LocaleCode, string | undefined>;

/**
 * Available language definitions for UI (can be extended)
 * This replaces the hard-coded LANGUAGES array
 */
export const LANGUAGE_DEFINITIONS: Record<LocaleCode, { name: string; flag: string }> = {
  ru: { name: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', flag: '🇬🇧' },
  kk: { name: 'Қазақша', flag: '🇰🇿' },
  // Easy to extend with more languages:
  // tr: { name: 'Türkçe', flag: '🇹🇷' },
  // de: { name: 'Deutsch', flag: '🇩🇪' },
  // uz: { name: "O'zbekcha", flag: '🇺🇿' },
};

/**
 * NEW: Get i18n text with smart fallback chain
 * Unified function for both I18nText and legacy MultilingualString
 *
 * Overloaded signatures:
 * 1. For new flexible i18n system: getI18nText(value, lang, fallbacks?)
 * 2. For legacy MultilingualString: getI18nText(value, language, fallbackLanguage?)
 *
 * Fallback order:
 * 1. Requested language
 * 2. Default language (usually page.default_language)
 * 3. Custom fallbacks array (usually ['ru'])
 * 4. First non-empty translation
 * 5. Empty string
 *
 * @returns translated string or empty string (never undefined)
 */

// Overload signatures
export function getI18nText(
  value: string | I18nText | MultilingualString | undefined | null,
  lang: string,
  fallbacks?: string[]
): string;
export function getI18nText(
  value: string | MultilingualString | undefined,
  language: SupportedLanguage,
  fallbackLanguage?: SupportedLanguage
): string;

// Implementation
export function getI18nText(
  value: string | I18nText | MultilingualString | undefined | null,
  lang: string,
  fallbacksOrFallbackLanguage: string[] | string = ['ru']
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;

  // Determine if we're using new or legacy API
  const isLegacy = typeof fallbacksOrFallbackLanguage === 'string';
  const fallbacks = isLegacy ? [fallbacksOrFallbackLanguage as string] : (fallbacksOrFallbackLanguage as string[]);

  // Build the chain: requested lang -> fallbacks -> first non-empty
  const chain = [lang, ...fallbacks];
  
  for (const locale of chain) {
    const translation = value[locale];
    if (translation && translation.trim()) return translation;
  }

  // For legacy API, add additional fallback chain
  if (isLegacy) {
    if (value.ru && value.ru.trim() !== '') return value.ru;
    if (value.en && value.en.trim() !== '') return value.en;
    if (value.kk && value.kk.trim() !== '') return value.kk;
  }

  // Last resort: first non-empty translation
  const any = Object.values(value).find(v => v && v.trim());
  return any ?? '';
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
 * Check if value is multilingual (I18nText or legacy MultilingualString)
 * Checks if value is object with at least one string property
 */
export function isI18nText(value: any): value is I18nText | MultilingualString {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value).some(v => typeof v === 'string' && v)
  );
}

/**
 * LEGACY: Check if value is multilingual
 * @deprecated Use isI18nText() instead
 */
export function isMultilingualString(value: any): value is MultilingualString {
  return value && typeof value === 'object' && ('ru' in value || 'en' in value || 'kk' in value);
}

/**
 * Ensure value is I18nText format (or legacy MultilingualString)
 * If it's a plain string, convert it to { [defaultLang]: value }
 */
export function ensureI18nText(
  value: string | I18nText | MultilingualString | undefined | null,
  defaultLang: string = 'ru'
): I18nText {
  if (!value) return {};
  if (typeof value === 'string') return { [defaultLang]: value };
  return value as I18nText;
}

/**
 * Convert string | I18nText to I18nText
 * Used when migrating old fields to multilingual
 * If already I18nText, returns as-is
 * If string, wraps in { [defaultLang]: value }
 */
export function toI18nText(
  value: string | I18nText | MultilingualString | undefined | null,
  defaultLang: string = 'ru'
): I18nText {
  return ensureI18nText(value, defaultLang);
}

/**
 * Create empty i18n text object
 * @param locales - languages to initialize (default: ['ru', 'en', 'kk'])
 */
export function createEmptyI18nText(locales: string[] = ['ru', 'en', 'kk']): I18nText {
  const result: I18nText = {};
  for (const locale of locales) {
    result[locale] = '';
  }
  return result;
}

/**
 * LEGACY: Convert old string to multilingual format
 * @deprecated Use toI18nText() or ensureI18nText()
 */
export function migrateToMultilingual(value: string | MultilingualString | undefined): MultilingualString {
  if (!value) return createMultilingualString();
  if (isMultilingualString(value)) return value;
  // Put the original value in all language fields so it shows regardless of selected language
  return { ru: value, en: value, kk: value };
}

/**
 * Parse a database field that might be JSON (MultilingualString) or plain string
 * Used when fetching data from Supabase where title/description could be stored as JSON
 */
export function parseMultilingualField(
  value: string | null | undefined,
  language: SupportedLanguage,
  fallbackLanguage: SupportedLanguage = 'ru'
): string {
  if (!value) return '';
  
  // Try to parse as JSON if it looks like JSON
  if (value.startsWith('{') && value.endsWith('}')) {
    try {
      const parsed = JSON.parse(value);
      if (isMultilingualString(parsed)) {
        return getI18nText(parsed, language, fallbackLanguage);
      }
    } catch {
      // Not valid JSON, return as plain string
    }
  }
  
  return value;
}
