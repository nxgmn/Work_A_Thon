// server/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Paths to your JSON files
const TASKS_FILE = path.join(__dirname, './data/tasks.json');
const MILESTONES_FILE = path.join(__dirname, './data/milestones.json');

// --- Tasks Helpers ---
function readTasksFromFile() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
}

function writeTasksToFile(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks file:', error);
  }
}

// --- Milestones Helpers ---
function readMilestonesFromFile() {
  try {
    const data = fs.readFileSync(MILESTONES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading milestones file:', error);
    return [];
  }
}

function writeMilestonesToFile(milestones) {
  try {
    fs.writeFileSync(MILESTONES_FILE, JSON.stringify(milestones, null, 2));
  } catch (error) {
    console.error('Error writing milestones file:', error);
  }
}

/* 
  ===============================
  TASKS ROUTES
  ===============================
*/

// GET all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = readTasksFromFile();
  res.json(tasks);
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const { name, points } = req.body;

  if (!name || points == null) {
    return res.status(400).json({ error: 'Task must have a name and point value.' });
  }

  const tasks = readTasksFromFile();
  const newTask = {
    id: Date.now(),
    name,
    points,
    completed: false
  };

  tasks.push(newTask);
  writeTasksToFile(tasks);

  res.status(201).json(newTask);
});

// PUT (update) a task by ID
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { name, points, completed } = req.body;

  let tasks = readTasksFromFile();
  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks[index] = {
    ...tasks[index],
    name: name ?? tasks[index].name,
    points: points ?? tasks[index].points,
    completed: completed ?? tasks[index].completed
  };

  writeTasksToFile(tasks);
  res.json(tasks[index]);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  let tasks = readTasksFromFile();
  const updatedTasks = tasks.filter(t => t.id !== taskId);

  if (updatedTasks.length === tasks.length) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  writeTasksToFile(updatedTasks);
  res.json({ message: `Task ${taskId} deleted.` });
});

/* 
  ===============================
  MILESTONES ROUTES
  ===============================
*/

// GET all milestones
app.get('/api/milestones', (req, res) => {
  const milestones = readMilestonesFromFile();
  res.json(milestones);
});

// POST a new milestone
app.post('/api/milestones', (req, res) => {
  const { value, label } = req.body;

  if (value == null || !label) {
    return res.status(400).json({ error: 'Milestone must have a value and a label.' });
  }

  const milestones = readMilestonesFromFile();
  const newMilestone = {
    id: Date.now(),
    value,
    label
  };

  milestones.push(newMilestone);
  writeMilestonesToFile(milestones);

  res.status(201).json(newMilestone);
});

// PUT (update) a milestone by ID
app.put('/api/milestones/:id', (req, res) => {
  const milestoneId = parseInt(req.params.id, 10);
  const { value, label } = req.body;

  let milestones = readMilestonesFromFile();
  const index = milestones.findIndex((m) => m.id === milestoneId);

  if (index === -1) {
    return res.status(404).json({ error: 'Milestone not found.' });
  }

  milestones[index] = {
    ...milestones[index],
    value: value ?? milestones[index].value,
    label: label ?? milestones[index].label
  };

  writeMilestonesToFile(milestones);
  res.json(milestones[index]);
});

// DELETE a milestone
app.delete('/api/milestones/:id', (req, res) => {
  const milestoneId = parseInt(req.params.id, 10);

  let milestones = readMilestonesFromFile();
  const updated = milestones.filter(m => m.id !== milestoneId);

  if (updated.length === milestones.length) {
    return res.status(404).json({ error: 'Milestone not found.' });
  }

  writeMilestonesToFile(updated);
  res.json({ message: `Milestone ${milestoneId} deleted.` });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
