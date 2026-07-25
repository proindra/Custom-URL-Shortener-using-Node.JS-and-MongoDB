# ✂️ URL Shortener

A fast and minimal URL shortener REST API built with **Node.js**, **Express**, and **MongoDB**. Generate short IDs for long URLs and track visit history — all in a lightweight backend service.

---

## 🚀 Features

- 🔗 Shorten any long URL into a compact short ID
- 📊 Track visit history with timestamps for each short URL
- ⚡ Fast redirects using Express routing
- 🗄️ Persistent storage with MongoDB via Mongoose
- 🔄 Auto-restart during development with Nodemon

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express 5 | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| nanoid | Short ID generation |
| Nodemon | Dev auto-restart |

---

## 📁 Project Structure

```
url/
├── controllers/
│   └── url.js          # Business logic for URL shortening
├── models/
│   └── users.js        # Mongoose schema & model
├── routes/
│   └── url.js          # Express route definitions
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

## 📡 API Reference

### Shorten a URL

```http
POST /url
```

**Request Body**
```json
{
  "url": "https://www.example.com/some/very/long/url"
}
```

**Response**
```json
{
  "Id": "abc12345"
}
```

---

### Redirect to Original URL

```http
GET /:shortId
```

Redirects the browser to the original URL and records a visit timestamp.

**Example**
```
GET http://localhost:7337/abc12345
→ 302 Redirect to https://www.example.com/some/very/long/url
```

---

## 🗃️ Database Schema

```js
{
  shortId:      String,   // unique short identifier
  redirectURL:  String,   // original long URL
  visitHistory: [{ timestamp: Number }],  // visit log
  createdAt:    Date,     // auto-managed by Mongoose
  updatedAt:    Date      // auto-managed by Mongoose
}
```

---

## 📬 Example Usage with cURL

```bash
# Shorten a URL
curl -X POST http://localhost:7337/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'

# Visit the short URL
curl -L http://localhost:7337/abc12345
```

---

## 📄 License

This project is licensed under the **ISC License**.
