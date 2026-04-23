import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe(
  'Cboard - Public Board Report Restriction for Unauthenticated Users',
  () => {
    let cboard;
    test.beforeEach(async ({ page }) => {
      cboard = createCboard(page);
      await cboard.goto();
    });
    test('should prevent unauthenticated users from reporting public boards', async ({
      page
    }) => {
      await cboard.openCommunicatorDialog();
      await cboard.navigateToPublicBoardsTab();
      const boardItems = await cboard.getPublicBoardItems();
      await expect(boardItems.first()).toBeVisible({ timeout: 15000 });
      const reportButton = await cboard.getReportButton(boardItems.first());
      await expect(reportButton).toBeDisabled();
      await expect(async () => {
        await reportButton.click({ timeout: 1000 });
      }).rejects.toThrow();
      const reportDialog = page.locator(
        '[role="dialog"]:has-text("Report this Board")'
      );
      await expect(reportDialog).not.toBeVisible();
    });
    test('should show disabled report buttons for all public boards', async ({
      page
    }) => {
      await cboard.openCommunicatorDialog();
      await cboard.navigateToPublicBoardsTab();
      const boardItems = await cboard.getPublicBoardItems();
      await expect(boardItems.first()).toBeVisible({ timeout: 15000 });
      const reportButtons = page.locator(
        'button[aria-label*="Report this Board"]'
      );
      const reportButtonCount = await reportButtons.count();
      expect(reportButtonCount).toBeGreaterThan(0);
      for (let i = 0; i < Math.min(reportButtonCount, 5); i++) {
        await expect(reportButtons.nth(i)).toBeDisabled();
      }
    });
    test('should prevent access to report functionality through keyboard navigation', async ({
      page
    }) => {
      await cboard.openCommunicatorDialog();
      await cboard.navigateToPublicBoardsTab();
      const boardItems = await cboard.getPublicBoardItems();
      await expect(boardItems.first()).toBeVisible({ timeout: 15000 });
      const reportButton = await cboard.getReportButton(boardItems.first());
      await expect(reportButton).toBeDisabled();
      await reportButton.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      const reportDialog = page.locator(
        '[role="dialog"]:has-text("Report this Board")'
      );
      await expect(reportDialog).not.toBeVisible();
    });
    test('should have proper accessibility attributes for disabled report buttons', async ({
      page
    }) => {
      await cboard.openCommunicatorDialog();
      await cboard.navigateToPublicBoardsTab();
      const boardItems = await cboard.getPublicBoardItems();
      await expect(boardItems.first()).toBeVisible({ timeout: 15000 });
      const reportButton = await cboard.getReportButton(boardItems.first());
      await expect(reportButton).toHaveAttribute(
        'aria-label',
        'Report this Board'
      );
      await expect(reportButton).toBeDisabled();
      await expect(reportButton).toHaveClass(/Mui-disabled/);
    });
  }
);
