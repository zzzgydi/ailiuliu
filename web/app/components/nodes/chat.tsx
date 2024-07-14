import OpenAI from "openai";
import { useState } from "react";
import { produce } from "immer";
import { v4 as uuid } from "uuid";
import { NodeProps, NodeResizer, useStoreApi } from "reactflow";
import { cn } from "@/utils/ui";
import { ChatInput } from "./chat-input";
import { MarkdownContent } from "./markdown";
import { baseURL, fetchStream } from "@/services/base";
import { ModelIcon } from "./model-icon";
import { useParams } from "react-router-dom";
import { toast } from "../ui/use-toast";

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
  const {
    id: nodeId,
    data: { model },
  } = props;
  const { id: spaceIdStr } = useParams<{ id: string }>();

  const storeApi = useStoreApi();

  const [items, setItems] = useState<
    { id: number; role: string; content: string }[]
  >([]);

  const handleChat = async (query: string) => {
    query = query.trim();
    if (!query) return;

    const now = Date.now();
    setItems((l) => [...l, { id: now, role: "user", content: query }]);

    try {
      const node_id = nodeId ? parseInt(nodeId) : null;
      const space_id = spaceIdStr ? parseInt(spaceIdStr) : null;

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
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description: e.message || "Failed to send message",
      });
    }
  };

  // const handleChat = async (query: string) => {
  //   query = query.trim();
  //   if (!query) return;

  //   const openai = new OpenAI({
  //     baseURL: `${baseURL}/api/v1`,
  //     apiKey: "sk-123123123123123123123123123123",
  //     dangerouslyAllowBrowser: true,
  //     maxRetries: 1,
  //   });

  //   const messages = [
  //     ...items.map(({ id, ...r }) => r),
  //     { role: "user", content: query },
  //   ] as any;

  //   setItems((l) => [...l, { id: uuid(), role: "user", content: query }]);

  //   const stream = await openai.chat.completions.create({
  //     model: props.data.model?.value || "gpt-3.5-turbo",
  //     messages,
  //     stream: true,
  //   });
  //   const id = uuid();
  //   for await (const chunk of stream) {
  //     setItems((i) =>
  //       produce(i, (draft) => {
  //         const cur = draft.find((m) => m.id === id);
  //         if (cur) {
  //           cur.content += chunk.choices[0]?.delta?.content || "";
  //         } else {
  //           draft.push({
  //             id,
  //             role: "assistant",
  //             content: chunk.choices[0]?.delta?.content || "",
  //           });
  //         }
  //       })
  //     );
  //   }
  // };

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
          "border w-full bg-white h-full rounded-lg flex flex-col min-w-[200px] min-h-[200px]",
          props.selected &&
            "ring-2 ring-muted-foreground dark:ring-muted-foreground"
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
            <div className="w-full h-full overflow-y-auto nowheel px-2">
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
