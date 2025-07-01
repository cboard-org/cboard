/**
 * Utility functions for handling overlays and modals in Cboard tests
 */

/**
 * Dismiss any tutorial overlays or modals that might interfere with tests
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function dismissOverlays(page) {
  try {
    // Try to dismiss react-joyride overlay
    await page.locator('[data-test-id="overlay"]').click({ timeout: 2000 });
  } catch (e) {
    // Overlay not present, continue
  }

  try {
    // Try to dismiss any other modal overlays
    await page.locator('.MuiBackdrop-root').click({ timeout: 1000 });
  } catch (e) {
    // No modal present, continue
  }

  // Handle React Joyride overlays
  try {
    await page
      .locator('[id^="react-joyride-step-"]')
      .waitFor({ timeout: 2000 });
    await page.keyboard.press('Escape');
  } catch (e) {
    // No Joyride overlay present, continue
  }

  // Try to close any Joyride by clicking skip or close buttons
  try {
    const skipButton = page.locator('button:has-text("Skip")');
    if (await skipButton.isVisible({ timeout: 1000 })) {
      await skipButton.click();
    }
  } catch (e) {
    // No skip button, continue
  }

  try {
    const closeButton = page.locator('button:has-text("Close")');
    if (await closeButton.isVisible({ timeout: 1000 })) {
      await closeButton.click();
    }
  } catch (e) {
    // No close button, continue
  }
}

/**
 * Dismiss notification toasts or alerts
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function dismissNotifications(page) {
  try {
    const notificationClose = page.locator('[data-testid="CloseIcon"]');
    await notificationClose.click({ timeout: 1000 });
  } catch (e) {
    // No notification to close
  }
}
