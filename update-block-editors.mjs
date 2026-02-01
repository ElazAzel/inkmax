#!/usr/bin/env node
/**
 * Скрипт для обновления всех редакторов блоков для использования pageI18n
 * Добавляет pageI18n в функцию компонента и передаёт availableLanguages в MultilingualInput
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editorsToUpdate = [
  'SocialsBlockEditor.tsx',
  'AvatarBlockEditor.tsx',
  'FAQBlockEditor.tsx',
  'CountdownBlockEditor.tsx',
  'ButtonBlockEditor.tsx',
  'FormBlockEditor.tsx',
  'TestimonialBlockEditor.tsx',
  'BookingBlockEditor.tsx',
  'EventBlockEditor.tsx',
  'BeforeAfterBlockEditor.tsx',
  'VideoBlockEditor.tsx',
  'ProfileBlockEditor.tsx',
  'DownloadBlockEditor.tsx',
  'LinkBlockEditor.tsx',
  'CatalogBlockEditor.tsx',
  'CarouselBlockEditor.tsx',
  'PricingBlockEditor.tsx',
  'MessengerBlockEditor.tsx',
  'CustomCodeBlockEditor.tsx',
  'ImageBlockEditor.tsx',
  'NewsletterBlockEditor.tsx',
  'ScratchBlockEditor.tsx',
];

const editorsDir = path.join(__dirname, 'src/components/block-editors');

for (const editorFile of editorsToUpdate) {
  const filePath = path.join(editorsDir, editorFile);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${editorFile}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // 1. Добавляем импорт LANGUAGE_DEFINITIONS, если его нет
  if (!content.includes('LANGUAGE_DEFINITIONS')) {
    const importRegex = /import\s*{\s*migrateToMultilingual(.*?)}\s*from\s*['"]@\/lib\/i18n-helpers['"]/;
    const match = content.match(importRegex);
    if (match) {
      content = content.replace(
        importRegex,
        `import { migrateToMultilingual, LANGUAGE_DEFINITIONS$1 } from '@/lib/i18n-helpers'`
      );
    }
  }

  // 2. Находим функцию компонента и добавляем pageI18n в параметры
  // Паттерн: function ComponentName({ formData, onChange }: BaseBlockEditorProps)
  // или: function ComponentName({ formData, onChange, ... }: BaseBlockEditorProps)
  
  const componentFuncRegex = /function\s+\w+EditorComponent\s*\(\{\s*formData,\s*onChange\s*\}\s*:\s*BaseBlockEditorProps\)/;
  if (componentFuncRegex.test(content)) {
    content = content.replace(
      componentFuncRegex,
      (match) => {
        return match.replace(
          '{ formData, onChange }',
          '{ formData, onChange, pageI18n }'
        );
      }
    );
  } else if (!/pageI18n/.test(content)) {
    // Попробуем другой паттерн (может быть другое имя)
    const altRegex = /function\s+(\w+)\s*\(\{\s*([^}]*?)formData,\s*([^}]*?)onChange\s*([^}]*?)\}\s*:\s*BaseBlockEditorProps\)/;
    if (altRegex.test(content)) {
      content = content.replace(
        altRegex,
        (match) => {
          if (!match.includes('pageI18n')) {
            return match.replace(
              'onChange',
              'onChange, pageI18n'
            );
          }
          return match;
        }
      );
    }
  }

  // 3. Добавляем код создания availableLanguages после const { t } = useTranslation()
  if (!content.includes('availableLanguages')) {
    const translationRegex = /const\s*{\s*t\s*}\s*=\s*useTranslation\(\);/;
    if (translationRegex.test(content)) {
      const availableLangsCode = `\n  \n  // Derive available languages from pageI18n if available\n  const availableLanguages = pageI18n?.languages.map(code => ({\n    code,\n    name: LANGUAGE_DEFINITIONS[code]?.name || code,\n    flag: LANGUAGE_DEFINITIONS[code]?.flag,\n  }));`;
      
      content = content.replace(
        translationRegex,
        (match) => `${match}${availableLangsCode}`
      );
    }
  }

  // 4. Добавляем availableLanguages={availableLanguages} в все MultilingualInput компоненты
  if (!content.match(/MultilingualInput[\s\S]*availableLanguages/)) {
    // Найти все MultilingualInput с закрывающим слешом и добавить availableLanguages перед ним
    content = content.replace(
      /(<MultilingualInput\s+[^>]*?)(\s*\/?>)/g,
      (match, component, closing) => {
        if (match.includes('availableLanguages')) {
          return match; // Уже есть
        }
        // Если это закрывающая скобка, добавляем availableLanguages перед ней
        if (closing.includes('/>')) {
          return `${component}\n        availableLanguages={availableLanguages}\n      />`;
        }
        return match;
      }
    );
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated: ${editorFile}`);
  } else {
    console.log(`ℹ️  Skipped: ${editorFile} (already up to date or patterns not matched)`);
  }
}

console.log('\n✨ Block editors update completed!');
