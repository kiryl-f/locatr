import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './GuessMap.module.scss';

type Props = {
    onGuess: (lat: number, lng: number) => void;
};

export const GuessMap = ({ onGuess }: Props) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        mapInstance.current = new maplibregl.Map({
            container: mapRef.current,
            style: 'https://demotiles.maplibre.org/style.json',
            center: [0, 0],
            zoom: 1.5,
        });

        mapInstance.current.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            onGuess(lat, lng);

            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new maplibregl.Marker().setLngLat([lng, lat]).addTo(mapInstance.current!);
            }
        });

        return () => {
            mapInstance.current?.remove();
        };
    }, []);

    return <div ref={mapRef} className={styles.mapContainer}></div>;
};
