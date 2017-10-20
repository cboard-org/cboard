import { createMiddleware } from 'redux-beacon';
import { GoogleAnalytics } from 'redux-beacon/targets/google-analytics';
import boardEventsMap from './components/Board/Board.analytics';

const eventsMap = {
  ...boardEventsMap
};

const googleAnalytics = createMiddleware(eventsMap, GoogleAnalytics);

export default googleAnalytics;
