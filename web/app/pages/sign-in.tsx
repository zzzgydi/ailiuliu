import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <SignIn />
    </div>
  );
}
