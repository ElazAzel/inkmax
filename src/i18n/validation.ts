import ru from './locales/ru.json';
import en from './locales/en.json';
import kk from './locales/kk.json';

type TranslationObject = Record<string, unknown>;

/**
 * Recursively extracts all keys from a nested object
 */
function getAllKeys(obj: TranslationObject, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as TranslationObject, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Finds missing keys in a translation file compared to the reference
 */
function findMissingKeys(reference: string[], target: string[]): string[] {
  const targetSet = new Set(target);
  return reference.filter(key => !targetSet.has(key));
}

/**
 * Validates all translation files and logs missing keys
 */
export function validateTranslations(): void {
  if (!import.meta.env.DEV) return;

  console.group('🌐 [i18n] Translation Validation');
  
  const translations = {
    ru: getAllKeys(ru as TranslationObject),
    en: getAllKeys(en as TranslationObject),
    kk: getAllKeys(kk as TranslationObject),
  };

  // Get all unique keys from all languages
  const allKeys = new Set<string>();
  Object.values(translations).forEach(keys => {
    keys.forEach(key => allKeys.add(key));
  });

  const totalKeys = allKeys.size;
  console.log(`📊 Total unique keys: ${totalKeys}`);

  // Check each language
  const languages = ['ru', 'en', 'kk'] as const;
  let hasIssues = false;

  languages.forEach(lang => {
    const langKeys = translations[lang];
    const missingFromLang = Array.from(allKeys).filter(key => !langKeys.includes(key));
    
    if (missingFromLang.length > 0) {
      hasIssues = true;
      console.group(`❌ Missing in ${lang.toUpperCase()} (${missingFromLang.length} keys):`);
      missingFromLang.forEach(key => console.warn(`  • ${key}`));
      console.groupEnd();
    } else {
      console.log(`✅ ${lang.toUpperCase()}: All ${langKeys.length} keys present`);
    }
  });

  // Show keys that exist in some languages but not others
  console.group('📋 Coverage by language:');
  languages.forEach(lang => {
    const count = translations[lang].length;
    const percentage = ((count / totalKeys) * 100).toFixed(1);
    console.log(`  ${lang.toUpperCase()}: ${count}/${totalKeys} (${percentage}%)`);
  });
  console.groupEnd();

  if (!hasIssues) {
    console.log('🎉 All translations are complete!');
  }

  console.groupEnd();
}

/**
 * Export for programmatic access
 */
export function getMissingTranslations(): Record<string, string[]> {
  const translations = {
    ru: getAllKeys(ru as TranslationObject),
    en: getAllKeys(en as TranslationObject),
    kk: getAllKeys(kk as TranslationObject),
  };

  const allKeys = new Set<string>();
  Object.values(translations).forEach(keys => {
    keys.forEach(key => allKeys.add(key));
  });

  return {
    ru: Array.from(allKeys).filter(key => !translations.ru.includes(key)),
    en: Array.from(allKeys).filter(key => !translations.en.includes(key)),
    kk: Array.from(allKeys).filter(key => !translations.kk.includes(key)),
  };
}
