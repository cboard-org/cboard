import { test } from '@playwright/test';
import { createCboard } from '../page-objects/cboard.js';

test.describe('Cboard - Symbol Search: Cboard Symbols Provider', () => {
  let cboard;

  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.openSymbolSearch();
  });

  test('should list Cboard Symbols as the 4th provider and enable it by default', async () => {
    await cboard.expectAllSymbolProvidersVisible();

    await cboard.expectCboardSymbolsEnabled();
  });

  test('should return symbol results when searching with Cboard Symbols enabled', async () => {
    await cboard.toggleMulberryProvider();
    await cboard.toggleGlobalSymbolsProvider();
    await cboard.toggleArasaacSymbolsProvider();

    await cboard.waitForTimeout(1000);

    await cboard.searchSymbol('dog');
    await cboard.waitForTimeout(500);
    await cboard.expectSymbolResultsVisible('dog');
  });

  test('should show Cboard Symbols results after re-enabling the provider from an all-disabled state', async () => {
    await cboard.toggleMulberryProvider();
    await cboard.waitForTimeout(500);
    await cboard.toggleGlobalSymbolsProvider();
    await cboard.waitForTimeout(500);
    await cboard.toggleArasaacSymbolsProvider();
    await cboard.waitForTimeout(500);
    await cboard.toggleCboardSymbolsProvider();
    await cboard.expectCboardSymbolsDisabled();
    await cboard.waitForTimeout(500);

    await cboard.searchSymbol('happy');
    await cboard.waitForTimeout(2000);
    await cboard.expectNoSymbolResults();

    await cboard.toggleCboardSymbolsProvider();
    await cboard.expectCboardSymbolsEnabled();
    await cboard.waitForTimeout(1500);

    await cboard.expectSymbolResultsVisible('happy');
  });

  test('should disable the Skin Tone selector only when both Cboard Symbols and ARASAAC are off', async () => {
    await cboard.expectSkinToneEnabled();

    await cboard.toggleCboardSymbolsProvider();
    await cboard.toggleArasaacSymbolsProvider();
    await cboard.expectSkinToneDisabled();

    await cboard.toggleCboardSymbolsProvider();
    await cboard.expectSkinToneEnabled();
  });
});
