import { test, expect } from '@playwright/test';
import { createCboard } from './page-objects/cboard.js';

test.describe('Cboard - Smoke Test', () => {
  test('should load the application successfully', async ({ page }) => {
    const cboard = createCboard(page);
    await cboard.goto();
    await expect(page).toHaveTitle('Cboard - AAC Communication Board');
    await cboard.expectButtonVisible(cboard.mainBoardHeading);
    await cboard.expectButtonVisible(cboard.backspaceButton);
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonVisible(cboard.yesButton);
    await cboard.expectButtonVisible(cboard.noButton);
    await cboard.expectButtonVisible(cboard.foodButton);
  });
});
