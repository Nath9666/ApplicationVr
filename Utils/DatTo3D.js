import axios from "axios";
import * as THREE from "three";
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import fs from "fs";

const exportDos = "./Models/.obj";

/**
 * Converts the LDraw .dat file to a 3D model and exports it in the specified format.
 *
 * @param {string} partId - The ID of the LEGO part to convert.
 * @param {string} format - The format to export the 3D model to ('obj' or 'glb').
 */
const convertAndExport3DModel = async (partId, format) => {
  const ldrawData = fs.readFileSync(`./Models/3DModels/${partId}.dat`, "utf-8");

  const scene = new THREE.Scene();
  const ldrawLoader = new LDrawLoader();
  ldrawLoader.parse(ldrawData, (group) => {
    scene.add(group);

    if (format === "obj") {
      const exporter = new OBJExporter();
      const result = exporter.parse(scene);
      fs.writeFileSync(`./Models/obj/${partId}.obj`, result);
      console.log(`3D model exported as ${partId}.obj`);
    } else if (format === "glb") {
      const exporter = new GLTFExporter();
      exporter.parse(scene, (result) => {
        const output = JSON.stringify(result);
        fs.writeFileSync(`./Models/obj/${partId}.glb`, output);
        console.log(`3D model exported as ${partId}.glb`);
      });
    } else {
      console.error('Unsupported format. Please use "obj" or "glb".');
    }
  });
};

// Example usage
convertAndExport3DModel("box", "obj"); // Change "obj" to "glb" to export as GLB
