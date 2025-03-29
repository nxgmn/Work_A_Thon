import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css'; // Ensure your navbar styles are linked

function Navbar() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoToUserPage = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return; // Nothing to do if username is empty
    if (trimmedUsername === "admin") { navigate('/Work_A_Thon/admin'); }

    try {
      // Clear previous error
      setError('');
      // Call the backend endpoint to check if the user exists
      const response = await fetch(`https://work-a-thon.onrender.com/api/users/getUserId?username=${encodeURIComponent(trimmedUsername)}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      // If user exists, navigate to the user page

      navigate(`/Work_A_Thon/user/${trimmedUsername}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <input
          type="text"
          placeholder="Enter name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="navbar-input"
        />
        <button onClick={handleGoToUserPage} className="navbar-button">
          Go to your tasks
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </nav>
  );
}

export default Navbar;
