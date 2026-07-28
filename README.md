# ✂️ URL Shortener

A fast and minimal URL shortener built with **Node.js**, **Express**, **MongoDB**, and **EJS**. Supports user authentication with JWT-based cookie auth, short ID generation, visit tracking, role-based access control, and a simple web UI.

---

## 🚀 Features

- 🔗 Shorten any long URL into a compact short ID
- 🌐 Web UI to generate and view all shortened URLs
- 📊 Track visit history with timestamps for each short URL
- ⚡ Fast redirects using Express routing
- 🗄️ Persistent storage with MongoDB via Mongoose
- 🔐 User signup & login with JWT cookie auth (`authorization` cookie)
- 🛡️ Protected routes via auth middleware
- 👤 Each user sees only their own shortened URLs
- 🔑 Role-based access control (`NORMAL`, `ADMIN`)
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
| jsonwebtoken | JWT signing & verification |
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
│   └── auth.js         # checkForAuthentication & restrictTo middleware
├── models/
│   ├── url.js          # Mongoose schema & model for URLs
│   └── user.js         # Mongoose schema & model for Users
├── routes/
│   ├── url.js          # URL API routes
│   ├── user.js         # User auth routes
│   └── staticRouter.js # Web UI routes (home, login, signup, admin)
├── services/
│   └── auth.js         # JWT setUser/getUser helpers
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

| Route | Description | Access |
|-------|-------------|--------|
| `GET /` | Home page — shorten URLs & view your URLs | Logged in users |
| `GET /admin/urls` | View all shortened URLs | ADMIN role only |
| `GET /signup` | Signup page | Public |
| `GET /login` | Login page | Public |

---

## 📡 API Reference

### Signup

```http
POST /user/signup
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

Signs a JWT containing `_id`, `email`, and `role`, sets it as an `authorization` cookie. Redirects to `/login?error=...` on failure.

---

### Shorten a URL

```http
POST /url
```

> Requires login (uses `authorization` cookie)

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
  createdBy:    ObjectId,                    // ref to users collection
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
  role:      String,   // 'NORMAL' | 'ADMIN'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Auth Flow

1. User signs up at `/signup` → stored in MongoDB
2. User logs in at `/login` → JWT signed with `{ _id, email, role }` payload, set as `authorization` cookie
3. `checkForAuthentication` — reads `authorization` cookie on every request, verifies JWT, and sets `req.user` if valid
4. `restrictTo(roles)` — redirects to `/login` if not logged in; if a non-empty roles array is provided, also checks `req.user.role`
5. Each shortened URL stores `createdBy: req.user._id` so users only see their own URLs
6. Admin users can view all URLs at `/admin/urls`

---

## 📄 License

This project is licensed under the **ISC License**.
