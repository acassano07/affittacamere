import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'components', 'Icons.tsx');

fs.unlink(filePath, (err) => {
  if (err) {
    console.error(`Error deleting file: ${err}`);
  } else {
    console.log(`Successfully deleted ${filePath}`);
  }
});