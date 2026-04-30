const sharp = require('sharp');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

const images = [
  { input: 'elaraaaaa.png',  output: 'elaraaaaa.webp',  quality: 82 },
  { input: 'elaraoroo.png',  output: 'elaraoroo.webp',  quality: 85 },
  { input: 'ELARAREINE.png', output: 'ELARAREINE.webp', quality: 85 },
];

(async () => {
  for (const { input, output, quality } of images) {
    const inputPath  = path.join(PUBLIC, input);
    const outputPath = path.join(PUBLIC, output);
    const info = await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
    const kb = (info.size / 1024).toFixed(1);
    console.log(`✓ ${input} → ${output}  ${kb}KB`);
  }
})();
