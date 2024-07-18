interface IModelProvider {
  id: number;
  label: string;
  provider: string;
  value: string;
  level: number;
  created_at: string;
  updated_at: string;
}

interface ISpaceDetail {
  space: ISpace;
  nodes: ISpaceNode[];
}

interface ISpace {
  id: number;
  name: string;
  meta?: ISpaceMeta;
  created_at: string;
  updated_at: string;
}
interface ISpaceMeta {
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  edges?: (Partial<import("reactflow").Edge> & {
    source: string;
    target: string;
  })[];
}

interface ISpaceNode {
  id: number;
  space_id: number;
  data?: any;
  created_at: string;
  updated_at: string;
}

interface IChatMessage {
  id: number;
  node_id: number;
  role: string;
  content: string;
}
