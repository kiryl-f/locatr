import styles from './PixelMap.module.scss';
import { useEffect, useState } from 'react';

const REGIONS = [
    { name: 'Europe', x: 220, y: 100 },
    { name: 'Asia', x: 340, y: 100 },
    { name: 'Africa', x: 250, y: 180 },
    { name: 'Americas', x: 100, y: 120 },
    { name: 'Oceania', x: 460, y: 200 },
];

export default function PixelMap() {
    const [cursorPos, setCursorPos] = useState(REGIONS[0]);
    const [regionIndex, setRegionIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRegionIndex(prev => (prev + 1) % REGIONS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCursorPos(REGIONS[regionIndex]);
    }, [regionIndex]);

    return (
        <div className={styles.mapContainer}>
            <div className={styles.map} />
            <div
                className={styles.cursor}
                style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
            />
        </div>
    );
}
