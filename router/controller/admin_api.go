package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/model"
	"github.com/zzzgydi/ailiuliu/service/admin"
)

func AdminGetAllModelProvider(c *gin.Context) {
	models, err := admin.GetModelProviderList()
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, models)
}

func AdminCreateModelProvider(c *gin.Context) {
	req := &CreateModelProviderRequest{}
	if err := c.ShouldBindJSON(req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	mp := &model.ModelProvider{
		Label:    req.Label,
		Provider: req.Provider,
		Value:    req.Value,
		Level:    req.Level,
	}

	mp, err := admin.CreateModelProvier(mp)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, mp)
}

func AdminUpdateModelProvider(c *gin.Context) {
	req := &UpdateModelProviderRequest{}
	if err := c.ShouldBindJSON(req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	mp := &model.ModelProvider{
		Id:       req.Id,
		Label:    req.Label,
		Provider: req.Provider,
		Value:    req.Value,
		Level:    req.Level,
	}

	mp, err := admin.UpdateModelProvider(mp)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, mp)
}

func AdminDeleteModelProvider(c *gin.Context) {
	req := &struct {
		Id int `json:"id" binding:"required"`
	}{}
	if err := c.ShouldBindJSON(req); err != nil {
		ReturnBadRequest(c, err)
		return
	}

	if err := admin.DeleteModelProvider(req.Id); err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, nil)
}
