import { test } from '@playwright/test';
import { createCboard } from '../../page-objects/cboard.js';

test.describe('Cboard - Export Settings', () => {
  let cboard;
  test.beforeEach(async ({ page }) => {
    cboard = createCboard(page);
    await cboard.goto();
    await cboard.navigateToSettings();
    await cboard.clickSettingsTab('Export');
  });

  test('should display export settings dialog', async ({ page }) => {
    await cboard.verifyExportSettingsUI();
  });

  test('should show single board export controls', async ({ page }) => {
    await cboard.verifySingleBoardExportControls();
  });

  test('should show all boards export controls', async ({ page }) => {
    await cboard.verifyAllBoardsExportControls();
  });

  test('should show PDF settings section', async ({ page }) => {
    await cboard.verifyPdfSettingsSection();
  });

  test('should show PDF font size control', async ({ page }) => {
    await cboard.verifyPdfFontSizeControl();
  });

  test('should enable single board export button after board and format selection', async ({
    page
  }) => {
    await cboard.selectSingleBoardFormat('Cboard');
    await cboard.verifySingleExportButtonDisabled();
    await cboard.selectSingleBoard('Cboard Classic Home');
    await cboard.verifySingleExportButtonEnabled();
  });

  test('should allow PDF font size modification', async ({ page }) => {
    await cboard.clickPdfFontSize();
  });

  test('should provide helpful format documentation links', async ({
    page
  }) => {
    await cboard.verifyFormatDocumentationLinks();
  });

  test('should support navigation back to main settings', async ({ page }) => {
    await cboard.goBackFromExport();
  });

  test('should not auto-trigger export when selecting all-boards format — only the Export button initiates loading', async ({
    page
  }) => {
    await cboard.selectAllBoardsFormat('Cboard');
    await cboard.verifyAllBoardsExportButtonEnabled();
    await cboard.verifyAllBoardsNoLoadingSpinner();
  });

  test('should keep single board export button disabled when a board is selected but no format is chosen', async ({
    page
  }) => {
    await cboard.selectSingleBoard('Cboard Classic Home');
    await cboard.verifySingleExportButtonDisabled();
  });

  test('should render single-board and all-boards exports as separate visual sections', async ({
    page
  }) => {
    await cboard.verifyExportSectionsAreSeparated();
  });

  test('should download a single board in Cboard format and verify the file name', async ({
    page
  }) => {
    await cboard.selectSingleBoard('Cboard Classic Home');
    await cboard.selectSingleBoardFormat('Cboard');
    const download = await cboard.triggerSingleBoardExportAndWaitForDownload();
    await cboard.verifyDownloadedFileName(download, 'board.json');
    await cboard.verifyDownloadedCboardFile(download);
  });

  test('should download a single board in OpenBoard format and verify the file name', async ({
    page
  }) => {
    await cboard.selectSingleBoard('Cboard Classic Home');
    await cboard.selectSingleBoardFormat('OpenBoard');
    const download = await cboard.triggerSingleBoardExportAndWaitForDownload();
    await cboard.verifyDownloadedFileName(download, 'board.obf');
    await cboard.verifyDownloadedOpenBoardFile(download);
  });

  test('should download a single board in PDF format and verify the file name', async ({
    page
  }) => {
    await cboard.selectSingleBoard('Cboard Classic Home');
    await cboard.selectSingleBoardFormat('PDF');
    const download = await cboard.triggerSingleBoardExportAndWaitForDownload();
    await cboard.verifyDownloadedFileName(download, 'board.pdf');
    await cboard.verifyDownloadedPdfFile(download);
  });
});
