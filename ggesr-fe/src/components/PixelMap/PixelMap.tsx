import styles from './PixelMap.module.scss';
import { useEffect, useState } from 'react';

const REGIONS = [
    { name: 'Europe', x: 320, y: 290 },
    { name: 'Asia', x: 350, y: 190 },
    { name: 'Africa', x: 350, y: 350 },
    { name: 'Americas', x: 100, y: 400 },
    { name: 'Oceania', x: 560, y: 300 },
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
