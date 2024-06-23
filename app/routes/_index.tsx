import { ReactFlowProvider } from "reactflow";
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { MainFlow } from "@/components/nodes/main-flow";
import { getAuth } from "@clerk/remix/ssr.server";
import katexStyle from "katex/dist/katex.min.css?url";
import markdownStyle from "@/assets/markdown.scss?url";
import highlightStyle from "@/assets/highlight.scss?url";
import reactFlowStyle from "reactflow/dist/style.css?url";

export const meta: MetaFunction = () => {
  return [
    {
      title: "AI Liu Liu~",
      charSet: "utf-8",
      viewport: "width=device-width,initial-scale=1",
    },
    { name: "description", content: "Let's liu liu AI~" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: reactFlowStyle },
  { rel: "stylesheet", href: katexStyle },
  { rel: "stylesheet", href: markdownStyle },
  { rel: "stylesheet", href: highlightStyle },
];

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
  return {};
};

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
