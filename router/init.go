package router

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zzzgydi/ailiuliu/common/config"
	L "github.com/zzzgydi/ailiuliu/common/logger"
)

func InitHttpServer() {
	r := gin.New()
	r.Use(gin.Recovery())

	// register routers
	RootRouter(r)
	HealthRouter(r)

	logger := slog.NewLogLogger(L.Handler, slog.LevelError)
	srv := &http.Server{
		Addr:     ":" + strconv.FormatInt(int64(config.AppConf.HttpPort), 10),
		Handler:  r,
		ErrorLog: logger,
	}
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		panic(err)
	}
}
