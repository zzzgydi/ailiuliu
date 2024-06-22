import { cn } from "@/utils/ui";

const models = [
  { label: "GPT 4o", provider: "openai", value: "gpt4o" },
  { label: "GPT 3.5 Turbo", provider: "openai", value: "gpt3.5-turbo" },
  { label: "Deepseek 2", provider: "deepseek", value: "deepseek-chat" },
];

interface Props {
  position: { x: number; y: number };
  onAdd?: (model: (typeof models)[0]) => void;
}

export const CtxMenu = (props: Props) => {
  const { position, onAdd } = props;

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {models.map((m) => (
        <div
          key={m.value}
          className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none 
            hover:bg-accent hover:text-accent-foreground
            focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          onClick={() => onAdd?.(m)}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
};
