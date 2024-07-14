package controller

type CreateModelProviderRequest struct {
	Label    string `json:"label" binding:"required"`
	Provider string `json:"provider" binding:"required"`
	Value    string `json:"value" binding:"required"`
	Level    int    `json:"level"`
}
