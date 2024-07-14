package llm

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/sashabaranov/go-openai"
	"github.com/spf13/viper"
	"github.com/zzzgydi/ailiuliu/common/initializer"
)

var (
	gptConfig *openai.ClientConfig
)

func initLLM() error {
	apiBase := viper.GetString("LLM_API_BASE")
	apiKey := viper.GetString("LLM_API_KEY")
	apiProxy := viper.GetString("LLM_API_PROXY")

	if apiKey == "" {
		return fmt.Errorf("llm api token is empty")
	}
	config := openai.DefaultConfig(apiKey)
	gptConfig = &config

	if apiBase != "" {
		gptConfig.BaseURL = apiBase
	}

	if apiProxy != "" {
		proxyUrl, err := url.Parse(apiProxy)
		if err != nil {
			return err
		}
		gptConfig.HTTPClient.Transport = &http.Transport{
			Proxy: http.ProxyURL(proxyUrl),
		}
	}
	return nil
}

func init() {
	initializer.Register("llm", initLLM)
}
