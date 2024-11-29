import axios from "axios";
import { JSDOM } from "jsdom";

/**
 * Fetches the 3D model URL or WebGL data for a specific LEGO part.
 *
 * @param {string} partId - The ID of the LEGO part to retrieve the 3D model URL or WebGL data for.
 * @returns {Promise<string>} A promise that resolves to the 3D model URL or WebGL data.
 * @throws Will throw an error if the fetch operation fails.
 */
export const get3DModelUrl = async (partId) => {
  const url = `https://www.bricklink.com/3D/parts/${partId}.dat`;

  try {
    const response = await axios.get(url);
    const html = response.data;

    return [html, url];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};