// src/context/GlobalTasksContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1) Create the actual context
const TasksContext = createContext();

// 2) Create a Provider component
export function TasksProvider({ children }) {
  const [allTasks, setAllTasks] = useState([]);

  // Fetch all tasks on mount (from /api/tasks) – includes tasks from all users
  useEffect(() => {
    loadAllTasks(); 
  }, []);

  // Function to fetch or refresh all tasks from server
  function loadAllTasks() {
    fetch('https://work-a-thon.onrender.com/api/tasks')
      .then((res) => res.json())
      .then((data) => setAllTasks(data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }

  // Return the context provider
  return (
    <TasksContext.Provider
      value={{
        allTasks,
        setAllTasks,
        loadAllTasks
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

// 3) Optional helper hook
export function useTasksContext() {
  return useContext(TasksContext);
}
