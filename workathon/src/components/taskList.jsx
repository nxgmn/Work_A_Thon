import React, { useState, useEffect } from 'react';
import Task from './task';

const TaskList = () => {
  // We'll store the array of tasks in state
  const [tasks, setTasks] = useState([]);

  // Load tasks from the server on mount
  useEffect(() => {
    fetch('http://localhost:4000/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // Toggle a task's completed status by sending a PUT request to the server
  const handleToggleTask = (taskId) => {
    // Find the task in our local state
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    // Flip its completed field
    const updatedTask = { 
      ...taskToUpdate, 
      completed: !taskToUpdate.completed 
    };

    // Send the updated task to the server
    fetch(`http://localhost:4000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((returnedTask) => {
        // The server returns the updated task.
        // Update our local state so the UI reflects the changes.
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === returnedTask.id ? returnedTask : t
          )
        );
      })
      .catch((err) => console.error('Error updating task:', err));
  };

  return (
    <div>
      <h2>My Tasks</h2>
      {tasks.map((task) => (
        <Task
          key={task.id}
          id={task.id}
          name={task.name}
          points={task.points}
          completed={task.completed}
          onToggle={handleToggleTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
