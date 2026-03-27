import fs from 'fs';
import path from 'path';

async function download() {
  const url = 'https://img1.pic.in.th/images/Favicon-Bocker168.png';
  const dest = path.join(process.cwd(), 'public', 'favicon.png');
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(dest, buffer);
    console.log(`✅ Downloaded ${buffer.length} bytes to ${dest}`);
  } catch (e) {
    console.error('Error:', e);
  }
}

download();
