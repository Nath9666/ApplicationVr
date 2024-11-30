import axios from "axios";
import { JSDOM } from "jsdom";
import fs from "fs";
import { get3DModelUrl } from "./getDat3D.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const time = 30000;

const fetchWithRetry = async (url, retries = 3, delayMs = 60000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      console.error(`Retry ${i + 1}/${retries} failed: ${error.message}`);
      await delay(delayMs);
    }
  }
};

/**
 * Fetches details of a specific LEGO part in the BrickLink catalog.
 *
 * @param {string} partId - The ID of the LEGO part to retrieve details for.
 * @returns {Promise<Object>} A promise that resolves to the details of the LEGO part.
 * @throws Will throw an error if the fetch operation fails.
 */
export const getPartDetailsBrick = async (partId) => {
  const url = `https://www.bricklink.com/v2/catalog/catalogitem.page?P=${partId}#T=C`;
  await delay(time); // Attendre 1 seconde avant de faire la prochaine requête
  try {
    const response = await fetchWithRetry(url);
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

    const imageElement = document.querySelector("#_idImageMain");
    const imageUrl = imageElement ? `https:${imageElement.src}` : "N/A";

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

    // Récupérer l'URL du modèle 3D
    let url3D;
    try {
      const data = await get3DModelUrl(partId);
      if (data[0].startsWith("<!doctype html>")) {
        url3D = "N/A";
      } else {
        console.log("\x1b[32m%s\x1b[0m", "3D model"); // Afficher en vert
        url3D = data[1];
      }
    } catch (error) {
      url3D = "N/A";
    }

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
  .map((file) => `${AllFilesDirectory}/${file}`)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const processFiles = async () => {
  let totalFiles = files.length;
  const batchSize = 50; // Taille du lot pour les parts

  for (let i = 31; i < totalFiles; i++) {
    const file = files[i];
    const data = fs.readFileSync(file);
    const dataDist = file
      .replace("rebrickable", "bricklinks")
      .replace(".json", "_bricklinks.json");
    const json = JSON.parse(data);
    const parts = json.results;

    for (let j = 0; j < parts.length; j += batchSize) {
      const batchParts = parts.slice(j, j + batchSize);

      const partPromises = batchParts.map(async (part, partNumber) => {
        console.log(
          `${i}/${totalFiles} - part ${j + partNumber + 1}/${
            parts.length
          }`
        );
        if (!part.external_ids || !part.external_ids.BrickLink) {
          console.log(`no bricklink id for ${part.part_num}`);
          return null;
        }
        const id = part.external_ids.BrickLink[0];
        const partDetails = await getPartDetailsBrick(id);
        console.log(`data arrive ${partDetails.partId}`);
        return partDetails;
      });

      const allParts = await Promise.all(partPromises);
      fs.writeFileSync(
        dataDist.split(".json")[0] + `_${j + 1}.json`,
        JSON.stringify(allParts.filter(Boolean), null, 2)
      );

      await delay(time); // Attendre avant de traiter le prochain lot
    }
  }
};

processFiles();
