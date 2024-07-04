// frontend/src/components/Backgrounds.tsx

import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { saveArt } from '../api/artService';

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
        console.log('handleSave invoked');

        if (!user) {
            alert('You must be logged in to save art.');
            return;
        }

        const clerkId = user.id;
        let backgroundColor = document.body.style.backgroundColor || '';

        if (backgroundColor === null) {
            backgroundColor = '';
        }

        try {
            const token = await getToken();
            console.log('Clerk ID:', clerkId);
            console.log('Token obtained:', token);
            console.log('Background color:', backgroundColor);

            const result = await saveArt(backgroundColor, clerkId, token);

            if (result) {
                alert('Art saved successfully!');
            } else {
                alert('Failed to save art.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save art due to an error.');
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
