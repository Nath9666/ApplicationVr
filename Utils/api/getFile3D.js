import fs from "fs";
import { get3DModelUrl } from "./getDat3D.js";

const AllFilesDirectory = "./Utils/data/bricklinks";
const files = fs
  .readdirSync(AllFilesDirectory)
  .map((file) => `${AllFilesDirectory}/${file}`)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const data3Dparts = [];
const data3DpartsOther = [];
const file3D = "./Models/3Dparts.json";
const file3Dother = "./Models/3DpartsOther.json";

for (const file of files) {
  const content = fs.readFileSync(file, "utf-8");
  const json = JSON.parse(content);
  for (const part of json) {
    if (part.url3D != "N/A") {
      try {
        const data = await get3DModelUrl(part.partId);
        if (data[0].startsWith("0")) {
          console.log("\x1b[32m%s\x1b[0m", "3D model"); // Afficher en vert
          data3Dparts.push(part);
        } else {
          console.log(
            "\x1b[31m%s\x1b[0m",
            "No 3D model found for part",
            file,
            part.partId
          );
          data3DpartsOther.push(part);
        }
      } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "Error:", error);
      }
    }
  }
}

fs.writeFileSync(file3D, JSON.stringify(data3Dparts, null, 2));
fs.writeFileSync(file3Dother, JSON.stringify(data3DpartsOther, null, 2));
