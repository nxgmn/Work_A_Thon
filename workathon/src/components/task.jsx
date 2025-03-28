// src/components/task.jsx
import React from 'react';

const Task = ({ id, name, points, completed, onToggle }) => {
  const handleToggle = () => {
    onToggle(id);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
      <input 
        type="checkbox" 
        checked={completed} 
        onChange={handleToggle} 
        style={{ marginRight: '8px' }}
      />
      <span style={{ marginRight: '8px' }}>
        {name}
      </span>
      <span style={{ fontStyle: 'italic', color: '#666' }}>
        ({points} points)
      </span>
    </div>
  );
};

export default Task;
