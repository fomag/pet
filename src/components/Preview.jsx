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
  
  <!-- WET CSS - attempt to load -->
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
  
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
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      margin: 20px 0 15px 0;
      font-weight: 600;
      line-height: 1.3;
    }
    
    h1 { 
      font-size: 32px; 
      font-weight: 700;
    }
    
    h2 { 
      font-size: 24px; 
      font-weight: 700;
    }
    
    h3 { 
      font-size: 20px; 
      font-weight: 600;
    }
    
    h4 { 
      font-size: 18px; 
      font-weight: 600;
    }
    
    p { 
      margin: 15px 0; 
      line-height: 1.6;
    }
    
    ul, ol { 
      margin: 15px 0 15px 40px; 
    }
    
    li { 
      margin: 8px 0; 
    }
    
    a { 
      color: #0066cc; 
      text-decoration: none;
    }
    
    a:hover { 
      text-decoration: underline; 
    }
    
    /* WET gc-thickline */
    .gc-thickline {
      border-bottom: 4px solid #af3025 !important;
      padding-bottom: 0.5em;
      margin-bottom: 15px;
    }
    
    /* Subway Navigation - CRITICAL STYLING */
    nav.provisional.gc-subway,
    nav.gc-subway {
      background: #f5f5f5;
      border: 1px solid #d3d3d3;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
      display: block !important;
    }
    
    nav.provisional.gc-subway h2,
    nav.gc-subway h2 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 700;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 12px;
      color: #333;
    }
    
    nav.provisional.gc-subway dl,
    nav.gc-subway dl {
      margin: 0;
      padding: 0;
      display: block;
    }
    
    nav.provisional.gc-subway dt,
    nav.gc-subway dt {
      margin-top: 15px;
      margin-bottom: 8px;
      display: block;
    }
    
    nav.provisional.gc-subway dt a,
    nav.gc-subway dt a {
      color: #0066cc;
      font-weight: 700;
      text-decoration: none;
      display: block;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
      font-size: 15px;
    }
    
    nav.provisional.gc-subway dt a:hover,
    nav.gc-subway dt a:hover {
      text-decoration: underline;
      background: rgba(0, 102, 204, 0.05);
      padding-left: 8px;
    }
    
    nav.provisional.gc-subway dt a.active,
    nav.gc-subway dt a.active {
      background: #e8f1f9;
      border-left: 4px solid #0066cc;
      padding-left: 8px;
    }
    
    nav.provisional.gc-subway dd,
    nav.gc-subway dd {
      margin: 0 0 20px 0;
      padding: 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }
    
    /* Pager/Navigation Buttons */
    nav.pager,
    .pager {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #ddd;
      display: block;
    }
    
    nav.pager ul,
    .pager ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    nav.pager li,
    .pager li {
      margin: 0;
      display: block;
    }
    
    nav.pager li a,
    .pager li a {
      display: inline-block;
      padding: 12px 20px;
      background: #0066cc;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    nav.pager li a:hover,
    .pager li a:hover {
      background: #0052a3;
      text-decoration: none;
    }
    
    nav.pager li.previous a,
    .pager li.previous a {
      background: #999;
    }
    
    nav.pager li.previous a:hover,
    .pager li.previous a:hover {
      background: #777;
    }
    
    nav.pager li.next a,
    .pager li.next a {
      background: #0066cc;
    }
    
    nav.pager li.next a:hover,
    .pager li.next a:hover {
      background: #0052a3;
    }
    
    /* Alert styling */
    .alert {
      padding: 15px 20px;
      margin: 15px 0;
      border-left: 4px solid;
      border-radius: 4px;
      display: block;
    }
    
    .alert-info {
      background: #e3f2fd;
      border-color: #2196f3;
      color: #1565c0;
    }
    
    .alert h2, 
    .alert h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    /* Visibility classes */
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
        sandbox="allow-scripts"
      />
    </div>
  );
}
