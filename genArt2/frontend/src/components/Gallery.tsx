import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getAllArt } from '../api/artService';
import Board from '../components/chess/Board';
import '../../src/index.css';

interface Art {
    id: string;
    bgcolor: string;
    createdAt: string;
    updatedAt: string;
    isPublished: boolean;
    isDeleted: boolean;
    creatorId: string;
}

interface Warnsdorff {
    id: string;
    boardSize: number;
    path: [number, number][];
    currentStep: number;
    gigerMode: boolean;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
    isDeleted: boolean;
    creatorId: string;
    creator: User;
}

interface User {
    id: number;
    name: string;
    email: string;
    clerkId: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    avatarUrl?: string | null;
    arts: Art[];
    warnsdorffs: Warnsdorff[];
}

const artItemStyle: React.CSSProperties = {
    padding: '20px',
    border: '20px solid #ccc',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
};

export default function Gallery() {
    const [artList, setArtList] = useState<Art[]>([]);
    const [warnsdorffList, setWarnsdorffList] = useState<Warnsdorff[]>([]);
    const [gigerMode, setGigerMode] = useState<boolean>(false);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchArt = async () => {
            try {
                console.log('Getting token');
                const token = await getToken();
                console.log('Token obtained:', token);

                if (!token) {
                    console.error('No token found');
                    return;
                }

                const artData = await getAllArt(token);
                if (artData) {
                    console.log('Art data fetched:', artData);
                    setArtList(artData.art);
                    setWarnsdorffList(artData.warnsdorff);
                }
            } catch (error) {
                console.error('Error fetching art:', error);
            }
        };

        fetchArt();
    }, [getToken]);

    const sortedArtList = [...artList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const sortedWarnsdorffList = [...warnsdorffList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const toggleGigerMode = () => {
        setGigerMode(!gigerMode);
    };

    console.log('Art List:', artList);
    console.log('Warnsdorff List:', warnsdorffList);

    return (
        <div>
            <h1>All Arts!</h1>
            <div className="feed-container-2">
                <div className="feed-list-2">
                    {sortedArtList.map((art) => (
                        <div key={art.id} className="art-item" style={{ ...artItemStyle, backgroundColor: art.bgcolor }}>
                            <div>
                                <h3>Background Art</h3>
                                <p>Created at: {new Date(art.createdAt).toLocaleString()}</p>
                                <p>Updated at: {new Date(art.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {sortedWarnsdorffList.map((warnsdorff) => (
                        <div key={warnsdorff.id} className="art-item" style={artItemStyle}>
                            <Board
                                boardSize={warnsdorff.boardSize}
                                path={warnsdorff.path}
                                currentStep={warnsdorff.currentStep}
                                gigerMode={warnsdorff.gigerMode}
                                toggleGigerMode={toggleGigerMode}
                                responsive={true} // Pass responsive prop
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
