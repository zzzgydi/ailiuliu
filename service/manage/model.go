package manage

import "github.com/zzzgydi/ailiuliu/model"

func GetModelList(userId string) ([]*model.ModelProvider, error) {
	models, err := model.GetModelProviderList()
	if err != nil {
		return nil, err
	}

	level := 0
	if user, err := model.GetUserByUserId(userId); err == nil {
		level = user.Level
	}

	retModels := make([]*model.ModelProvider, 0)
	for _, m := range models {
		if m.Level <= level {
			retModels = append(retModels, m)
		}
	}

	return retModels, nil
}
