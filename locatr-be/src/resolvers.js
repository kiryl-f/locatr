import { readFileSync } from 'fs';
import path from 'path';

const images = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/data', 'images.json'), 'utf-8')
);

export const resolvers = {
  Query: {
    images: (_, { region, country, count }) => {
      let filtered = images;

      if (region) {
        filtered = filtered.filter(img => img.region === region);
      }
      if (country) {
        filtered = filtered.filter(img => img.country === country);
      }

      const shuffled = filtered.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },

    locationNameByCoords: async (_, { lat, lon }) => {
      console.log(`Reverse geocoding for: ${lat}, ${lon}`);
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

      const fetchWithRetry = async (retries = 3, delayMs = 1000) => {
        try {
          const response = await fetch(url);

          if (!response.ok) throw new Error(`Failed to fetch location, status: ${response.status}`);

          const data = await response.json();
          return `${data.address.city ||
            data.address.village ||
            data.address.state ||
            data.address.state_district ||
            data.address.road}, ${data.address.country}` || 'Unknown location';
        } catch (err) {
          if (retries > 0) {
            console.warn(`Fetch failed, retrying... (${retries} left)`, err.message);
            await new Promise((r) => setTimeout(r, delayMs));
            return fetchWithRetry(retries - 1, delayMs * 2); // exponential backoff
          } else {
            throw err;
          }
        }
      };

      try {
        return await fetchWithRetry();
      } catch (err) {
        console.error('Reverse geocode failed after retries:', err);
        return 'Unknown location';
      }
    },
    randomImage: (_, { region }) => {
      const filtered = region
        ? images.filter(img => img.region === region)
        : images;

      if (!filtered.length) return null;

      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }
};
