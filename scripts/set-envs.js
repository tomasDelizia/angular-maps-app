const { writeFileSync, mkdirSync } = require('fs');

require ('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

const mapBoxApiKey = process.env['MAP_BOX_API_KEY'];

if (!mapBoxApiKey) {
  throw new Error("Environment variable MAP_BOX_API_KEY is missing");
}

const envFileContent = `
export const environment = {
  // API Keys
  mapBoxApiKey: '${mapBoxApiKey}',
};
`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
