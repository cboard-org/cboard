import { test } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Security Features', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should require unlocking before accessing login', async ({ page }) => {
    await cboard.clickLogin();
    await cboard.expectButtonVisible(cboard.lockedProfileAlert);
  });
  test('should show unlock progress when clicking unlock button', async ({
    page
  }) => {
    await cboard.clickUnlock();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
  });
  test('should maintain unlock message for five seconds on a single click', async ({
    page
  }) => {
    await cboard.clickUnlock();
    for (let i = 0; i < 5; i++) {
      if (i < 4) {
        await cboard.expectButtonVisible(cboard.unlockClicksAlert);
        await cboard.waitForTimeout(1300);
      } else {
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
    await cboard.expectButtonNotVisible(cboard.settingsButton);
    await cboard.expectButtonNotVisible(cboard.printBoardButton);
    await cboard.expectButtonNotVisible(cboard.shareButton);
    await cboard.expectButtonNotVisible(cboard.fullScreenButton);
    for (let i = 1; i <= 4; i++) {
      await cboard.clickUnlock();
      if (i < 4) {
        await cboard.expectButtonVisible(cboard.unlockClicksAlert);
        await cboard.expectButtonNotVisible(cboard.settingsButton);
      }
    }
    await cboard.dismissOverlays();
    await cboard.expectButtonVisible(cboard.settingsButton);
    await cboard.expectButtonVisible(cboard.printBoardButton);
    await cboard.expectButtonVisible(cboard.shareButton);
    await cboard.expectButtonVisible(cboard.fullScreenButton);
    await cboard.expectButtonVisible(cboard.userHelpButton);
    await cboard.expectButtonVisible(cboard.lockButton);
    await cboard.expectButtonVisible(cboard.boardsTab);
    await cboard.expectButtonVisible(cboard.buildTab);
    await cboard.expectButtonVisible(cboard.editBoardTilesButton);
    await cboard.expectButtonVisible(cboard.addTileButton);
    await cboard.clickSettings();
    await cboard.waitForNavigation();
    await cboard.dismissOverlays();
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
    for (let i = 1; i <= 4; i++) {
      await cboard.clickUnlock();
    }
    await cboard.dismissOverlays();
    await cboard.expectButtonVisible(cboard.settingsButton);
    await cboard.expectButtonVisible(cboard.lockButton);
    await cboard.clickLock();
    await cboard.waitForTimeout(1000);
    await cboard.expectButtonNotVisible(cboard.settingsButton);
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonNotVisible(cboard.printBoardButton);
    await cboard.expectButtonVisible(cboard.unlockButton);
  });
});
