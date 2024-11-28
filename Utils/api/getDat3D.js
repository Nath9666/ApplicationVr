import axios from "axios";
import { JSDOM } from "jsdom";

/**
 * Fetches the 3D model URL or WebGL data for a specific LEGO part.
 *
 * @param {string} partId - The ID of the LEGO part to retrieve the 3D model URL or WebGL data for.
 * @returns {Promise<string>} A promise that resolves to the 3D model URL or WebGL data.
 * @throws Will throw an error if the fetch operation fails.
 */
const get3DModelUrl = async (partId) => {
  const url = `https://www.bricklink.com/3D/parts/${partId}.dat`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    

    return html;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

get3DModelUrl("x1214").then((data) => console.log(data));

// TODO: faire la liste des pièces à récupérer
// TODO: fusionner les fichier json en un seul
// TODO: voir si dans bricklink on peut récupérer les pièces en 3D