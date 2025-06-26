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
    // Verify essential communication buttons are present
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
    // Click 'yes' button using page object
    await cboard.yesButton.click();

    // Verify 'yes' appears in communication bar
    await cboard.expectWordInCommunicationBar('yes');

    // Verify Clear button becomes available
    await cboard.expectButtonVisible(cboard.clearButton); // Add another word
    await cboard.noButton.click();

    // Verify both words are in communication bar
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');
  });
  test('should clear communication bar when Clear button is clicked', async ({
    page
  }) => {
    // Add words to communication bar
    await cboard.yesButton.click();
    await cboard.noButton.click(); // Verify words are present and communication bar has content
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');

    // Click Clear button
    await cboard.clearCommunicationBar();

    // Verify communication bar is cleared (Clear button should not be visible)
    await cboard.expectButtonNotVisible(cboard.clearButton);
    await cboard.expectWordNotInCommunicationBar('yes');
    await cboard.expectWordNotInCommunicationBar('no');
  });
  test('should remove last word when Backspace is clicked', async ({
    page
  }) => {
    // Add multiple words
    await cboard.yesButton.click();
    await cboard.noButton.click();

    // Verify both words are present
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordInCommunicationBar('no');

    // Click Backspace - this should remove the last word ("no")
    await cboard.backspaceInCommunicationBar();

    // Verify the first word "yes" is still present (Clear button should still be visible)
    await cboard.expectWordInCommunicationBar('yes');
    await cboard.expectWordNotInCommunicationBar('no');
    await cboard.expectButtonVisible(cboard.clearButton); // Click Backspace again - this should remove the remaining word
    await cboard.backspaceInCommunicationBar();

    // Verify communication bar is completely empty
    await cboard.expectCommunicationBarEmpty();
  });
});
