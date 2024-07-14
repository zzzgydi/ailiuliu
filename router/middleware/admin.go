package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/zzzgydi/ailiuliu/router/utils"
)

func AdminMiddleware() gin.HandlerFunc {
	adminId := viper.GetString("ADMIN_CLERK_USER_ID")

	return func(c *gin.Context) {
		userId := utils.GetContextUserId(c)

		if adminId != "" && userId == adminId {
			c.Next()
			return
		}

		c.AbortWithStatus(401)
	}
}
