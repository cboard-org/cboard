import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Board Sync', () => {
  let cboard;

  test.describe('SyncButton states', () => {
    test.beforeEach(async ({ page }) => {
      cboard = createCboard(page);
      await cboard.loginWithTestCredentials();
      await cboard.unlockAsGuest();
      await cboard.dismissTourPopup();
    });

    test('should display the SyncButton in the toolbar when logged in', async () => {
      await cboard.expectSyncButtonVisible();
    });

    test('should show "Synced" state when all boards are up to date', async () => {
      await cboard.expectSyncButtonSynced();
    });

    test('should reflect a pending sync state immediately after tile creation', async ({
      page
    }) => {
      await cboard.addSimpleTile(`sync-test-${Date.now()}`, {
        skipUnlock: true
      });
      await expect(
        page.locator('.SyncButton--saving, .SyncButton--savedLocally')
      ).toBeVisible({ timeout: 15000 });
    });

    test('should show "Working Offline" when app goes offline with pending boards', async ({
      page
    }) => {
      await cboard.addSimpleTile(`offline-test-${Date.now()}`, {
        skipUnlock: true
      });
      // Wait for pending sync state before going offline to ensure boards are
      // still pending when offline is set (avoids race where API syncs first).
      await expect(
        page.locator('.SyncButton--saving, .SyncButton--savedLocally')
      ).toBeVisible({ timeout: 15000 });
      await page.context().setOffline(true);

      await cboard.expectSyncButtonWorkingOffline();

      await page.context().setOffline(false);
    });

    test('should show "Offline" when the app loses connectivity with no pending changes', async ({
      page
    }) => {
      await cboard.waitForTimeout(2000);

      await page.context().setOffline(true);
      await cboard.expectSyncButtonOffline();

      await page.context().setOffline(false);
    });
  });
});
