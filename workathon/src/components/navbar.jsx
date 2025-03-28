// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <nav style={{ marginBottom: '1rem' }}>
      {/* Link to home */}
      <Link to="/" style={{ marginRight: '1rem' }}>
        Home
      </Link>

      {/* Field to enter user ID, then navigate to /user/:userId */}
      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ marginRight: '8px' }}
      />
      <button onClick={handleGoToUserPage}>Go to your tasks</button>
    </nav>
  );
}

export default Navbar;
