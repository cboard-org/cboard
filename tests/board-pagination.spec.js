import { test, expect } from '@playwright/test';

// Uses isolated anonymous browser storage. Point CBOARD_TEST_URL at a served
// production build to validate a local change before it reaches the QA site.
if (process.env.CBOARD_TEST_URL) {
  test.use({ baseURL: process.env.CBOARD_TEST_URL });
}
test.beforeEach(async ({ page, baseURL }) => {
  await page.route('**/*', (route) =>
    new URL(route.request().url()).origin === new URL(baseURL).origin
      ? route.continue()
      : route.abort()
  );
});

async function seedBoard(
  page,
  fixed,
  mode = 'pagination',
  scanning = false,
  dark = false
) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByRole('button', { name: 'Skip for now' })
  ).toBeVisible();
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(async () => {
    const db = await new Promise((resolve) => {
      const request = indexedDB.open('cboard');
      request.onsuccess = () => resolve(request.result);
    });
    if (!db.objectStoreNames.contains('cboard_store')) {
      db.close();
      return false;
    }
    const value = await new Promise((resolve) => {
      const request = db
        .transaction('cboard_store')
        .objectStore('cboard_store')
        .get('persist:root');
      request.onsuccess = () => resolve(request.result);
    });
    db.close();
    return !!value;
  });
  await page.evaluate(
    async ({ fixed, mode, scanning, dark }) => {
      const db = await new Promise((resolve) => {
        const request = indexedDB.open('cboard');
        request.onsuccess = () => resolve(request.result);
      });
      await new Promise((resolve, reject) => {
        const tx = db.transaction('cboard_store', 'readwrite');
        const store = tx.objectStore('cboard_store');
        const request = store.get('persist:root');
        request.onsuccess = () => {
          const persisted = JSON.parse(request.result);
          const app = JSON.parse(persisted.app);
          app.isFirstVisit = false;
          app.displaySettings.darkThemeActive = dark;
          app.liveHelp = Object.fromEntries(
            Object.keys(app.liveHelp).map((key) => [key, false])
          );
          app.navigationSettings.boardNavigationMode = mode;
          const board = JSON.parse(persisted.board);
          board.boards = [
            {
              id: 'root',
              name: 'Pagination test',
              isFixed: fixed,
              grid: {
                rows: 2,
                columns: 3,
                order: [['tile-2', 'tile-1', 'tile-0']]
              },
              tiles: Array.from({ length: 40 }, (_, i) => ({
                id: `tile-${i}`,
                label: `Symbol ${i}`,
                backgroundColor: '#cde'
              }))
            }
          ];
          board.activeBoardId = 'root';
          board.navHistory = ['root'];
          board.isFixed = fixed;
          persisted.scanner = JSON.stringify({
            active: scanning,
            strategy: 'manual',
            delay: 2000
          });
          persisted.app = JSON.stringify(app);
          persisted.board = JSON.stringify(board);
          store.put(JSON.stringify(persisted), 'persist:root');
        };
        tx.oncomplete = resolve;
        tx.onerror = reject;
      });
      db.close();
    },
    { fixed, mode, scanning, dark }
  );
  await page.goto('/board/root', { waitUntil: 'domcontentloaded' });
  await expect(
    page.locator('#BoardTilesContainer .Tile').first()
  ).toBeVisible();
}

for (const fixed of [false, true]) {
  test(`${fixed ? 'fixed' : 'responsive'} board reaches every symbol without scrolling`, async ({
    page
  }) => {
    await seedBoard(page, fixed);
    const tiles = page.locator('#BoardTilesContainer .Tile');
    const seen = new Set();
    await expect(
      page.getByRole('button', { name: /^(Previous|Last) page$/ })
    ).toBeEnabled();
    const status = page.locator('.BoardPagination [role="status"]');
    const pageCount = Number((await status.textContent()).match(/of (\d+)/)[1]);
    for (let index = 0; index < pageCount; index++) {
      await expect(status).toHaveText(`Page ${index + 1} of ${pageCount}`);
      for (const label of await tiles.allTextContents()) seen.add(label.trim());
      expect(
        await tiles.evaluateAll((elements) => {
          const container = document
            .querySelector('#BoardTilesContainer')
            .getBoundingClientRect();
          return elements.every((element) => {
            const tile = element.getBoundingClientRect();
            return (
              tile.top >= container.top - 1 &&
              tile.bottom <= container.bottom + 1 &&
              tile.left >= container.left - 1 &&
              tile.right <= container.right + 1
            );
          });
        })
      ).toBe(true);
      const next = page.getByRole('button', { name: /^(Next|First) page$/ });
      await expect(next).toBeEnabled();
      await expect(next).toHaveAccessibleName(
        index === pageCount - 1 ? 'First page' : 'Next page'
      );
      await next.focus();
      await page.keyboard.press('Enter');
      await expect(next).toBeFocused();
    }
    expect(seen.size).toBe(40);
    await expect(status).toHaveText(`Page 1 of ${pageCount}`);
    const area = page.locator('#BoardTilesContainer');
    await area.hover();
    await page.mouse.wheel(0, 500);
    await expect
      .poll(() => area.evaluate((element) => element.scrollTop))
      .toBe(0);
    await page.getByRole('button', { name: /^(Previous|Last) page$/ }).click();
    await expect(status).toHaveText(`Page ${pageCount} of ${pageCount}`);
    if (fixed) {
      await page.keyboard.press('ArrowRight');
      await expect(
        page.locator('#BoardTilesContainer .Tile:focus')
      ).toHaveCount(1);
    }
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('.BoardPagination')).toBeVisible();
    await expect(page.getByRole('status')).toContainText('Page 1 of');
  });
}

test('short screen fits tiles and resets capacity after resizing', async ({
  page
}) => {
  await page.setViewportSize({ width: 700, height: 320 });
  await seedBoard(page, false);
  await expect(page.locator('#BoardTilesContainer .Tile')).toHaveCount(4);
  await page.getByRole('button', { name: /^(Next|First) page$/ }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('status')).toHaveText('Page 1 of 5');
  await expect(page.locator('#BoardTilesContainer .Tile')).toHaveCount(9);
});

test('scroll remains the default and settings persist the selected mode', async ({
  page
}) => {
  await seedBoard(page, false, 'scroll');
  await expect(page.locator('#BoardTilesContainer .Tile')).toHaveCount(40);
  await expect(page.locator('.BoardPagination')).toHaveCount(0);
  await page.evaluate(() => {
    window.history.pushState({}, '', '/settings/navigation');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.getByRole('button', { name: 'Board navigation mode' }).click();
  await page.getByRole('option', { name: 'Pagination', exact: true }).click();
  await page.getByRole('button', { name: /save/i }).click();
  await page.waitForFunction(async () => {
    const db = await new Promise((resolve) => {
      const request = indexedDB.open('cboard');
      request.onsuccess = () => resolve(request.result);
    });
    const value = await new Promise((resolve) => {
      const request = db
        .transaction('cboard_store')
        .objectStore('cboard_store')
        .get('persist:root');
      request.onsuccess = () => resolve(request.result);
    });
    db.close();
    return (
      JSON.parse(JSON.parse(value).app).navigationSettings
        .boardNavigationMode === 'pagination'
    );
  });
  await page.goto('/board/root', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.BoardPagination')).toBeVisible();
});

test('switch scanning selects Next page and continues scanning the new page', async ({
  page
}) => {
  await seedBoard(page, true, 'pagination', true);
  const next = page.locator('.BoardPagination button').last();
  const status = page.getByRole('status');
  const bounds = await next.boundingBox();
  for (let index = 0; index < 7; index++) {
    for (let i = 0; i < 20; i++) {
      if ((await next.getAttribute('class')).includes('scanner__focused'))
        break;
      await page.keyboard.press('Tab');
    }
    await expect(next).toHaveClass(/scanner__focused/);
    await expect(next).toHaveCSS('outline-width', '4px');
    await expect(next).toHaveAccessibleName(
      index === 6 ? 'First page' : 'Next page'
    );
    expect(await next.boundingBox()).toEqual(bounds);
    await page.keyboard.press('Enter');
    await expect(status).toHaveText(`Page ${((index + 1) % 7) + 1} of 7`);
  }
  const previous = page.getByRole('button', { name: 'Last page', exact: true });
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    if ((await previous.getAttribute('class')).includes('scanner__focused'))
      break;
  }
  await expect(previous).toHaveClass(/scanner__focused/);
  await page.keyboard.press('Enter');
  await expect(status).toHaveText('Page 7 of 7');
});

test('pagination uses the eye gaze side button style in both themes', async ({
  page
}) => {
  for (const dark of [false, true]) {
    await seedBoard(page, false, 'pagination', false, dark);
    const column = page.locator(
      '.BoardPagination.SideNavigationButtonsContainer'
    );
    await expect(column).toBeVisible();
    const tiles = await page.locator('#BoardTilesContainer').boundingBox();
    expect((await column.boundingBox()).x).toBeGreaterThanOrEqual(
      tiles.x + tiles.width - 1
    );
    for (const button of await column.locator('.SideNavigationButton').all()) {
      await expect(button).toHaveCSS(
        'background-color',
        'rgba(255, 0, 0, 0.5)'
      );
    }
    const counter = page.locator('.BoardPagination__counter');
    await expect(counter).toHaveText(/^1 \/ \d+$/);
    await expect(counter).toHaveCSS('color', 'rgb(255, 255, 255)');
    await page.screenshot({
      path: `test-results/pagination-${dark ? 'dark' : 'light'}.png`
    });
  }
});
