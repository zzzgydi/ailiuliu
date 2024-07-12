package model

import (
	"time"

	"github.com/zzzgydi/ailiuliu/common"
)

type ModelProvider struct {
	ID        int       `json:"id" db:"id" gorm:"primary_key;autoIncrement"`
	Label     string    `json:"label" db:"label"`
	Provider  string    `json:"provider" db:"provider"`
	Value     string    `json:"value" db:"value"`
	Level     int       `json:"level" db:"level"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

func (ModelProvider) TableName() string {
	return "model_provider"
}

func GetModelProviderList() ([]*ModelProvider, error) {
	var modelProvider []*ModelProvider
	err := common.MDB.Find(&modelProvider).Error
	if err != nil {
		return nil, err
	}
	return modelProvider, nil
}