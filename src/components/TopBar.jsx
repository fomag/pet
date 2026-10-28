import React, { useState } from 'react';

export default function TopBar({ onLoadPage, onExport, onCodeToggle }) {
  const [showLoader, setShowLoader] = useState(false);
  const [input, setInput] = useState('');

  const handleLoad = () => {
    if (input.trim()) {
      onLoadPage(input);
      setInput('');
      setShowLoader(false);
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="toolbar">
          <button className="btn" onClick={() => setShowLoader(!showLoader)}>
            📥 Load Page
          </button>
          <button className="btn" onClick={onCodeToggle}>
            {'<>'} Code View
          </button>
          <button className="btn" onClick={onExport}>
            📤 Export HTML
          </button>
        </div>
      </div>

      {showLoader && (
        <div className="loader-modal">
          <div className="loader-content">
            <h3>Load a Page</h3>
            <p>Paste HTML, a GitHub URL, or a canada.ca URL</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://www.canada.ca/... or paste HTML"
              rows="8"
              autoFocus
            />
            <div className="loader-buttons">
              <button className="btn" onClick={handleLoad}>Load</button>
              <button className="btn btn-secondary" onClick={() => setShowLoader(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
