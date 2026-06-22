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
    // Reload the board — it starts in the default locked state with PIN lock persisted
    await cboard.goto();
  });

  test('should open PIN dialog immediately on the first click of the unlock button', async () => {
    // With PIN lock configured, a single click must open the PIN dialog
    // instead of showing the multi-click countdown toast
    await cboard.openPinDialog();

    await cboard.expectPinDialogVisible();
    await expect(cboard.unlockClicksAlert).not.toBeVisible();
    // Unlock button inside the dialog must be disabled until 4 digits are typed
    await expect(cboard.pinDialogUnlockButton).toBeDisabled();
  });

  test('should show an error and keep the board locked when a wrong PIN is submitted', async () => {
    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();

    await cboard.submitPin(WRONG_PIN);

    // Error message visible, input cleared for retry, dialog still open
    await cboard.expectPinDialogError();
    await cboard.expectPinDialogVisible();
    // Settings toolbar must not be visible — board remains locked
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

    // Cancel must dismiss the dialog
    await cboard.pinDialogCancelButton.click();
    await cboard.expectPinDialogNotVisible();

    // Board must still be locked — settings toolbar not visible, unlock button present
    await expect(cboard.settingsButton).not.toBeVisible();
    await cboard.expectButtonVisible(cboard.unlockButton);

    // Clicking unlock again must re-open the PIN dialog (cancel doesn't disable PIN lock)
    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();
  });

  test('should require the PIN again after the board is re-locked following a successful unlock', async () => {
    // First unlock with correct PIN
    await cboard.openPinDialog();
    await cboard.submitPin(TEST_PIN);
    await cboard.expectPinDialogNotVisible();
    await cboard.expectBoardUnlocked();

    // Re-lock the board
    await cboard.clickLock();
    await cboard.waitForTimeout(500);
    await expect(cboard.settingsButton).not.toBeVisible();
    await cboard.expectButtonVisible(cboard.unlockButton);

    // PIN dialog must appear again on the very first click — PIN lock is still active
    await cboard.openPinDialog();
    await cboard.expectPinDialogVisible();

    // Correct PIN must unlock again
    await cboard.submitPin(TEST_PIN);
    await cboard.expectPinDialogNotVisible();
    await cboard.expectBoardUnlocked();
  });
});
