import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Speech Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();

    // Navigate to settings and Speech tab
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Speech');
  });

  test('should display speech settings dialog', async ({ page }) => {
    await cboard.verifySpeechSettingsUI();
  });

  test('should show voice selection option', async ({ page }) => {
    await cboard.verifyVoiceSelection();
  });

  test('should display pitch control slider', async ({ page }) => {
    await cboard.verifyPitchControl();
  });

  test('should display rate control slider', async ({ page }) => {
    await cboard.verifyRateControl();
  });

  test('should allow voice selection', async ({ page }) => {
    await cboard.clickVoiceSelection();

    // This would open voice selection dialog
    // Note: Specific voice options depend on browser/system TTS capabilities
  });

  test('should allow pitch adjustment', async ({ page }) => {
    // Adjust pitch slider using page object method
    await cboard.adjustPitchSlider(75);
  });

  test('should allow rate adjustment', async ({ page }) => {
    // Adjust rate slider using page object method
    await cboard.adjustRateSlider(25);
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromSpeech();
  });

  test('should show appropriate voice description', async ({ page }) => {
    // Verify voice description shows current voice details
    await cboard.verifyVoiceDescription();
  });

  test('should display helpful tooltips for controls', async ({ page }) => {
    // Verify descriptive text for controls using page object
    await cboard.verifyHelpfulTooltips();
  });

  test('should use page object methods to verify speech settings elements', async ({
    page
  }) => {
    // Use page object methods to verify speech settings
    await cboard.verifySpeechSettingsElements();

    // Use the existing working verification method
    await cboard.verifySpeechSettingsUI();
  });
});
