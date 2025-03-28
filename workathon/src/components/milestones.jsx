import React from 'react';

export default function Milestones({
  milestones,
  onAdd,
  onDelete,
  onValueChange,
  onLabelChange
}) {
  return (
    <div>
      <h3>Edit Milestones</h3>
      <button onClick={onAdd}>Add Milestone</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {milestones.map((milestone) => (
          <li key={milestone.id} style={{ margin: '8px 0' }}>
            <input
              type="number"
              value={milestone.value}
              onChange={(e) => onValueChange(milestone.id, e.target.value)}
              style={{ width: '60px', marginRight: '8px' }}
            />
            <input
              type="text"
              value={milestone.label}
              onChange={(e) => onLabelChange(milestone.id, e.target.value)}
              style={{ marginRight: '8px' }}
            />
            <button onClick={() => onDelete(milestone.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
