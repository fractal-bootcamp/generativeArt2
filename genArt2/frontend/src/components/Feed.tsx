import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { postArt } from '../api/artService';

interface Art {
    id: string;
    bgcolor: string;
    createdAt: string;
    updatedAt: string;
    isPublished: boolean;
    isDeleted: boolean;
    creatorId: string;
}

export default function Feed() {
    const [artList, setArtList] = useState<Art[]>([]);
    const { getToken } = useAuth();

    const handlePostArt = async (bgcolor: string) => {
        const token = await getToken({ template: "your_template_id" }); // Adjust template ID as needed
        if (!token) {
            console.error('No token found');
            return;
        }

        const newArt = await postArt(bgcolor, token);
        if (newArt) {
            setArtList((prevList) => [...prevList, newArt]);
        }
    };

    return (
        <>
            <div>
                <h1>Feed</h1>
                <button onClick={() => handlePostArt('blue')}>Post Art</button>
                <div className="feed-container">
                    <div className="feed-list">
                        {artList.map((art) => (
                            <div key={art.id} className="feed-item" style={{ backgroundColor: art.bgcolor }}>
                                <p>Art ID: {art.id}</p>
                                <p>Creator ID: {art.creatorId}</p>
                                <p>Created At: {art.createdAt}</p>
                                <p>Updated At: {art.updatedAt}</p>
                                <p>Is Published: {art.isPublished.toString()}</p>
                                <p>Is Deleted: {art.isDeleted.toString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
