import React, { useState, useEffect } from 'react';
import Task from './task';

const TaskList = ({ tasks, setTasks }) => {
  // Local state for form inputs
  const [taskName, setTaskName] = useState('');
  const [taskPoints, setTaskPoints] = useState('');

  // Toggle a task’s completed status, as before
  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map((t) => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    // Optionally do a PUT request to server here to persist the toggle
  };

  // 1) Handle adding a new task
  const handleAddTask = () => {
    // Basic validation
    if (!taskName || !taskPoints) {
      alert('Please provide a task name and point value.');
      return;
    }

    const newTaskData = {
      name: taskName,
      points: parseInt(taskPoints, 10),
      completed: false,
    };

    // POST to the server
    fetch('http://localhost:4000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTaskData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((createdTask) => {
        // Update local state so new task appears
        setTasks((prev) => [...prev, createdTask]);
        // Reset the form fields
        setTaskName('');
        setTaskPoints('');
      })
      .catch((err) => console.error('Error creating task:', err));
  };
  /**
   * "Remove" a task from the active list:
   * - If NOT completed, truly remove it from the array
   * - If completed, set archived: true but keep it in the array
   */
  const handleRemoveTask = (taskId) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        // If task is completed, set archived = true
        if (t.completed) {
          return { ...t, archived: true };
        } 
        // Otherwise, we can skip it so it's truly removed
        // (we won't include it in the next map)
        return null;
      }
      return t;
    }).filter(Boolean); // filter out any null items (the truly removed tasks)

    setTasks(updatedTasks);
  };

  return (
    <div>
      <h2>Tasks</h2>

      <h3>add new: </h3>
      {/* Simple form for adding a task */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Task name..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={{ marginRight: '8px' }}
        />
        <input
          type="number"
          placeholder="Points..."
          value={taskPoints}
          onChange={(e) => setTaskPoints(e.target.value)}
          style={{ marginRight: '8px' }}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Render existing tasks */}
      {tasks
        .filter((task) => !task.archived)
        .map((task) => (
          <div key={task.id} style={{ marginBottom: '0.5rem' }}>
            <Task
              id={task.id}
              name={task.name}
              points={task.points}
              completed={task.completed}
              onToggle={handleToggleTask}
            />
            <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
          </div>
        ))
      }
    </div>
  );
};

export default TaskList;
