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

func DetailSpace(userId string, spaceId int) (*DetailSpaceData, error) {
	space, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return nil, err
	}

	nodes, err := model.GetSpaceNodeList(spaceId)
	if err != nil {
		return nil, err
	}

	return &DetailSpaceData{
		Id:    spaceId,
		Space: space,
		Nodes: nodes,
	}, nil
}

func DeleteSpace(userId string, spaceId int) error {
	return model.DeleteSpace(userId, spaceId)
}

func UpdateSpaceName(userId string, spaceId int, name string) error {
	if name == "" {
		name = "Untitled"
	}
	return model.UpdateSpaceName(userId, spaceId, name)
}

func UpdateSpaceData(userId string, spaceId int, meta []byte, nodes []*model.SpaceNode) error {
	// check space ownership
	_, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return err
	}

	return model.UpdateSpaceData(userId, spaceId, meta, nodes)
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
