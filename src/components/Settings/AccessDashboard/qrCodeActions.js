import {
  isAndroid,
  isIOS,
  requestCvaWritePermissions,
  writeCvaFile
} from '../../../cordova-util';

const isMobileApp = () => isAndroid() || isIOS();

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });

/**
 * The Android/iOS WebViews have no window.print(); there the QR is printed
 * from the image saved with Download.
 */
export const isPrintSupported = () => !isMobileApp();

/**
 * Opens a print window with the QR code. The window is opened synchronously
 * (inside the click) so popup blockers allow it; the image is loaded first so
 * a failure closes the window instead of leaving a blank tab.
 * Rejects when the window cannot be opened or the image fails to load.
 */
export const printQrCode = async (src, title) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open the print window');
  }

  try {
    await loadImage(src);
  } catch (e) {
    printWindow.close();
    throw e;
  }

  printWindow.document.write(
    `<!doctype html><title>${escapeHtml(title)}</title>` +
      '<body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh">' +
      `<img src="${escapeHtml(src)}" alt="${escapeHtml(title)}" ` +
      'style="width:60vmin" onload="window.focus();window.print();">' +
      '</body>'
  );
  printWindow.document.close();
};

const fetchBlob = async (src) => {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Unexpected status ${response.status}`);
  }
  return response.blob();
};

/**
 * Downloads the QR code image.
 * On Android/iOS it is written to the Download folder, like board exports.
 * Resolves to true when the file was saved on the device (so the caller can
 * confirm it), false when the browser handled the download.
 * Rejects on the apps when the image cannot be fetched or written.
 */
export const downloadQrCode = async (src, filename) => {
  if (isMobileApp()) {
    const blob = await fetchBlob(src);
    requestCvaWritePermissions();
    await writeCvaFile(`Download/${filename}`, blob);
    return true;
  }

  try {
    const blobUrl = URL.createObjectURL(await fetchBlob(src));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    // e.g. CORS: let the browser open the image so it can be saved manually
    window.open(src, '_blank');
  }
  return false;
};
