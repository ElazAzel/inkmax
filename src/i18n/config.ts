import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './locales/ru.json';
import en from './locales/en.json';
import kk from './locales/kk.json';

// Custom language detector based on browser language and geolocation
const customLanguageDetector = {
  name: 'customDetector',
  lookup() {
    // Check if user manually selected language (stored in localStorage)
    const stored = localStorage.getItem('i18nextLng');
    if (stored) return stored;

    // Auto-detect from browser language
    const browserLang = navigator.language || navigator.languages?.[0] || '';
    
    // Map browser language codes to supported languages
    if (browserLang.startsWith('ru')) return 'ru';
    if (browserLang.startsWith('kk')) return 'kk';
    if (browserLang.startsWith('en')) return 'en';
    
    // Check for CIS region languages that should default to Russian
    const cisLanguages = ['uk', 'be', 'uz', 'kz', 'ky', 'tg', 'az', 'hy', 'ka'];
    const langCode = browserLang.substring(0, 2);
    if (cisLanguages.includes(langCode)) return 'ru';
    
    // Default to Russian for unrecognized languages
    return 'ru';
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem('i18nextLng', lng);
  }
};

const languageDetectorPlugin = new LanguageDetector();
languageDetectorPlugin.addDetector(customLanguageDetector);

i18n
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      kk: { translation: kk },
    },
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'customDetector'],
      caches: ['localStorage'],
    },
  });

export default i18n;
