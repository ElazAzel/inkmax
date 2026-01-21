import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, '../src/i18n/locales');
const languages = ['ru', 'en', 'kk'];

function collectKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...collectKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const locales = {};
for (const lang of languages) {
  const filePath = path.join(localesDir, `${lang}.json`);
  const raw = await readFile(filePath, 'utf-8');
  locales[lang] = JSON.parse(raw);
}

const allKeys = new Set();
const langKeys = {};
for (const lang of languages) {
  const keys = collectKeys(locales[lang]);
  langKeys[lang] = keys;
  keys.forEach((key) => allKeys.add(key));
}

let hasMissing = false;
for (const lang of languages) {
  const missing = Array.from(allKeys).filter((key) => !langKeys[lang].includes(key));
  if (missing.length > 0) {
    hasMissing = true;
    console.error(`\nMissing ${missing.length} keys in ${lang}.json:`);
    missing.forEach((key) => console.error(`  - ${key}`));
  }
}

if (hasMissing) {
  console.error('\n❌ i18n check failed: missing keys detected.');
  process.exit(1);
} else {
  console.log('✅ i18n check passed: all locale keys are aligned.');
}
