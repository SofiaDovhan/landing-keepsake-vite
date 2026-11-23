import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'images-src';
const OUT_DIR = 'src/assets/images';

const PROFILES = [
  { prefix: 'journal-', widths: [150, 300], ratio: 1 },
  { prefix: '', widths: [400, 800], ratio: 0.79 },
];
const RENAME = {
  img1: 'work-01',
  img2: 'work-02',
  img3: 'work-03',
  img4: 'work-04',
  img5: 'work-05',
  img6: 'work-06',
  img7: 'work-07',
  img8: 'work-08',
  img9: 'work-09',
  brown: 'journal-brown',
  blue: 'journal-blue',
  gray: 'journal-gray',
  black: 'journal-black',
};

const FORMATS = {
  avif: (img) => img.avif({ quality: 50 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }),
};

const files = (await readdir(SRC_DIR)).filter((f) => /\.(png|jpe?g|webp|tiff?)$/i.test(f));

if (files.length === 0) {
  console.error(`У папці ${SRC_DIR}/ немає зображень`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

for (const file of files) {
  const base = path.parse(file).name;
  const name = RENAME[base] ?? base;
  const profile = PROFILES.find((p) => name.startsWith(p.prefix));
  const input = path.join(SRC_DIR, file);

  const { width: srcWidth } = await sharp(input).metadata();
  const maxWidth = Math.max(...profile.widths);

  if (srcWidth < maxWidth) {
    console.warn(`! ${file}: ширина ${srcWidth}px менша за ${maxWidth}px, версію буде збільшено`);
  }

  for (const width of profile.widths) {
    const height = Math.round(width * profile.ratio);

    for (const [ext, encode] of Object.entries(FORMATS)) {
      const output = path.join(OUT_DIR, `${name}-${width}.${ext}`);
      const image = sharp(input).rotate().resize({ width, height, fit: 'cover' });

      await encode(image).toFile(output);
    }
  }

  console.log(`✓ ${file} → ${name}`);
}