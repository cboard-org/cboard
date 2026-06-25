import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Sync Changes', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.dismissTourPopup();
  });

  test('should display the unauthenticated edit modal when unlocking without login', async ({
    page
  }) => {
    await cboard.unlockAsGuest();
    await expect(cboard.unauthenticatedEditModal).toBeVisible({
      timeout: 10000
    });
    await cboard.continueEditingButton.click();
    await expect(cboard.unauthenticatedEditModal).not.toBeVisible({
      timeout: 5000
    });
    await cboard.dismissTourPopup();
    await cboard.addSimpleTile(`local-${Date.now()}`, { skipUnlock: true });
  });

  test('should discard local changes and load remote boards when an existing user logs in', async () => {
    let localTileName = `sync-${Date.now()}`;
    await cboard.addSimpleTile(localTileName);
    await cboard.expectTileOnBoard(localTileName);
    await cboard.loginWithTestCredentials();
    let remoteTileName = `sync-${Date.now()}`;
    await cboard.addSimpleTile(remoteTileName);
    await cboard.expectTileOnBoard(remoteTileName);
    await cboard.expectSyncButtonVisible();
    await cboard.triggerSyncIfNeeded();
    await cboard.expectSyncButtonSynced({ timeout: 45000 });
    await cboard.performLogout();
    await cboard.goto();
    await cboard.expectTileNotOnBoard(remoteTileName);
    await cboard.expectTileNotOnBoard(localTileName);
  });

  test('should show a pending sync state immediately after creating a tile', async ({
    page
  }) => {
    await cboard.loginWithTestCredentials();
    await cboard.unlockAsGuest();
    await cboard.dismissTourPopup();
    await cboard.addSimpleTile(`sync-${Date.now()}`, { skipUnlock: true });
    await expect(
      page.locator('.SyncButton--saving, .SyncButton--savedLocally')
    ).toBeVisible({ timeout: 15000 });
  });

  test('should return to "Synced" state after changes are uploaded to the server', async () => {
    await cboard.loginWithTestCredentials();
    await cboard.unlockAsGuest();
    await cboard.dismissTourPopup();
    await cboard.addSimpleTile(`sync-${Date.now()}`, { skipUnlock: true });
    await cboard.expectSyncButtonSynced({ timeout: 30000 });
  });

  /**
   * Scenario 7 — Active board not found in remote account after login
   *
   * Precondition: User is navigating a locally created board that does not
   * exist in the remote account.
   * After login the app must redirect to the root board without crashing.
   *
   * Skipped: requires complex state setup (local board absent from remote).
   */
  test.skip('should redirect to the root board without crashing when the active local board does not exist remotely', async () => {});

  /**
   * Scenario 8 — OAuth login (Google / Facebook) with local changes
   *
   * Precondition: User has local changes and signs in via OAuth.
   * Behaviour must be identical to email/password login.
   *
   * Skipped: requires real OAuth interaction which cannot be automated.
   */
  test.skip('should behave identically to email login when signing in via OAuth with pending local changes', async () => {});

  /**
   * Scenario 9 — Register from the warning modal
   *
   * Precondition: User is not logged in.
   * Clicking "Login or Sign Up" in the warning modal must redirect to the
   * login page.  Completing a new registration must preserve the prior local
   * changes (the full registration sub-case is skipped to avoid polluting data).
   */

  test('should redirect to the login page when "Login or Sign Up" is clicked in the warning modal', async ({
    page
  }) => {
    await cboard.unlockAsGuest();
    await expect(cboard.unauthenticatedEditModal).toBeVisible({
      timeout: 10000
    });
    await page.getByRole('button', { name: 'Login or Sign Up' }).click();
    await expect(page).toHaveURL(/login-signup/, { timeout: 10000 });
  });

  test.skip('should preserve local changes made before the modal when registering a new account', async () => {});
});
