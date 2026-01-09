package server

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func (s *Server) PutIntoUsers(username string, email string) error {

	user := bson.M{
		"_id":       username, // PK
		"email":     email,    // GSI equivalent
		"createdAt": time.Now().UTC(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_, err := s.collUsers.InsertOne(ctx, user)
	if err != nil {
		// Duplicate key error (username or email)
		if mongo.IsDuplicateKeyError(err) {
			return errors.New("user already exists")
		}
		return err
	}

	return nil

}

func (s *Server) PutIntoPass(username string, salt string, hashed string) error {

	user := bson.M{
		"_id":    username, // PK
		"salt":   salt,
		"hashed": hashed,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := s.collPass.InsertOne(ctx, user)
	if err != nil {
		// Duplicate key error (username or email)
		if mongo.IsDuplicateKeyError(err) {
			return errors.New("user already exists")
		}
		return err
	}

	return nil

}

func (s *Server) QueryWithEmail(email string) (string, error) {
	var result struct {
		Username string `bson:"_id"`
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err := s.collUsers.
		FindOne(ctx, bson.M{"email": email}).
		Decode(&result)

	if err == mongo.ErrNoDocuments {
		return "", ErrUserNotFound
	}
	if err != nil {
		return "", err
	}

	return result.Username, nil
}

func (s *Server) QueryPasswordTable(username string) (string, string, error) {
	// get salt and hash
	var result struct {
		Salt string `bson:"salt"`
		Hash string `bson:"hashed"`
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := s.collPass.
		FindOne(ctx, bson.M{"_id": username}).
		Decode(&result)
	if err != nil {
		return "", "", err
	}

	return result.Salt, result.Hash, err

}

func (s *Server) GetCreatedAt(username string) (string, error) {
	// get timestamp of when created

	var result struct {
		createdAt time.Time `bson:"createdAt"`
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := s.collPass.
		FindOne(ctx, bson.M{"_id": username}).
		Decode(&result)
	if err != nil {
		return "", err
	}

	return result.createdAt.String(), nil

}

// func (s *Server) EmailExists(email string) (bool, error) {

// 	err := s.collUsers.
// 		FindOne(s.ctx, bson.M{"email": email}).
// 		Err()

// 	if err == mongo.ErrNoDocuments {
// 		return false, nil
// 	}

// 	if err != nil {
// 		return false, err
// 	}

// 	return true, nil
// }
