require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: "20kb" }));

// API routes are registered before the frontend static files.
app.use("/api/tasks", taskRoutes);

// Serve only the public frontend directory.
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Friendly JSON response for unknown API routes.
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

// Handle malformed JSON and unexpected errors without exposing internals.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  }
  console.error("Unexpected server error:", err.message);
  res.status(500).json({ success: false, message: "An unexpected server error occurred." });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Create a .env file using .env.example as a guide.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log("Connected to MongoDB Atlas successfully.");
    app.listen(PORT, () => {
      console.log(`TaskFlow is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB Atlas:", error.message);
    console.error("Check your URI, database user, IP access list, and cluster status.");
    process.exit(1);
  }
}

startServer();