import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { nodeTypes } from "@/components/nodes";
import { CtxMenu } from "./ctx-menu";

export const MainFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const domRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleAddNode = (model: any) => {
    if (!position) return;

    const newNode: Node = {
      id: Date.now().toString(),
      type: "chat",
      position: project(position),
      data: { model },
      style: {
        width: 500,
        height: 600,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setPosition(null);
  };

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
          !(e.target as HTMLDivElement)?.className?.includes?.(
            "react-flow__pane"
          )
        )
          return;
        e.preventDefault();
        e.stopPropagation();

        if (!domRef.current) return;

        const rect = domRef.current.getBoundingClientRect();
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
    >
      <Background />
      <MiniMap zoomable pannable />
      <Controls />

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-none">
          <div className="text-lg text-gray-400">Right-click to add node</div>
        </div>
      )}

      {position && (
        <div
          className="absolute w-full h-full top-0 left-0 z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPosition(null);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPosition(null);
          }}
        >
          <CtxMenu position={position} onAdd={handleAddNode} />
        </div>
      )}
    </ReactFlow>
  );
};
