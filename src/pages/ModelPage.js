import React, { useEffect, useState } from 'react';
import './ModelPage.css';

function ModelPage() {
  const [girls, setGirls] = useState([]);
  const [selectedGirl, setSelectedGirl] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/girls')
      .then(res => res.json())
      .then(data => setGirls(data));
  }, []);

  return (
    <div className="App">
      <h1>Model Gallery (from Pexels API)</h1>

      <div className="masonry">
        {[0, 1, 2].map(col => (
          <div className="masonry-column" key={col}>
            {girls
              .filter((_, i) => i % 3 === col)
              .map(girl => (
                <div key={girl.id} className="item">
                  <div className="image-container" onClick={() => setSelectedGirl(girl)}>
                    <img src={girl.url} alt="model" />
                    <div className="overlay">
                      <div className="photographer">
                        <img src="https://i.pravatar.cc/32" alt="avatar" />
                        <span>{girl.photographer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {selectedGirl && (
        <div className="modal-backdrop" onClick={() => setSelectedGirl(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedGirl(null)}>✖</button>
            <img
              className="modal-image preview-image"
              src={selectedGirl.url}
              alt="preview"
            />
            <div className="modal-details">
              <h2>{selectedGirl.photographer}</h2>
              <p>🆔 Photo ID: {selectedGirl.id}</p>
              <p>🔗 URL: <a href={selectedGirl.url} target="_blank" rel="noopener noreferrer">{selectedGirl.url}</a></p>
              <button
                className="download"
                onClick={() => window.open(selectedGirl.url, '_blank')}
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

export default ModelPage;
