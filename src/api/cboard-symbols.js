/**
 * Cboard Symbols API Client
 *
 * This module provides functionality to search the Cboard Symbol library
 * hosted at cbuilder.cboard.io via the production API.
 *
 * The API is public (no API key required) and access is restricted by
 * CORS origin validation on the server side — only requests from
 * app.cboard.io (production) and localhost (development) are allowed.
 *
 * @module cboard-symbols
 */

const CBOARD_SYMBOLS_API_BASE =
  process.env.REACT_APP_CBOARD_SYMBOLS_API_BASE ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/cboard-symbols'
    : 'https://cbuilder.cboard.io/api/cboard-symbols');

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
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle different response statuses
    if (!response.ok) {
      if (response.status === 404) {
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
    default: 'skin_emoji'
  };

  return skinToneMap[arasaacSkin] || skinToneMap['default'];
}

const cboardSymbolsApi = {
  searchCboardSymbols,
  mapArasaacToCboardSkinTone
};

export default cboardSymbolsApi;
