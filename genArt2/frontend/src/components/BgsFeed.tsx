import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getArt } from '../api/artService';

interface Art {
    id: string;
    bgcolor: string;
    createdAt: string;
    updatedAt: string;
    isPublished: boolean;
    isDeleted: boolean;
    creatorId: string;
}

export default function FeedBackgrounds() {
    const [artList, setArtList] = useState<Art[]>([]);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchArt = async () => {
            try {
                console.log('Getting token');
                const token = await getToken(); // Replace with actual template ID
                console.log('Token obtained:', token);

                if (!token) {
                    console.error('No token found');
                    return;
                }

                const artData = await getArt(token);
                if (artData) {
                    console.log('Art data fetched:', artData);
                    setArtList(artData);
                }
            } catch (error) {
                console.error('Error fetching art:', error);
            }
        };

        fetchArt();
    }, [getToken]);

    return (
        <div>
            <h1>Arts!</h1>
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
    );
}
