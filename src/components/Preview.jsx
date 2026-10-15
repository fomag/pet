import React, { useEffect, useRef } from 'react';
import { renderHTML } from '../utils/htmlRenderer';

export default function Preview({ blocks, selectedBlockId, onSelectBlock }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = renderHTML(blocks);
    const doc = iframeRef.current.contentDocument;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
        <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          [data-block-selected] { outline: 3px solid #0066cc; padding: 8px; cursor: pointer; }
          [data-block-id] { cursor: pointer; }
          [data-block-id]:hover { background-color: rgba(0, 102, 204, 0.05); }
        </style>
      </head>
      <body>
        <main>
          ${html}
        </main>
      </body>
      </html>
    `);
    doc.close();

    // Add click handlers to blocks in iframe
    const elements = doc.querySelectorAll('[data-block-id]');
    elements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const blockId = el.dataset.blockId;
        onSelectBlock(blockId);
      });
    });

  }, [blocks, selectedBlockId]);

  return (
    <div className="preview-wrapper">
      <iframe ref={iframeRef} title="Page Preview" className="preview-iframe" />
    </div>
  );
}
