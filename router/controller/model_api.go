package controller

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/router/utils"
	"github.com/zzzgydi/ailiuliu/service/manage"
)

func GetModelList(c *gin.Context) {
	userId := utils.GetContextUserId(c)
	if userId == "" {
		ReturnBadRequest(c, fmt.Errorf("user not login"))
		return
	}

	models, err := manage.GetModelList(userId)
	if err != nil {
		ReturnServerError(c, err)
		return
	}

	ReturnSuccess(c, models)
}
