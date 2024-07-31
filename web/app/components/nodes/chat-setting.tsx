import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { useBoardStore } from "../space/state/base";
import { produce } from "immer";

interface Props {
  nodeId: string;
  setting?: IChatSetting;
  onChange?: () => void;
}

const FormSchema = z.object({
  system_prompt: z.string().optional(),
  use_history: z.boolean().optional(),
  max_tokens: z.number().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  stop: z.array(z.string()).optional(),
  frequency_penalty: z.number().optional(),
});

export const ChatSetting = (props: Props) => {
  const { nodeId } = props;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      system_prompt: "",
      use_history: true,
    },
  });

  useEffect(() => {
    if (!props.setting) return;
    form.reset(props.setting);
  }, [props.setting]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      useBoardStore.setState((s) =>
        produce(s, (draft) => {
          const node = draft.nodes.find((n) => n.id === nodeId);
          if (!node) return;
          node.data.setting = data;
        })
      );
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    }
  };

  return (
    <div className="nodrag nowheel w-full h-full overflow-y-auto py-3 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 m-auto"
        >
          {/* <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Model name" {...field} />
                </FormControl>
                <FormDescription>The name of the model.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="system_prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Prompt</FormLabel>
                <FormControl>
                  <Textarea placeholder="System prompt" {...field} rows={8} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="use_history"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Use History</FormLabel>
                <FormControl>
                  <div>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_tokens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Tokens</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Max tokens"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>The maximum number of tokens.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperature</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Temperature"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>The sampling temperature.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="top_p"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Top P</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Top P"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  The cumulative probability for nucleus sampling.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stop</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Stop sequences"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.split(","))}
                  />
                </FormControl>
                <FormDescription>
                  The stop sequences, separated by commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency_penalty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency Penalty</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Frequency Penalty"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>The frequency penalty value.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};
