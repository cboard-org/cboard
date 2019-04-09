let host = window.location.host || '';
host = host.startsWith('www.') ? host.slice(4) : host;
const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || null;
export const ARASAAC_BASE_PATH_API = 'https://api.arasaac.org/api/';
export const API_URL =
  DEV_API_URL || `${window.location.protocol}//api.${host}`;
export const TAWASOL_BASE_PATH_API =
  'http://madaportal.org/tawasol/wp-json/custom/v2/YOUR_APP_ID/';
