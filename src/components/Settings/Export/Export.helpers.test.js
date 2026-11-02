jest.mock('../../../vfs_fonts', () => ({
  __esModule: true,
  default: {
    pdfMake: {
      vfs: {}
    }
  }
}));

import pdfMake from 'pdfmake/build/pdfmake';
import { pdfExportAdapter } from './Export.helpers';
import { PDF_BORDER_WIDTH } from './Export.constants';

describe('PDF export tile borders', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  async function generateDocument(showTileBorders) {
    jest.useFakeTimers();

    const createPdfMock = jest.spyOn(pdfMake, 'createPdf').mockReturnValue({
      download: (filename, callback) => callback()
    });

    await pdfExportAdapter(
      [
        {
          name: 'Test Board',
          tiles: []
        }
      ],
      12,
      { locale: 'en-US' },
      false,
      showTileBorders
    );

    return createPdfMock.mock.calls[0][0];
  }

  test('uses the default layout when tile borders are disabled', async () => {
    const docDefinition = await generateDocument(false);

    const table = docDefinition.content.find((item) => item.table);

    expect(table.layout).toBe('pdfGridLayout');
  });

  test('uses the bordered layout when tile borders are enabled', async () => {
    const docDefinition = await generateDocument(true);

    const table = docDefinition.content.find((item) => item.table);

    expect(table.layout).toBe('pdfGridLayoutWithBorders');
  });

  test('default layout keeps white borders', () => {
    const layout = pdfMake.tableLayouts.pdfGridLayout;

    expect(layout.hLineColor(0)).toBe('#ffffff');
    expect(layout.vLineColor(0)).toBe('#ffffff');
    expect(layout.hLineWidth(0)).toBe(PDF_BORDER_WIDTH);
    expect(layout.vLineWidth(0)).toBe(PDF_BORDER_WIDTH);
    expect(layout.paddingLeft(0)).toBe(0);
    expect(layout.paddingRight(0)).toBe(0);
  });

  test('bordered layout uses black borders', () => {
    const layout = pdfMake.tableLayouts.pdfGridLayoutWithBorders;

    expect(layout.hLineColor(0)).toBe('#000000');
    expect(layout.vLineColor(0)).toBe('#000000');
    expect(layout.hLineWidth(0)).toBe(PDF_BORDER_WIDTH);
    expect(layout.vLineWidth(0)).toBe(PDF_BORDER_WIDTH);
    expect(layout.paddingLeft(0)).toBe(0);
    expect(layout.paddingRight(0)).toBe(0);
  });
});
