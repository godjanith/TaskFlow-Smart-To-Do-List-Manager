const taskList = document.getElementById("taskList");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const taskDialog = document.getElementById("taskDialog");
const taskForm = document.getElementById("taskForm");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const formError = document.getElementById("formError");
const titleError = document.getElementById("titleError");

let tasks = [];
let loading = false;
let toastTimer;

const elements = {
  total: document.getElementById("totalStat"),
  pending: document.getElementById("pendingStat"),
  completed: document.getElementById("completedStat"),
  rate: document.getElementById("rateStat"),
  progress: document.getElementById("progressBar"),
  count: document.getElementById("taskCount"),
  search: document.getElementById("searchInput"),
  status: document.getElementById("statusFilter"),
  priority: document.getElementById("priorityFilter"),
  sort: document.getElementById("sortSelect"),
  id: document.getElementById("taskId"),
  title: document.getElementById("titleInput"),
  description: document.getElementById("descriptionInput"),
  priorityInput: document.getElementById("priorityInput"),
  dueDate: document.getElementById("dueDateInput"),
  dialogTitle: document.getElementById("dialogTitle")
};

document.getElementById("todayDate").textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "short", month: "short", day: "numeric"
}).format(new Date());

function showToast(message, isError = false) {
  const region = document.getElementById("toastRegion");
  region.replaceChildren();
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " error" : ""}`;
  toast.textContent = message;
  region.append(toast);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 3200);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "The request could not be completed.");
  }
  return payload;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function dateIsOverdue(value) {
  if (!value) return false;
  const due = new Date(value);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due < today;
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const rate = total ? Math.round((completed / total) * 100) : 0;
  elements.total.textContent = total;
  elements.pending.textContent = pending;
  elements.completed.textContent = completed;
  elements.rate.textContent = rate;
  elements.progress.style.width = `${rate}%`;
}

function getVisibleTasks() {
  const query = elements.search.value.trim().toLocaleLowerCase();
  const status = elements.status.value;
  const priority = elements.priority.value;
  const sort = elements.sort.value;

  const filtered = tasks.filter((task) => {
    const matchesQuery = `${task.title} ${task.description || ""}`.toLocaleLowerCase().includes(query);
    const matchesStatus = status === "all" || (status === "completed" ? task.completed : !task.completed);
    const matchesPriority = priority === "all" || task.priority === priority;
    return matchesQuery && matchesStatus && matchesPriority;
  });

  filtered.sort((a, b) => {
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "dueSoon") {
      if (!a.dueDate && !b.dueDate) return new Date(b.createdAt) - new Date(a.createdAt);
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sort === "priority") {
      const rank = { High: 3, Medium: 2, Low: 1 };
      return rank[b.priority] - rank[a.priority] || new Date(b.createdAt) - new Date(a.createdAt);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  return filtered;
}

function createIconButton(label, symbol, className, callback) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `icon-button${className ? ` ${className}` : ""}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.textContent = symbol;
  button.addEventListener("click", callback);
  return button;
}

function buildTaskRow(task) {
  const row = document.createElement("article");
  row.className = `task-row${task.completed ? " is-completed" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = Boolean(task.completed);
  checkbox.setAttribute("aria-label", `Mark ${task.title} ${task.completed ? "pending" : "completed"}`);
  checkbox.addEventListener("change", () => toggleTask(task._id));

  const main = document.createElement("div");
  main.className = "task-main";
  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;
  main.append(title);

  if (task.description) {
    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description;
    main.append(description);
  }

  const meta = document.createElement("div");
  meta.className = "task-meta";
  const priority = document.createElement("span");
  priority.className = `priority-badge priority-${String(task.priority || "Medium").toLowerCase()}`;
  priority.textContent = `${task.priority || "Medium"} priority`;
  meta.append(priority);

  if (task.dueDate) {
    const due = document.createElement("span");
    due.className = `date-label${!task.completed && dateIsOverdue(task.dueDate) ? " overdue" : ""}`;
    due.textContent = `▦ ${formatDate(task.dueDate)}${!task.completed && dateIsOverdue(task.dueDate) ? " · Overdue" : ""}`;
    meta.append(due);
  }
  if (task.completed) {
    const status = document.createElement("span");
    status.className = "status-label";
    status.textContent = "✓ Completed";
    meta.append(status);
  }
  main.append(meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.append(
    createIconButton("Edit task", "✎", "", () => openEditDialog(task)),
    createIconButton("Delete task", "⌫", "delete", () => deleteTask(task))
  );

  row.append(checkbox, main, actions);
  return row;
}

function renderTasks() {
  updateStats();
  const visible = getVisibleTasks();
  taskList.replaceChildren();
  visible.forEach((task) => taskList.append(buildTaskRow(task)));
  elements.count.textContent = `${visible.length} ${visible.length === 1 ? "task" : "tasks"}`;
  loadingState.hidden = true;
  emptyState.hidden = visible.length > 0;
  if (visible.length === 0) {
    const hasFilters = Boolean(elements.search.value.trim()) ||
      elements.status.value !== "all" || elements.priority.value !== "all";
    emptyTitle.textContent = hasFilters ? "No matching tasks" : "A fresh start";
    emptyText.textContent = hasFilters
      ? "Try another search or change your filters to find what you need."
      : "Your task list is clear. Add a task to get started.";
    document.getElementById("emptyAddBtn").hidden = hasFilters;
  }
}

async function loadTasks() {
  loading = true;
  loadingState.hidden = false;
  emptyState.hidden = true;
  taskList.replaceChildren();
  try {
    const result = await apiRequest("/api/tasks");
    tasks = result.data;
    renderTasks();
  } catch (error) {
    loadingState.hidden = true;
    taskList.replaceChildren();
    emptyState.hidden = false;
    emptyTitle.textContent = "We couldn't load your tasks";
    emptyText.textContent = error.message;
    document.getElementById("emptyAddBtn").hidden = true;
    showToast(error.message, true);
  } finally {
    loading = false;
  }
}

function resetForm() {
  taskForm.reset();
  elements.id.value = "";
  elements.priorityInput.value = "Medium";
  titleError.textContent = "";
  formError.textContent = "";
  saveTaskBtn.disabled = false;
  saveTaskBtn.textContent = "Save task";
}

function openCreateDialog() {
  resetForm();
  elements.dialogTitle.textContent = "Add a new task";
  saveTaskBtn.textContent = "Save task";
  taskDialog.showModal();
  elements.title.focus();
}

function openEditDialog(task) {
  resetForm();
  elements.dialogTitle.textContent = "Edit your task";
  elements.id.value = task._id;
  elements.title.value = task.title;
  elements.description.value = task.description || "";
  elements.priorityInput.value = task.priority || "Medium";
  elements.dueDate.value = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "";
  saveTaskBtn.textContent = "Save changes";
  taskDialog.showModal();
  elements.title.focus();
}

function closeDialog() {
  if (taskDialog.open) taskDialog.close();
}

async function saveTask(event) {
  event.preventDefault();
  titleError.textContent = "";
  formError.textContent = "";
  const title = elements.title.value.trim();
  if (!title) {
    titleError.textContent = "Please enter a task title.";
    elements.title.focus();
    return;
  }
  if (title.length > 120) {
    titleError.textContent = "Keep the title within 120 characters.";
    return;
  }

  const payload = {
    title,
    description: elements.description.value.trim(),
    priority: elements.priorityInput.value,
    dueDate: elements.dueDate.value || null
  };
  const id = elements.id.value;
  saveTaskBtn.disabled = true;
  saveTaskBtn.textContent = id ? "Saving changes..." : "Saving...";

  try {
    const result = await apiRequest(id ? `/api/tasks/${encodeURIComponent(id)}` : "/api/tasks", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    closeDialog();
    showToast(result.message || (id ? "Task updated." : "Task created."));
    await loadTasks();
  } catch (error) {
    formError.textContent = error.message;
  } finally {
    saveTaskBtn.disabled = false;
    saveTaskBtn.textContent = id ? "Save changes" : "Save task";
  }
}

async function toggleTask(id) {
  try {
    const result = await apiRequest(`/api/tasks/${encodeURIComponent(id)}/toggle`, { method: "PATCH" });
    showToast(result.message);
    await loadTasks();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function deleteTask(task) {
  const confirmed = window.confirm(`Delete "${task.title}"? This action cannot be undone.`);
  if (!confirmed) return;
  try {
    const result = await apiRequest(`/api/tasks/${encodeURIComponent(task._id)}`, { method: "DELETE" });
    showToast(result.message);
    await loadTasks();
  } catch (error) {
    showToast(error.message, true);
  }
}

document.getElementById("openCreateBtn").addEventListener("click", openCreateDialog);
document.getElementById("emptyAddBtn").addEventListener("click", openCreateDialog);
document.getElementById("closeDialogBtn").addEventListener("click", closeDialog);
document.getElementById("cancelDialogBtn").addEventListener("click", closeDialog);
taskForm.addEventListener("submit", saveTask);
elements.search.addEventListener("input", renderTasks);
elements.status.addEventListener("change", renderTasks);
elements.priority.addEventListener("change", renderTasks);
elements.sort.addEventListener("change", renderTasks);

taskDialog.addEventListener("click", (event) => {
  if (event.target === taskDialog) closeDialog();
});

loadTasks();