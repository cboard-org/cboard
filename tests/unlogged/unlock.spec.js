import { test } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Security Features', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should require unlocking before accessing login', async ({ page }) => {
    // Try to click Login without unlocking
    await cboard.clickLogin();

    // Verify locked message appears
    await cboard.expectButtonVisible(cboard.lockedProfileAlert);
  });

  test('should show unlock progress when clicking unlock button', async ({
    page
  }) => {
    // Click unlock button
    await cboard.clickUnlock();

    // Verify unlock message appears
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
  });
  test('should maintain unlock message for five seconds on a single click', async ({
    page
  }) => {
    // Click unlock button and check if there's any unlock feedback
    await cboard.clickUnlock();

    // verify unlock message appears during 5 seconds after clicking
    for (let i = 0; i < 5; i++) {
      if (i < 4) {
        // Verify unlock message appears
        await cboard.expectButtonVisible(cboard.unlockClicksAlert);
        await cboard.waitForTimeout(1300);
      } else {
        // After 2 seconds, the message should not be visible
        await cboard.expectButtonNotVisible(cboard.unlockClicksAlert);
      }
    }
  });

  test('should have unlock and login buttons visible', async ({ page }) => {
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonVisible(cboard.loginButton);
  });

  test('should reveal settings and advanced features after 4 consecutive clicks on unlock button', async ({
    page
  }) => {
    // Verify settings and advanced features are not visible initially
    await cboard.expectButtonNotVisible(cboard.settingsButton);
    await cboard.expectButtonNotVisible(cboard.printBoardButton);
    await cboard.expectButtonNotVisible(cboard.shareButton);
    await cboard.expectButtonNotVisible(cboard.fullScreenButton);

    // Perform 4 consecutive clicks on unlock button
    for (let i = 1; i <= 4; i++) {
      await cboard.clickUnlock();

      if (i < 4) {
        // Before 4th click, should show progress but settings still locked
        await cboard.expectButtonVisible(cboard.unlockClicksAlert);
        await cboard.expectButtonNotVisible(cboard.settingsButton);
      }
    }

    // dismiss overlays
    await cboard.dismissOverlays();

    // After 4th click, verify advanced features are now visible
    await cboard.expectButtonVisible(cboard.settingsButton);
    await cboard.expectButtonVisible(cboard.printBoardButton);
    await cboard.expectButtonVisible(cboard.shareButton);
    await cboard.expectButtonVisible(cboard.fullScreenButton);
    await cboard.expectButtonVisible(cboard.userHelpButton);
    await cboard.expectButtonVisible(cboard.lockButton);

    // Verify navigation tabs are available
    await cboard.expectButtonVisible(cboard.boardsTab);
    await cboard.expectButtonVisible(cboard.buildTab);

    // Verify edit functionality is available
    await cboard.expectButtonVisible(cboard.editBoardTilesButton);
    await cboard.expectButtonVisible(cboard.addTileButton);

    // Test Settings functionality
    await cboard.clickSettings();

    // Wait for navigation and verify we're on settings page
    await cboard.waitForNavigation();

    // dismiss any overlays that might appear
    await cboard.dismissOverlays();

    // Verify settings page loaded with main categories
    await cboard.expectButtonVisible(cboard.languageSettingsButton);
    await cboard.expectButtonVisible(cboard.speechSettingsButton);
    await cboard.expectButtonVisible(cboard.displaySettingsButton);
    await cboard.expectButtonVisible(cboard.exportSettingsButton);
    await cboard.expectButtonVisible(cboard.importSettingsButton);
    await cboard.expectButtonVisible(cboard.symbolsSettingsButton);
    await cboard.expectButtonVisible(cboard.scanningSettingsButton);
  });

  test('should lock settings again when lock button is clicked', async ({
    page
  }) => {
    // First unlock the settings (4 clicks)
    for (let i = 1; i <= 4; i++) {
      await cboard.clickUnlock();
    }

    // dismiss any overlays that might appear
    await cboard.dismissOverlays();

    // Verify settings are unlocked
    await cboard.expectButtonVisible(cboard.settingsButton);
    await cboard.expectButtonVisible(cboard.lockButton);

    // Click the lock button using safe click to handle overlays
    await cboard.clickLock();

    // Wait a moment for the state change to propagate
    await cboard.waitForTimeout(1000);

    // Verify settings are locked again - the lock button should change to unlock button
    await cboard.expectButtonNotVisible(cboard.settingsButton);
    // The lock button changes back to unlock button
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonNotVisible(cboard.printBoardButton);

    // Verify unlock button is visible again
    await cboard.expectButtonVisible(cboard.unlockButton);
  });
});
