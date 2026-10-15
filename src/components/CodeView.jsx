import React from 'react';
import { renderHTML } from '../utils/htmlRenderer';

export default function CodeView({ blocks, onChange }) {
  const html = renderHTML(blocks);

  const handleChange = (e) => {
    // This would parse HTML back to blocks
    // For MVP, just show the code
    console.log('Code editing not yet implemented');
  };

  return (
    <div className="code-view">
      <h3>HTML Source</h3>
      <textarea
        value={html}
        onChange={handleChange}
        className="code-editor"
      />
      <p className="note">Tip: Edit the visual view, then switch here to copy code</p>
    </div>
  );
}
