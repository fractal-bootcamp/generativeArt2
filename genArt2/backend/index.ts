import express from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bodyParser from 'body-parser';

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

// Clerk webhook to handle user creation
app.post('/clerk-webhook', async (req, res) => {
    const { type, data } = req.body;
    console.log('Webhook received:', req.body); // Log the incoming request

    if (type === 'user.created') {
        const { id: clerkId, email_addresses, first_name, last_name, profile_image_url } = data;
        const email = email_addresses[0]?.email_address;
        const name = `${first_name} ${last_name}`;
        const avatarUrl = profile_image_url;

        if (!email) {
            console.log('Email not provided in the webhook data'); // Log missing email
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
            console.log('User created:', user); // Log the created user

            return res.status(200).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user:', error); // Log the error
            return res.status(500).json({ error: 'Failed to create user' });
        }
    }

    console.log('Unhandled event type:', type); // Log unhandled event type
    res.status(200).json({ error: 'Unhandled event type' });
});

// Endpoint to save background color
app.post('/backgrounds', requireAuth(async (req: Request, res: Response) => {
    console.log('Request received on /backgrounds');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const { bgcolor } = req.body;
    const creatorId = req.auth.userId;  // This should match the Clerk user ID
    console.log('Background color:', bgcolor);
    console.log('Creator ID:', creatorId);

    try {
        // Ensure the user exists
        console.log('Checking if user exists in the database...');
        const user = await prisma.user.findUnique({
            where: { clerkId: creatorId }  // Use clerkId to find the user
        });

        if (!user) {
            console.log('User not found in the database'); // Log user not found
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
        console.log('Art saved:', newArt); // Log the created art
        res.status(200).json(newArt);
    } catch (error: any) {
        console.error('Error saving background:', error.message); // Log the error
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to save background' });
    }
}));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
