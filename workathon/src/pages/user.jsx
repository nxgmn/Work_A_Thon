// src/pages/UserPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTasksContext } from '../context/GlobalTasksContext';
import TaskList from '../components/taskList';

function UserPage() {
  const { userId } = useParams();
  const { allTasks, setAllTasks, loadAllTasks } = useTasksContext();
  const [userTasks, setUserTasks] = useState([]);

  // We can either:
  // 1) just do local fetch for user tasks, or
  // 2) rely on the global allTasks array.

  // Quick approach: filter allTasks for this user
  useEffect(() => {
    // whenever allTasks changes, update userTasks
    const filtered = allTasks.filter((t) => t.userId === parseInt(userId, 10));
    setUserTasks(filtered);
  }, [allTasks, userId]);

  // If you want to re-fetch from the server specifically for this user, you can,
  // but let's rely on loadAllTasks for a "global" approach.
  // Optional: On mount, we can call loadAllTasks() to ensure we have the latest
  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks]);

  // Function to add a new task for this user
  const handleAddTask = async (name, points) => {
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

      // Update global array
      setAllTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error('Error adding user task:', error);
    }
  };

  // Toggling a task (PUT /api/users/:userId/tasks/:taskId)
  const handleToggleTask = async (taskId) => {
    // find the task
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

      // Replace in global array
      setAllTasks((prev) =>
        prev.map((t) => (t.id === returnedTask.id ? returnedTask : t))
      );
    } catch (error) {
      console.error('Error toggling user task:', error);
    }
  };

  // Remove a task for this user
  const handleRemoveTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(`Could not delete task: ${res.status}`);
      }
      // remove from global array
      setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting user task:', error);
    }
  };

  return (
    <div>
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
