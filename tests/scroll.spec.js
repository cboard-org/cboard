import { test, expect } from '@playwright/test';
import { createCboard } from './page-objects/cboard.js';

test.describe('Board scroll behavior', () => {
  test('tiles container should not be scrollable (overflow-y hidden)', async ({
    page
  }) => {
    const cboard = createCboard(page);
    await cboard.goto('/board/root');

    // Find Board tiles container
    const tiles = page.locator('#BoardTilesContainer');
    await expect(tiles).toBeVisible();

    // Check computed CSS
    const overflowY = await tiles.evaluate(
      el => getComputedStyle(el).overflowY
    );
    expect(overflowY).toBe('hidden');

    // Try to scroll and verify position stays at 0
    const before = await tiles.evaluate(el => el.scrollTop);
    await tiles.evaluate(el => el.scrollBy(0, 200));
    const after = await tiles.evaluate(el => el.scrollTop);
    expect(before).toBe(after);
  });

  test('fixed grid root should not be scrollable (overflow hidden)', async ({
    page
  }) => {
    const cboard = createCboard(page);
    await cboard.goto('/board/root');

    // Heuristic: locate the FixedGrid container by CSS module root class substring
    const fixedGridRoot = page.locator('[class*="Grid_root"]');
    const exists = await fixedGridRoot.count();

    if (exists > 0) {
      const first = fixedGridRoot.first();
      const overflow = await first.evaluate(
        el => getComputedStyle(el).overflow
      );
      expect(overflow).toBe('hidden');

      const before = await first.evaluate(el => el.scrollTop);
      await first.evaluate(el => el.scrollBy(0, 200));
      const after = await first.evaluate(el => el.scrollTop);
      expect(before).toBe(after);
    } else {
      test
        .info()
        .annotations.push({
          type: 'note',
          description:
            'Fixed grid root not present on this board; skipping overflow assertion.'
        });
    }
  });
});
