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
  test('should maintain unlock message on repeated clicks', async ({
    page
  }) => {
    // Click unlock button multiple times
    await cboard.clickUnlock();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);

    await cboard.clickUnlock();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);

    await cboard.clickUnlock();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
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
    await cboard.expectButtonVisible(cboard.unlockClicksAlert); // Navigate to food category
    await cboard.navigateToCategory('food');

    // Try to unlock from food page
    await cboard.clickUnlock();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);

    // Navigate back
    await cboard.navigateBack();

    // Verify we can still see unlock button
    await cboard.expectButtonVisible(cboard.unlockButton);
  });
});
