package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/common"
	"github.com/zzzgydi/ailiuliu/common/logger"
)

func LoggerMiddleware(c *gin.Context) {
	trace := logger.NewTraceLogger(c)
	trace.SetIp(c.ClientIP())
	c.Set(common.CTX_TRACE_LOGGER, trace)
	c.Header("X-Trace-Id", trace.RequestId)
	c.Next()
	trace.Write()
}
