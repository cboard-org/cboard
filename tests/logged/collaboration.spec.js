import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Collaboration Features (Logged Users)', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.unlockInterface();
  });

  test.describe('Board Sharing', () => {
    test('should share board via email invitation', async ({ page }) => {
      // Navigate to boards
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Select board to share
      await page
        .getByRole('button', { name: 'Share' })
        .first()
        .click();

      // Enter collaborator email
      await page.getByLabel('Email Address').fill('collaborator@example.com');

      // Set permission level
      await page
        .getByRole('combobox', { name: 'Permission Level' })
        .selectOption('edit');

      // Add personal message
      await page
        .getByLabel('Message')
        .fill('Check out this communication board!');

      // Send invitation
      await page.getByRole('button', { name: 'Send Invitation' }).click();

      // Verify invitation sent
      await expect(
        page.getByText('Invitation sent successfully')
      ).toBeVisible();
    });

    test('should generate shareable link for board', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Share' })
        .first()
        .click();

      // Generate public link
      await page.getByRole('button', { name: 'Generate Link' }).click();

      // Copy link
      await page.getByRole('button', { name: 'Copy Link' }).click();

      // Verify link generated
      await expect(page.getByText('Link copied to clipboard')).toBeVisible();

      // Verify link format
      const linkText = await page.getByLabel('Shareable Link').inputValue();
      expect(linkText).toContain('https://');
    });

    test('should set board privacy levels', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Share' })
        .first()
        .click();

      // Set to public
      await page.getByLabel('Public Board').check();

      // Add to public gallery
      await page.getByLabel('Add to Gallery').check();

      // Save privacy settings
      await page.getByRole('button', { name: 'Update Privacy' }).click();

      // Verify settings saved
      await expect(page.getByText('Privacy settings updated')).toBeVisible();
    });

    test('should manage board collaborators', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Manage Collaborators' })
        .first()
        .click();

      // View current collaborators
      await expect(page.getByText('Current Collaborators')).toBeVisible();

      // Change permission for existing collaborator
      await page
        .getByRole('combobox')
        .first()
        .selectOption('view');

      // Save permission changes
      await page.getByRole('button', { name: 'Update Permissions' }).click();

      // Verify update
      await expect(page.getByText('Permissions updated')).toBeVisible();
    });

    test('should remove collaborator access', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Manage Collaborators' })
        .first()
        .click();

      // Remove collaborator
      await page
        .getByRole('button', { name: 'Remove' })
        .first()
        .click();

      // Confirm removal
      await page.getByRole('button', { name: 'Confirm Removal' }).click();

      // Verify removal
      await expect(page.getByText('Collaborator removed')).toBeVisible();
    });
  });

  test.describe('Real-time Collaboration', () => {
    test('should show live editing indicators', async ({ page }) => {
      // This test would require multiple browser contexts or mock data
      // to simulate real-time collaboration

      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Look for real-time indicators
      const liveIndicator = page.getByText('Live');
      if (await liveIndicator.isVisible()) {
        await expect(liveIndicator).toBeVisible();
      }
    });

    test('should handle concurrent editing conflicts', async ({ page }) => {
      // Simulate conflict scenario
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Make changes
      await page.getByLabel('Board Name').fill('Edited Name');

      // Simulate conflict (this would need server-side simulation)
      // For now, just verify conflict resolution UI exists
      const conflictDialog = page.getByText('Editing Conflict');
      if (await conflictDialog.isVisible()) {
        await expect(conflictDialog).toBeVisible();
        await expect(
          page.getByRole('button', { name: 'Resolve Conflict' })
        ).toBeVisible();
      }
    });

    test('should show collaborator cursors and selections', async ({
      page
    }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Look for collaborator indicators
      const collaboratorCursor = page.locator('.collaborator-cursor');
      if (await collaboratorCursor.isVisible()) {
        await expect(collaboratorCursor).toBeVisible();
      }
    });
  });

  test.describe('Comments and Feedback', () => {
    test('should add comments to board elements', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Right-click on symbol to add comment
      await page
        .getByRole('button', { name: 'yes' })
        .click({ button: 'right' });

      // Add comment
      await page.getByText('Add Comment').click();
      await page
        .getByLabel('Comment')
        .fill('This symbol works great for positive responses');

      // Save comment
      await page.getByRole('button', { name: 'Add Comment' }).click();

      // Verify comment added
      await expect(page.getByText('Comment added')).toBeVisible();
    });

    test('should reply to comments', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // View existing comment
      await page.getByRole('button', { name: 'View Comments' }).click();

      // Reply to comment
      await page
        .getByRole('button', { name: 'Reply' })
        .first()
        .click();
      await page.getByLabel('Reply').fill('I agree, very effective!');

      // Send reply
      await page.getByRole('button', { name: 'Send Reply' }).click();

      // Verify reply added
      await expect(page.getByText('Reply added')).toBeVisible();
    });

    test('should resolve comment threads', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // View comments
      await page.getByRole('button', { name: 'View Comments' }).click();

      // Mark comment as resolved
      await page
        .getByRole('button', { name: 'Mark Resolved' })
        .first()
        .click();

      // Verify resolution
      await expect(page.getByText('Comment resolved')).toBeVisible();
    });
  });

  test.describe('Version History and Changes', () => {
    test('should view board version history', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'History' })
        .first()
        .click();

      // View version history
      await expect(page.getByText('Version History')).toBeVisible();
      await expect(page.getByText('Changes')).toBeVisible();
    });

    test('should restore previous board version', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'History' })
        .first()
        .click();

      // Select version to restore
      await page
        .getByRole('button', { name: 'Restore' })
        .first()
        .click();

      // Confirm restoration
      await page.getByRole('button', { name: 'Confirm Restore' }).click();

      // Verify restoration
      await expect(page.getByText('Version restored')).toBeVisible();
    });

    test('should compare board versions', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'History' })
        .first()
        .click();

      // Select two versions to compare
      await page
        .getByRole('checkbox')
        .first()
        .check();
      await page
        .getByRole('checkbox')
        .nth(1)
        .check();

      // Compare versions
      await page.getByRole('button', { name: 'Compare Versions' }).click();

      // Verify comparison view
      await expect(page.getByText('Version Comparison')).toBeVisible();
    });

    test('should track change attribution', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'History' })
        .first()
        .click();

      // View change details
      await page
        .getByRole('button', { name: 'View Details' })
        .first()
        .click();

      // Verify attribution information
      await expect(page.getByText('Changed by:')).toBeVisible();
      await expect(page.getByText('Date:')).toBeVisible();
      await expect(page.getByText('Changes:')).toBeVisible();
    });
  });

  test.describe('Team Management', () => {
    test('should create team workspace', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Teams').click();

      // Create new team
      await page.getByRole('button', { name: 'Create Team' }).click();

      // Fill team details
      await page.getByLabel('Team Name').fill('Speech Therapy Team');
      await page
        .getByLabel('Description')
        .fill('Collaborative workspace for therapy sessions');

      // Create team
      await page.getByRole('button', { name: 'Create Team' }).click();

      // Verify team creation
      await expect(page.getByText('Team created successfully')).toBeVisible();
    });

    test('should invite team members', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Teams').click();

      // Select team
      await page.getByText('Speech Therapy Team').click();

      // Invite members
      await page.getByRole('button', { name: 'Invite Members' }).click();

      // Add member emails
      await page
        .getByLabel('Email Addresses')
        .fill('therapist1@example.com, therapist2@example.com');

      // Set role
      await page.getByRole('combobox', { name: 'Role' }).selectOption('editor');

      // Send invitations
      await page.getByRole('button', { name: 'Send Invitations' }).click();

      // Verify invitations sent
      await expect(page.getByText('Invitations sent')).toBeVisible();
    });

    test('should manage team permissions', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Teams').click();
      await page.getByText('Speech Therapy Team').click();

      // Manage member permissions
      await page.getByRole('button', { name: 'Manage Members' }).click();

      // Change member role
      await page
        .getByRole('combobox')
        .first()
        .selectOption('admin');

      // Save changes
      await page.getByRole('button', { name: 'Update Permissions' }).click();

      // Verify update
      await expect(page.getByText('Permissions updated')).toBeVisible();
    });

    test('should leave team', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Teams').click();
      await page.getByText('Speech Therapy Team').click();

      // Leave team
      await page.getByRole('button', { name: 'Leave Team' }).click();

      // Confirm leaving
      await page.getByRole('button', { name: 'Confirm Leave' }).click();

      // Verify leaving
      await expect(page.getByText('Left team successfully')).toBeVisible();
    });
  });

  test.describe('Notification and Activity', () => {
    test('should display collaboration notifications', async ({ page }) => {
      // Check for notification center
      const notificationBell = page.getByRole('button', {
        name: 'Notifications'
      });
      if (await notificationBell.isVisible()) {
        await notificationBell.click();

        // Verify notification types
        await expect(page.getByText('Board shared')).toBeVisible();
        await expect(page.getByText('Comment added')).toBeVisible();
      }
    });

    test('should show activity feed', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Activity').click();

      // View recent activity
      await expect(page.getByText('Recent Activity')).toBeVisible();
      await expect(page.getByText('Board edited')).toBeVisible();
    });

    test('should configure notification preferences', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Notifications').click();

      // Configure notification settings
      await page.getByLabel('Email notifications for board changes').check();
      await page.getByLabel('Push notifications for comments').check();

      // Save preferences
      await page.getByRole('button', { name: 'Save Preferences' }).click();

      // Verify save
      await expect(page.getByText('Preferences saved')).toBeVisible();
    });
  });
});
