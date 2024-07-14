package model

import (
	"time"

	"github.com/zzzgydi/ailiuliu/common"
)

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

func GetChatMessagesByNodeId(nodeId int, offset, size int) ([]*ChatMessage, error) {
	var messages []*ChatMessage
	// reverse order
	err := common.MDB.Where("node_id = ?", nodeId).Order("id desc").Offset(offset).Limit(size).Find(&messages).Error
	return messages, err
}

func CreateChatMessage(nodeId int, role, content string) (*ChatMessage, error) {
	msg := &ChatMessage{
		NodeId:    nodeId,
		Role:      role,
		Content:   content,
		CreatedAt: time.Now(),
	}
	if err := common.MDB.Create(msg).Error; err != nil {
		return nil, err
	}
	return msg, nil
}

func BatchCreateChatMessage(nodeId int, messages []ChatMessage) error {
	for i := range messages {
		messages[i].NodeId = nodeId
		messages[i].CreatedAt = time.Now()
	}
	return common.MDB.Create(messages).Error
}
