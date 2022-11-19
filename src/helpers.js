export const dataURLtoFile = (dataurl, filename, checkExtension = false) => {
  // https://stackoverflow.com/a/38936042
  const arr = dataurl.split(',');
  const type = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  let name = filename;
  if (checkExtension) {
    const extension = type.split('/')[1].toLowerCase();
    name = `${name}.${extension}`;
  }

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], name, { type });
};

export const convertImageUrlToCatchable = imageUrl => {
  const CBOARD_PRODUCTION_BLOB_CONTAINER_HOSTNAME =
    'cboardgroupdiag483.blob.core.windows.net';
  const PROTOCOL_LENGHT = 8;
  const isCboardProductionBlobContainer = imageUrl.startsWith(
    CBOARD_PRODUCTION_BLOB_CONTAINER_HOSTNAME,
    PROTOCOL_LENGHT
  );
  const cboardBlobUsingCDN = imageUrl => {
    const CDN_HOSTNAME = 'cdncboard.azureedge.net';
    return imageUrl.replace(
      CBOARD_PRODUCTION_BLOB_CONTAINER_HOSTNAME,
      CDN_HOSTNAME
    );
  };

  if (isCboardProductionBlobContainer) return cboardBlobUsingCDN(imageUrl);
  return null;
};
