import { Suspense } from "react";
import { SWRConfig } from "swr/_internal";
import { BrowserRouter, useNavigate, useRoutes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { fetcher } from "@/services/base";
import ReactDOM from "react-dom/client";
import routes from "~react-pages";
import "@/assets/global.css";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  const navigate = useNavigate();

  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        routerPush={(to) => navigate(to)}
        routerReplace={(to) => navigate(to, { replace: true })}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      >
        <Suspense fallback={<p>Loading...</p>}>{useRoutes(routes)}</Suspense>
      </ClerkProvider>
    </SWRConfig>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);
