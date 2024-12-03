import * as THREE from "three";
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import fs from "fs";

const exportDir = "./Models/obj";
const modelsDir = "./Models/3DModels";
const tempDir = "./Models/temp";
const materialsDir = "./path/to/ldraw/materials"; // Chemin vers les fichiers de matériaux LDraw

// Créer les répertoires s'ils n'existent pas
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/**
 * Reads a .dat file and its referenced .dat files iteratively.
 *
 * @param {string} partId - The ID of the LEGO part to read.
 * @returns {Promise<string>} - The combined content of the .dat file and its references.
 */
const readAndMergeDatFiles = async (partId) => {
  const stack = [partId];
  let combinedContent = "";
  const processedFiles = new Set();

  while (stack.length > 0) {
    const currentPartId = stack.pop();
    const filePath = `${modelsDir}/${currentPartId}.dat`;

    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist.`);
    }

    if (processedFiles.has(currentPartId)) {
      continue;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    combinedContent += `\n${fileContent}`;
    processedFiles.add(currentPartId);

    const datFiles = fileContent.match(/([\w-]+\.dat)/g);
    if (datFiles) {
      for (const datFile of datFiles) {
        const newPartId = datFile.replace(".dat", "");
        stack.push(newPartId);
      }
    }
  }

  return combinedContent;
};

/**
 * Converts the LDraw .dat file to a 3D model and exports it in the specified format.
 *
 * @param {string} partId - The ID of the LEGO part to convert.
 * @param {string} format - The format to export the 3D model to ('obj' or 'glb').
 */
const convertAndExport3DModel = async (partId, format) => {
  const combinedContent = await readAndMergeDatFiles(partId);
  const tempFilePath = `${tempDir}/${partId}_merged.dat`;

  // Sauvegarder le contenu fusionné dans un fichier temporaire
  fs.writeFileSync(tempFilePath, combinedContent);

  const scene = new THREE.Scene();
  const ldrawLoader = new LDrawLoader();
  ldrawLoader.setPath(materialsDir); // Configurer le chemin vers les fichiers de matériaux LDraw

  ldrawLoader.parse(combinedContent, (group) => {
    scene.add(group);

    try {
      if (format === "obj") {
        const exporter = new OBJExporter();
        console.log("Exporting 3D model as OBJ...");
        const result = exporter.parse(scene);
        fs.writeFileSync(`${exportDir}/${partId}.obj`, result);
        console.log(`3D model exported as ${partId}.obj`);
      } else if (format === "glb") {
        const exporter = new GLTFExporter();
        exporter.parse(scene, (result) => {
          const output = JSON.stringify(result);
          fs.writeFileSync(`${exportDir}/${partId}.glb`, output);
          console.log(`3D model exported as ${partId}.glb`);
        });
      } else {
        console.error('Unsupported format. Please use "obj" or "glb".');
      }
    } catch (error) {
      console.error("An error occurred while exporting the 3D model:", error);
    }
  });
};

// Example usage
const partId = process.argv[2]; // Utiliser process.argv pour obtenir l'argument de la ligne de commande
const format = process.argv[3] || "obj"; // Format par défaut 'obj'
convertAndExport3DModel(partId, format);

// essayer de passer fusionner les fichiers .dat a la main en ligne de code sans passer par un truc en automatique
// faire attention au matric de transformation et au fichier en question