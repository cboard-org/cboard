let host = window.location.host || '';
host = host.startsWith('www.') ? host.slice(4) : host;
export const API_URL = `${window.location.protocol}//api.${host}`;
