import { isCordova } from './cordova-util';

let host = window.location.host || '';
host = host.startsWith('www.') ? host.slice(4) : host;
const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || null;
export const ARASAAC_BASE_PATH_API = 'https://api.arasaac.org/api/';
export const GLOBALSYMBOLS_BASE_PATH_API = 'https://globalsymbols.com/api/v1/';
export const API_URL = isCordova()
  ? 'https://api.app.cboard.io/'
  : DEV_API_URL || `${window.location.protocol}//api.${host}`;
export const TAWASOL_BASE_PATH_API =
  'https://madaportal.org/tawasol/wp-json/custom/v2/dea44ade76/';
export const TAWASOL_BASE_IMAGE_URL =
  'https://www.madaportal.org/tawasol/wp-content/uploads/images/';
