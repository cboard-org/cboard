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
