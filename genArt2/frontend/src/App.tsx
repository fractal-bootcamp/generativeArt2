import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

import './App.css'
import BackgroundsPage from "routes/BackgroundsPage";
import BgsFeed from "routes/BgsFeed";

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
        <BgsFeed />
      </div>
    </>
  )
}

export default App
