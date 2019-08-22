export const isCordova = () => !!window.cordova;
export const onCordovaReady = onReady =>
  document.addEventListener('deviceready', onReady, false);
export const requestCvaPermissions = () => {
  if (isCordova()) {
    var permissions = window.cordova.plugins.permissions;
    var plist = [
      permissions.CAMERA,
      permissions.READ_EXTERNAL_STORAGE,
      permissions.RECORD_AUDIO
    ];
    permissions.requestPermissions(plist, function(status) {
      if (status.checkPermission) {
        console.log('Permissions granted');
      } else {
        console.warn('No permissions granted');
      }
    });
  }
};
