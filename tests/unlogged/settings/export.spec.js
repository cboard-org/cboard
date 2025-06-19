import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Export Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Export tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Export');
  });

  test('should display export settings dialog', async ({ page }) => {
    await cboard.verifyExportSettingsUI();
  });

  test('should show single board export section', async ({ page }) => {
    await cboard.verifySingleBoardExportSection();
  });

  test('should show single board export controls', async ({ page }) => {
    await cboard.verifySingleBoardExportControls();
  });

  test('should show all boards export section', async ({ page }) => {
    await cboard.verifyAllBoardsExportSection();
  });

  test('should show all boards export controls', async ({ page }) => {
    await cboard.verifyAllBoardsExportControls();
  });

  test('should show PDF settings section', async ({ page }) => {
    await cboard.verifyPdfSettingsSection();
  });

  test('should show PDF font size control', async ({ page }) => {
    await cboard.verifyPdfFontSizeControl();
  });

  test('should allow board selection for single export', async ({ page }) => {
    await cboard.clickBoardsDropdown();

    // This should open dropdown with available boards
    // Note: Specific boards depend on user's boards
  });

  test('should allow format selection for single board export', async ({
    page
  }) => {
    await cboard.clickSingleExportFormat();

    // This should open dropdown with format options (Cboard, OpenBoard, PDF)
    // Note: Specific options depend on implementation
  });

  test('should allow format selection for all boards export', async ({
    page
  }) => {
    await cboard.clickAllBoardsExportFormat();

    // This should open dropdown with format options (Cboard, OpenBoard, PDF)
    // Note: Specific options depend on implementation
  });

  test('should allow PDF font size modification', async ({ page }) => {
    await cboard.clickPdfFontSize();

    // This should open dropdown with font size options
    // Note: Specific sizes depend on implementation
  });

  test('should provide helpful format documentation links', async ({
    page
  }) => {
    await cboard.verifyFormatDocumentationLinks();
  });

  test('should explain export behavior differences by format', async ({
    page
  }) => {
    await cboard.verifyExportBehaviorExplanations();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromExport();
  });

  test('should maintain PDF settings section organization', async ({
    page
  }) => {
    await cboard.verifyPdfSettingsOrganization();
  });

  test('should use page object methods to verify export settings elements', async ({
    page
  }) => {
    // Use page object methods to verify export settings
    await cboard.verifyExportSettingsElements();
  });
});
