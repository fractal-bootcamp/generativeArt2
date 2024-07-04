const API_URL = 'http://localhost:3002'; // Define your backend API URL

import { PrismaClient } from '@prisma/client';
import { useAuth } from '@clerk/clerk-react';



const prisma = new PrismaClient();

export const getArt = async (bgcolor: string, token: string) => {

    try {
        const response = await fetch(`${API_URL}/backgrounds?bgcolor=${bgcolor}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
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

export const postArt = async (bgcolor: string, token: string) => {

    try {
        const response = await fetch(`${API_URL}/backgrounds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use the obtained token
            },
            body: JSON.stringify({ bgcolor }),
        });

        if (!response.ok) {
            throw new Error('Failed to post data');
        }

        const result = await response.json();
        return {
            ...result,
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString(),
        };
    } catch (error) {
        console.error('Error posting art:', error);
        return null;
    }
};

export const saveArt = async (bgcolor: string, clerkId: string, token: string) => {

    try {
        console.log('Token obtained:', token);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ bgcolor, creatorId: clerkId }),
        };

        console.log('Request options:', requestOptions);

        const response = await fetch(`${API_URL}/backgrounds`, requestOptions);

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error text:', errorText);
            throw new Error(`Failed to save art: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Response JSON:', result);

        return result;
    } catch (error) {
        console.error('Error saving art:', error);
        return null;
    }
};