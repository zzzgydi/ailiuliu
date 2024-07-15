import useSWRImmutable from "swr/immutable";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import type { Node, OnNodesChange } from "reactflow";
import { useLockFn, useUnmount } from "ahooks";
import { nodeTypes } from "@/components/nodes";
import { CtxMenu } from "@/components/nodes/ctx-menu";
import { toast } from "@/components/ui/use-toast";
import { fetcher } from "@/services/base";

interface Props {
  spaceId: number;
}

export const SpaceBoard = (props: Props) => {
  const { spaceId } = props;
  const { data: detail, mutate } = useSWRImmutable<ISpaceDetail>(
    `/api/space/detail?id=${spaceId}`,
    { suspense: true }
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useUnmount(() => mutate(undefined));

  useEffect(() => {
    const _nodes = detail?.nodes.map((n) => ({
      ...n.data,
      id: n.id.toString(),
    }));
    setNodes(_nodes || []);
    setEdges([]);
  }, [detail]);

  const { project, getNodes, getViewport } = useReactFlow();

  const onConnect = useCallback(
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const domRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleCreateNode = useLockFn(async (model: any) => {
    if (!position) return;

    const newNode: Partial<Node> = {
      type: "chat",
      position: project(position),
      data: { model },
      style: { width: 500, height: 600 },
    };

    try {
      const result = await fetcher<ISpaceNode>("/api/space/create_node", {
        method: "POST",
        body: { space_id: spaceId, data: newNode },
      });
      newNode.id = result.id.toString();
      setNodes((nds) => [...nds, newNode as any]);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create node" });
    } finally {
      setPosition(null);
    }
  });

  const handleSave = useLockFn(async () => {
    try {
      const saveNodes = getNodes().map((n) => {
        const { position, data, style, type } = n;
        return {
          id: parseInt(n.id),
          space_id: spaceId,
          data: { position, data, style, type },
        };
      });

      await fetcher("/api/space/update_data", {
        method: "POST",
        body: {
          space_id: spaceId,
          meta: { viewport: getViewport() },
          nodes: saveNodes,
        },
      });
      toast({ title: "Success", description: "Saved successfully" });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save" });
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave]);

  const handleNodesChange: OnNodesChange = async (e) => {
    const rm = e.find((i) => i.type === "remove");
    if (rm) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this node?"
      );
      if (!confirmDelete) return false;

      try {
        await fetcher("/api/space/delete_node", {
          method: "POST",
          body: { space_id: spaceId, node_id: parseInt(rm.id) },
        });
        toast({ title: "Success", description: "Node deleted successfully" });
      } catch (err: any) {
        console.error(err);
        toast({ title: "Error", description: "Failed to delete node" });
        return;
      }
    }
    onNodesChange(e);

    // change z-index
    for (const change of e) {
      if (change.type === "position") {
        setNodes((nds) => {
          const cur = nds.find((n) => n.id === change.id);
          if (!cur) return nds;
          const filtered = nds.filter((n) => n.id !== change.id);
          return [...filtered, cur];
        });
      }
    }
  };

  return (
    <ReactFlow
      ref={domRef}
      nodes={nodes}
      edges={edges}
      defaultViewport={detail?.space.meta?.viewport}
      onNodesChange={handleNodesChange}
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
          <CtxMenu position={position} onAdd={handleCreateNode} />
        </div>
      )}
    </ReactFlow>
  );
};
