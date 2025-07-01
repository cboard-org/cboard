/**
 * Common test utilities for Cboard Playwright tests
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
}

/**
 * Wait for page to be ready for testing
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function waitForPageReady(page) {
  await page.waitForLoadState('networkidle');
  await dismissOverlays(page);
  // Small additional wait to ensure any animations are complete
  await page.waitForTimeout(500);
}

/**
 * Click a communication button by text, handling potential overlays
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} buttonText - The text of the button to click
 */
export async function clickCommunicationButton(page, buttonText) {
  await dismissOverlays(page);
  await page
    .locator(`button:has-text("${buttonText}")`)
    .first()
    .click();
}

/**
 * Navigate to the root board and wait for it to be ready
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function navigateToRoot(page) {
  await page.goto('/board/root');
  await waitForPageReady(page);
}
