import { useState } from "react";
import { NodeProps, NodeResizer } from "reactflow";
import { cn } from "@/utils/ui";
import { ChatInput } from "./chat-input";

const controlStyle = {
  background: "transparent",
  border: "none",
};

interface INodeData {
  model?: {
    label: string;
    provider: string;
    value: string;
  };
}

export function ChatNode(props: NodeProps<INodeData>) {
  const [items, setItems] = useState<string[]>([]);

  return (
    <>
      <NodeResizer
        color="transparent"
        handleStyle={controlStyle}
        isVisible={props.selected}
        minWidth={200}
        minHeight={200}
      />
      <div
        className={cn(
          "border p-2 w-full bg-white h-full rounded-lg flex flex-col min-w-[200px] min-h-[200px]",
          props.selected &&
            "ring-2 ring-muted-foreground dark:ring-muted-foreground"
        )}
      >
        <div className="flex items-center">
          <div className="text-lg font-bold">Chat</div>

          {props.data.model && (
            <div className="ml-auto text-xs text-muted-foreground border p-0.5 rounded-md bg-muted">
              {props.data.model?.label || "No Model Selected"}
            </div>
          )}
        </div>
        <div className="flex-auto">
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}

          {!items.length && (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
              Say everything you want
            </div>
          )}
        </div>
        <ChatInput onSend={async (v) => setItems((l) => [...l, v])} />
      </div>
    </>
  );
}
