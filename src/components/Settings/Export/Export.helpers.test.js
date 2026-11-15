import { saveAs } from 'file-saver';
import { generateImageId, openboardExportOneAdapter } from './Export.helpers';
import { CBOARD_OBF_CONSTANTS, EMPTY_IMAGE } from './Export.constants';

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
jest.mock('../../../store');
// The PDF font bundle cannot be evaluated under Jest and is not used by the
// OpenBoard export.
jest.mock('pdfmake/build/pdfmake', () => ({}));
jest.mock('../../../vfs_fonts', () => ({ pdfMake: { vfs: {} } }));

const intl = {
  locale: 'en-US',
  formatMessage: ({ id }) => `translated:${id}`
};

const readBlob = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });

// Exports one board as OBF and returns the parsed file with the generated
// image ids replaced by image-1, image-2... in order of appearance.
async function exportOBF(board) {
  await openboardExportOneAdapter(board, intl);
  expect(saveAs).toHaveBeenCalledTimes(1);
  const [blob, filename] = saveAs.mock.calls[0];
  const obf = JSON.parse(await readBlob(blob));

  const generatedIds = obf.images.map((image) => image.id);
  expect(new Set(generatedIds).size).toBe(generatedIds.length);
  const stableId = (id) => `image-${generatedIds.indexOf(id) + 1}`;
  obf.images.forEach((image) => {
    image.id = stableId(image.id);
  });
  obf.buttons.forEach((button) => {
    if (button.image_id) {
      expect(generatedIds).toContain(button.image_id);
      button.image_id = stableId(button.image_id);
    }
  });

  return { obf, filename };
}

const ordinaryBoard = {
  id: 'food',
  name: 'Food',
  nameKey: 'cboard.boards.food',
  hidden: false,
  tiles: [
    {
      id: 't1',
      labelKey: 'cboard.symbol.apple',
      image: EMPTY_IMAGE,
      backgroundColor: 'rgb(255, 241, 118)',
      borderColor: 'rgb(0, 0, 0)'
    },
    {
      id: 't2',
      label: 'My snack',
      vocalization: 'I want my snack',
      image: EMPTY_IMAGE
    },
    { id: 't3', labelKey: 'cboard.symbol.clear', action: ':clear' },
    {
      id: 't4',
      labelKey: 'cboard.symbol.food',
      loadBoard: 'food',
      hidden: true
    },
    { id: 't5', label: 'Drinks', loadBoard: 'board-not-exported' },
    { id: 't6', label: 'six' },
    { id: 't7' }
  ]
};

const fixedBoard = {
  id: 'fixed',
  name: 'Fixed',
  isFixed: true,
  grid: {
    rows: 2,
    columns: 2,
    order: [
      ['a', 'b'],
      [null, 'c']
    ]
  },
  tiles: [
    { id: 'a', label: 'A', image: EMPTY_IMAGE },
    { id: 'b', label: 'B' },
    { id: 'c', label: 'C' }
  ]
};

const embeddedImage = (id) => ({
  id,
  data: EMPTY_IMAGE,
  content_type: 'image/png',
  width: 300,
  height: 300
});

describe('generateImageId', () => {
  it('returns a 24-character lowercase hex string', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateImageId()).toMatch(/^[0-9a-f]{24}$/);
    }
  });

  it('returns a different id on each call', () => {
    const ids = new Set(Array.from({ length: 1000 }, generateImageId));
    expect(ids.size).toBe(1000);
  });
});

describe('OpenBoard export of a single board', () => {
  beforeEach(() => {
    saveAs.mockClear();
  });

  it('exports an ordinary board in rows of six', async () => {
    const { obf, filename } = await exportOBF(ordinaryBoard);

    expect(filename).toMatch(/^[\d_-]+-Food board\.obf$/);
    expect(obf).toEqual({
      format: 'open-board-0.1',
      id: 'food',
      locale: 'en-US',
      name: 'Food',
      url: `${CBOARD_OBF_CONSTANTS.URL}food`,
      license: CBOARD_OBF_CONSTANTS.LICENSE,
      images: [embeddedImage('image-1'), embeddedImage('image-2')],
      buttons: [
        {
          id: 't1',
          ext_cboard_label_key: 'cboard.symbol.apple',
          label: 'translated:cboard.symbol.apple',
          border_color: 'rgb(0, 0, 0)',
          background_color: 'rgb(255, 241, 118)',
          image_id: 'image-1'
        },
        {
          id: 't2',
          label: 'translated:My snack',
          vocalization: 'I want my snack',
          image_id: 'image-2'
        },
        {
          id: 't3',
          ext_cboard_label_key: 'cboard.symbol.clear',
          label: 'translated:cboard.symbol.clear',
          action: ':clear'
        },
        {
          id: 't4',
          ext_cboard_label_key: 'cboard.symbol.food',
          ext_cboard_hidden: true,
          label: 'translated:cboard.symbol.food',
          load_board: {
            name: 'translated:cboard.boards.food',
            path: 'boards/food.obf'
          }
        },
        // A link to a board that is not part of the export is dropped.
        { id: 't5', label: 'translated:Drinks' },
        { id: 't6', label: 'translated:six' },
        { id: 't7', label: '' }
      ],
      sounds: [],
      grid: {
        rows: 2,
        columns: 6,
        order: [
          ['t1', 't2', 't3', 't4', 't5', 't6'],
          ['t7', null, null, null, null, null]
        ]
      },
      description_html: 'translated:cboard.boards.food',
      ext_cboard_name_key: 'cboard.boards.food',
      ext_cboard_hidden: false
    });
  });

  it('exports a fixed-grid board with its own grid order', async () => {
    const { obf, filename } = await exportOBF(fixedBoard);

    expect(filename).toMatch(/^[\d_-]+-Fixed board\.obf$/);
    expect(obf).toEqual({
      format: 'open-board-0.1',
      id: 'fixed',
      locale: 'en-US',
      name: 'Fixed',
      url: `${CBOARD_OBF_CONSTANTS.URL}fixed`,
      license: CBOARD_OBF_CONSTANTS.LICENSE,
      images: [embeddedImage('image-1')],
      buttons: [
        { id: 'a', label: 'translated:A', image_id: 'image-1' },
        { id: 'b', label: 'translated:B' },
        { id: 'c', label: 'translated:C' }
      ],
      sounds: [],
      grid: {
        rows: 2,
        columns: 2,
        order: [
          ['a', 'b'],
          [null, 'c']
        ]
      },
      description_html: ''
    });
  });
});
