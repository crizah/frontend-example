package main

import (
	"log"
	"net/http"
	"server/internal/server"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	s, err := server.InitialiseServer()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	http.HandleFunc("/signup", s.HandleSignUp) // works
	http.HandleFunc("/login", s.HandleLogin)   // works

	http.HandleFunc("/profile", s.AuthMiddleware(s.HandleGetProfile))
	http.HandleFunc("/logout", s.AuthMiddleware(s.HandleLogout))

	http.HandleFunc("/notes", s.AuthMiddleware(s.HandleNotes))

	log.Println("Server starting on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))

}

// {
//     "username": "a",
//     "email": "shaizah43@gmail.com",
//     "password": "hiiii"
// }
