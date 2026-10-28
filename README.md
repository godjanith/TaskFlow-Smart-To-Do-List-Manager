# TaskFlow — Smart To-Do List Manager

A modern, professional, and user-friendly task management web application built with **Node.js, Express.js, MongoDB Atlas, and JavaScript**. TaskFlow helps users organize daily activities, manage tasks, track progress, and stay productive through a clean, light-themed interface.

## 📌 Project Overview

TaskFlow is a full-stack web application developed to simplify everyday task management. Users can create tasks, view their task list, update task details, mark tasks as completed, and delete tasks when they are no longer needed.

The application uses MongoDB Atlas to store task information securely in a cloud database and Node.js with Express.js to handle backend operations.

## ✨ Features

- **Create Tasks:** Add new tasks with a title and description.
- **View Tasks:** Display saved tasks in an organized interface.
- **Edit Tasks:** Update existing task information.
- **Delete Tasks:** Remove tasks that are no longer required.
- **Task Status:** Mark tasks as completed or pending.
- **Cloud Database:** Store task data using MongoDB Atlas.
- **Responsive Design:** Use the application on desktop and mobile screens.
- **Light-Themed UI:** Clean colors, modern layouts, and an easy-to-use interface.
- **REST API:** Handle task operations through Express.js routes.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend interactions |
| Node.js | Backend runtime environment |
| Express.js | Server and REST API |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB data modeling |
| dotenv | Environment variable management |
| Nodemon | Automatic server restart during development |

## 📂 Project Structure

```text
TaskFlow/
├── models/
│   └── Task.js
├── routes/
│   └── taskRoutes.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── LICENSE
└── server.js
```

## ⚙️ Prerequisites

Before running TaskFlow, ensure that you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Visual Studio Code](https://code.visualstudio.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A modern web browser

## 🚀 Installation and Setup

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/godjanith/TaskFlow-Smart-To-Do-List-Manager.git
```

Navigate to the project folder:

```bash
cd TaskFlow-Smart-To-Do-List-Manager
```

### 2. Install Dependencies

Run the following command:

```bash
npm install
```

This installs the dependencies listed in `package.json`.

### 3. Configure MongoDB Atlas

1. Sign in to MongoDB Atlas.
2. Create a cluster if you do not already have one.
3. Create a database user with a username and password.
4. Configure Network Access to allow your current IP address.
5. Copy your MongoDB connection string from the Atlas connection options.
6. Replace the placeholder values with your database username, password, and database name as required.

### 4. Configure Environment Variables

Create a `.env` file in the project root directory. Use `.env.example` as a reference if it is provided.

Add your configuration using the variable names expected by `server.js`. For example:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Replace the example connection string with your actual MongoDB Atlas connection string.

**Important:** Never upload your real `.env` file, database password, or other secret credentials to GitHub. Keep `.env` excluded through `.gitignore`.

### 5. Start the Application

For development, run:

```bash
npm run dev
```

If your project does not define a development script, start it using:

```bash
npm start
```

Open the local address shown in your terminal. If the server uses port `5000`, visit:

http://localhost:5000

## 🔄 Application Workflow

1. The user opens the TaskFlow web application.
2. The frontend sends requests to the Express.js backend.
3. The backend processes task operations.
4. Mongoose communicates with MongoDB Atlas.
5. Task information is stored or retrieved from the database.
6. The frontend updates the displayed task list based on the server response.

## 🔐 Security and Best Practices

- Store database credentials in environment variables.
- Do not commit `.env` or other files containing secrets.
- Keep `node_modules/` out of version control.
- Validate incoming task data on the backend.
- Use appropriate error handling for database and API operations.
- Keep third-party packages updated.
- Follow the license terms of all dependencies used in the project.

## 🎯 Project Objectives

- Develop a functional full-stack web application.
- Understand CRUD operations: Create, Read, Update, and Delete.
- Integrate a Node.js backend with MongoDB Atlas.
- Learn REST API development using Express.js.
- Practice frontend and backend integration.
- Build a clean, responsive, and professional user interface.
- Gain practical experience with Git and GitHub.

## 🔮 Future Enhancements

- User registration and authentication
- Task deadlines and reminders
- Task priorities and category filters
- Search, sorting, and filtering
- Dashboard with task statistics
- Dark mode as an optional theme
- Deployment to a cloud hosting platform

## 👨‍💻 Author

**JANITH VC**

Project: TaskFlow — Smart To-Do List Manager

GitHub Repository: [TaskFlow-Smart-To-Do-List-Manager](https://github.com/godjanith/TaskFlow-Smart-To-Do-List-Manager)

## 📄 License & Copyright

Copyright (c) 2026 JANITH VC

All rights reserved.

TaskFlow — Smart To-Do List Manager

The original source code, documentation, and design materials in this repository are protected by applicable copyright laws, except for third-party materials governed by their own licenses.

No license or permission is granted to copy, reproduce, modify, redistribute, publish, or commercially use the original materials in this repository without prior written permission from the copyright holder, except where permitted by applicable law.

This notice does not override the licenses or rights applicable to third-party software, dependencies, or other materials used by this project.

For permission to use the original project materials, contact the copyright holder through the GitHub repository.

THE PROJECT IS PROVIDED "AS IS", WITHOUT WARRANTIES OF ANY KIND, TO THE EXTENT PERMITTED BY APPLICABLE LAW.

See the [LICENSE](./LICENSE) file for the full copyright notice.
