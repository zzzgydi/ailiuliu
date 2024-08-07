package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/common"
)

func GetContextUserId(c *gin.Context) string {
	user, _ := c.Get(common.CTX_CURRENT_USER)
	if user != nil {
		if u, ok := user.(string); ok {
			return u
		}
	}
	return ""
}
