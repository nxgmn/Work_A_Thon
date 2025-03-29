import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import AdminPage from './pages/admin';
import UserPage from './pages/user';
import Navbar from './components/navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* 1) Home */}
        <Route path="/Work_A_Thon" element={<HomePage />} />

        {/* 2) Admin */}
        <Route path="/Work_A_Thon/admin" element={<AdminPage />} />

        {/* 3) User */}
        <Route path="/Work_A_Thon/user/:username" element={<UserPage />} />

        {/* Add more routes if needed */}
      </Routes>
    </>
  );
}

export default App;
