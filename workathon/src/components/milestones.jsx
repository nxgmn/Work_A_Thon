import React, { useState, useEffect } from 'react';

export default function Milestones() {
  const [milestones, setMilestones] = useState([]);

  // 1) Load milestones from the server when component mounts
  useEffect(() => {
    fetch('http://localhost:4000/api/milestones')
      .then((res) => res.json())
      .then((data) => setMilestones(data))
      .catch((err) => console.error('Error fetching milestones:', err));
  }, []);

  // 2) Add a new milestone: POST /api/milestones
  const handleAddMilestone = () => {
    const newMilestone = { value: 0, label: 'New Reward' };

    fetch('http://localhost:4000/api/milestones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMilestone),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((createdMilestone) => {
        // Server returns the newly created milestone (with an ID)
        setMilestones((prev) => [...prev, createdMilestone]);
      })
      .catch((err) => console.error('Error creating milestone:', err));
  };

  // 3) Remove a milestone: DELETE /api/milestones/:id
  const handleRemoveMilestone = (id) => {
    fetch(`http://localhost:4000/api/milestones/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        // If successful, remove it from local state
        setMilestones((prev) => prev.filter((m) => m.id !== id));
      })
      .catch((err) => console.error('Error deleting milestone:', err));
  };

  // 4) Update milestone value via PUT /api/milestones/:id
  const handleValueChange = (id, newValue) => {
    // Find the milestone in local state
    const milestoneToUpdate = milestones.find((m) => m.id === id);
    if (!milestoneToUpdate) return;

    const updatedMilestone = {
      ...milestoneToUpdate,
      value: parseInt(newValue, 10) || 0,
    };

    fetch(`http://localhost:4000/api/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMilestone),
    })
      .then((res) => res.json())
      .then((returnedMilestone) => {
        // Replace the old milestone in state with the updated version
        setMilestones((prev) =>
          prev.map((m) => (m.id === returnedMilestone.id ? returnedMilestone : m))
        );
      })
      .catch((err) => console.error('Error updating milestone:', err));
  };

  // 5) Update milestone label via PUT /api/milestones/:id
  const handleLabelChange = (id, newLabel) => {
    const milestoneToUpdate = milestones.find((m) => m.id === id);
    if (!milestoneToUpdate) return;

    const updatedMilestone = {
      ...milestoneToUpdate,
      label: newLabel,
    };

    fetch(`http://localhost:4000/api/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMilestone),
    })
      .then((res) => res.json())
      .then((returnedMilestone) => {
        setMilestones((prev) =>
          prev.map((m) => (m.id === returnedMilestone.id ? returnedMilestone : m))
        );
      })
      .catch((err) => console.error('Error updating milestone:', err));
  };

  return (
    <div>
      <h3>Edit Milestones</h3>
      <button onClick={handleAddMilestone}>Add Milestone</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {milestones.map((milestone) => (
          <li key={milestone.id} style={{ margin: '8px 0' }}>
            <input
              type="number"
              value={milestone.value}
              onChange={(e) => handleValueChange(milestone.id, e.target.value)}
              style={{ width: '60px', marginRight: '8px' }}
            />
            <input
              type="text"
              value={milestone.label}
              onChange={(e) => handleLabelChange(milestone.id, e.target.value)}
              style={{ marginRight: '8px' }}
            />
            <button onClick={() => handleRemoveMilestone(milestone.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
