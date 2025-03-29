// src/components/Users.jsx
import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');

  // Fetch the users from the server when the component mounts
  useEffect(() => {
    fetch('http://localhost:4000/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  // Handler to add a new user
  const handleAddUser = () => {
    if (!newUserName.trim()) {
      alert('Please enter a user name.');
      return;
    }
    // Create a new user object. The backend is responsible for assigning an auto-incremented ID.
    const newUser = { name: newUserName.trim() };

    fetch('http://localhost:4000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((createdUser) => {
        // Append the newly created user to the state
        setUsers((prev) => [...prev, createdUser]);
        setNewUserName('');
      })
      .catch((err) => console.error('Error adding user:', err));
  };

  // Handler to remove a user
  const handleRemoveUser = (id) => {
    fetch(`http://localhost:4000/api/users/${id}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        // Remove the user from the state
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => console.error('Error removing user:', err));
  };

  return (
    <div>
      <h3>Manage Users</h3>
      <div>
        <input
          type="text"
          placeholder="New user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li key={user.id} style={{ margin: '8px 0' }}>
            {user.name} (ID: {user.id})
            <button onClick={() => handleRemoveUser(user.id)} style={{ marginLeft: '8px' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
