import React from 'react';

export default function Milestones({ milestones = [], onAdd, onRemove, onLabelChange, onValueChange }) {
  return (
    <div>
      <h3>Edit Milestones</h3>
      <button onClick={onAdd}>Add Milestone</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {milestones.map((m) => (
          <li key={m.id} style={{ margin: '8px 0' }}>
            <input
              type="text"
              value={m.label}
              onChange={(e) => onLabelChange(m.id, e.target.value)}
              style={{ marginRight: '8px' }}
            />
            <input
              type="number"
              value={m.value}
              onChange={(e) => onValueChange(m.id, e.target.value)}
              style={{ width: '60px', marginRight: '8px' }}
            />
            <button onClick={() => onRemove(m.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
