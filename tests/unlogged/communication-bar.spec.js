import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Communication Bar', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should verify Communication Bar works after clearing', async ({
    page
  }) => {
    // Add words to communication bar
    await cboard.yesButton.click();
    await cboard.noButton.click();

    // Clear the communication bar
    await cboard.clearCommunicationBar();

    // Now words should not be in communication bar
    await cboard.expectWordNotInCommunicationBar('yes');
    await cboard.expectWordNotInCommunicationBar('no');
  });

  test('should verify expectCommunicationBarEmpty works initially', async ({
    page
  }) => {
    // Initially communication bar should be empty
    await cboard.expectCommunicationBarEmpty();
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

  test('should maintain communication bar order', async ({ page }) => {
    // Add words in specific order
    await cboard.yesButton.click();
    await cboard.noButton.click();
    await cboard.navigateToCategory('food');
    await cboard.iWantButton.click();
    await cboard.pizzaButton.click();

    // Use backspace to remove items in reverse order
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('pizza');
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');
    await cboard.expectWordInCommunicationBar('I want');

    // Remove "I want" and verify order
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('I want');
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');

    // Remove "no" and verify order
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('no');
    await cboard.expectWordInCommunicationBar('yes');

    // Remove "yes" and verify communication bar is empty
    await cboard.backspaceInCommunicationBar();
    await cboard.expectCommunicationBarEmpty();
  });
});
