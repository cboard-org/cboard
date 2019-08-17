export const isCordova = () => !!window.cordova;
export const onCordovaReady = onReady =>
  document.addEventListener('deviceready', onReady, false);
export var permissions = window.cordova.plugins.permissions;
