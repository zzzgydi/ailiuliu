package main

import (
	"github.com/zzzgydi/ailiuliu/common/config"
	"github.com/zzzgydi/ailiuliu/common/initializer"
	"github.com/zzzgydi/ailiuliu/common/logger"
	"github.com/zzzgydi/ailiuliu/router"
)

func main() {
	env := config.GetEnv()
	rootDir := config.GetRootDir()
	logger.InitLogger(rootDir)
	config.InitConfig(rootDir, env)
	initializer.InitInitializer()
	router.InitHttpServer()
}
