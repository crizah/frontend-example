package main

import (
	"log"
	"net/http"
	"os"
	"server/internal/server"
)

func main() {
	uri := os.Getenv("MONGODB_URI")
	s, err := server.InitialiseServer(uri)
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	http.HandleFunc("/signup", s.HandleSignUp)
	http.HandleFunc("/login", s.HandleLogin)

	http.HandleFunc("/profile", s.AuthMiddleware(s.HandleGetProfile))
	http.HandleFunc("/logout", s.AuthMiddleware(s.HandleLogout))

	log.Println("Server starting on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))

}

// {
//     "username": "a",
//     "email": "shaizah43@gmail.com",
//     "password": "hiiii"
// }
