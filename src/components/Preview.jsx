import React, { useEffect, useRef } from 'react';
import { renderHTML } from '../utils/htmlRenderer';

export default function Preview({ blocks, selectedBlockId, onSelectBlock }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = renderHTML(blocks);
    
    // Minimal HTML - let WET CSS do the work
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  
  <!-- WET Framework - load from Canada.ca CDN -->
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
  
  <style>
    /* Only add editor-specific highlighting, let WET handle the rest */
    [data-block-id] {
      cursor: pointer;
      transition: outline 0.2s;
      outline: 2px dashed rgba(0, 102, 204, 0.3);
      outline-offset: 2px;
    }
    
    [data-block-id]:hover {
      outline: 2px solid #0066cc;
      background-color: rgba(0, 102, 204, 0.02);
    }
    
    [data-block-selected] {
      outline: 2px solid #0066cc !important;
      background-color: rgba(0, 102, 204, 0.08) !important;
    }
  </style>
</head>
<body>
  <main class="container">
    ${html}
  </main>
  
  <!-- WET JS -->
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/js/wet-boew.min.js" defer><\/script>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/js/theme.min.js" defer><\/script>
  
  <script>
    // Block selection via postMessage
    document.querySelectorAll('[data-block-id]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        window.parent.postMessage({ 
          type: 'selectBlock', 
          blockId: this.getAttribute('data-block-id')
        }, '*');
      });
    });
  </script>
</body>
</html>`;

    const doc = iframeRef.current.contentDocument;
    doc.open();
    doc.write(fullHTML);
    doc.close();

    const handleMessage = (e) => {
      if (e.data.type === 'selectBlock') {
        onSelectBlock(e.data.blockId);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);

  }, [blocks, selectedBlockId, onSelectBlock]);

  return (
    <div className="preview-wrapper">
      <iframe 
        ref={iframeRef} 
        title="Page Preview" 
        className="preview-iframe"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}
