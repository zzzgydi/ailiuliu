package model

import (
	"encoding/json"
	"time"

	"github.com/zzzgydi/ailiuliu/common"
)

type Space struct {
	Id        int             `json:"id" db:"id" gorm:"primary_key;autoIncrement"`
	UserId    string          `json:"user_id" db:"user_id"`
	Name      string          `json:"name" db:"name"`
	Meta      json.RawMessage `json:"meta" db:"meta" gorm:"type:json"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt time.Time       `json:"updated_at" db:"updated_at"`
}

func (Space) TableName() string {
	return "space"
}

func GetSpaceById(userId string, spaceId int) (*Space, error) {
	space := &Space{}
	if err := common.MDB.Where("id = ? and user_id = ?", spaceId, userId).First(space).Error; err != nil {
		return nil, err
	}
	return space, nil
}

func CreateSpace(userId string, name string) (*Space, error) {
	space := &Space{
		UserId:    userId,
		Name:      name,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := common.MDB.Create(space).Error; err != nil {
		return nil, err
	}
	return space, nil
}

// func UpdateSpace(userId string, spaceId int, space *Space) error {
// 	space.UpdatedAt = time.Now()
// 	return common.MDB.Where("id = ? and user_id = ?", spaceId, userId).
// 		Omit("id", "user_id", "created_at").
// 		Updates(space).Error
// }

func UpdateSpaceMeta(userId string, spaceId int, meta []byte) error {
	return common.MDB.Model(&Space{}).
		Where("id = ? and user_id = ?", spaceId, userId).
		Updates(map[string]any{
			"meta":       meta,
			"updated_at": time.Now(),
		}).Error
}

func UpdateSpaceName(userId string, spaceId int, name string) error {
	return common.MDB.Model(&Space{}).
		Where("id = ? and user_id = ?", spaceId, userId).
		Updates(map[string]any{
			"name":       name,
			"updated_at": time.Now(),
		}).Error
}

func GetUserSpaceList(userId string, offset, size int) ([]*Space, error) {
	var spaces []*Space
	if err := common.MDB.Where("user_id = ?", userId).Offset(offset).Limit(size).Find(&spaces).Error; err != nil {
		return nil, err
	}
	return spaces, nil
}

func DeleteSpace(userId string, spaceId int) error {
	return common.MDB.Where("id = ? and user_id = ?", spaceId, userId).Delete(&Space{}).Error
}
