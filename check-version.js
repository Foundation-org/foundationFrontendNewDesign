import * as fs from 'fs';
import packageJson from './package.json' assert { type: 'json' };

const currentVersion = packageJson.version;
let [major, minor, patch] = currentVersion.split('.').map(Number);

patch++;

const newVersion = `${major}.${minor}.${patch}`;

if (newVersion !== currentVersion) {
  packageJson.version = newVersion;
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
  console.log(`Version updated to ${newVersion}`);
} else {
  console.log('No version update required');
}
