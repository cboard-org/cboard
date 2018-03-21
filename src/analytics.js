import { createMiddleware } from 'redux-beacon';
import { GoogleAnalytics } from 'redux-beacon/targets/google-analytics';
import boardEventsMap from './components/Board/Board.analytics';
import speechEventsMap from './providers/SpeechProvider/SpeechProvider.analytics';

const eventsMap = {
  ...boardEventsMap,
  ...speechEventsMap
};
const googleAnalytics = createMiddleware(eventsMap, GoogleAnalytics);

export default googleAnalytics;
