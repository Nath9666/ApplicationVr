import fs from "fs";
import path from "path";

/**
 * Reads the contents of a .dat file.
 * @param {string} filePath - Path to the .dat file.
 * @returns {Array} - Array of file lines.
 */
function readDatFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent.split("\n").filter((line) => line.trim() !== "");
}

/**
 * Merges the contents of multiple .dat files.
 * @param {string} baseFilePath - Path to the base .dat file.
 * @param {Array<string>} additionalFilePaths - Array of paths to additional .dat files.
 * @param {string} outputFilePath - Path to save the merged file.
 */
function mergeMultipleDatFiles(
  baseFilePath,
  additionalFilePaths,
  outputFilePath
) {
  const baseLines = new Set(readDatFile(baseFilePath)); // Use a Set to avoid duplicates

  // Process each additional file
  additionalFilePaths.forEach((filePath) => {
    const additionalLines = readDatFile(filePath);
    additionalLines.forEach((line) => baseLines.add(line)); // Add unique lines to the Set
  });

  // Convert Set to Array and write to output file
  const mergedLines = Array.from(baseLines);
  fs.writeFileSync(outputFilePath, mergedLines.join("\n"), "utf-8");
  console.log(`Merged file saved to ${outputFilePath}`);
}

const exportDir = "./Models/obj";
const modelsDir = "./Models/3DModels";
const tempDir = "./Models/temp";

// Paths to the .dat files
const baseFilePath = path.join(modelsDir, "stud.dat");
const additionalFilePaths = [
  path.join(modelsDir, "4-4edge.dat"),
  path.join(modelsDir, "4-4cyli.dat"),
  path.join(modelsDir, "4-4disc.dat"),
];
const outputFilePath = path.join(tempDir, "merged.dat");

// Merge the .dat files
mergeMultipleDatFiles(baseFilePath, additionalFilePaths, outputFilePath);
