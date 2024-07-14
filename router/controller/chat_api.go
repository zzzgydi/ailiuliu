package controller

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/router/utils"
	"github.com/zzzgydi/ailiuliu/service/space"
)

func StreamChat(c *gin.Context) {
	var req struct {
		SpaceId int               `json:"space_id"`
		NodeId  int               `json:"node_id"`
		Query   string            `json:"query"`
		Setting *space.LLMSetting `json:"setting,omitempty"`
	}

	if err := c.BindJSON(&req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if req.Setting == nil {
		ReturnBadRequest(c, fmt.Errorf("setting is required"))
		return
	}

	if req.Query == "" {
		ReturnBadRequest(c, fmt.Errorf("query is required"))
		return
	}

	userId := utils.GetContextUserId(c)

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Transfer-Encoding", "chunked")

	err := space.SpaceChat(c, userId, req.SpaceId, req.NodeId, req.Query, req.Setting)
	if err != nil {
		ReturnServerError(c, err)
		return
	}
}
