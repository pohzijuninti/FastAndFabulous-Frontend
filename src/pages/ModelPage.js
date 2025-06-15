import React, { useEffect, useState } from 'react';
import './ModelPage.css';

function ModelPage() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  // Fetch models on page load
  useEffect(() => {
    fetch('http://localhost:4000/api/models')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setModels(data);
        else {
          console.error("Expected array, got:", data);
          setModels([]);
        }
      })
      .catch(err => {
        console.error('Error fetching models:', err);
        setModels([]);
      });
  }, []);

  // Bookmark handler
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

      {/* Modal for model detail */}
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
