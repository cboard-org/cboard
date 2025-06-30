import { test } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Mobile Responsiveness', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should maintain touch functionality on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Test touch interactions
    await cboard.clickButton('yes');
    await cboard.verifyCommunicationBarHasText('yes');

    // Test navigation on mobile
    await cboard.clickButton('food');
    await cboard.verifyCategoryHeadingVisible('food');

    // Test adding food items
    await cboard.clickButton('pizza');
    await cboard.verifyCommunicationBarHasText('pizza');
  });
  test('should handle different mobile orientations', async ({ page }) => {
    // Portrait mode
    await page.setViewportSize({ width: 390, height: 844 });
    await cboard.verifyHomeHeadingVisible();

    // Landscape mode
    await page.setViewportSize({ width: 844, height: 390 });
    await cboard.verifyHomeHeadingVisible();

    // Test functionality in landscape
    await cboard.clickButton('yes');
    await cboard.verifyCommunicationBarHasText('yes');
  });
  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport (iPad size)
    await page.setViewportSize({ width: 768, height: 1024 });

    // Verify functionality
    await cboard.verifyHomeHeadingVisible();
    await cboard.clickButton('emotions');
    await cboard.verifyCategoryHeadingVisible('emotions');
  });
  test('should maintain communication bar visibility on mobile', async ({
    page
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Add items to communication bar
    await cboard.clickButton('yes');
    await cboard.clickButton('no');

    // Verify communication bar is visible and functional
    await cboard.verifyCommunicationBarHasText('yes');
    await cboard.verifyCommunicationBarHasText('no');
    await cboard.verifyButtonVisible('Clear');
    await cboard.verifyButtonVisible('Backspace'); // Test Clear functionality on mobile
    await cboard.clickClearButton();
    await cboard.verifyCommunicationBarEmpty();
  });
});
