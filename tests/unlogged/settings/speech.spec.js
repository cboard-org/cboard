import { test, expect } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Speech Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Speech tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Speech');
  });

  test('should display speech settings dialog', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Speech' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();
  });

  test('should show voice selection option', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Voice' })).toBeVisible();

    // Verify current voice is displayed
    await expect(
      page.locator('text=Microsoft David - English (United States)')
    ).toBeVisible();
  });

  test('should display pitch control slider', async ({ page }) => {
    await expect(page.locator('text=Pitch')).toBeVisible();
    await expect(
      page.locator('text=Make the voice use a higher or lower pitch')
    ).toBeVisible();

    // Verify pitch slider is present
    const pitchSlider = page.locator('[role="slider"]').first();
    await expect(pitchSlider).toBeVisible();
  });

  test('should display rate control slider', async ({ page }) => {
    await expect(page.locator('text=Rate')).toBeVisible();
    await expect(
      page.locator('text=Make the voice speak faster or slower')
    ).toBeVisible();

    // Verify rate slider is present
    const rateSlider = page.locator('[role="slider"]').last();
    await expect(rateSlider).toBeVisible();
  });

  test('should allow voice selection', async ({ page }) => {
    await page.getByRole('button', { name: 'Voice' }).click();

    // This would open voice selection dialog
    // Note: Specific voice options depend on browser/system TTS capabilities
  });

  test('should allow pitch adjustment', async ({ page }) => {
    const pitchSlider = page.locator('[role="slider"]').first();

    // Get current value
    const initialValue =
      (await pitchSlider.getAttribute('aria-valuenow')) || '50';

    // Adjust pitch slider
    await pitchSlider.fill('75');

    // Verify value changed
    const newValue =
      (await pitchSlider.getAttribute('aria-valuenow')) ||
      (await pitchSlider.inputValue());
    expect(newValue).not.toBe(initialValue);
  });

  test('should allow rate adjustment', async ({ page }) => {
    const rateSlider = page.locator('[role="slider"]').last();

    // Get current value
    const initialValue =
      (await rateSlider.getAttribute('aria-valuenow')) || '50';

    // Adjust rate slider
    await rateSlider.fill('25');

    // Verify value changed
    const newValue =
      (await rateSlider.getAttribute('aria-valuenow')) ||
      (await rateSlider.inputValue());
    expect(newValue).not.toBe(initialValue);
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back at main settings
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Speech' })).toBeVisible();
  });

  test('should show appropriate voice description', async ({ page }) => {
    // Verify voice description shows current voice details
    await expect(
      page.locator('text=Microsoft David - English (United States)')
    ).toBeVisible();
  });

  test('should display helpful tooltips for controls', async ({ page }) => {
    // Verify descriptive text for pitch control
    await expect(
      page.locator('text=Make the voice use a higher or lower pitch')
    ).toBeVisible();

    // Verify descriptive text for rate control
    await expect(
      page.locator('text=Make the voice speak faster or slower')
    ).toBeVisible();
  });

  test('should use page object methods to verify speech settings elements', async ({
    page
  }) => {
    // Use page object methods to verify speech settings
    await cboard.verifySettingsVisible();
    await cboard.verifySettingsTabVisible('Speech');
    await cboard.verifySpeechSettingsElements();

    // Test speech panel is present
    await expect(cboard.speechPanel).toBeVisible();
  });
});
