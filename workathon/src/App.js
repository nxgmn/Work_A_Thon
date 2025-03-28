import React, { useState, useEffect } from 'react';
import ProgressBar from './components/progressBar';
import Milestones from './components/milestones';
import TaskList from './components/taskList';
import './App.css';

function App() {

  const [milestones, setMilestones] = useState([]);
  const [lastMilestone, setLastMilestone] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the server (so TaskList can display them)
  useEffect(() => {
    fetch('http://localhost:4000/api/tasks')
      .then((res) => res.json())
      .then((taskData) => setTasks(taskData))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // Fetch milestones from the server (so Milestones editor can display them)
  useEffect(() => {
    fetch('http://localhost:4000/api/milestones')
      .then((res) => res.json())
      .then((milestonesData) => setMilestones(milestonesData))
      .catch((err) => console.error('Error fetching milestones:', err));
  }, []);

  // Called from ProgressBar when a user hits or exceeds a milestone
  const handleMilestoneHit = (milestone) => {
    setLastMilestone(milestone);
    console.log("Milestone hit!", milestone);
    // Trigger any UI effect here (e.g. show confetti, open a modal, etc.)
  };
  
  // Called whenever the user changes the milestones in the Milestones editor
  const handleMilestonesChange = (updatedMilestones) => {
    setMilestones(updatedMilestones);
    // NOTE: If you actually want to persist these changes to the server,
    // you would do a PUT / POST / DELETE call depending on the operation.
  };

  // Sum up all points from completed tasks
  const totalCompletedPoints = tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.points, 0);

  return (
    <div>
      <h1>Work-A-Thon!</h1>

      {/* Milestones editor */}
      <Milestones
        milestones={milestones}
        onChange={handleMilestonesChange}
      />

      {/* Progress Bar */}
      <ProgressBar
        totalPoints={100}
        milestones={milestones}
        currentPoints={totalCompletedPoints}
        onMilestoneHit={handleMilestoneHit}
      />

      {/* Task List */}
      <TaskList tasks={tasks} setTasks={setTasks} />

      {/* Example of showing the last milestone hit, if any */}
      {lastMilestone && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Current Milestone:</strong> {lastMilestone.label}
        </div>
      )}
    </div>
  );
}

export default App;
