import { test, expect } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Scanning Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Scanning');
  });

  test('should display scanning settings dialog', async ({ page }) => {
    await cboard.verifyScanningSettingsUI();
  });

  test('should show enable scanning toggle', async ({ page }) => {
    await cboard.verifyEnableScanningToggle();
  });

  test('should show time delay settings', async ({ page }) => {
    await cboard.verifyTimeDelaySettings();
  });

  test('should show scan method settings', async ({ page }) => {
    await cboard.verifyScanMethodSettings();
  });

  test('should show scanning usage instructions', async ({ page }) => {
    await cboard.verifyScanningUsageInstructions();
  });

  test('should allow enabling/disabling scanning', async ({ page }) => {
    await cboard.toggleScanningEnabled();
  });

  test('should allow time delay modification', async ({ page }) => {
    await cboard.clickTimeDelayDropdown();
  });

  test('should allow scan method modification', async ({ page }) => {
    await cboard.clickScanMethodDropdown();
  });

  test.skip('should save scanning settings', async ({ page }) => {
    await cboard.toggleScanningAndSave();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromScanning();
  });

  test('should provide clear accessibility instructions', async ({ page }) => {
    await cboard.verifyClearAccessibilityInstructions();
  });

  test('should have reasonable default timing', async ({ page }) => {
    await cboard.verifyReasonableDefaultTiming();
  });

  test('should indicate current scanning state', async ({ page }) => {
    const isChecked = await cboard.verifyCurrentScanningState();

    expect(typeof isChecked).toBe('boolean');
  });

  test('should explain scanning accessibility purpose', async ({ page }) => {
    await cboard.verifyScanningAccessibilityPurpose();
  });

  test('should use page object methods to verify scanning settings elements', async ({
    page
  }) => {
    await cboard.verifyScanningSettingsElements();

    await cboard.verifyScanningSettingsUI();
  });
});
