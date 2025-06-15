import React, { useEffect, useState } from 'react';
import './MotorcyclePage.css';

function MotorcyclePage() {
  const [motorcycles, setMotorcycles] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/motorcycles');
        const data = await res.json();
        setMotorcycles(data);
      } catch (err) {
        console.error('Error fetching motorcycles:', err);
        setMotorcycles([]);
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

      console.log('Posting to /post/bookmarks/motorcycles:', payload);

      const response = await fetch('http://localhost:4000/post/bookmarks/motorcycles', {
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
                {bike.image && (
                  <img
                    src={bike.image}
                    alt={bike.MakeName}
                    className="motorcycle-image"
                  />
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
