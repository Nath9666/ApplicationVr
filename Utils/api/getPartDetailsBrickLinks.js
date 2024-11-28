import axios from "axios";
import { JSDOM } from "jsdom";
import fs from "fs";
import { get3DModelUrl } from "./getDat3D.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches details of a specific LEGO part in the BrickLink catalog.
 *
 * @param {string} partId - The ID of the LEGO part to retrieve details for.
 * @returns {Promise<Object>} A promise that resolves to the details of the LEGO part.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getPartDetailsBrick = async (partId) => {
  const url = `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${partId}#T=C`;
  await delay(1000); // Attendre 1 seconde avant de faire la prochaine requête
  try {
    const response = await axios.get(url);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extraire les informations importantes
    const nameElement = document.querySelector("h1");
    const name = nameElement ? nameElement.textContent.trim() : "N/A";

    const categoryTd = document.querySelector(
      'td[align="left"][style*="background-color: #eeeeee;"]'
    );
    const categoryElement = categoryTd
      ? categoryTd.querySelector(
          'a[href*="catalogList.asp?catType=P&catString=5"]'
        )
      : null;
    const category = categoryElement
      ? categoryElement.textContent.trim()
      : "N/A";

    // Extraire les informations de la table
    const yearsReleasedElement = document.querySelector("#yearReleasedSec");
    const yearsReleased = yearsReleasedElement
      ? yearsReleasedElement.textContent.trim()
      : "N/A";

    const weightElement = document.querySelector("#item-weight-info");
    const weight = weightElement ? weightElement.textContent.trim() : "N/A";

    let studDimensionsElement = document.querySelector("#dimSec");
    let studDimensions = "N/A";
    if (studDimensionsElement) {
      studDimensions = studDimensionsElement.textContent;
    }

    let packagingDimensionsElement = document.querySelectorAll("#dimSec")[1];
    let packagingDimensions = "N/A";
    if (packagingDimensionsElement) {
      packagingDimensions = packagingDimensionsElement.textContent;
    }
    let url3D
    get3DModelUrl("3003").then((data, url) => {
      if (data) {
        if (data.startsWith("0")) {
          console.log("3D model is Dat format.");
          url3D = url;
        }
      } else {
        console.log("No results found.");
      }
    });

    return {
      partId,
      name,
      url,
      url3D,
      category,
      yearsReleased,
      weight,
      studDimensions,
      packagingDimensions,
    };
  } catch (error) {
    console.error("Error:", error);
    return { partId, error: "No data found" };
  }
};

const AllFilesDirectory = "./Utils/data/rebrickable/";
const files = fs
  .readdirSync(AllFilesDirectory)
  .map((file) => `${AllFilesDirectory}/${file}`);

const processFiles = async () => {
  for (const file of files) {
    const data = fs.readFileSync(file);
    const dataDist = file
      .replace("rebrickable", "bricklinks")
      .replace(".json", "_bricklinks.json");
    const allParts = [];
    const json = JSON.parse(data);
    const parts = json.results;
    for (const part of parts) {
      if (!part.external_ids || !part.external_ids.BrickLink) {
        console.log(`no bricklink id for ${part.part_num}`);
        continue;
      }
      const id = part.external_ids.BrickLink[0];
      const partDetails = await getPartDetailsBrick(id);
      allParts.push(partDetails);
      console.log(`data arrive ${partDetails.partId}`);
      await delay(1000); // Attendre 1 seconde avant de faire la prochaine requête
    }
    fs.writeFileSync(dataDist, JSON.stringify(allParts, null, 2));
  }
};
processFiles();

