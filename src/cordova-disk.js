import { isCordova } from './cordova-util';

const getFileEntry = (
  filename,
  options = { create: true, exclusive: false }
) => {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      window.cordova.file.dataDirectory,
      dirEntry => {
        dirEntry.getFile(filename, options, resolve, reject);
      },
      reject
    );
  });
};

const getFileWriterFromFileEntry = (fileEntry, append) => {
  return new Promise((resolve, reject) => {
    fileEntry.createWriter(writer => {
      if (append) writer.seek(writer.length);
      resolve(writer);
    });
  });
};

export const getFileWriter = async (filename, append) => {
  if (!isCordova()) return Promise.reject('Cordova not available');

  const fileEntry = await getFileEntry(filename);
  const writer = await getFileWriterFromFileEntry(fileEntry, append);
  return [writer, fileEntry];
};

export const saveToDisk = (filepath, data) => {
  return getFileWriter(filepath, false).then(([writer, file]) => {
    return new Promise((resolve, reject) => {
      writer.onwriteend = () => resolve(file.toURL());
      writer.onerror = reject;
      writer.write(data);
    });
  });
};

export const getFileAsBlob = async filename => {
  if (!isCordova()) return Promise.reject('Cordova not available');

  const fileEntry = await getFileEntry(filename);
  return new Promise((resolve, reject) => {
    fileEntry.file(file => {
      const reader = new FileReader();

      // Result in this.result, do not use arrow function which would move `this`
      reader.onloadend = function() {
        resolve(new Blob([new Uint8Array(this.result)]));
      };

      reader.readAsArrayBuffer(file);
    }, reject);
  });
};
