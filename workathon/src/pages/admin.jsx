// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import Milestones from '../components/milestones';
import Settings from '../components/taskSettings';
import Users from '../components/users';

function AdminPage() {
  const [adminMilestones, setAdminMilestones] = useState([]);

  // Fetch milestones on mount
  useEffect(() => {
    fetch('https://work-a-thon.onrender.com/api/milestones')
      .then((res) => res.json())
      .then((data) => setAdminMilestones(data))
      .catch((err) => console.error('Error fetching milestones:', err));
  }, []);

  // Milestone handlers
  const handleAdd = () => {
    const newMilestoneData = { label: 'New Milestone', value: 0 };
    fetch('https://work-a-thon.onrender.com/api/milestones', {
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

  const handleRemove = (id) => {
    fetch(`https://work-a-thon.onrender.com/api/milestones/${id}`, {
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

  const handleLabelChange = (id, newLabel) => {
    const milestone = adminMilestones.find((m) => m.id === id);
    if (!milestone) return;
    const updatedMilestone = { ...milestone, label: newLabel };
    fetch(`https://work-a-thon.onrender.com/api/milestones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMilestone),
    })
      .then((res) => res.json())
      .then((returned) => {
        setAdminMilestones((prev) =>
          prev.map((m) => (m.id === returned.id ? returned : m))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleValueChange = (id, newVal) => {
    const milestone = adminMilestones.find((m) => m.id === id);
    if (!milestone) return;
    const updated = { ...milestone, value: parseInt(newVal, 10) || 0 };
    fetch(`https://work-a-thon.onrender.com/api/milestones/${id}`, {
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

      {/* Settings component for task constraints */}
      <Settings />

      {/* Milestones editor */}
      <Milestones
        milestones={adminMilestones}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onLabelChange={handleLabelChange}
        onValueChange={handleValueChange}
      />

      <hr />

      {/* Users component for controlling group access */}
      <Users />
    </div>
  );
}

export default AdminPage;
