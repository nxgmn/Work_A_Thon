// src/components/task.jsx
import React from 'react';
import './task.css'; // Import CSS

const Task = ({ id, name, points, completed, onToggle }) => {
  const handleToggle = () => {
    onToggle(id);
  };

  return (
    <div className="task-item">
      <input 
        type="checkbox" 
        checked={completed} 
        onChange={handleToggle} 
      />
      <span>{name}</span>
      <span className="italic">({points} points)</span>
    </div>
  );
};

export default Task;
