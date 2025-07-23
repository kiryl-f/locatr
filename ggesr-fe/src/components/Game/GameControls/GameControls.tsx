import React from 'react';

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
                <div style={{ fontSize: '1.5rem', color: 'red', marginBottom: '1rem' }}>
                    ⏰ {timer}s
                </div>
            )}

            <button onClick={onSubmit} disabled={!guessCoords || distance !== null}>
                Submit Guess
            </button>

            {distance !== null && (
                <button onClick={onNext} style={{ marginLeft: '1rem' }}>
                    Next Image
                </button>
            )}
        </div>
    )
}
