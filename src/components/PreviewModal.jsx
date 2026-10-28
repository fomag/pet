import React, { useEffect, useRef } from 'react';
import { renderHTML } from '../utils/htmlRenderer';

export default function PreviewModal({ blocks, onClose }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = renderHTML(blocks);
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
  <title>Page Preview</title>
  <style>
    body { margin: 0; padding: 20px; }
    main { max-width: 1200px; margin: 0 auto; }
  </style>
</head>
<body>
  <main class="container">
    ${html}
  </main>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/js/wet-boew.min.js"><\/script>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/js/theme.min.js"><\/script>
</body>
</html>`;

    const doc = iframeRef.current.contentDocument;
    doc.open();
    doc.write(fullHTML);
    doc.close();
  }, [blocks]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Preview with WET Styles</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <iframe 
          ref={iframeRef}
          title="WET Preview"
          className="preview-iframe-modal"
        />
      </div>
    </div>
  );
}
