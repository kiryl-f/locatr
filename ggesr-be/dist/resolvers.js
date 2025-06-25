"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const images = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, 'data', 'images.json'), 'utf-8'));
exports.resolvers = {
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
