import { test } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Mobile Responsiveness', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should maintain touch functionality on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await cboard.clickButton('yes');
    await cboard.verifyCommunicationBarHasText('yes');
    await cboard.clickButton('food');
    await cboard.verifyCategoryHeadingVisible('food');
    await cboard.clickButton('pizza');
    await cboard.verifyCommunicationBarHasText('pizza');
  });
  test('should handle different mobile orientations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await cboard.verifyHomeHeadingVisible();
    await page.setViewportSize({ width: 844, height: 390 });
    await cboard.verifyHomeHeadingVisible();
    await cboard.clickButton('yes');
    await cboard.verifyCommunicationBarHasText('yes');
  });
  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await cboard.verifyHomeHeadingVisible();
    await cboard.clickButton('emotions');
    await cboard.verifyCategoryHeadingVisible('emotions');
  });
  test('should maintain communication bar visibility on mobile', async ({
    page
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await cboard.clickButton('yes');
    await cboard.clickButton('no');
    await cboard.verifyCommunicationBarHasText('yes');
    await cboard.verifyCommunicationBarHasText('no');
    await cboard.verifyButtonVisible('Clear');
    await cboard.verifyButtonVisible('Backspace');
    await cboard.clickClearButton();
    await cboard.verifyCommunicationBarEmpty();
  });
});
