"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const MAPILLARY_TOKEN = process.env.MAPILLARY_TOKEN || 'YOUR_MAPILLARY_TOKEN_HERE';
// Define regions and bounding boxes
const REGIONS = {
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
};
async function fetchImagesForRegion(region, bbox, maxTiles = 100) {
    const delta = 1.0; // tile size in degrees
    const results = [];
    for (let lat = bbox.minLat; lat < bbox.maxLat; lat += delta) {
        for (let lon = bbox.minLon; lon < bbox.maxLon; lon += delta) {
            const tileBbox = [
                lon,
                lat,
                lon + delta,
                lat + delta,
            ].join(',');
            const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,geometry,is_pano&limit=100&bbox=${tileBbox}`;
            try {
                const res = await (0, node_fetch_1.default)(url);
                const data = await res.json();
                if (Array.isArray(data.data)) {
                    const filtered = data.data
                        .filter((img) => img.geometry?.coordinates?.length === 2 && img.is_pano)
                        .map((img) => ({
                        id: img.id,
                        lng: img.geometry.coordinates[0],
                        lat: img.geometry.coordinates[1],
                        region,
                    }));
                    results.push(...filtered);
                    console.log(`[${region}] Tile (${lat.toFixed(1)}, ${lon.toFixed(1)}): ${filtered.length} images`);
                }
            }
            catch (err) {
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
    const allImages = [];
    for (const [region, bbox] of Object.entries(REGIONS)) {
        console.log(`\n▶ Fetching for region: ${region}`);
        const regionImages = await fetchImagesForRegion(region, bbox);
        allImages.push(...regionImages);
    }
    const outputPath = path_1.default.join(__dirname, '../src/data/images.json');
    (0, fs_1.writeFileSync)(outputPath, JSON.stringify(allImages, null, 2));
    console.log(`\n✅ Done! Saved ${allImages.length} images to images.json`);
}
main();
