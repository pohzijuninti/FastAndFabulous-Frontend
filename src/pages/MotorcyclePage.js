import React, { useEffect, useState } from 'react';
import './MotorcyclePage.css';

function MotorcyclePage() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // ✅ New

  useEffect(() => {
    const fetchMotorcycles = async () => {
      setLoading(true);
      setError(null); // clear error on retry
      try {
        const res = await fetch('https://fastandfabulous-backend.onrender.com/api/motorcycles');
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setMotorcycles(data);
        } else {
          console.warn('Expected array, got:', data);
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching motorcycles:', err);
        setError('Failed to fetch motorcycles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycles();
  }, []);

  const handleBookmark = async () => {
    if (!selectedBike || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        MakeId: selectedBike.MakeId,
        MakeName: selectedBike.MakeName,
        VehicleTypeName: selectedBike.VehicleTypeName,
        image: selectedBike.image || '',
      };

      const response = await fetch('https://fastandfabulous-backend.onrender.com/post/bookmarks/motorcycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to bookmark motorcycle');
      }

      alert('Motorcycle added to bookmarks!');
      setSelectedBike(null);
    } catch (err) {
      console.error('Error bookmarking motorcycle:', err.message);
      alert('Failed to bookmark motorcycle. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Motorcycles</h1>
      </header>

      <main>
        {loading ? (
          <p>Loading motorcycles...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : motorcycles.length === 0 ? (
          <p>No motorcycles available.</p>
        ) : (
          <section className="motorcycle-list">
            {motorcycles.map(bike => (
              <article
                key={bike.MakeId}
                className="motorcycle-card"
                onClick={() => setSelectedBike(bike)}
              >
                {bike.image ? (
                  <img
                    src={bike.image}
                    alt={bike.MakeName}
                    className="motorcycle-image"
                  />
                ) : (
                  <div className="motorcycle-placeholder">No Image</div>
                )}
                <h3>{bike.MakeName}</h3>
                <p><strong>ID:</strong> {bike.MakeId}</p>
                <p><strong>Type:</strong> {bike.VehicleTypeName}</p>
              </article>
            ))}
          </section>
        )}
      </main>

      {selectedBike && (
        <div className="modal-backdrop" onClick={() => setSelectedBike(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBike(null)}>✖</button>
            {selectedBike.image && (
              <img
                className="modal-image preview-image"
                src={selectedBike.image}
                alt={selectedBike.MakeName}
              />
            )}
            <div className="modal-details">
              <h2>{selectedBike.MakeName}</h2>
              <p><strong>Make ID:</strong> {selectedBike.MakeId}</p>
              <p><strong>Type:</strong> {selectedBike.VehicleTypeName}</p>
              <button
                className="bookmark"
                onClick={handleBookmark}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add to Bookmark'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MotorcyclePage;
