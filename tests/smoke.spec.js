import { test, expect } from '@playwright/test';
import { createCboard } from './page-objects/cboard.js';

test.describe('Cboard - Smoke Test', () => {
  test('should load the application successfully', async ({ page }) => {
    const cboard = createCboard(page);
    await cboard.goto();

    // Verify the page loads with correct title
    await expect(page).toHaveTitle('Cboard - AAC Communication Board');

    // Verify main elements are present
    await cboard.expectButtonVisible(cboard.mainBoardHeading);

    // Verify essential buttons are present
    await cboard.expectButtonVisible(cboard.backspaceButton);
    await cboard.expectButtonVisible(cboard.unlockButton);

    // Verify some communication categories are visible
    await cboard.expectButtonVisible(cboard.yesButton);
    await cboard.expectButtonVisible(cboard.noButton);
    await cboard.expectButtonVisible(cboard.foodButton);
  });
});
