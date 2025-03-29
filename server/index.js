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
const SETTINGS_FILE = path.join(__dirname, './data/settings.json');
const USERS_FILE = path.join(__dirname, './data/users.json');


// ========== Helper Functions ==========

// --- Users Helpers ---
function readUsersFromFile() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

function writeUsersToFile(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
}


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

// --- Settings Helpers ---
function readSettingsFromFile() {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings file:', error);
    return { minTaskPoints: 1, maxTaskPoints: 50 };
  }
}

function writeSettingsToFile(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error writing settings file:', error);
  }
}

// ========== TASK ROUTES ==========

/**
 * Return the ENTIRE list of tasks (across all users).
 * Useful for the global progress bar or admin overview.
 */
app.get('/api/tasks', (req, res) => {
  const tasks = readTasksFromFile();
  res.json(tasks);
});

/* 
  USER-SPECIFIC TASKS
  /api/users/:userId/tasks
*/

// GET /api/users/:userId/tasks
app.get('/api/users/:userId/tasks', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  let tasks = readTasksFromFile();

  // Filter tasks that belong to this user
  const userTasks = tasks.filter((t) => t.userId === userId);
  res.json(userTasks);
});

// POST /api/users/:userId/tasks
app.post('/api/users/:userId/tasks', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { name, points } = req.body;

  // 1) Check constraints from settings
  const { minTaskPoints, maxTaskPoints } = readSettingsFromFile();
  if (points < minTaskPoints || points > maxTaskPoints) {
    return res
      .status(400)
      .json({
        error: `Task points must be between ${minTaskPoints} and ${maxTaskPoints}.`
      });
  }

  // 2) Create the new task
  let tasks = readTasksFromFile();
  const newTask = {
    id: Date.now(),
    name,
    points,
    completed: false,
    userId
  };

  tasks.push(newTask);
  writeTasksToFile(tasks);
  res.status(201).json(newTask);
});

// PUT /api/users/:userId/tasks/:taskId
// (could be toggling completion, changing points, etc.)
app.put('/api/users/:userId/tasks/:taskId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const taskId = parseInt(req.params.taskId, 10);
  const { name, points, completed } = req.body;

  let tasks = readTasksFromFile();
  const index = tasks.findIndex((t) => t.id === taskId && t.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found for this user.' });
  }

  // Check constraints if points is updated
  if (points != null) {
    const { minTaskPoints, maxTaskPoints } = readSettingsFromFile();
    if (points < minTaskPoints || points > maxTaskPoints) {
      return res
        .status(400)
        .json({
          error: `Task points must be between ${minTaskPoints} and ${maxTaskPoints}.`
        });
    }
  }

  const updatedTask = {
    ...tasks[index],
    name: name ?? tasks[index].name,
    points: points ?? tasks[index].points,
    completed: completed ?? tasks[index].completed
  };

  tasks[index] = updatedTask;
  writeTasksToFile(tasks);
  res.json(updatedTask);
});

// DELETE /api/users/:userId/tasks/:taskId
app.delete('/api/users/:userId/tasks/:taskId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const taskId = parseInt(req.params.taskId, 10);

  let tasks = readTasksFromFile();
  const filtered = tasks.filter(
    (t) => !(t.id === taskId && t.userId === userId)
  );

  if (filtered.length === tasks.length) {
    return res
      .status(404)
      .json({ error: 'Task not found or not for this user.' });
  }

  writeTasksToFile(filtered);
  res.json({ message: 'Task deleted' });
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
    return res
      .status(400)
      .json({ error: 'Milestone must have a value and a label.' });
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
  const updated = milestones.filter((m) => m.id !== milestoneId);

  if (updated.length === milestones.length) {
    return res.status(404).json({ error: 'Milestone not found.' });
  }

  writeMilestonesToFile(updated);
  res.json({ message: `Milestone ${milestoneId} deleted.` });
});

/*
  ===============================
  SETTINGS ROUTES
  ===============================
*/

// GET /api/settings - read current constraints
app.get('/api/settings', (req, res) => {
  const settings = readSettingsFromFile();
  res.json(settings);
});

// PUT /api/settings - update constraints
app.put('/api/settings', (req, res) => {
  const { minTaskPoints, maxTaskPoints } = req.body;
  const current = readSettingsFromFile();

  // Update only if provided
  const updated = {
    ...current,
    minTaskPoints: minTaskPoints ?? current.minTaskPoints,
    maxTaskPoints: maxTaskPoints ?? current.maxTaskPoints
  };

  writeSettingsToFile(updated);
  res.json(updated);
});

// Example route to calculate total from existing tasks
app.get('/api/points/total', (req, res) => {
    const tasks = readTasksFromFile(); // read tasks.json or whatever you do
    const total = tasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.points, 0);
  
    res.json({ totalCompletedPoints: total });
  });
  

/* 
  ===============================
  USERS ROUTES
  ===============================
*/

// GET all users
app.get('/api/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

// POST a new user
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'User must have a name.' });
  }
  
  // Read current users
  let users = readUsersFromFile();

  // Determine new user's ID
  // Option 1: Use auto-increment by finding the max existing id
  let newId = 1;
  if (users.length > 0) {
    newId = Math.max(...users.map(u => u.id)) + 1;
  }
  // Alternatively, you could use Date.now()

  const newUser = {
    id: newId,
    name
  };

  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json(newUser);
});

// DELETE a user by id
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  let users = readUsersFromFile();
  const filtered = users.filter(u => u.id !== userId);

  if (filtered.length === users.length) {
    return res.status(404).json({ error: 'User not found.' });
  }

  writeUsersToFile(filtered);
  res.json({ message: `User ${userId} deleted.` });
});


// In your index.js (server)
app.get('/api/users/getUserId', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required.' });
  }
  // Perform a case-insensitive search
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  const users = JSON.parse(data);
  const user = users.find(u => u.name.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ id: user.id });
});


/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
