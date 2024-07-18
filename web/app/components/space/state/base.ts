import { create } from "zustand";
import type { Node, Edge, OnEdgesChange } from "reactflow";
import { addEdge, applyEdgeChanges } from "reactflow";
import { parseEdge } from "./transform";

interface BoardState {
  spaceId: number;
  detail: ISpaceDetail;
  position: { x: number; y: number } | null;
  nodes: Node[];
  edges: Edge[];
}

interface BoardHandler {
  onConnect: (connection: any) => void;
  onEdgesChange: OnEdgesChange;
}

export const useBoardStore = create<BoardState & BoardHandler>((set, get) => ({
  spaceId: 0,
  detail: null!,
  position: null,
  nodes: [],
  edges: [],
  onConnect: (connection) => {
    set({ edges: addEdge(parseEdge(connection), get().edges) });
  },
  onEdgesChange: (ecs) => {
    set({ edges: applyEdgeChanges(ecs, get().edges) });
  },
}));
