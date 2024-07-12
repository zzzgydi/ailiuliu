package model

import (
	"time"

	"github.com/zzzgydi/ailiuliu/common"
)

type User struct {
	UserId    string    `json:"user_id" db:"user_id" gorm:"primary_key"`
	Level     int       `json:"level" db:"level"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

func (User) TableName() string {
	return "user"
}

func GetUserByUserId(userId string) (*User, error) {
	var user User
	err := common.MDB.Where("user_id = ?", userId).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
