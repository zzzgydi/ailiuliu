import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export const AuthLayout = (props: Props) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace={true} />;
  }

  return props.children;
};
