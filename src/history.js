import { createBrowserHistory, createHashHistory } from 'history';

// window.cordova isn't set at module-eval time, so detect packaged apps by
// their non-web scheme (Electron/Android file://, iOS app://localhost) and use
// hash history there; genuine web (http/https) uses browser history.
const isWebHosted =
  window.location.protocol === 'http:' || window.location.protocol === 'https:';
const history = isWebHosted ? createBrowserHistory() : createHashHistory();
export default history;
