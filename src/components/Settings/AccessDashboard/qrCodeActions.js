const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const printQrCode = (src, title) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return;
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

export const downloadQrCode = async (src, filename) => {
  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }
    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    window.open(src, '_blank');
  }
};
