import { NodeTypes } from "reactflow";
import { ChatNode } from "./chat-node";
import { ChatInputNode } from "./chat-input-node";

export const nodeTypes: NodeTypes = {
  chat: ChatNode,
  chatinput: ChatInputNode,
};
