import { Handle, NodeProps, NodeResizer, Position } from "reactflow";
import { cn } from "@/utils/ui";
import { Button } from "../ui/button";
import { Forward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface INodeData {}

const handleStyle = {
  background: "#502eb0",
  width: 12,
  height: 6,
  borderRadius: "3px 3px 0 0",
};
const controlStyle = {
  background: "transparent",
  border: "none",
};

export const ChatInputNode = (props: NodeProps<INodeData>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          setHeight(`${entry.contentRect.height}px`);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <>
      <NodeResizer
        color="transparent"
        handleStyle={controlStyle}
        isVisible={props.selected}
        minWidth={200}
        minHeight={70}
      />
      <Handle
        type="source"
        position={Position.Top}
        style={{ ...handleStyle }}
      />
      <div
        className={cn(
          "nowheel w-full bg-background h-full border p-2 pr-0 rounded-lg overflow-hidden",
          props.selected &&
            "border-transparent ring-2 ring-muted-foreground dark:ring-muted-foreground"
        )}
      >
        <div className="w-full h-full pr-2 overflow-y-auto">
          <div
            className={cn(
              "h-full relative py-3 pl-3 pr-3 border-solid border border-muted rounded-lg",
              "bg-muted flex gap-2 items-end"
              // focus && "ring-2 ring-muted-foreground dark:ring-muted-foreground"
            )}
            ref={containerRef}
          >
            <textarea
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder={"Ask Anything..."}
              className={cn(
                "resize-none flex-1 outline-none bg-transparent",
                "text-black/80 placeholder:text-black/40 caret-black/80",
                "dark:text-white/90 dark:placeholder:text-white/60 dark:caret-white/90",
                "w-full h-auto input-scrollbar"
              )}
              style={{ height, lineHeight: "24px" }}
              // value={value}
              // onChange={handleChange}
              onKeyDown={(e) => {
                // https://www.zhangxinxu.com/wordpress/2023/02/js-enter-submit-compositionupdate/
                // https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/isComposing
                if (
                  !e.shiftKey &&
                  e.key === "Enter" &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  // onEnter?.((e.target as any).value);
                }
              }}
            />

            <div className="w-6 h-6 flex items-center">
              {false ? (
                <div className="second-loader"></div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-6 h-6 p-0"
                  // onClick={handleSend}
                  aria-label="Send"
                >
                  <Forward className="text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
