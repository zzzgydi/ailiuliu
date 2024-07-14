package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/router/controller"
	"github.com/zzzgydi/ailiuliu/router/middleware"
)

func APIRouter(r *gin.Engine) {
	api := r.Group("/api")

	api.Use(middleware.LoggerMiddleware, middleware.AuthMiddleware())

	api.GET("/model/list", controller.GetModelList)

	api.GET("/space/list", controller.ListUserSpace)
	api.GET("/space/detail", controller.DetailSpace)
	api.POST("/space/create", controller.CreateSpace)
	api.POST("/space/delete", controller.DeleteSpace)
	api.POST("/space/update_name", controller.UpdateSpaceName)
	api.POST("/space/update_data", controller.UpdateSpaceData)
	api.POST("/space/create_node", controller.CreateSpaceNode)
}
