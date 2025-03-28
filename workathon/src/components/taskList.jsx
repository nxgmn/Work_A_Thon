// src/components/taskList.jsx
import React, { useState, useEffect } from 'react';
import Task from './task';

const TaskList = ({
  tasks,
  onAddTask,
  onToggleTask,
  onRemoveTask,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskPoints, setTaskPoints] = useState('');

  // Store admin-defined constraints
  const [settings, setSettings] = useState({
    minTaskPoints: 1,
    maxTaskPoints: 50
  });

  // Fetch the admin constraints on mount
  useEffect(() => {
    fetch('http://localhost:4000/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => {
        console.error('Error fetching settings:', err);
        // If fetch fails, we'll just keep default 1..50
      });
  }, []);

  const handleAdd = () => {
    if (!taskName || !taskPoints) {
      alert('Please provide a task name and point value.');
      return;
    }

    // Parse points and clamp to admin settings
    let points = parseInt(taskPoints, 10) || 0;
    if (points < settings.minTaskPoints) {
      points = settings.minTaskPoints;
    } else if (points > settings.maxTaskPoints) {
      points = settings.maxTaskPoints;
    }

    // Now use the clamped value
    onAddTask(taskName, points);

    // Reset fields
    setTaskName('');
    setTaskPoints('');
  };

  return (
    <div>
      <h2>Tasks</h2>
      <h3>Add New Task</h3>

      <div>
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
        <button onClick={handleAdd}>Add Task</button>
      </div>

      {/* Render existing tasks */}
      {tasks.map((task) => (
        <div key={task.id} style={{ marginBottom: '0.5rem' }}>
          <Task
            id={task.id}
            name={task.name}
            points={task.points}
            completed={task.completed}
            onToggle={onToggleTask}
          />
          <button onClick={() => onRemoveTask(task.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
