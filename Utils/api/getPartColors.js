import fetch from 'node-fetch';

/**
 * Fetches the colors available for a specific LEGO part.
 *
 * @param {string} partId - The ID of the LEGO part.
 * @param {string} apiKey - The API key for authentication.
 * @returns {Promise<Object>} A promise that resolves to the data containing the part colors.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getPartColors = async (partId, apiKey) => {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partId}/colors/`;

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