export const isCordova = () => !!window.cordova;
export const onCordovaReady = onReady =>
  document.addEventListener('deviceready', onReady, false);
