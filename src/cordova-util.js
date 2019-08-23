export const isCordova = () => !!window.cordova;
export const onCordovaReady = onReady =>
  document.addEventListener('deviceready', onReady, false);
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
