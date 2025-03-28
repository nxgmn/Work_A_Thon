import React, { useState, useEffect } from 'react';
import ProgressBar from './components/progressBar';
import Milestones from './components/milestones';
import TaskList from './components/taskList';
import './App.css';

function App() {
  const [milestones, setMilestones] = useState([]);
  const [lastMilestone, setLastMilestone] = useState(null);
  const [tasks, setTasks] = useState([]);

  // 1) Fetch tasks from the server
  useEffect(() => {
    fetch('http://localhost:4000/api/tasks')
      .then((res) => res.json())
      .then((taskData) => setTasks(taskData))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // 2) Fetch milestones from the server (ONE TIME)
  useEffect(() => {
    fetch('http://localhost:4000/api/milestones')
      .then((res) => res.json())
      .then((milestonesData) => setMilestones(milestonesData))
      .catch((err) => console.error('Error fetching milestones:', err));
  }, []);

  // 3) If a milestone is "hit" by the currentPoints, record it
  const handleMilestoneHit = (milestone) => {
    setLastMilestone(milestone);
    console.log('Milestone hit!', milestone);
  };

  // 4) Sum up completed task points
  const totalCompletedPoints = tasks
    .filter((task) => task.completed)
    .reduce((sum, task) => sum + task.points, 0);

  // 5) Functions to modify the milestone array (and persist to server).
  //    These will be passed down to <Milestones> as props.

  // a) Add new milestone
  const addMilestone = async () => {
    try {
      const newMilestone = { value: 0, label: 'New Reward' };
      const res = await fetch('http://localhost:4000/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMilestone),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const created = await res.json();

      // Add it to our local state
      setMilestones((prev) => [...prev, created]);
    } catch (err) {
      console.error('Error creating milestone:', err);
    }
  };

  // b) Delete a milestone
  const deleteMilestone = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/milestones/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      // Remove from our local array
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error deleting milestone:', err);
    }
  };

  // c) Update milestone value
  const updateMilestoneValue = async (id, newValue) => {
    const milestoneToUpdate = milestones.find((m) => m.id === id);
    if (!milestoneToUpdate) return;

    const updatedMilestone = {
      ...milestoneToUpdate,
      value: parseInt(newValue, 10) || 0,
    };

    try {
      const res = await fetch(`http://localhost:4000/api/milestones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMilestone),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const returnedMilestone = await res.json();
      setMilestones((prev) =>
        prev.map((m) => (m.id === returnedMilestone.id ? returnedMilestone : m))
      );
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  // d) Update milestone label
  const updateMilestoneLabel = async (id, newLabel) => {
    const milestoneToUpdate = milestones.find((m) => m.id === id);
    if (!milestoneToUpdate) return;

    const updatedMilestone = {
      ...milestoneToUpdate,
      label: newLabel,
    };

    try {
      const res = await fetch(`http://localhost:4000/api/milestones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMilestone),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const returnedMilestone = await res.json();
      setMilestones((prev) =>
        prev.map((m) => (m.id === returnedMilestone.id ? returnedMilestone : m))
      );
    } catch (err) {
      console.error('Error updating milestone label:', err);
    }
  };

  return (
    <div>
      <h1>Work-A-Thon!</h1>

      {/* Milestone Editor: we pass the array + the add/delete/update callbacks */}
      <Milestones
        milestones={milestones}
        onAdd={addMilestone}
        onDelete={deleteMilestone}
        onValueChange={updateMilestoneValue}
        onLabelChange={updateMilestoneLabel}
      />

      {/* Progress Bar sees the current milestone array and currentPoints */}
      <ProgressBar
        totalPoints={100}
        milestones={milestones}
        currentPoints={totalCompletedPoints}
        onMilestoneHit={handleMilestoneHit}
      />

      {/* Task List */}
      <TaskList tasks={tasks} setTasks={setTasks} />

      {/* Show the last milestone user has hit */}
      {lastMilestone && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Current Milestone:</strong> {lastMilestone.label}
        </div>
      )}
    </div>
  );
}

export default App;
