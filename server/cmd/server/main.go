package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"server/internal/server"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	s, err := server.InitialiseServer()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}
	x := os.Getenv("WITH_INGRESS")

	http.HandleFunc(fmt.Sprintf("%s/signup", x), s.HandleSignUp) // works
	http.HandleFunc(fmt.Sprintf("%s/login", x), s.HandleLogin)   // works

	http.HandleFunc(fmt.Sprintf("%s/profile", x), s.AuthMiddleware(s.HandleGetProfile))
	http.HandleFunc(fmt.Sprintf("%s/logout", x), s.AuthMiddleware(s.HandleLogout))

	http.HandleFunc(fmt.Sprintf("%s/notes", x), s.AuthMiddleware(s.HandleNotes))

	log.Println("Server starting on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))

}

// {
//     "username": "a",
//     "email": "shaizah43@gmail.com",
//     "password": "hiiii"
// }
