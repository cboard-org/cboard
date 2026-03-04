import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Basic Functionality', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should load the main board page', async ({ page }) => {
    await expect(page).toHaveTitle('Cboard - AAC Communication Board');
    await cboard.expectButtonVisible(cboard.mainBoardHeading);
  });
  test('should display communication categories', async ({ page }) => {
    await cboard.expectButtonVisible(cboard.yesButton);
    await cboard.expectButtonVisible(cboard.noButton);
    await cboard.expectButtonVisible(cboard.foodButton);
    await cboard.expectButtonVisible(cboard.drinksButton);
    await cboard.expectButtonVisible(cboard.emotionsButton);
    await cboard.expectButtonVisible(cboard.peopleButton);
    await cboard.expectButtonVisible(cboard.bodyButton);
    await cboard.expectButtonVisible(cboard.activitiesButton);
  });
  test('should have navigation controls', async ({ page }) => {
    await cboard.expectButtonDisabled(cboard.goBackButton);
    await cboard.expectButtonVisible(cboard.loginButton);
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonVisible(cboard.backspaceButton);
  });
  test('should add words to communication bar when clicked', async ({
    page
  }) => {
    await cboard.yesButton.click();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectButtonVisible(cboard.clearButton);
    await cboard.noButton.click();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');
  });
  test('should clear communication bar when Clear button is clicked', async ({
    page
  }) => {
    await cboard.yesButton.click();
    await cboard.noButton.click();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');
    await cboard.clearCommunicationBar();
    await cboard.expectButtonNotVisible(cboard.clearButton);
    await cboard.expectWordNotInCommunicationBar('yes');
    await cboard.expectWordNotInCommunicationBar('no');
  });
  test('should remove last word when Backspace is clicked', async ({
    page
  }) => {
    await cboard.yesButton.click();
    await cboard.noButton.click();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');
    await cboard.backspaceInCommunicationBar();
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordNotInCommunicationBar('no');
    await cboard.expectButtonVisible(cboard.clearButton);
    await cboard.backspaceInCommunicationBar();
    await cboard.expectCommunicationBarEmpty();
  });
});
