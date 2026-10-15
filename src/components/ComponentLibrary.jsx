import React from 'react';

const COMPONENTS = [
  { slug: 'heading', name: 'Heading', icon: '📝' },
  { slug: 'text', name: 'Text Block', icon: '¶' },
  { slug: 'subway', name: 'Subway Navigation', icon: '🗺️' },
  { slug: 'alert', name: 'Alert', icon: '⚠️' },
  { slug: 'accordion', name: 'Accordion', icon: '📋' },
  { slug: 'button', name: 'Button', icon: '🔘' },
];

export default function ComponentLibrary({ onInsert }) {
  const handleDragStart = (e, componentSlug) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentSlug', componentSlug);
  };

  return (
    <div className="component-library">
      <h3>Components</h3>
      <div className="component-list">
        {COMPONENTS.map(comp => (
          <div
            key={comp.slug}
            className="component-item"
            draggable
            onDragStart={(e) => handleDragStart(e, comp.slug)}
            onClick={() => onInsert(comp.slug)}
            title="Drag to insert, or click"
          >
            <span className="icon">{comp.icon}</span>
            <span className="name">{comp.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
