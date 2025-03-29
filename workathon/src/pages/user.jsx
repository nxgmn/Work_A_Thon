// src/pages/UserPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTasksContext } from '../context/GlobalTasksContext';
import TaskList from '../components/taskList';
import Logo from '../components/logo';

function UserPage() {
  const { username } = useParams();
  const { allTasks, setAllTasks, loadAllTasks } = useTasksContext();
  const [userId, setUserId] = useState(null);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:4000/api/users/getUserId?username=${encodeURIComponent(username)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('User not found');
          }
          return res.json();
        })
        .then((data) => setUserId(data.id))
        .catch((err) => console.error('Error fetching user ID:', err));
    }
  }, [username]);

  // 2) Whenever the global tasks change, filter for this user's tasks using userId
  useEffect(() => {
    if (userId !== null) {
      const filtered = allTasks.filter((t) => t.userId === userId);
      setUserTasks(filtered);
    }
  }, [allTasks, userId]);

  // 3) Optionally, re-fetch global tasks on mount to ensure you have the latest data
  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks]);

  // Function to add a new task for this user
  const handleAddTask = async (name, points) => {
    if (userId === null) return;
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, points }),
      });
      if (!res.ok) {
        throw new Error(`Could not add task: ${res.status}`);
      }
      const newTask = await res.json();
      // Update global tasks context
      setAllTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error('Error adding user task:', error);
    }
  };

  // Toggling a task (PUT /api/users/:userId/tasks/:taskId)
  const handleToggleTask = async (taskId) => {
    if (userId === null) return;
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;
    const updatedTask = { ...task, completed: !task.completed };
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) {
        throw new Error(`Could not toggle task: ${res.status}`);
      }
      const returnedTask = await res.json();
      setAllTasks((prev) =>
        prev.map((t) => (t.id === returnedTask.id ? returnedTask : t))
      );
    } catch (error) {
      console.error('Error toggling user task:', error);
    }
  };

  // Remove a task for this user
  const handleRemoveTask = async (taskId) => {
    if (userId === null) return;
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`Could not delete task: ${res.status}`);
      }
      setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting user task:', error);
    }
  };

  // Until we have a userId, display a loading message
  if (userId === null) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <Logo />
      <TaskList
        tasks={userTasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onRemoveTask={handleRemoveTask}
      />
    </div>
  );
}

export default UserPage;
