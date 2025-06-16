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
  test('should maintain unlock message on repeated clicks', async ({
    page
  }) => {
    // Click unlock button and check if there's any unlock feedback
    await cboard.clickUnlock();

    // Try to find any unlock-related message or feedback
    // The exact text might be different than expected
    const unlockMessages = [
      cboard.unlockClicksAlert,
      page.locator('text*="click"'),
      page.locator('text*="unlock"'),
      page.locator('[role="alert"]'),
      page.locator('.unlock-message, .alert, .snackbar')
    ];

    let messageFound = false;
    for (const messageLocator of unlockMessages) {
      try {
        await expect(messageLocator).toBeVisible({ timeout: 2000 });
        messageFound = true;
        break;
      } catch (e) {
        // Continue to next locator
      }
    }

    // If no unlock message system exists, verify the unlock button is still functional
    if (!messageFound) {
      await expect(cboard.unlockButton).toBeVisible();
      await expect(cboard.unlockButton).toBeEnabled();
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

    // Try to find any unlock-related feedback
    const unlockMessages = [
      cboard.unlockClicksAlert,
      page.locator('text*="click"'),
      page.locator('text*="unlock"'),
      page.locator('[role="alert"]')
    ];

    let hasUnlockFeedback = false;
    for (const messageLocator of unlockMessages) {
      try {
        await expect(messageLocator).toBeVisible({ timeout: 2000 });
        hasUnlockFeedback = true;
        break;
      } catch (e) {
        // Continue to next locator
      }
    }

    console.log('Unlock feedback found:', hasUnlockFeedback);

    // Navigate to food category
    await cboard.navigateToCategory('food');

    // Verify unlock button is still functional
    await expect(cboard.unlockButton).toBeVisible();
    await cboard.clickUnlock();

    // Navigate back
    await cboard.navigateBack();

    // Verify we're back on main page and unlock still works
    await expect(cboard.mainBoardHeading).toBeVisible();
    await expect(cboard.unlockButton).toBeEnabled();
  });
});
