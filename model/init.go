package model

import (
	"log/slog"

	"github.com/spf13/viper"
	"github.com/zzzgydi/ailiuliu/common"
	"github.com/zzzgydi/ailiuliu/common/initializer"
)

func initModel() error {
	if viper.GetBool("DATABASE_AUTO_MIGRATE") {
		return common.MDB.AutoMigrate(
			&User{},
			&Space{},
			&ModelProvider{},
		)
	} else {
		slog.Info("skip auto migrate")
	}
	return nil
}

func init() {
	initializer.Register("migrate", initModel)
}
