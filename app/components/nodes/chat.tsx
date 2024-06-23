import OpenAI from "openai";
import { useState } from "react";
import { produce } from "immer";
import { v4 as uuid } from "uuid";
import { NodeProps, NodeResizer } from "reactflow";
import { ChatInput } from "./chat-input";
import { MarkdownContent } from "./markdown";
import { cn } from "@/utils/ui";

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
  const [items, setItems] = useState<
    { id: string; role: string; content: string }[]
  >([]);

  const handleChat = async (query: string) => {
    query = query.trim();
    if (!query) return;

    const openai = new OpenAI({
      baseURL: `${window.location.origin}/v1`,
      apiKey: "sk-123123123123123123123123123123",
      dangerouslyAllowBrowser: true,
    });

    const messages = [
      ...items.map(({ id, ...r }) => r),
      { role: "user", content: query },
    ] as any;

    setItems((l) => [...l, { id: uuid(), role: "user", content: query }]);

    const stream = await openai.chat.completions.create({
      model: props.data.model?.value || "gpt-3.5-turbo",
      messages,
      stream: true,
    });
    const id = uuid();
    for await (const chunk of stream) {
      setItems((i) =>
        produce(i, (draft) => {
          const cur = draft.find((m) => m.id === id);
          if (cur) {
            cur.content += chunk.choices[0]?.delta?.content || "";
          } else {
            draft.push({
              id,
              role: "assistant",
              content: chunk.choices[0]?.delta?.content || "",
            });
          }
        })
      );
    }
  };

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
          <div className="text-lg font-bold">Chat</div>

          {props.data.model && (
            <div className="ml-auto text-xs text-muted-foreground border p-0.5 rounded-md bg-muted">
              {props.data.model?.label || "No Model Selected"}
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
          <ChatInput onSend={handleChat} />
        </div>
      </div>
    </>
  );
}
