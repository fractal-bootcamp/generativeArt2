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
                    <Link to="/"> * Home * </Link>
                    <Link to="/sign-up">Sign Up * </Link>
                    <Link to="/sign-in">Sign In * </Link>
                    <Link to="/about">About Us * </Link>
                    <Link to="/artists">Artists * </Link>
                </nav>
            </header>
            <main>
                <Outlet /> {/* This will render the child routes */}
            </main>
        </div>
    );
}
