import { useState } from "react";
import { NodeProps, NodeResizer } from "reactflow";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/utils/ui";

const controlStyle = {
  background: "transparent",
  border: "none",
};

export function ChatNode(props: NodeProps<{ label: string }>) {
  const [value, setValue] = useState("");
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
          "border p-2 w-full h-full bg-red-100 rounded-lg flex flex-col min-w-[200px] min-h-[200px]",
          props.selected && "ring"
        )}
      >
        <div className="flex-auto">
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}

          {!items.length && (
            <div>
              <div>暂无数据</div>
            </div>
          )}
        </div>

        <div className="flex-none flex items-center gap-2 nodrag">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <Button
            onClick={() => {
              if (!value) return;
              setItems((i) => [...i, value]);
              setValue("");
            }}
          >
            保存
          </Button>
        </div>
      </div>
      {/* <Handle type="source" position={Position.Bottom} id="a" /> */}
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      /> */}
    </>
  );
}
