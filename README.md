# TaskFlow — Smart To-Do List Manager

A modern, responsive task management web application built with **Node.js, Express.js, MongoDB Atlas, HTML, CSS, and JavaScript**. TaskFlow helps you organize daily activities, prioritize important work, track completion, and stay productive through a clean, intuitive interface.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-Framework-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas">
  <img src="https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

---

## Overview

TaskFlow is a full-stack web application designed to make everyday task management simple and efficient. Users can create tasks, set priorities and due dates, update existing tasks, track completion, and organize their workload using search, filters, and sorting.

The application stores task records in MongoDB Atlas through a Node.js and Express.js backend, ensuring that saved tasks remain available after a page refresh.

## Features

- **Create Tasks:** Add tasks with a title, description, priority, and optional due date.
- **Edit Tasks:** Update task details whenever plans change.
- **Delete Tasks:** Remove tasks with a confirmation prompt.
- **Track Progress:** Mark tasks as completed or reopen them as pending.
- **Search Tasks:** Find tasks using their titles or descriptions.
- **Filter Tasks:** Filter by completion status and priority.
- **Sort Tasks:** Organize tasks by creation date, due date, or priority.
- **Live Statistics:** View total tasks, pending tasks, completed tasks, and completion percentage.
- **Responsive Interface:** Use the application on desktop, laptop, tablet, and mobile screens.
- **Light UI Design:** Enjoy a clean interface with soft colors, clear typography, and subtle visual effects.
- **Database Persistence:** Store tasks in MongoDB Atlas rather than relying on browser storage.
- **Input Validation:** Validate task data on the frontend and backend.
- **Error Handling:** Display understandable messages when operations fail.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Responsive layout and visual design |
| JavaScript | Frontend interactions and API requests |
| Node.js | JavaScript runtime for the backend |
| Express.js | REST API and server-side routing |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB schema definition and database operations |
| dotenv | Environment variable management |
| Helmet | HTTP security headers |
| Nodemon | Automatic server restart during development |
| Fetch API | Communication between frontend and backend |

## Application Architecture

```text
                USER
                  |
                  v
        HTML + CSS + JavaScript
                  |
               Fetch API
                  |
                  v
          Node.js + Express
                  |
             REST API Routes
                  |
                  v
              Mongoose
                  |
                  v
            MongoDB Atlas
```

The frontend sends HTTP requests to the Express API. The backend validates the incoming data and uses Mongoose to perform database operations. The API returns JSON responses, and the frontend updates the task list and statistics accordingly.

## Project Structure

```text
TaskFlow/
├── models/
│   └── Task.js
├── routes/
│   └── taskRoutes.js
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

**Note:** The `.env` file is created locally during setup and must not be committed to GitHub.

## Getting Started

Follow these instructions to run TaskFlow on your local machine.

### Prerequisites

Install the following:

- [Node.js and npm](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- A modern web browser

Verify your Node.js and npm installations:

```bash
node --version
npm --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/godjanith/TaskFlow-Smart-To-Do-List-Manager.git
```

Navigate into the project directory:

```bash
cd TaskFlow-Smart-To-Do-List-Manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure MongoDB Atlas

1. Sign in to MongoDB Atlas and create a database deployment if you do not already have one.
2. Create a database user with a strong password.
3. Add your current public IP address under **Network Access**.
4. Open your deployment and select **Connect → Drivers**.
5. Copy the connection string for Node.js.
6. Replace the username, password, and cluster placeholders with your own values.
7. Specify `taskflow` as the database name in the connection string.

### 4. Configure Environment Variables

Create a `.env` file in the project root. You can copy the example file in PowerShell:

```powershell
Copy-Item .env.example .env
```

Add your configuration:

```env
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_DB_USERNAME:YOUR_DB_PASSWORD@YOUR_CLUSTER_URL/taskflow?retryWrites=true&w=majority
```

Replace the example connection string with the one generated by your MongoDB Atlas account.

**Security guidelines:**

- Never commit `.env` to GitHub.
- Never place database credentials in frontend files.
- URL-encode reserved characters in your database password when required.
- Keep `.env.example` limited to placeholders.
- Do not share your connection string publicly.

### 5. Start the Application

Start the development server:

```bash
npm run dev
```

Alternatively, start the application without Nodemon:

```bash
npm start
```

When startup succeeds, the terminal should report a successful MongoDB Atlas connection and display the local server address.

### 6. Open TaskFlow

Visit the following address in your browser:

**http://localhost:3000**

You can now create and manage tasks through the dashboard.

## REST API Documentation

All endpoints use the `/api/tasks` base path and return JSON responses.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks/:id` | Retrieve a specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion status |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Check API and database status |

### Example: Create a Task

**Request**

```http
POST /api/tasks
Content-Type: application/json
```

**Request body**

```json
{
  "title": "Complete project documentation",
  "description": "Prepare the mini-project report",
  "priority": "High",
  "dueDate": "2026-11-10"
}
```

The backend validates the input, saves the task in MongoDB Atlas, and returns the created record.

### Task Data Model

Each task contains the following fields:

| Field | Type | Description |
|---|---|---|
| `title` | String | Required task title |
| `description` | String | Optional task description |
| `priority` | String | Low, Medium, or High |
| `dueDate` | Date | Optional due date |
| `completed` | Boolean | Completion status |
| `createdAt` | Date | Record creation timestamp |
| `updatedAt` | Date | Last update timestamp |

## Testing Checklist

Use this checklist to verify the application after setup:

- [ ] MongoDB Atlas connection succeeds.
- [ ] The dashboard loads successfully.
- [ ] A task can be created with a valid title.
- [ ] Empty titles are rejected.
- [ ] Task details can be edited.
- [ ] Tasks can be deleted after confirmation.
- [ ] Completion status can be toggled.
- [ ] Search works for titles and descriptions.
- [ ] Status and priority filters work together.
- [ ] Sorting options work correctly.
- [ ] Statistics update after task changes.
- [ ] Tasks remain saved after refreshing the browser.
- [ ] The interface works on smaller screens.
- [ ] Invalid API requests return appropriate error responses.

## Troubleshooting

**MongoDB connection fails**

Check your connection string, database username and password, IP access list, database permissions, and cluster status.

**`node` or `npm` is not recognized**

Install Node.js, restart your terminal, and verify the installation using `node --version` and `npm --version`.

**Port 3000 is already in use**

Change the `PORT` value in `.env` to another available port, such as `3001`, then restart the application.

**Tasks are not saved**

Check the terminal output and browser developer tools for API errors. Confirm that MongoDB Atlas is connected and the database user has appropriate permissions.

## Security and Limitations

- TaskFlow uses server-side validation and safe DOM rendering for task content.
- Environment variables are used for database configuration.
- Helmet provides HTTP security headers.
- The current version does not implement user registration or authentication.
- Tasks are shared within the application and are not separated into private user accounts.
- MongoDB Atlas access requires a network connection.

This project is intended as a learning and college mini-project. Additional authentication, authorization, deployment hardening, and monitoring would be required for a production application.

## Future Enhancements

- User registration and secure login
- Private, user-specific task lists
- Email and push notifications
- Recurring tasks and reminders
- Calendar-based task management
- Dark/light theme selection
- Task analytics and productivity reports
- Cloud deployment and automated testing

## Learning Outcomes

This project demonstrates practical experience with:

- Full-stack web application development
- REST API design and integration
- CRUD operations
- MongoDB data modelling with Mongoose
- Environment configuration and credential management
- Responsive UI development
- Input validation and error handling
- Git and GitHub version control

## Author

**TaskFlow — Smart To-Do List Manager**

Developed as a full-stack web development mini-project using Node.js, Express.js, and MongoDB Atlas.

## License

This project is available for educational and personal learning purposes. Add a `LICENSE` file to the repository if you want to distribute it under a specific open-source license.

---

<p align="center">
  <strong>Plan your day. Prioritize your goals. Make progress with TaskFlow.</strong>
</p>