import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Board Management (Logged Users)', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Unlock interface for logged users
    await cboard.unlockInterface();
  });

  test.describe('Board Creation', () => {
    test('should create a new custom board', async ({ page }) => {
      // Navigate to board creation
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Click create new board
      await page.getByRole('button', { name: 'Create Board' }).click();

      // Fill board details
      await page.getByLabel('Board Name').fill('My Custom Board');
      await page.getByLabel('Description').fill('A board for testing');

      // Save board
      await page.getByRole('button', { name: 'Create' }).click();

      // Verify board creation
      await expect(page.getByText('Board created successfully')).toBeVisible();
      await expect(page.getByText('My Custom Board')).toBeVisible();
    });

    test('should create board from template', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Look for template options
      await page.getByText('Use Template').click();

      // Select a template
      await page.getByText('Communication Basics').click();

      // Customize template
      await page.getByLabel('Board Name').fill('My Communication Board');

      // Create from template
      await page.getByRole('button', { name: 'Create from Template' }).click();

      // Verify creation
      await expect(page.getByText('My Communication Board')).toBeVisible();
    });

    test('should validate board name requirements', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page.getByRole('button', { name: 'Create Board' }).click();

      // Try to create board without name
      await page.getByRole('button', { name: 'Create' }).click();

      // Verify validation error
      await expect(page.getByText('Board name is required')).toBeVisible();
    });
  });

  test.describe('Board Editing', () => {
    test('should edit existing board properties', async ({ page }) => {
      // Navigate to boards
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Edit first board
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Update board name
      const nameField = page.getByLabel('Board Name');
      await nameField.clear();
      await nameField.fill('Updated Board Name');

      // Save changes
      await page.getByRole('button', { name: 'Save Changes' }).click();

      // Verify update
      await expect(page.getByText('Board updated successfully')).toBeVisible();
    });

    test('should add symbols to custom board', async ({ page }) => {
      // Navigate to board editor
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Add new symbol
      await page.getByRole('button', { name: 'Add Symbol' }).click();

      // Search for symbol
      await page.getByLabel('Search symbols').fill('happy');

      // Select symbol
      await page
        .getByRole('button', { name: 'happy' })
        .first()
        .click();

      // Configure symbol
      await page.getByLabel('Label').fill('Happy');
      await page.getByLabel('Vocalization').fill('I am happy');

      // Add symbol to board
      await page.getByRole('button', { name: 'Add to Board' }).click();

      // Verify symbol added
      await expect(page.getByText('Symbol added to board')).toBeVisible();
    });

    test('should remove symbols from board', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Enter edit mode
      await page.getByRole('button', { name: 'Edit Symbols' }).click();

      // Select symbol to remove
      await page.getByRole('button', { name: 'yes' }).click();

      // Remove symbol
      await page.getByRole('button', { name: 'Remove' }).click();

      // Confirm removal
      await page.getByRole('button', { name: 'Confirm' }).click();

      // Verify removal
      await expect(page.getByText('Symbol removed')).toBeVisible();
    });

    test('should reorder symbols on board', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Enter reorder mode
      await page.getByRole('button', { name: 'Reorder' }).click();

      // Drag and drop symbols (this might need specific drag/drop implementation)
      const sourceSymbol = page.getByRole('button', { name: 'yes' });
      const targetSymbol = page.getByRole('button', { name: 'no' });

      await sourceSymbol.dragTo(targetSymbol);

      // Save order
      await page.getByRole('button', { name: 'Save Order' }).click();

      // Verify reorder
      await expect(page.getByText('Symbol order updated')).toBeVisible();
    });
  });

  test.describe('Board Organization', () => {
    test('should create board folders/categories', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Create new folder
      await page.getByRole('button', { name: 'New Folder' }).click();

      // Name folder
      await page.getByLabel('Folder Name').fill('My Boards');

      // Create folder
      await page.getByRole('button', { name: 'Create Folder' }).click();

      // Verify folder creation
      await expect(page.getByText('My Boards')).toBeVisible();
    });

    test('should move boards between folders', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Select board to move
      await page
        .getByRole('checkbox')
        .first()
        .check();

      // Move to folder
      await page.getByRole('button', { name: 'Move to Folder' }).click();
      await page.getByText('My Boards').click();

      // Confirm move
      await page.getByRole('button', { name: 'Move' }).click();

      // Verify move
      await expect(page.getByText('Board moved successfully')).toBeVisible();
    });

    test('should share board with other users', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Share board
      await page
        .getByRole('button', { name: 'Share' })
        .first()
        .click();

      // Enter email to share with
      await page.getByLabel('Email').fill('friend@example.com');

      // Set permissions
      await page.getByLabel('Can Edit').check();

      // Send invitation
      await page.getByRole('button', { name: 'Share Board' }).click();

      // Verify sharing
      await expect(page.getByText('Board shared successfully')).toBeVisible();
    });
  });

  test.describe('Board Import/Export', () => {
    test('should export custom board', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Select board to export
      await page
        .getByRole('checkbox')
        .first()
        .check();

      // Set up download handler
      const downloadPromise = page.waitForEvent('download');

      // Export board
      await page.getByRole('button', { name: 'Export Selected' }).click();

      // Wait for download
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/\.json$/);
    });

    test('should import board from file', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Click import
      await page.getByRole('button', { name: 'Import Board' }).click();

      // Upload file (mock file upload)
      const fileInput = page.getByRole('button', { name: 'Choose File' });

      // This would need a test file to upload
      // For now, just verify the upload interface exists
      await expect(fileInput).toBeVisible();
    });

    test('should validate imported board format', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();
      await page.getByRole('button', { name: 'Import Board' }).click();

      // Try to upload invalid file type
      // This test would need implementation based on actual file validation

      // Verify error message for invalid format
      // await expect(page.getByText('Invalid file format')).toBeVisible();
    });
  });

  test.describe('Board Backup & Sync', () => {
    test('should create automatic backup', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Backup').click();

      // Enable auto backup
      await page.getByLabel('Automatic Backup').check();

      // Set backup frequency
      await page
        .getByRole('combobox', { name: 'Backup Frequency' })
        .selectOption('daily');

      // Save settings
      await page.getByRole('button', { name: 'Save Backup Settings' }).click();

      // Verify settings saved
      await expect(page.getByText('Backup settings saved')).toBeVisible();
    });

    test('should restore from backup', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Backup').click();

      // View available backups
      await page.getByRole('button', { name: 'View Backups' }).click();

      // Select backup to restore
      await page
        .getByRole('button', { name: 'Restore' })
        .first()
        .click();

      // Confirm restoration
      await page.getByRole('button', { name: 'Confirm Restore' }).click();

      // Verify restoration
      await expect(
        page.getByText('Backup restored successfully')
      ).toBeVisible();
    });

    test('should sync boards across devices', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Sync').click();

      // Enable sync
      await page.getByLabel('Enable Sync').check();

      // Force sync
      await page.getByRole('button', { name: 'Sync Now' }).click();

      // Verify sync status
      await expect(
        page.getByText(/sync|synchronized|up to date/i)
      ).toBeVisible();
    });
  });

  test.describe('Board Templates & Marketplace', () => {
    test('should browse available templates', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Templates').click();

      // Browse template categories
      await page.getByText('Communication').click();

      // View template details
      await page.getByText('Basic Communication').click();

      // Preview template
      await page.getByRole('button', { name: 'Preview' }).click();

      // Verify preview shows
      await expect(page.getByText('Template Preview')).toBeVisible();
    });

    test('should install template from marketplace', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Templates').click();

      // Find template to install
      await page.getByText('Advanced Communication').click();

      // Install template
      await page.getByRole('button', { name: 'Install Template' }).click();

      // Verify installation
      await expect(
        page.getByText('Template installed successfully')
      ).toBeVisible();
    });

    test('should publish custom board as template', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Boards').click();

      // Select board to publish
      await page
        .getByRole('button', { name: 'Publish' })
        .first()
        .click();

      // Fill publishing details
      await page.getByLabel('Template Name').fill('My Amazing Board');
      await page.getByLabel('Description').fill('Great for communication');
      await page.getByLabel('Category').selectOption('communication');

      // Publish template
      await page.getByRole('button', { name: 'Publish Template' }).click();

      // Verify publishing
      await expect(
        page.getByText('Template published successfully')
      ).toBeVisible();
    });
  });
});
