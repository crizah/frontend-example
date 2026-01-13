package server

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Server struct {
	mongoClient *mongo.Client
	collUsers   *mongo.Collection
	collPass    *mongo.Collection
	collNotes   *mongo.Collection
	ctx         context.Context
}

func InitialiseServer() (*Server, error) {
	// x := os.Getenv("CLIENT_IP")
	// fmt.Print(x)
	uri := os.Getenv("MONGODB_URI")

	clientOptions := options.Client().ApplyURI(uri)

	client, err := mongo.Connect(clientOptions)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := client.Ping(ctx, nil); err != nil {
		return nil, err
	}
	u := client.Database("Intern").Collection("Users")
	p := client.Database("Intern").Collection("Pass")
	n := client.Database("Intern").Collection("Notes")

	return &Server{mongoClient: client, collUsers: u, collPass: p, collNotes: n, ctx: ctx}, nil
}

func (s *Server) Close() error {
	if s.mongoClient != nil {
		return s.mongoClient.Disconnect(context.Background())
	}
	return nil
}

func (s *Server) AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		client_ip := os.Getenv("CLIENT_IP")
		w.Header().Set("Access-Control-Allow-Origin", client_ip)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// get token from cookie
		cookie, err := r.Cookie("access_token")
		if err != nil {
			http.Error(w, "Unauthorized - no token", http.StatusUnauthorized)
			return
		}

		// verify JWT token
		username, err := VerifyJWT(cookie.Value)
		if err != nil {
			http.Error(w, "Unauthorized - invalid token", http.StatusUnauthorized)
			return
		}

		// add username to context
		ctx := context.WithValue(r.Context(), "username", username)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func GenerateJWT(username string) (string, error) {
	claims := jwt.MapClaims{
		"sub": username,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func VerifyJWT(tokenString string) (string, error) {
	secret := os.Getenv("JWT_SECRET")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// expired
		if exp, ok := claims["exp"].(float64); ok {
			if time.Now().Unix() > int64(exp) {
				return "", fmt.Errorf("token expired")
			}
		}

		//get username
		if username, ok := claims["sub"].(string); ok {
			return username, nil
		}
		return "", fmt.Errorf("username not found in token")
	}

	return "", fmt.Errorf("invalid token")
}
