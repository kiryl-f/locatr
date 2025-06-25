import { readFileSync } from 'fs';
import path from 'path';

type Image = {
  id: string;
  lat: number;
  lng: number;
  country?: string;
  region?: string;
};

const images: Image[] = JSON.parse(
  readFileSync(path.join(__dirname, 'data', 'images.json'), 'utf-8')
);

export const resolvers = {
  Query: {
    images: (
      _: any,
      { region, country, count }: { region?: string; country?: string; count: number }
    ) => {
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

    randomImage: (_: any, { region }: { region?: string }) => {
      const filtered = region
        ? images.filter(img => img.region === region)
        : images;

      if (!filtered.length) return null;

      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }
};
