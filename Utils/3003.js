import * as THREE from "three";
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import fs from "fs";

const scene = new THREE.Scene();
const ldrawLoader = new LDrawLoader();

const modelsDir = "./Models/3DModels";
const exportDir = "./Models/obj";

const readAndScaleDatFile = (partId, scale) => {
  const filePath = `${modelsDir}/${partId}.dat`;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");

  const scaledLines = lines.map((line) => {
    if (line.startsWith("1 ")) {
      const parts = line.split(" ");
      const x = parseFloat(parts[2]) * scale;
      const y = parseFloat(parts[3]) * scale;
      const z = parseFloat(parts[4]) * scale;
      const m11 = parseFloat(parts[5]) * scale;
      const m12 = parseFloat(parts[6]) * scale;
      const m13 = parseFloat(parts[7]) * scale;
      const m21 = parseFloat(parts[8]) * scale;
      const m22 = parseFloat(parts[9]) * scale;
      const m23 = parseFloat(parts[10]) * scale;
      const m31 = parseFloat(parts[11]) * scale;
      const m32 = parseFloat(parts[12]) * scale;
      const m33 = parseFloat(parts[13]) * scale;
      return `1 ${parts[1]} ${x} ${y} ${z} ${m11} ${m12} ${m13} ${m21} ${m22} ${m23} ${m31} ${m32} ${m33} ${parts[14]}`;
    } else if (line.startsWith("2 ") || line.startsWith(" 2 ")) {
      const parts = line.split(" ");
      const x1 = parseFloat(parts[2]) * scale;
      const y1 = parseFloat(parts[3]) * scale;
      const z1 = parseFloat(parts[4]) * scale;
      const x2 = parseFloat(parts[5]) * scale;
      const y2 = parseFloat(parts[6]) * scale;
      const z2 = parseFloat(parts[7]) * scale;
      return `2 ${parts[1]} ${x1} ${y1} ${z1} ${x2} ${y2} ${z2}`;
    }
    return line;
  });

  return scaledLines.join("\n");
};

const partId = "4-4edge";
const scale = 10;
const scaledContent = readAndScaleDatFile(partId, scale);

ldrawLoader.parse(scaledContent, (group) => {
  group.translateX(-5);
  scene.add(group);

  const exporter = new OBJExporter();
  const result = exporter.parse(scene);
  fs.writeFileSync(`${exportDir}/${partId}2.obj`, result);
  console.log(`3D model exported as ${partId}2.obj`);
});
