// src / components / Artists.tsx
import { useState } from 'react';


type Artist = {
    id: number;
    name: string;
    email: string;
    clerkId: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    avatarUrl: string | null;
};

export default function Artists() {
    const [artists, setArtists] = useState<Artist[]>([]);

    const fetchArtists = async () => {
        const response = await fetch('http://localhost:3002/artists');
        if (response.ok) {
            const data = await response.json();
            setArtists(data);
        } else {
            console.error('Failed to fetch artists');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Artists</h1>
            <button
                onClick={fetchArtists}
                style={{
                    padding: '10px 20px',
                    margin: '10px 0',
                    backgroundColor: '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Fetch Artists
            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        style={{
                            width: '200px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={artist.avatarUrl || 'https://via.placeholder.com/150'}
                            alt={artist.name}
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '10px 10px 0 0',
                                marginBottom: '10px',
                            }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.2em', margin: '0 0 10px 0' }}>{artist.name}</h2>
                            <p style={{ margin: '0 0 5px 0' }}>Email: {artist.email}</p>
                            <p style={{ margin: '0 0 5px 0' }}>Clerk ID: {artist.clerkId}</p>
                            <p style={{ margin: '0 0 5px 0' }}>Created At: {new Date(artist.createdAt).toLocaleString()}</p>
                            <p style={{ margin: '0 0 5px 0' }}>Updated At: {new Date(artist.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
