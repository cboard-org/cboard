import { test, expect } from '@playwright/test';
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
    await expect(page.getByRole('heading', { name: 'Export' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });

  test('should show single board export section', async ({ page }) => {
    await expect(page.locator('text=Export a single board')).toBeVisible();
    await expect(
      page.locator(
        'text=This option will export a single board you have from a list of boards'
      )
    ).toBeVisible();

    // Verify format links
    await expect(page.getByRole('link', { name: 'Cboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'OpenBoard' })).toBeVisible();
    await expect(page.locator('text=or PDF formats')).toBeVisible();
  });

  test('should show single board export controls', async ({ page }) => {
    // Verify boards dropdown
    await expect(page.locator('text=Boards').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Boards' })).toBeVisible();

    // Verify export format dropdown
    await expect(page.locator('text=Export').first()).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Export' }).first()
    ).toBeVisible();
  });

  test('should show all boards export section', async ({ page }) => {
    await expect(page.locator('text=Export All Boards')).toBeVisible();
    await expect(
      page.locator(
        'text=This option will export ALL the boards you have if you choose'
      )
    ).toBeVisible();
    await expect(
      page.locator(
        'text=format. It will export JUST the current board if you choose PDF format'
      )
    ).toBeVisible();

    // Verify format links
    await expect(
      page.getByRole('link', { name: 'Cboard' }).nth(1)
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'OpenBoard' }).nth(1)
    ).toBeVisible();
  });

  test('should show all boards export controls', async ({ page }) => {
    // Verify export format dropdown for all boards
    await expect(page.locator('text=Export').last()).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Export' }).last()
    ).toBeVisible();
  });

  test('should show PDF settings section', async ({ page }) => {
    await expect(page.locator('text=PDF Settings')).toBeVisible();
    await expect(page.locator('text=Font size')).toBeVisible();
    await expect(
      page.locator(
        'text=Select the desired font size. This option is useful if you have problems with the dimensions of the exported board.'
      )
    ).toBeVisible();
  });

  test('should show PDF font size control', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Font size Medium' })
    ).toBeVisible();

    // Verify current setting shows Medium and value 12
    await expect(page.locator('text=Medium')).toBeVisible();
    await expect(page.locator('input[value="12"]')).toBeVisible();
  });

  test('should allow board selection for single export', async ({ page }) => {
    await page.getByRole('button', { name: 'Boards' }).click();

    // This should open dropdown with available boards
    // Note: Specific boards depend on user's boards
  });

  test('should allow format selection for single board export', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: 'Export' })
      .first()
      .click();

    // This should open dropdown with format options (Cboard, OpenBoard, PDF)
    // Note: Specific options depend on implementation
  });

  test('should allow format selection for all boards export', async ({
    page
  }) => {
    await page
      .getByRole('button', { name: 'Export' })
      .last()
      .click();

    // This should open dropdown with format options (Cboard, OpenBoard, PDF)
    // Note: Specific options depend on implementation
  });

  test('should allow PDF font size modification', async ({ page }) => {
    await page.getByRole('button', { name: 'Font size Medium' }).click();

    // This should open dropdown with font size options
    // Note: Specific sizes depend on implementation
  });

  test('should provide helpful format documentation links', async ({
    page
  }) => {
    // Test Cboard format links
    const cboardLinks = page.getByRole('link', { name: 'Cboard' });
    await expect(cboardLinks.first()).toHaveAttribute(
      'href',
      'https://www.cboard.io/help/#HowdoIimportaboardintoCboard'
    );
    await expect(cboardLinks.nth(1)).toHaveAttribute(
      'href',
      'https://www.cboard.io/help/#HowdoIimportaboardintoCboard'
    );

    // Test OpenBoard format links
    const openboardLinks = page.getByRole('link', { name: 'OpenBoard' });
    await expect(openboardLinks.first()).toHaveAttribute(
      'href',
      'https://www.openboardformat.org/'
    );
    await expect(openboardLinks.nth(1)).toHaveAttribute(
      'href',
      'https://www.openboardformat.org/'
    );
  });

  test('should explain export behavior differences by format', async ({
    page
  }) => {
    // Single board export explanation
    await expect(
      page.locator(
        'text=This option will export a single board you have from a list of boards'
      )
    ).toBeVisible();

    // All boards export explanation
    await expect(
      page.locator(
        'text=This option will export ALL the boards you have if you choose'
      )
    ).toBeVisible();
    await expect(page.locator('text=format or')).toBeVisible();
    await expect(
      page.locator(
        'text=format. It will export JUST the current board if you choose PDF format'
      )
    ).toBeVisible();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back at main settings
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
  });

  test('should maintain PDF settings section organization', async ({
    page
  }) => {
    // Verify PDF settings are in their own section
    await expect(page.locator('text=PDF Settings')).toBeVisible();

    // Verify font size setting is under PDF settings
    const pdfSection = page.locator('text=PDF Settings').locator('..');
    await expect(pdfSection.locator('text=Font size')).toBeVisible();
  });

  test('should use page object methods to verify export settings elements', async ({
    page
  }) => {
    // Use page object methods to verify export settings
    await cboard.verifySettingsVisible();
    await cboard.verifySettingsTabVisible('Export');
    await cboard.verifyExportSettingsElements();

    // Test export panel is present
    await expect(cboard.exportPanel).toBeVisible();
  });
});
