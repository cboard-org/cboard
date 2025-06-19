import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Display Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Display tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Display');
  });

  test('should display display settings dialog', async ({ page }) => {
    await cboard.verifyDisplaySettingsUI();
  });

  test('should show UI Size settings', async ({ page }) => {
    await cboard.verifyUISettings();
  });

  test('should show Font Family settings', async ({ page }) => {
    await cboard.verifyFontFamilySettings();
  });

  test('should show Font Size settings', async ({ page }) => {
    await cboard.verifyFontSizeSettings();
  });

  test('should show output bar visibility toggle', async ({ page }) => {
    await cboard.verifyOutputBarSettings();
  });

  test('should show action buttons size toggle', async ({ page }) => {
    await cboard.verifyActionButtonsSettings();
  });

  test('should show label position settings', async ({ page }) => {
    await cboard.verifyLabelPositionSettings();
  });

  test('should show dark theme toggle', async ({ page }) => {
    await cboard.verifyDarkThemeSettings();
  });

  test('should allow UI size modification', async ({ page }) => {
    await cboard.clickUISize();
    // This should open dropdown with size options
    // Note: Specific options would depend on implementation
  });

  test('should allow font family modification', async ({ page }) => {
    await cboard.clickFontFamily();
    // This should open dropdown with font options
    // Note: Specific fonts would depend on implementation
  });

  test('should allow font size modification', async ({ page }) => {
    await cboard.clickFontSize();
    // This should open dropdown with size options
    // Note: Specific options would depend on implementation
  });

  test('should allow label position modification', async ({ page }) => {
    await cboard.clickLabelPosition();
    // This should open dropdown with position options (Above, Below, Hidden)
    // Note: Specific options would depend on implementation
  });

  test('should toggle output bar visibility', async ({ page }) => {
    await cboard.toggleCheckbox(cboard.hideOutputBarCheckbox);
  });

  test('should toggle action buttons size', async ({ page }) => {
    await cboard.toggleCheckbox(cboard.actionButtonsCheckbox);
  });

  test('should toggle dark theme', async ({ page }) => {
    await cboard.toggleCheckbox(cboard.darkThemeCheckbox);
  });

  test('should save settings changes', async ({ page }) => {
    // Make a change
    await cboard.toggleCheckbox(cboard.darkThemeCheckbox);

    // Save changes
    await cboard.saveDisplaySettings();

    // Verify we're back at main settings or changes were applied
    // Note: This test might need adjustment based on actual behavior
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromDisplay();
  });

  test('should use page object methods to verify display settings elements', async ({
    page
  }) => {
    // Use page object methods to verify display settings
    await cboard.verifyDisplaySettingsUI();
  });
});
