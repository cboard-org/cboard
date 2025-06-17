import { test, expect } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Symbols Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Symbols tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Symbols');
  });

  test('should display symbols settings dialog', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Symbols' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });

  test('should show ARASAAC symbols download section', async ({ page }) => {
    await expect(page.locator('text=Download ARASAAC Symbols')).toBeVisible();
    await expect(
      page.locator(
        'text=Downloads a package with all ARASAAC Symbols to be used in offline mode.'
      )
    ).toBeVisible();
  });

  test('should show download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
  });

  test('should explain offline benefits', async ({ page }) => {
    await expect(
      page.locator(
        "text=Symbols download will allow you to have the symbols locally in your system so when you search for symbols to create a new element, you don't need an Internet connection."
      )
    ).toBeVisible();
  });

  test('should allow ARASAAC symbols download', async ({ page }) => {
    // Click download button
    await page.getByRole('button', { name: 'Download' }).click();

    // This should initiate the download process
    // Note: Download testing might require special handling
  });

  test('should emphasize offline capability', async ({ page }) => {
    // Verify offline benefits are clearly explained
    await expect(page.locator('text=to be used in offline mode')).toBeVisible();
    await expect(
      page.locator("text=you don't need an Internet connection")
    ).toBeVisible();
  });

  test('should explain symbol usage context', async ({ page }) => {
    // Verify explanation about when symbols are used
    await expect(
      page.locator('text=when you search for symbols to create a new element')
    ).toBeVisible();
  });

  test('should indicate complete symbol package', async ({ page }) => {
    // Verify it downloads ALL ARASAAC symbols
    await expect(
      page.locator('text=Downloads a package with all ARASAAC Symbols')
    ).toBeVisible();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back at main settings
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Symbols' })).toBeVisible();
  });

  test('should have simple focused interface', async ({ page }) => {
    // Symbols settings should focus primarily on ARASAAC download
    // Verify there's one main download action
    const downloadButtons = await page
      .getByRole('button', { name: 'Download' })
      .count();
    expect(downloadButtons).toBe(1);
  });

  test('should provide clear value proposition', async ({ page }) => {
    // Verify the benefit of downloading symbols is clear
    await expect(page.locator('text=locally in your system')).toBeVisible();
    await expect(
      page.locator("text=don't need an Internet connection")
    ).toBeVisible();
  });

  test('should reference ARASAAC properly', async ({ page }) => {
    // ARASAAC is a major AAC symbol library
    await expect(page.locator('text=ARASAAC Symbols')).toBeVisible();

    // Verify it appears in both the title and description
    const arasaacMentions = await page.locator('text=ARASAAC').count();
    expect(arasaacMentions).toBeGreaterThanOrEqual(2);
  });

  test('should use page object methods to verify symbols settings elements', async ({
    page
  }) => {
    // Use page object methods to verify symbols settings
    await cboard.verifySettingsVisible();
    await cboard.verifySettingsTabVisible('Symbols');
    await cboard.verifySymbolsSettingsElements();

    // Test symbols panel is present
    await expect(cboard.symbolsPanel).toBeVisible();
  });
});
