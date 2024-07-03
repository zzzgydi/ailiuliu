package auth

import (
	"errors"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwks"
	"github.com/spf13/viper"
	"github.com/zzzgydi/ailiuliu/common/initializer"
)

var (
	jwksClient *jwks.Client
	jwkStore   *JWKStore
)

func InitAuth() error {
	secretKey := viper.GetString("CLERK_SECRET_KEY")
	if secretKey == "" {
		return errors.New("CLERK_SECRET_KEY is required")
	}

	config := &clerk.ClientConfig{}
	config.Key = clerk.String(secretKey)
	jwksClient = jwks.NewClient(config)

	jwkStore = NewJWKStore()
	return nil
}

func init() {
	initializer.Register("auth", InitAuth)
}
