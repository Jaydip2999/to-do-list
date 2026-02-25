const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

const STORAGE_KEY = "simple_todo_tasks";
let tasks = [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

function createTaskElement(task, index) {
  const item = document.createElement("li");
  item.className = "task-item";
  item.style.setProperty("--stagger", `${Math.min(index, 8) * 60}ms`);

  const left = document.createElement("div");
  left.className = "task-left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;
  if (task.completed) {
    text.classList.add("completed");
  }

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
  });

  left.appendChild(checkbox);
  left.appendChild(text);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";
  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  item.appendChild(left);
  item.appendChild(deleteButton);

  return item;
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "No tasks yet. Add one and start your flow.";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task, index) => {
    const taskElement = createTaskElement(task, index);
    taskList.appendChild(taskElement);
  });
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

loadTasks();
renderTasks();
