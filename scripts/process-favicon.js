import sharp from 'sharp';
import path from 'path';

async function processImage() {
  const src = path.join(process.cwd(), 'public', 'favicon.png');
  const dest = path.join(process.cwd(), 'public', 'favicon-processed.png');
  
  try {
    const metadata = await sharp(src).metadata();
    console.log('Original metadata:', metadata);
    
    await sharp(src)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(dest);
      
    console.log('✅ Image processed and saved to favicon-processed.png');
  } catch (e) {
    console.error('Error processing image:', e);
  }
}

processImage();
