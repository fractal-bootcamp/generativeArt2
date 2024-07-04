import { PrismaClient } from '@prisma/client';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

const prisma = new PrismaClient();

export const saveUser = ClerkExpressWithAuth(async (req, res, next) => {
    const { userId, emailAddresses, firstName, lastName } = req.auth.user;

    const email = emailAddresses[0].emailAddress;
    const name = `${firstName} ${lastName}`;
    const clerkId = userId;

    // Check if the user already exists
    let user = await prisma.user.findUnique({
        where: { clerkId },
    });

    // If the user does not exist, create a new one
    if (!user) {
        user = await prisma.user.create({
            data: {
                name,
                email,
                clerkId,
                avatarUrl: req.auth.user.profileImageUrl,
            },
        });
    }

    req.user = user; // Attach the user to the request object
    next();
});
