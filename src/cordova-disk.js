import { isCordova } from './cordova-util';

export const getFileWriter = (filename, append) => {
  if (!isCordova()) return Promise.reject('Cordova not available');

  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      window.cordova.file.dataDirectory,
      dirEntry => {
        dirEntry.getFile(
          filename,
          { create: true, exclusive: false },
          fileEntry => {
            fileEntry.createWriter(writer => {
              if (append) writer.seek(writer.length);
              console.log('FileEntry', fileEntry.fullPath);
              resolve(writer);
            });
          },
          reject
        );
      },
      reject
    );
  });
};

export const saveToDisk = (filepath, data) => {
  return getFileWriter(filepath, false).then(writer => {
    return new Promise((resolve, reject) => {
      writer.onwriteend = () => {
        resolve('standby');
      };
      writer.onerror = reject;
      writer.write(data);
    });
  });
};
