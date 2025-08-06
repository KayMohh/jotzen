# 📝 Jotzen – The Zen of Note-Taking

> _Jot it. Zen out._  
> A lightweight, RESTful API for creating, storing, and syncing notes — built with **Node.js**, **Express**, and **MongoDB**.  
> Jotzen is designed for speed, simplicity, and soul.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Overview

**Jotzen** helps developers build clean, fast note-taking apps — like your own Google Keep — without reinventing the backend.  
Whether you're building a personal journal, a task manager, or a mobile app, **Jotzen** handles the notes so you can focus on the experience.

### Features

- ✅ RESTful API
- ✅ JWT Authentication
- ✅ CRUD Operations (Create, Read, Update, Delete)
- ✅ Search & Filter Notes
- ✅ Lightweight & Scalable
- ✅ Built with Zen in mind 🧘

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Environment**: dotenv
- **Deployment Ready**: Works with Docker, Heroku, Vercel, or any Node host

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/jotzen.git
cd jotzen
```

> ⚠️ Replace `your-username` with your actual GitHub username.

---

Let me know if you'd like to add sections like **API Endpoints**, **Environment Variables**, **Project Structure**, or **Deployment Instructions**.

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the server

```bash
npm run dev
```

> Server runs on `http://localhost:5000`

---

## 🌐 API Endpoints

| Method | Route                 | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | `/api/notes`          | Create a new note       |
| GET    | `/api/notes`          | Get all notes           |
| GET    | `/api/notes/:id`      | Get a single note by ID |
| PUT    | `/api/notes/:id`      | Update a note           |
| DELETE | `/api/notes/:id`      | Delete a note           |
| POST   | `/api/users/register` | Register a new user     |
| POST   | `/api/users/login`    | Login and get JWT token |

---

## 📎 Example Request

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Morning Thoughts",
    "body": "Build something that matters.",
    "pinned": true
  }'
```

---

<!-- ## 📷 Preview (Optional)

> _Add a screenshot of your API in Postman or Swagger later!_ -->

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, docs, or new features:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🧘 Stay Zen

> _“The quieter you become, the more you can hear.”_  
> – Jotzen believes in simplicity, clarity, and the power of a single thought.

Made with ❤️ and focus.
