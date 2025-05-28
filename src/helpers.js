import boards from './api/boards.json';
import picSeePal from './api/corePicSeePal.json';

export const DEFAULT_BOARDS = {
  advanced: boards.advanced,
  picSeePal: picSeePal
};

export const deepCopy = obj => JSON.parse(JSON.stringify(obj));

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

export const resolveBoardName = ({ name, nameKey }, intl) => {
  if (name) return name;
  if (nameKey && intl?.messages?.[nameKey]) {
    return intl.formatMessage({ id: nameKey });
  }
  return '';
};

export const resolveTileLabel = ({ label, labelKey }, intl) => {
  if (label) return label;
  if (labelKey && intl?.messages?.[labelKey]) {
    return intl.formatMessage({ id: labelKey });
  }
  return '';
};
