import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "../..");
const logoPath = path.join(projectRoot, "public/brand/logo-primary-reverse.svg");
const outputPath = path.join(projectRoot, "public/og.png");

const logo = await sharp(await readFile(logoPath), { density: 300 })
  .resize({ width: 390 })
  .png()
  .toBuffer();

const background = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#f7eddf" stroke-opacity="0.055" stroke-width="1"/>
      </pattern>
      <radialGradient id="glow" cx="86%" cy="48%" r="52%">
        <stop offset="0" stop-color="#4d5442" stop-opacity="0.95"/>
        <stop offset="1" stop-color="#2b2825" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="#2b2825"/>
    <rect width="1200" height="630" fill="url(#grid)"/>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <rect x="0" y="0" width="18" height="630" fill="#d3a956"/>
    <path d="M758 78a238 238 0 1 0 0 476" fill="none" stroke="#d3a956" stroke-opacity="0.18" stroke-width="3"/>
    <path d="M790 112a204 204 0 1 0 0 408" fill="none" stroke="#f7eddf" stroke-opacity="0.08" stroke-width="2"/>

    <g font-family="Arial, Helvetica, sans-serif">
      <text x="80" y="94" fill="#d3a956" font-size="18" font-weight="700" letter-spacing="4">NORTHWEST OHIO</text>
      <text x="80" y="188" fill="#f7eddf" font-family="Arial Black, Arial, sans-serif" font-size="68" font-weight="900" letter-spacing="-3">UNDERGROUND</text>
      <text x="80" y="260" fill="#f7eddf" font-family="Arial Black, Arial, sans-serif" font-size="68" font-weight="900" letter-spacing="-3">UTILITY SPECIALISTS</text>
      <rect x="80" y="304" width="130" height="7" fill="#d3a956"/>
      <text x="80" y="365" fill="#f7eddf" fill-opacity="0.8" font-size="25" font-weight="600">Sewer, water, drainage &amp; excavation</text>
      <text x="80" y="407" fill="#f7eddf" fill-opacity="0.62" font-size="20">Residential • Commercial • Contractor • Municipal</text>
      <text x="80" y="542" fill="#d3a956" font-size="17" font-weight="700" letter-spacing="2.5">OHIO FLOW CO</text>
      <text x="80" y="577" fill="#f7eddf" fill-opacity="0.62" font-size="18">toledosewerandwater.com</text>
    </g>
  </svg>
`);

await sharp(background)
  .composite([{ input: logo, left: 790, top: 116 }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(outputPath);

console.log(`Generated ${outputPath}`);
