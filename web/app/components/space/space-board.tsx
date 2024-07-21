import useSWRImmutable from "swr/immutable";
import { useEffect, useRef } from "react";
import { useUnmount } from "ahooks";
import { ReactFlow, Background, Controls, MiniMap } from "reactflow";
import { nodeTypes } from "@/components/nodes";
import { useBoardStore } from "./state/base";
import { initBoardData } from "./state/transform";
import { useHandler } from "./state/use-handler";
import { CtxMenu } from "./ctx-menu";

interface Props {
  spaceId: number;
}

export const SpaceBoard = (props: Props) => {
  const { spaceId } = props;
  const { data: detail, mutate } = useSWRImmutable<ISpaceDetail>(
    `/api/space/detail?id=${spaceId}`,
    { suspense: true }
  );

  useEffect(() => {
    if (detail) initBoardData(spaceId, detail);
  }, []);

  useUnmount(() => mutate(undefined));

  const nodes = useBoardStore((s) => s.nodes);
  const edges = useBoardStore((s) => s.edges);
  const onEdgesChange = useBoardStore((s) => s.onEdgesChange);
  const onConnect = useBoardStore((s) => s.onConnect);

  const domRef = useRef<HTMLDivElement>(null);

  const { handleCreateNode, handleNodesChange, handleSave } = useHandler();

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
        useBoardStore.setState({
          position: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          },
        });
      }}
    >
      <Background />
      <MiniMap zoomable pannable style={{ width: 120, height: 80 }} />
      <Controls />

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-none">
          <div className="text-lg text-gray-400">Right-click to add node</div>
        </div>
      )}

      <CtxMenu onAdd={handleCreateNode} />
    </ReactFlow>
  );
};
