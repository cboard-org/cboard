import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Accessibility', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should be keyboard navigable', async ({ page }) => {
    // Ensure overlays are dismissed first
    await cboard.dismissOverlays();

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Focus on a specific button to start keyboard navigation
    await cboard.yesButton.focus();

    // Verify the button is focused
    await expect(cboard.yesButton).toBeFocused();

    // Continue tabbing through elements
    await page.keyboard.press('Tab');

    // Verify the button is focused
    await expect(cboard.noButton).toBeFocused();

    // Look for any focused element (could be various buttons)
    const hasAnyFocusedElement = (await page.locator(':focus').count()) > 0;
    expect(hasAnyFocusedElement).toBe(true);

    // Try to focus on another specific element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify keyboard navigation works by checking we can still find focused elements
    const stillHasFocusedElement = (await page.locator(':focus').count()) > 0;
    expect(stillHasFocusedElement).toBe(true);
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
  test('should handle disabled state properly', async ({ page }) => {
    // First, check if Go back button exists and get its current state
    const goBackButton = cboard.buttons.goBack;
    await expect(goBackButton).toBeVisible();
    await expect(goBackButton).toBeDisabled();

    // Navigate to a subcategory first to see the enabled state
    await cboard.clickButton('food');
    await expect(goBackButton).toBeEnabled();

    // Go back to main page
    await goBackButton.click();
    await expect(cboard.mainBoardHeading).toBeVisible();
    await expect(goBackButton).toBeVisible();
    await expect(goBackButton).toBeDisabled();
  });
});
