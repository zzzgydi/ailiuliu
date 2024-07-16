import { Suspense, useMemo } from "react";
import { SWRConfig } from "swr/_internal";
import { BrowserRouter, useNavigate, useRoutes } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { createFetcher } from "@/services/base";
import { Toaster } from "@/components/ui/toaster";
import ReactDOM from "react-dom/client";
import routes from "~react-pages";
import "@/assets/global.css";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function Auth() {
  const { getToken } = useAuth();

  const fetcher = useMemo(() => createFetcher(getToken), [getToken]);

  return (
    <SWRConfig value={{ fetcher }}>
      <Suspense fallback={<div />}>{useRoutes(routes)}</Suspense>
    </SWRConfig>
  );
}

function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <Auth />
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <App />
    <Toaster />
  </BrowserRouter>
);
