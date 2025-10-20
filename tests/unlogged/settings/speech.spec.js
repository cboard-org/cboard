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

  test('should display ElevenLabs API key input field', async ({ page }) => {
    await cboard.verifyElevenLabsApiKeyField();
  });

  test('should validate ElevenLabs API key format', async ({ page }) => {
    await cboard.testElevenLabsApiKeyValidation();
  });

  test('should show connection status for ElevenLabs API', async ({ page }) => {
    await cboard.verifyElevenLabsConnectionStatus();
  });

  test('should display voice menu when clicking voice selection', async ({
    page
  }) => {
    await cboard.verifyVoiceMenuOpening();
  });

  test('should show different voice types in voice menu', async ({ page }) => {
    await cboard.verifyVoiceTypeVariety();
  });

  test('should allow selecting local/system voices', async ({ page }) => {
    await cboard.testLocalVoiceSelection();
  });

  test('should allow selecting cloud/online voices', async ({ page }) => {
    await cboard.testCloudVoiceSelection();
  });

  test('should disable both pitch and rate controls for online voices', async ({
    page
  }) => {
    await cboard.testOnlineVoiceControlsDisabled();
  });

  test('should enable and make functional both pitch and rate controls for local voices', async ({
    page
  }) => {
    await cboard.testLocalVoiceControlsEnabledAndFunctional();
  });

  test('should verify control state changes when switching between voice types', async ({
    page
  }) => {
    await cboard.testControlStateChangesWithVoiceTypes();
  });

  test('should show online voice notification when selecting cloud voice', async ({
    page
  }) => {
    await cboard.verifyOnlineVoiceNotification();
  });

  test('should display ElevenLabs help text and link', async ({ page }) => {
    await cboard.verifyElevenLabsHelpText();
  });

  test('should show password visibility toggle for API key field', async ({
    page
  }) => {
    await cboard.verifyApiKeyPasswordToggle();
  });

  test('should display voice chips for online and ElevenLabs voices', async ({
    page
  }) => {
    await cboard.verifyVoiceChips();
  });

  test('should maintain voice selection after page reload', async ({
    page
  }) => {
    await cboard.testVoiceSelectionPersistence();
  });

  test('should handle pitch slider range correctly (0.0 to 2.0)', async ({
    page
  }) => {
    await cboard.testPitchSliderRange();
  });

  test('should handle rate slider range correctly (0 to 2.0)', async ({
    page
  }) => {
    await cboard.testRateSliderRange();
  });

  test('should show different rate ranges for ElevenLabs voices', async ({
    page
  }) => {
    await cboard.testElevenLabsRateRange();
  });

  test('should display proper voice labels and descriptions', async ({
    page
  }) => {
    await cboard.verifyVoiceLabelsAndDescriptions();
  });

  test('should support keyboard navigation in voice menu', async ({ page }) => {
    await cboard.testVoiceMenuKeyboardNavigation();
  });

  test('should close voice menu when clicking outside', async ({ page }) => {
    await cboard.testVoiceMenuCloseOnOutsideClick();
  });

  test('should support different regional accent voices', async ({ page }) => {
    await cboard.verifyRegionalAccentVoices();
  });

  test('should show multilingual voice options', async ({ page }) => {
    await cboard.verifyMultilingualVoices();
  });

  test('should handle voice loading states properly', async ({ page }) => {
    await cboard.testVoiceLoadingStates();
  });

  test('should validate slider increment steps', async ({ page }) => {
    await cboard.testSliderIncrementSteps();
  });

  test('should handle voice selection error states', async ({ page }) => {
    await cboard.testVoiceSelectionErrorHandling();
  });
});
