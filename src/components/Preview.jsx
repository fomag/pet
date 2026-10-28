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
  
  <!-- WET CSS with absolute URLs -->
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css" crossorigin="anonymous">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css" crossorigin="anonymous">
  
  <style>
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    html { 
      font-size: 16px; 
    }
    
    body { 
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 20px;
    }
    
    main { 
      max-width: 1200px; 
      margin: 0 auto; 
    }
    
    .container { 
      max-width: 1200px; 
      margin: 0 auto; 
    }
    
    /* Block selection highlighting */
    [data-block-id] { 
      position: relative;
      cursor: pointer;
      transition: outline 0.2s;
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
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      margin: 20px 0 15px 0;
      font-weight: 600;
      line-height: 1.3;
    }
    
    h1 { font-size: 32px; font-weight: 700; }
    h2 { font-size: 24px; font-weight: 700; }
    h3 { font-size: 20px; font-weight: 600; }
    h4 { font-size: 18px; font-weight: 600; }
    
    p { margin: 15px 0; line-height: 1.6; }
    ul, ol { margin: 15px 0 15px 40px; }
    li { margin: 8px 0; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    
    /* gc-thickline - Canada.ca red line under h1 */
    .gc-thickline {
      border-bottom: 4px solid #af3025 !important;
      padding-bottom: 0.5em !important;
      margin-bottom: 15px !important;
    }
    
    /* Subway Navigation */
    nav.provisional.gc-subway,
    nav.gc-subway {
      background: #f5f5f5;
      border: 1px solid #d3d3d3;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
      display: block !important;
      page-break-inside: avoid;
    }
    
    nav.provisional.gc-subway h2,
    nav.gc-subway h2 {
      margin-top: 0 !important;
      margin-bottom: 20px !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      border-bottom: 2px solid #0066cc !important;
      padding-bottom: 12px !important;
      color: #333 !important;
    }
    
    nav.provisional.gc-subway dl,
    nav.gc-subway dl {
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
    }
    
    nav.provisional.gc-subway dt,
    nav.gc-subway dt {
      margin-top: 15px !important;
      margin-bottom: 8px !important;
      display: block !important;
      font-weight: 700 !important;
    }
    
    nav.provisional.gc-subway dt a,
    nav.gc-subway dt a {
      color: #0066cc !important;
      font-weight: 700 !important;
      text-decoration: none !important;
      display: block !important;
      padding: 12px 0 !important;
      border-bottom: 1px solid #e0e0e0 !important;
      font-size: 15px !important;
    }
    
    nav.provisional.gc-subway dt a:hover,
    nav.gc-subway dt a:hover {
      text-decoration: underline !important;
      background: rgba(0, 102, 204, 0.05) !important;
      padding-left: 8px !important;
    }
    
    nav.provisional.gc-subway dt a.active,
    nav.gc-subway dt a.active {
      background: #e8f1f9 !important;
      border-left: 4px solid #0066cc !important;
      padding-left: 8px !important;
    }
    
    nav.provisional.gc-subway dd,
    nav.gc-subway dd {
      margin: 0 0 20px 0 !important;
      padding: 0 !important;
      color: #666 !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      font-weight: normal !important;
    }
    
    /* Pager Navigation */
    nav.pager,
    .pager {
      margin-top: 40px !important;
      padding-top: 30px !important;
      border-top: 2px solid #ddd !important;
      display: block !important;
    }
    
    nav.pager ul,
    .pager ul {
      list-style: none !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      gap: 15px !important;
      flex-wrap: wrap !important;
    }
    
    nav.pager li,
    .pager li {
      margin: 0 !important;
      display: block !important;
    }
    
    nav.pager li a,
    .pager li a {
      display: inline-block !important;
      padding: 12px 20px !important;
      background: #0066cc !important;
      color: white !important;
      text-decoration: none !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      border: none !important;
      cursor: pointer !important;
    }
    
    nav.pager li a:hover,
    .pager li a:hover {
      background: #0052a3 !important;
      text-decoration: none !important;
    }
    
    nav.pager li.previous a,
    .pager li.previous a {
      background: #999 !important;
    }
    
    nav.pager li.previous a:hover,
    .pager li.previous a:hover {
      background: #777 !important;
    }
    
    /* Alert */
    .alert {
      padding: 15px 20px !important;
      margin: 15px 0 !important;
      border-left: 4px solid !important;
      border-radius: 4px !important;
      display: block !important;
    }
    
    .alert-info {
      background: #e3f2fd !important;
      border-color: #2196f3 !important;
      color: #1565c0 !important;
    }
    
    .alert h2, 
    .alert h3 {
      margin-top: 0 !important;
      margin-bottom: 10px !important;
    }
    
    .wb-inv {
      position: absolute !important;
      clip: rect(1px, 1px, 1px, 1px) !important;
      width: 1px !important;
      height: 1px !important;
      overflow: hidden !important;
    }
  </style>
</head>
<body>
  <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
    ${html}
  </main>
  
  <!-- WET JS -->
  <script>
    window.wb = window.wb || {};
    window.wb.ready = Promise.resolve();
  </script>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/js/wet-boew.min.js" defer><\/script>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/js/theme.min.js" defer><\/script>
  
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
