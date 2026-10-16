import { test, expect } from '@playwright/test';

for (const [width, lang] of [
  [320, 'en-US'],
  [390, 'en-US'],
  [390, 'ar-SA'],
  [1280, 'en-US']
]) {
  test(`symbol filters: ${width}px, ${lang}`, async ({ page }, testInfo) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.setViewportSize({ width, height: 800 });
    await page.addInitScript(
      ({ lang }) => {
        localStorage.setItem(
          'persist:language',
          JSON.stringify({
            lang: JSON.stringify(lang),
            dir: JSON.stringify(lang === 'ar-SA' ? 'rtl' : 'ltr')
          })
        );
      },
      { lang }
    );
    await page.goto('/board/root');
    await page.locator('[data-test-id="button-skip"]').click();
    for (let i = 0; i < 4; i++) {
      await page.locator('.open__lock').click();
    }
    await page
      .getByRole('button', {
        name: lang === 'ar-SA' ? 'تابع التحرير' : 'Continue editing'
      })
      .click();
    await page.locator('[data-test-id="button-skip"]').click();
    await page.locator('.add__board__tile').click();
    await page
      .getByRole('button', {
        name: lang === 'ar-SA' ? 'البحث عن الرموز' : 'Symbol search',
        exact: true
      })
      .click();
    await page.locator('[data-test-id="button-skip"]').click();
    const filters = page.locator('.FilterBar');
    await expect(filters).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute(
      'dir',
      lang === 'ar-SA' ? 'rtl' : 'ltr'
    );
    await expect(
      page.locator('.react-autosuggest__suggestion').first()
    ).toBeVisible();
    await testInfo.attach('filters', {
      body: await page.screenshot({ path: testInfo.outputPath('filters.png') }),
      contentType: 'image/png'
    });
    const bounds = await filters.boundingBox();
    if (width <= 500) {
      expect(bounds.height).toBeLessThanOrEqual(100);
      for (const label of await filters.locator('label').all()) {
        const box = await label.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
    }
    const checkResultsPosition = async () => {
      await expect
        .poll(
          async () => {
            const controls = await filters.boundingBox();
            const results = await page
              .locator('.react-autosuggest__suggestions-container')
              .boundingBox();
            if (!controls || !results) return false;
            const gap = results.y - controls.y - controls.height;
            return gap >= 0 && gap <= 12;
          },
          { message: 'Results should start just below the filters' }
        )
        .toBe(true);
    };
    await checkResultsPosition();
    const provider = page.getByRole('checkbox', {
      name: 'Cboard Symbols',
      exact: true
    });
    await provider.uncheck();
    await expect(provider).not.toBeChecked();
    await provider.focus();
    await page.keyboard.press('Space');
    await expect(provider).toBeChecked();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '24px';
    });
    await checkResultsPosition();
    await page.screenshot({
      path: testInfo.outputPath('filters-larger-text.png')
    });
    await page.setViewportSize({
      width: width <= 500 ? 768 : 390,
      height: 800
    });
    await checkResultsPosition();
    expect(pageErrors).toEqual([]);
  });
}
