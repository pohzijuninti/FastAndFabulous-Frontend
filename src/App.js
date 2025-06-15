import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import CarPage from './pages/CarPage';
import MotorcyclePage from './pages/MotorcyclePage';
import ModelPage from './pages/ModelPage';
import BookmarkPage from './pages/BookmarkPage';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/'; // login page path

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
            <NavLink to="/signup" className="btn btn-plain">Sign up</NavLink>
            <NavLink to="/login" className="btn btn-filled">Log in</NavLink>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
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
    <Router basename="/FastAndFabulous-Frontend">
      <AppLayout />
    </Router>
  );
}

export default App;
