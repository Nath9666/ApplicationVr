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
      let temp = studDimensionsElement.textContent.trim().split("x");
      if (temp.length === 3) {
        studDimensions = {
          length: temp[0],
          width: temp[1],
          height: temp[2].split("in")[0],
          mesure: "studs",
        };
      }
    }

    let packagingDimensionsElement = document.querySelectorAll("#dimSec")[1];
    let packagingDimensions = "N/A";
    if (packagingDimensionsElement) {
      let temp = packagingDimensionsElement.textContent.trim().split("x");
      if (temp.length === 3) {
        packagingDimensions = {
          length: temp[0],
          width: temp[1],
          height: temp[2].split("cm")[0],
          mesure: "cm",
        };
      }
    }

    // Récupérer l'URL du modèle 3D
    let url3D;
    try {
      const data = await get3DModelUrl(partId);
      if (data[0].startsWith("<!doctype html>")) {
        url3D = "N/A";
      } else {
        console.log("3D model");
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
  let fileNumber = 0;
  let totalFiles = files.length;
  for (const file of files) {
    fileNumber++;
    let partNumber = 0;
    const data = fs.readFileSync(file);
    const dataDist = file
      .replace("rebrickable", "bricklinks")
      .replace(".json", "_bricklinks.json");
    const allParts = [];
    const json = JSON.parse(data);
    const parts = json.results;
    let totalParts = parts.length;
    for (const part of parts) {
      partNumber++;
      console.log(
        `${fileNumber}/${totalFiles} - part ${partNumber}/${totalParts}`
      );
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
