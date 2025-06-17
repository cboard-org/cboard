import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Security Features', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
  });
  test('should require unlocking before accessing login', async ({ page }) => {
    // Try to click Login without unlocking
    await cboard.clickLogin();

    // Verify locked message appears
    await cboard.expectButtonVisible(cboard.lockedProfileAlert);
  });

  test('should show unlock progress when clicking unlock button', async ({
    page
  }) => {
    // Click unlock button
    await cboard.clickUnlock();

    // Verify unlock message appears
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
  });
  test('should maintain unlock message for five seconds on a single click', async ({
    page
  }) => {
    // Click unlock button and check if there's any unlock feedback
    await cboard.clickUnlock();

    // verify unlock message appears during 5 seconds after clicking
    for (let i = 0; i < 5; i++) {
      if (i < 4) {
        // Verify unlock message appears
        await cboard.expectButtonVisible(cboard.unlockClicksAlert);
        await page.waitForTimeout(1600);
      } else {
        // After 2 seconds, the message should not be visible
        await expect(page.locator('[role="alert"]')).not.toBeVisible({
          timeout: 1
        });
      }
    }
  });

  test('should have unlock and login buttons visible', async ({ page }) => {
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonVisible(cboard.loginButton);
  });

  test('should show unlock message persists across navigation', async ({
    page
  }) => {
    // Click unlock to show message
    await cboard.clickUnlock();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
    // Navigate to food category
    await cboard.navigateToCategory('food');

    // Verify unlock button is still functional
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);

    // Navigate back
    await cboard.navigateBack();

    // Verify we're back on main page and unlock still works
    await expect(cboard.mainBoardHeading).toBeVisible();
    await expect(cboard.unlockButton).toBeEnabled();
    await cboard.expectButtonVisible(cboard.unlockClicksAlert);
  });
  test('should reveal settings and advanced features after 4 consecutive clicks on unlock button', async ({
    page
  }) => {
    // Verify initial locked state - only basic buttons should be visible
    await cboard.expectButtonVisible(cboard.unlockButton);
    await cboard.expectButtonVisible(cboard.loginButton);

    // Verify settings and advanced features are not visible initially
    await expect(
      page.getByRole('button', { name: 'Settings' })
    ).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Print Board' })
    ).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Full screen' })
    ).not.toBeVisible();

    // Perform 4 consecutive clicks on unlock button
    for (let i = 1; i <= 4; i++) {
      await cboard.clickUnlock();

      if (i < 4) {
        // Before 4th click, should show progress but settings still locked
        await cboard.expectButtonVisible(cboard.unlockClicksAlert);
        await expect(
          page.getByRole('button', { name: 'Settings' })
        ).not.toBeVisible();
      }
    }

    // After 4th click, verify advanced features are now visible
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Print Board' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Full screen' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'User Help' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Lock' })).toBeVisible();

    // Verify navigation tabs are available
    await expect(page.getByRole('button', { name: 'Boards' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Build' })).toBeVisible();

    // Verify edit functionality is available
    await expect(
      page.getByRole('button', { name: 'edit-board-tiles' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Tile' })).toBeVisible();

    // Test Settings functionality
    await page.getByRole('button', { name: 'Settings' }).click();

    // Verify settings dialog opens with main categories
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Language' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Speech' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Display' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Symbols' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Scanning' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Navigation and Buttons' })
    ).toBeVisible();

    // Test Display settings specifically
    await page.getByRole('button', { name: 'Display' }).click();
    await expect(page.getByRole('heading', { name: 'Display' })).toBeVisible();

    // Verify key display options are available
    await expect(page.locator('text=UI Size')).toBeVisible();
    await expect(page.locator('text=Font family')).toBeVisible();
    await expect(page.locator('text=Font Size')).toBeVisible();
    await expect(page.locator('text=Enable dark theme')).toBeVisible();
    await expect(page.locator('text=Label Position')).toBeVisible();

    // Go back to main settings
    await page.getByRole('button', { name: 'Go back' }).click();

    // Test Speech settings
    await page.getByRole('button', { name: 'Speech' }).click();
    await expect(page.getByRole('heading', { name: 'Speech' })).toBeVisible();

    // Verify speech options are available
    await expect(page.getByRole('button', { name: 'Voice' })).toBeVisible();
    await expect(page.locator('text=Pitch')).toBeVisible();
    await expect(page.locator('text=Rate')).toBeVisible();

    // Return to main board
    await page.getByRole('button', { name: 'Go back' }).click();
    await page.getByRole('button', { name: 'Go back' }).click();

    // Verify we're back on the main board with advanced features still visible
    await expect(cboard.mainBoardHeading).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Lock' })).toBeVisible();
  });

  test('should lock settings again when lock button is clicked', async ({
    page
  }) => {
    // First unlock the settings (4 clicks)
    for (let i = 1; i <= 4; i++) {
      await cboard.clickUnlock();
    }

    // Verify settings are unlocked
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Lock' })).toBeVisible();

    // Click the lock button
    await page.getByRole('button', { name: 'Lock' }).click();

    // Verify settings are locked again
    await expect(
      page.getByRole('button', { name: 'Settings' })
    ).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Lock' })).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Print Board' })
    ).not.toBeVisible();

    // Verify unlock button is visible again
    await cboard.expectButtonVisible(cboard.unlockButton);
  });
});
