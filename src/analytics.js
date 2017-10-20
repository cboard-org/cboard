import { createMiddleware } from 'redux-beacon';
import { GoogleAnalytics } from 'redux-beacon/targets/google-analytics';
import boardEventsMap from './components/Board/Board.analytics';
import speechEventsMap from './speech/analytics';

const eventsMap = {
  ...boardEventsMap,
  ...speechEventsMap
};
debugger;
const googleAnalytics = createMiddleware(eventsMap, GoogleAnalytics);

export default googleAnalytics;
