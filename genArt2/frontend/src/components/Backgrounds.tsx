// frontend/src/components/Backgrounds.tsx

import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { saveArt, postArt } from '../api/artService';

const Backgrounds: React.FC = () => {
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();

    const handleClick = () => {
        // Change the background color of the page multiple times
        const colors = [
            'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'gray',
            'cyan', 'magenta', 'lime', 'indigo', 'violet', 'gold', 'silver', 'brown', 'maroon', 'olive',
            'navy', 'teal', 'aqua', 'fuchsia', 'lavender', 'turquoise', 'salmon', 'beige', 'coral', 'ivory'
        ];

        const randomIndex = Math.floor(Math.random() * colors.length);
        const randomColor = colors[randomIndex];
        document.body.style.backgroundColor = randomColor;
    };

    const handlePost = async () => {
        console.log('handlePost invoked');

        if (!user) {
            alert('You must be logged in to post on the feed.');
            return;
        }

        const clerkId = user.id;
        let backgroundColor = document.body.style.backgroundColor || '';

        if (backgroundColor === null) {
            backgroundColor = '';
        } else if (typeof backgroundColor !== 'string') {
            backgroundColor = '';
        }

        try {
            const token = await getToken();
            console.log('Clerk ID:', clerkId);
            console.log('Token obtained:', token);
            console.log('Background color:', backgroundColor);

            const result = await postArt(backgroundColor, clerkId);

            if (result) {
                alert('Art posted successfully!');
            } else {
                alert('Failed to post art.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to post art due to an error.');
        }
    }



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
            <button onClick={handlePost}> Post on Feed</button>
        </div>
    );
};

export default Backgrounds;
