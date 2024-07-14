import { ReactFlowProvider } from "reactflow";
import { MainFlow } from "@/components/nodes/main-flow";
import { AuthLayout } from "@/components/base/auth-layout";
import "reactflow/dist/style.css";

const Page = () => {
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
};

export default function Index() {
  return (
    <AuthLayout>
      <Page />
    </AuthLayout>
  );
}
