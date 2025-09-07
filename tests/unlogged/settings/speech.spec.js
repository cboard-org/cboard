import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Speech Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
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
  });
  test('should allow pitch adjustment', async ({ page }) => {
    await cboard.adjustPitchSlider(75);
  });
  test('should allow rate adjustment', async ({ page }) => {
    await cboard.adjustRateSlider(25);
  });
  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromSpeech();
  });
  test('should show appropriate voice description', async ({ page }) => {
    await cboard.verifyVoiceDescription();
  });
  test('should display helpful tooltips for controls', async ({ page }) => {
    await cboard.verifyHelpfulTooltips();
  });
  test('should use page object methods to verify speech settings elements', async ({
    page
  }) => {
    await cboard.verifySpeechSettingsElements();
    await cboard.verifySpeechSettingsUI();
  });
});
