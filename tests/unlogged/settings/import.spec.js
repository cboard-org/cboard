import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Import Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Import tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Import');
  });

  test('should display import settings dialog', async ({ page }) => {
    await cboard.verifyImportSettingsUI();
  });

  test('should show import description', async ({ page }) => {
    await cboard.verifyImportDescription();
  });

  test('should indicate supported formats', async ({ page }) => {
    await cboard.verifySupportedFormats();
  });

  test('should provide format documentation links', async ({ page }) => {
    await cboard.verifyImportFormatDocumentationLinks();
  });

  test('should show import button', async ({ page }) => {
    await cboard.verifyImportButton();
  });

  test('should allow file import', async ({ page }) => {
    // Click import button
    await cboard.clickImportButton();

    // This should trigger file upload dialog
    // Note: File upload testing requires special handling for file inputs
  });

  test('should explain selective import behavior', async ({ page }) => {
    await cboard.verifySelectiveImportBehavior();
  });

  test('should support both major AAC formats', async ({ page }) => {
    await cboard.verifyBothAAcFormatsSupported();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromImport();
  });

  test('should emphasize smart import behavior', async ({ page }) => {
    await cboard.verifySmartImportBehavior();
  });

  test('should use page object methods to verify import settings elements', async ({
    page
  }) => {
    // Use page object methods to verify import settings
    await cboard.verifyImportSettingsElements();
  });
});
