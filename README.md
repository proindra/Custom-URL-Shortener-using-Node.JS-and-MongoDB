# ✂️ URL Shortener

A fast and minimal URL shortener built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Supports user authentication with session-based cookies, short ID generation, visit tracking, and a simple web UI.

---

## 🚀 Features

- 🔗 Shorten any long URL into a compact short ID
- 🌐 Web UI to generate and view all shortened URLs
- 📊 Track visit history with timestamps for each short URL
- ⚡ Fast redirects using Express routing
- 🗄️ Persistent storage with MongoDB via Mongoose
- 🔐 User signup & login with session-based cookie auth
- 🛡️ Protected routes via auth middleware
- 🔄 Auto-restart during development with Nodemon

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express 5 | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| EJS | Server-side templating |
| nanoid | Short ID generation |
| uuid | Session ID generation |
| cookie-parser | Cookie parsing middleware |
| Nodemon | Dev auto-restart |

---

## 📁 Project Structure

```
url/
├── controllers/
│   ├── url.js          # Business logic for URL shortening & analytics
│   └── user.js         # Signup & login handlers
├── middlewares/
│   └── auth.js         # Session-based auth middleware
├── models/
│   ├── url.js          # Mongoose schema & model for URLs
│   └── user.js         # Mongoose schema & model for Users
├── routes/
│   ├── url.js          # URL API routes
│   ├── user.js         # User auth routes
│   └── staticRouter.js # Web UI routes
├── services/
│   └── auth.js         # In-memory session store (setUser/getUser)
├── views/
│   ├── home.ejs        # Home page template
│   ├── login.ejs       # Login page template
│   └── signup.ejs      # Signup page template
├── connect.js          # MongoDB connection helper
├── index.js            # App entry point
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

# Install dependencies
npm install
```

### Run the Server

```bash
npm start
```

Server starts at **http://localhost:7337**

---

## 🌐 Web UI

| Route | Description |
|-------|-------------|
| `GET /` | Home page — shorten URLs & view all |
| `GET /signup` | Signup page |
| `GET /login` | Login page |

---

## 📡 API Reference

### Signup

```http
POST /user
```

**Request Body**
```json
{ "name": "John", "email": "john@example.com", "password": "secret" }
```

---

### Login

```http
POST /user/login
```

**Request Body**
```json
{ "email": "john@example.com", "password": "secret" }
```

Sets a `uid` session cookie on success. Redirects to `/login?error=...` on failure.

---

### Shorten a URL

```http
POST /url
```

**Request Body**
```json
{ "url": "https://www.example.com/some/very/long/url" }
```

---

### Redirect to Original URL

```http
GET /:shortId
```

Redirects to the original URL and records a visit timestamp.

**Example**
```
GET http://localhost:7337/abc12345
→ 302 Redirect to https://www.example.com/some/very/long/url
```

---

### Get Analytics

```http
GET /url/analytics/:shortId
```

**Response**
```json
{
  "totalClicks": 3,
  "analytics": [
    { "timestamp": 1718000000000 },
    { "timestamp": 1718000001000 },
    { "timestamp": 1718000002000 }
  ]
}
```

---

## 🗃️ Database Schema

### URL
```js
{
  shortId:      String,                      // unique short identifier
  redirectURL:  String,                      // original long URL
  visitHistory: [{ timestamp: Number }],     // visit log
  createdAt:    Date,
  updatedAt:    Date
}
```

### User
```js
{
  name:      String,
  email:     String,   // unique
  password:  String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Auth Flow

1. User signs up at `/signup` → stored in MongoDB
2. User logs in at `/login` → session ID generated via `uuid`, stored in memory, set as `uid` cookie
3. Protected routes use `restrictToLoggedinUserOnly` middleware to validate the cookie

---

## 📬 Example Usage with cURL

```bash
# Signup
curl -X POST http://localhost:7337/user \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "password": "secret"}'

# Login
curl -X POST http://localhost:7337/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "secret"}'

# Shorten a URL
curl -X POST http://localhost:7337/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'

# Visit the short URL
curl -L http://localhost:7337/abc12345

# Get analytics
curl http://localhost:7337/url/analytics/abc12345
```

---

## 📄 License

This project is licensed under the **ISC License**.
