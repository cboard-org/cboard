import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { obzImportAdapter, requestQuota } from './Import.helpers';

jest.mock('jszip-utils', () => ({ getBinaryContent: jest.fn() }));
// With no uploaded URL to use, the importer keeps the image as a data URL.
jest.mock('../../../api', () => ({
  uploadFromDataURL: jest.fn(() => Promise.resolve(undefined))
}));

const SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>';
const SVG_DATA_URL = `data:image/svg+xml;base64,${btoa(SVG)}`;

// Builds an OBZ with one board and one image, then imports it.
async function importOBZ({ imagePath, zipEntryName }) {
  const zip = new JSZip();
  zip.file(
    'boards/fruit.obf',
    JSON.stringify({
      format: 'open-board-0.1',
      id: 'fruit',
      name: 'Fruit',
      buttons: [{ id: 'apple', label: 'apple', image_id: 'image-1' }],
      images: [
        { id: 'image-1', path: imagePath, content_type: 'image/svg+xml' }
      ]
    })
  );
  zip.file(zipEntryName, SVG);
  const data = await zip.generateAsync({ type: 'arraybuffer' });

  JSZipUtils.getBinaryContent.mockImplementation((path, callback) =>
    callback(null, data)
  );

  return obzImportAdapter(new File([data], 'boards.obz'), {}, []);
}

describe('obzImportAdapter', () => {
  beforeAll(() => {
    // jsdom has no URL.createObjectURL.
    global.URL.createObjectURL = jest.fn(() => 'blob:obz');
  });

  it('finds the images of an OBZ exported by Cboard', async () => {
    // The Cboard export stores each image under "images/" + path, and path
    // starts with a slash.
    const [board] = await importOBZ({
      imagePath: '/symbols/apple.svg',
      zipEntryName: 'images//symbols/apple.svg'
    });

    expect(board.name).toBe('Fruit');
    expect(board.tiles).toHaveLength(1);
    expect(board.tiles[0].image).toBe(SVG_DATA_URL);
  });

  it('finds the images of an OBZ whose image paths are zip entry names', async () => {
    const [board] = await importOBZ({
      imagePath: 'images/apple.svg',
      zipEntryName: 'images/apple.svg'
    });

    expect(board.tiles[0].image).toBe(SVG_DATA_URL);
  });
});

describe('requestQuota', () => {
  // Just over the 4 MB limit once serialized.
  const largeImport = [{ id: 'big', tiles: [{ image: 'x'.repeat(4200000) }] }];

  afterEach(() => {
    delete navigator.webkitPersistentStorage;
  });

  it('lets a large import through in a browser without the quota API', async () => {
    await expect(requestQuota(largeImport)).resolves.toBeGreaterThan(
      4 * 1024 * 1024
    );
  });

  it('asks for quota for a large import where the API exists', async () => {
    const quotaRequest = jest.fn((size, granted) => granted(size));
    navigator.webkitPersistentStorage = { requestQuota: quotaRequest };

    await requestQuota(largeImport);

    expect(quotaRequest).toHaveBeenCalledTimes(1);
  });

  it('fails a large import when the browser grants too little quota', async () => {
    navigator.webkitPersistentStorage = {
      requestQuota: (size, granted) => granted(0)
    };

    await expect(requestQuota(largeImport)).rejects.toThrow(
      'Granted size is below the limit'
    );
  });
});
