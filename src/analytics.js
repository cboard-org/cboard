import { createMiddleware } from 'redux-beacon';
import GoogleAnalyticsGtag from '@redux-beacon/google-analytics-gtag';
import offlineWeb from '@redux-beacon/offline-web';
// import logger from '@redux-beacon/logger';

import boardEventsMap from './components/Board/Board.analytics';
import speechEventsMap from './providers/SpeechProvider/SpeechProvider.analytics';

export const isGoogleAnalyticsConfigured = () =>
  !!process.env.REACT_APP_GA_TRACKING_ID;
const isConnected = state => state.app.isConnected;
const offlineStorage = offlineWeb(isConnected);

const eventsMap = {
  ...boardEventsMap,
  ...speechEventsMap
};

const trackingId = process.env.REACT_APP_GA_TRACKING_ID;
const ga = GoogleAnalyticsGtag(trackingId);

const gaMiddleware = createMiddleware(eventsMap, ga, {
  offlineStorage
});

export default gaMiddleware;
