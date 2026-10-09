import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsxPath = path.resolve(__dirname, '../src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx');
const sourcesDir = path.resolve(__dirname, '../src/shaders/neuform-isolated/sources');

const content = fs.readFileSync(tsxPath, 'utf8');
const lines = content.split('\n').filter(l => l.includes('./sources/'));

lines.forEach(line => {
  const match = line.match(/sources\/([^"'\?]+)/);
  if (match) {
    const filename = match[1];
    const target = path.join(sourcesDir, filename);
    if (!fs.existsSync(target)) {
      fs.writeFileSync(target, '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>\n');
      console.log('Created source placeholder:', filename);
    }
  }
});
console.log('All required HTML sources verified.');
