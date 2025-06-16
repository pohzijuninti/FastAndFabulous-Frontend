import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [tab, setTab] = useState('login'); // "login" or "register"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert(data.message);
        navigate('/home');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Server error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setTab('login');
        setConfirmPassword('');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      alert('Server error');
    }
  };

  const handleGuestAccess = () => {
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="tab-switch">
          <button 
            className={tab === 'login' ? 'active' : ''} 
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button 
            className={tab === 'register' ? 'active' : ''} 
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        <form 
          onSubmit={tab === 'login' ? handleLogin : handleRegister}
          className="login-form"
        >
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

          {tab === 'register' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                placeholder="Confirm your password" 
              />
            </div>
          )}

          <button type="submit" className="btn btn-filled full-width">
            {tab === 'login' ? 'Log In' : 'Register'}
          </button>
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
