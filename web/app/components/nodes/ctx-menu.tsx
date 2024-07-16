import useSWRImmutable from "swr/immutable";
import { cn } from "@/utils/ui";
import { ModelIcon } from "./model-icon";
import { useMemo } from "react";

interface Props {
  position: { x: number; y: number };
  onAdd?: (value: { type: string; data: any }) => void;
}

export const CtxMenu = (props: Props) => {
  const { position, onAdd } = props;

  const { data, isLoading } =
    useSWRImmutable<IModelProvider[]>("/api/model/list");

  const menuList = useMemo(
    () => [
      { label: "Chat Input", type: "chatinput", data: null },
      ...(data?.map((m) => ({ label: m.label, type: "chat", data: m })) ?? []),
    ],
    [data]
  );

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      )}
      style={{ left: position.x, top: position.y }}
    >
      {menuList.map((m) =>
        m.type === "chatinput" ? (
          <div
            key={m.type}
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none 
            hover:bg-accent hover:text-accent-foreground
            focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => onAdd?.(m)}
          >
            <span>{m.label}</span>
          </div>
        ) : (
          <div
            key={m.data!.id}
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none 
            hover:bg-accent hover:text-accent-foreground
            focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => onAdd?.(m)}
          >
            <ModelIcon model={m.data!} className="w-4 h-4 mr-1" />
            <span>{m.label}</span>
          </div>
        )
      )}

      {isLoading ? (
        <div className="text-center p-1 text-muted-foreground">Loading...</div>
      ) : (
        !data?.length && (
          <div className="text-center p-1 text-muted-foreground">Empty</div>
        )
      )}
    </div>
  );
};
