// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css'; // Make sure to link the navbar styles

function Navbar() {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleGoToUserPage = () => {
    // Only navigate if the user typed something
    if (userId.trim()) {
      navigate(`/user/${userId.trim()}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Field to enter user ID, then navigate to /user/:userId */}
        <input
          type="text"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="navbar-input"
        />
        <button onClick={handleGoToUserPage} className="navbar-button">
          Go to your tasks
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
