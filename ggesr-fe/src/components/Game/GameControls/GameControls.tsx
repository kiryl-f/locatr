import React from 'react';

import styles from './GameControls.module.scss';

type GameControlsProps = {
    guessCoords: { lat: number; lng: number } | null;
    distance: number | null;
    onSubmit: () => void;
    onNext: () => void;
    showTimer?: boolean;
    timer?: number;
};

export const GameControls: React.FC<GameControlsProps> = ({ guessCoords, distance, onSubmit, onNext, showTimer, timer }: GameControlsProps) => {
    return (
        <div>
            {showTimer && distance === null && (
                <div className={styles.timer}>
                    ⏰ {timer}s
                </div>
            )}

            <button onClick={onSubmit} disabled={!guessCoords || distance !== null}>
                Submit Guess
            </button>

            {distance !== null && (
                <button onClick={onNext} className={styles.nextImageButton}>
                    Next Image
                </button>
            )}
        </div>
    )
}
