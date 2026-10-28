const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();
const priorities = ["Low", "Medium", "High"];

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function validateTaskInput(body, partial = false) {
  const errors = {};
  const allowed = ["title", "description", "priority", "dueDate", "completed"];
  const supplied = Object.keys(body || {});
  if (supplied.some((key) => !allowed.includes(key))) {
    errors.general = "Request contains unsupported fields.";
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "title")) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      errors.title = "A task title is required.";
    } else if (body.title.trim().length > 120) {
      errors.title = "Title must be 120 characters or fewer.";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "description")) {
    if (typeof body.description !== "string" || body.description.trim().length > 1000) {
      errors.description = "Description must be text with at most 1000 characters.";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "priority") &&
      !priorities.includes(body.priority)) {
    errors.priority = "Priority must be Low, Medium, or High.";
  }

  if (Object.prototype.hasOwnProperty.call(body, "dueDate") && body.dueDate !== "" && body.dueDate !== null) {
    if (typeof body.dueDate !== "string" || Number.isNaN(Date.parse(body.dueDate))) {
      errors.dueDate = "Due date must be a valid date.";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "completed") &&
      typeof body.completed !== "boolean") {
    errors.completed = "Completed must be true or false.";
  }

  return errors;
}

function taskPayload(body) {
  const payload = {};
  if (Object.prototype.hasOwnProperty.call(body, "title")) payload.title = body.title.trim();
  if (Object.prototype.hasOwnProperty.call(body, "description")) payload.description = body.description.trim();
  if (Object.prototype.hasOwnProperty.call(body, "priority")) payload.priority = body.priority;
  if (Object.prototype.hasOwnProperty.call(body, "dueDate")) {
    payload.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  }
  if (Object.prototype.hasOwnProperty.call(body, "completed")) payload.completed = body.completed;
  return payload;
}

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error("List tasks failed:", error.message);
    res.status(500).json({ success: false, message: "Could not load tasks." });
  }
});

router.get("/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid task ID." });
  }
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, data: task });
  } catch (error) {
    console.error("Get task failed:", error.message);
    res.status(500).json({ success: false, message: "Could not retrieve this task." });
  }
});

router.post("/", async (req, res) => {
  const errors = validateTaskInput(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, message: "Please check the task details.", errors });
  }
  try {
    const task = await Task.create(taskPayload(req.body));
    res.status(201).json({ success: true, message: "Task created.", data: task });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Please check the task details." });
    }
    console.error("Create task failed:", error.message);
    res.status(500).json({ success: false, message: "Could not create the task." });
  }
});

router.put("/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid task ID." });
  }
  const errors = validateTaskInput(req.body, true);
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, message: "Please check the task details.", errors });
  }
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskPayload(req.body) },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, message: "Task updated.", data: task });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task details." });
    }
    console.error("Update task failed:", error.message);
    res.status(500).json({ success: false, message: "Could not update the task." });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid task ID." });
  }
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, message: "Task status updated.", data: task });
  } catch (error) {
    console.error("Toggle task failed:", error.message);
    res.status(500).json({ success: false, message: "Could not update task status." });
  }
});

router.delete("/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid task ID." });
  }
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, message: "Task deleted." });
  } catch (error) {
    console.error("Delete task failed:", error.message);
    res.status(500).json({ success: false, message: "Could not delete the task." });
  }
});

module.exports = router;