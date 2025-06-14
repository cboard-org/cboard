import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Accessibility', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should have proper ARIA roles and labels', async ({ page }) => {
    // Check for proper heading structure
    await cboard.verifyHomeHeadingVisible();

    // Check for button roles
    await cboard.verifyButtonVisible('yes');
    await cboard.verifyButtonVisible('no');
    await cboard.verifyButtonVisible('Backspace');
    await cboard.verifyButtonVisible('Go back');
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Focus on the first interactive element
    await page.keyboard.press('Tab');

    // Check if an element is focused
    const focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();

    // Continue tabbing through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify we can navigate through the page with keyboard
    const secondFocusedElement = await page.locator(':focus').first();
    await expect(secondFocusedElement).toBeVisible();
  });
  test('should allow keyboard activation of buttons', async ({ page }) => {
    // Tab to the 'yes' button and activate with Enter
    await cboard.buttons.yes.focus();
    await page.keyboard.press('Enter');

    // Verify the word was added to communication bar
    await cboard.verifyCommunicationBarHasText('yes');
  });
  test('should have meaningful button text', async ({ page }) => {
    // Verify buttons have descriptive text, not just icons
    const buttonTexts = [
      'yes',
      'no',
      'food',
      'drinks',
      'emotions',
      'activities',
      'Go back',
      'Login or Sign up',
      'Unlock',
      'Backspace'
    ];

    for (const buttonText of buttonTexts) {
      await cboard.verifyButtonVisible(buttonText);
    }
  });
  test('should maintain focus management in navigation', async ({ page }) => {
    // Navigate to food category
    await cboard.clickButton('food');

    // Verify focus is manageable on the new page
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();

    // Navigate back
    await cboard.clickGoBackButton();

    // Verify focus management after navigation
    await page.keyboard.press('Tab');
    const backPageFocusedElement = await page.locator(':focus').first();
    await expect(backPageFocusedElement).toBeVisible();
  });
  test('should have proper page titles', async ({ page }) => {
    // Check main page title
    await cboard.verifyPageTitle();

    // Navigate to food category and check title is maintained
    await cboard.clickButton('food');
    await cboard.verifyPageTitle();
  });
  test('should support high contrast and visual accessibility', async ({
    page
  }) => {
    // Verify buttons are visually distinct
    const yesButton = cboard.buttons.yes;
    const noButton = cboard.buttons.no;

    await expect(yesButton).toBeVisible();
    await expect(noButton).toBeVisible();

    // Verify buttons have proper visual states
    await expect(yesButton).toHaveCSS('cursor', 'pointer');
    await expect(noButton).toHaveCSS('cursor', 'pointer');
  });
  test('should handle disabled state properly', async ({ page }) => {
    // Check that Go back button is properly disabled on main page
    const goBackButton = cboard.buttons.goBack;
    await expect(goBackButton).toBeDisabled();

    // Navigate to a subcategory
    await cboard.clickButton('food');

    // Verify Go back button is now enabled
    await expect(goBackButton).toBeEnabled();

    // Verify disabled buttons can't be activated
    await cboard.goto();
    await expect(goBackButton).toBeDisabled();
  });
});
