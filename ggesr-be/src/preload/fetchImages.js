import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAPILLARY_TOKEN = process.env.VITE_MAPILLARY_TOKEN || '';


async function fetchImagesForRegion(region, bbox, maxTiles = 100) {
  const fetch = (await import('node-fetch')).default;

  const delta = 1.0;
  const results = [];

  for (let lat = bbox.minLat; lat < bbox.maxLat; lat += delta) {
    for (let lon = bbox.minLon; lon < bbox.maxLon; lon += delta) {
      const tileBbox = [lon, lat, lon + delta, lat + delta].join(',');

      const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,geometry&limit=100&bbox=${tileBbox}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data.data)) {
          const filtered = data.data
            .filter(img => img.geometry?.coordinates?.length === 2)
            .map(img => ({
              id: img.id,
              lng: img.geometry.coordinates[0],
              lat: img.geometry.coordinates[1],
              region,
            }));

          results.push(...filtered);
          console.log(`[${region}] Tile (${lat.toFixed(1)}, ${lon.toFixed(1)}): ${filtered.length} images`);
        }
      } catch (err) {
        console.error(`Failed to fetch tile (${lat}, ${lon}):`, err);
      }

      if (results.length >= maxTiles * 100) {
        return results;
      }
    }
  }

  return results;
}

async function main() {
  console.log('token: ', MAPILLARY_TOKEN)
  const allImages = [];

  for (const [region, bbox] of Object.entries({
    europe: {
      minLon: -10.0,
      minLat: 35.0,
      maxLon: 30.0,
      maxLat: 60.0,
    },
    usa: {
      minLon: -125.0,
      minLat: 25.0,
      maxLon: -65.0,
      maxLat: 49.0,
    },
  })) {
    console.log(`\n▶ Fetching for region: ${region}`);
    const regionImages = await fetchImagesForRegion(region, bbox);
    allImages.push(...regionImages);
  }

  const outputPath = path.join(__dirname, '../data/images.json');
  writeFileSync(outputPath, JSON.stringify(allImages, null, 2));
  console.log(`\n✅ Done! Saved ${allImages.length} images to images.json`);
}

main();
