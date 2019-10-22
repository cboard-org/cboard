export const isCordova = () => !!window.cordova;

export const onCordovaReady = onReady =>
  document.addEventListener('deviceready', onReady, false);

export const writeCvaFile = async (name, blob) => {
  if (isCordova()) {
    window.requestFileSystem(
      window.LocalFileSystem.PERSISTENT,
      0,
      function(fs) {
        fs.root.getFile(
          name,
          { create: true, exclusive: false },
          function(fileEntry) {
            writeFile(fileEntry, blob);
            return fileEntry;
          },
          onErrorCreateFile
        );
      },
      onErrorLoadFs
    );
  }
};

const writeFile = (fileEntry, dataObj) => {
  fileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function() {};
    fileWriter.onerror = function(e) {
      console.log('Failed file write: ' + e.toString());
    };
    // If data object is not passed in, create a new Blob instead.
    if (!dataObj) {
      dataObj = new Blob(['some file data'], { type: 'text/plain' });
    }
    fileWriter.write(dataObj);
  });
};

const onErrorCreateFile = () => {};
const onErrorLoadFs = () => {};

export const fileCvaOpen = (filePath, type) => {
  if (isCordova()) {
    window.cordova.plugins.fileOpener2.open(filePath, type, {
      error: function(e) {
        console.log(
          'Error status: ' + e.status + ' - Error message: ' + e.message
        );
      },
      success: function() {
        console.log('file opened successfully');
      }
    });
  }
};

export const requestCvaWritePermissions = () => {
  if (isCordova()) {
    var permissions = window.cordova.plugins.permissions;
    permissions.checkPermission(
      permissions.WRITE_EXTERNAL_STORAGE,
      function(status) {
        console.log('Has WRITE_EXTERNAL_STORAGE:', status.hasPermission);
        if (!status.hasPermission) {
          permissions.requestPermission(
            permissions.WRITE_EXTERNAL_STORAGE,
            function(status) {
              console.log(
                'success requesting WRITE_EXTERNAL_STORAGE permission'
              );
            },
            function(err) {
              console.warn('No permissions granted for WRITE_EXTERNAL_STORAGE');
            }
          );
        }
      },
      function(err) {
        console.log(err);
      }
    );
  }
};

export const requestCvaPermissions = () => {
  if (isCordova()) {
    var permissions = window.cordova.plugins.permissions;
    permissions.checkPermission(
      permissions.READ_EXTERNAL_STORAGE,
      function(status) {
        console.log('Has READ_EXTERNAL_STORAGE:', status.hasPermission);
        if (!status.hasPermission) {
          permissions.requestPermission(
            permissions.READ_EXTERNAL_STORAGE,
            function(status) {
              console.log(
                'success requesting READ_EXTERNAL_STORAGE permission'
              );
            },
            function(err) {
              console.warn('No permissions granted for READ_EXTERNAL_STORAGE');
            }
          );
        }
      },
      function(err) {
        console.log(err);
      }
    );

    permissions.checkPermission(
      permissions.RECORD_AUDIO,
      function(status) {
        console.log('Has RECORD_AUDIO:', status.hasPermission);
        if (!status.hasPermission) {
          permissions.requestPermission(
            permissions.CAMERA,
            function(status) {
              console.log('success requesting RECORD_AUDIO permission');
            },
            function(err) {
              console.warn('No permissions granted for RECORD_AUDIO');
            }
          );
        }
      },
      function(err) {
        console.log(err);
      }
    );

    permissions.checkPermission(
      permissions.CAMERA,
      function(status) {
        console.log('Has CAMERA:', status.hasPermission);
        if (!status.hasPermission) {
          permissions.requestPermission(
            permissions.CAMERA,
            function(status) {
              console.log('success requesting CAMERA permission');
            },
            function(err) {
              console.warn('No permissions granted for CAMERA');
            }
          );
        }
      },
      function(err) {
        console.log(err);
      }
    );
  }
};
