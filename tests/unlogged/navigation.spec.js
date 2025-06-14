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
  test('should navigate to emotions category', async ({ page }) => {
    await cboard.navigateToCategory('emotions');

    // Verify navigation to emotions board
    await cboard.expectButtonVisible(cboard.emotionsCategoryHeading);
    await cboard.expectButtonEnabled(cboard.goBackButton);
  });

  test('should navigate to activities category', async ({ page }) => {
    await cboard.navigateToCategory('activities');

    // Verify navigation to activities board
    await cboard.expectButtonVisible(cboard.activitiesCategoryHeading);
    await cboard.expectButtonEnabled(cboard.goBackButton);
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
  test('should navigate to multiple categories in sequence', async ({
    page
  }) => {
    const categories = [
      { name: 'drinks', expectedHeading: 'drinks' },
      { name: 'animals', expectedHeading: 'animals' },
      { name: 'toys', expectedHeading: 'toys' },
      { name: 'numbers', expectedHeading: 'numbers' }
    ];

    for (const category of categories) {
      // Navigate to main board first
      await cboard.goto();

      // Click category
      await cboard.navigateToCategory(category.name);

      // Verify navigation
      await cboard.expectButtonVisible(
        cboard.getCategoryHeading(category.expectedHeading)
      );
      await cboard.expectButtonEnabled(cboard.goBackButton);

      // Navigate back
      await cboard.navigateBack();
      await cboard.expectButtonVisible(cboard.mainBoardHeading);
    }
  });
});
