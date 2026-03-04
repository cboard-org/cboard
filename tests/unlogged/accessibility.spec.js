import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Accessibility', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should be keyboard navigable', async ({ page }) => {
    await cboard.dismissOverlays();
    await page.waitForLoadState('networkidle');
    await cboard.yesButton.focus();
    await expect(cboard.yesButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(cboard.noButton).toBeFocused();
    const hasAnyFocusedElement = (await page.locator(':focus').count()) > 0;
    expect(hasAnyFocusedElement).toBe(true);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const stillHasFocusedElement = (await page.locator(':focus').count()) > 0;
    expect(stillHasFocusedElement).toBe(true);
  });
  test('should allow keyboard activation of buttons', async ({ page }) => {
    await cboard.buttons.yes.focus();
    await page.keyboard.press('Enter');
    await cboard.verifyCommunicationBarHasText('yes');
  });
  test('should have meaningful button text', async ({ page }) => {
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
    await cboard.clickButton('food');
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();
    await cboard.clickGoBackButton();
    await page.keyboard.press('Tab');
    const backPageFocusedElement = await page.locator(':focus').first();
    await expect(backPageFocusedElement).toBeVisible();
  });
  test('should handle disabled state properly', async ({ page }) => {
    const goBackButton = cboard.buttons.goBack;
    await expect(goBackButton).toBeVisible();
    await expect(goBackButton).toBeDisabled();
    await cboard.clickButton('food');
    await expect(goBackButton).toBeEnabled();
    await goBackButton.click();
    await expect(cboard.mainBoardHeading).toBeVisible();
    await expect(goBackButton).toBeVisible();
    await expect(goBackButton).toBeDisabled();
  });
});
