import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import saveBoardState from '../../api/chessService';

export interface BoardProps {
    boardSize: number;
    path: [number, number][];
    currentStep: number;
    gigerMode: boolean;
    toggleGigerMode: () => void;
    responsive?: boolean; // Optional responsive prop
}

const Board = ({ boardSize, path, currentStep, gigerMode, toggleGigerMode, responsive = false }: BoardProps) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const squareSize = responsive ? 10 : 50; // Smaller squares for responsive mode

    const boardStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSize}, ${responsive ? '1fr' : `${squareSize}px`})`,
        position: 'relative',
        backgroundColor: 'black',
        width: responsive ? '100%' : `${boardSize * squareSize}px`,
        height: responsive ? 'auto' : `${boardSize * squareSize}px`,

        boxSizing: 'border-box',
    };

    const getPixelCoordinates = (x: number, y: number) => ({
        px: y * squareSize + squareSize / 2,
        py: x * squareSize + squareSize / 2
    });

    const getFlippedPixelCoordinates = (x: number, y: number) => ({
        px: x * squareSize + squareSize / 2,
        py: y * squareSize + squareSize / 2
    });

    const isKnightHereNormal = (x: number, y: number) => {
        return path.length && path[currentStep] && path[currentStep][0] === x && path[currentStep][1] === y;
    };
    const isKnightHereFlipped = (x: number, y: number) => {
        return path.length && path[currentStep] && path[currentStep][0] === y && path[currentStep][1] === x;
    };

    const gigerFilter = (
        <defs>
            <filter id="gigerEffect">
                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="turb" />
                <feDisplacementMap in="SourceGraphic" in2="turb" scale="10" />
            </filter>
        </defs>
    );

    const handleSave = async () => {
        if (!user) {
            alert('You must be logged in to save art.');
            return;
        }

        const clerkId = user.id;
        const finalBoardSize = boardSize;
        const finalPath = path;
        const finalGigerMode = gigerMode;
        const finalCurrentStep = currentStep;

        try {
            const token = await getToken();
            const result = await saveBoardState(finalBoardSize, finalPath, finalCurrentStep, finalGigerMode, clerkId, token);

            if (result) {
                alert('Art saved successfully!');
            } else {
                alert('Failed to save art.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save art due to an error.');
        }
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <button onClick={toggleGigerMode} style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
                {gigerMode ? 'Disable Giger Mode' : 'Enable Giger Mode'}
            </button>
            <button onClick={handleSave}>Save?</button>
            <div style={boardStyle}>
                {Array.from({ length: boardSize * boardSize }).map((_, index) => {
                    const x = Math.floor(index / boardSize);
                    const y = index % boardSize;
                    const knightNormal = isKnightHereNormal(x, y) ? 'K' : '';
                    const knightFlipped = isKnightHereFlipped(x, y) ? 'K' : '';
                    return (
                        <div key={index} style={{
                            width: squareSize, height: squareSize, borderRadius: 0,
                            backgroundColor: 'black',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: knightNormal ? '#00008B' : (knightFlipped ? '#8B0000' : 'black'),
                            fontSize: responsive ? '10px' : '20px', fontWeight: 'bold'
                        }}>
                            {knightNormal || knightFlipped}
                        </div>
                    );
                })}
                <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    {gigerMode && gigerFilter}
                    {path.slice(0, currentStep).map((pos, index) => {
                        if (index === 0) return null;
                        const { px: startX, py: startY } = getPixelCoordinates(...path[index - 1]);
                        const { px: endX, py: endY } = getPixelCoordinates(...pos);
                        return (
                            <line key={`line-red-${index}`} x1={startX} y1={startY} x2={endX} y2={endY}
                                stroke="red" strokeWidth={3} strokeLinecap="round" filter={gigerMode ? "url(#gigerEffect)" : ""} />
                        );
                    })}
                    {path.slice(0, currentStep).map((pos, index) => {
                        if (index === 0) return null;
                        const { px: startX, py: startY } = getFlippedPixelCoordinates(...path[index - 1]);
                        const { px: endX, py: endY } = getFlippedPixelCoordinates(...pos);
                        return (
                            <line key={`line-blue-${index}`} x1={startX} y1={startY} x2={endX} y2={endY}
                                stroke="blue" strokeWidth={3} strokeLinecap="round" filter={gigerMode ? "url(#gigerEffect)" : ""} />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default Board;
