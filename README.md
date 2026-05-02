# 🚀 TaskFlow - Modern Project Management System

<div align="center">

![TaskFlow Logo](https://img.shields.io/badge/TaskFlow-Project%20Manager-6366f1?style=for-the-badge&logo=checkmarx&logoColor=white)

A full-stack MERN (MongoDB, Express.js, React, Node.js) project management application with role-based access control, real-time task tracking, and a modern, beautiful UI.

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**TaskFlow** is a modern, full-featured project management application designed for teams of all sizes. With an intuitive interface, powerful features, and role-based access control, TaskFlow helps teams collaborate effectively and ship projects faster.

### Why TaskFlow?

- ✅ **Beautiful UI** - Modern gradient design with smooth animations
- ✅ **Role-Based Access** - Admin and Member roles with different permissions
- ✅ **Real-Time Updates** - Track project progress in real-time
- ✅ **Task Management** - Create, assign, and track tasks with priorities
- ✅ **Team Collaboration** - Add members to projects and assign tasks
- ✅ **Progress Tracking** - Visual dashboards with statistics and charts
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 📊 Dashboard
- Personalized greeting based on time of day
- Project and task statistics
- Team workload visualization
- Recent tasks overview
- Completion rate tracking

### 📁 Project Management
- Create and manage multiple projects
- Assign team members to projects
- Set project deadlines and status
- Color-coded project indicators
- Progress tracking with visual bars

### ✅ Task Management
- Create tasks with title, description, and details
- Assign tasks to team members
- Set priority levels (Low, Medium, High)
- Set due dates with overdue alerts
- Status tracking (Todo, In Progress, Completed)
- Filter tasks by status and priority

### 👥 Team Management
- Add/remove team members from projects
- View team workload and progress
- User management (Admin only)
- Role assignment and modification

### 🎨 Modern UI/UX
- Gradient backgrounds with animated effects
- Smooth transitions and animations
- Hover effects and micro-interactions
- Loading states with spinners
- Toast notifications for user feedback
- Responsive design for all devices

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Development Tools
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Git** - Version control

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x400/6366f1/ffffff?text=Landing+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=Dashboard)

### Projects
![Projects](https://via.placeholder.com/800x400/6366f1/ffffff?text=Projects)

### Tasks
![Tasks](https://via.placeholder.com/800x400/6366f1/ffffff?text=Tasks)

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd task-manager/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd task-manager/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/taskmanager` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_key_here` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend

The frontend uses Vite's proxy configuration to connect to the backend. No additional environment variables are needed for development.

---

## 📖 Usage

### 1. Register an Account

1. Navigate to `http://localhost:5173`
2. Click "Get Started" or "Register"
3. Fill in your details:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   - Role (Admin or Member)
4. Click "Create Account"

### 2. Login

1. Go to the login page
2. Enter your email and password
3. Click "Sign In"

### 3. Create a Project (Admin Only)

1. Navigate to the Projects page
2. Click "New Project"
3. Fill in project details:
   - Project name
   - Description
   - Status
   - Deadline
   - Team members
4. Click "Create Project"

### 4. Create Tasks (Admin Only)

1. Open a project
2. Click "New Task"
3. Fill in task details:
   - Title
   - Description
   - Priority
   - Due date
   - Assign to team member
4. Click "Create Task"

### 5. Manage Tasks

- **View Tasks**: See all tasks on the Tasks page
- **Filter Tasks**: Use status and priority filters
- **Update Status**: Change task status from the dropdown
- **Edit/Delete**: Use the action buttons (Admin only)

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

#### Create Project (Admin)
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "members": ["userId1", "userId2"],
  "deadline": "2025-12-31",
  "color": "#6366f1"
}
```

#### Get Project by ID
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

#### Update Project (Admin)
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Project (Admin)
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks?status=todo&priority=high
Authorization: Bearer <token>
```

#### Create Task (Admin)
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "project": "projectId",
  "assignedTo": "userId",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task (Admin)
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users (Admin)
```http
GET /api/users
Authorization: Bearer <token>
```

#### Update User Role (Admin)
```http
PUT /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

---

## 📁 Project Structure

```
taskflow/
├── task-manager/
│   ├── backend/
│   │   ├── config/
│   │   │   └── db.js                 # Database configuration
│   │   ├── middleware/
│   │   │   └── auth.js               # Authentication middleware
│   │   ├── models/
│   │   │   ├── User.js               # User model
│   │   │   ├── Project.js            # Project model
│   │   │   └── Task.js               # Task model
│   │   ├── routes/
│   │   │   ├── auth.js               # Auth routes
│   │   │   ├── projects.js           # Project routes
│   │   │   ├── tasks.js              # Task routes
│   │   │   └── users.js              # User routes
│   │   ├── .env.example              # Environment variables template
│   │   ├── package.json              # Backend dependencies
│   │   └── server.js                 # Express server
│   │
│   └── frontend/
│       ├── public/                   # Static files
│       ├── src/
│       │   ├── api/
│       │   │   └── axios.js          # Axios configuration
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── TaskCard.jsx
│       │   ├── context/
│       │   │   └── AuthContext.jsx   # Auth context
│       │   ├── pages/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Landing.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── Projects.jsx
│       │   │   ├── ProjectDetail.jsx
│       │   │   ├── Tasks.jsx
│       │   │   └── Users.jsx
│       │   ├── App.jsx               # Main app component
│       │   ├── main.jsx              # Entry point
│       │   └── index.css             # Global styles
│       ├── index.html
│       ├── package.json              # Frontend dependencies
│       ├── tailwind.config.js        # Tailwind configuration
│       └── vite.config.js            # Vite configuration
│
├── README.md                         # This file
└── UI_IMPROVEMENTS.md                # UI enhancement documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

---

## 🐛 Bug Reports

If you find a bug, please open an issue with:
- A clear title and description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node version)

---

## 💡 Feature Requests

Have an idea? Open an issue with:
- A clear description of the feature
- Why it would be useful
- How it should work
- Any examples or mockups

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Backend framework
- [Vite](https://vitejs.dev/) - Build tool
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

---

## 📞 Support

If you need help or have questions:
- Open an issue on GitHub
- Email: support@taskflow.com
- Documentation: [Wiki](https://github.com/yourusername/taskflow/wiki)

---

## 🗺 Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] File attachments for tasks
- [ ] Task comments and discussions
- [ ] Email notifications
- [ ] Calendar view
- [ ] Gantt chart for project timeline
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Export reports (PDF, CSV)
- [ ] Integration with third-party tools (Slack, GitHub)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by developers, for developers

[Report Bug](https://github.com/yourusername/taskflow/issues) • [Request Feature](https://github.com/yourusername/taskflow/issues)

</div>
