import fs from 'fs';
import path from 'path';

const dest = path.join(process.cwd(), 'public', 'favicon.png');
try {
  const stats = fs.statSync(dest);
  console.log(`File size: ${stats.size} bytes`);
} catch (e) {
  console.log('File not found');
}
