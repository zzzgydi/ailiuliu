package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/common"
	"github.com/zzzgydi/ailiuliu/router/utils"
	"github.com/zzzgydi/ailiuliu/service/auth"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken := c.GetHeader("Authorization")
		if accessToken == "" {
			c.AbortWithStatus(401)
			return
		}

		trace := utils.GetTraceLogger(c)
		logger := trace.Logger

		accessToken = strings.TrimPrefix(accessToken, "Bearer ")
		userId, err := auth.GetUserId(c.Request.Context(), accessToken)
		if err != nil {
			logger.Error("auth error", "error", err)
			c.AbortWithStatus(401)
			return
		}

		trace.SetUid(userId)

		c.Set(common.CTX_CURRENT_USER, userId)
		c.Next()
	}
}
