package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/router/controller"
)

func APIRouter(r *gin.Engine) {
	api := r.Group("/api")

	api.GET("/model/list", controller.GetModelList)
}
