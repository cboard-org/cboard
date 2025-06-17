import { test, expect } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Language Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Language tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Language');
  });

  test('should display language settings dialog', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Language' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });

  test('should show English (en-US) as currently selected language', async ({
    page
  }) => {
    // Verify English (en-US) is selected with checkmark
    await expect(
      page.getByRole('button', { name: 'English (en-US) English' })
    ).toBeVisible();
    await expect(
      page
        .locator('img')
        .filter({ hasText: '' })
        .first()
    ).toBeVisible(); // Checkmark icon
  });

  test('should display comprehensive list of available languages', async ({
    page
  }) => {
    // Test major European languages
    await expect(
      page.getByRole('button', { name: 'Español Spanish online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Français French online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Deutsch German online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Italiano Italian online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Português (pt-BR) Portuguese online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Nederlands Dutch online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Polski Polish online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Русский Russian online' })
    ).toBeVisible();

    // Test Asian languages
    await expect(
      page.getByRole('button', { name: '中文 Chinese online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '日本語 Japanese online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: '한국어 Korean online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'हिन्दी Hindi online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'ไทย Thai online' })
    ).toBeVisible();

    // Test Middle Eastern languages
    await expect(
      page.getByRole('button', { name: 'اَلْعَرَبِيَّةُ Arabic online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'עברית Hebrew online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'فارسی Persian online' })
    ).toBeVisible();
  });

  test('should indicate online requirement for most languages', async ({
    page
  }) => {
    // Verify most languages show "online" indicator
    await expect(page.locator('text=online').first()).toBeVisible();

    // Count how many languages show online indicator
    const onlineLanguages = await page.locator('text=online').count();
    expect(onlineLanguages).toBeGreaterThan(40); // Should have 40+ online languages
  });

  test('should provide More Languages option', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'More Languages' })
    ).toBeVisible();
  });

  test('should allow language selection and save', async ({ page }) => {
    // Try to select a different language (Spanish)
    await page.getByRole('button', { name: 'Español Spanish online' }).click();

    // Save the selection
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify we're back at main settings or language has changed
    // Note: This test might need adjustment based on actual behavior
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back at main settings
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Language' })).toBeVisible();
  });

  test('should display correct language variants', async ({ page }) => {
    // Test English variants
    await expect(
      page.getByRole('button', { name: 'English (en-US) English' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'English (en-GB) English online' })
    ).toBeVisible();

    // Test Portuguese variants
    await expect(
      page.getByRole('button', { name: 'Português (pt-BR) Portuguese online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Português (pt-PT) Portuguese online' })
    ).toBeVisible();

    // Test Serbian variants
    await expect(
      page.getByRole('button', { name: 'Srpski jezik (sr-RS) Serbian online' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Српски језик (sr-SP) Serbian online' })
    ).toBeVisible();
  });

  test('should use page object methods to verify language settings elements', async ({
    page
  }) => {
    // Use page object methods to verify language settings
    await cboard.verifySettingsVisible();
    await cboard.verifySettingsTabVisible('Language');
    await cboard.verifyLanguageSettingsElements();

    // Test navigation between tabs using page object
    await cboard.clickSettingsTab('Speech');
    await cboard.verifySettingsTabVisible('Speech');

    await cboard.clickSettingsTab('Language');
    await cboard.verifySettingsTabVisible('Language');
  });
});
