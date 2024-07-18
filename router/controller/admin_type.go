package controller

type CreateModelProviderRequest struct {
	Label    string `json:"label" binding:"required"`
	Provider string `json:"provider" binding:"required"`
	Value    string `json:"value" binding:"required"`
	Level    int    `json:"level"`
}

type UpdateModelProviderRequest struct {
	Id       int    `json:"id" binding:"required"`
	Label    string `json:"label" binding:"required"`
	Provider string `json:"provider" binding:"required"`
	Value    string `json:"value" binding:"required"`
	Level    int    `json:"level"`
}
