import { test, expect } from '@playwright/test';
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
    await expect(page.getByRole('heading', { name: 'Import' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });

  test('should show import description', async ({ page }) => {
    await expect(page.locator('text=Import')).toBeVisible();
    await expect(
      page.locator(
        'text=This option will import JUST the new boards detected. It WILL NOT import the default boards included on Cboard.'
      )
    ).toBeVisible();
  });

  test('should indicate supported formats', async ({ page }) => {
    await expect(page.locator('text=Supported formats are')).toBeVisible();

    // Verify format links
    await expect(page.getByRole('link', { name: 'Cboard' })).toBeVisible();
    await expect(page.locator('text=format or')).toBeVisible();
    await expect(page.getByRole('link', { name: 'OpenBoard' })).toBeVisible();
    await expect(page.locator('text=format.')).toBeVisible();
  });

  test('should provide format documentation links', async ({ page }) => {
    // Test Cboard format link
    await expect(page.getByRole('link', { name: 'Cboard' })).toHaveAttribute(
      'href',
      'https://www.cboard.io/help/#HowdoIimportaboardintoCboard'
    );

    // Test OpenBoard format link
    await expect(page.getByRole('link', { name: 'OpenBoard' })).toHaveAttribute(
      'href',
      'https://www.openboardformat.org/'
    );
  });

  test('should show import button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
  });

  test('should allow file import', async ({ page }) => {
    // Click import button
    await page.getByRole('button', { name: 'Import' }).click();

    // This should trigger file upload dialog
    // Note: File upload testing requires special handling for file inputs
  });

  test('should explain selective import behavior', async ({ page }) => {
    // Verify explanation about selective import
    await expect(
      page.locator('text=This option will import JUST the new boards detected')
    ).toBeVisible();
    await expect(
      page.locator(
        'text=It WILL NOT import the default boards included on Cboard'
      )
    ).toBeVisible();
  });

  test('should support both major AAC formats', async ({ page }) => {
    // Verify both supported formats are mentioned
    await expect(page.getByRole('link', { name: 'Cboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'OpenBoard' })).toBeVisible();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back at main settings
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
  });

  test('should have simple interface design', async ({ page }) => {
    // Import settings should be simpler than export settings
    // Verify there's only one import button (not multiple dropdowns like export)
    const importButtons = await page
      .getByRole('button', { name: 'Import' })
      .count();
    expect(importButtons).toBe(1);
  });

  test('should emphasize smart import behavior', async ({ page }) => {
    // Verify the key benefit of smart import is highlighted
    await expect(
      page.locator('text=JUST the new boards detected')
    ).toBeVisible();
    await expect(
      page.locator('text=WILL NOT import the default boards')
    ).toBeVisible();
  });

  test('should use page object methods to verify import settings elements', async ({
    page
  }) => {
    // Use page object methods to verify import settings
    await cboard.verifySettingsVisible();
    await cboard.verifySettingsTabVisible('Import');
    await cboard.verifyImportSettingsElements();

    // Test import panel is present
    await expect(cboard.importPanel).toBeVisible();
  });
});
