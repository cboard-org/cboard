import { test } from '@playwright/test';
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
    await cboard.yesButton.click();
    await cboard.noButton.click();
    await cboard.clearCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('yes');
    await cboard.expectWordNotInCommunicationBar('no');
  });
  test('should verify expectCommunicationBarEmpty works initially', async ({
    page
  }) => {
    await cboard.expectCommunicationBarEmpty();
  });
  test('should build sentences in communication bar', async ({ page }) => {
    await cboard.yesButton.click();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.navigateToCategory('food');
    await cboard.iWantButton.click();
    await cboard.expectWordInCommunicationBar('I want');
    await cboard.pizzaButton.click();
    await cboard.expectWordInCommunicationBar('pizza');
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('I want');
    await cboard.expectWordInCommunicationBar('pizza');
  });
  test('should maintain communication bar order', async ({ page }) => {
    await cboard.yesButton.click();
    await cboard.noButton.click();
    await cboard.navigateToCategory('food');
    await cboard.iWantButton.click();
    await cboard.pizzaButton.click();
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('pizza');
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');
    await cboard.expectWordInCommunicationBar('I want');
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('I want');
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordNotInCommunicationBar('no');
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.backspaceInCommunicationBar();
    await cboard.expectCommunicationBarEmpty();
  });
});
