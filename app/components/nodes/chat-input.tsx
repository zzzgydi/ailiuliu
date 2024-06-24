import { cn } from "@/utils/ui";
import { useRef, useState } from "react";
import { Forward } from "lucide-react";
import { BaseInput } from "./base-input";
import { Button } from "@/components/ui/button";

interface Props {
  loading?: boolean;
  onSend?: (value: string) => Promise<void>;
  onFocus?: (focus: boolean) => void;
}

export const ChatInput = (props: Props) => {
  const { loading, onSend, onFocus } = props;

  const [value, setValue] = useState("");
  // const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!value.trim() || loading || !onSend) {
      return;
    }
    const oldValue = value;
    try {
      setValue("");
      await onSend(value);
    } catch (err: any) {
      console.error(err);
      setValue((v) => (v === "" ? oldValue : v));
    }
  };

  return (
    <div
      className={cn(
        "relative py-3 pl-3 pr-3 border-solid border border-muted rounded-lg",
        "bg-muted flex gap-2 items-end"
        // focus && "ring-2 ring-muted-foreground dark:ring-muted-foreground"
      )}
    >
      <BaseInput
        className="w-full input-scrollbar"
        ref={inputRef}
        value={value}
        autoFocus={false}
        placeholder="Ask Anything..."
        onChange={(v) => setValue(v)}
        onEnter={handleSend}
        onFocus={onFocus}
      />

      <div className="w-6 h-6 flex items-center">
        {loading ? (
          <div className="second-loader"></div>
        ) : (
          <Button
            variant="ghost"
            className="w-6 h-6 p-0"
            onClick={handleSend}
            aria-label="Send"
          >
            <Forward className="text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
};
