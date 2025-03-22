import { SignIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function App() {
  return (
    // <header>
    //   <SignedOut>
    //     <SignInButton />
    //   </SignedOut>
    //   <SignedIn>
    //     <UserButton />
    //   </SignedIn>
    // </header>
   


    <div className="flex items-center justify-center min-h-screen">
      <SignIn path="/sign-in" routing="path" />
    </div>


  );
}