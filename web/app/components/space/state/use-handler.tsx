import type { Node, OnNodesChange } from "reactflow";
import { applyNodeChanges, useReactFlow } from "reactflow";
import { useLockFn } from "ahooks";
import { useBoardStore } from "./base";
import { fetcher } from "@/services/base";
import { toast } from "@/components/ui/use-toast";
import { useCallback } from "react";

export const useHandler = () => {
  const { project, getNodes, getViewport, getEdges } = useReactFlow();

  // create node
  const handleCreateNode = useLockFn(
    async (value: { type: string; data: any }) => {
      const { spaceId, position } = useBoardStore.getState();
      if (!position) return;

      const style = {
        chat: { width: 500, height: 600 },
        chatinput: { width: 400 },
      }[value.type];

      const newNode: Partial<Node> = {
        type: value.type,
        position: project(position),
        data:
          value.type === "chat" ? { model: value.data, spaceId } : { spaceId },
        style,
      };

      try {
        const result = await fetcher<ISpaceNode>("/api/space/create_node", {
          method: "POST",
          body: { space_id: spaceId, data: newNode },
        });
        newNode.id = result.id.toString();
        useBoardStore.setState((s) => ({
          nodes: [...s.nodes, newNode as any],
        }));
      } catch (err: any) {
        console.error(err);
        toast({ title: "Error", description: "Failed to create node" });
      } finally {
        useBoardStore.setState({ position: null });
      }
    }
  );

  // save node
  const handleSave = useLockFn(async () => {
    const { spaceId } = useBoardStore.getState();
    try {
      const saveNodes = getNodes().map((n) => {
        const { position, data, style, type } = n;
        return {
          id: parseInt(n.id),
          space_id: spaceId,
          data: { position, data, style, type },
        };
      });

      const edges = getEdges().map(
        ({ type, source, target, sourceHandle, targetHandle }) => ({
          type,
          source,
          target,
          sourceHandle,
          targetHandle,
        })
      );

      await fetcher("/api/space/update_data", {
        method: "POST",
        body: {
          space_id: spaceId,
          meta: { viewport: getViewport(), edges },
          nodes: saveNodes,
        },
      });
      toast({ title: "Success", description: "Saved successfully" });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save" });
    }
  });

  const handleNodesChange: OnNodesChange = useCallback(async (e) => {
    const { spaceId } = useBoardStore.getState();

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

    let nodes = applyNodeChanges(e, useBoardStore.getState().nodes);
    // change z-index
    for (const change of e) {
      if (change.type === "position") {
        const cur = nodes.find((n) => n.id === change.id);
        if (!cur) continue;
        const filtered = nodes.filter((n) => n.id !== change.id);
        nodes = [...filtered, cur];
      }
    }
    useBoardStore.setState({ nodes });
  }, []);

  return {
    handleCreateNode,
    handleNodesChange,
    handleSave,
  };
};
