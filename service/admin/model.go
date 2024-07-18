package admin

import "github.com/zzzgydi/ailiuliu/model"

// get all model providers
func GetModelProviderList() ([]*model.ModelProvider, error) {
	return model.GetModelProviderList()
}

// create a model provider
func CreateModelProvier(mp *model.ModelProvider) (*model.ModelProvider, error) {
	if mp.Level < 0 {
		mp.Level = 0
	}
	return mp, model.CreateModelProvider(mp)
}

// update a model provider
func UpdateModelProvider(mp *model.ModelProvider) (*model.ModelProvider, error) {
	if mp.Level < 0 {
		mp.Level = 0
	}
	return mp, model.UpdateModelProvider(mp)
}

// delete a model provider
func DeleteModelProvider(id int) error {
	return model.DeleteModelProvider(id)
}
