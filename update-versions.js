import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("--- Starting version update script ---");

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
let versionParts = packageJson.version.split('.');
versionParts[2] = parseInt(versionParts[2], 10) + 1;
const newVersion = versionParts.join('.');

console.log(`New version will be: ${newVersion}`);

packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log(`✅ package.json updated.`);

const swFilePath = path.join(__dirname, 'service-worker.js');
try {
    let swContent = fs.readFileSync(swFilePath, 'utf8');
    swContent = swContent.replace(/const CACHE_NAME = 'gunners-stats-v[^']+/g, `const CACHE_NAME = 'gunners-stats-v${newVersion}'`);
    fs.writeFileSync(swFilePath, swContent);
    console.log(`✅ service-worker.js updated.`);
} catch (error) {
    console.error(`❌ Error updating ${swFilePath}:`, error.message);
}

const uiFilePath = path.join(__dirname, 'components/ui.tsx');
try {
    let uiContent = fs.readFileSync(uiFilePath, 'utf8');
    uiContent = uiContent.replace(/v\d+\.\d+\.\d+/g, `v${newVersion}`);
    fs.writeFileSync(uiFilePath, uiContent);
    console.log(`✅ ${uiFilePath} updated.`);
} catch (error) {
    console.error(`❌ Error updating ${uiFilePath}:`, error.message);
}

console.log("--- Version update script finished. Running Git commands... ---");
