import React, { useEffect, useRef } from 'react';
import { renderHTML } from '../utils/htmlRenderer';

export default function Preview({ blocks, selectedBlockId, onSelectBlock }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = renderHTML(blocks);
    
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Page Preview</title>
  
  <!-- WET CSS -->
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
  
  <style>
    * { box-sizing: border-box; }
    html { font-size: 16px; }
    body { 
      margin: 0;
      padding: 20px;
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      background: white;
      color: #333;
    }
    main { max-width: 1200px; margin: 0 auto; }
    .container { max-width: 1200px; margin: 0 auto; }
    
    /* Block selection highlighting */
    [data-block-id] { 
      position: relative;
      cursor: pointer;
      transition: all 0.2s;
      outline: 2px dashed rgba(0, 102, 204, 0.3);
      outline-offset: 2px;
    }
    
    [data-block-id]:hover { 
      outline: 2px solid #0066cc;
      outline-offset: 2px;
      background-color: rgba(0, 102, 204, 0.02);
    }
    
    [data-block-selected] { 
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
      background-color: rgba(0, 102, 204, 0.08) !important;
      box-shadow: inset 0 0 0 1px rgba(0, 102, 204, 0.2);
    }
    
    /* Ensure WET styles apply */
    .gc-thickline {
      border-bottom: 4px solid #af3025 !important;
      padding-bottom: 0.5em;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin: 20px 0 15px 0;
      font-weight: 600;
    }
    
    h1 { font-size: 32px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    
    p { margin: 15px 0; line-height: 1.6; }
    ul, ol { margin: 15px 0 15px 40px; }
    li { margin: 8px 0; }
    a { color: #0066cc; }
    a:hover { text-decoration: underline; }
    
    /* Subway Navigation Fallback */
    nav.gc-subway {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    nav.gc-subway h2 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 10px;
    }
    
    nav.gc-subway dl {
      margin: 0;
      padding: 0;
    }
    
    nav.gc-subway dt {
      margin-top: 12px;
      margin-bottom: 5px;
    }
    
    nav.gc-subway dt a {
      color: #0066cc;
      font-weight: bold;
      text-decoration: none;
      display: block;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    nav.gc-subway dt a:hover {
      text-decoration: underline;
      background: rgba(0, 102, 204, 0.05);
      padding-left: 5px;
    }
    
    nav.gc-subway dd {
      margin: 0 0 15px 0;
      padding: 0;
      color: #666;
      font-size: 14px;
    }
    
    /* Alert Fallback */
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
    }
    
    .pager li {
      margin: 10px 0;
    }
    
    .pager li a {
      display: inline-block;
      padding: 10px 16px;
      background: #0066cc;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    
    .pager li a:hover {
      background: #0052a3;
    }
  </style>
</head>
<body>
  <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
    ${html}
  </main>
  
  <!-- WET JS -->
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/js/wet-boew.min.js"><\/script>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/js/theme.min.js"><\/script>
  
  <script>
    // Handle clicks on blocks for selection
    document.querySelectorAll('[data-block-id]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        const blockId = this.getAttribute('data-block-id');
        window.parent.postMessage({ 
          type: 'selectBlock', 
          blockId: blockId 
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

    // Listen for block selection from iframe
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
