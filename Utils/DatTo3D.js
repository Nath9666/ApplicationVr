import axios from "axios";
import * as THREE from 'three';
import { LDrawLoader } from 'three-stdlib/loaders/LDrawLoader.js';
import { OBJExporter } from 'three-stdlib/exporters/OBJExporter.js';
import { GLTFExporter } from 'three-stdlib/exporters/GLTFExporter.js';
import fs from 'fs';

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
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Converts the LDraw .dat file to a 3D model and exports it in the specified format.
 *
 * @param {string} partId - The ID of the LEGO part to convert.
 * @param {string} format - The format to export the 3D model to ('obj' or 'glb').
 */
const convertAndExport3DModel = async (partId, format) => {
  const ldrawData = await get3DModelUrl(partId);

  const scene = new THREE.Scene();
  const ldrawLoader = new LDrawLoader();
  ldrawLoader.parse(ldrawData, (group) => {
    scene.add(group);

    if (format === 'obj') {
      const exporter = new OBJExporter();
      const result = exporter.parse(scene);
      fs.writeFileSync(`${partId}.obj`, result);
      console.log(`3D model exported as ${partId}.obj`);
    } else if (format === 'glb') {
      const exporter = new GLTFExporter();
      exporter.parse(scene, (result) => {
        const output = JSON.stringify(result);
        fs.writeFileSync(`${partId}.glb`, output);
        console.log(`3D model exported as ${partId}.glb`);
      });
    } else {
      console.error('Unsupported format. Please use "obj" or "glb".');
    }
  });
};

// Example usage
convertAndExport3DModel("3003", "obj"); // Change "obj" to "glb" to export as GLB