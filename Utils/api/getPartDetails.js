import fetch from 'node-fetch';

/**
 * Fetches details of a specific LEGO part from the Rebrickable API.
 *
 * @param {string} partId - The ID of the LEGO part to retrieve details for.
 * @param {string} apiKey - The API key for authenticating with the Rebrickable API.
 * @returns {Promise<Object>} A promise that resolves to the details of the LEGO part.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getPartDetails = async (partId, apiKey) => {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partId}/`;

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