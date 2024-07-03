package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/common"
	"github.com/zzzgydi/ailiuliu/common/logger"
)

func GetTraceLogger(c *gin.Context) *logger.TraceLogger {
	if trace, ok := c.Get(common.CTX_TRACE_LOGGER); ok {
		if trace, ok := trace.(*logger.TraceLogger); ok {
			return trace
		}
	}

	trace := logger.NewTraceLogger(c)
	trace.SetIp(c.ClientIP())
	c.Set(common.CTX_TRACE_LOGGER, trace)

	return trace
}
