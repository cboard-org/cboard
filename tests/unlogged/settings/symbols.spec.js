import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Symbols Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Symbols');
  });

  test.skip('should display symbols settings dialog', async ({ page }) => {
    await cboard.verifySymbolsSettingsUI();
  });

  test('should show ARASAAC symbols download section', async ({ page }) => {
    await cboard.verifyArasaacDownloadSection();
  });

  test('should show download button', async ({ page }) => {
    await cboard.verifyDownloadButton();
  });

  test('should explain offline benefits', async ({ page }) => {
    await cboard.verifyOfflineBenefitsExplanation();
  });

  test('should allow ARASAAC symbols download', async ({ page }) => {
    await cboard.clickDownloadArasaac();
  });

  test('should emphasize offline capability', async ({ page }) => {
    await cboard.verifyOfflineCapabilityEmphasis();
  });

  test('should explain symbol usage context', async ({ page }) => {
    await cboard.verifySymbolUsageContext();
  });

  test('should indicate complete symbol package', async ({ page }) => {
    await cboard.verifyCompleteSymbolPackage();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromSymbols();
  });

  test('should have simple focused interface', async ({ page }) => {
    await cboard.verifySimpleFocusedInterface();
  });

  test('should provide clear value proposition', async ({ page }) => {
    await cboard.verifyClearValueProposition();
  });

  test('should reference ARASAAC properly', async ({ page }) => {
    await cboard.verifyArasaacProperReference();
  });

  test('should use page object methods to verify symbols settings elements', async ({
    page
  }) => {
    await cboard.verifySymbolsSettingsElements();

    await cboard.verifySymbolsSettingsUI();
  });
});
