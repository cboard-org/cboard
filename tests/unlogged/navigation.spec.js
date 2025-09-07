import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Navigation', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should navigate to food category and back', async ({ page }) => {
    await cboard.navigateToCategory('food');
    await cboard.expectButtonVisible(cboard.foodCategoryHeading);
    await expect(page).toHaveURL(/\/board\/r1-FTvnvaW/);
    await cboard.expectButtonEnabled(cboard.goBackButton);
    await cboard.expectButtonVisible(cboard.pizzaButton);
    await cboard.expectButtonVisible(cboard.breadButton);
    await cboard.expectButtonVisible(cboard.soupButton);
    await cboard.expectButtonVisible(cboard.imHungryButton);
    await cboard.navigateBack();
    await cboard.expectButtonVisible(cboard.mainBoardHeading);
    await expect(page).toHaveURL(/\/board\/root/);
    await cboard.expectButtonDisabled(cboard.goBackButton);
  });
  test('should maintain communication bar across navigation', async ({
    page
  }) => {
    await cboard.yesButton.click();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.navigateToCategory('food');
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.pizzaButton.click();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('pizza');
    await cboard.navigateBack();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('pizza');
  });
});
