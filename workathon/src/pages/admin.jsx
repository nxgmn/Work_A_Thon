import React, { useState, useEffect } from 'react';
import Milestones from '../components/milestones';
import Settings from '../components/taskSettings';

function AdminPage() {
  const [adminMilestones, setAdminMilestones] = useState([]);

  // Fetch milestones on mount
  useEffect(() => {
    fetch('http://localhost:4000/api/milestones')
      .then((res) => res.json())
      .then((data) => setAdminMilestones(data))
      .catch((err) => console.error('Error fetching milestones:', err));
  }, []);

  // Add a new milestone on the server
  const handleAdd = () => {
    // We want an initial label & value
    const newMilestoneData = { label: 'New Milestone', value: 0 };

    fetch('http://localhost:4000/api/milestones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMilestoneData),
    })
      .then((res) => res.json())
      .then((created) => {
        setAdminMilestones((prev) => [...prev, created]);
      })
      .catch((err) => console.error('Error creating milestone:', err));
  };

  // Remove a milestone
  const handleRemove = (id) => {
    fetch(`http://localhost:4000/api/milestones/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Milestone remove failed');
        }
        setAdminMilestones((prev) => prev.filter((m) => m.id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Update the label
  const handleLabelChange = (id, newLabel) => {
    // find the milestone
    const milestone = adminMilestones.find((m) => m.id === id);
    if (!milestone) return;

    const updatedMilestone = { ...milestone, label: newLabel };

    fetch(`http://localhost:4000/api/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMilestone),
    })
      .then((res) => res.json())
      .then((returned) => {
        // replace in state
        setAdminMilestones((prev) =>
          prev.map((m) => (m.id === returned.id ? returned : m))
        );
      })
      .catch((err) => console.error(err));
  };

  // Update the value
  const handleValueChange = (id, newVal) => {
    const milestone = adminMilestones.find((m) => m.id === id);
    if (!milestone) return;

    const updated = { ...milestone, value: parseInt(newVal, 10) || 0 };
    fetch(`http://localhost:4000/api/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((returned) => {
        setAdminMilestones((prev) =>
          prev.map((m) => (m.id === returned.id ? returned : m))
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>Admin Panel</h1>

    <Settings />

      <Milestones
        milestones={adminMilestones}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onLabelChange={handleLabelChange}
        onValueChange={handleValueChange}
      />
    </div>
  );
}

export default AdminPage;
