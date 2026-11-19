import { isPrintSupported, printQrCode, downloadQrCode } from './qrCodeActions';
import { isAndroid, isIOS, writeCvaFile } from '../../../cordova-util';

jest.mock('../../../cordova-util', () => ({
  isAndroid: jest.fn(() => false),
  isIOS: jest.fn(() => false),
  requestCvaWritePermissions: jest.fn(),
  writeCvaFile: jest.fn(() => Promise.resolve({}))
}));

const SRC = 'https://cdn.test/qr-codes/cafe-CAFE01.png';

// jsdom never loads images, so drive onload/onerror by hand.
const mockImage = (outcome) => {
  const OriginalImage = global.Image;
  global.Image = class {
    set src(value) {
      setTimeout(() => (outcome === 'load' ? this.onload() : this.onerror()));
    }
  };
  return () => {
    global.Image = OriginalImage;
  };
};

describe('qrCodeActions', () => {
  let restoreImage;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, blob: () => Promise.resolve(new Blob()) })
    );
    window.open = jest.fn();
  });

  afterEach(() => {
    if (restoreImage) restoreImage();
    restoreImage = null;
    delete global.fetch;
    jest.clearAllMocks();
    isAndroid.mockReturnValue(false);
    isIOS.mockReturnValue(false);
  });

  describe('isPrintSupported', () => {
    it('is supported on the web and not on the mobile apps', () => {
      expect(isPrintSupported()).toBe(true);
      isAndroid.mockReturnValue(true);
      expect(isPrintSupported()).toBe(false);
      isAndroid.mockReturnValue(false);
      isIOS.mockReturnValue(true);
      expect(isPrintSupported()).toBe(false);
    });
  });

  describe('printQrCode', () => {
    const printWindow = () => ({
      close: jest.fn(),
      document: { write: jest.fn(), close: jest.fn() }
    });

    it('writes the QR code into the print window once it loads', async () => {
      restoreImage = mockImage('load');
      const win = printWindow();
      window.open.mockReturnValue(win);

      await printQrCode(SRC, 'Café <b>');

      expect(win.document.write).toHaveBeenCalledWith(
        expect.stringContaining(`src="${SRC}"`)
      );
      expect(win.document.write).toHaveBeenCalledWith(
        expect.stringContaining('Café &lt;b&gt;')
      );
      expect(win.close).not.toHaveBeenCalled();
    });

    it('closes the window and rejects when the image fails to load', async () => {
      restoreImage = mockImage('error');
      const win = printWindow();
      window.open.mockReturnValue(win);

      await expect(printQrCode(SRC, 'Café')).rejects.toThrow();

      expect(win.close).toHaveBeenCalled();
      expect(win.document.write).not.toHaveBeenCalled();
    });

    it('rejects when the window is blocked', async () => {
      window.open.mockReturnValue(null);
      await expect(printQrCode(SRC, 'Café')).rejects.toThrow();
    });
  });

  describe('downloadQrCode', () => {
    it('saves the image to Downloads on the mobile apps', async () => {
      isAndroid.mockReturnValue(true);

      await expect(downloadQrCode(SRC, 'cafe-CAFE01.png')).resolves.toBe(true);

      expect(writeCvaFile).toHaveBeenCalledWith(
        'Download/cafe-CAFE01.png',
        expect.any(Blob)
      );
    });

    it('rejects on the mobile apps when the image cannot be fetched', async () => {
      isIOS.mockReturnValue(true);
      global.fetch.mockResolvedValue({ ok: false, status: 404 });

      await expect(downloadQrCode(SRC, 'cafe-CAFE01.png')).rejects.toThrow();
      expect(writeCvaFile).not.toHaveBeenCalled();
    });

    it('rejects on the mobile apps when the file cannot be written', async () => {
      isAndroid.mockReturnValue(true);
      writeCvaFile.mockRejectedValueOnce(new Error('no space'));

      await expect(downloadQrCode(SRC, 'cafe-CAFE01.png')).rejects.toThrow(
        'no space'
      );
    });

    it('falls back to opening the image on the web when fetch fails', async () => {
      global.fetch.mockRejectedValue(new TypeError('CORS'));

      await expect(downloadQrCode(SRC, 'cafe-CAFE01.png')).resolves.toBe(false);
      expect(window.open).toHaveBeenCalledWith(SRC, '_blank');
    });
  });
});
