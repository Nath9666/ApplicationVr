import fetch from 'node-fetch';

/**
 * Searches for LEGO sets based on a query string.
 *
 * @param {string} query - The search query string.
 * @param {string} apiKey - The API key for authentication.
 * @returns {Promise<Object>} A promise that resolves to the search results.
 * @throws Will throw an error if the fetch operation fails.
 */
export const searchSets = async (query, apiKey) => {
  const url = `https://rebrickable.com/api/v3/lego/sets/?search=${query}`;

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