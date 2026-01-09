package server

import (
	"encoding/json"
	"errors"
	"net/http"
	"sync"
)

var ErrUserNotFound = errors.New("user does not exist")

func (s *Server) HandleSignUp(w http.ResponseWriter, r *http.Request) {
	// user gives username, email and password
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	type result struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var res result

	// get the response here

	err := json.NewDecoder(r.Body).Decode(&res)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if res.Username == "" || res.Email == "" || res.Password == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// generates hashed password

	salt, hash, err := HashPassword(res.Password)
	if err != nil {
		http.Error(w, "error hashing pass", http.StatusInternalServerError)
		return
	}

	// stores user info in USER table and password in PASS table

	var wg sync.WaitGroup

	ch := make(chan error, 2)

	wg.Add(2)

	go func() {
		defer wg.Done()
		ch <- s.PutIntoPass(res.Username, salt, hash)

	}()

	go func() {
		defer wg.Done()
		ch <- s.PutIntoUsers(res.Username, res.Email)

	}()

	wg.Wait()
	close(ch)
	for msg := range ch {
		if msg != nil {
			http.Error(w, msg.Error(), http.StatusInternalServerError)
			return

		}
	}

	// signed up
	// send response of successful sign up and verification link
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Account created successfully",
	})

}

func (s *Server) HandleLogin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// gets the data
	if r.Method != http.MethodPost {
		http.Error(w, "not allowed", http.StatusMethodNotAllowed)
		return
	}

	// log in using email OR username
	if r.Method != http.MethodPost {
		http.Error(w, "not allowed", http.StatusMethodNotAllowed)
		return
	}

	type result struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var res result

	// put result into res

	err := json.NewDecoder(r.Body).Decode(&res)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if (res.Email == "" && res.Username == "") || res.Password == "" {
		// !u and !e
		http.Error(w, "Username/email and password required", http.StatusBadRequest)
		return
	}

	var ch bool
	if res.Username != "" {
		// check username given
		ch = true
		// u and e
		// u and !e
	} else {

		// !check email given
		ch = false
	}

	// if email given, get username
	username := ""
	if !ch {
		// checks if user exists, if not, say username or password incorrect
		u, err := s.QueryWithEmail(res.Email)
		if err != nil {
			if errors.Is(err, ErrUserNotFound) {
				http.Error(w, "username or password incorrect", http.StatusUnauthorized)
				return

			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return

		}

		username = u

	} else {
		username = res.Username
	}

	// get salt and hash from PASS table
	salt, hash, err := s.QueryPasswordTable(username)

	if err != nil {
		http.Error(w, "error querying passwords table", http.StatusInternalServerError)
		return
	}

	// verify password
	verified, err := VerifyPass(res.Password, salt, hash)
	if err != nil {
		http.Error(w, "error verifying password", http.StatusInternalServerError)
		return
	}

	if !verified {
		http.Error(w, "username or password incorrect", http.StatusUnauthorized)
		return
	}

	// generate jwt

	token, err := GenerateJWT(username)

	// set as cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true, // HTTPS in prod
		SameSite: http.SameSiteLaxMode,
		MaxAge:   86400,
	})

	// send success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "Login successful",
		"username": username,
	})

}

func (s *Server) HandleLogout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	// clear the cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1, // delete cookie
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Logged out successfully"})
}

func (s *Server) HandleGetProfile(w http.ResponseWriter, r *http.Request) {
	username := r.Context().Value("username").(string)

	// get user createdAT (any data really)
	user, err := s.GetCreatedAt(username)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
