import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Navigation', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should navigate to food category and back', async ({ page }) => {
    // Click on food category
    await cboard.navigateToCategory('food');

    // Verify navigation to food board
    await cboard.expectButtonVisible(cboard.foodCategoryHeading);
    await expect(page).toHaveURL(/\/board\/r1-FTvnvaW/);

    // Verify Go back button is enabled
    await cboard.expectButtonEnabled(cboard.goBackButton);

    // Verify food items are present
    await cboard.expectButtonVisible(cboard.pizzaButton);
    await cboard.expectButtonVisible(cboard.breadButton);
    await cboard.expectButtonVisible(cboard.soupButton);
    await cboard.expectButtonVisible(cboard.imHungryButton);

    // Navigate back to main board
    await cboard.navigateBack();

    // Verify we're back on the main board
    await cboard.expectButtonVisible(cboard.mainBoardHeading);
    await expect(page).toHaveURL(/\/board\/root/);
    await cboard.expectButtonDisabled(cboard.goBackButton);
  });
  test('should maintain communication bar across navigation', async ({
    page
  }) => {
    // Add word to communication bar
    await cboard.yesButton.click();
    await cboard.expectWordInCommunicationBar('yes');

    // Navigate to food category
    await cboard.navigateToCategory('food'); // Verify communication bar is maintained
    await cboard.expectWordInCommunicationBar('yes');

    // Add food item
    await cboard.pizzaButton.click();

    // Verify both items are in communication bar
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('pizza');

    // Navigate back
    await cboard.navigateBack();

    // Verify communication bar is still maintained
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('pizza');
  });
});
