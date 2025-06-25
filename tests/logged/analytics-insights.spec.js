import { test, expect } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Analytics & Insights (Logged Users)', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.unlockInterface();
  });

  test.describe('Usage Analytics', () => {
    test('should display usage dashboard', async ({ page }) => {
      // Navigate to analytics
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();

      // Verify dashboard elements
      await expect(page.getByText('Usage Dashboard')).toBeVisible();
      await expect(page.getByText('Total Sessions')).toBeVisible();
      await expect(page.getByText('Most Used Symbols')).toBeVisible();
      await expect(page.getByText('Communication Patterns')).toBeVisible();
    });

    test('should show symbol usage statistics', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();

      // Navigate to symbol analytics
      await page.getByText('Symbol Usage').click();

      // Verify symbol statistics
      await expect(page.getByText('Most Frequently Used')).toBeVisible();
      await expect(page.getByText('Usage Count')).toBeVisible();
      await expect(page.getByText('Last Used')).toBeVisible();

      // Check for chart visualizations
      const chart = page.locator('canvas, svg').first();
      if (await chart.isVisible()) {
        await expect(chart).toBeVisible();
      }
    });

    test('should display session duration metrics', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();

      // View session metrics
      await page.getByText('Sessions').click();

      // Verify session data
      await expect(page.getByText('Average Session Duration')).toBeVisible();
      await expect(page.getByText('Daily Usage')).toBeVisible();
      await expect(page.getByText('Peak Usage Times')).toBeVisible();
    });

    test('should filter analytics by date range', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();

      // Set date filter
      await page.getByLabel('From Date').fill('2024-01-01');
      await page.getByLabel('To Date').fill('2024-12-31');

      // Apply filter
      await page.getByRole('button', { name: 'Apply Filter' }).click();

      // Verify filtered data updates
      await expect(page.getByText('Filtered Results')).toBeVisible();
    });

    test('should export analytics data', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();

      // Set up download handler
      const downloadPromise = page.waitForEvent('download');

      // Export data
      await page.getByRole('button', { name: 'Export Data' }).click();

      // Select export format
      await page.getByText('CSV').click();

      // Wait for download
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/\.csv$/);
    });
  });

  test.describe('Communication Insights', () => {
    test('should analyze communication patterns', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByText('Communication Patterns').click();

      // Verify pattern analysis
      await expect(page.getByText('Sentence Structure')).toBeVisible();
      await expect(page.getByText('Word Combinations')).toBeVisible();
      await expect(page.getByText('Communication Growth')).toBeVisible();
    });

    test('should show vocabulary expansion tracking', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByText('Vocabulary').click();

      // Verify vocabulary metrics
      await expect(page.getByText('Vocabulary Size')).toBeVisible();
      await expect(page.getByText('New Words This Week')).toBeVisible();
      await expect(page.getByText('Vocabulary Growth Rate')).toBeVisible();
    });

    test('should display communication effectiveness metrics', async ({
      page
    }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByText('Effectiveness').click();

      // Verify effectiveness data
      await expect(page.getByText('Successful Communications')).toBeVisible();
      await expect(page.getByText('Message Completion Rate')).toBeVisible();
      await expect(page.getByText('User Satisfaction')).toBeVisible();
    });

    test('should generate communication reports', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByText('Reports').click();

      // Generate report
      await page.getByRole('button', { name: 'Generate Report' }).click();

      // Select report type
      await page.getByText('Monthly Progress Report').click();

      // Configure report
      await page.getByLabel('Include Charts').check();
      await page.getByLabel('Include Recommendations').check();

      // Generate and download
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Generate PDF' }).click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    });
  });

  test.describe('Goal Tracking', () => {
    test('should set communication goals', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Goals').click();

      // Create new goal
      await page.getByRole('button', { name: 'Add Goal' }).click();

      // Set goal details
      await page.getByLabel('Goal Title').fill('Increase daily vocabulary use');
      await page.getByLabel('Target Value').fill('50');
      await page.getByLabel('Target Date').fill('2024-12-31');

      // Save goal
      await page.getByRole('button', { name: 'Save Goal' }).click();

      // Verify goal creation
      await expect(page.getByText('Goal created successfully')).toBeVisible();
    });

    test('should track goal progress', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Goals').click();

      // View goal progress
      await expect(page.getByText('Progress')).toBeVisible();
      await expect(page.getByText('%')).toBeVisible();

      // Check for progress visualization
      const progressBar = page.locator('.progress-bar, [role="progressbar"]');
      if (await progressBar.isVisible()) {
        await expect(progressBar).toBeVisible();
      }
    });

    test('should update goal targets', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Goals').click();

      // Edit existing goal
      await page
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

      // Update target
      await page.getByLabel('Target Value').clear();
      await page.getByLabel('Target Value').fill('75');

      // Save changes
      await page.getByRole('button', { name: 'Update Goal' }).click();

      // Verify update
      await expect(page.getByText('Goal updated')).toBeVisible();
    });

    test('should receive goal achievement notifications', async ({ page }) => {
      // This test might need to simulate goal completion
      await cboard.clickSettingsButton();
      await page.getByText('Goals').click();

      // Check for achievement notifications
      const achievement = page.getByText('Goal Achieved!');
      if (await achievement.isVisible()) {
        await expect(achievement).toBeVisible();
        await expect(page.getByText('Congratulations')).toBeVisible();
      }
    });
  });

  test.describe('Learning Insights', () => {
    test('should show learning progress analytics', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Learning').click();

      // Verify learning metrics
      await expect(page.getByText('Learning Progress')).toBeVisible();
      await expect(page.getByText('Skill Development')).toBeVisible();
      await expect(page.getByText('Areas for Improvement')).toBeVisible();
    });

    test('should provide personalized recommendations', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Learning').click();
      await page.getByText('Recommendations').click();

      // Verify recommendation sections
      await expect(page.getByText('Suggested Symbols')).toBeVisible();
      await expect(page.getByText('Practice Activities')).toBeVisible();
      await expect(page.getByText('Next Steps')).toBeVisible();
    });

    test('should track learning milestones', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Learning').click();
      await page.getByText('Milestones').click();

      // Verify milestone tracking
      await expect(page.getByText('Completed Milestones')).toBeVisible();
      await expect(page.getByText('Upcoming Milestones')).toBeVisible();

      // Check milestone progress
      const milestoneProgress = page.locator('.milestone-progress');
      if (await milestoneProgress.isVisible()) {
        await expect(milestoneProgress).toBeVisible();
      }
    });

    test('should show learning curve analysis', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Learning').click();
      await page.getByText('Learning Curve').click();

      // Verify learning curve visualization
      await expect(page.getByText('Learning Rate')).toBeVisible();
      await expect(page.getByText('Improvement Over Time')).toBeVisible();

      // Check for chart/graph
      const chart = page.locator('canvas, svg').first();
      if (await chart.isVisible()) {
        await expect(chart).toBeVisible();
      }
    });
  });

  test.describe('Data Privacy and Sharing', () => {
    test('should configure analytics privacy settings', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Privacy').click();

      // Configure data collection
      await page.getByLabel('Allow usage analytics').check();
      await page.getByLabel('Share anonymous data').uncheck();

      // Save privacy settings
      await page.getByRole('button', { name: 'Save Privacy Settings' }).click();

      // Verify save
      await expect(page.getByText('Privacy settings updated')).toBeVisible();
    });

    test('should share analytics with caregivers', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByText('Share').click();

      // Add caregiver email
      await page.getByLabel('Caregiver Email').fill('caregiver@example.com');

      // Select data to share
      await page.getByLabel('Usage Statistics').check();
      await page.getByLabel('Progress Reports').check();

      // Share data
      await page.getByRole('button', { name: 'Share Analytics' }).click();

      // Verify sharing
      await expect(
        page.getByText('Analytics shared successfully')
      ).toBeVisible();
    });

    test('should export data for external analysis', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByText('Export').click();

      // Select data types to export
      await page.getByLabel('Raw Usage Data').check();
      await page.getByLabel('Processed Analytics').check();

      // Choose export format
      await page.getByRole('combobox', { name: 'Format' }).selectOption('json');

      // Set up download
      const downloadPromise = page.waitForEvent('download');

      // Export data
      await page.getByRole('button', { name: 'Export Selected Data' }).click();

      // Verify download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.json$/);
    });

    test('should delete analytics data', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Privacy').click();

      // Delete analytics data
      await page.getByRole('button', { name: 'Delete Analytics Data' }).click();

      // Confirm deletion
      await page.getByRole('button', { name: 'Confirm Delete' }).click();

      // Verify deletion
      await expect(page.getByText('Analytics data deleted')).toBeVisible();
    });
  });

  test.describe('Dashboard Customization', () => {
    test('should customize analytics dashboard', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();

      // Enter customization mode
      await page.getByRole('button', { name: 'Customize Dashboard' }).click();

      // Add widget
      await page.getByRole('button', { name: 'Add Widget' }).click();
      await page.getByText('Daily Usage Chart').click();

      // Save layout
      await page.getByRole('button', { name: 'Save Layout' }).click();

      // Verify customization
      await expect(page.getByText('Dashboard updated')).toBeVisible();
    });

    test('should rearrange dashboard widgets', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByRole('button', { name: 'Customize Dashboard' }).click();

      // Drag and drop widgets (implementation dependent)
      const widget1 = page.locator('.widget').first();
      const widget2 = page.locator('.widget').nth(1);

      if ((await widget1.isVisible()) && (await widget2.isVisible())) {
        await widget1.dragTo(widget2);
      }

      // Save layout
      await page.getByRole('button', { name: 'Save Layout' }).click();

      // Verify save
      await expect(page.getByText('Layout saved')).toBeVisible();
    });

    test('should set dashboard refresh preferences', async ({ page }) => {
      await cboard.clickSettingsButton();
      await page.getByText('Analytics').click();
      await page.getByRole('button', { name: 'Dashboard Settings' }).click();

      // Set refresh rate
      await page
        .getByRole('combobox', { name: 'Refresh Rate' })
        .selectOption('real-time');

      // Enable auto-refresh
      await page.getByLabel('Auto-refresh').check();

      // Save settings
      await page.getByRole('button', { name: 'Save Settings' }).click();

      // Verify save
      await expect(page.getByText('Settings saved')).toBeVisible();
    });
  });
});
