import React, { useEffect, useState } from 'react';
import './ModelPage.css';

function ModelPage() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New: to show fetch error

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('http://localhost:4000/api/models');
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const data = await res.json();

        if (Array.isArray(data)) {
          setModels(data);
        } else {
          console.warn('⚠️ Expected array, got:', data);
          setError('Invalid data format from server');
        }
      } catch (err) {
        console.error('❌ Error fetching models:', err);
        setError('Failed to load models. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleBookmark = async (model) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGirls')) || [];
    const isBookmarked = bookmarks.some(item => item.id === model.id);

    if (isBookmarked) {
      alert('Already bookmarked!');
      return;
    }

    bookmarks.push(model);
    localStorage.setItem('bookmarkedGirls', JSON.stringify(bookmarks));

    try {
      const response = await fetch('http://localhost:4000/post/bookmarks/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: model.id,
          url: model.url,
          photographer: model.photographer,
        }),
      });

      if (!response.ok) throw new Error('Failed to save to MongoDB');

      alert('Added to bookmarks!');
    } catch (error) {
      console.error('MongoDB error:', error);
      alert('Failed to save bookmark to server.');
    }
  };

  return (
    <div className="App">
      <h1>Model Gallery (from Pexels API)</h1>

      {loading ? (
        <p>Loading models...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : models.length === 0 ? (
        <p>No models found.</p>
      ) : (
        <div className="masonry">
          {[0, 1, 2].map(col => (
            <div className="masonry-column" key={col}>
              {models
                .filter((_, i) => i % 3 === col)
                .map(model => (
                  <div key={model.id} className="item">
                    <div className="image-container" onClick={() => setSelectedModel(model)}>
                      <img src={model.url} alt="model" />
                      <div className="overlay">
                        <div className="photographer">
                          <img src="https://i.pravatar.cc/32" alt="avatar" />
                          <span>{model.photographer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {selectedModel && (
        <div className="modal-backdrop" onClick={() => setSelectedModel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedModel(null)}>✖</button>
            <img className="modal-image preview-image" src={selectedModel.url} alt="preview" />
            <div className="modal-details">
              <h2>{selectedModel.photographer}</h2>
              <p>🆔 Photo ID: {selectedModel.id}</p>
              <p>🔗 URL: <a href={selectedModel.url} target="_blank" rel="noopener noreferrer">{selectedModel.url}</a></p>
              <button className="bookmark" onClick={() => handleBookmark(selectedModel)}>
                Add to Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelPage;
