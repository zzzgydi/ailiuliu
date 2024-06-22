import ReactFlow from "reactflow";
import type { MetaFunction, LinksFunction } from "@remix-run/node";
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

const initialNodes = [
  { id: "1", type: "input", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function Index() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  );
}
