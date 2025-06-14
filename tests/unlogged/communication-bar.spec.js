import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Communication Bar', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should build sentences in communication bar', async ({ page }) => {
    // Build a sentence: "yes I want pizza"
    await cboard.yesButton.click();
    await cboard.expectWordInCommunicationBar('yes');

    // Navigate to food category
    await cboard.navigateToCategory('food');

    // Add "I want"
    await cboard.iWantButton.click();
    await cboard.expectWordInCommunicationBar('I want');

    // Add "pizza"
    await cboard.pizzaButton.click();
    await cboard.expectWordInCommunicationBar('pizza');

    // Verify all words are in communication bar
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('I want');
    await cboard.expectWordInCommunicationBar('pizza');
  });
  test('should handle multiple quick selections', async ({ page }) => {
    const words = ['yes', 'no', 'quick chat'];

    for (const word of words) {
      await cboard.getButtonByName(word, true).click();
      await cboard.expectWordInCommunicationBar(word);
    }

    // Verify all words are present
    for (const word of words) {
      await cboard.expectWordInCommunicationBar(word);
    }
  });

  test('should maintain communication bar order', async ({ page }) => {
    // Add words in specific order
    await cboard.yesButton.click();
    await cboard.noButton.click();
    await cboard.quickChatButton.click();

    // Use backspace to remove items in reverse order
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('quick chat');
    await expect(page.locator('text="yes"').first()).toBeVisible();
    await expect(page.locator('text="no"').first()).toBeVisible();

    await page.getByRole('button', { name: 'Backspace' }).click();
    await expect(page.locator('text="no"').first()).not.toBeVisible();
    await expect(page.locator('text="yes"').first()).toBeVisible();

    await page.getByRole('button', { name: 'Backspace' }).click();
    await expect(page.locator('text="yes"').first()).not.toBeVisible();
  });

  test('should handle complex food sentences', async ({ page }) => {
    // Navigate to food category
    await page.getByRole('button', { name: 'food' }).click();

    // Build: "I'm hungry I want soup and bread"
    await page.getByRole('button', { name: "I'm hungry" }).click();
    await page.getByRole('button', { name: 'I want' }).click();
    await page.getByRole('button', { name: 'soup' }).click();
    await page.getByRole('button', { name: 'and' }).click();
    await page.getByRole('button', { name: 'bread' }).click();

    // Verify complete sentence
    await expect(page.locator('text="I\'m hungry"').first()).toBeVisible();
    await expect(page.locator('text="I want"').first()).toBeVisible();
    await expect(page.locator('text="soup"').first()).toBeVisible();
    await expect(page.locator('text="and"').first()).toBeVisible();
    await expect(page.locator('text="bread"').first()).toBeVisible();
  });

  test('should handle negative expressions', async ({ page }) => {
    // Navigate to food category
    await page.getByRole('button', { name: 'food' }).click();

    // Build: "I dislike soup"
    await page.getByRole('button', { name: 'I dislike' }).click();
    await page.getByRole('button', { name: 'soup' }).click();

    // Verify expression
    await expect(page.locator('text="I dislike"').first()).toBeVisible();
    await expect(page.locator('text="soup"').first()).toBeVisible();
  });

  test('should show Clear and Backspace buttons only when communication bar has content', async ({
    page
  }) => {
    // Initially, Clear button should not be visible
    await expect(page.getByRole('button', { name: 'Clear' })).not.toBeVisible();

    // Add a word
    await page.getByRole('button', { name: 'yes', exact: true }).click();

    // Clear and Backspace should be visible
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Backspace' })).toBeVisible();

    // Clear all
    await page.getByRole('button', { name: 'Clear' }).click();

    // Clear button should be hidden again
    await expect(page.getByRole('button', { name: 'Clear' })).not.toBeVisible();
  });
});
