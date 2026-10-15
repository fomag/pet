import React, { useState } from 'react';

export default function TopBar({ onLoadPage, onExport, onCodeToggle }) {
  const [input, setInput] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const handleLoad = () => {
    if (input.trim()) {
      onLoadPage(input);
      setInput('');
      setShowLoader(false);
    }
  };

  return (
    <div className="top-bar">
      <div className="toolbar">
        <button className="btn" onClick={() => setShowLoader(!showLoader)}>
          📥 Load Page
        </button>
        <button className="btn" onClick={onExport}>
          📤 Export HTML
        </button>
        <button className="btn" onClick={onCodeToggle}>
          {'<>'} Code View
        </button>
      </div>

      {showLoader && (
        <div className="loader-modal">
          <div className="loader-content">
            <h3>Load a Page</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste HTML or enter GitHub/canada.ca URL..."
              rows="6"
            />
            <div className="loader-buttons">
              <button onClick={handleLoad}>Load</button>
              <button onClick={() => setShowLoader(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
