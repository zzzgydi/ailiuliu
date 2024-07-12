package model

import (
	"github.com/spf13/viper"
	"github.com/zzzgydi/ailiuliu/common"
	"github.com/zzzgydi/ailiuliu/common/initializer"
)

func initModel() error {
	return common.MDB.AutoMigrate(
		&User{},
		&Space{},
		&ModelProvider{},
	)
}

func init() {
	if viper.GetBool("DATABASE_AUTO_MIGRATE") {
		initializer.Register("migrate", initModel)
	}
}
