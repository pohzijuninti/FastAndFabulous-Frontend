import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarPage from './pages/CarPage';
import MotorcyclePage from './pages/MotorcyclePage';
import ModelPage from './pages/ModelPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-left">
            <NavLink to="/" className="site-title">
              Fast & Fabulous
            </NavLink>

            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Home
            </NavLink>
            <NavLink
              to="/car"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Car
            </NavLink>
            <NavLink
              to="/motorcycle"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Motorcycle
            </NavLink>
            <NavLink
              to="/model"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Model
            </NavLink>
          </div>

          <div className="nav-right">
            <NavLink to="/signup" className="btn btn-plain">
              Sign up
            </NavLink>
            <NavLink to="/login" className="btn btn-filled">
              Log in
            </NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car" element={<CarPage />} />
          <Route path="/motorcycle" element={<MotorcyclePage />} />
          <Route path="/model" element={<ModelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
