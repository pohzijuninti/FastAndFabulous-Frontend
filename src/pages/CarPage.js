import React, { useEffect, useState } from 'react';
import './CarPage.css';

function CarPage() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // ✅ error state

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:4000/api/cars');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setCars(data);
        } else {
          console.warn("Expected array but got:", data);
          setError('Unexpected response format');
          setCars([]);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to fetch cars. Please try again later.');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleBookmark = async () => {
    if (!selectedCar || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:4000/post/bookmarks/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCar),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to bookmark car');
      }

      alert('Car added to bookmarks!');
      setSelectedCar(null);
    } catch (err) {
      console.error('Error bookmarking car:', err);
      alert('Failed to bookmark car. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=No+Image'; // fallback
  };

  return (
    <div className="App">
      <h1>Cars</h1>

      {loading ? (
        <p>Loading cars...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : cars.length === 0 ? (
        <p>No cars available.</p>
      ) : (
        <div className="car-grid">
          {cars.map((car) => (
            <div
              key={car.id}
              className="car-card"
              onClick={() => setSelectedCar(car)}
            >
              <img
                src={car.image}
                onError={handleImageError}
                alt={`${car.make} ${car.model}`}
                className="car-image"
              />
              <div className="car-title">
                <h3>{car.make} {car.model} ({car.year})</h3>
              </div>
              <div className="car-info">
                <p><strong>ID:</strong> {car.id}</p>
                <p><strong>Class:</strong> {car.class}</p>
                <p><strong>Cylinders:</strong> {car.cylinders}</p>
                <p><strong>Displacement:</strong> {car.displacement}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCar && (
        <div className="modal-backdrop" onClick={() => setSelectedCar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCar(null)}>✖</button>
            <img
              className="modal-image"
              src={selectedCar.image}
              onError={handleImageError}
              alt={`${selectedCar.make} ${selectedCar.model}`}
            />
            <div className="modal-details">
              <h2>{selectedCar.make} {selectedCar.model} ({selectedCar.year})</h2>
              <p>ID: {selectedCar.id}</p>
              <p>Class: {selectedCar.class}</p>
              <p>Cylinders: {selectedCar.cylinders}</p>
              <p>Displacement: {selectedCar.displacement}</p>
              <button className="bookmark" onClick={handleBookmark} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add to Bookmark'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarPage;
