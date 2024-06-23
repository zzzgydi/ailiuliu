import { Claude } from "@lobehub/icons";
import { DeepSeek } from "@lobehub/icons";
import { Gemini } from "@lobehub/icons";
import { Groq } from "@lobehub/icons";
import { OpenAI } from "@lobehub/icons";
import { Mistral } from "@lobehub/icons";
import { Cohere } from "@lobehub/icons";
import { Meta } from "@lobehub/icons";

interface Props {
  model?: IModel;
  className?: string;
}

export const ModelIcon = ({ model, className }: Props) => {
  if (!model) return null;
  switch (model.provider) {
    case "claude":
      return <Claude.Color className={className} />;
    case "deepseek":
      return <DeepSeek.Color className={className} />;
    case "gemini":
      return <Gemini.Color className={className} />;
    case "groq":
      return <Groq className={className} />;
    case "openai":
      return <OpenAI className={className} />;
    case "mistral":
      return <Mistral.Color className={className} />;
    case "cohere":
      return <Cohere.Color className={className} />;
    case "meta":
      return <Meta.Color className={className} />;
    default:
      return null;
  }
};
