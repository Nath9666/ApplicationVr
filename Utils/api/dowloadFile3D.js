import fs from "fs";
import axios from "axios";
import { get3DModelUrl } from "./getDat3D.js";

const dataparts = "./Models/3Dparts.json";
const data3Dparts = JSON.parse(fs.readFileSync(dataparts, "utf-8"));

const downloadAndCheckDatFile = async (partId) => {
  try {
    const [html, url] = await get3DModelUrl(partId);

    // Sauvegarder le fichier .dat
    const filePath = `./3DModels/${partId}.dat`;
    fs.writeFileSync(filePath, html);
    console.log(`3D model saved as ${filePath}`);

    // Vérifier s'il y a des fichiers .dat à l'intérieur
    const datFiles = data.match(/(\d+\.dat)/g);
    if (datFiles) {
      for (const datFile of datFiles) {
        const newPartId = datFile.replace(".dat", "");
        await downloadAndCheckDatFile(newPartId);
      }
    }
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error:", error);
  }
};

const processParts = async (partIds) => {
  if (partIds.length === 0) {
    return;
  }

  const partId = partIds.shift();
  await downloadAndCheckDatFile(partId);
  await processParts(partIds);
};

processParts(data3Dparts);