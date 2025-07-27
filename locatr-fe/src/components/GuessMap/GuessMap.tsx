import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './GuessMap.module.scss';

type Props = {
  onGuess: (lat: number, lng: number) => void;
  guessCoords: { lat: number; lng: number } | null;
  actualCoords: { lat: number; lng: number } | null;
  showLine: boolean;
};

export const GuessMap = ({ onGuess, guessCoords, actualCoords, showLine }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const lineId = 'guess-line';

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://tiles.stadiamaps.com/styles/osm_bright.json',
      center: [0, 0],
      zoom: 1.5,
    });

    mapInstance.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      onGuess(lat, lng); // marker will be set in guessCoords effect
    });

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  // Handle setting or updating the guess marker
  useEffect(() => {
    if (!mapInstance.current || !guessCoords) return;

    const { lat, lng } = guessCoords;

    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    } else {
      markerRef.current = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);
    }
  }, [guessCoords]);

  // Draw or remove the line after guess is submitted
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    // Remove existing line if it exists
    if (map.getLayer(lineId)) {
      map.removeLayer(lineId);
    }
    if (map.getSource(lineId)) {
      map.removeSource(lineId);
    }

    // Draw line if allowed
    if (showLine && guessCoords && actualCoords) {
      map.addSource(lineId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [guessCoords.lng, guessCoords.lat],
              [actualCoords.lng, actualCoords.lat],
            ],
          },
          properties: {},
        },
      });

      map.addLayer({
        id: lineId,
        type: 'line',
        source: lineId,
        paint: {
          'line-color': '#921c1cff',
          'line-width': 3,
        },
      });
    }
  }, [showLine, guessCoords, actualCoords]);

  return <div ref={mapRef} className={styles.mapContainer}></div>;
};
