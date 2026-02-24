# 🐛 Squash -- QA & Bug Tracking Platform

Squash is a full-stack bug tracking and project management platform
designed for modern QA workflows.\
It allows teams to create projects, track defects, analyze status
distribution, and optionally link GitHub repositories to surface live
repository data directly inside the dashboard.

Built as part of a full-stack software engineering curriculum, Squash
demonstrates scalable architecture patterns, JWT authentication, modular
API design, and external API integration.

---

## 🚀 Features

### 🔐 Authentication

- JWT-based authentication
- Protected dashboard routes
- Persistent sessions via localStorage
- Secure backend route protection

### 📁 Projects

- Create and manage projects
- Update project metadata
- Link GitHub repositories (`owner/repo` format)

### 🐞 Bugs / Defects

- Create bugs tied to specific projects
- Status workflow: `open`, `in_progress`, `resolved`, `closed`
- Priority levels: `low`, `medium`, `high`, `critical`
- Real-time dashboard statistics

### 📊 Dashboard Analytics

- Bug counts by status
- Bug counts by priority
- Open vs resolved metrics
- Recent activity tracking

### 🐙 GitHub Integration (Optional per project)

- Fetch repository metadata (stars, forks, open issues count)
- Display top 10 open issues
- Direct links to GitHub issue pages
- Inline loading and error handling

---

## 🏗 Architecture Overview

### Frontend

- React (Vite)
- React Router
- Context-based authentication
- Modular loading states (global + scoped)
- BEM-style CSS architecture

### Backend

- Node.js
- Express
- MongoDB (Mongoose)
- JWT authentication middleware
- Modular route structure

### External API

- GitHub REST API
- Repository + Issues endpoints

---

## 🔄 Data Flow

### Initial Boot

Frontend → Express API → MongoDB

1.  User logs in\
2.  JWT is stored\
3.  Projects + bugs fetched in parallel\
4.  Global preloader displays during boot

### GitHub Integration

Frontend → GitHub REST API

1.  Project contains `repoFullName`\
2.  GitHub repository + issues fetched\
3.  Inline preloader shows only in GitHub panel\
4.  Errors handled gracefully without breaking dashboard

---

## 🧠 Loading Strategy

Squash uses a layered loading model:

### 1️⃣ Global Boot Loader

- Triggers during initial workspace load\
- Prevents dashboard flicker\
- Fullscreen preloader

### 2️⃣ Scoped Component Loaders

- Used for GitHub integration\
- Inline loader within GitHub card\
- Does not block entire interface

---

## ⚙️ Installation

### 1️⃣ Clone Repository

git clone `<your-repo-url>`{=html}\
cd squash

### 2️⃣ Install Dependencies

Frontend:

npm install

Backend:

cd backend\
npm install

### 3️⃣ Environment Variables

Backend `.env`:

PORT=3001\
JWT_SECRET=your_secret_key\
MONGO_URI=your_mongodb_connection

Frontend `.env`:

VITE_API_BASE_URL=http://localhost:3001

### 4️⃣ Run Locally

Backend:

npm run dev

Frontend:

npm run dev

---

## 🧪 Example GitHub Integration

To link a repo:

1.  Open a project\
2.  Click "Link Repository"\
3.  Enter:

facebook/react

GitHub data will appear inside the project overview.

---

## 🔒 Security Considerations

- JWT verification middleware protects backend routes\
- ProtectedRoute guards frontend dashboard access\
- GitHub integration is read-only and does not require OAuth

---

## 📈 Future Improvements

- Role-based permissions\
- Real-time updates (WebSockets)\
- GitHub OAuth integration\
- Pull request tracking\
- Team member management\
- CI pipeline linking\
- Performance optimizations (React Query / SWR)

---

## 👨‍💻 Author

Built by Romain Duffard\
Software Engineering Student & QA Professional

---

## 📌 Notes

This project was built as part of a full-stack engineering curriculum
but designed with scalable SaaS architecture in mind.
