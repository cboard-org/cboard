import { test, expect } from '@playwright/test';

const nextButton = '[data-test-id="button-primary"]';
const tourSteps = [
  'Language',
  'Speech',
  'Export',
  'Import',
  'Display',
  'Scanning',
  'Navigation'
];

for (const lang of ['en-US', 'es-ES', 'ar-SA']) {
  for (const dark of [false, true]) {
    test(`Settings tour: ${lang}, ${dark ? 'dark' : 'light'} theme`, async ({
      page
    }, testInfo) => {
      const joyrideErrors = [];
      page.on('console', (message) => {
        if (
          ['warning', 'error'].includes(message.type()) &&
          /joyride|target not mounted/i.test(message.text())
        ) {
          joyrideErrors.push(message.text());
        }
      });
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
      await page.goto('/settings');
      await expect(page.locator('[role="alertdialog"]')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('html')).toHaveAttribute(
        'dir',
        lang === 'ar-SA' ? 'rtl' : 'ltr'
      );

      if (dark) {
        await page.locator('[data-test-id="button-skip"]').click();
        await page.locator('#Display').click();
        await page.locator('.Display__Options input[type="checkbox"]').check();
        await page.locator('#save-button').click();
        await expect(page.locator('.App')).toHaveClass(/is-dark/);
        await page.locator('.Settings_EnableTour_Button button').click();
      }

      for (const setting of tourSteps) {
        await page.locator(nextButton).click();
        const target = page.locator(`#${setting}`);
        const spotlight = page.locator('.react-joyride__spotlight');
        await expect(spotlight).toBeVisible();
        await expect
          .poll(
            async () => {
              const row = await target.boundingBox();
              const highlight = await spotlight.boundingBox();
              if (!row || !highlight) return Infinity;
              return Math.max(
                Math.abs(highlight.x - (row.x - 4)),
                Math.abs(highlight.y - (row.y - 4)),
                Math.abs(highlight.width - (row.width + 8)),
                Math.abs(highlight.height - (row.height + 8))
              );
            },
            { message: `${setting} spotlight should surround its setting` }
          )
          .toBeLessThanOrEqual(2);
        await expect(target).toBeInViewport({ ratio: 1 });
        await expect(page.locator('[role="alertdialog"]')).toBeInViewport({
          ratio: 1
        });
        if (['Display', 'Scanning', 'Navigation'].includes(setting)) {
          await expect
            .poll(
              () =>
                page
                  .locator('[role="alertdialog"] img')
                  .evaluateAll(
                    (images) =>
                      images.length > 0 &&
                      images.every(
                        (image) => image.complete && image.naturalWidth > 0
                      )
                  ),
              { message: `${setting} tour images should load` }
            )
            .toBe(true);
        }
        if (setting === 'Export') {
          await testInfo.attach('export-step', {
            body: await page.screenshot(),
            contentType: 'image/png'
          });
        }
      }

      await page.locator(nextButton).click();
      await expect(page.locator('[role="alertdialog"]')).toBeHidden();
      await page.reload();
      await expect(page.locator('#Language')).toBeVisible();
      await expect(page.locator('[role="alertdialog"]')).toBeHidden();
      await page.locator('.Settings_EnableTour_Button button').click();
      await expect(page.locator('[role="alertdialog"]')).toBeVisible();
      await page.locator('[data-test-id="button-skip"]').click();
      await page.reload();
      await expect(
        page.locator('.Settings_EnableTour_Button button')
      ).toBeVisible();
      await expect(page.locator('[role="alertdialog"]')).toBeHidden();
      await page.locator('.Settings_EnableTour_Button button').click();
      await expect(page.locator('[role="alertdialog"]')).toBeVisible();
      expect(joyrideErrors).toEqual([]);
    });
  }
}
