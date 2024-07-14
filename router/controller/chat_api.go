package controller

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/router/utils"
	"github.com/zzzgydi/ailiuliu/service/space"
)

func GetChatHistory(c *gin.Context) {
	spaceId, err := strconv.Atoi(c.Query("space_id"))
	if err != nil {
		ReturnBadRequest(c, err)
		return
	}

	nodeId, err := strconv.Atoi(c.Query("node_id"))
	if err != nil {
		ReturnBadRequest(c, err)
		return
	}

	offset, err := strconv.Atoi(c.DefaultQuery("offset", "0"))
	if err != nil {
		ReturnBadRequest(c, err)
		return
	}

	size, err := strconv.Atoi(c.DefaultQuery("size", "20"))
	if err != nil {
		ReturnBadRequest(c, err)
		return
	}

	userId := utils.GetContextUserId(c)

	history, err := space.GetChatHistory(userId, spaceId, nodeId, offset, size)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, history)
}

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
