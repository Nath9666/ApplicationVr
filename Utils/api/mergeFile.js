import fs from "fs";

const infoImportante = ["part_num", "name", "part_img_url", "external_ids"];

const mergeFile = (files, fileDist) => {
  let allParts = [];

  files.forEach((file) => {
    const data = fs.readFileSync(file);
    const json = JSON.parse(data);
    const parts = json.results;
    parts.forEach((part) => {
      const filteredPart = infoImportante.reduce((acc, key) => {
        acc[key] = part[key];
        return acc;
      }, {});
      allParts.push(filteredPart);
    });
  });

  fs.writeFileSync(fileDist, JSON.stringify(allParts, null, 2));
};

const AllFilesDirectory = "./Utils/data";
const files = fs.readdirSync(AllFilesDirectory).map(file => `${AllFilesDirectory}/${file}`);
const fileDist = "./Models/_Bdd.json";

// Clean file
fs.writeFileSync(fileDist, "");
// Merge files
mergeFile(files, fileDist);