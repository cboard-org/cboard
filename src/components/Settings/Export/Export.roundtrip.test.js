import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { openboardExportManyAdapter } from './Export.helpers';
import { obzImportAdapter } from '../Import/Import.helpers';

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
jest.mock('jszip-utils', () => ({ getBinaryContent: jest.fn() }));
jest.mock('../../../store');
// The PDF font bundle cannot be evaluated under Jest and is not used by the
// OpenBoard export.
jest.mock('pdfmake/build/pdfmake', () => ({}));
jest.mock('../../../vfs_fonts', () => ({ pdfMake: { vfs: {} } }));
// Signed out: the importer keeps each image as a data URL.
jest.mock('../../../api', () => ({
  uploadFromDataURL: jest.fn(() => Promise.resolve(undefined))
}));

const intl = {
  locale: 'en-US',
  formatMessage: ({ id }) => id
};

const pngDataURL = (text) => `data:image/png;base64,${btoa(text)}`;

const readArrayBuffer = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });

// Exports the boards as OBZ and returns the zip that would be downloaded.
async function exportOBZ(boards) {
  saveAs.mockClear();
  await openboardExportManyAdapter(boards, intl);
  // The export saves the zip once it is generated, without waiting for it.
  for (let i = 0; i < 500 && !saveAs.mock.calls.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  expect(saveAs).toHaveBeenCalledTimes(1);
  return readArrayBuffer(saveAs.mock.calls[0][0]);
}

async function importOBZ(data) {
  JSZipUtils.getBinaryContent.mockImplementation((path, callback) =>
    callback(null, data)
  );
  return obzImportAdapter(new File([data], 'boards.obz'), intl, []);
}

const tileImages = (boards) =>
  Object.fromEntries(
    boards.map((board) => [
      board.id,
      Object.fromEntries(board.tiles.map((tile) => [tile.id, tile.image]))
    ])
  );

describe('OpenBoard export, then import', () => {
  const { createObjectURL } = global.URL;

  beforeAll(() => {
    // jsdom has no URL.createObjectURL.
    global.URL.createObjectURL = jest.fn(() => 'blob:obz');
  });

  afterAll(() => {
    global.URL.createObjectURL = createObjectURL;
  });

  it('brings back every custom tile image', async () => {
    const boards = [
      {
        id: 'home-1',
        name: 'Home',
        tiles: [
          { id: 'a1', label: 'Hi', image: pngDataURL('first hi') },
          { id: 'a2', label: 'yes/no', image: pngDataURL('yes or no') },
          { id: 'a3', label: 'No picture' }
        ]
      },
      {
        // Same board name and same tile label as the first board, but a
        // different picture.
        id: 'home-2',
        name: 'Home',
        tiles: [{ id: 'b1', label: 'Hi', image: pngDataURL('second hi') }]
      }
    ];

    const imported = await importOBZ(await exportOBZ(boards));

    expect(tileImages(imported)).toEqual({
      'home-1': {
        a1: pngDataURL('first hi'),
        a2: pngDataURL('yes or no'),
        a3: undefined
      },
      'home-2': { b1: pngDataURL('second hi') }
    });
  });

  it('writes one zip entry per custom image', async () => {
    const boards = [
      {
        id: 'home-1',
        name: 'Home',
        tiles: [{ id: 't1', label: 'Hi', image: pngDataURL('one') }]
      },
      {
        id: 'home-2',
        name: 'Home',
        tiles: [{ id: 't1', label: 'Hi', image: pngDataURL('two') }]
      }
    ];

    const zip = await JSZip.loadAsync(await exportOBZ(boards));
    const imageEntries = Object.keys(zip.files).filter(
      (name) => name.startsWith('images/') && !zip.files[name].dir
    );

    expect(imageEntries).toHaveLength(2);
  });
});
