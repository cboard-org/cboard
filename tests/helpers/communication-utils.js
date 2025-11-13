/**
 * Communication bar utilities for Cboard tests
 */

/**
 * Add a word to the communication bar
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} word - The word to add
 */
export async function addWordToCommunicationBar(page, word) {
  await page.getByRole('button', { name: word, exact: true }).click();
}

/**
 * Clear the communication bar
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function clearCommunicationBar(page) {
  await page.getByRole('button', { name: 'Clear' }).click();
}

/**
 * Remove the last word from communication bar using backspace
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
export async function backspaceInCommunicationBar(page) {
  await page.getByRole('button', { name: 'Backspace' }).click();
}

/**
 * Verify that text appears in the communication bar
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} text - The text to verify
 */
export async function verifyTextInCommunicationBar(page, text) {
  const { expect } = await import('@playwright/test');
  await expect(page.locator(`text="${text}"`).first()).toBeVisible();
}

/**
 * Verify that text does not appear in the communication bar
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} text - The text to verify is not present
 */
export async function verifyTextNotInCommunicationBar(page, text) {
  const { expect } = await import('@playwright/test');
  await expect(page.locator(`text="${text}"`).first()).not.toBeVisible();
}
