import { test, expect } from '@playwright/test';
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
        await page.waitForTimeout(1600);
      } else {
        // After 2 seconds, the message should not be visible
        await expect(page.locator('[role="alert"]')).not.toBeVisible({
          timeout: 1
        });
      }
    }
  });

  test('should have unlock and login buttons visible', async ({ page }) => {
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonVisible(cboard.loginButton);
  });

  test('should show unlock message persists across navigation', async ({
    page
  }) => {
    // Click unlock to show message
    await cboard.clickUnlock();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
    // Navigate to food category
    await cboard.navigateToCategory('food');

    // Verify unlock button is still functional
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);

    // Navigate back
    await cboard.navigateBack();

    // Verify we're back on main page and unlock still works
    await expect(cboard.mainBoardHeading).toBeVisible();
    await expect(cboard.unlockButton).toBeEnabled();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
  });
});
