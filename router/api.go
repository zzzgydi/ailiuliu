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
}

func AdminAPIRouter(r *gin.Engine) {
	admin := r.Group("/api/admin")

	admin.Use(middleware.LoggerMiddleware, middleware.AuthMiddleware(), middleware.AdminMiddleware())

	admin.GET("/model/list", controller.AdminGetAllModelProvider)
	admin.POST("/model/create", controller.AdminPostModelProvider)
}
