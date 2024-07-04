// src/layouts/root-layout.tsx
import { Link, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export default function RootLayout() {
    return (
        <div>
            <header>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/artists">Artists</Link> {/* Ensure this link is correct */}
                </nav>
            </header>
            <main>
                <Outlet /> {/* This will render the child routes */}
            </main>
        </div>
    );
}
