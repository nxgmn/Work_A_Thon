import React from 'react';

/**
 * Represents a single task with:
 *  - name: string
 *  - points: number
 *  - completed: boolean
 *  - onToggle: function to call when the task is toggled
 */
const Task = ({ 
  id, 
  name, 
  points, 
  completed, 
  onToggle 
}) => {
  
  const handleToggle = () => {
    // When the checkbox is clicked, call the parent's callback
    // so it can update the 'completed' status and points
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
