// taskList.jsx
import React, { useEffect } from 'react';
import Task from './task';

const TaskList = ({ tasks, setTasks }) => {
  // If you want to fetch tasks here instead of in App, you could.
  // But then you'd remove the fetch from App and store tasks locally here or pass them up.

  const handleToggleTask = (taskId) => {
    // Find the task
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    // Flip completion
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    // Update server (optional, if you want to keep them in sync)
    fetch(`http://localhost:4000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((returnedTask) => {
        // Update local state so progress bar re-renders
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
