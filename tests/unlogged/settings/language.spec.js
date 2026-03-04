import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Language Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Language');
  });
  test('should display language settings dialog', async ({ page }) => {
    await cboard.verifyLanguageSettingsUI();
  });
  test('should show English (en-US) as currently selected language', async ({
    page
  }) => {
    await cboard.verifyCurrentlySelectedLanguage();
  });
  test('should display comprehensive list of available languages', async ({
    page
  }) => {
    await cboard.verifyComprehensiveLanguageList();
  });
  test('should indicate online requirement for most languages', async ({
    page
  }) => {
    await cboard.verifyOnlineLanguageRequirement();
  });
  test('should provide More Languages option', async ({ page }) => {
    await cboard.verifyMoreLanguagesOption();
  });
  test('should allow language selection and save', async ({ page }) => {
    await cboard.selectSpanishAndSave();
  });
  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromLanguage();
  });
  test('should display correct language variants', async ({ page }) => {
    await cboard.verifyLanguageVariants();
  });
  test('should use page object methods to verify language settings elements', async ({
    page
  }) => {
    await cboard.verifyLanguageSettingsElements();
  });
});
