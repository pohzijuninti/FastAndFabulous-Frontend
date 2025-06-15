import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import axios from 'axios';

function HomePage() {
  const [modelImage, setModelImage] = useState('');
  const [carImage, setCarImage] = useState('');
  const [motorcycleImage, setMotorcycleImage] = useState('');

  useEffect(() => {
    const setupImageRotation = (apiUrl, setImage) => {
      axios.get(apiUrl)
        .then(res => {
          const list = res.data;
          if (!Array.isArray(list) || list.length === 0) return;

          let index = 0;
          setImage(list[0].image || list[0].url);

          const interval = setInterval(() => {
            index = (index + 1) % list.length;
            setImage(list[index].image || list[index].url);
          }, 3000);

          return () => clearInterval(interval);
        })
        .catch(err => console.error(`Failed to fetch from ${apiUrl}:`, err));
    };

    const clearCar = setupImageRotation('http://localhost:4000/api/cars', setCarImage);
    const clearMotorcycle = setupImageRotation('http://localhost:4000/api/motorcycles', setMotorcycleImage);
    const clearModel = setupImageRotation('http://localhost:4000/api/models', setModelImage);

    return () => {
      clearCar && clearCar();
      clearMotorcycle && clearMotorcycle();
      clearModel && clearModel();
    };
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Find your car. Your motorcycle. Your model. All in one place.</h1>
      <p className="home-subtitle">Select a category to explore stunning visuals:</p>

      <div className="home-grid">
        <Link
          to="/car"
          className="card large-card image-card"
          style={{ backgroundImage: `url(${carImage})` }}
        >
          <h2>Car</h2>
        </Link>

        <div className="right-stack">
          <Link
            to="/motorcycle"
            className="card small-card image-card"
            style={{ backgroundImage: `url(${motorcycleImage})` }}
          >
            <h2>Motorcycle</h2>
          </Link>

          <Link
            to="/model"
            className="card small-card image-card"
            style={{ backgroundImage: `url(${modelImage})` }}
          >
            <h2>Car Model</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
