package auth

import (
	"sync"

	"github.com/clerk/clerk-sdk-go/v2"
)

type JWKStore struct {
	jwk   *clerk.JSONWebKey
	mutex sync.RWMutex
}

func NewJWKStore() *JWKStore {
	return &JWKStore{}
}

func (s *JWKStore) GetJWK() *clerk.JSONWebKey {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.jwk
}

func (s *JWKStore) SetJWK(jwk *clerk.JSONWebKey) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.jwk = jwk
}
