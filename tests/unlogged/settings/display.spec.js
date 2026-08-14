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

    await cboard.verifyFontFamilyChanged();
  });

  test('should allow font size modification', async ({ page }) => {
    await cboard.clickFontSize();

    await cboard.verifyFontSizeOptions(['Standard', 'Large', 'Extra Large']);
  });

  test('should change font size to Large and save', async ({ page }) => {
    await cboard.clickFontSize();

    await cboard.verifyFontSizeOptions(['Standard', 'Large', 'Extra Large']);

    await cboard.selectFontSizeOption('Large');

    await cboard.verifyFontSizeSelected('Large');

    await cboard.saveDisplaySettings();

    await cboard.goto();

    await cboard.verifyFontSizeChanged();
  });

  test('should change font size to Extra Large and save', async ({ page }) => {
    await cboard.clickFontSize();

    await cboard.verifyFontSizeOptions(['Standard', 'Large', 'Extra Large']);

    await cboard.selectFontSizeOption('Extra Large');

    await cboard.verifyFontSizeSelected('Extra Large');

    await cboard.saveDisplaySettings();

    await cboard.goto();

    await cboard.verifyFontSizeChanged();
  });

  test('should change output bar visibility and verify in UI', async ({
    page
  }) => {
    await cboard.saveDisplaySettings();
    await cboard.goto();
    const initialVisibility = await cboard.getOutputBarVisibilityState();

    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Display');

    const expectedVisibility = await cboard.toggleOutputBarVisibility();

    await cboard.saveDisplaySettings();

    await cboard.goto();

    await cboard.verifyOutputBarToggled(expectedVisibility);
    await cboard.verifyOutputBarVisibilityChanged();

    const newVisibility = await cboard.getOutputBarVisibilityState();
    if (initialVisibility !== newVisibility) {
      console.log(
        `Output bar visibility changed from ${initialVisibility} to ${newVisibility}`
      );
    }
  });

  test('should change action buttons size and verify in UI', async ({
    page
  }) => {
    const outputBarHidden = await cboard.hideOutputBarCheckbox.isChecked();
    if (outputBarHidden) {
      await cboard.hideOutputBarCheckbox.click();
    }

    await cboard.saveDisplaySettings();
    await cboard.goto();

    await cboard.clickButton('yes');

    const initialSizeState = await cboard.getActionButtonsSizeState();

    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Display');

    const expectedLargerSize = await cboard.toggleActionButtonsSize();

    await cboard.saveDisplaySettings();

    await cboard.goto();

    await cboard.clickButton('yes');

    await cboard.verifyActionButtonsSizeToggled(expectedLargerSize);
    await cboard.verifyActionButtonsSizeChanged();

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
    await cboard.verifyActionButtonsSettings();

    const isInitiallyChecked = await cboard.actionButtonsCheckbox.isChecked();

    await cboard.actionButtonsCheckbox.click();

    const isNowChecked = await cboard.actionButtonsCheckbox.isChecked();
    if (isInitiallyChecked !== isNowChecked) {
      console.log('Action buttons size checkbox toggle successful');
    }
  });
});
