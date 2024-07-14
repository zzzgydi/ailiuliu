package space

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
	"github.com/zzzgydi/ailiuliu/model"
	"github.com/zzzgydi/ailiuliu/service/llm"
)

type LLMSetting struct {
	Model        string   `json:"model"`
	SystemPrompt string   `json:"system_prompt,omitempty"`
	UseHistory   *bool    `json:"use_history,omitempty"`
	MaxTokens    int      `json:"max_tokens,omitempty"`
	Temperature  float32  `json:"temperature,omitempty"`
	TopP         float32  `json:"top_p,omitempty"`
	N            int      `json:"n,omitempty"`
	Stream       bool     `json:"stream,omitempty"`
	Stop         []string `json:"stop,omitempty"`
}

func SpaceChat(c *gin.Context, userId string, spaceId, nodeId int, query string, setting *LLMSetting) error {
	// check access
	_, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return err
	}
	// check access
	_, err = model.GetSpaceNode(spaceId, nodeId)
	if err != nil {
		return err
	}

	messages := []openai.ChatCompletionMessage{}

	if setting.SystemPrompt != "" {
		messages = append(messages, openai.ChatCompletionMessage{
			Role:    "system",
			Content: setting.SystemPrompt,
		})
	}

	useHistory := true
	if setting.UseHistory != nil {
		useHistory = *setting.UseHistory
	}
	if useHistory {
		history, err := model.GetChatMessagesByNodeId(nodeId, 0, 20)
		if err != nil {
			return err
		}
		// reverse history
		reversedArr := make([]*model.ChatMessage, len(history))
		for i := range history {
			reversedArr[len(history)-1-i] = history[i]
		}

		for _, msg := range reversedArr {
			messages = append(messages, openai.ChatCompletionMessage{
				Role:    msg.Role,
				Content: msg.Content,
			})
		}
	}

	messages = append(messages,
		openai.ChatCompletionMessage{Role: "user", Content: query})

	req := openai.ChatCompletionRequest{
		Model:       setting.Model,
		Messages:    messages,
		Stream:      true,
		Temperature: setting.Temperature,
		MaxTokens:   setting.MaxTokens,
		TopP:        setting.TopP,
		N:           setting.N,
		Stop:        setting.Stop,
	}
	client := llm.NewLLMClient()
	stream, err := client.CreateChatCompletionStream(context.Background(), req)
	if err != nil {
		return err
	}

	content := ""

	for {
		response, err := stream.Recv()
		if err != nil {
			if errors.Is(err, io.EOF) {
				c.Writer.Write([]byte("data: {\"type\":\"done\"}\n\n"))
				c.Writer.Flush()
				break
			}
			return err
		}

		delta := response.Choices[0].Delta.Content
		content += delta

		ret := map[string]string{
			"type":    "chat",
			"content": delta,
		}
		retData, err := json.Marshal(ret)
		if err == nil && c.Request.Context().Err() != nil {
			retBytes := append([]byte("data: "), retData...)
			retBytes = append(retBytes, []byte("\n\n")...)
			c.Writer.Write(retBytes)
			c.Writer.Flush()
		}
	}

	err = model.BatchCreateChatMessage(nodeId, []model.ChatMessage{
		{NodeId: nodeId, Role: "user", Content: query},
		{NodeId: nodeId, Role: "assistant", Content: content},
	})
	if err != nil {
		slog.Error("create chat message failed", "node_id", nodeId, "err", err)
	}

	return nil
}
