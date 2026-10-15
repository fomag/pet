import React from 'react';

export default function PropertyPanel({ block, onChange, onDelete }) {
  return (
    <div className="property-panel">
      <h3>Edit {block.type}</h3>

      {/* Text content */}
      {(block.type === 'text' || block.type === 'heading') && (
        <div className="form-group">
          <label>Text</label>
          <textarea
            value={block.content.text || ''}
            onChange={(e) => onChange({
              ...block,
              content: { ...block.content, text: e.target.value }
            })}
            rows="4"
          />
        </div>
      )}

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
          </select>
        </div>
      )}

      {/* Link for nav items */}
      {block.type === 'subway' && (
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
      )}

      {/* Classes/styling */}
      <div className="form-group">
        <label>CSS Classes</label>
        <input
          type="text"
          value={block.content.classes || ''}
          onChange={(e) => onChange({
            ...block,
            content: { ...block.content, classes: e.target.value }
          })}
          placeholder="e.g., mrgn-tp-lg mrgn-bttm-lg"
        />
      </div>

      {/* Delete */}
      <button className="btn-delete" onClick={onDelete}>Delete Block</button>
    </div>
  );
}
