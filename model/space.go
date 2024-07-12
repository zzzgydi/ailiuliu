package model

import "time"

type Space struct {
	Id        int       `json:"id" db:"id" gorm:"primary_key;autoIncrement"`
	UserId    string    `json:"user_id" db:"user_id"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

func (Space) TableName() string {
	return "space"
}
