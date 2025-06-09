import React, { useEffect, useState } from 'react';
import '../App.css';

function MotorcyclePage() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/girls')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(item => item.category === 'motorcycle');
        setData(filtered);
      });
  }, []);

  return (
    <div className="App">
      <h1>Motorcycle Gallery</h1>
      <div className="masonry">
        {data.map((item) => (
          <div key={item.id} className="item">
            <div className="image-container" onClick={() => setSelectedItem(item)}>
              <img src={item.url} alt="motorcycle" />
              <div className="overlay">
                <div className="photographer">
                  <span role="img" aria-label="avatar" className="avatar-icon">👤</span>
                  <span>{item.photographer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedItem(null)}>✖</button>
            <img
              className="modal-image preview-image"
              src={selectedItem.url}
              alt="preview"
            />
            <div className="modal-details">
              <h2>{selectedItem.photographer}</h2>
              <p>🆔 Photo ID: {selectedItem.id}</p>
              <p>📂 Category: {selectedItem.category}</p>
              <p>🔗 URL: <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">{selectedItem.url}</a></p>
              <button
                className="download"
                onClick={() => window.open(selectedItem.url, '_blank')}
              >
                ⬇ Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MotorcyclePage;
