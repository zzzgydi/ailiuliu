package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwks"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/clerk/clerk-sdk-go/v2/user"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", publicRoute)

	// Initialize storage for JSON Web Keys. You can cache/store
	// the key for as long as it's valid, and pass it to jwt.Verify.
	// This way jwt.Verify won't make requests to the Clerk
	// Backend API to refetch the JSON Web Key.
	// Make sure you refetch the JSON Web Key whenever your
	// Clerk secret key changes.
	jwkStore := NewJWKStore()

	config := &clerk.ClientConfig{}
	config.Key = clerk.String("sk_test_xxx")
	jwksClient := jwks.NewClient(config)
	mux.HandleFunc("/protected", protectedRoute(jwksClient, jwkStore))

	http.ListenAndServe(":3000", mux)
}

func publicRoute(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"access": "public"}`))
}

func protectedRoute(jwksClient *jwks.Client, store JWKStore) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get the session JWT from the Authorization header
		sessionToken := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")

		// Attempt to get the JSON Web Key from your store.
		jwk := store.GetJWK()
		if jwk == nil {
			// Decode the session JWT so that we can find the key ID.
			unsafeClaims, err := jwt.Decode(r.Context(), &jwt.DecodeParams{
				Token: sessionToken,
			})
			if err != nil {
				// handle the error
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte(`{"access": "unauthorized"}`))
				return
			}

			// Fetch the JSON Web Key
			jwk, err = jwt.GetJSONWebKey(r.Context(), &jwt.GetJSONWebKeyParams{
				KeyID:      unsafeClaims.KeyID,
				JWKSClient: jwksClient,
			})
			if err != nil {
				// handle the error
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte(`{"access": "unauthorized"}`))
				return
			}
		}
		// Write the JSON Web Key to your store, so that next time
		// you can use the cached value.
		store.SetJWK(jwk)

		// Verify the session
		claims, err := jwt.Verify(r.Context(), &jwt.VerifyParams{
			Token: sessionToken,
			JWK:   jwk,
		})
		if err != nil {
			// handle the error
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized"}`))
			return
		}

		usr, err := user.Get(r.Context(), claims.Subject)
		if err != nil {
			// handle the error
		}
		fmt.Fprintf(w, `{"user_id": "%s", "user_banned": "%t"}`, usr.ID, usr.Banned)
	}
}

// Sample interface for JSON Web Key storage.
// Implementation may vary.
type JWKStore interface {
	GetJWK() *clerk.JSONWebKey
	SetJWK(*clerk.JSONWebKey)
}

func NewJWKStore() JWKStore {
	// Implementation may vary. This can be an
	// in-memory store, database, caching layer,...
	return nil
}
