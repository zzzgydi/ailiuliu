package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/router/controller"
	"github.com/zzzgydi/ailiuliu/router/middleware"
)

func APIRouter(r *gin.Engine) {
	api := r.Group("/api")

	api.Use(middleware.AuthMiddleware())

	api.GET("/model/list", controller.GetModelList)
}
