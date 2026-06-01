# Full Stack Notes Application

<!-- Tech Stack Badges -->
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)


A modern, feature-rich notes application built with React, Node.js, Express, and MongoDB. Allows users to create, edit, organize, and manage notes with a clean and intuitive interface.

---

## 🚀 Features

- **Authentication** — Register, Login, Email Verification, Forgot/Reset Password
- **Notes Management** — Create, Edit, Delete, Pin notes with a rich text editor
- **Trash System** — Soft delete with 30-day auto-deletion via cron job
- **Search** — Real-time note filtering by title
- **User Profile** — Update name and change password
- **Rich Text Editor** — Full formatting support (bold, italic, headings, lists, alignment etc)
- **JWT Authentication** — Secure token-based auth for all protected routes
- **Email Notifications** — Verification and password reset emails via Nodemailer

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React JS | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router DOM | Client-side Routing |
| Axios | HTTP Requests |
| react-logger-lib | Logging |
| React Quill | Rich Text Editor |
| Vitest | Unit Testing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Nodemailer | Email Service |
| Pino | Logging |
| Node-cron | Scheduled Tasks |
| Mocha & Chai | Unit Testing |

---

## ⚙️ Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `root` folder:


```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_jwt_secret_key
EMAIL=your_email@gmail.com
PASS=your_gmail_app_password
```


Start the backend server:

```bash
# Development
npm run dev
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

---

### 3. Open in Browser

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🧪 Running Tests

### Frontend Tests (Vitest)

```bash
cd frontend

# Run tests
npx vitest run

# Run with verbose output
npx vitest run --reporter=verbose

# Run with coverage
npx vitest run --coverage --reporter=verbose
```

### Backend Tests (Mocha & Chai)

```bash
cd backend

# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

---


## 🔄 Git Workflow

This project follows a structured Git workflow:

```
main
  └── develop (base branch)
        └── feature branches
              └── Pull Requests → develop
```

- All features are developed in separate branches
- Pull Requests are reviewed before merging into `develop`


---


## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Quill](https://github.com/zenoamaro/react-quill)
- [Pino Logger](https://getpino.io/)

