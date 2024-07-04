import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import cors from 'cors';
import { saveUser } from './middleware/saveUser'; // Import the middleware
import { requireAuth } from '@clerk/clerk-sdk-node'; // Ensure authentication
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Middleware to save user information
app.use(saveUser);

// Endpoint to fetch artists
app.get('/artists', async (req, res) => {
    try {
        const artists = await prisma.user.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                clerkId: true,
                createdAt: true,
                updatedAt: true,
                isDeleted: true,
                avatarUrl: true,
            },
        });
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
});

// Endpoint to save background color
app.post('/backgrounds', requireAuth(), async (req, res) => {
    console.log('Request received on /backgrounds');
    const { bgcolor } = req.body;
    console.log('Background color:', bgcolor);
    try {
        const newArt = await prisma.art.create({
            data: {
                bgcolor,
                isPublished: true,
                creatorId: req.user.id, // Use the user ID from the request
            },
        });
        console.log('Art saved:', newArt);
        res.status(200).json(newArt);
    } catch (error) {
        console.error('Error saving background:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to save background' });
    }
});

// Create an HTTP server with the Express app
const server = createServer(app);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
