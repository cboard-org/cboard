import { createMiddleware } from 'redux-beacon';
import GoogleAnalyticsGtag from '@redux-beacon/google-analytics-gtag';
import offlineWeb from '@redux-beacon/offline-web';
// import logger from '@redux-beacon/logger';

import boardEventsMap from './components/Board/Board.analytics';
import speechEventsMap from './providers/SpeechProvider/SpeechProvider.analytics';

const isConnected = state => state.app.isConnected;
const offlineStorage = offlineWeb(isConnected);

const eventsMap = {
  ...boardEventsMap,
  ...speechEventsMap
};

const trackingId = 'G-Y706E4YK8Q';
const ga = GoogleAnalyticsGtag(trackingId);

const gaMiddleware = createMiddleware(eventsMap, ga, {
  offlineStorage
});

export default gaMiddleware;
