import React from 'react';

export default function EditorView({ blocks, selectedBlockId, onSelectBlock }) {
  const getPreviewText = (block) => {
    if (block.type === 'heading') {
      return block.content.text || '[Empty heading]';
    }
    if (block.type === 'text') {
      const text = block.content.text?.replace(/<[^>]+>/g, '') || '[Empty text]';
      return text.length > 100 ? text.slice(0, 100) + '...' : text;
    }
    if (block.type === 'subway') {
      return `${block.content.title || 'Navigation'} (${block.content.items?.length || 0} items)`;
    }
    return block.type;
  };

  return (
    <div className="editor-view">
      <div className="blocks-preview">
        {blocks.length === 0 ? (
          <div className="empty-editor">
            <p>No blocks loaded</p>
            <small>Load a page from the top menu to begin</small>
          </div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className={`preview-block ${selectedBlockId === block.id ? 'selected' : ''}`}
              onClick={() => onSelectBlock(block.id)}
            >
              <div className="block-type-tag">{block.type}</div>
              <div className="block-content">
                {block.type === 'heading' && (
                  <div className="heading-preview">
                    <span className="heading-level">{block.content.level}</span>
                    {getPreviewText(block)}
                  </div>
                )}
                {block.type === 'text' && (
                  <p className="text-preview">{getPreviewText(block)}</p>
                )}
                {block.type === 'subway' && (
                  <div className="subway-preview">
                    <strong>{getPreviewText(block)}</strong>
                    <ul className="subway-items">
                      {block.content.items?.slice(0, 3).map((item, i) => (
                        <li key={i}>{item.label}</li>
                      )) || <li>No items</li>}
                      {block.content.items?.length > 3 && (
                        <li>... +{block.content.items.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                {block.type === 'alert' && (
                  <div className="alert-preview">
                    ⚠️ {getPreviewText(block)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
