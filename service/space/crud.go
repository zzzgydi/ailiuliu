package space

import (
	"github.com/zzzgydi/ailiuliu/model"
)

func ListUserSpace(userId string, offset, size int) ([]*model.Space, error) {
	return model.GetUserSpaceList(userId, offset, size)
}

func CreateSpace(userId string, name string) (*model.Space, error) {
	if name == "" {
		name = "Untitled"
	}
	return model.CreateSpace(userId, name)
}

func DetailSpace(userId string, spaceId int) (*model.Space, []*model.SpaceNode, error) {
	space, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return nil, nil, err
	}

	nodes, err := model.GetSpaceNodeList(spaceId)
	if err != nil {
		return nil, nil, err
	}

	return space, nodes, nil
}

func DeleteSpace(userId string, spaceId int) error {
	return model.DeleteSpace(userId, spaceId)
}

func UpdateSpaceName(userId string, spaceId int, name string) error {
	if name == "" {
		name = "Untitled"
	}
	return model.UpdateSpace(userId, spaceId, name)
}

func UpdateSpaceData(userId string, spaceId int, nodes []*model.SpaceNode) error {
	// check space ownership
	_, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return err
	}

	return model.BatchUpdateSpaceNode(spaceId, nodes)
}

// space node
func CreateSpaceNode(userId string, spaceId int, data []byte) (*model.SpaceNode, error) {
	_, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return nil, err
	}

	return model.CreateSpaceNode(spaceId, data)
}

func DeleteSpaceNode(userId string, spaceId, nodeId int) error {
	_, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return err
	}

	return model.DeleteSpaceNode(spaceId, nodeId)
}
