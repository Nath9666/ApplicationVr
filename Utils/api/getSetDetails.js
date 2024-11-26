import fetch from 'node-fetch';

/**
 * Fetches the details of a LEGO set from the Rebrickable API.
 *
 * @param {string} setId - The ID of the LEGO set to fetch details for.
 * @param {string} apiKey - The API key for authenticating with the Rebrickable API.
 * @returns {Promise<Object>} A promise that resolves to the details of the LEGO set.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getSetDetails = async (setId, apiKey) => {
  const url = `https://rebrickable.com/api/v3/lego/sets/${setId}/`;

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