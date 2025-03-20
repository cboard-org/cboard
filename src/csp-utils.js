const isDevelopment = process.env.NODE_ENV === 'development';
const localHostSources = isDevelopment
  ? 'http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* wss://localhost:* wss://127.0.0.1:*'
  : '';

const cspLinks = {
  localHost: localHostSources,
  app: 'https://*.cboard.io ',
  globalsymbols: 'https://globalsymbols.com/',
  microsoft: 'wss://*.microsoft.com/cognitiveservices/',
  eastus: 'eastus.tts.speech.microsoft.com',
  arasaac: 'https://api.arasaac.org/api/',
  paypal: 'https://*.paypal.com',
  paypalSandbox: 'https://*.sandbox.paypal.com',
  googleLinks: 'https://*.google.com',
  cboardDownload:
    'https://cboardgroupqadiag.blob.core.windows.net/arasaac/arasaac.zip',
  youtube: 'https://*.youtube.com',
  doubleclick: 'https://*.doubleclick.net',
  googleAnalytics: 'https://*.google-analytics.com',
  googleTagManager: 'https://*.googletagmanager.com'
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

  const cstTypeAll = `${cspType.sell} ${cspType.unsafeInline} ${
    cspType.unsafeEval
  }`;

  const cspContent = `
    default-src ${cstTypeAll} https://* ${cspLinks.app} ${
    cspLinks.localHost
  } blob: gap: data: ;
    script-src ${cstTypeAll} ${cspLinks.app} ${cspLinks.paypal} ${
    cspLinks.paypalSandbox
  } ${cspLinks.localHost};
    style-src 'self' 'unsafe-inline' ${cspLinks.app} ${cspLinks.paypal} ${
    cspLinks.paypalSandbox
  } ${cspLinks.localHost};
    connect-src 'self' ${cspLinks.app} ${
    cspLinks.localHost
  } 'unsafe-inline' 'unsafe-eval' ${cspLinks.arasaac} ${cspLinks.globalsymbols} 
    ${cspLinks.microsoft} ${cspLinks.eastus} ${cspLinks.paypal} ${
    cspLinks.paypalSandbox
  } ${cspLinks.googleLinks} ${cspLinks.doubleclick} ${
    cspLinks.googleAnalytics
  } ${cspLinks.googleTagManager} ${cspLinks.cboardDownload};
    img-src * data: filesystem: blob: ;
    media-src * data: filesystem: blob: ;
    form-action 'self' ${cspType.unsafeEval} ${cspType.unsafeInline} ${
    cspLinks.app
  } ${cspLinks.localHost};
    frame-src 'self' ${cspLinks.app} ${cspLinks.paypal} ${
    cspLinks.paypalSandbox
  } ${cspLinks.localHost} ${cspLinks.googleLinks}
     ${cspLinks.doubleclick} ${cspLinks.googleTagManager} ${
    cspLinks.tdDoubleClick
  } ${cspLinks.youtube};
    font-src 'self' data: ${cspLinks.paypal} ${cspLinks.paypalSandbox} ${
    cspLinks.localHost
  };`
    .replace(/\s+/g, ' ')
    .trim();

  // Añadir la meta tag dinámicamente
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = cspContent;
  document.head.appendChild(meta);
};

export { setupCSP };
