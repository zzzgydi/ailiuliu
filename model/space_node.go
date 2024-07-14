package model

import (
	"encoding/json"
	"time"

	"github.com/zzzgydi/ailiuliu/common"
)

type SpaceNode struct {
	Id        int             `json:"id" db:"id" gorm:"primary_key;autoIncrement"`
	SpaceId   int             `json:"space_id" db:"space_id" gorm:"index"`
	Data      json.RawMessage `json:"data" db:"data" gorm:"type:json"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt time.Time       `json:"updated_at" db:"updated_at"`
}

func (SpaceNode) TableName() string {
	return "space_node"
}

func CreateSpaceNode(spaceId int, data json.RawMessage) (*SpaceNode, error) {
	spaceNode := &SpaceNode{
		SpaceId:   spaceId,
		Data:      data,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := common.MDB.Create(spaceNode).Error; err != nil {
		return nil, err
	}
	return spaceNode, nil
}

func GetSpaceNode(spaceId, nodeId int) (*SpaceNode, error) {
	node := &SpaceNode{}
	if err := common.MDB.Where("space_id = ? and id = ?", spaceId, nodeId).First(node).Error; err != nil {
		return nil, err
	}
	return node, nil
}

func GetSpaceNodeList(spaceId int) ([]*SpaceNode, error) {
	var nodes []*SpaceNode
	if err := common.MDB.Where("space_id = ?", spaceId).Find(&nodes).Error; err != nil {
		return nil, err
	}
	return nodes, nil
}

func DeleteSpaceNode(spaceId, nodeId int) error {
	return common.MDB.Where("space_id = ? and id = ?", spaceId, nodeId).Delete(&SpaceNode{}).Error
}

func UpdateSpaceNode(spaceId, nodeId int, data json.RawMessage) error {
	node := &SpaceNode{
		Data:      data,
		UpdatedAt: time.Now(),
	}
	return common.MDB.Where("space_id = ? and id = ?", spaceId, nodeId).Updates(node).Error
}

func BatchUpdateSpaceNode(spaceId int, nodes []*SpaceNode) error {
	now := time.Now()
	tx := common.MDB.Begin()
	for _, node := range nodes {
		if node.Id == 0 {
			continue
		}
		node.UpdatedAt = now
		if err := tx.Model(&SpaceNode{}).Where("space_id = ? and id = ?", spaceId, node.Id).
			Omit("id", "space_id", "created_at").Updates(node).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
