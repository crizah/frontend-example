
# React Dashboard with JWT Authentication & CRUD Functionality

This project is a full-stack web application featuring a React frontend and a lightweight backend (Go in this implementation, but easily replaceable with Node.js/Express or Python). It demonstrates user authentication using JWT, protected routes, and CRUD operations on a sample entity (Notes).  

The project is designed with **scalability, security, and responsiveness** in mind.

---



## Frontend
- Built with **React.js** and **TailwindCSS** for responsive UI
- Responsive with Tailwind  
- **Protected routes**: Only logged-in users can access dashboard  
- JWT token stored in **localStorage** for frontend-managed authentication  
- **Dashboard** with CRUD operations for Notes  
- Logout functionality

  
### Pages
- **Login / Signup** with email/username and password  
- **Dashboard** with:
  - Display of user profile  
  - Add, update, delete, and view notes  
  - Logout  

### Libraries Used
- `axios` for API calls  
- `react-router-dom` for routing  
- `TailwindCSS` for styling  

## Backend
- Lightweight backend using **Go** (can be adapted to Node.js/Express or Python)  
- **JWT-based authentication** for secure login  
- Passwords hashed with argon2  
- REST APIs for:
  - User signup/login  
  - Profile fetching/updating  
  - CRUD operations on notes  
- Connected to **MongoDB** for persistence  
- Middleware for **auth validation** and CORS handling

### CRUD Operations
- `/notes` (GET, POST)  
- `/notes/:id` (PUT, DELETE)  

### Security & Scalability
- Passwords are hashed before storage , hashed with a salt
- hashed with argon2
- password compared using a cryptographically safe method to prevent time based attacks

- Error handling for validation and server errors (if username or email already exists while signup, checking if user exists before anything)
- When a user trying to login and they dont exist, return credentials incorrect to prevent attacks
  
- JWT middleware to protect endpoints   
- Token issued on login and stored in cookies
- Protected routes require valid JWT token  
- Middleware verifies token and adds `username` to request context  


## DB
- Uses MongoDb for database
- URI connectes to cluster and the database has 3 collections
### Users schema
  ``` 
  {
  "_id": crizah,
  "email": "123@gmail.com",
  "created_at": ISODate("2024-01-09T10:30:00Z")
  }
  ```

 ### Passwords schema
  ``` 
  {
  "_id": crizah,
  "salt": "4XTWLXe1SBlJFnj2XsqAsg",
  "hash": "U5H2wl09zw1GTwVnTJ8/7EKE7GbGtEZZReOgFBl3LZA"
  }
```

 ### Notes schema (for CRUD)
 ```
{
  "_id": {
    "$oid": "6961303e9caf51df2eede100"
  },
  "username": "c",
  "text": "hello",
  "createdAt": {
    "$date": "2026-01-09T16:43:42.451Z"
  }
}
 
```
  
 

---

## Getting Started

### Prerequisites

* Node.js >= 18 (for frontend)
* Go >= 1.20 (for backend) or Node.js/Express alternative
* MongoDB

### Frontend Setup

```bash
cd web
npm install
npm start
```

### Backend Setup (Go)

```bash
cd server
go run ./cmd/server/main.go
```

* Backend runs on `http://localhost:8081`
* Frontend runs on `http://localhost:3000`

---

## API Endpoints

### Authentication

| Method | Endpoint | Body                                                                                  | Description             |
| ------ | -------- | ------------------------------------------------------------------------------------- | ----------------------- |
| POST   | /signup  | `{ "username": "...", "password": "...", "email": "..." }`                            | Register new user       |
| POST   | /login   | `{ "username": "...", "password": "..." }` or `{ "email": "...", "password": "..." }` | Login user, returns JWT |
| GET    | /logout  | N/A                                                                                   | Logout user             |
| GET    | /profile | N/A                                                                                   | Get user info           |

### Notes (CRUD)

| Method | Endpoint   | Body                | Description            |
| ------ | ---------- | ------------------- | ---------------------- |
| GET    | /notes     | N/A                 | Get all notes for user |
| POST   | /notes     | `{ "text": "..." }` | Create a new note      |
| PUT    | /notes/:id | `{ "text": "..." }` | Update a note by ID    |
| DELETE | /notes/:id | N/A                 | Delete a note by ID    |

---

## Scaling for Production

- nginx for Frontend Serving
nginx handles static files more efficiently than Node.js. Its a lightweigh. In production, nginx can handle thousands of concurrent connections while using less memory than application servers.

- Docker Containerization
Ensures that the application runs perfectly on every machine as it containerises the exaact requirments to run the app. Also supports orchestratioin if we want to make this into a microservice architecture

- HTTPS
In production, password communication should be done via https to ensure middle aware attack wont leak infomration

- Caching
Frequently accessed data (user profiles, common queries) can be cached. This reduces database load and response times from 50-100ms down to <5ms.

- Rate Limiting
Prevents abuse and ensures fair resource allocation. Without it, a single user or bot can overwhelm your server with requests, causing downtime for legitimate users.
---
