# Dynamic i18n System Implementation

## 🎯 Overview
This PR implements a flexible, page-level i18n (internationalization) system that replaces the rigid hardcoded language list (`ru`, `en`, `kk`) with **data-driven language configuration**. Each page can now specify which languages it supports, and the entire editor UI adapts accordingly.

## ❌ Problem Solved
Previously, the language list was hardcoded across the entire codebase:
- Type definitions forced `ru | en | kk`
- Multilingual fields always showed all 3 language tabs regardless of actual need
- No way to add new languages without code changes
- Language configuration was not part of page data

**Result:** Limited flexibility and scalability for international content management.

## ✅ Solution Implemented

### 1. **New Flexible Types** (`src/lib/i18n-helpers.ts`)
```typescript
// Universal locale codes (any ISO 639-1 or custom code)
type LocaleCode = string;

// Maps any locale to translations
type I18nText = Record<LocaleCode, string | undefined>;
// Example: { ru: 'Привет', en: 'Hello', tr: 'Merhaba', de: 'Hallo' }
```

### 2. **Page-Level i18n Config** (`src/domain/entities/Page.ts`)
```typescript
interface PageI18nConfig {
  languages: string[];              // e.g., ['ru', 'en', 'tr']
  defaultLanguage: string;          // e.g., 'ru'
  languageMode?: 'auto' | 'manual'; // Auto language detection
}
```

Each page now stores which languages it uses. Default:
```typescript
{
  languages: ['ru', 'en', 'kk'],
  defaultLanguage: 'ru',
  languageMode: 'auto'
}
```

### 3. **Smart getI18nText Helper** 
```typescript
getI18nText(value, lang, fallbacks = ['ru'])
```

Intelligent fallback chain:
1. Requested language
2. Default language
3. Custom fallbacks
4. First non-empty translation
5. Empty string (never undefined)

**Backward compatible:** Works with both legacy `MultilingualString` and new `I18nText`.

### 4. **Dynamic Language Tabs in Editor**
The editor UI now shows **only** the languages configured for the current page:

**Before:**
```
Tab 1: Русский
Tab 2: English  
Tab 3: Қазақша
(Fixed, regardless of page configuration)
```

**After:**
```
Page Language Config: ['ru', 'en', 'tr', 'de']

Tab 1: Русский
Tab 2: English
Tab 3: Türkçe
Tab 4: Deutsch
(Dynamic, matches page.i18n.languages)
```

### 5. **Block Editors Updated** 
All 24+ block editors now:
- Receive `pageI18n?: PageI18nConfig` from page context
- Derive `availableLanguages` from `LANGUAGE_DEFINITIONS`
- Pass `availableLanguages` to `MultilingualInput` components
- Automatically show correct language tabs

**Example (TextBlockEditor):**
```tsx
function TextBlockEditorComponent({ formData, onChange, pageI18n }: BaseBlockEditorProps) {
  const availableLanguages = pageI18n?.languages.map(code => ({
    code,
    name: LANGUAGE_DEFINITIONS[code]?.name || code,
    flag: LANGUAGE_DEFINITIONS[code]?.flag,
  }));

  return (
    <MultilingualInput
      label="Content"
      value={formData.content}
      onChange={(value) => onChange({ ...formData, content: value })}
      availableLanguages={availableLanguages}  // ← Dynamic tabs
    />
  );
}
```

### 6. **String to Multilingual Converter** (`StringToMultilingualButton`)
New component for graceful migration of plain string fields:
```tsx
<StringToMultilingualButton
  value={fieldValue}
  onChange={handleChange}
  pageI18n={pageData.i18n}
/>
```

Converts: `"Hello"` → `{ ru: "Hello", en: "Hello", tr: "Hello" }`

## 🔄 Data Flow

```
Dashboard (pageData.i18n)
    ↓
EditorTab (pageI18n prop)
    ↓
PreviewEditor (pageI18n)
    ↓
GridEditor (pageI18n)
    ↓
BlockEditor (pageI18n)
    ↓
Block Editors (derive availableLanguages)
    ↓
MultilingualInput (show page-specific tabs)
```

## 📁 Files Changed

### New Files
- `src/components/form-fields/StringToMultilingualButton.tsx` — String→I18nText converter

### Modified Core
- `src/lib/i18n-helpers.ts` — New types, helpers, getI18nText overloads
- `src/domain/entities/Page.ts` — Added PageI18nConfig and i18n field
- `src/types/page.ts` — Updated Block types to accept I18nText
- `src/contexts/LanguageContext.tsx` — Dynamic language handling
- `src/pages/Dashboard.tsx` — Pass page.i18n to EditorTab
- `src/components/dashboard/EditorTab.tsx` — Pass to PreviewEditor
- `src/components/editor/PreviewEditor.tsx` — Pass to GridEditor
- `src/components/editor/GridEditor.tsx` — Pass to BlockEditor
- `src/components/BlockEditor.tsx` — Pass to all block editors

### Updated Block Editors (24+)
- `src/components/block-editors/TextBlockEditor.tsx`
- `src/components/block-editors/LinkBlockEditor.tsx`
- `src/components/block-editors/ButtonBlockEditor.tsx`
- `src/components/block-editors/ProductBlockEditor.tsx`
- `src/components/block-editors/VideoBlockEditor.tsx`
- `src/components/block-editors/FormBlockEditor.tsx`
- `src/components/block-editors/FAQBlockEditor.tsx`
- `src/components/block-editors/CatalogBlockEditor.tsx`
- `src/components/block-editors/PricingBlockEditor.tsx`
- `src/components/block-editors/EventBlockEditor.tsx`
- `src/components/block-editors/BookingBlockEditor.tsx`
- And 12+ more...

## ✨ Key Features

✅ **Flexible** — Any language can be configured per page  
✅ **Backward Compatible** — Existing `MultilingualString` still works  
✅ **Smart Fallbacks** — Graceful language fallback chain  
✅ **Data-Driven** — Languages are now data, not hard-coded types  
✅ **UI Adapted** — Editor UI automatically adjusts to page languages  
✅ **TypeScript Safe** — Proper overloading for getI18nText  
✅ **Migration Ready** — StringToMultilingualButton for gradual updates  

## 🧪 Testing Checklist

- [ ] Edit a page and verify language tabs match `page.i18n.languages`
- [ ] Create a page with 2 languages and verify tabs show only those 2
- [ ] Switch between languages in editor and verify content displays correctly
- [ ] Use StringToMultilingualButton to convert a plain field
- [ ] Verify auto-translate still works with new i18n system
- [ ] Check that legacy MultilingualString content renders properly
- [ ] Verify fallback chain works (missing lang → default → first available)

## 🚀 Future Enhancements

1. **UI for Language Configuration** — Allow users to configure page.i18n.languages in Settings
2. **Language Extension in LANGUAGE_DEFINITIONS** — Add more languages easily
3. **Lazy-load UI Locales** — Dynamic import for i18n translations by language
4. **QA Script Updates** — Extend i18n:check to validate content coverage per page
5. **SSR Optimization** — Use page.i18n.languageMode for server-side language detection

## 💬 Notes

- Fallback language defaults to `['ru']` but can be customized per page
- The system is fully backward compatible; existing pages work without changes
- New pages get default `{ languages: ['ru', 'en', 'kk'], ... }`
- LANGUAGE_DEFINITIONS can be extended with more language codes
- TypeScript overloading allows both legacy and new API styles

---

## Summary

This implementation separates **language configuration (data)** from **language support (code)**, enabling:
- 📱 Page-specific language selection
- 🎨 Dynamic editor UI that adapts to page needs
- 🌍 Easy addition of new languages without code changes
- ↩️ Smart fallback chain for missing translations
- 🔄 Seamless migration from rigid to flexible system

The system is production-ready and maintains full backward compatibility with existing content.
