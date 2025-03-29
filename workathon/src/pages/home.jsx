// pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useTasksContext } from '../context/GlobalTasksContext';
import ProgressBar from '../components/progressBar';
import './home.css';
import DisplayUsers from '../components/displayUsers';

function HomePage() {
  const { allTasks, loadAllTasks } = useTasksContext();
  const [milestones, setMilestones] = useState([]);

  // 1) Poll tasks from the context every 30 seconds
  useEffect(() => {
    // Load once immediately
    loadAllTasks();

    // Then poll every 30s
    const intervalId = setInterval(() => {
      loadAllTasks();
    }, 30000);

    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, [loadAllTasks]);

  // 2) Fetch milestones once on mount (or poll similarly if needed)
  useEffect(() => {
    fetch('http://localhost:4000/api/milestones')
      .then((res) => res.json())
      .then((data) => setMilestones(data))
      .catch((err) => console.error('Error fetching milestones:', err));
  }, []);

  // 3) Compute total completed points from the global tasks
  const totalCompletedPoints = allTasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points, 0);

  return (
    <div>
    <div class="logo">
        <span class="logo-text">Work-A-Thon</span>
    </div>
    <div class="sky">
        <div class="sun"></div>
        <div class="speckles">
            <div class="speckle"></div>
            <div class="speckle"></div>
            <div class="speckle"></div>
            <div class="speckle"></div>
            <div class="speckle"></div>
            <div class="speckle"></div>
            <div class="speckle"></div>
            <div class="speckle"></div>
        </div>
    </div>
      < ProgressBar
        totalPoints={100}
        currentPoints={totalCompletedPoints}
        milestones={milestones}
      />

    </div>
  );
}

export default HomePage;
