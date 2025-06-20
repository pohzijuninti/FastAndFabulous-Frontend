import React, { useEffect, useState } from 'react';
import './ModelPage.css';

function ModelPage() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Like MotorcyclePage

  useEffect(() => {
    fetchModels(); // Load default list
  }, []);

  const fetchModels = async (query = '') => {
    setLoading(true);
    setError(null);

    const url = query
      ? `https://fastandfabulous-backend.onrender.com/api/images/${encodeURIComponent(query)}`
      : 'https://fastandfabulous-backend.onrender.com/api/models';

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setModels(data);
      } else {
        setError('Invalid data format from server');
      }
    } catch (err) {
      console.error('❌ Error fetching models:', err);
      setError('Failed to load models. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      fetchModels(searchTerm.trim());
    }
  };

  const handleBookmark = async () => {
    if (!selectedModel || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://fastandfabulous-backend.onrender.com/post/bookmarks/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedModel.id,
          url: selectedModel.url,
          photographer: selectedModel.photographer,
        }),
      });

      if (!response.ok) throw new Error('Failed to save to MongoDB');

      alert('Model added to bookmarks!');
      setBookmarkedIds(prev => [...prev, selectedModel.id]);
      setSelectedModel(null); // ✅ Close modal after bookmarking
    } catch (error) {
      console.error('MongoDB error:', error);
      alert('Failed to save bookmark to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <h1>Model Gallery (from Pexels API)</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for models or topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

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
                    <div
                      className="image-container"
                      onClick={() => setSelectedModel(model)}
                    >
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
              <p>
                🔗 URL:{' '}
                <a href={selectedModel.url} target="_blank" rel="noopener noreferrer">
                  {selectedModel.url}
                </a>
              </p>
              <button
                className="bookmark"
                onClick={handleBookmark}
                disabled={isSubmitting || bookmarkedIds.includes(selectedModel.id)}
              >
                {bookmarkedIds.includes(selectedModel.id)
                  ? 'Bookmarked'
                  : isSubmitting
                  ? 'Adding...'
                  : 'Add to Bookmark'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelPage;
