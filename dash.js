let tasks = [];

function openModal() {
  document.getElementById("taskModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
  clearForm();
}

function clearForm() {
  document.getElementById("taskName").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("taskDeadline").value = '';
}

function addTaskFromModal() {
  const name = document.getElementById("taskName").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const deadlineStr = document.getElementById("taskDeadline").value;

  if (!name || !deadlineStr) {
    alert("Please enter a task name and deadline.");
    return;
  }

  const deadline = new Date(deadlineStr).toISOString();

  const task = {
    name,
    desc,
    deadline,
    done: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  renderRecommendations();
  closeModal();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem('tasks');
  if (data) {
    tasks = JSON.parse(data);
  }
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const remainingMs = deadlineDate - now;
    const remainingText = remainingMs > 0 ? formatRemainingTime(remainingMs) : "Past Due";

    li.innerHTML = `<strong>${task.name}</strong><br>${task.desc}<br>
      Deadline: ${deadlineDate.toLocaleString()}<br>
      <em>Time Remaining: ${remainingText}</em><br>
      <button class="delete-btn">Delete</button>
      `;

    if (task.done) li.classList.add("done");

    li.onclick = function () {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    };

    li.querySelector(".delete-btn").onclick = function (e) {
        e.stopPropagation();
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        renderRecommendations();
    };
    list.appendChild(li);
  });
}

function formatRemainingTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / 3600) % 24;
  const days = Math.floor(seconds / (3600 * 24));

  return `${days}d ${hours}h ${minutes}m`;
}

// project
let projects = [];

function openProjectModal() {
  document.getElementById("projectModal").style.display = "flex";
}

function closeProjectModal() {
  document.getElementById("projectModal").style.display = "none";
  document.getElementById("projectName").value = '';
  document.getElementById("projectDesc").value = '';
  document.getElementById("projectDeadline").value = '';
}

function addProject() {
  const name = document.getElementById("projectName").value.trim();
  const desc = document.getElementById("projectDesc").value.trim();
  const deadline = document.getElementById("projectDeadline").value;

  if (!name || !deadline) {
    alert("Project must have a name and deadline.");
    return;
  }

  const project = {
    name,
    description: desc,
    deadline,
    tasks: [],
    majorTasks: []
  };

  projects.push(project);
  saveProjects();
  renderProjects();
  closeProjectModal();
}

let currentProjectIndex = null;

function openProjectTaskModal(projectIndex) {
  currentProjectIndex = projectIndex;
  document.getElementById("projTaskName").value = '';
  document.getElementById("projTaskDesc").value = '';
  document.getElementById("projTaskDeadline").value = '';
  document.getElementById("projectTaskModal").style.display = "flex";
}

function closeProjectTaskModal() {
  document.getElementById("projectTaskModal").style.display = "none";
  currentProjectIndex = null;
}

function confirmAddTaskToProject() {
  const name = document.getElementById("projTaskName").value.trim();
  const description = document.getElementById("projTaskDesc").value.trim();
  const deadline = document.getElementById("projTaskDeadline").value;

  if (!name || !deadline) {
    alert("Task must have a name and deadline.");
    return;
  }

  const task = {
    name,
    description,
    deadline: new Date(deadline).toISOString(),
    done: false
  };

  projects[currentProjectIndex].tasks.push(task);
  saveProjects();
  renderProjects();
  renderRecommendations();
  closeProjectTaskModal();
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function loadProjects() {
  const data = localStorage.getItem("projects");
  if (data) {
    projects = JSON.parse(data);
  }
}

function renderProjects() {
  const container = document.getElementById("projectList");
  container.innerHTML = '';

  projects.forEach((proj, index) => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.marginTop = "10px"
    div.style.borderRadius = "12px";
    div.style.backgroundColor = "#FFFFFF"

    const progress = calculateProjectProgress(proj);
    div.innerHTML = `
      <div style="line-height: 1.2; font-size: 14px; margin-bottom: 4px;">
      <h3 style="margin: 0;">${proj.name}</h3>
      <p style="margin: 2px 0;">${proj.description}</p>
      <p style="margin: 2px 0;">Deadline: ${new Date(proj.deadline).toLocaleString()}</p>
      <div style="background:#eee;height:20px;border-radius:5px;overflow:hidden;">
        <div style="width:${progress}%;background:#28965A;height:100%;"></div>
      </div>
      <p style="margin: 2px 0;">Progress: ${progress}%</p>
      <button onclick="openProjectTaskModal(${index})" style="border-radius: 10px;
        border: 1px, groove, #000000; background-color: #FFFFFF;">Add Task</button>
      <button onclick="deleteProject(${index})" style="background:#e74c3c; color:#FFFFFF; margin-top:8px; border-radius: 10px; border:none;">Delete Project</button>
      <ul>
        ${proj.tasks.map((t, ti) => {
          const deadline = new Date(t.deadline);
          const now = new Date();
          const remainingMs = deadline - now;
          const remaining = remainingMs > 0 ? formatRemainingTime(remainingMs) : "Past Due";
          return `
            <li title="${t.description || ''}">
              <input type="checkbox" onchange="toggleTask(${index}, ${ti})" ${t.done ? "checked" : ""}>
              <strong>${t.name}</strong><br>
              <small>Deadline: ${deadline.toLocaleString()} | Time left: ${remaining}</small>
            </li>`;
        }).join("")}
      </ul>
    `;

    container.appendChild(div);
  });
}

//deprecated
// function addTaskToProject(projectIndex) {
//   const name = prompt("Task name:");
//   if (!name) return;

//   const description = prompt("Task description:");
//   const deadline = prompt("Task deadline (YYYY-MM-DDTHH:MM):");

//   const deadlineDate = new Date(deadline);
//   if (isNaN(deadlineDate)) {
//     alert("Invalid deadline.");
//     return;
//   }

//   projects[projectIndex].tasks.push({
//     name,
//     done: false,
//     description,
//     deadline: deadlineDate.toISOString()
//   });

//   saveProjects();
//   renderProjects();
// }


function toggleTask(projectIndex, taskIndex) {
  const task = projects[projectIndex].tasks[taskIndex];
  task.done = !task.done;
  saveProjects();
  renderProjects();
}

function calculateProjectProgress(project) {
  const taskCount = project.tasks.length;
  if (taskCount === 0) return 0;

  const doneCount = project.tasks.filter(t => t.done).length;
  return Math.round((doneCount / taskCount) * 100);
}

function deleteProject(index) {
  if (confirm("Are you sure you want to delete this project?")) {
    projects.splice(index, 1);
    saveProjects();
    renderProjects();
    renderRecommendations();
  }
}

// rec
function getAllTasksWithDeadlines() {
  const now = new Date();
  const taskList = [];

  // Regular tasks
  tasks.forEach(t => {
    if (t.deadline) {
      taskList.push({
        name: t.name,
        description: t.description,
        deadline: new Date(t.deadline),
        from: "Regular Task"
      });
    }
  });

  // Project tasks
  projects.forEach((proj) => {
    proj.tasks.forEach((t) => {
      if (t.deadline) {
        taskList.push({
          name: t.name,
          description: t.description,
          deadline: new Date(t.deadline),
          from: `Project: ${proj.name}`
        });
      }
    });
  });

  return taskList
    .filter(t => t.deadline > now)
    .sort((a, b) => a.deadline - b.deadline);
}

function renderRecommendations() {
  const topTasks = getAllTasksWithDeadlines().slice(0, 3);
  const container = document.getElementById("recommendations");

  container.innerHTML = topTasks.map(task => {
    const timeLeft = formatRemainingTime(task.deadline - new Date());
    return `
      <div title="${task.description || ''}">
        <strong>${task.name}</strong> <small>(${task.from})</small><br>
        <small>Due: ${task.deadline.toLocaleString()} — ${timeLeft}</small>
      </div><hr>`;
  }).join("");
}

function openAllRecommendationsModal() {
  const all = getAllTasksWithDeadlines();
  const container = document.getElementById("allRecommendations");

  container.innerHTML = all.map(task => {
    const timeLeft = formatRemainingTime(task.deadline - new Date());
    return `<li title="${task.description || ''}">
      <strong>${task.name}</strong> <small>(${task.from})</small><br>
      <small>Due: ${task.deadline.toLocaleString()} — ${timeLeft}</small>
    </li>`;
  }).join("");

  document.getElementById("recommendationModal").style.display = "flex";
}

function closeAllRecommendationsModal() {
  document.getElementById("recommendationModal").style.display = "none";
}


// Load on startup
loadTasks();
renderTasks();
loadProjects();
renderProjects();
renderRecommendations();