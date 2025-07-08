// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate(); // ✅ Correct: inside the component

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add login validation first
    navigate('/dashboard'); // Programmatic navigation
  };

  return (
    <div className="fullscreen-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />

          <button type="submit">Login</button>
        </form>
        <p className="signup-prompt">
          New here? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
