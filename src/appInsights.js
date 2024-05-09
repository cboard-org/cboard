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
// Debug - Register getSubscriber() http request origin
appInsights.addDependencyInitializer(dependencyTelemetry => {
  const requestOrigin =
    dependencyTelemetry?.item?.properties?.requestHeaders?.requestOrigin;
  if (requestOrigin) {
    dependencyTelemetry.item.properties.requestOrigin = requestOrigin;
  }
});

export { initializeAppInsights };
