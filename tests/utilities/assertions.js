/**
 * Assertion utilities for Cboard tests
 */

import { expect } from '@playwright/test';

/**
 * Verify that a button is visible and enabled
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} buttonName - The button name to check
 */
export async function verifyButtonVisible(page, buttonName) {
  const button = page.getByRole('button', { name: buttonName });
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
}

/**
 * Verify that a button is disabled
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} buttonName - The button name to check
 */
export async function verifyButtonDisabled(page, buttonName) {
  const button = page.getByRole('button', { name: buttonName });
  await expect(button).toBeDisabled();
}

/**
 * Verify page title
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} title - Expected page title
 */
export async function verifyPageTitle(
  page,
  title = 'Cboard - AAC Communication Board'
) {
  await expect(page).toHaveTitle(title);
}

/**
 * Verify that a heading is visible
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} headingText - The heading text to verify
 */
export async function verifyHeadingVisible(page, headingText) {
  const heading = page.getByRole('heading', { name: headingText });
  await expect(heading).toBeVisible();
}

/**
 * Verify that an element has specific CSS property
 * @param {import('@playwright/test').Locator} element - The element to check
 * @param {string} property - The CSS property name
 * @param {string} value - The expected CSS property value
 */
export async function verifyCSSProperty(element, property, value) {
  await expect(element).toHaveCSS(property, value);
}
