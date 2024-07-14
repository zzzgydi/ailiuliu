package space

import "github.com/zzzgydi/ailiuliu/model"

func GetChatHistory(userId string, spaceId, nodeId, offset, size int) (interface{}, error) {
	// check access
	_, err := model.GetSpaceById(userId, spaceId)
	if err != nil {
		return nil, err
	}
	// check access
	_, err = model.GetSpaceNode(spaceId, nodeId)
	if err != nil {
		return nil, err
	}

	return model.GetChatMessagesByNodeId(nodeId, offset, size)
}
