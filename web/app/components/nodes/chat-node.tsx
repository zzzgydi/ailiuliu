import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { produce } from "immer";
import { useThrottleFn } from "ahooks";
import {
  Handle,
  NodeProps,
  NodeResizer,
  Position,
  useStoreApi,
} from "reactflow";
import { cn } from "@/utils/ui";
import { ChatInput } from "./chat-input";
import { MarkdownContent } from "./markdown";
import { fetchStream } from "@/services/base";
import { ModelIcon } from "./model-icon";
import { toast } from "../ui/use-toast";
import { eventBus } from "../space/state/event";

const controlStyle = {
  background: "transparent",
  border: "none",
};
const handleStyle = {
  background: "#d97706",
  width: 12,
  height: 6,
  borderRadius: "0 0 3px 3px",
};

interface INodeData {
  spaceId: number;
  model?: IModelProvider;
}

export function ChatNode(props: NodeProps<INodeData>) {
  const {
    id: nodeId,
    data: { model, spaceId },
  } = props;

  const { data: chatHistory } = useSWR<IChatMessage[]>(
    `/api/space/chat_history?space_id=${spaceId}&node_id=${nodeId}`,
    { revalidateOnFocus: false }
  );

  const storeApi = useStoreApi();

  const [items, setItems] = useState<
    { id: number; role: string; content: string }[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ret = chatHistory?.slice();
    ret?.reverse();

    setItems(ret ?? []);
  }, [chatHistory]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { run: handleStreamScroll } = useThrottleFn(
    () => {
      if (!scrollRef.current) return;
      const top = scrollRef.current.scrollHeight;
      scrollRef.current.scrollTo({ top, behavior: "smooth" });
    },
    { wait: 100, trailing: true, leading: true }
  );

  const handleChat = async (query: string) => {
    query = query.trim();
    if (!query) return;
    if (loading) return;
    setLoading(true);

    const now = Date.now();
    setItems((l) => [...l, { id: now, role: "user", content: query }]);
    setTimeout(() => handleStreamScroll(), 10);

    try {
      const node_id = nodeId ? parseInt(nodeId) : null;
      const space_id = spaceId;

      const stream = await fetchStream("/api/space/chat", {
        method: "POST",
        body: { space_id, node_id, query, setting: { model: model?.value } },
      });
      const reader = stream.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      if (!reader) throw new Error("No reader");

      const id = now + 1;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value.startsWith("data: ")) continue;
        const newValue = value.slice(6);
        for (const line of newValue.split("\n\ndata: ")) {
          const data = JSON.parse(line) as any;
          if (data.type === "chat") {
            setItems((i) =>
              produce(i, (draft) => {
                const cur = draft.find((m) => m.id === id);
                if (cur) {
                  cur.content += data?.content || "";
                } else {
                  draft.push({
                    id,
                    role: "assistant",
                    content: data?.content || "",
                  });
                }
              })
            );
            handleStreamScroll();
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description: e.message || "Failed to send message",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEvent = (data: any) => {
      handleChat(data.query);
    };

    eventBus.on(`chat:send:${nodeId}`, handleEvent);

    return () => {
      eventBus.removeListener(`chat:send:${nodeId}`, handleEvent);
    };
  }, [nodeId]);

  return (
    <>
      <Handle
        id="b"
        type="target"
        position={Position.Bottom}
        style={handleStyle}
      />
      <NodeResizer
        color="transparent"
        handleStyle={controlStyle}
        isVisible={props.selected}
        minWidth={200}
        minHeight={200}
      />
      <div
        className={cn(
          "border w-full bg-background h-full rounded-lg flex flex-col min-w-[200px] min-h-[200px]",
          props.selected &&
            "border-transparent ring-2 ring-muted-foreground dark:ring-muted-foreground"
        )}
      >
        <div className="flex items-center p-2">
          <ModelIcon model={props.data.model} className="w-5 h-5 mr-1" />

          <div className="text-lg font-bold">
            <span>Chat</span>
          </div>

          {props.data.model && (
            <div className="ml-auto text-xs text-muted-foreground border p-0.5 rounded-md bg-muted">
              {props.data.model?.label || "No Model"}
            </div>
          )}
        </div>
        <div className="flex-auto overflow-hidden select-text">
          {items.length > 0 ? (
            <div
              className="w-full h-full overflow-y-auto nowheel px-2"
              ref={scrollRef}
            >
              {items.map((item, index) => (
                <div
                  key={item.id || index}
                  className={cn(
                    "py-2 flex",
                    item.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {item.role === "user" ? (
                    <div
                      className="nodrag max-w-[90%] bg-muted py-3 px-4 text-sm whitespace-pre-wrap break-words [word-break:break-word]
                    rounded-l-lg rounded-br-lg"
                    >
                      {item.content}
                    </div>
                  ) : (
                    <div className="nodrag max-w-[90%] bg-muted py-3 px-4 rounded-r-lg rounded-bl-lg">
                      <MarkdownContent content={item.content} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
              Say everything you want
            </div>
          )}
        </div>
        <div className="nowheel nodrag flex-none p-2">
          <ChatInput
            loading={loading}
            onSend={handleChat}
            onFocus={(f) => {
              if (f) storeApi.getState().addSelectedNodes([props.id]);
            }}
          />
        </div>
      </div>
    </>
  );
}
