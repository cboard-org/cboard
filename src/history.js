import { createBrowserHistory, createHashHistory } from 'history';
import { isPackagedApp } from './cordova-util';

// Packaged apps (Electron/Android file://, iOS app://localhost) need hash
// history; HTML5 path history doesn't resolve there. Web uses browser history.
const history = isPackagedApp() ? createHashHistory() : createBrowserHistory();
export default history;
