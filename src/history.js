import { createBrowserHistory, createHashHistory } from 'history';
import { isCordova } from './cordova-util';

const history = isCordova() ? createHashHistory() : createBrowserHistory();
export default history;
