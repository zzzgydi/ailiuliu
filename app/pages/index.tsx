import { ReactFlowProvider } from "reactflow";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { MainFlow } from "@/components/nodes/main-flow";
import "reactflow/dist/style.css";

export default function Index() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace={true} />;
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden p-2 gap-2">
      <div className="flex-none w-[250px]">
        <div className="w-full h-full bg-background rounded-md overflow-hidden">
          <h1 className="p-1 text-lg font-medium">AI Liu Liu</h1>
        </div>
      </div>
      <div className="flex-auto h-full w-full">
        <div className="w-full h-full bg-muted rounded-md overflow-hidden p-1">
          <ReactFlowProvider>
            <MainFlow />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
