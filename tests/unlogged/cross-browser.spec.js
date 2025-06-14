import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Cross-Browser Compatibility', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should load correctly in all browsers', async ({
    page,
    browserName
  }) => {
    // Verify basic page elements load regardless of browser
    await cboard.verifyPageTitle();
    await cboard.verifyHomeHeadingVisible();

    // Test core functionality across browsers
    await cboard.clickButton('yes');
    await cboard.verifyCommunicationBarHasText('yes');

    console.log(`Test passed in ${browserName}`);
  });
  test('should handle navigation consistently across browsers', async ({
    page,
    browserName
  }) => {
    // Test navigation in different browsers
    await cboard.clickButton('food');
    await cboard.verifyCategoryHeadingVisible('food');

    await cboard.clickButton('pizza');
    await cboard.verifyCommunicationBarHasText('pizza');

    await cboard.clickGoBackButton();
    await cboard.verifyHomeHeadingVisible();

    console.log(`Navigation test passed in ${browserName}`);
  });
  test('should maintain communication bar functionality across browsers', async ({
    page,
    browserName
  }) => {
    // Test communication bar in different browsers
    const words = ['yes', 'no', 'quick chat'];

    for (const word of words) {
      await cboard.clickButton(word);
      await cboard.verifyCommunicationBarHasText(word);
    }

    // Test Clear functionality
    await cboard.clickClearButton();
    await cboard.verifyCommunicationBarEmpty();

    console.log(`Communication bar test passed in ${browserName}`);
  });
  test('should handle button interactions consistently', async ({
    page,
    browserName
  }) => {
    // Test button states and interactions
    await expect(cboard.buttons.goBack).toBeDisabled();
    await expect(cboard.buttons.unlock).toBeEnabled();
    await expect(cboard.buttons.loginSignup).toBeEnabled();

    // Test unlock functionality
    await cboard.clickUnlockButton();
    await cboard.verifyUnlockMessageVisible();

    console.log(`Button interaction test passed in ${browserName}`);
  });
  test('should display categories consistently', async ({
    page,
    browserName
  }) => {
    // Verify all major categories are displayed
    const categories = [
      'yes',
      'no',
      'food',
      'drinks',
      'emotions',
      'activities',
      'body',
      'clothing',
      'people',
      'animals',
      'toys',
      'numbers'
    ];

    for (const category of categories) {
      await cboard.verifyButtonVisible(category);
    }

    console.log(`Category display test passed in ${browserName}`);
  });
});
