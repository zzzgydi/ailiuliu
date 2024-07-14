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

func AdminPostModelProvider(c *gin.Context) {
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
