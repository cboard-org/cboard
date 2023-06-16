import { isCordova } from './cordova-util';

let host = window.location.host || '';
host = host.startsWith('www.') ? host.slice(4) : host;
const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || null;
export const ARASAAC_BASE_PATH_API = 'https://api.arasaac.org/api/';
export const GLOBALSYMBOLS_BASE_PATH_API = 'https://globalsymbols.com/api/v1/';

const RAW_API_URL = isCordova()
  ? 'https://api.app.cboard.io/'
  : DEV_API_URL || `${window.location.protocol}//api.${host}`;
const RAW_API_URL_LAST_CHAR = RAW_API_URL.length - 1;
export const API_URL =
  RAW_API_URL[RAW_API_URL_LAST_CHAR] === '/' ? RAW_API_URL : `${RAW_API_URL}/`;

// Azure related constants
export const AZURE_INST_KEY =
  process.env.REACT_APP_AZURE_INST_KEY ||
  '874487ac-304c-4160-b8f3-a221541eab61';
export const AZURE_SPEECH_SUBSCR_KEY =
  process.env.REACT_APP_AZURE_SPEECH_KEY || '910a3256e6aa4b4daf631cd0f550c995';
export const AZURE_SPEECH_SERVICE_REGION =
  process.env.REACT_APP_AZURE_SPEECH_SERVICE_REGION || 'eastus';
export const AZURE_VOICES_BASE_PATH_API =
  'https://' +
  AZURE_SPEECH_SERVICE_REGION +
  '.tts.speech.microsoft.com/cognitiveservices/voices/';

// AdSense constants
export const NODE_ENV = process.env.NODE_ENV;
const HOSTNAME = window.location.hostname;
export const ADSENSE_ON_PRODUCTION =
  HOSTNAME === 'app.cboard.io' && NODE_ENV === 'production';
export const ADTEST_AVAILABLE =
  HOSTNAME === 'app.dev.cboard.io' || HOSTNAME === 'app.qa.cboard.io';
export const ADSENSE_CLIENT = 'ca-pub-7162313874228987';
export const ADD_SLOT_SETTINGS_TOP = '5250438005';

// Apple & iOS related constants
const userAgent = navigator.userAgent;
export const IS_BROWSING_FROM_APPLE = /iPad|iPhone|iPod|Mac/.test(userAgent);
export const IS_BROWSING_FROM_APPLE_TOUCH =
  IS_BROWSING_FROM_APPLE && 'ontouchend' in document;
export const IS_BROWSING_FROM_SAFARI =
  userAgent.indexOf('Safari') > -1 &&
  userAgent.indexOf('Chrome') === -1 &&
  !navigator.userAgent.match(/crios/i) &&
  !navigator.userAgent.match(/fxios/i) &&
  !navigator.userAgent.match(/Opera|OPT\//);

// PayPal related constants
export const PAYPAL_CLIENT_ID =
  HOSTNAME === 'app.cboard.io' && NODE_ENV === 'production'
    ? 'AVQiWeMc55uBVqvgXY2yifS6v9Pt2jYxtJhA3JV0UEhLiV4Mf5W9Hanxoix8542FYACVizlyU8M0yO0S'
    : 'AZ2vK0luRWMX9zzwLs-Ko_B_TJxeHYvIFCgXWcNBt50wmj7oZcUw8n4cf11GgdClTVnYMuEs5vRnxVEk';
