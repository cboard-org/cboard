import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { NODE_ENV, AZURE_INST_KEY } from './constants';

export const appInsights = new ApplicationInsights({
  config: {
    disableTelemetry: NODE_ENV === 'development',
    instrumentationKey: AZURE_INST_KEY,
    enableAutoRouteTracking: true,
    loggingLevelTelemetry: 2,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAjaxErrorStatusText: true,
    correlationHeaderExcludedDomains: [
      '*.google-analytics.com',
      'globalsymbols.com',
      '*.arasaac.org',
      'mulberrysymbols.org',
      'madaportal.org',
      '*.doubleclick.net',
      'pagead2.googlesyndication.com',
      'eastus.tts.speech.microsoft.com'
    ]
  }
});

const initializeAppInsights = () => {
  appInsights.loadAppInsights();
  appInsights.trackPageView();
};
// Debug - Register which component made the getSubscriber() http request
appInsights.addDependencyInitializer(dependencyTelemetry => {
  const calledFrom =
    dependencyTelemetry?.item?.properties?.requestHeaders?.CalledFrom;
  if (calledFrom) {
    dependencyTelemetry.item.properties.calledFrom = calledFrom;
  }
});

export { initializeAppInsights };
