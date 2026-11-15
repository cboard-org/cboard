import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { obzImportAdapter } from './Import.helpers';

jest.mock('jszip-utils', () => ({ getBinaryContent: jest.fn() }));
// The upload fails for a user who is not signed in, and the importer then
// keeps the image as a data URL.
jest.mock('../../../api', () => ({
  uploadFromDataURL: jest.fn(() => Promise.reject(new Error('offline')))
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

  global.URL.createObjectURL = jest.fn(() => 'blob:obz');
  JSZipUtils.getBinaryContent.mockImplementation((path, callback) =>
    callback(null, data)
  );

  return obzImportAdapter(new File([data], 'boards.obz'), {}, []);
}

describe('obzImportAdapter', () => {
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
