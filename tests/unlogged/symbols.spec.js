import { test } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

/**
 * E2E tests for the Cboard Symbols integration (PR #2147).
 *
 * Covers the 3 most important behaviours introduced by adding Cboard Symbols
 * as the 4th symbol provider alongside Mulberry, Global Symbols, and ARASAAC:
 *   1. Provider availability and default state
 *   2. End-to-end search returning results
 *   3. Skin Tone selector state tied to Cboard Symbols / ARASAAC presence
 */
test.describe('Cboard - Symbol Search: Cboard Symbols Provider', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.openSymbolSearch();
  });

  test('should list Cboard Symbols as the 4th provider and enable it by default', async () => {
    // All 4 providers must be visible in the filter bar
    await cboard.expectAllSymbolProvidersVisible();

    // Cboard Symbols must be checked out-of-the-box — no configuration required
    await cboard.expectCboardSymbolsEnabled();
  });

  test('should return symbol results when searching with Cboard Symbols enabled', async () => {
    // Isolate Cboard Symbols by disabling all other providers
    await cboard.toggleMulberryProvider();
    await cboard.toggleGlobalSymbolsProvider();
    await cboard.toggleArasaacSymbolsProvider();
    // wait one second for the search results to update after toggling providers
    await cboard.waitForTimeout(500);
    // Results must come exclusively from the Cboard Symbols API
    await cboard.searchSymbol('dog');
    await cboard.waitForTimeout(3000);
    await cboard.expectSymbolResultsVisible('dog');
  });

  test('should disable the Skin Tone selector only when both Cboard Symbols and ARASAAC are off', async () => {
    // With Cboard Symbols and ARASAAC both enabled (default), Skin Tone must be active.
    // PR #2147 extended showInclusivityOptions to include Cboard Symbols alongside ARASAAC.
    await cboard.expectSkinToneEnabled();

    // Turning off both inclusivity providers must disable Skin Tone
    await cboard.toggleCboardSymbolsProvider();
    await cboard.toggleArasaacSymbolsProvider();
    await cboard.expectSkinToneDisabled();

    // Re-enabling Cboard Symbols alone must restore Skin Tone
    await cboard.toggleCboardSymbolsProvider();
    await cboard.expectSkinToneEnabled();
  });
});
