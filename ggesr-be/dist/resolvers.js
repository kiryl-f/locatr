import { readFileSync } from 'fs';
import path from 'path';
const images = JSON.parse(readFileSync(path.join(__dirname, 'data', 'images.json'), 'utf-8'));
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
        randomImage: (_, { region }) => {
            const filtered = region
                ? images.filter(img => img.region === region)
                : images;
            if (!filtered.length)
                return null;
            return filtered[Math.floor(Math.random() * filtered.length)];
        }
    }
};
