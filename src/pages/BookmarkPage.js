import React, { useEffect, useState } from 'react';
import './BookmarkPage.css';
import { Link } from 'react-router-dom';

function BookmarkPage() {
  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch('https://fastandfabulous-backend.onrender.com/get/bookmarks/cars')
      .then(res => res.json())
      .then(data => setCars(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('https://fastandfabulous-backend.onrender.com/get/bookmarks/motorcycles')
      .then(res => res.json())
      .then(data => setBikes(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch('https://fastandfabulous-backend.onrender.com/get/bookmarks/models')
      .then(res => res.json())
      .then(data => setModels(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car bookmark?')) return;

    try {
      const res = await fetch(`https://fastandfabulous-backend.onrender.com/delete/bookmarks/cars/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete car');

      setCars(prev => prev.filter(car => car.id !== id));
      alert('Car deleted.');
    } catch (err) {
      console.error(err);
      alert('Error deleting car.');
    }
  };

  const handleEditCar = async (car) => {
    const updatedClass = prompt('Enter new class:', car.class);
    const updatedCylinders = prompt('Enter number of cylinders:', car.cylinders);
    const updatedDisplacement = prompt('Enter displacement:', car.displacement);
    const updatedMake = prompt('Enter make:', car.make);
    const updatedModel = prompt('Enter model:', car.model);
    const updatedYear = prompt('Enter year:', car.year);

    if (
      !updatedClass || !updatedCylinders || !updatedDisplacement ||
      !updatedMake || !updatedModel || !updatedYear
    ) return;

    try {
      const res = await fetch(`https://fastandfabulous-backend.onrender.com/update/bookmarks/cars/${car.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class: updatedClass,
          cylinders: Number(updatedCylinders),
          displacement: Number(updatedDisplacement),
          make: updatedMake,
          model: updatedModel,
          year: Number(updatedYear),
        }),
      });

      if (!res.ok) throw new Error('Failed to update car');

      setCars(prev =>
        prev.map(c => c.id === car.id
          ? {
              ...c,
              class: updatedClass,
              cylinders: Number(updatedCylinders),
              displacement: Number(updatedDisplacement),
              make: updatedMake,
              model: updatedModel,
              year: Number(updatedYear),
            }
          : c
        )
      );

      alert('Car updated.');
    } catch (err) {
      console.error(err);
      alert('Error updating car.');
    }
  };

  const handleDeleteBike = async (id) => {
    if (!window.confirm('Are you sure you want to delete this motorcycle bookmark?')) return;

    try {
      const res = await fetch(`https://fastandfabulous-backend.onrender.com/delete/bookmarks/motorcycles/${id}`, {
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
      const res = await fetch(`https://fastandfabulous-backend.onrender.com/update/bookmarks/motorcycles/${bike._id}`, {
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

  const handleDeleteModel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;

    try {
      const res = await fetch(`https://fastandfabulous-backend.onrender.com/delete/bookmarks/models/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete model');

      setModels(prev => prev.filter(model => model.id !== id));
      alert('Model deleted.');
    } catch (err) {
      console.error(err);
      alert('Error deleting model.');
    }
  };

  const handleEditModel = async (model) => {
    const newPhotographer = prompt('Enter new Photographer name:', model.photographer);
    if (!newPhotographer || newPhotographer.trim() === '' || newPhotographer === model.photographer) return;

    try {
      const res = await fetch(`https://fastandfabulous-backend.onrender.com/update/bookmarks/models/${model.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photographer: newPhotographer }),
      });

      if (!res.ok) throw new Error('Failed to update model');

      setModels(prev => prev.map(m => m.id === model.id ? { ...m, photographer: newPhotographer } : m));
      alert('Photographer updated.');
    } catch (err) {
      console.error(err);
      alert('Error updating model.');
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Your Bookmarked Items</h1>
      <p className="home-subtitle">Here are the cars, motorcycles, and models you saved:</p>

      <div className="home-grid">
        {/* Car bookmarks */}
        <div className="card">
          <h2>Bookmarked Cars ({cars.length})</h2>
          <div className="bookmark-list">
            {cars.length === 0 ? (
              <p>No bookmark for cars.</p>
            ) : (
              cars.map((car, index) => (
                <div key={car.id} className="list-tile row-tile">
                  <div className="tile-image">
                    <img src={car.image} alt={car.model} />
                  </div>
                  <div className="tile-info">
                    <p><strong>Brand:</strong> {car.make}</p>
                    <p><strong>Model:</strong> {car.model}</p>
                    <p><strong>Class:</strong> {car.class}</p>
                    <p><strong>Year:</strong> {car.year}</p>
                    <p><strong>Cylinders:</strong> {car.cylinders}</p>
                    <p><strong>Displacement:</strong> {car.displacement}</p>
                    <div className="tile-buttons">
                      <button onClick={() => handleEditCar(car)}>Edit</button>
                      <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right stack: Bikes + Models */}
        <div className="right-stack">
          {/* Bike bookmarks */}
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

          {/* Model bookmarks */}
          <div className="card">
            <h2>Bookmarked Models ({models.length})</h2>
            <div className="bookmark-list">
              {models.length === 0 ? (
                <p>No bookmark for models.</p>
              ) : (
                models.map(model => (
                  <div key={model.id} className="list-tile row-tile">
                    <div className="tile-image">
                      <img src={model.url} alt="model" />
                    </div>
                    <div className="tile-info">
                      <p><strong>ID:</strong> {model.id}</p>
                      <p><strong>Photographer:</strong> {model.photographer}</p>
                      <p><strong>Image URL:</strong> <a href={model.url} target="_blank" rel="noopener noreferrer">{model.url}</a></p>
                      <div className="tile-buttons">
                        <button onClick={() => handleEditModel(model)}>Edit</button>
                        <button onClick={() => handleDeleteModel(model.id)}>Delete</button>
                      </div>
                    </div>
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
