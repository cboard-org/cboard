export const isCordova = () => !!window.cordova;

export const isAndroid = () =>
  isCordova() && window.cordova.platformId === 'android';

export const isElectron = () =>
  isCordova() && window.cordova.platformId === 'electron';

export const isIOS = () => isCordova() && window.cordova.platformId === 'ios';

export const onCordovaReady = onReady =>
  document.addEventListener('deviceready', onReady, false);

export const onAndroidPause = onPause =>
  document.addEventListener('pause', onPause, false);

export const manageKeyboardEvents = ({
  onShow,
  onHide,
  removeEvent = false
}) => {
  if (!removeEvent) {
    window.addEventListener('keyboardDidShow', onShow, false);
    window.addEventListener('keyboardDidHide', onHide, false);
    return;
  }
  window.removeEventListener('keyboardDidShow', onShow, false);
  window.removeEventListener('keyboardDidHide', onHide, false);
};

export const onCvaResume = onResume =>
  document.addEventListener('resume', onResume, false);

export const cleanUpCvaOnResume = onResume => {
  document.removeEventListener('resume', onResume, false);
};

export const initCordovaPlugins = () => {
  console.log('now cordova is ready ');
  if (isCordova()) {
    try {
      window.StatusBar.hide();
    } catch (err) {
      console.log(err.message);
    }
    try {
      window.AndroidFullScreen.immersiveMode(
        function successFunction() {},
        function errorFunction(error) {
          console.error(error.message);
        }
      );
    } catch (err) {
      console.log(err.message);
    }
    try {
      configFacebookPlugin();
    } catch (err) {
      console.log(err.message);
    }
    try {
      if (isAndroid) configAppPurchasePlugin();
    } catch (err) {
      console.log(err.message);
    }
  }
};

const configAppPurchasePlugin = () => {
  const store = window.CdvPurchase.store;
  const { ProductType, Platform } = window.CdvPurchase; // shortcuts

  store.register([
    {
      id: 'one_year_subscription',
      type: ProductType.PAID_SUBSCRIPTION,
      platform: Platform.GOOGLE_PLAY
    },
    {
      id: 'test',
      type: ProductType.PAID_SUBSCRIPTION,
      platform: Platform.GOOGLE_PLAY
    }
  ]);
  //error handler
  store.error(errorHandler);
  function errorHandler(error) {
    console.error(`ERROR ${error.code}: ${error.message}`);
  }

  store.initialize([Platform.GOOGLE_PLAY]);
};

const configFacebookPlugin = () => {
  const FACEBOOK_APP_ID =
    process.env.REACT_APP_FACEBOOK_APP_ID || '340205533290626';
  const FACEBOOK_APP_NAME =
    process.env.REACT_APP_FACEBOOK_APP_NAME || 'Cboard - Development';
  window.facebookConnectPlugin.setApplicationId(
    FACEBOOK_APP_ID,
    function successFunction() {},
    function errorFunction(error) {
      console.error(error.message);
    }
  );
  window.facebookConnectPlugin.setApplicationName(
    FACEBOOK_APP_NAME,
    function successFunction() {},
    function errorFunction(error) {
      console.error(error.message);
    }
  );
};

export const cvaTrackEvent = (category, action, label) => {
  try {
    const convertEventToNewNomenclature = name => {
      const inLowerCase = name.toLowerCase();
      const event_name = inLowerCase.replace(/\s/g, '_');
      return event_name;
    };
    const event_name = convertEventToNewNomenclature(action);

    const eventOptions = label
      ? {
          event_category: category,
          event_label: label
        }
      : {
          event_category: category
        };
    if (!isElectron()) window.FirebasePlugin.logEvent(event_name, eventOptions);
  } catch (err) {
    console.log(err.message);
  }
};

export const readCvaFile = async name => {
  if (isCordova()) {
    return new Promise(function(resolve, reject) {
      window.requestFileSystem(
        window.LocalFileSystem.PERSISTENT,
        0,
        function(fs) {
          fs.root.getFile(
            name,
            { create: false, exclusive: false },
            function(fileEntry) {
              fileEntry.file(
                function(file) {
                  var reader = new FileReader();
                  reader.onloadend = function() {
                    console.log('Successful file read: ' + this.result);
                    resolve(this.result);
                  };
                  reader.readAsText(file);
                },
                function(err) {
                  console.log(err);
                  reject(err);
                }
              );
            },
            function(err) {
              console.log(err);
              reject(err);
            }
          );
        },
        function(err) {
          console.log(err);
          reject(err);
        }
      );
    });
  }
};

export const writeCvaFile = async (name, blob) => {
  if (isCordova()) {
    return new Promise(function(resolve, reject) {
      window.requestFileSystem(
        window.LocalFileSystem.PERSISTENT,
        0,
        function(fs) {
          const extractFileName = nameWithDirectory => {
            const nameParts = nameWithDirectory.split('/');
            const lastIndex = nameParts.length - 1;
            return nameParts[lastIndex];
          };
          const fileName = isIOS() ? extractFileName(name) : name;
          fs.root.getFile(
            fileName,
            { create: true, exclusive: false },
            function(fileEntry) {
              writeFile(fileEntry, blob, resolve, reject);
            },
            function(err) {
              console.log(err);
              reject(err);
            }
          );
        },
        function(err) {
          console.log(err);
          reject(err);
        }
      );
    });
  }
};

const writeFile = (fileEntry, dataObj, resolve, reject) => {
  fileEntry.createWriter(function(fileWriter) {
    fileWriter.onwriteend = function() {
      console.log('File write success');
      resolve(fileEntry);
    };
    fileWriter.onerror = function(e) {
      console.log('Failed file write: ' + e.toString());
      reject(e);
    };
    // If data object is not passed in, create a new Blob instead.
    if (!dataObj) {
      dataObj = new Blob(['some file data'], { type: 'text/plain' });
    }
    fileWriter.write(dataObj);
  });
};

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

export const requestCvaPermissions = async () => {
  if (isAndroid()) {
    var permissions = window.cordova.plugins.permissions;
    const androidPermissions = {
      READ_EXTERNAL_STORAGE: 'READ_EXTERNAL_STORAGE',
      RECORD_AUDIO: 'RECORD_AUDIO',
      READ_MEDIA_IMAGES: 'READ_MEDIA_IMAGES',
      READ_MEDIA_AUDIO: 'READ_MEDIA_AUDIO'
    };

    for (let permission in androidPermissions) {
      try {
        const { hasPermission } = await new Promise((resolve, reject) => {
          permissions.checkPermission(
            permissions[permission],
            function(status) {
              console.log(`Has ${permission}:`, status.hasPermission);
              resolve(status);
            },
            function(err) {
              console.log(err);
              resolve({ hasPermission: false });
            }
          );
        });
        if (!hasPermission) {
          await new Promise((resolve, reject) => {
            permissions.requestPermission(
              permissions[permission],
              function(status) {
                console.log(`Success requesting ${permission} permission`);
                if (!status.hasPermission)
                  console.log(`No permissions granted for ${permission}`);
                resolve(status);
              },
              function(err) {
                console.log(`No permissions granted for ${permission}`);
                reject(err);
              }
            );
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
};
