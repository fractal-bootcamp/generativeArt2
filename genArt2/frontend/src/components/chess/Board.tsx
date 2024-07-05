import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import saveBoardState from '../../api/chessService';



interface Props {
    size: number;
    path: [number, number][];
    currentStep: number;  // Controls visible steps
    gigerMode: boolean;
    toggleGigerMode: () => void; // Add toggleGigerMode to props
}

const squareSize = 50; // Define the size of each square for easier reference

const Board = ({ size, path, currentStep, gigerMode, toggleGigerMode }: Props) => {
    // State to toggle Giger style effect

    const { user } = useUser();
    const { getToken } = useAuth();
    // Calculate the dimensions of the board
    const boardStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, ${squareSize}px)`,
        position: 'relative', // Necessary for SVG overlay
        backgroundColor: 'black' // Entire board background
    };

    // Helper function to convert board coordinates to pixel coordinates
    const getPixelCoordinates = (x: number, y: number) => ({
        px: y * squareSize + squareSize / 2,
        py: x * squareSize + squareSize / 2
    });

    // Flipped axes helper
    const getFlippedPixelCoordinates = (x: number, y: number) => ({
        px: x * squareSize + squareSize / 2,
        py: y * squareSize + squareSize / 2
    });

    // Determine if the knight is here for normal and flipped paths
    const isKnightHereNormal = (x: number, y: number) => {
        return path.length && path[currentStep] && path[currentStep][0] === x && path[currentStep][1] === y;
    };
    const isKnightHereFlipped = (x: number, y: number) => {
        return path.length && path[currentStep] && path[currentStep][0] === y && path[currentStep][1] === x;
    };

    // SVG filter for Giger effect
    const gigerFilter = (
        <defs>
            <filter id="gigerEffect">
                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="turb" />
                <feDisplacementMap in="SourceGraphic" in2="turb" scale="10" />
            </filter>
        </defs>
    );


    const handleSave = async () => {



        console.log('handleSave invoked');

        if (!user) {
            alert('You must be logged in to save art.');
            return;
        }

        const clerkId = user.id;

        const finalBoardState = {
            size,
            path,
            gigerMode,
        };

        try {
            const token = await getToken();
            console.log('Clerk ID:', clerkId);
            console.log('Token obtained:', token);
            console.log('Board State:', finalBoardState);

            const result = await saveBoardState(finalBoardState, clerkId, token);

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
                {Array.from({ length: size * size }).map((_, index) => {
                    const x = Math.floor(index / size);
                    const y = index % size;
                    const knightNormal = isKnightHereNormal(x, y) ? 'K' : '';
                    const knightFlipped = isKnightHereFlipped(x, y) ? 'K' : '';
                    return (
                        <div key={index} style={{
                            width: squareSize, height: squareSize, borderRadius: 0,
                            backgroundColor: 'black', // Each square is black
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: knightNormal ? '#00008B' : (knightFlipped ? '#8B0000' : 'black'),
                            fontSize: '20px', fontWeight: 'bold'
                        }}>
                            {knightNormal || knightFlipped}
                        </div>
                    );
                })}
                <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    {gigerMode && gigerFilter} {/* Include Giger filter if Giger mode is enabled */}
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