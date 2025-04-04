// Select elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks on page load
renderTasks();
setInterval(updateTimeAgo, 60000); // Update "time ago" every minute

// Function to render tasks
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = "<li class='no-task'>No tasks</li>";
    return;
  }

  // Sort tasks by date (latest first)
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  tasks.forEach((taskObj, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const span = document.createElement('span');
    span.innerHTML = `<strong>${taskObj.text}</strong><br>
                      <small class="time-ago" data-time="${taskObj.createdAt}">
                      Added: ${new Date(taskObj.createdAt).toLocaleString()} (${getTimeAgo(taskObj.createdAt)})</small>`;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit');
    editBtn.addEventListener('click', () => editTask(index));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => deleteTask(index));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  saveTasks();
}

// Function to add a new task
function addTask(e) {
  e.preventDefault();
  const newTaskText = taskInput.value.trim();
  if (newTaskText) {
    tasks.push({ text: newTaskText, createdAt: new Date().toISOString() });
    taskInput.value = '';
    renderTasks();
  }
}

// Function to edit a task
function editTask(index) {
  const updatedText = prompt('Edit task:', tasks[index].text);
  if (updatedText !== null && updatedText.trim() !== '') {
    tasks[index].text = updatedText.trim();
    renderTasks();
  }
}

// Function to delete a task
function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to calculate "time ago"
function getTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Function to update "time ago" dynamically
function updateTimeAgo() {
  document.querySelectorAll('.time-ago').forEach(el => {
    const timestamp = el.getAttribute('data-time');
    el.innerHTML = `Added: ${new Date(timestamp).toLocaleString()} (${getTimeAgo(timestamp)})`;
  });
}

// Event listener for adding a task
taskForm.addEventListener('submit', addTask);
