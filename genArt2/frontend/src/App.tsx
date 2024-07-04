import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

import './App.css'
import BackgroundsPage from "routes/BackgroundsPage";
import FeedPage from "routes/FeedPage";

function App() {


  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>

      </header>
      <div>
        <BackgroundsPage />
        <FeedPage />
      </div>
    </>
  )
}

export default App
