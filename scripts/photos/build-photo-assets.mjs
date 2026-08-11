import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoot = join(projectRoot, "assets/old-website-images");
const outputRoot = join(projectRoot, "public/work");

const photos = [
  {
    input:
      "004-big-excavator-digging-tight-sewer-line-repair-in-toledo-ohio-6de4200a.jpg",
    output: "sewer-line-repair.webp",
  },
  {
    input: "007-old-website-image-e7affda4.jpg",
    output: "sewer-line-replacement.webp",
  },
  {
    input:
      "010-yellow-komatsu-excavator-being-transported-by-a-semi-truck-on-a-trailer--cbec82c7.jpg",
    output: "equipment-mobilization.webp",
  },
  {
    input:
      "011-crane-lifting-large-concrete-block-onto-truck-bright-sunny-day-ohio-flow-ee972f5b.jpg",
    output: "stormwater-installation.webp",
  },
  {
    input:
      "017-two-construction-vehicles-on-gravel-with-a-house-in-the-background-ohio--d8993ab8.jpg",
    output: "residential-excavation.webp",
  },
  {
    input:
      "020-crane-lifting-concrete-norwalk-concrete-blocks-construction-site-sunny-d-023dd5cc.jpg",
    output: "commercial-precast-work.webp",
  },
  {
    input: "021-sewer-line-clean-out-e3b23039.jpg",
    output: "sewer-installation-survey.webp",
  },
  {
    dimension: 1200,
    input: "025-old-website-image-ba0c3945.jpg",
    output: "neighborhood-excavation.webp",
    quality: 76,
  },
];

await mkdir(outputRoot, { recursive: true });

for (const photo of photos) {
  const outputPath = join(outputRoot, photo.output);
  const dimension = photo.dimension ?? 1440;

  await sharp(join(sourceRoot, photo.input))
    .rotate()
    .resize({
      fit: "inside",
      height: dimension,
      width: dimension,
      withoutEnlargement: true,
    })
    .webp({ effort: 6, quality: photo.quality ?? 78 })
    .toFile(outputPath);

  console.log(`Created ${outputPath}`);
}
