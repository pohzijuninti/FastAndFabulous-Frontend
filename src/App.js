import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import CarPage from './pages/CarPage';
import MotorcyclePage from './pages/MotorcyclePage';
import ModelPage from './pages/ModelPage';
import BookmarkPage from './pages/BookmarkPage';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);

  // Hide navbar on login page
  const hideNavbar = location.pathname === '/login';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (!confirmDelete) return;

    try {
      const res = await fetch('http://localhost:4000/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className="App">
      {!hideNavbar && (
        <nav className="navbar">
          <div className="nav-left">
            <NavLink to="/home" className="site-title">
              Fast & Fabulous
            </NavLink>
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
            <NavLink to="/car" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Car</NavLink>
            <NavLink to="/motorcycle" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Motorcycle</NavLink>
            <NavLink to="/model" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Model</NavLink>
            <NavLink to="/bookmark" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Bookmark</NavLink>
          </div>

          <div className="nav-right">
            {token ? (
              <div className="user-actions">
                <div className="user-icon-wrapper">
                  <FaUser className="user-icon" onClick={() => setShowDropdown(!showDropdown)} />
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <button onClick={handleDeleteAccount} className="dropdown-item">Delete Account</button>
                    </div>
                  )}
                </div>
                <button className="btn btn-filled" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-filled">Log in</NavLink>
            )}
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/car" element={<CarPage />} />
        <Route path="/motorcycle" element={<MotorcyclePage />} />
        <Route path="/model" element={<ModelPage />} />
        <Route path="/bookmark" element={<BookmarkPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router basename="">
      <AppLayout />
    </Router>
  );
}

export default App;
