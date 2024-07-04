import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { saveArt } from '../api/artService';
import { Art } from '@shared/types/models';

const Backgrounds: React.FC = () => {
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();

    const handleClick = () => {
        // Change the background color of the page multiple times
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'gray'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        const randomColor = colors[randomIndex];
        document.body.style.backgroundColor = randomColor;
    };

    const handleSave = async () => {
        if (!user) {
            alert('You must be logged in to save art.');
            return;
        }

        const backgroundColor = document.body.style.backgroundColor;
        const result = await saveArt(backgroundColor, getToken);

        if (result) {
            alert('Art saved successfully!');
        } else {
            alert('Failed to save art.');
        }
    };

    if (!isSignedIn) {
        return null;
    }

    return (
        <div>
            <h1>Backgrounds</h1>
            <div>Hello, {user.fullName}</div>
            <button onClick={handleClick}>Change Background</button>
            <button onClick={handleSave}>Save as Art</button>
        </div>
    );
};

export default Backgrounds;
