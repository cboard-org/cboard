import { test, expect } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

const TEST_PIN = '1234';
const WRONG_PIN = '9999';

test.describe('Cboard - Navigation Settings: PIN Lock', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.navigateToNavigationSettings();
    await cboard.enablePinLockInSettings(TEST_PIN);
    await cboard.saveButton.click();

    await cboard.goto();
  });

  test('should open PIN dialog immediately on the first click of the unlock button', async () => {
    await cboard.openPinDialog();

    await cboard.expectPinDialogVisible();
    await expect(cboard.unlockClicksAlert).not.toBeVisible();

    await expect(cboard.pinDialogUnlockButton).toBeDisabled();
  });

  test('should show an error and keep the board locked when a wrong PIN is submitted', async () => {
    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();

    await cboard.submitPin(WRONG_PIN);

    await cboard.expectPinDialogError();
    await cboard.expectPinDialogVisible();

    await expect(cboard.settingsButton).not.toBeVisible();
  });

  test('should unlock the board and reveal the settings toolbar when the correct PIN is submitted', async () => {
    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();

    await cboard.submitPin(TEST_PIN);

    await cboard.expectPinDialogNotVisible();
    await cboard.expectBoardUnlocked();
  });

  test('should close the PIN dialog without unlocking when Cancel is clicked and allow reopening', async () => {
    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();

    await cboard.pinDialogCancelButton.click();
    await cboard.expectPinDialogNotVisible();

    await expect(cboard.settingsButton).not.toBeVisible();
    await cboard.expectButtonVisible(cboard.unlockButton);

    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();
  });

  test('should require the PIN again after the board is re-locked following a successful unlock', async () => {
    await cboard.openPinDialog();
    await cboard.submitPin(TEST_PIN);
    await cboard.expectPinDialogNotVisible();
    await cboard.expectBoardUnlocked();

    await cboard.clickLock();
    await cboard.waitForTimeout(500);
    await expect(cboard.settingsButton).not.toBeVisible();
    await cboard.expectButtonVisible(cboard.unlockButton);

    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();

    await cboard.submitPin(TEST_PIN);
    await cboard.expectPinDialogNotVisible();
    await cboard.expectBoardUnlocked();
  });
});
