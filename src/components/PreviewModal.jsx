import React, { useEffect, useRef } from 'react';
import { renderHTML } from '../utils/htmlRenderer';

export default function PreviewModal({ blocks, onClose }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = renderHTML(blocks);
    
    // Use inline styles as fallback since CDN might have CORS issues
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Page Preview</title>
  
  <!-- Try to load WET CSS - may fail due to CORS -->
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-size: 16px; }
    body { 
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 20px;
    }
    main { max-width: 1200px; margin: 0 auto; }
    .container { max-width: 1200px; margin: 0 auto; }
    
    /* Headings */
    h1, h2, h3, h4, h5, h6 { margin: 20px 0 15px 0; font-weight: 600; }
    h1 { font-size: 32px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    h4 { font-size: 18px; }
    h5 { font-size: 16px; }
    h6 { font-size: 14px; }
    
    /* gc-thickline style */
    .gc-thickline {
      border-bottom: 4px solid #af3025;
      padding-bottom: 0.5em;
    }
    
    /* Text */
    p { margin: 15px 0; }
    a { color: #0066cc; text-decoration: underline; }
    a:hover { color: #0052a3; }
    
    /* Lists */
    ul, ol { margin: 15px 0 15px 40px; }
    li { margin: 8px 0; }
    
    /* Subway Navigation */
    .provisional.gc-subway {
      border: 1px solid #ddd;
      background: #f5f5f5;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .provisional.gc-subway h2 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 10px;
    }
    
    .provisional.gc-subway dl {
      margin: 0;
      padding: 0;
    }
    
    .provisional.gc-subway dt {
      margin-top: 12px;
      margin-bottom: 5px;
    }
    
    .provisional.gc-subway dt a {
      color: #0066cc;
      text-decoration: none;
      font-weight: bold;
      display: block;
      padding: 8px 0;
    }
    
    .provisional.gc-subway dt a:hover {
      text-decoration: underline;
      background: #f0f0f0;
      padding-left: 5px;
    }
    
    .provisional.gc-subway dd {
      margin: 0 0 12px 0;
      padding: 0;
      color: #666;
      font-size: 14px;
    }
    
    /* Alerts */
    .alert {
      padding: 15px 20px;
      margin: 15px 0;
      border-left: 4px solid;
      border-radius: 4px;
    }
    
    .alert-info {
      background: #e3f2fd;
      border-color: #2196f3;
      color: #1565c0;
    }
    
    .alert-warning {
      background: #fff3cd;
      border-color: #ffc107;
      color: #856404;
    }
    
    .alert-danger {
      background: #f8d7da;
      border-color: #dc3545;
      color: #721c24;
    }
    
    .alert h2, .alert h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    /* Pager */
    .pager {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    
    .pager ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 20px;
    }
    
    .pager li a {
      padding: 10px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      display: inline-block;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .pager li a:hover {
      background: #f5f5f5;
      border-color: #0066cc;
    }
    
    .pager li.next a {
      background: #0066cc;
      color: white;
      border-color: #0066cc;
    }
    
    .pager li.next a:hover {
      background: #0052a3;
      border-color: #0052a3;
    }
  </style>
</head>
<body>
  <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
    ${html}
  </main>
  
  <!-- Load WET JS (may fail, but fallback styles will work) -->
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/js/wet-boew.min.js"><\/script>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/js/theme.min.js"><\/script>
</body>
</html>`;

    try {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(fullHTML);
        doc.close();
      }
    } catch (e) {
      console.error('Error writing to iframe:', e);
    }
  }, [blocks]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Preview with Styles</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <iframe 
          ref={iframeRef}
          title="Page Preview"
          className="preview-iframe-modal"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
