import fs from "fs";
import axios from "axios";
import { get3DModelUrl } from "./getDat3D.js";

const dataparts = "./Models/3DModels";
const file = process.argv[2]; // Utiliser process.argv pour obtenir l'argument de la ligne de commande

const downloadAndCheckDatFile = async (partId) => {
  const filePath = `${dataparts}/${partId}.dat`;

  // Vérifier si le fichier existe déjà
  if (fs.existsSync(filePath)) {
    console.log(`File ${filePath} already exists. Skipping download.`);
    return;
  }

  try {
    const [html, url] = await get3DModelUrl(partId);

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
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error:", error);
  }
};

const main = async () => {
  if (!fs.existsSync(dataparts)) {
    fs.mkdirSync(dataparts);
  }

  await downloadAndCheckDatFile(file);
};

main();