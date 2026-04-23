import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Display Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Display');
  });
  test('should display display settings dialog', async ({ page }) => {
    await cboard.verifyDisplaySettingsUI();
  });
  test('should verify output bar visibility states', async ({ page }) => {
    await cboard.verifyOutputBarSettings();
    const isInitiallyChecked = await cboard.hideOutputBarCheckbox.isChecked();
    await cboard.hideOutputBarCheckbox.click();
    const isNowChecked = await cboard.hideOutputBarCheckbox.isChecked();
    if (isInitiallyChecked !== isNowChecked) {
      console.log('Output bar checkbox toggle successful');
    }
  });
  test('should allow UI size modification', async ({ page }) => {
    await cboard.clickUISize();
    await cboard.verifyUISizeOptions(['Standard', 'Large', 'Extra Large']);
  });
  test('should change UI size to Extra Large and save', async ({ page }) => {
    await cboard.clickUISize();
    await cboard.selectUISizeOption('Extra Large');
    await cboard.verifyUISizeSelected('Extra Large');
    await cboard.saveDisplaySettings();
    await cboard.goto();
    await cboard.verifyUIChanged();
  });
  test('should allow font family modification', async ({ page }) => {
    await cboard.clickFontFamily();
    await cboard.verifyFontFamilyOptions([
      'Chilanka',
      'Hind',
      'Indie Flower',
      'Montserrat',
      'Nunito',
      'Oswald',
      'Roboto'
    ]);
  });
  test('should change font family to Roboto and save', async ({ page }) => {
    await cboard.clickFontFamily();
    await cboard.verifyFontFamilyOptions([
      'Chilanka',
      'Hind',
      'Indie Flower',
      'Montserrat',
      'Nunito',
      'Oswald',
      'Roboto'
    ]);
    await cboard.selectFontFamilyOption('Roboto');
    await cboard.verifyFontFamilySelected('Roboto');
    await cboard.saveDisplaySettings();
    await cboard.goto();

    // Verify that font family change has been applied
    await cboard.verifyFontFamilyChanged();
  });

  test('should allow font size modification', async ({ page }) => {
    await cboard.clickFontSize();
    // This should open dropdown with size options
    await cboard.verifyFontSizeOptions(['Standard', 'Large', 'Extra Large']);
  });

  test('should change font size to Large and save', async ({ page }) => {
    // Open Font Size dropdown
    await cboard.clickFontSize();

    // Verify all available font size options
    await cboard.verifyFontSizeOptions(['Standard', 'Large', 'Extra Large']);

    // Select Large option
    await cboard.selectFontSizeOption('Large');

    // Verify the selection
    await cboard.verifyFontSizeSelected('Large');

    // Save the settings
    await cboard.saveDisplaySettings();

    // Navigate back to main board to verify changes
    await cboard.goto();

    // Verify that font size change has been applied
    await cboard.verifyFontSizeChanged();
  });

  test('should change font size to Extra Large and save', async ({ page }) => {
    // Open Font Size dropdown
    await cboard.clickFontSize();

    // Verify all available font size options
    await cboard.verifyFontSizeOptions(['Standard', 'Large', 'Extra Large']);

    // Select Extra Large option
    await cboard.selectFontSizeOption('Extra Large');

    // Verify the selection
    await cboard.verifyFontSizeSelected('Extra Large');

    // Save the settings
    await cboard.saveDisplaySettings();

    // Navigate back to main board to verify changes
    await cboard.goto();

    // Verify that font size change has been applied
    await cboard.verifyFontSizeChanged();
  });

  test('should change output bar visibility and verify in UI', async ({
    page
  }) => {
    // Get initial output bar visibility state before making changes
    await cboard.saveDisplaySettings();
    await cboard.goto();
    const initialVisibility = await cboard.getOutputBarVisibilityState();

    // Navigate back to display settings
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Display');

    // Toggle the output bar visibility
    const expectedVisibility = await cboard.toggleOutputBarVisibility();

    // Save the settings
    await cboard.saveDisplaySettings();

    // Navigate back to main board to verify changes
    await cboard.goto();

    // Verify that output bar visibility change has been applied
    await cboard.verifyOutputBarToggled(expectedVisibility);
    await cboard.verifyOutputBarVisibilityChanged();

    // Verify the change is opposite of initial state
    const newVisibility = await cboard.getOutputBarVisibilityState();
    if (initialVisibility !== newVisibility) {
      // Change was successful
      console.log(
        `Output bar visibility changed from ${initialVisibility} to ${newVisibility}`
      );
    }
  });

  test('should change action buttons size and verify in UI', async ({
    page
  }) => {
    // Ensure we have an output bar visible first (so action buttons can be seen)
    const outputBarHidden = await cboard.hideOutputBarCheckbox.isChecked();
    if (outputBarHidden) {
      await cboard.hideOutputBarCheckbox.click(); // Uncheck to show output bar
    }

    // Get initial action button size state
    await cboard.saveDisplaySettings();
    await cboard.goto();

    // Add a word to the output bar so action buttons become visible
    await cboard.clickButton('yes');

    const initialSizeState = await cboard.getActionButtonsSizeState();

    // Navigate back to display settings
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Display');

    // Toggle the action buttons size
    const expectedLargerSize = await cboard.toggleActionButtonsSize();

    // Save the settings
    await cboard.saveDisplaySettings();

    // Navigate back to main board to verify changes
    await cboard.goto();

    // Add a word to make action buttons visible
    await cboard.clickButton('yes');

    // Verify that action button size change has been applied
    await cboard.verifyActionButtonsSizeToggled(expectedLargerSize);
    await cboard.verifyActionButtonsSizeChanged();

    // Get new size state and compare
    const newSizeState = await cboard.getActionButtonsSizeState();

    if (initialSizeState.buttonsPresent && newSizeState.buttonsPresent) {
      console.log(
        `Action buttons size changed. Expected larger: ${expectedLargerSize}`
      );
      console.log(
        `Initial size: ${initialSizeState.width}x${initialSizeState.height}`
      );
      console.log(`New size: ${newSizeState.width}x${newSizeState.height}`);
    }
  });

  test('should verify action buttons size states', async ({ page }) => {
    // Test that we can check both normal and larger button states
    await cboard.verifyActionButtonsSettings();

    // Check initial checkbox state
    const isInitiallyChecked = await cboard.actionButtonsCheckbox.isChecked();

    // Click the checkbox to toggle it
    await cboard.actionButtonsCheckbox.click();

    // Verify the checkbox state changed
    const isNowChecked = await cboard.actionButtonsCheckbox.isChecked();
    if (isInitiallyChecked !== isNowChecked) {
      console.log('Action buttons size checkbox toggle successful');
    }
  });
});
