import React from "react";
import { Link } from "react-router-dom";
import './logo.css';

const Logo = () => {
  return (
    <Link to="/" className="logo">
      <span className="logo-text">Work-A-Thon</span>
    </Link>
  );
};

export default Logo;
