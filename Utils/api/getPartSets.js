import fetch from 'node-fetch';

/**
 * Fetches the sets that contain a specific part from the Rebrickable API.
 *
 * @param {string} partId - The ID of the part to fetch sets for.
 * @param {string} apiKey - The API key for authenticating with the Rebrickable API.
 * @returns {Promise<Object>} A promise that resolves to the data containing sets that include the specified part.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getPartSets = async (partId, apiKey) => {
  const url = `https://rebrickable.com/api/v3/lego/parts/${partId}/sets/`;

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