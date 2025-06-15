import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'admin@gmail.com' && password === 'admin') {
      alert('Login successful!');
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleGuestAccess = () => {
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome to Fast & Fabulous</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email" 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password" 
            />
          </div>

          <button type="submit" className="btn btn-filled full-width">Log In</button>
        </form>

        <div className="separator">or</div>

        <button onClick={handleGuestAccess} className="btn btn-plain full-width">
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

export default Login;
