import { ReactFlowProvider } from "reactflow";
import type { MetaFunction, LinksFunction } from "@remix-run/cloudflare";
import { MainFlow } from "@/components/view/main-flow";
import reactFlowStyles from "reactflow/dist/style.css?url";

export const meta: MetaFunction = () => {
  return [
    { title: "AI Liu Liu~" },
    { name: "description", content: "Let's liu liu AI~" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: reactFlowStyles },
];

export default function Index() {
  return (
    <div className="w-screen h-screen flex overflow-hidden p-2 gap-2">
      <div className="flex-none w-[200px]">
        <div className="w-full h-full bg-background rounded-md overflow-hidden">
          <h1>AI Liu Liu</h1>
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
