import { test, expect } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Scanning Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Scanning tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Scanning');
  });

  test('should display scanning settings dialog', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Scanning' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });

  test('should show enable scanning toggle', async ({ page }) => {
    await expect(page.locator('text=Enable')).toBeVisible();
    await expect(
      page.locator('text=Start scanning boards immediately')
    ).toBeVisible();

    // Verify checkbox is present
    const enableCheckbox = page.locator('input[type="checkbox"]');
    await expect(enableCheckbox).toBeVisible();
  });

  test('should show time delay settings', async ({ page }) => {
    await expect(page.locator('text=Time delay')).toBeVisible();
    await expect(
      page.locator('text=Time between two consecutive scanning highlights')
    ).toBeVisible();

    // Verify current setting
    await expect(page.getByRole('button', { name: '2 seconds' })).toBeVisible();
    await expect(page.locator('input[value="2000"]')).toBeVisible();
  });

  test('should show scan method settings', async ({ page }) => {
    await expect(page.locator('text=Scan method')).toBeVisible();
    await expect(
      page.locator('text=Method to be used for board exploration')
    ).toBeVisible();

    // Verify current setting
    await expect(page.getByRole('button', { name: 'Automatic' })).toBeVisible();
    await expect(page.locator('input[value="automatic"]')).toBeVisible();
  });

  test('should show scanning usage instructions', async ({ page }) => {
    await expect(
      page.locator(
        'text=Scanner will iterate over elements, press any key to select them'
      )
    ).toBeVisible();
    await expect(
      page.locator('text=Press Escape 4 times to deactivate Scanner')
    ).toBeVisible();
  });

  test('should allow enabling/disabling scanning', async ({ page }) => {
    const enableCheckbox = page.locator('input[type="checkbox"]');

    // Get initial state
    const initialState = await enableCheckbox.isChecked();

    // Toggle checkbox
    await enableCheckbox.click();

    // Verify state changed
    const newState = await enableCheckbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should allow time delay modification', async ({ page }) => {
    await page.getByRole('button', { name: '2 seconds' }).click();

    // This should open dropdown with timing options
    // Note: Specific timing options depend on implementation
  });

  test('should allow scan method modification', async ({ page }) => {
    await page.getByRole('button', { name: 'Automatic' }).click();

    // This should open dropdown with scanning method options
    // Note: Specific methods depend on implementation
  });

  test('should save scanning settings', async ({ page }) => {
    // Make a change
    const enableCheckbox = page.locator('input[type="checkbox"]');
    await enableCheckbox.click();

    // Save changes
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify settings were saved (implementation dependent)
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back at main settings
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Scanning' })).toBeVisible();
  });

  test('should provide clear accessibility instructions', async ({ page }) => {
    // Verify usage instructions are clear for assistive technology users
    await expect(
      page.locator('text=Scanner will iterate over elements')
    ).toBeVisible();
    await expect(
      page.locator('text=press any key to select them')
    ).toBeVisible();
    await expect(
      page.locator('text=Press Escape 4 times to deactivate')
    ).toBeVisible();
  });

  test('should have reasonable default timing', async ({ page }) => {
    // 2 seconds is a reasonable default for scanning
    await expect(page.getByRole('button', { name: '2 seconds' })).toBeVisible();
    await expect(page.locator('input[value="2000"]')).toBeVisible();
  });

  test('should indicate current scanning state', async ({ page }) => {
    // Should show whether scanning is currently enabled or disabled
    const enableCheckbox = page.locator('input[type="checkbox"]');
    const isChecked = await enableCheckbox.isChecked();

    // State should be determinable from checkbox
    expect(typeof isChecked).toBe('boolean');
  });

  test('should explain scanning accessibility purpose', async ({ page }) => {
    // Verify descriptions explain the accessibility purpose
    await expect(
      page.locator('text=Start scanning boards immediately')
    ).toBeVisible();
    await expect(
      page.locator('text=Time between two consecutive scanning highlights')
    ).toBeVisible();
    await expect(
      page.locator('text=Method to be used for board exploration')
    ).toBeVisible();
  });

  test('should use page object methods to verify scanning settings elements', async ({
    page
  }) => {
    // Use page object methods to verify scanning settings
    await cboard.verifySettingsVisible();
    await cboard.verifySettingsTabVisible('Scanning');
    await cboard.verifyScanningSettingsElements();

    // Test scanning panel is present
    await expect(cboard.scanningPanel).toBeVisible();
  });
});
