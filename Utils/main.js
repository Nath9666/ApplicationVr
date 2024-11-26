import { getPartDetails } from './api/getPartDetails.js';
import { getPartColors } from './api/getPartColors.js';
import { getPartSets } from './api/getPartSets.js';
import { getSetDetails } from './api/getSetDetails.js';
import { getSetParts } from './api/getSetParts.js';
import { searchParts } from './api/searchParts.js';
import { searchSets } from './api/searchSets.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.REBRICKABLE_API_KEY;

const showHelp = () => {
  console.log(`
Usage: node main.js <command> <argument>

Commands:
  getPartDetails <partId>       - Fetch details of a LEGO part
  getPartColors <partId>        - Fetch available colors for a LEGO part
  getPartSets <partId>          - Fetch sets containing a LEGO part
  getSetDetails <setId>         - Fetch details of a LEGO set
  getSetParts <setId>           - Fetch parts of a LEGO set
  searchParts <query>           - Search for LEGO parts
  searchSets <query>            - Search for LEGO sets
  help                          - Show this help message
`);
};

const command = process.argv[2]; // Lire la commande depuis les arguments de la ligne de commande
const argument = process.argv[3]; // Lire l'argument depuis les arguments de la ligne de commande

if (!command || command === 'help') {
  showHelp();
} else {
  switch (command) {
    case 'getPartDetails':
      getPartDetails(argument, apiKey).then(data => console.log(data));
      break;
    case 'getPartColors':
      getPartColors(argument, apiKey).then(data => console.log(data));
      break;
    case 'getPartSets':
      getPartSets(argument, apiKey).then(data => console.log(data));
      break;
    case 'getSetDetails':
      getSetDetails(argument, apiKey).then(data => console.log(data));
      break;
    case 'getSetParts':
      getSetParts(argument, apiKey).then(data => console.log(data));
      break;
    case 'searchParts':
      searchParts(argument, apiKey).then(data => console.log(data));
      break;
    case 'searchSets':
      searchSets(argument, apiKey).then(data => console.log(data));
      break;
    default:
      console.log('Unknown command');
      showHelp();
      break;
  }
}