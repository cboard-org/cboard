const isDevelopment = process.env.NODE_ENV === 'development';
const localHostSources = isDevelopment
  ? 'http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* wss://localhost:* wss://127.0.0.1:*'
  : '';

const cspLinks = {
  app:
    'https://*.cboard.io https://*.app.cboard.io/ https://*.app.qa.cboard.io/',
  arasaac: 'https://api.arasaac.org/api/ https://*.arasaac.org/',
  cboardDownload:
    'https://cboardgroupqadiag.blob.core.windows.net/arasaac/arasaac.zip https://*.blob.core.windows.net/',
  doubleclick: 'https://*.doubleclick.net https://stats.g.doubleclick.net/',
  eastus: 'eastus.tts.speech.microsoft.com',
  facebook: 'https://*.facebook.com',
  filePath: 'file://',
  globalsymbols: 'https://globalsymbols.com/',
  googleAnalytics:
    'https://*.google-analytics.com https://www.google-analytics.com/',
  googleLinks:
    'https://*.google.com https://www.google.com/ads/ https://www.google.com.ar/ads/',
  googleTagManager:
    'https://*.googletagmanager.com https://www.googletagmanager.com/ http://www.googletagmanager.com/gtag/js',
  localHost: `${localHostSources} http://localhost:3000/ http://localhost:10010/`,
  microsoft:
    'wss://*.microsoft.com/cognitiveservices/ https://*.microsoft.com/cognitiveservices/',
  paypal: 'https://*.paypal.com',
  paypalSandbox: 'https://*.sandbox.paypal.com',
  sslGstatic: 'https://*.gstatic.com',
  vsTrack:
    'https://dc.services.visualstudio.com/v2/track https://*.visualstudio.com/',
  youtube: 'https://*.youtube.com https://www.youtube.com/',
  cloudfront: 'https://*.cloudfront.net/',
  apple: 'com.apple.*'
};

const cspType = {
  self: "'self'",
  unsafeInline: "'unsafe-inline'",
  unsafeEval: "'unsafe-eval'",
  data: 'data:',
  filesystem: 'filesystem:',
  blob: 'blob:',
  gap: 'gap:'
};

const setupCSP = () => {
  // Detectar entorno

  const cstTypeAll = `${cspType.self} ${cspType.unsafeInline} ${
    cspType.unsafeEval
  }`;

  const defaultSrc = `default-src ${cstTypeAll} ${cspLinks.app} ${
    cspLinks.localHost
  } ${cspLinks.filePath} blob: gap: data:;`;

  const scriptSrc = `script-src ${cstTypeAll} ${cspLinks.app} ${
    cspLinks.paypal
  } ${cspLinks.paypalSandbox} ${cspLinks.localHost} ${cspLinks.filePath} ${
    cspLinks.cloudfront
  };`;

  const styleSrc = `style-src 'self' 'unsafe-inline' ${cspLinks.app} ${
    cspLinks.paypal
  } ${cspLinks.paypalSandbox} ${cspLinks.localHost} ${cspLinks.cloudfront};`;

  const connectedSrc = `connect-src 'self' ${cspLinks.app} ${
    cspLinks.localHost
  } 'unsafe-inline' 'unsafe-eval' ${cspLinks.arasaac} ${cspLinks.globalsymbols} 
    ${cspLinks.microsoft} ${cspLinks.eastus} ${cspLinks.paypal} ${
    cspLinks.paypalSandbox
  } ${cspLinks.googleLinks} ${cspLinks.doubleclick} ${
    cspLinks.googleAnalytics
  } ${cspLinks.googleTagManager} ${cspLinks.cboardDownload} ${
    cspLinks.vsTrack
  } ${cspLinks.apple} ;`;

  const imgSrc = `img-src * data: filesystem: blob: ${cspLinks.filePath} ${
    cspLinks.cloudfront
  };`;

  const mediaSrc = `media-src * data: filesystem: blob: ${cspLinks.filePath};`;

  const formAction = `form-action 'self' ${cspType.unsafeEval} ${
    cspType.unsafeInline
  } ${cspLinks.app} ${cspLinks.localHost};`;

  const frameSrc = `frame-src 'self' ${cspLinks.app} ${cspLinks.paypal} ${
    cspLinks.paypalSandbox
  } ${cspLinks.localHost} ${cspLinks.googleLinks}
     ${cspLinks.doubleclick} ${cspLinks.googleTagManager} ${
    cspLinks.tdDoubleClick
  } ${cspLinks.youtube};`;

  const fontSrc = `font-src 'self' data: ${cspLinks.paypal} ${
    cspLinks.paypalSandbox
  } ${cspLinks.localHost} ${cspLinks.filePath};`;

  const baseUri = `base-uri 'self';`;

  const cspContent = `
    ${defaultSrc}
    ${scriptSrc}
    ${styleSrc}
    ${connectedSrc}
    ${imgSrc}
    ${mediaSrc}
    ${formAction}
    ${frameSrc}
    ${fontSrc}
    ${baseUri}
    `
    .replace(/\s+/g, ' ')
    .trim();

  // Añadir la meta tag dinámicamente
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = cspContent;
  document.head.appendChild(meta);
};

export { setupCSP };
