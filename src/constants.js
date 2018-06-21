let host = window.location.host || '';
host = host.startsWith('www.') ? host.slice(4) : host;
const DEV_API_URL = process.env.REACT_APP_DEV_API_URL || null;
export const API_URL =
  DEV_API_URL || `${window.location.protocol}//api.${host}`;
