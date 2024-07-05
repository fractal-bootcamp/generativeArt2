import express from 'express';
import type { Request, Response } from 'express';
import { requireAuth, type ClerkMiddlewareOptions } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client'; // Import the User type from '@prisma/client'
import cors from 'cors';
import bodyParser from 'body-parser';
import type { User, Warnsdorff, Token, Art } from '../shared/types/models';

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Define the handler separately for clarity
const handler = async (req: Request, res: Response) => {
    console.log('Received POST request at /backgrounds with data:', req.body);
    const data = req.body;
    const json = JSON.stringify(data);
    try {
        // Simulate some processing
        res.send(json);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
    }
};

const options: ClerkMiddlewareOptions = {}

app.get('/feed-backgrounds', async (req: Request, res: Response) => {
    try {
        const data = await prisma.art.findMany();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching backgrounds:', error.message);
        res.status(500).json({ error: 'Failed to fetch backgrounds' });
    }
});


app.get('/artists', async (req: Request, res: Response) => {
    try {
        const data = await prisma.art.findMany();
        res.json(data);
    } catch (error: any) {
        console.error('Error fetching backgrounds:', error.message);
        res.status(500).json({ error: 'Failed to fetch backgrounds' });
    }
});

// Clerk webhook to handle user creation
app.post('/clerk-webhook', async (req, res) => {
    const { type, data } = req.body;
    console.log('Webhook received:', req.body);

    if (type === 'user.created') {
        const { id: clerkId, email_addresses, first_name, last_name, profile_image_url } = data;
        const email = email_addresses[0]?.email_address;
        const name = `${first_name} ${last_name}`;
        const avatarUrl = profile_image_url;

        if (!email) {
            console.log('Email not provided in the webhook data');
            return res.status(400).json({ error: 'Email not provided' });
        }

        try {
            console.log('Creating user in the database...');
            const user = await prisma.user.create({
                data: {
                    clerkId,
                    email,
                    name,
                    avatarUrl,
                },
            });
            console.log('User created:', user);

            return res.status(200).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Failed to create user' });
        }
    }

    console.log('Unhandled event type:', type);
    res.status(200).json({ error: 'Unhandled event type' });
});

// Endpoint to save background color
app.post('/backgrounds', requireAuth(handler, options), async (req: Request, res: Response) => {
    console.log('Request received on /backgrounds');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const { bgcolor } = req.body;
    const creatorId = req.auth?.userId;  // This should match the Clerk user ID
    console.log('Background color:', bgcolor);
    console.log('Creator ID:', creatorId);

    try {
        // Ensure the user exists
        console.log('Checking if user exists in the database...');
        const user = await prisma.user.findUnique({
            where: { clerkId: creatorId }  // Use clerkId to find the user
        });

        if (!user) {
            console.log('User not found in the database');
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Saving new art to the database...');
        const newArt = await prisma.art.create({
            data: {
                bgcolor,
                isPublished: true,
                creatorId: user.id,  // Store the user's database ID
            },
        });
        console.log('Art saved:', newArt);
        res.status(200).json(newArt);
    } catch (error: any) {
        console.error('Error saving background:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to save background' });
    }
});


// Endpoint to save boardState from chess game
app.post('/chess', requireAuth(handler, options), async (req: Request, res: Response) => {
    console.log('Request received on /chess');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const { boardSize,
        path,
        gigerMode }: Warnsdorff = req.body;
    const creatorId = req.auth?.userId;  // This should match the Clerk user ID
    console.log('BoardState:', boardSize,
        path,
        gigerMode);
    console.log('Creator ID:', creatorId);

    try {
        // Ensure the user exists
        console.log('Checking if user exists in the database...');
        const user = await prisma.user.findUnique({
            where: { clerkId: creatorId }  // Use clerkId to find the user
        });

        if (!user) {
            console.log('User not found in the database');
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Saving new art to the database...');
        const newBoardState = await prisma.warnsdorff.create({
            data: {
                boardSize,
                path,
                gigerMode,
                isPublished: true,
                creatorId: user.id,  // Store the user's database ID
            },
        });
        console.log('Art saved:', newBoardState);
        res.status(200).json(newBoardState);
    } catch (error: any) {
        console.error('Error saving background:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to save background' });
    }
});




const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
