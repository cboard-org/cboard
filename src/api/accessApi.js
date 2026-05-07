import axios from 'axios';
import { API_URL } from '../constants';

/**
 * Standalone axios client for public Access endpoints.
 * Does NOT share the main API class instance — intentionally has no auth
 * interceptor so that 403 responses from public endpoints are handled by
 * the caller instead of dispatching logout() and redirecting to /login-signup/.
 */
const accessClient = axios.create({ baseURL: API_URL });

/**
 * Lists active clients for the Cboard Access section.
 * @returns {Promise<{total: number, data: Array}>}
 */
export async function getAccessClients() {
  const { data } = await accessClient.get('/access/clients/all');
  return data;
}

/**
 * Gets ALL boards for a slug + access code pair in a single request.
 * Enables instant frontend navigation without additional requests.
 * @param {string} slug - Client slug (e.g. cafeteria-don-pedro)
 * @param {string} code - Access code (e.g. CAFE01)
 * @returns {Promise<{client: Object, boards: Array, rootBoardId: string}>}
 */
export async function getAccessBoard(slug, code) {
  const { data } = await accessClient.get(`/access/${slug}/${code}`);
  return data;
}
