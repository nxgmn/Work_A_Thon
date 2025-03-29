// src/components/taskList.jsx
import React, { useState, useEffect } from 'react';
import Task from './task';
import './taskList.css'; // Import CSS

const TaskList = ({
  tasks,
  onAddTask,
  onToggleTask,
  onRemoveTask,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskPoints, setTaskPoints] = useState('');

  const [settings, setSettings] = useState({
    minTaskPoints: 1,
    maxTaskPoints: 50,
  });

  useEffect(() => {
    fetch('https://work-a-thon.onrender.com/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => {
        console.error('Error fetching settings:', err);
      });
  }, []);

  const handleAdd = () => {
    if (!taskName || !taskPoints) {
      alert('Please provide a task name and point value.');
      return;
    }

    let points = parseInt(taskPoints, 10) || 0;
    if (points < settings.minTaskPoints) {
      points = settings.minTaskPoints;
    } else if (points > settings.maxTaskPoints) {
      points = settings.maxTaskPoints;
    }

    onAddTask(taskName, points);
    setTaskName('');
    setTaskPoints('');
  };

  return (
    <div className="task-list-container">
      <h2>Your Tasks</h2>

      <div>
        <input
          type="text"
          placeholder="Task name..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Points..."
          value={taskPoints}
          onChange={(e) => setTaskPoints(e.target.value)}
        />
        <button onClick={handleAdd}>Add Task</button>
      </div>

      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <Task
            id={task.id}
            name={task.name}
            points={task.points}
            completed={task.completed}
            onToggle={onToggleTask}
          />
          <button onClick={() => onRemoveTask(task.id)} className="remove-btn">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
