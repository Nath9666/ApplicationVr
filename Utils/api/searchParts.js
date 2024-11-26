import fetch from 'node-fetch';

/**
 * Searches for LEGO parts using the Rebrickable API.
 *
 * @param {string} query - The search query for the LEGO parts.
 * @param {string} apiKey - The API key for authentication with the Rebrickable API.
 * @returns {Promise<Object>} - A promise that resolves to the search results data.
 * @throws {Error} - Throws an error if the fetch request fails.
 */
export const searchParts = async (query, apiKey) => {
  const url = `https://rebrickable.com/api/v3/lego/parts/?search=${query}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `key ${apiKey}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};