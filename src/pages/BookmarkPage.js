import React, { useEffect, useState } from 'react';
import './BookmarkPage.css';
import { Link } from 'react-router-dom';

function BookmarkPage() {
  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/get/bookmarks/cars')
      .then(res => res.json())
      .then(data => setCars(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('http://localhost:4000/get/bookmarks/motorcycles')
      .then(res => res.json())
      .then(data => setBikes(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('http://localhost:4000/get/bookmarks/models')
      .then(res => res.json())
      .then(data => setModels(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleDeleteBike = async (id) => {
  if (!window.confirm('Are you sure you want to delete this motorcycle bookmark?')) return;

  try {
    const res = await fetch(`http://localhost:4000/delete/bookmarks/motorcycles/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete motorcycle');

    setBikes(prev => prev.filter(b => b._id !== id));
    alert('Motorcycle deleted.');
  } catch (err) {
    console.error(err);
    alert('Error deleting motorcycle.');
  }
};

  const handleEditBike = async (bike) => {
    const newName = prompt('Enter new Make Name:', bike.MakeName);
    if (!newName || newName.trim() === '' || newName === bike.MakeName) return;

    try {
      const res = await fetch(`http://localhost:4000/update/bookmarks/motorcycles/${bike._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ MakeName: newName }),
      });

      if (!res.ok) throw new Error('Failed to update motorcycle');

      setBikes(prev => prev.map(b => b._id === bike._id ? { ...b, MakeName: newName } : b));
      alert('Motorcycle updated.');
    } catch (err) {
      console.error(err);
      alert('Error updating motorcycle.');
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Your Bookmarked Items</h1>
      <p className="home-subtitle">Here are the cars, motorcycles, and models you saved:</p>

      <div className="home-grid">
        <div className="card large-card bookmark-style">
          <h2>Bookmarked Cars ({cars.length})</h2>
          <div className="bookmark-list">
            {cars.length === 0 ? (
              <p>No bookmark for cars.</p>
            ) : (
              cars.map(car => (
                <div key={car.id} className="list-tile">
                  <img src={car.image} alt={car.model} />
                  <span>{car.make} {car.model} ({car.year})</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="right-stack">
          <div className="card">
            <h2>Bookmarked Bikes ({bikes.length})</h2>
            <div className="bookmark-list">
              {bikes.length === 0 ? (
                <p>No bookmark for motorcycles.</p>
              ) : (
                bikes.map(bike => (
                  <div key={bike._id} className="list-tile row-tile">
                    <div className="tile-image">
                      <img src={bike.image} alt={bike.MakeName} />
                    </div>
                    <div className="tile-info">
                      <p><strong>Make ID:</strong> {bike.MakeId}</p>
                      <p><strong>Make Name:</strong> {bike.MakeName}</p>
                      <p><strong>Type:</strong> {bike.VehicleTypeName}</p>
                      <div className="tile-buttons">
                        <button onClick={() => handleEditBike(bike)}>Edit</button>
                        <button onClick={() => handleDeleteBike(bike._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card small-card bookmark-card">
            <h2>Bookmarked Models ({models.length})</h2>
            <div className="bookmark-list">
              {models.length === 0 ? (
                <p>No bookmark for models.</p>
              ) : (
                models.map(model => (
                  <div key={model.id} className="list-tile">
                    <img src={model.url} alt="model" />
                    <span>{model.photographer}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookmarkPage;
