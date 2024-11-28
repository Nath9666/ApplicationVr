import axios from "axios";
import fs from "fs";

const max = 56183;

const getParts = async (page, limit) => {
  const url = `https://rebrickable.com/api/v3/lego/parts/?page=${page}&page_size=${limit}`;
  const headers = {
    Accept: "application/json",
    Authorization: "key d3dae823e10d9dd6872e861f3e2193a2",
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching parts:", error);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAllParts = async () => {
  for (let page = 0; page <= 57; page++) {
    const data = await getParts(page, 1000);
    if (data && data.results) {
      console.log(`Length of data.results: ${data.results.length}`);
      fs.writeFile(
        `./Utils/data/parts${page}.json`,
        JSON.stringify(data, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing to file:", err);
          } else {
            console.log(`Data successfully written to parts${page}.json`);
          }
        }
      );
    } else {
      console.log("No results found.");
    }
    await delay(1000); // Attendre 1 seconde avant de faire la prochaine requête
  }
};

fetchAllParts();
