import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed script...');

    // Clear existing data
    console.log('Deleting existing arts...');
    await prisma.art.deleteMany();
    console.log('Deleting existing users...');
    await prisma.user.deleteMany();

    // Create users
    console.log('Creating users...');
    await prisma.user.createMany({
        data: [
            {
                name: 'Alice',
                email: 'alice@example.com',
                clerkId: 'clerk1_unique',
                avatarUrl: 'https://example.com/alice.jpg',
            },
            {
                name: 'Bob',
                email: 'bob@example.com',
                clerkId: 'clerk2_unique',
                avatarUrl: 'https://example.com/bob.jpg',
            },
            {
                name: 'Charlie',
                email: 'charlie@example.com',
                clerkId: 'clerk3_unique',
                avatarUrl: 'https://example.com/charlie.jpg',
            },
        ],
    });

    console.log('Fetching users...');
    const users = await prisma.user.findMany();

    console.log('Creating arts...');
    const arts = [];
    const colors = ['#FF5733', '#33FF57', '#3357FF']; // Example colors
    for (const user of users) {
        for (let i = 0; i < 3; i++) {
            arts.push({
                bgcolor: colors[i % colors.length],
                creatorId: user.id,
                isPublished: true,
            });
        }
    }

    console.log('Creating arts in database...');
    await prisma.art.createMany({
        data: arts,
    });

    console.log('Seed script completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
