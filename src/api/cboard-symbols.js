/**
 * Cboard Symbols API Client
 *
 * This module provides functionality to search the Cboard Symbol library
 * hosted at cbuilder.cboard.io via the production API.
 *
 * @module cboard-symbols
 */

const CBOARD_SYMBOLS_API_BASE =
  process.env.REACT_APP_CBOARD_SYMBOLS_API_BASE ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/cboard-symbols'
    : 'https://cbuilder.cboard.io/api/cboard-symbols');

const API_KEY = process.env.REACT_APP_CBOARD_SYMBOLS_API_KEY;
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Search Cboard Symbols by keyword
 *
 * @param {string} locale - Locale code (e.g., "en-US", "es-ES", "pt-BR")
 * @param {string} searchText - Search query/keyword
 * @returns {Promise<Array>} Array of pictogram objects with structure:
 *   {
 *     _id: string,
 *     url: string,
 *     userId: string,
 *     originalLanguage: string,
 *     translations: {
 *       [lang]: {
 *         concept: string,
 *         normalizedConcept: string,
 *         keywords: string[]
 *       }
 *     },
 *     variants: [{
 *       url: string,
 *       skinTone: 'skin_emoji' | 'skin_light' | 'skin_medium_light' |
 *                 'skin_medium' | 'skin_medium_dark' | 'skin_dark'
 *     }] | null,
 *     userRate?: 1 | 2 | 3 | 4 | 5,
 *     createdAt: Date,
 *     updatedAt: Date
 *   }
 */
export async function searchCboardSymbols(locale, searchText) {
  // Validate input
  if (
    !searchText ||
    typeof searchText !== 'string' ||
    searchText.trim().length === 0
  ) {
    return [];
  }

  // Check API key is configured
  if (!API_KEY) {
    console.warn(
      'Cboard Symbols API key not configured. Set REACT_APP_CBOARD_SYMBOLS_API_KEY in .env'
    );
    return [];
  }

  // Convert locale to 2-letter language code (e.g., "en-US" → "en")
  const languageCode = locale.slice(0, 2).toLowerCase();

  // Encode search text for URL
  const encodedSearch = encodeURIComponent(searchText.trim());

  // Construct API URL
  const url = `${CBOARD_SYMBOLS_API_BASE}/pictograms/${languageCode}/search/${encodedSearch}`;

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(url, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle different response statuses
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Cboard Symbols API: Unauthorized - check API key');
      } else if (response.status === 404) {
        console.warn(`Cboard Symbols API: No results for "${searchText}"`);
      } else {
        console.warn(`Cboard Symbols API returned status ${response.status}`);
      }
      return [];
    }

    const data = await response.json();

    // Validate response is an array
    if (!Array.isArray(data)) {
      console.error('Cboard Symbols API returned invalid data format');
      return [];
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Cboard Symbols API request timeout');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error(
        'Cboard Symbols API network error - check internet connection'
      );
    } else {
      console.error('Cboard Symbols search failed:', error.message);
    }
    return [];
  }
}

/**
 * Get a pictogram by ID
 *
 * @param {string} pictogramId - The pictogram _id
 * @param {string} locale - Locale code
 * @returns {Promise<Object|null>} Pictogram object or null if not found
 */
export async function getCboardSymbolById(pictogramId, locale) {
  // This could be implemented if the API supports fetching by ID
  // For now, not implemented as the search API is the primary use case
  console.warn('getCboardSymbolById not yet implemented');
  return null;
}

/**
 * Map ARASAAC skin tone to Cboard Symbols skin tone
 *
 * @param {string} arasaacSkin - ARASAAC skin tone value
 * @returns {string} Cboard Symbols skin tone value
 */
export function mapArasaacToCboardSkinTone(arasaacSkin) {
  const skinToneMap = {
    white: 'skin_light',
    black: 'skin_dark',
    mulatto: 'skin_medium',
    asian: 'skin_medium_light',
    aztec: 'skin_medium_dark',
    // Default fallback
    default: 'skin_emoji'
  };

  return skinToneMap[arasaacSkin] || skinToneMap['default'];
}
const cboardSymbolsApi = {
  searchCboardSymbols,
  getCboardSymbolById,
  mapArasaacToCboardSkinTone
};

export default cboardSymbolsApi;
