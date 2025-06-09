import React, { useEffect, useState } from 'react';

function CarPage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/girls')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(item => item.category === 'car');
        setCars(filtered);
      });
  }, []);

  return (
    <div>
      <h1>Car Models</h1>
      <div className="masonry">
        {cars.map((item) => (
          <div key={item.id} className="item">
            <div className="image-container">
              <img src={item.url} alt="car" />
              <div className="overlay">
                <div className="photographer">
                  <span role="img" aria-label="user" className="avatar-icon">👤</span>
                  <span>{item.photographer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarPage;
