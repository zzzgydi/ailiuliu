package model

import "time"

type ChatMessage struct {
	Id        int       `json:"id" db:"id" gorm:"primary_key;autoIncrement"`
	NodeId    int       `json:"node_id" db:"node_id" gorm:"index"` // space node id
	Role      string    `json:"role" db:"role"`
	Content   string    `json:"content" db:"content"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

func (ChatMessage) TableName() string {
	return "chat_message"
}
