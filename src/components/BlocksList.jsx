import React from 'react';

export default function BlocksList({ blocks, selectedBlockId, onSelectBlock, onDeleteBlock, onAddBlock }) {
  const getBlockLabel = (block) => {
    const maxLen = 40;
    let text = '';
    if (block.type === 'heading') {
      text = block.content.text || 'Heading';
    } else if (block.type === 'text') {
      text = block.content.text?.replace(/<[^>]+>/g, '') || 'Text block';
    } else if (block.type === 'subway') {
      text = block.content.title || 'Navigation';
    } else {
      text = block.type;
    }
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
  };

  const getBlockIcon = (type) => {
    const icons = {
      heading: '📝',
      text: '¶',
      subway: '🗺️',
      alert: '⚠️',
      accordion: '📋',
      button: '🔘'
    };
    return icons[type] || '📦';
  };

  return (
    <div className="blocks-list">
      <h3>Blocks</h3>
      
      <div className="blocks-container">
        {blocks.length === 0 ? (
          <div className="empty">No blocks yet. Load a page to start.</div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className={`block-item ${selectedBlockId === block.id ? 'selected' : ''}`}
              onClick={() => onSelectBlock(block.id)}
            >
              <div className="block-header">
                <span className="block-icon">{getBlockIcon(block.type)}</span>
                <span className="block-label">{getBlockLabel(block)}</span>
              </div>
              <div className="block-type">{block.type}</div>
              <button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBlock(block.id);
                }}
                title="Delete block"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="add-component">
        <h4>Add Component</h4>
        <div className="component-buttons">
          <button onClick={() => onAddBlock('heading')} className="btn-component">+ Heading</button>
          <button onClick={() => onAddBlock('text')} className="btn-component">+ Text</button>
          <button onClick={() => onAddBlock('subway')} className="btn-component">+ Subway</button>
          <button onClick={() => onAddBlock('alert')} className="btn-component">+ Alert</button>
        </div>
      </div>
    </div>
  );
}
