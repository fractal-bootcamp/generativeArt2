import { Art } from '@shared/types/models';

const API_URL = 'http://localhost:3002'; // Define your backend API URL

export const getArt = async (bgcolor: string, getToken: () => Promise<string | null>) => {
    try {
        const response = await fetch(`${API_URL}/backgrounds`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({ bgcolor }),
        });

        if (!response.ok) {
            throw new Error('Failed to get data');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

export const saveArt = async (bgcolor: string, getToken: () => Promise<string | null>) => {
    try {
        const response = await fetch(`${API_URL}/backgrounds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({ bgcolor }),
        });

        if (!response.ok) {
            throw new Error('Failed to save art');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error saving art:', error);
        return null;
    }
};
