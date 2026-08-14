import { test, expect } from '@playwright/test';

test.describe('Cboard - Settings Tour', () => {
  test('should render and navigate every settings carousel', async ({
    page
  }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto('/settings', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: 'Welcome to the settings!' })
    ).toBeVisible();

    const nextTourStep = page.locator('[data-test-id="button-primary"]');
    for (let step = 0; step < 5; step += 1) {
      await nextTourStep.click();
    }

    const activeSwiper = page.locator('.swiper:visible');
    await expect(activeSwiper).toHaveClass(/swiper-initialized/);
    await expect(activeSwiper).toHaveCSS('width', /[1-9]\d*(\.\d+)?px/);
    await expect(activeSwiper.locator('.swiper-slide')).toHaveCount(5);
    await expect(activeSwiper.locator('.swiper-slide-active')).toHaveCount(1);
    await expect(activeSwiper.locator('.swiper-pagination-bullet')).toHaveCount(
      5
    );
    await expect(activeSwiper.locator('.swiper-button-next svg')).toBeVisible();

    const firstImageAlt = await activeSwiper
      .locator('.swiper-slide-active img')
      .getAttribute('alt');
    await expect
      .poll(
        () =>
          activeSwiper.locator('.swiper-slide-active img').getAttribute('alt'),
        { timeout: 6000 }
      )
      .not.toBe(firstImageAlt);

    await nextTourStep.click();
    await expect(activeSwiper.locator('.swiper-slide')).toHaveCount(1);
    await expect(activeSwiper.locator('.swiper-slide-active')).toHaveCount(1);

    await nextTourStep.click();
    await expect(activeSwiper.locator('.swiper-slide')).toHaveCount(4);
    await expect(activeSwiper.locator('.swiper-pagination-bullet')).toHaveCount(
      4
    );
    await expect(activeSwiper.locator('.swiper-button-next svg')).toBeVisible();

    const firstNavigationImageAlt = await activeSwiper
      .locator('.swiper-slide-active img')
      .getAttribute('alt');
    await activeSwiper.locator('.swiper-button-next').click();
    await expect
      .poll(() =>
        activeSwiper.locator('.swiper-slide-active img').getAttribute('alt')
      )
      .not.toBe(firstNavigationImageAlt);

    expect(pageErrors).toEqual([]);
  });
});
