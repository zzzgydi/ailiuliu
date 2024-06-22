import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { nodeTypes } from "@/components/nodes";

const initialNodes = [
  {
    id: "node-1",
    type: "chat",
    position: { x: 200, y: 200 },
    data: { label: "" },
  },
];

export const MainFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const domRef = useRef<HTMLDivElement>(null);

  return (
    <ReactFlow
      ref={domRef}
      nodes={nodes}
      edges={edges}
      onNodesChange={(e) => {
        if (e.find((i) => i.type === "remove")) {
          const confirmDelete = window.confirm(
            "Are you sure you want to delete this node?"
          );
          if (!confirmDelete) return;
          console.log("delete", e);
        }
        onNodesChange(e);
      }}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onContextMenu={(e) => {
        if (
          !(e.target as HTMLDivElement).className.includes("react-flow__pane")
        )
          return;
        e.preventDefault();
        e.stopPropagation();

        if (!domRef.current) return;

        const rect = domRef.current.getBoundingClientRect();
        const position = project({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });

        const newNode = {
          id: Date.now().toString(),
          type: "chat", // 可以根据需要设置节点类型
          position: position,
          data: { label: `Node ${nodes.length + 1}` },
        };

        setNodes((nds) => [...nds, newNode]);
      }}
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};
