import { test } from '@playwright/test';
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
    // Click download button using page object
    await cboard.clickDownloadArasaac();

    // This should initiate the download process
    // Note: Download testing might require special handling
  });

  test('should emphasize offline capability', async ({ page }) => {
    // Verify offline benefits are clearly explained
    await cboard.verifyOfflineCapabilityEmphasis();
  });

  test('should explain symbol usage context', async ({ page }) => {
    // Verify explanation about when symbols are used
    await cboard.verifySymbolUsageContext();
  });

  test('should indicate complete symbol package', async ({ page }) => {
    // Verify it downloads ALL ARASAAC symbols
    await cboard.verifyCompleteSymbolPackage();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromSymbols();
  });

  test('should have simple focused interface', async ({ page }) => {
    // Symbols settings should focus primarily on ARASAAC download
    // Verify there's one main download action
    await cboard.verifySimpleFocusedInterface();
  });

  test('should provide clear value proposition', async ({ page }) => {
    // Verify the benefit of downloading symbols is clear
    await cboard.verifyClearValueProposition();
  });

  test('should reference ARASAAC properly', async ({ page }) => {
    // ARASAAC is a major AAC symbol library
    await cboard.verifyArasaacProperReference();
  });

  test('should use page object methods to verify symbols settings elements', async ({
    page
  }) => {
    // Use page object methods to verify symbols settings
    await cboard.verifySymbolsSettingsElements();

    // Use the existing working verification method
    await cboard.verifySymbolsSettingsUI();
  });
});
