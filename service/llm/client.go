package llm

import "github.com/sashabaranov/go-openai"

func NewLLMClient() *openai.Client {
	return openai.NewClientWithConfig(*gptConfig)
}
