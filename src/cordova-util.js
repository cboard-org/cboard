export const isCordova = () => !!window.cordova;
export const onCordovaReady = onReady =>
  document.addEventListener('deviceready', onReady, false);
export const requestCvaPermissions = () => {
  if (isCordova()) {
    var permissions = window.cordova.plugins.permissions;
    permissions.checkPermission(
      permissions.CAMERA,
      function(status) {
        console.log('HAS CAMERA:', status.hasPermission);
        if (!status.hasPermission) {
          permissions.requestPermission(
            permissions.CAMERA,
            function(status) {
              console.log('success requesting CAMERA permission');
            },
            function(err) {
              console.warn('No permissions granted');
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
