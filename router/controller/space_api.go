package controller

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/model"
	"github.com/zzzgydi/ailiuliu/router/utils"
	"github.com/zzzgydi/ailiuliu/service/space"
)

func ListUserSpace(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	offset, err := strconv.Atoi(c.DefaultQuery("offset", "0"))
	if err != nil {
		offset = 0
	}
	size, err := strconv.Atoi(c.DefaultQuery("size", "20"))
	if err != nil {
		size = 20
	}

	spaces, err := space.ListUserSpace(userId, offset, size)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, spaces)
}

func CreateSpace(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	var req struct {
		Name string `json:"name,omitempty"`
	}
	if err := c.BindJSON(&req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	space, err := space.CreateSpace(userId, req.Name)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, space)
}

func DetailSpace(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	spaceId, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if spaceId == 0 {
		ReturnBadRequest(c, fmt.Errorf("space id is required"))
		return
	}

	space, nodes, err := space.DetailSpace(userId, spaceId)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, gin.H{
		"space": space,
		"nodes": nodes,
	})
}

func DeleteSpace(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	spaceId, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if spaceId == 0 {
		ReturnBadRequest(c, fmt.Errorf("space id is required"))
		return
	}

	if err := space.DeleteSpace(userId, spaceId); err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, nil)
}

func UpdateSpaceName(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	var req struct {
		SpaceId int    `json:"space_id,omitempty"`
		Name    string `json:"name,omitempty"`
	}
	if err := c.BindJSON(&req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if req.SpaceId == 0 {
		ReturnBadRequest(c, fmt.Errorf("space id is required"))
		return
	}

	if err := space.UpdateSpaceName(userId, req.SpaceId, req.Name); err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, nil)
}

func UpdateSpaceData(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	var req struct {
		SpaceId int                `json:"space_id,omitempty"`
		Meta    json.RawMessage    `json:"meta,omitempty"`
		Nodes   []*model.SpaceNode `json:"nodes,omitempty"`
	}
	if err := c.BindJSON(&req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if req.SpaceId == 0 {
		ReturnBadRequest(c, fmt.Errorf("space id is required"))
		return
	}

	if err := space.UpdateSpaceData(userId, req.SpaceId, req.Meta, req.Nodes); err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, nil)
}

func CreateSpaceNode(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	var req struct {
		SpaceId int             `json:"space_id,omitempty"`
		Data    json.RawMessage `json:"data,omitempty"`
	}
	if err := c.BindJSON(&req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if req.SpaceId == 0 {
		ReturnBadRequest(c, fmt.Errorf("space id is required"))
		return
	}

	node, err := space.CreateSpaceNode(userId, req.SpaceId, req.Data)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, node)
}

func DeleteSpaceNode(c *gin.Context) {
	userId := utils.GetContextUserId(c)

	var req struct {
		SpaceId int `json:"space_id,omitempty"`
		NodeId  int `json:"node_id,omitempty"`
	}
	if err := c.BindJSON(&req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if req.SpaceId == 0 {
		ReturnBadRequest(c, fmt.Errorf("space id is required"))
		return
	}

	if req.NodeId == 0 {
		ReturnBadRequest(c, fmt.Errorf("node id is required"))
		return
	}

	if err := space.DeleteSpaceNode(userId, req.SpaceId, req.NodeId); err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, nil)
}
