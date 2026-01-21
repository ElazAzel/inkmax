import { test, expect } from '@playwright/test';

async function openLanguageMenu(page: Parameters<typeof test>[0]['page']) {
  await page.getByRole('button', { name: /Русский|English|Қазақша/ }).first().click();
}

async function switchLanguage(page: Parameters<typeof test>[0]['page'], languageLabel: string | RegExp) {
  await openLanguageMenu(page);
  await page.getByRole('menuitem', { name: languageLabel }).click();
}

async function resetLanguageToRu(page: Parameters<typeof test>[0]['page']) {
  await page.addInitScript(() => {
    window.localStorage.setItem('i18nextLng', 'ru');
  });
}

test.describe('Language switcher', () => {
  test('updates landing page copy', async ({ page }) => {
    await resetLanguageToRu(page);
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Создать' })).toBeVisible();

    await switchLanguage(page, 'English');
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();

    await switchLanguage(page, 'Қазақша');
    await expect(page.getByRole('button', { name: 'Жасау' })).toBeVisible();
  });

  test('updates pricing page copy', async ({ page }) => {
    await resetLanguageToRu(page);
    await page.goto('/pricing');

    await expect(page.getByRole('heading', { name: 'Тарифы' })).toBeVisible();

    await switchLanguage(page, 'English');
    await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible();

    await switchLanguage(page, 'Қазақша');
    await expect(page.getByRole('heading', { name: 'Тарифтер' })).toBeVisible();
  });

  test('updates alternatives page copy', async ({ page }) => {
    await resetLanguageToRu(page);
    await page.goto('/alternatives');

    await expect(page.getByText('Сравнение 2026')).toBeVisible();

    await switchLanguage(page, 'English');
    await expect(page.getByText('2026 Comparison')).toBeVisible();

    await switchLanguage(page, 'Қазақша');
    await expect(page.getByText('2026 салыстыру')).toBeVisible();
  });
});
