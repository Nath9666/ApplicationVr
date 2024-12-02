import fs from "fs";
import axios from "axios";
import { get3DModelUrl } from "./getDat3D.js";

const dataparts = "./Models/3Dparts.json";
const data3Dparts = JSON.parse(fs.readFileSync(dataparts, "utf-8"));

// Créer le répertoire 3DModels s'il n'existe pas
const modelsDir = "./Models/3DModels";
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

const downloadAndCheckDatFile = async (partId) => {
  const filePath = `${modelsDir}/${partId}.dat`;

  // Vérifier si le fichier existe déjà
  if (fs.existsSync(filePath)) {
    console.log(`File ${filePath} already exists. Skipping download.`);
    return;
  }

  try {
    const [html, url] = await get3DModelUrl(partId);

    if (html.startsWith("0")) {
      // Sauvegarder le fichier .dat
      fs.writeFileSync(filePath, html);
      console.log(`3D model saved as ${filePath}`);

      // Vérifier s'il y a des fichiers .dat à l'intérieur
      const datFiles = html.match(/(\d+\.dat)/g);
      if (datFiles) {
        for (let i = 1; i < datFiles.length; i++) {
          const datFile = datFiles[i];
          const newPartId = datFile.replace(".dat", "");
          await downloadAndCheckDatFile(newPartId);
        }
      }
    } else {
      console.log("\x1b[31m%s\x1b[0m", "No 3D model found for part", partId);
    }
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error:", error);
  }
};

const processParts = async (partIds) => {
  if (partIds.length === 0) {
    return;
  }

  const part = partIds.shift();
  await downloadAndCheckDatFile(part.partId);
  await processParts(partIds);
};

processParts(data3Dparts);
