/**
 * Navigation utilities for Cboard tests
 */

/**
 * Navigate to the root board and wait for it to be ready
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function navigateToRoot(page) {
  await page.goto('/board/root');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to a specific category by name
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} categoryName - Name of the category to navigate to
 */
export async function navigateToCategory(page, categoryName) {
  await page.getByRole('button', { name: categoryName }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Go back to the previous page
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function goBack(page) {
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.waitForLoadState('networkidle');
}
