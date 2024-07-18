package router

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/router/controller"
	"github.com/zzzgydi/ailiuliu/router/middleware"
)

func AdminAPIRouter(r *gin.Engine) {
	admin := r.Group("/api/admin")

	admin.Use(middleware.LoggerMiddleware, middleware.AuthMiddleware(), middleware.AdminMiddleware())

	admin.GET("/model/list", controller.AdminGetAllModelProvider)
	admin.POST("/model/create", controller.AdminCreateModelProvider)
	admin.POST("/model/update", controller.AdminUpdateModelProvider)
	admin.POST("/model/delete", controller.AdminDeleteModelProvider)
}
