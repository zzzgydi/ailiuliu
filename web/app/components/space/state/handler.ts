import { toast } from "@/components/ui/use-toast";
import { fetcher } from "@/services/base";
import type { Edge, OnNodesChange } from "reactflow";
import { applyNodeChanges, MarkerType } from "reactflow";
import { useBoardStore } from "./base";

type PartialEdge = Partial<Edge> & { source: string; target: string };

export const parseEdge = (edge: PartialEdge): Edge => {
  return {
    ...edge,
    id: `${edge.source}-${edge.target}-${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")}`,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: "#FF0072",
    },
    style: { strokeWidth: 2, stroke: "#FF0072" },
    animated: true,
  };
};
