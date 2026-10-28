import React from 'react';

export default function PropertyPanel({ block, onChange, onDelete }) {
  if (!block) return null;

  return (
    <div className="property-panel">
      <h3>Edit {block.type}</h3>

      {/* Heading level */}
      {block.type === 'heading' && (
        <div className="form-group">
          <label>Level</label>
          <select
            value={block.content.level || 'h2'}
            onChange={(e) => onChange({
              ...block,
              content: { ...block.content, level: e.target.value }
            })}
          >
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
          </select>
        </div>
      )}

      {/* Text content */}
      {(block.type === 'text' || block.type === 'heading' || block.type === 'alert') && (
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={block.content.text || ''}
            onChange={(e) => onChange({
              ...block,
              content: { ...block.content, text: e.target.value }
            })}
            rows="6"
          />
        </div>
      )}

      {/* Subway title */}
      {block.type === 'subway' && (
        <>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={block.content.title || ''}
              onChange={(e) => onChange({
                ...block,
                content: { ...block.content, title: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Items ({block.content.items?.length || 0})</label>
            <div className="items-list">
              {block.content.items?.map((item, idx) => (
                <div key={idx} className="item">
                  <small>{item.label}</small>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      const newItems = block.content.items.filter((_, i) => i !== idx);
                      onChange({
                        ...block,
                        content: { ...block.content, items: newItems }
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CSS Classes */}
      <div className="form-group">
        <label>CSS Classes</label>
        <input
          type="text"
          value={block.content.classes || ''}
          onChange={(e) => onChange({
            ...block,
            content: { ...block.content, classes: e.target.value }
          })}
          placeholder="e.g., mrgn-tp-lg"
        />
      </div>

      {/* Delete */}
      <button className="btn-delete" onClick={onDelete}>Delete Block</button>
    </div>
  );
}
