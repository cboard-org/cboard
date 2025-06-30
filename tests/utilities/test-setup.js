/**
 * Common test setup and teardown utilities
 */

import { dismissOverlays } from '../helpers/overlay-utils.js';

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
 * Setup page for testing with common initialization
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {string} path - The path to navigate to (default: '/board/root')
 */
export async function setupTestPage(page, path = '/board/root') {
  await page.goto(path);
  await waitForPageReady(page);
}

/**
 * Set viewport size for mobile testing
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} size - Object with width and height properties
 */
export async function setMobileViewport(
  page,
  size = { width: 390, height: 844 }
) {
  await page.setViewportSize(size);
}

/**
 * Set viewport size for tablet testing
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} size - Object with width and height properties
 */
export async function setTabletViewport(
  page,
  size = { width: 768, height: 1024 }
) {
  await page.setViewportSize(size);
}

/**
 * Common test data for reuse across tests
 */
export const TestData = {
  CATEGORIES: [
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
  ],

  BASIC_WORDS: ['yes', 'no', 'quick chat'],

  FOOD_ITEMS: ['pizza', 'bread', 'soup', 'apple'],

  EMOTIONS: ['happy', 'sad', 'angry', 'excited'],

  PAGE_TITLE: 'Cboard - AAC Communication Board'
};
