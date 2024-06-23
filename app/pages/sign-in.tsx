import { SignIn } from "@clerk/clerk-react";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div>
      <h1>Sign In route</h1>
      <SignIn />
    </div>
  );
}
