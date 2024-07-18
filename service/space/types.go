package space

import (
	"github.com/zzzgydi/ailiuliu/model"
)

type DetailSpaceData struct {
	Id    int                `json:"id"`
	Space *model.Space       `json:"space"`
	Nodes []*model.SpaceNode `json:"nodes"`
}
