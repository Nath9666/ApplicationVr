import axios from "axios";
import { JSDOM } from "jsdom";

/**
 * Fetches details of a specific LEGO part in the BrickLink catalog.
 *
 * @param {string} partId - The ID of the LEGO part to retrieve details for.
 * @returns {Promise<Object>} A promise that resolves to the details of the LEGO part.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getPartDetailsBrick = async (partId) => {
  const url = `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${partId}#T=C`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extraire les informations importantes
    const name = document.querySelector("h1").textContent.trim();
    const categoryTd = document.querySelector(
      'td[align="left"][style*="background-color: #eeeeee;"]'
    );
    const category = categoryTd
      .querySelector('a[href*="catalogList.asp?catType=P&catString=5"]')
      .textContent.trim();
    const imageElement = document.querySelector("#_idImageMain");
    const imageUrl = imageElement ? `https:${imageElement.src}` : null;

    // Extraire les informations de la table
    const yearsReleased = document
      .querySelector("#yearReleasedSec")
      .textContent.trim();
    const weight = document
      .querySelector("#item-weight-info")
      .textContent.trim();
    let studDimensions = document.querySelector("#dimSec").textContent.trim();
    let temp = studDimensions.split("x");
    studDimensions = {
      length: temp[0],
      width: temp[1],
      height: temp[2].split("in")[0],
      mesure: "studs",
    };
    let packagingDimensions = document
      .querySelectorAll("#dimSec")[1]
      .textContent.trim();
    temp = packagingDimensions.split("x");
    packagingDimensions = {
      length: temp[0],
      width: temp[1],
      height: temp[2].split("cm")[0],
      mesure: "cm",
    };

    return {
      partId,
      name,
      category,
      imageUrl,
      yearsReleased,
      weight,
      studDimensions,
      packagingDimensions,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

getPartDetailsBrick("3003").then((data) => console.log(data));
