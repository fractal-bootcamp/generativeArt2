import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootLayout from './layouts/root-layout';

import IndexPage from './routes';
import SignInPage from './routes/sign-in';
import SignUpPage from './routes/sign-up';
import ArtistsPage from './routes/ArtistsPage';
import BackgroundsPage from './routes/BackgroundsPage'; // Added import
import ProtectedRoute from './components/ProtectedRoute.tsx';
import BgsFeed from './routes/BgsFeed.tsx';
import Chess from './routes/chess.tsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        path: "/artists",
        element: (
          <ProtectedRoute>
            <ArtistsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/backgrounds",
        element: (
          <ProtectedRoute>
            <BackgroundsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chess",
        element: (
          <ProtectedRoute>
            <Chess />
          </ProtectedRoute>
        ),
      },
      {
        path: "/feed-backgrounds",
        element: (
          <ProtectedRoute>
            <BgsFeed />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);
