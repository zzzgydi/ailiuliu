package auth

import (
	"context"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

func GetUserId(ctx context.Context, sessionToken string) (string, error) {
	jwk := jwkStore.GetJWK()
	if jwk == nil {
		unsafeClaims, err := jwt.Decode(ctx, &jwt.DecodeParams{
			Token: sessionToken,
		})
		if err != nil {
			return "", err
		}

		// Fetch the JSON Web Key
		jwk, err = jwt.GetJSONWebKey(ctx, &jwt.GetJSONWebKeyParams{
			KeyID:      unsafeClaims.KeyID,
			JWKSClient: jwksClient,
		})
		if err != nil {
			return "", err
		}

		jwkStore.SetJWK(jwk)
	}

	// Verify the session
	claims, err := jwt.Verify(ctx, &jwt.VerifyParams{
		Token: sessionToken,
		JWK:   jwk,
	})
	if err != nil {
		return "", err
	}

	return claims.Subject, nil
}

func GetUser(ctx context.Context, userId string) (*clerk.User, error) {
	return user.Get(ctx, userId)
}
