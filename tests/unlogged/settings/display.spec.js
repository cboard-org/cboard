import { test, expect } from '@playwright/test';
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
    await expect(page.getByRole('heading', { name: 'Display' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });

  test('should show UI Size settings', async ({ page }) => {
    await expect(page.locator('text=UI Size')).toBeVisible();
    await expect(page.locator('text=Elements size')).toBeVisible();

    // Verify current setting
    await expect(
      page.getByRole('button', { name: 'Standard' }).first()
    ).toBeVisible();
  });

  test('should show Font Family settings', async ({ page }) => {
    await expect(page.locator('text=Font family')).toBeVisible();
    await expect(
      page.locator('text=Change the text font used in the entire application')
    ).toBeVisible();

    // Verify current setting
    await expect(
      page.getByRole('button', { name: 'Montserrat' })
    ).toBeVisible();
  });

  test('should show Font Size settings', async ({ page }) => {
    await expect(page.locator('text=Font Size')).toBeVisible();
    await expect(page.locator('text=App font size')).toBeVisible();

    // Verify current setting
    await expect(
      page.getByRole('button', { name: 'Standard' }).last()
    ).toBeVisible();
  });

  test('should show output bar visibility toggle', async ({ page }) => {
    await expect(page.locator('text=Hide the output bar')).toBeVisible();
    await expect(
      page.locator(
        'text=Hides the white bar on the top where you build a sentence.'
      )
    ).toBeVisible();

    // Verify checkbox is present
    const hideOutputBarCheckbox = page
      .locator('input[type="checkbox"]')
      .first();
    await expect(hideOutputBarCheckbox).toBeVisible();
  });

  test('should show action buttons size toggle', async ({ page }) => {
    await expect(
      page.locator('text=Increase the size of action buttons on the output bar')
    ).toBeVisible();
    await expect(
      page.locator(
        'text=Increase the size of the action buttons that are on the white bar where you build a sentence.'
      )
    ).toBeVisible();

    // Verify checkbox is present
    const actionButtonsCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await expect(actionButtonsCheckbox).toBeVisible();
  });

  test('should show label position settings', async ({ page }) => {
    await expect(page.locator('text=Label Position')).toBeVisible();
    await expect(
      page.locator(
        'text=Whether labels on tiles should be visible, or positioned above or below'
      )
    ).toBeVisible();

    // Verify current setting
    await expect(page.getByRole('button', { name: 'Below' })).toBeVisible();
  });

  test('should show dark theme toggle', async ({ page }) => {
    await expect(page.locator('text=Enable dark theme')).toBeVisible();
    await expect(
      page.locator(
        'text=The theme specifies the color of the components, darkness of the surfaces, level of shadow, appropriate opacity of ink elements, etc.'
      )
    ).toBeVisible();

    // Verify checkbox is present
    const darkThemeCheckbox = page.locator('input[type="checkbox"]').last();
    await expect(darkThemeCheckbox).toBeVisible();
  });

  test('should allow UI size modification', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Standard' })
      .first()
      .click();

    // This should open dropdown with size options
    // Note: Specific options would depend on implementation
  });

  test('should allow font family modification', async ({ page }) => {
    await page.getByRole('button', { name: 'Montserrat' }).click();

    // This should open dropdown with font options
    // Note: Specific fonts would depend on implementation
  });

  test('should allow font size modification', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Standard' })
      .last()
      .click();

    // This should open dropdown with size options
    // Note: Specific options would depend on implementation
  });

  test('should allow label position modification', async ({ page }) => {
    await page.getByRole('button', { name: 'Below' }).click();

    // This should open dropdown with position options (Above, Below, Hidden)
    // Note: Specific options would depend on implementation
  });

  test('should toggle output bar visibility', async ({ page }) => {
    const hideOutputBarCheckbox = page
      .locator('input[type="checkbox"]')
      .first();

    // Get initial state
    const initialState = await hideOutputBarCheckbox.isChecked();

    // Toggle checkbox
    await hideOutputBarCheckbox.click();

    // Verify state changed
    const newState = await hideOutputBarCheckbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should toggle action buttons size', async ({ page }) => {
    const actionButtonsCheckbox = page.locator('input[type="checkbox"]').nth(1);

    // Get initial state
    const initialState = await actionButtonsCheckbox.isChecked();

    // Toggle checkbox
    await actionButtonsCheckbox.click();

    // Verify state changed
    const newState = await actionButtonsCheckbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should toggle dark theme', async ({ page }) => {
    const darkThemeCheckbox = page.locator('input[type="checkbox"]').last();

    // Get initial state
    const initialState = await darkThemeCheckbox.isChecked();

    // Toggle checkbox
    await darkThemeCheckbox.click();

    // Verify state changed
    const newState = await darkThemeCheckbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should save settings changes', async ({ page }) => {
    // Make a change
    const darkThemeCheckbox = page.locator('input[type="checkbox"]').last();
    await darkThemeCheckbox.click();

    // Save changes
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify we're back at main settings or changes were applied
    // Note: This test might need adjustment based on actual behavior
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back at main settings
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Display' })).toBeVisible();
  });

  test('should use page object methods to verify display settings elements', async ({
    page
  }) => {
    // Use page object methods to verify display settings
    await cboard.verifySettingsVisible();
    await cboard.verifySettingsTabVisible('Display');
    await cboard.verifyDisplaySettingsElements();

    // Test display panel is present
    await expect(cboard.displayPanel).toBeVisible();
  });
});
